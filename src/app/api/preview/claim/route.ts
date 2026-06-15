import { NextRequest, NextResponse } from 'next/server';
import { getActiveLeadRepository, addLog } from '@/lib/googleSheets';
import { getRuntimeConfig, saveLocalConfig } from '@/lib/localConfig';
import fs from 'fs';
import path from 'path';

// ============================================================================
// Google OAuth Token Refresher
// ============================================================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getValidAccessToken(config: any): Promise<string> {
  const now = Date.now();
  const bufferMs = 5 * 60 * 1000; // 5 minute buffer

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function sendResendMessage(to: string, subject: string, body: string, config: any) {
  if (!config.resendApiKey) {
    throw new Error('Resend API Key is not configured.');
  }
  const from = config.resendFromEmail || 'onboarding@resend.dev';
  
  const resp = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.resendApiKey}`,
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function sendBrevoMessage(to: string, subject: string, body: string, config: any) {
  if (!config.brevoApiKey) {
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
      'api-key': config.brevoApiKey,
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
  
  // 1. Try to fetch existing file to get its SHA (required for updating files on Git)
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

  // 2. Commit the file contents
  const base64Content = Buffer.from(content).toString('base64');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
// Next.js Route Handler
// ============================================================================

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { leadId, clientName, clientEmail, theme, copy } = body;

    if (!leadId || !clientName || !clientEmail) {
      return NextResponse.json({ error: 'Missing required parameters: leadId, clientName, or clientEmail' }, { status: 400 });
    }

    const repo = getActiveLeadRepository();
    const lead = await repo.getLeadById(leadId);

    if (!lead) {
      return NextResponse.json({ error: `Lead with ID ${leadId} not found` }, { status: 404 });
    }

    // 1. Update lead's status/notes in sheet/Supabase
    const timestamp = new Date().toISOString();
    const newNotes = `${lead.notes || ''}\n[CLAIMED] Client requested ownership on ${timestamp}. Contact: ${clientName} (${clientEmail})`;
    await repo.updateLeadStatus(leadId, 'CONTACTED', newNotes, timestamp);

    // 2. Add log entry
    await addLog(
      'Lead Claim Event',
      'SUCCESS',
      `Lead "${lead.name}" claimed by ${clientName} (${clientEmail})`
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
      claimedAt: timestamp,
      clientName,
      clientEmail
    };

    const siteConfigString = JSON.stringify(siteConfig, null, 2);

    // 4. Local filesystem write (for local dev mode synchronization)
    let localWriteSuccess = false;
    try {
      const dataDir = path.join(process.cwd(), 'src', 'data', 'sites');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      const filePath = path.join(dataDir, `${leadId}.json`);
      fs.writeFileSync(filePath, siteConfigString, 'utf-8');
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

    const { parseScalingConfig } = require('@/lib/scalingHelper');
    const scaling = parseScalingConfig(lead.notes);

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
    } else {
      console.log(`GitHub commit skipped: Turnout mode is '${scaling.mode}' (not 'git').`);
    }

    // 6. Send conversion notification to Admin
    const config = getRuntimeConfig();
    const isDryRun = config.dryRun;
    const provider = config.emailProvider || 'gmail';

    const adminEmail = config.googleUserEmail || config.resendFromEmail || config.brevoSenderEmail;

    const gitNotice = githubCommitStatus === 'SUCCESS' 
      ? '✅ Live website files automatically committed to GitHub. Vercel deployment triggered.' 
      : githubCommitStatus === 'FAILED'
        ? `⚠️ Automatic deployment failed: ${githubErrorMsg}`
        : 'ℹ️ GitHub deployment skipped (keys not configured in .env.local).';

    const adminSubject = `🎉 Lead Claimed: ${lead.name} requested ownership!`;
    const adminBody = `Hi Admin,

Exciting news! A business owner has claimed their landing page preview.

Details:
- Business Name: ${lead.name}
- Lead ID: ${leadId}
- Contact Person: ${clientName}
- Contact Email: ${clientEmail}
- Phone Number: ${lead.phone_raw || 'Not provided'}
- Status: CLAIMED (Lead Notes updated in CRM)

Deployment Status:
${gitNotice}

Please contact them at ${clientEmail} as soon as possible to finalize their website build and assist with custom domain mapping.

Best regards,
ApexReach Lead Engine`;

    if (adminEmail && !isDryRun) {
      try {
        if (provider === 'gmail') {
          const accessToken = await getValidAccessToken(config);
          await sendGmailMessage(adminEmail, adminSubject, adminBody, accessToken);
        } else if (provider === 'resend') {
          await sendResendMessage(adminEmail, adminSubject, adminBody, config);
        } else if (provider === 'brevo') {
          await sendBrevoMessage(adminEmail, adminSubject, adminBody, config);
        }
      } catch (sendErr: unknown) {
        const error = sendErr as Error;
        console.warn('Failed to send claim notification email:', error.message);
      }
    }

    let userMessage = 'Website claimed successfully!';
    if (githubCommitStatus === 'SUCCESS') {
      userMessage = 'Website claimed! Live files committed to GitHub. Vercel is deploying the updates.';
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
