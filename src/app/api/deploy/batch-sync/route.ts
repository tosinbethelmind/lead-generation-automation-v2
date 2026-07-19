import { NextRequest, NextResponse } from 'next/server';
import { getActiveLeadRepository, addLog, updateLeadFields } from '@/lib/googleSheets';
import { getRuntimeConfig } from '@/lib/localConfig';
import { sendNotificationEmail } from '@/lib/email';
import { commitFileToGitHub } from '@/lib/github';
import { getDesignTheme, buildFallbackCopy } from '@/lib/designGenerator';
import { generateRedesignWithProviders } from '@/lib/aiRedesign';
import fs from 'fs';
import path from 'path';
import { getOverridesDir } from '@/lib/overrides';

const OVERRIDES_DIR = getOverridesDir();

// Helper to delay execution (rate-limiting)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get('secret');
    const cronSecret = process.env.CRON_SECRET || 'bethelmind_sync_secret';

    // Simple security gate for background execution
    if (secret !== cronSecret && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Unauthorized sync request' }, { status: 401 });
    }

    const repo = getActiveLeadRepository();
    const allLeads = await repo.getLeads();

    const pendingRedesigns = allLeads.filter(lead => (lead.notes || '').includes('[REDESIGN_PENDING: true]'));
    const pendingGitDeploys = allLeads.filter(lead => (lead.notes || '').includes('[GIT_SYNC_PENDING: true]'));

    const results = {
      redesignsProcessed: [] as string[],
      redesignErrors: [] as string[],
      gitDeploysProcessed: [] as string[],
      gitDeployErrors: [] as string[],
    };

    console.log(`[Batch Sync] Starting execution. Pending Redesigns: ${pendingRedesigns.length}, Pending Git Deploys: ${pendingGitDeploys.length}`);

    // ============================================================================
    // Loop 1: Process Pending AI Redesigns (Rate-limited to 10-12 RPM)
    // ============================================================================
    for (const lead of pendingRedesigns) {
      const leadId = lead.lead_id;
      try {
        console.log(`[Batch Sync] Processing AI Redesign for lead ${leadId} (${lead.name})`);

        // Extract prompt
        const promptMatch = lead.notes.match(/\[REDESIGN_PROMPT:\s*([^\]\n]+)\]/i);
        const prompt = promptMatch ? promptMatch[1].trim() : 'Tailor the layout to be more professional';

        // Load baseline theme and copy
        const themeDefault = getDesignTheme(lead.category);
        const copyDefault = buildFallbackCopy(lead);
        
        const overridesPath = path.join(OVERRIDES_DIR, `${leadId}.json`);
        let currentOverrides: any = {};
        if (fs.existsSync(overridesPath)) {
          try {
            currentOverrides = JSON.parse(fs.readFileSync(overridesPath, 'utf8'));
          } catch (err) {
            console.warn(`[Batch Sync] Failed to parse overrides for ${leadId}:`, err);
          }
        }

        const currentTheme = { ...themeDefault, ...currentOverrides.theme };
        const currentCopy = { ...copyDefault, ...currentOverrides.copy };
        const currentVisibility = {
          showTestimonials: true,
          showServices: true,
          showEstimator: true,
          showAbout: true,
          ...currentOverrides.visibility
        };

        const aiPrompt = `You are an expert web designer. Your task is to update a business landing page design based on the user request.
  
User Request: "${prompt}"

Current Site Details:
- Business Name: ${lead.name}
- Category: ${lead.category}
- Area: ${lead.area}, ${lead.city}

Current Design/Colors:
- Primary Color: ${currentTheme.primary}
- Accent Color: ${currentTheme.accent}
- Background Color: ${currentTheme.bg}
- Gradient: ${currentTheme.gradient}

Current Copy:
- Hero Title: "${currentCopy.heroTitle}"
- Hero Subtitle: "${currentCopy.heroSubtitle}"
- About Text: "${currentCopy.aboutText}"
- CTA Text: "${currentCopy.ctaText}"

Current Section Visibility:
- Show Testimonials: ${currentVisibility.showTestimonials}
- Show Services: ${currentVisibility.showServices}
- Show Estimator: ${currentVisibility.showEstimator}
- Show About: ${currentVisibility.showAbout}

Generate a JSON object containing the modified design overrides. Only modify what is requested or what is logical to change (e.g. if colors change, make sure text color and background contrast remains excellent). Return exactly this JSON structure (respond ONLY with JSON, no markdown formatting):
{
  "theme": {
    "primary": "hex code or CSS color",
    "accent": "hex code or CSS color",
    "bg": "hex code or CSS color",
    "text": "hex code or CSS color for contrast",
    "gradient": "linear-gradient css value"
  },
  "copy": {
    "heroTitle": "updated hero title",
    "heroSubtitle": "updated value proposition subtitle",
    "aboutText": "updated about us text",
    "ctaText": "updated call to action button label"
  },
  "visibility": {
    "showTestimonials": true/false,
    "showServices": true/false,
    "showEstimator": true/false,
    "showAbout": true/false
  },
  "services": [
    { "title": "Service Title", "description": "Short description", "icon": "emoji or icon identifier" }
  ]
}`;

        const rawText = await generateRedesignWithProviders(aiPrompt);
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error('No JSON output returned from LLM provider.');
        }

        const overrides = JSON.parse(jsonMatch[0]);
        fs.writeFileSync(overridesPath, JSON.stringify(overrides, null, 2), 'utf8');

        // Update the notes to remove REDESIGN_PENDING tag
        const updatedNotes = lead.notes
          .replace('[REDESIGN_PENDING: true]', '[REDESIGN_PENDING: false]')
          .replace(/\[REDESIGN_PROMPT:\s*[^\]\n]+\]/gi, '');
        await repo.updateLeadStatus(leadId, lead.status, updatedNotes);

        results.redesignsProcessed.push(`${lead.name} (${leadId})`);
        console.log(`[Batch Sync] Successfully completed redesign for lead ${leadId}`);

        // Throttle 4 seconds to prevent Gemini rate limit (15 RPM)
        await delay(4000);
      } catch (err: any) {
        console.error(`[Batch Sync] AI Redesign failed for lead ${leadId}:`, err.message);
        results.redesignErrors.push(`${lead.name} (${leadId}): ${err.message}`);
      }
    }

    // ============================================================================
    // Loop 2: Process Pending GitHub Deploys (Sequential git commits)
    // ============================================================================
    const githubPat = process.env.GITHUB_PAT;
    const githubRepo = process.env.GITHUB_REPO;
    const githubBranch = process.env.GITHUB_BRANCH || 'main';

    if (pendingGitDeploys.length > 0) {
      if (githubPat && githubRepo) {
        const parts = githubRepo.split('/');
        if (parts.length === 2) {
          const [owner, repoName] = parts;

          for (const lead of pendingGitDeploys) {
            const leadId = lead.lead_id;
            try {
              console.log(`[Batch Sync] Committing website config for lead ${leadId} (${lead.name})`);

              // Load generated copy & overrides if available
              const overridesPath = path.join(OVERRIDES_DIR, `${leadId}.json`);
              let overrides: any = {};
              if (fs.existsSync(overridesPath)) {
                try {
                  overrides = JSON.parse(fs.readFileSync(overridesPath, 'utf8'));
                } catch (e) {
                  console.warn(`[Batch Sync] Failed to load overrides file for commit ${leadId}`);
                }
              }

              // Assemble site config json
              const siteConfig = {
                lead,
                theme: overrides.theme || {
                  primary: '#1e3a8a',
                  accent: '#60a5fa',
                  bg: '#eff6ff',
                  text: '#1e3a8a',
                  font: 'Outfit',
                  gradient: 'linear-gradient(135deg, #1e3a8a 0%, #60a5fa 100%)',
                },
                copy: overrides.copy || {
                  heroTitle: `${lead.name} — Trusted Local Service`,
                  heroSubtitle: `Proudly serving ${lead.area} and surrounds.`,
                  aboutText: `${lead.name} is a top-rated local business.`,
                  ctaText: 'Book an Appointment',
                },
                claimedAt: new Date().toISOString(),
              };

              const contentString = JSON.stringify(siteConfig, null, 2);

              // Push file to github
              await commitFileToGitHub({
                owner,
                repo: repoName,
                filePath: `src/data/sites/${leadId}.json`,
                content: contentString,
                commitMessage: `feat: batch sync deploy claimed website for ${lead.name} (${leadId})`,
                token: githubPat,
                branch: githubBranch
              });

              // Update the notes to remove GIT_SYNC_PENDING tag
              const updatedNotes = lead.notes.replace('[GIT_SYNC_PENDING: true]', '[GIT_SYNC_PENDING: false]');
              await repo.updateLeadStatus(leadId, lead.status, updatedNotes);

              results.gitDeploysProcessed.push(`${lead.name} (${leadId})`);
              console.log(`[Batch Sync] Successfully committed lead ${leadId} config to GitHub.`);
              
              // Brief delay to give Github API branch reference breathing room
              await delay(2000);
            } catch (err: any) {
              console.error(`[Batch Sync] Git push failed for lead ${leadId}:`, err.message);
              results.gitDeployErrors.push(`${lead.name} (${leadId}): ${err.message}`);
            }
          }
        } else {
          console.error('[Batch Sync] GITHUB_REPO not formatted correctly.');
        }
      } else {
        console.warn('[Batch Sync] GitHub credentials not found in environment.');
      }
    }

    // ============================================================================
    // Step 3: Trigger Admin Digest Email Notification if anything was processed
    // ============================================================================
    const totalProcessed = results.redesignsProcessed.length + results.redesignErrors.length +
                           results.gitDeploysProcessed.length + results.gitDeployErrors.length;

    if (totalProcessed > 0) {
      const config = getRuntimeConfig();
      const adminEmail = config.googleUserEmail || config.resendFromEmail || config.brevoSenderEmail;

      if (adminEmail) {
        const emailSubject = `📊 Bethelmind Sync Digest: ${results.gitDeploysProcessed.length} site(s) deployed`;
        const emailBody = `Hi Admin,

Here is your automated synchronization digest summary from Bethelmind Analytics & Strategy:

==================================================
1. AI REDESIGNS COMPLETED:
${results.redesignsProcessed.length > 0 
  ? results.redesignsProcessed.map(item => `- ✅ ${item}`).join('\n') 
  : 'None'}

2. AI REDESIGN FAILURES / RETRIES:
${results.redesignErrors.length > 0 
  ? results.redesignErrors.map(item => `- ❌ ${item}`).join('\n') 
  : 'None'}

==================================================
3. GITHUB SITE DEPLOYMENTS COMPLETED:
${results.gitDeploysProcessed.length > 0 
  ? results.gitDeploysProcessed.map(item => `- ✅ ${item}`).join('\n') 
  : 'None'}

4. DEPLOYMENT FAILURES / RETRIES:
${results.gitDeployErrors.length > 0 
  ? results.gitDeployErrors.map(item => `- ❌ ${item}`).join('\n') 
  : 'None'}
==================================================

All successful deployments are now building on Vercel.

Best regards,
Bethelmind Analytics & Strategy Automation Service`;

        try {
          await sendNotificationEmail(adminEmail, emailSubject, emailBody);
        } catch (mailErr: any) {
          console.error('[Batch Sync] Failed to send digest email:', mailErr.message);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Batch synchronization process execution completed.',
      results
    });

  } catch (err: any) {
    console.error('[Batch Sync] Fatal error during execution:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
