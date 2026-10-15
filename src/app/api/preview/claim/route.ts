import { NextRequest, NextResponse } from 'next/server';
import { getActiveLeadRepository, addLog } from '@/lib/googleSheets';
import { getRuntimeConfig } from '@/lib/localConfig';
import { sendNotificationEmail } from '@/lib/email';
import { sendAdminPaymentWhatsAppAlert } from '@/lib/whatsapp';
import { commitFileToGitHub } from '@/lib/github';
import { findBundledLead, sanitizeDisplayName } from '@/lib/leadsBundle';
import fs from 'fs';
import path from 'path';

// ============================================================================
// Next.js Route Handler
// ============================================================================

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { leadId, clientName, clientEmail, clientPhone, preferredDomain, theme, copy, paymentMethod, selectedFeatures, customInstructions } = body;

    if (!leadId || !clientName || !clientEmail) {
      return NextResponse.json({ error: 'Missing required parameters: leadId, clientName, or clientEmail' }, { status: 400 });
    }

    let lead: any = findBundledLead(leadId);
    if (!lead) {
      try {
        const repo = getActiveLeadRepository();
        lead = await repo.getLeadById(leadId);
      } catch (_) {}
    }

    if (!lead) {
      const safeName = sanitizeDisplayName(leadId, 'Professional Services');
      lead = {
        lead_id: leadId,
        source: 'GOOGLE',
        name: safeName,
        category: 'Professional Services',
        address: 'Commercial Hub, Lagos',
        area: 'Lekki Phase 1',
        city: 'Lagos',
        phone_e164: '+2348022791227',
        phone_raw: '0802 279 1227',
        email: clientEmail,

        website: '',
        rating: 4.9,
        reviews_count: 38,
        verified: true,
        listings_count: 1,
        profile_url: '',
        source_query_or_seed: 'demo',
        collected_at: new Date().toISOString(),
        status: 'NEW',
        last_contacted_at: '',
        duplicate_of_lead_id: '',
        business_summary: 'Verified Local Business Enterprise',
        notes: '[PREVIEW_DEMO] Synthetic lead created during interactive claim preview.'
      };
    } else {
      lead.name = sanitizeDisplayName(lead.name, lead.category);
    }

    const activeLead: any = lead;


    // 1. Update lead's status/notes in sheet/Supabase
    const { parseScalingConfig } = require('@/lib/scalingHelper');
    const scaling = parseScalingConfig(activeLead.notes);

    const timestamp = new Date().toISOString();
    const transferPending = (paymentMethod === 'bank_transfer_moniepoint' || paymentMethod === 'bank_transfer_opay' || paymentMethod === 'bank_transfer') ? ' [MANUAL TRANSFER PENDING]' : '';
    const featuresNote = selectedFeatures && selectedFeatures.length > 0 ? ` Activated Features: ${selectedFeatures.join(', ')}.` : '';
    const instNote = customInstructions ? ` Custom Instructions: "${customInstructions}"` : '';
    const domainNote = preferredDomain ? ` Preferred Domain: "${preferredDomain}"` : ' Domain: [AUTO-REGISTER BEST AVAILABLE]';
    const phoneNote = clientPhone ? ` WhatsApp/Phone: ${clientPhone}` : '';
    
    const gitPendingTag = scaling.mode === 'git-batch' ? ' [GIT_SYNC_PENDING: true]' : '';
    const redesignPendingTag = customInstructions ? ' [REDESIGN_PENDING: true]' : '';

    const newNotes = `${activeLead.notes || ''}\n[CLAIMED${transferPending}]${gitPendingTag}${redesignPendingTag} Client requested ownership on ${timestamp}. Contact: ${clientName} (${clientEmail}${phoneNote}).${domainNote}${featuresNote}${instNote}`;
    
    try {
      if (!activeLead.notes?.includes('[PREVIEW_DEMO]')) {
        const repo = getActiveLeadRepository();
        await repo.updateLeadStatus(leadId, 'CONTACTED', newNotes, timestamp);
      }
    } catch (repoErr: any) {

      console.warn('[ClaimRoute] Lead status update notice:', repoErr.message);
    }

    // 2. Add log entry
    try {
      await addLog(
        'Lead Claim Event',
        'SUCCESS',
        `Lead "${activeLead.name}" claimed by ${clientName} (${clientEmail}) [Mode: ${scaling.mode}]`
      );
    } catch (logErr: any) {
      console.warn('[ClaimRoute] Log entry notice:', logErr.message);
    }

    // 3. Assemble JSON configuration for the claimed website (injecting verified owner phone & domain)
    const normalizedClientPhone = clientPhone ? String(clientPhone).trim() : '';
    const updatedLead = {
      ...lead,
      ...(normalizedClientPhone ? {
        phone_raw: normalizedClientPhone,
        phone_e164: normalizedClientPhone.startsWith('0')
          ? `+234${normalizedClientPhone.slice(1).replace(/\D/g, '')}`
          : normalizedClientPhone.startsWith('+')
            ? normalizedClientPhone
            : `+234${normalizedClientPhone.replace(/\D/g, '')}`
      } : {}),
      ...(preferredDomain ? { website: `https://${preferredDomain.replace(/^https?:\/\//i, '')}` } : {}),
    };

    const siteConfig = {
      lead: updatedLead,
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
      preferredDomain: preferredDomain || '',
      claimedAt: timestamp,
      clientName,
      clientEmail,
      clientPhone: normalizedClientPhone || lead.phone_raw || ''
    };

    const siteConfigString = JSON.stringify(siteConfig, null, 2);

    // 4. Local filesystem write (writes both leadId.json and customDomain slug .json for instant domain routing)
    let localWriteSuccess = false;
    const isServerless = process.env.VERCEL || process.env.NETLIFY || process.env.AWS_EXECUTION_ENV;
    if (!isServerless) {
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

        // Also save under custom domain slug (e.g., chinedumotors.com.ng -> chinedumotors.json) so custom domain rewrites resolve immediately
        if (preferredDomain && !workerIndex) {
          const domainSlug = preferredDomain.replace(/^https?:\/\//i, '').replace(/^www\./i, '').split('.')[0].toLowerCase().replace(/[^a-z0-9-]/g, '');
          if (domainSlug && domainSlug !== leadId) {
            writeJsonFileSyncAtomic(path.join(dataDir, `${domainSlug}.json`), siteConfig);
          }
        }

        localWriteSuccess = true;
        console.log(`Locally wrote claimed site config to ${filePath}`);
      } catch (fsErr: unknown) {
        const error = fsErr as Error;
        console.warn('[ClaimRoute] Non-fatal notice: Local filesystem write skipped:', error.message);
      }
    }

    // 5. Commit to GitHub (for Vercel deployment update - ONLY if mode is 'git')
    const githubPat = process.env.GITHUB_PAT;
    const githubRepo = process.env.GITHUB_REPO; // Expected format: "username/repo"
    const githubBranch = process.env.GITHUB_BRANCH || 'main';

    let githubCommitStatus = 'SKIPPED';
    let githubErrorMsg = '';

    if (scaling.mode === 'git') {
      if (githubPat && githubRepo) {
        try {
          const parts = githubRepo.split('/');
          if (parts.length !== 2) {
            throw new Error('GITHUB_REPO env variable must be in the format "owner/repo"');
          }
          const [owner, repoName] = parts;
          
          await commitFileToGitHub({
            owner,
            repo: repoName,
            filePath: `src/data/sites/${leadId}.json`,
            content: siteConfigString,
            commitMessage: `feat: deploy claimed website for ${lead.name} (${leadId})`,
            token: githubPat,
            branch: githubBranch
          });
          if (preferredDomain) {
            const domainSlug = preferredDomain.replace(/^https?:\/\//i, '').replace(/^www\./i, '').split('.')[0].toLowerCase().replace(/[^a-z0-9-]/g, '');
            if (domainSlug && domainSlug !== leadId) {
              await commitFileToGitHub({
                owner,
                repo: repoName,
                filePath: `src/data/sites/${domainSlug}.json`,
                content: siteConfigString,
                commitMessage: `feat: bind custom domain slug ${domainSlug} for ${lead.name}`,
                token: githubPat,
                branch: githubBranch
              });
            }
          }
          githubCommitStatus = 'SUCCESS';
        } catch (ghErr: unknown) {
          const error = ghErr as Error;
          console.error('GitHub Commit Failed:', error);
          githubCommitStatus = 'FAILED';
          githubErrorMsg = error.message;
        }
      } else {
        console.log('GitHub integration skipped: GITHUB_PAT or GITHUB_REPO not defined in environment variables.');
      }
    } else if (scaling.mode === 'git-batch') {
      githubCommitStatus = 'QUEUED';
      console.log('GitHub commit deferred to background batch sync worker.');
    } else {
      console.log(`GitHub commit skipped: Turnout mode is '${scaling.mode}' (not 'git').`);
    }

    // 6. Send conversion notification to Admin
    const config = getRuntimeConfig();
    const adminEmail = config.googleUserEmail || config.resendFromEmail || config.brevoSenderEmail;

    const gitNotice = githubCommitStatus === 'SUCCESS' 
      ? '✅ Live website files automatically committed to GitHub. Vercel deployment triggered.' 
      : githubCommitStatus === 'QUEUED'
        ? '⏳ Live website files queued for background batch deployment commit.'
        : githubCommitStatus === 'FAILED'
          ? `⚠️ Automatic deployment failed: ${githubErrorMsg}`
          : 'ℹ️ GitHub deployment skipped.';

    const activeStrategy = body.upgradeStrategy || scaling.mode || 'basic_presence';
    const resolvedDepositNGN =
      paymentMethod === 'free_photo_preview' || activeStrategy === 'free_photo_preview'
        ? 0
        : activeStrategy === 'growth_automation'
          ? 60000
          : 35000;

    const appOrigin = process.env.NEXT_PUBLIC_APP_URL || 'https://www.bethelmindanalytics.com';
    const instantLiveSiteUrl = `${appOrigin}/sites/${leadId}`;
    const instantHandoverUrl = `${appOrigin}/handover/${leadId}`;

    const isManualTransfer = paymentMethod === 'bank_transfer' || paymentMethod === 'bank_transfer_moniepoint' || paymentMethod === 'bank_transfer_opay';
    const transferSubjectSuffix = isManualTransfer ? ` (₦${resolvedDepositNGN.toLocaleString()} Deposit Initiated)` : ' (Free Photo Preview Claim)';
    const adminSubject = `🎉 Lead Claimed: ${lead.name} (${preferredDomain || 'Custom Domain'})${transferSubjectSuffix}`;
    const adminBody = `Hi Admin,

Exciting news! A business owner has claimed their website preview.

Details:
- Business Name: ${lead.name}
- Lead ID: ${leadId}
- Contact Person: ${clientName}
- Contact Phone / WhatsApp: ${clientPhone || lead.phone_raw || 'Not provided'}
- Contact Email: ${clientEmail}
- Preferred Domain: ${preferredDomain || 'To be confirmed on WhatsApp'}
- Selected Package: ${activeStrategy} (Deposit: ₦${resolvedDepositNGN.toLocaleString()})
- Payment Method: ${
      paymentMethod === 'bank_transfer_moniepoint' ? 'Direct Bank Transfer (Moniepoint 6805375225)' :
      paymentMethod === 'bank_transfer_opay' ? 'Direct Bank Transfer (Moniepoint 6805375225)' :
      paymentMethod === 'free_photo_preview' ? '₦0 Free Photo Preview First' :
      paymentMethod === 'bank_transfer' ? 'Direct Bank Transfer (Moniepoint 6805375225)' : 'Default / None'
    }
- Status: CLAIMED (Lead Notes updated in CRM)

Instant Delivery Links (Already Hosted & Live):
- 🌐 Live Production Website: ${instantLiveSiteUrl}
- 🔑 Client Handover Portal: ${instantHandoverUrl}

Customizations:
- Selected Automations: ${selectedFeatures && selectedFeatures.length > 0 ? selectedFeatures.join(', ') : 'Standard WhatsApp AI Closer'}
- Natural Language Instructions: ${customInstructions || 'None'}

Deployment Status:
${gitNotice}

Next Step: Message ${clientName} on WhatsApp (${clientPhone || lead.phone_raw || 'their number'}) to collect their 3–5 shop photos and connect ${preferredDomain || 'their .com.ng domain'}.

Best regards,
Bethelmind Digital Solutions (CAC Certified Nigerian Enterprise)`;

    // Send email notification to admin
    if (scaling.mode !== 'git-batch' && adminEmail) {
      try {
        await sendNotificationEmail(adminEmail, adminSubject, adminBody);
      } catch (mailErr: any) {
        console.error('Failed to send admin claim notification email:', mailErr.message);
      }
    }

    // Send instant high-priority WhatsApp Payment alert to Admin Line (2348022791227)
    try {
      await sendAdminPaymentWhatsAppAlert({
        leadName: lead.name,
        clientName,
        clientEmail,
        amountNGN: resolvedDepositNGN,
        paymentMethod: paymentMethod || 'moniepoint_bank_transfer',
      });
    } catch (waAlertErr: any) {
      console.warn('Failed to send WhatsApp admin alert:', waAlertErr.message);
    }

    // 7. Zero-Touch Auto-Provisioning Engine
    let provisionedUrl = '';
    let subdomainUrl = '';
    let handoverPortalUrl = '';
    let dnsInstructions: any[] = [];
    try {
      const { autoProvisionClientSite } = await import('@/lib/autoProvision');
      const provisionRes = await autoProvisionClientSite({
        leadId,
        clientName,
        clientEmail,
        clientPhone: clientPhone || lead.phone_raw || lead.phone_e164,
        customDomain: preferredDomain || undefined,
        selectedStrategy: activeStrategy,
        selectedFeatures: selectedFeatures || [],
        claimFeeNGN: resolvedDepositNGN,
        paymentMethod: paymentMethod || 'moniepoint_bank_transfer'
      });
      provisionedUrl = provisionRes.liveUrl;
      subdomainUrl = provisionRes.subdomainUrl;
      handoverPortalUrl = provisionRes.handoverPortalUrl;
      dnsInstructions = provisionRes.dnsInstructions || [];
    } catch (pErr: any) {
      console.warn('[ClaimRoute] Auto-provision warning:', pErr.message);
    }

    let userMessage = 'Website claimed successfully!';
    if (subdomainUrl) {
      userMessage = `Website claimed & provisioned live! Access your site at: ${subdomainUrl}`;
    } else if (provisionedUrl) {
      userMessage = `Website claimed & provisioned live! Access your site at: ${provisionedUrl}`;
    } else if (githubCommitStatus === 'SUCCESS') {
      userMessage = 'Website claimed! Live files committed to GitHub. Vercel is deploying the updates.';
    } else if (githubCommitStatus === 'QUEUED') {
      userMessage = 'Website claimed successfully! Your site is live dynamically, and static deployment is queued.';
    } else if (githubCommitStatus === 'FAILED') {
      userMessage = `Website claimed in CRM, but Git deployment failed: ${githubErrorMsg}`;
    } else {
      userMessage = 'Website claimed successfully! Admin notification triggered. Git deployment skipped (set up GITHUB_PAT and GITHUB_REPO to enable automatic deploys).';
    }

    return NextResponse.json({
      success: true,
      githubCommitStatus,
      localWriteSuccess,
      provisionedUrl: subdomainUrl || provisionedUrl,
      subdomainUrl,
      handoverPortalUrl,
      dnsInstructions,
      message: userMessage,
      lead
    });

  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
