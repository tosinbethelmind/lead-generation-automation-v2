// src/app/api/paystack/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getActiveLeadRepository, addLog, updateLeadFields } from '@/lib/googleSheets';
import { getRuntimeConfig } from '@/lib/localConfig';
import { sendPaymentConfirmation, sendNotificationEmail } from '@/lib/email';
import fs from 'fs';
import path from 'path';

// Helper to commit to GitHub for webhooks
async function commitFileToGitHub({
  owner,
  repo,
  filePath,
  content,
  commitMessage,
  token,
  branch = 'main'
}: {
  owner: string;
  repo: string;
  filePath: string;
  content: string;
  commitMessage: string;
  token: string;
  branch?: string;
}) {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
  let sha: string | undefined;
  
  try {
    const checkResp = await fetch(`${url}?ref=${branch}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });
    if (checkResp.ok) {
      const fileData = await checkResp.json();
      sha = fileData.sha;
    }
  } catch (err) {
    console.warn('[Webhook] Check file on GitHub failed (might be new):', err);
  }

  const base64Content = Buffer.from(content).toString('base64');
  const body: any = {
    message: commitMessage,
    content: base64Content,
    branch,
  };
  if (sha) {
    body.sha = sha;
  }

  const putResp = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!putResp.ok) {
    const errData = await putResp.json();
    throw new Error(`GitHub Commit error: ${errData.message || putResp.statusText}`);
  }
}

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get('x-paystack-signature');
    if (!signature) {
      return NextResponse.json({ error: 'Missing Paystack signature header' }, { status: 401 });
    }

    const config = getRuntimeConfig();
    const secretKeys = (config.paystackSecretKey || '').split(',').map(k => k.trim()).filter(Boolean);
    if (secretKeys.length === 0) {
      return NextResponse.json({ error: 'Paystack Secret Key is not configured' }, { status: 500 });
    }

    const rawBody = await req.text();
    let signatureValid = false;

    for (const key of secretKeys) {
      const expectedSignature = crypto
        .createHmac('sha512', key)
        .update(rawBody)
        .digest('hex');

      if (signature === expectedSignature) {
        signatureValid = true;
        break;
      }
    }

    if (!signatureValid) {
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
    }

    const event = JSON.parse(rawBody);

    // We specifically listen to the charge.success event
    if (event.event === 'charge.success') {
      const transaction = event.data;
      if (transaction.status === 'success') {
        const { leadId, clientName, clientEmail, theme, copy, selectedFeatures, customInstructions, upgradeStrategy } = transaction.metadata || {};
        const reference = transaction.reference;
        const amountPaid = transaction.amount / 100;

        if (!leadId || !clientEmail || !clientName) {
          return NextResponse.json({ error: 'Webhook received success, but metadata is missing' }, { status: 400 });
        }

        const repo = getActiveLeadRepository();
        const lead = await repo.getLeadById(leadId);

        if (!lead) {
          return NextResponse.json({ error: `Lead with ID ${leadId} not found` }, { status: 404 });
        }

        const { parseScalingConfig } = require('@/lib/scalingHelper');
        let scaling;
        try {
          scaling = parseScalingConfig(lead.notes);
        } catch (parseErr) {
          scaling = { mode: 'none' };
        }

        // 1. Process claim and update CRM lead status
        const timestamp = new Date().toISOString();
        const gitPendingTag = scaling.mode === 'git-batch' ? ' [GIT_SYNC_PENDING: true]' : '';
        const featuresNote = selectedFeatures && selectedFeatures.length > 0 ? ` Activated Features: ${selectedFeatures.join(', ')}.` : '';
        const instNote = customInstructions ? ` Custom Instructions: "${customInstructions}"` : '';
        const strategyNote = upgradeStrategy ? ` Strategy: ${upgradeStrategy}.` : '';
        const newNotes = `${lead.notes || ''}\n[CLAIMED - PAID WEBHOOK]${gitPendingTag} Claimed via webhook. Paid Setup Fee (₦${amountPaid.toLocaleString()}). Ref: ${reference}. Contact: ${clientName} (${clientEmail}).${strategyNote}${featuresNote}${instNote}`;
        await repo.updateLeadStatus(leadId, 'CONTACTED', newNotes, timestamp);

        // Also save the updated fields to sheets/Supabase
        try {
          await updateLeadFields(leadId, {
            upgrade_strategy: upgradeStrategy || lead.upgradeStrategy || 'script_embed',
            upgradeStrategy: upgradeStrategy || lead.upgradeStrategy || 'script_embed',
            plugin_suggestions: selectedFeatures || [],
            pluginSuggestions: selectedFeatures || []
          });
        } catch (fieldErr: any) {
          console.warn('Failed to update lead upgrade strategy fields during webhook payment processing:', fieldErr.message);
        }

        // 2. Log event
        await addLog(
          'Paystack Webhook Success',
          'SUCCESS',
          `Lead "${lead.name}" claimed & paid NGN ${amountPaid.toLocaleString()} (Ref: ${reference})`
        );

        // 3. Assemble claimed website configuration
        const siteConfig = {
          lead,
          theme: theme || {
            primary: '#1e3a8a',
            accent: '#60a5fa',
            bg: '#eff6ff',
            text: '#1e3a8a',
            font: 'Outfit',
            heroImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=80',
            gradient: 'linear-gradient(135deg, #1e3a8a 0%, #60a5fa 100%)',
          },
          copy: copy || {
            heroTitle: `${lead.name} — Trusted Local Service`,
            heroSubtitle: `Proudly serving ${lead.area} and surrounds with top-tier expertise.`,
            services: [],
            aboutText: `${lead.name} is a top-rated local business specializing in professional services.`,
            testimonials: [],
            ctaText: 'Book an Appointment',
          },
          selectedFeatures: selectedFeatures || [],
          customInstructions: customInstructions || '',
          claimedAt: timestamp,
          clientName,
          clientEmail,
          payment: {
            gateway: 'paystack',
            reference,
            amount: amountPaid,
            paidAt: transaction.paid_at
          }
        };

        const siteConfigString = JSON.stringify(siteConfig, null, 2);

        // 4. Save locally
        try {
          let workerIndex = '';
          try {
            workerIndex = req.headers.get('x-test-worker-index') || '';
          } catch (e) {}
          if (!workerIndex) {
            workerIndex = process.env.TEST_WORKER_INDEX || '';
          }
          const dataDir = path.join(process.cwd(), 'src', 'data', 'sites');
          if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
          }
          const baseName = workerIndex ? `${leadId}.worker-${workerIndex}.json` : `${leadId}.json`;
          const filePath = path.join(dataDir, baseName);
          const { writeJsonFileSyncAtomic } = require('@/lib/atomicIo');
          writeJsonFileSyncAtomic(filePath, siteConfig);
        } catch (fsErr: any) {
          console.warn('[Webhook] Failed to write claimed site config to local filesystem:', fsErr.message);
        }

        // 5. Commit to GitHub (for Vercel deployment update - ONLY if mode is 'git')
        const githubPat = process.env.GITHUB_PAT;
        const githubRepo = process.env.GITHUB_REPO;
        const githubBranch = process.env.GITHUB_BRANCH || 'main';

        if (scaling.mode === 'git' && githubPat && githubRepo) {
          try {
            const parts = githubRepo.split('/');
            if (parts.length === 2) {
              const [owner, repoName] = parts;
              await commitFileToGitHub({
                owner,
                repo: repoName,
                filePath: `src/data/sites/${leadId}.json`,
                content: siteConfigString,
                commitMessage: `feat: deploy claimed website for ${lead.name} (${leadId}) via webhook`,
                token: githubPat,
                branch: githubBranch
              });
            }
          } catch (ghErr: any) {
            console.error('[Webhook] GitHub Commit Failed:', ghErr);
          }
        }

        // 6. Send payment confirmation email to client
        try {
          await sendPaymentConfirmation(clientEmail, clientName, lead.name, amountPaid, reference);
        } catch (mailErr: any) {
          console.warn('[Webhook] Failed to send payment confirmation email:', mailErr.message);
        }

        // 7. Send notification to admin (Only if not in git-batch mode to prevent resource/SMTP exhaustion)
        const adminEmail = config.googleUserEmail || config.resendFromEmail || config.brevoSenderEmail;
        if (scaling.mode !== 'git-batch' && adminEmail) {
          const adminSubject = `🎉 Webhook Claim Confirmation: ${lead.name}`;
          const adminBody = `Hi Admin,

This is to confirm that the lead claim webhook was successfully processed.

Details:
- Business Name: ${lead.name}
- Lead ID: ${leadId}
- Client Name: ${clientName}
- Client Email: ${clientEmail}
- Amount Paid: ₦${amountPaid.toLocaleString()}
- Paystack Ref: ${reference}

Best regards,
Bethelmind Analytics & Strategy Lead Engine`;

          try {
            await sendNotificationEmail(adminEmail, adminSubject, adminBody);
          } catch (adminMailErr: any) {
            console.warn('[Webhook] Failed to send admin alert email:', adminMailErr.message);
          }
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('[Webhook] Error processing webhook:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
