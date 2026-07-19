import { NextRequest, NextResponse } from 'next/server';
import { getActiveLeadRepository, addLog } from '@/lib/googleSheets';
import { getRuntimeConfig } from '@/lib/localConfig';
import { sendNotificationEmail } from '@/lib/email';
import { commitFileToGitHub } from '@/lib/github';
import fs from 'fs';
import path from 'path';

// ============================================================================
// Next.js Route Handler
// ============================================================================

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { leadId, clientName, clientEmail, theme, copy, paymentMethod, selectedFeatures, customInstructions } = body;

    if (!leadId || !clientName || !clientEmail) {
      return NextResponse.json({ error: 'Missing required parameters: leadId, clientName, or clientEmail' }, { status: 400 });
    }

    const repo = getActiveLeadRepository();
    const lead = await repo.getLeadById(leadId);

    if (!lead) {
      return NextResponse.json({ error: `Lead with ID ${leadId} not found` }, { status: 404 });
    }

    // 1. Update lead's status/notes in sheet/Supabase
    const { parseScalingConfig } = require('@/lib/scalingHelper');
    const scaling = parseScalingConfig(lead.notes);

    const timestamp = new Date().toISOString();
    const transferPending = (paymentMethod === 'bank_transfer_moniepoint' || paymentMethod === 'bank_transfer_opay' || paymentMethod === 'bank_transfer') ? ' [MANUAL TRANSFER PENDING]' : '';
    const featuresNote = selectedFeatures && selectedFeatures.length > 0 ? ` Activated Features: ${selectedFeatures.join(', ')}.` : '';
    const instNote = customInstructions ? ` Custom Instructions: "${customInstructions}"` : '';
    
    const gitPendingTag = scaling.mode === 'git-batch' ? ' [GIT_SYNC_PENDING: true]' : '';
    const redesignPendingTag = customInstructions ? ' [REDESIGN_PENDING: true]' : '';

    const newNotes = `${lead.notes || ''}\n[CLAIMED${transferPending}]${gitPendingTag}${redesignPendingTag} Client requested ownership on ${timestamp}. Contact: ${clientName} (${clientEmail}).${featuresNote}${instNote}`;
    await repo.updateLeadStatus(leadId, 'CONTACTED', newNotes, timestamp);

    // 2. Add log entry
    await addLog(
      'Lead Claim Event',
      'SUCCESS',
      `Lead "${lead.name}" claimed by ${clientName} (${clientEmail}) [Mode: ${scaling.mode}]`
    );

    // 3. Assemble JSON configuration for the claimed website
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
      clientEmail
    };

    const siteConfigString = JSON.stringify(siteConfig, null, 2);

    // 4. Local filesystem write (for local dev mode synchronization)
    let localWriteSuccess = false;
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
      localWriteSuccess = true;
      console.log(`Locally wrote claimed site config to ${filePath}`);
    } catch (fsErr: unknown) {
      const error = fsErr as Error;
      console.warn('Failed to write claimed site config to local filesystem:', error.message);
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

    const isManualTransfer = paymentMethod === 'bank_transfer' || paymentMethod === 'bank_transfer_moniepoint' || paymentMethod === 'bank_transfer_opay';
    const transferSubjectSuffix = isManualTransfer ? ' (Manual Bank Transfer Pending)' : '';
    const adminSubject = `🎉 Lead Claimed: ${lead.name} requested ownership!${transferSubjectSuffix}`;
    const adminBody = `Hi Admin,

Exciting news! A business owner has claimed their landing page preview.

Details:
- Business Name: ${lead.name}
- Lead ID: ${leadId}
- Contact Person: ${clientName}
- Contact Email: ${clientEmail}
- Phone Number: ${lead.phone_raw || 'Not provided'}
- Payment Method: ${
      paymentMethod === 'bank_transfer_moniepoint' ? 'Manual Local Bank Transfer (Moniepoint)' :
      paymentMethod === 'bank_transfer_opay' ? 'Manual Local Bank Transfer (OPay)' :
      paymentMethod === 'bank_transfer' ? 'Manual Local Bank Transfer (Generic)' : 'Default / None'
    }
- Status: CLAIMED (Lead Notes updated in CRM)

Customizations:
- Selected Automations: ${selectedFeatures && selectedFeatures.length > 0 ? selectedFeatures.join(', ') : 'None'}
- Natural Language Instructions: ${customInstructions || 'None'}

Deployment Status:
${gitNotice}

Please contact them at ${clientEmail} as soon as possible to finalize their website build and assist with custom domain mapping.

Best regards,
Bethelmind Analytics & Strategy Lead Engine`;

    // Only send synchronous email notifications if NOT using git-batch mode
    if (scaling.mode !== 'git-batch' && adminEmail) {
      try {
        await sendNotificationEmail(adminEmail, adminSubject, adminBody);
      } catch (mailErr: any) {
        console.error('Failed to send admin claim notification email:', mailErr.message);
      }
    }

    let userMessage = 'Website claimed successfully!';
    if (githubCommitStatus === 'SUCCESS') {
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
      message: userMessage,
      lead
    });

  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
