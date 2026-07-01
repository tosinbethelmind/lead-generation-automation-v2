/**
 * GET /api/opay/verify
 *
 * Verifies an OPay transaction reference, updates lead status, writes site config,
 * optionally commits to GitHub for Vercel deployments, and sends an admin notification.
 */
import { NextRequest, NextResponse } from 'next/server';
import { getActiveLeadRepository, addLog } from '@/lib/googleSheets';
import { getRuntimeConfig, saveLocalConfig, rotateKey } from '@/lib/localConfig';
import fs from 'fs';
import path from 'path';

// ============================================================================
// Google OAuth Token Refresher
// ============================================================================

async function getValidAccessToken(config: any): Promise<string> {
  const now = Date.now();
  const bufferMs = 5 * 60 * 1000;

  if (config.googleAccessToken && config.googleTokenExpiry && config.googleTokenExpiry - bufferMs > now) {
    return config.googleAccessToken;
  }

  if (!config.googleRefreshToken || !config.googleClientId || !config.googleClientSecret) {
    throw new Error('Google session expired. Please sign in again in the console.');
  }

  const resp = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: config.googleClientId,
      client_secret: config.googleClientSecret,
      refresh_token: config.googleRefreshToken,
      grant_type: 'refresh_token',
    }),
  });

  const data = await resp.json();
  if (!resp.ok || !data.access_token) {
    throw new Error('Google refresh token validation failed. Please sign in again.');
  }

  saveLocalConfig({
    googleAccessToken: data.access_token,
    googleTokenExpiry: Date.now() + (data.expires_in || 3600) * 1000,
  });

  return data.access_token;
}

// ============================================================================
// Email Sender Helpers
// ============================================================================

async function sendGmailMessage(to: string, subject: string, body: string, accessToken: string) {
  const rawMessage = [
    `To: ${to}`,
    `Subject: ${subject}`,
    'Content-Type: text/plain; charset="UTF-8"',
    'MIME-Version: 1.0',
    '',
    body
  ].join('\r\n');

  const encodedMail = Buffer.from(rawMessage)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const url = 'https://gmail.googleapis.com/gmail/v1/users/me/messages/send';
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw: encodedMail }),
  });

  if (!resp.ok) {
    const err = await resp.json();
    throw new Error(err.error?.message || resp.statusText);
  }
}

async function sendResendMessage(to: string, subject: string, body: string, config: any) {
  const activeKey = rotateKey(config.resendApiKey);
  if (!activeKey) {
    throw new Error('Resend API Key is not configured.');
  }
  const from = config.resendFromEmail || 'onboarding@resend.dev';
  
  const resp = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${activeKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      text: body,
    }),
  });

  const data = await resp.json();
  if (!resp.ok) {
    throw new Error(data.message || resp.statusText);
  }
}

async function sendBrevoMessage(to: string, subject: string, body: string, config: any) {
  const activeKey = rotateKey(config.brevoApiKey);
  if (!activeKey) {
    throw new Error('Brevo API Key is not configured.');
  }
  const senderName = config.brevoSenderName || 'ApexReach';
  const senderEmail = config.brevoSenderEmail;
  if (!senderEmail) {
    throw new Error('Brevo Sender Email is not configured.');
  }

  const resp = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': activeKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: senderName, email: senderEmail },
      to: [{ email: to }],
      subject,
      textContent: body,
    }),
  });

  if (!resp.ok) {
    const data = await resp.json();
    throw new Error(data.message || resp.statusText);
  }
}

// ============================================================================
// GitHub Commit Helper
// ============================================================================

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
    console.warn('Checking file existence on GitHub failed or file is new:', err);
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

  return await putResp.json();
}

// ============================================================================
// Next.js Verification Route
// ============================================================================

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const reference = searchParams.get('reference');
    const leadId = searchParams.get('leadId');

    if (!reference) {
      return NextResponse.json({ error: 'Missing payment reference parameter' }, { status: 400 });
    }

    const config = getRuntimeConfig();

    // Centralised environment validation
    const emailProvider = config.emailProvider || 'gmail';
    const requiredEnv = [];
    if (emailProvider === 'gmail') {
      requiredEnv.push('GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_REFRESH_TOKEN', 'GOOGLE_USER_EMAIL');
    } else if (emailProvider === 'resend') {
      requiredEnv.push('RESEND_API_KEY');
    } else if (emailProvider === 'brevo') {
      requiredEnv.push('BREVO_API_KEY', 'BREVO_SENDER_EMAIL');
    }
    const missingEnv = requiredEnv.filter(e => !process.env[e]);
    if (missingEnv.length) {
      console.warn('Missing environment variables:', missingEnv);
      return NextResponse.json({ error: `Missing required env vars: ${missingEnv.join(', ')}` }, { status: 500 });
    }

    let transaction = null;
    let verifyError = null;

    // Check if reference is mock or if secret keys are missing/mock
    const isMockRef = reference.startsWith('OPAY-MOCK') || reference.startsWith('MOCK');
    const opaySecret = process.env.OPAY_SECRET_KEY || '';
    const secretKeys = opaySecret.split(',').map(k => k.trim()).filter(Boolean);

    if (isMockRef || secretKeys.length === 0 || secretKeys[0] === 'mock') {
      console.log('Simulating OPay verification in development/mock mode');
      transaction = {
        status: 'success',
        reference,
        amount: (config.claimFeeNGN || 5000) * 100,
        paid_at: new Date().toISOString(),
        metadata: {
          leadId: leadId || 'mock-lead-id',
          clientName: 'Demo Client',
          clientEmail: 'client@example.com'
        }
      };
    } else {
      // Try verifying with OPay API status check using rotated keys
      for (const key of secretKeys) {
        try {
          const verifyResp = await fetch(`https://api.opaycheckout.com/api/v1/international/cashier/status`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${key}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ reference })
          });
          const verifyData = await verifyResp.json();
          if (verifyResp.ok && verifyData.code === '00000' && verifyData.data && verifyData.data.status === 'SUCCESS') {
            transaction = {
              status: 'success',
              reference,
              amount: Number(verifyData.data.amount || 0),
              paid_at: verifyData.data.paidAt || new Date().toISOString(),
              metadata: verifyData.data.metadata || {}
            };
            break;
          } else {
            verifyError = verifyData.message || 'OPay verification failed';
          }
        } catch (err: any) {
          verifyError = err.message;
        }
      }
    }

    if (!transaction) {
      return NextResponse.json({ error: verifyError || 'OPay transaction verification failed or not successful' }, { status: 400 });
    }

    // Extract metadata from the transaction
    const resolvedLeadId = transaction.metadata?.leadId || leadId;
    const clientName = transaction.metadata?.clientName || 'Valued Partner';
    const clientEmail = transaction.metadata?.clientEmail || config.googleUserEmail || '';

    if (!resolvedLeadId) {
      return NextResponse.json({ error: 'Transaction verified, but no leadId metadata was resolved.' }, { status: 400 });
    }

    const repo = getActiveLeadRepository();
    const lead = await repo.getLeadById(resolvedLeadId);

    if (!lead) {
      return NextResponse.json({ error: `Lead with ID ${resolvedLeadId} not found` }, { status: 404 });
    }

    const timestamp = new Date().toISOString();
    const newNotes = `${lead.notes || ''}\n[CLAIMED - PAID ONLINE] Client claimed and paid Setup Fee (₦${(transaction.amount / 100).toLocaleString()}) via OPay. Ref: ${reference}. Contact: ${clientName} (${clientEmail}).`;
    await repo.updateLeadStatus(resolvedLeadId, 'CONTACTED', newNotes, timestamp);

    await addLog(
      'OPay Payment Verification',
      'SUCCESS',
      `Lead "${lead.name}" claimed & paid NGN ${(transaction.amount / 100).toLocaleString()} by ${clientName} (${clientEmail})`
    );

    // Assemble JSON configuration for the claimed website
    const siteConfig = {
      lead,
      theme: {
        primary: '#1e3a8a',
        accent: '#60a5fa',
        bg: '#eff6ff',
        text: '#1e3a8a',
        font: 'Outfit',
        heroImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=80',
        gradient: 'linear-gradient(135deg, #1e3a8a 0%, #60a5fa 100%)',
      },
      copy: {
        heroTitle: `${lead.name} — Trusted Local Service`,
        heroSubtitle: `Proudly serving ${lead.area} and surrounds with top-tier expertise.`,
        services: [],
        aboutText: `${lead.name} is a top-rated local business specializing in professional services.`,
        testimonials: [],
        ctaText: 'Book an Appointment',
      },
      selectedFeatures: [],
      customInstructions: '',
      claimedAt: timestamp,
      clientName,
      clientEmail,
      payment: {
        gateway: 'opay',
        reference,
        amount: transaction.amount / 100,
        paidAt: transaction.paid_at
      }
    };

    const siteConfigString = JSON.stringify(siteConfig, null, 2);

    let localWriteSuccess = false;
    try {
      const dataDir = path.join(process.cwd(), 'src', 'data', 'sites');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      const filePath = path.join(dataDir, `${resolvedLeadId}.json`);
      fs.writeFileSync(filePath, siteConfigString, 'utf-8');
      localWriteSuccess = true;
    } catch (fsErr: any) {
      console.warn('Failed to write claimed site config to local filesystem:', fsErr.message);
    }

    // Commit to GitHub (for Vercel deployment update - ONLY if mode is 'git')
    const githubPat = process.env.GITHUB_PAT;
    const githubRepo = process.env.GITHUB_REPO;
    const githubBranch = process.env.GITHUB_BRANCH || 'main';

    let githubCommitStatus = 'SKIPPED';
    let githubErrorMsg = '';

    const { parseScalingConfig } = require('@/lib/scalingHelper');
    let scaling;
    try {
      scaling = parseScalingConfig(lead.notes);
    } catch (parseErr) {
      scaling = { mode: 'none' };
    }

    if (scaling.mode === 'git' && githubPat && githubRepo) {
      try {
        const parts = githubRepo.split('/');
        if (parts.length === 2) {
          const [owner, repoName] = parts;
          await commitFileToGitHub({
            owner,
            repo: repoName,
            filePath: `src/data/sites/${resolvedLeadId}.json`,
            content: siteConfigString,
            commitMessage: `feat: deploy claimed OPay paid website for ${lead.name} (${resolvedLeadId})`,
            token: githubPat,
            branch: githubBranch
          });
          githubCommitStatus = 'SUCCESS';
        }
      } catch (ghErr: any) {
        console.error('GitHub Commit Failed:', ghErr);
        githubCommitStatus = 'FAILED';
        githubErrorMsg = ghErr.message;
      }
    }

    const adminEmail = config.googleUserEmail || config.resendFromEmail || config.brevoSenderEmail;
    const gitNotice = githubCommitStatus === 'SUCCESS' 
      ? '✅ Live website files automatically committed to GitHub. Vercel deployment triggered.' 
      : githubCommitStatus === 'FAILED'
        ? `⚠️ Automatic deployment failed: ${githubErrorMsg}`
        : 'ℹ️ GitHub deployment skipped (keys not configured in .env.local).';

    const adminSubject = `🎉 Paid Claim: ${lead.name} claimed with OPay payment!`;
    const adminBody = `Hi Admin,

Great news! A business owner has claimed their landing page preview and successfully paid their Setup Fee online.

Details:
- Business Name: ${lead.name}
- Lead ID: ${resolvedLeadId}
- Contact Person: ${clientName}
- Contact Email: ${clientEmail}
- Phone Number: ${lead.phone_raw || 'Not provided'}
- Setup Fee Paid: ₦${(transaction.amount / 100).toLocaleString()} (via OPay)
- OPay Ref: ${reference}
- Status: CLAIMED (Lead Notes updated in CRM)

Deployment Status:
${gitNotice}

Please contact them at ${clientEmail} as soon as possible to finalize their website build.

Best regards,
ApexReach Lead Engine`;

    if (adminEmail && !config.dryRun) {
      try {
        if (emailProvider === 'gmail') {
          const accessToken = await getValidAccessToken(config);
          await sendGmailMessage(adminEmail, adminSubject, adminBody, accessToken);
        } else if (emailProvider === 'resend') {
          await sendResendMessage(adminEmail, adminSubject, adminBody, config);
        } else if (emailProvider === 'brevo') {
          await sendBrevoMessage(adminEmail, adminSubject, adminBody, config);
        }
      } catch (sendErr: any) {
        console.warn('Failed to send paid claim notification email:', sendErr.message);
      }
    }

    return NextResponse.json({
      success: true,
      githubCommitStatus,
      githubErrorMsg,
      localWriteSuccess,
      message: 'OPay payment verified and website claimed successfully!',
      lead
    });

  } catch (err: any) {
    console.error('OPay verification error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
