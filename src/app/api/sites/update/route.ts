import { NextRequest, NextResponse } from 'next/server';
import { getRuntimeConfig } from '@/lib/localConfig';
import { commitFileToGitHub } from '@/lib/github';
import { sendNotificationEmail } from '@/lib/email';
import fs from 'fs';
import path from 'path';

// ============================================================================
// POST /api/sites/update
// Receives { siteId, description } — uses Gemini to parse natural-language
// edits and merge them into the site's JSON config, then commits to GitHub.
// ============================================================================

const SITES_DIR = path.join(process.cwd(), 'src', 'data', 'sites');

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { siteId, description } = body;

    if (!siteId || !description) {
      return NextResponse.json(
        { error: 'siteId and description are required.' },
        { status: 400 }
      );
    }

    // 1. Load the current site JSON
    const sitePath = path.join(SITES_DIR, `${siteId}.json`);
    if (!fs.existsSync(sitePath)) {
      return NextResponse.json(
        { error: `Site config "${siteId}.json" not found.` },
        { status: 404 }
      );
    }

    let siteConfig: any;
    try {
      siteConfig = JSON.parse(fs.readFileSync(sitePath, 'utf8'));
    } catch {
      return NextResponse.json(
        { error: 'Failed to parse existing site config.' },
        { status: 500 }
      );
    }

    // 2. Build a Gemini prompt to translate natural language → JSON delta
    const config = getRuntimeConfig();
    const hasGeminiKey = !!config.geminiApiKey;
    const hasVertex = !!(config.googleProjectId && config.googleRefreshToken);

    if (!hasGeminiKey && !hasVertex) {
      return NextResponse.json(
        { error: 'Neither Gemini API Key nor Vertex AI is configured.' },
        { status: 400 }
      );
    }

    const currentTheme = siteConfig.theme || {};
    const currentCopy  = siteConfig.copy  || {};

    const aiPrompt = `You are an expert web designer and content editor. A business owner described changes they want to make to their live website in plain language.

Owner's request: "${description}"

Current website configuration:
- Business Name: ${siteConfig.lead?.name || 'Unknown'}
- Category: ${siteConfig.lead?.category || 'General'}

Current Design:
${JSON.stringify(currentTheme, null, 2)}

Current Copy:
${JSON.stringify(currentCopy, null, 2)}

Instructions:
1. Interpret the owner's request.
2. Return a JSON object with ONLY the fields that need to change.
3. The JSON must be a valid partial merge object with optional keys: "theme", "copy", "lead", "visibility".
4. For theme changes, only include the properties that changed (e.g. if they want a new primary color, return {"theme":{"primary":"#newcolor"}}).
5. For copy changes, only include the text fields that changed.
6. For lead info changes (e.g. new phone number, new address), include them under "lead".
7. Respond ONLY with the JSON object, NO markdown formatting, NO explanation.

Example response:
{
  "theme": { "primary": "#2563eb" },
  "copy": { "heroTitle": "New Headline Here" }
}`;

    let resp;
    if (hasGeminiKey) {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${config.geminiApiKey}`;
      resp = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: aiPrompt }] }],
          generationConfig: { temperature: 0.2, maxOutputTokens: 1024 },
        }),
      });
    } else {
      // Vertex AI path — refresh token
      const tokenResp = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: config.googleClientId!,
          client_secret: config.googleClientSecret!,
          refresh_token: config.googleRefreshToken!,
          grant_type: 'refresh_token',
        }),
      });
      const tokenData = await tokenResp.json();
      if (!tokenResp.ok || !tokenData.access_token) {
        throw new Error('Failed to refresh Google access token for Vertex AI.');
      }

      const endpoint = `https://us-central1-aiplatform.googleapis.com/v1/projects/${config.googleProjectId}/locations/us-central1/publishers/google/models/gemini-1.5-flash:generateContent`;
      resp = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: aiPrompt }] }],
          generationConfig: { temperature: 0.2, maxOutputTokens: 1024 },
        }),
      });
    }

    if (!resp.ok) {
      const err = await resp.json();
      throw new Error(`Gemini error: ${err.error?.message || resp.statusText}`);
    }

    const geminiData = await resp.json();
    const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';

    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Gemini did not return valid JSON. Raw: ' + rawText.slice(0, 200));
    }

    const delta = JSON.parse(jsonMatch[0]);

    // 3. Deep-merge the delta into the existing config
    if (delta.theme) {
      siteConfig.theme = { ...siteConfig.theme, ...delta.theme };
    }
    if (delta.copy) {
      siteConfig.copy = { ...siteConfig.copy, ...delta.copy };
    }
    if (delta.lead) {
      siteConfig.lead = { ...siteConfig.lead, ...delta.lead };
    }
    if (delta.visibility) {
      siteConfig.visibility = { ...(siteConfig.visibility || {}), ...delta.visibility };
    }

    siteConfig.lastUpdated = new Date().toISOString();
    siteConfig.updateHistory = siteConfig.updateHistory || [];
    siteConfig.updateHistory.push({
      timestamp: siteConfig.lastUpdated,
      description,
      delta,
    });

    const updatedJson = JSON.stringify(siteConfig, null, 2);

    // 4. Write locally
    fs.writeFileSync(sitePath, updatedJson, 'utf-8');

    // 5. Commit to GitHub to trigger Vercel rebuild
    const githubPat  = process.env.GITHUB_PAT;
    const githubRepo = process.env.GITHUB_REPO;
    const githubBranch = process.env.GITHUB_BRANCH || 'main';
    let githubStatus = 'SKIPPED';

    if (githubPat && githubRepo) {
      try {
        const [owner, repoName] = githubRepo.split('/');
        await commitFileToGitHub({
          owner,
          repo: repoName,
          filePath: `src/data/sites/${siteId}.json`,
          content: updatedJson,
          commitMessage: `chore: AI-updated site config for ${siteConfig.lead?.name || siteId} — "${description.slice(0, 60)}"`,
          token: githubPat,
          branch: githubBranch,
        });
        githubStatus = 'SUCCESS';
      } catch (ghErr: any) {
        console.error('GitHub commit failed during site update:', ghErr.message);
        githubStatus = 'FAILED';
      }
    }

    // 6. Send notification email to admin
    const adminEmail = config.googleUserEmail || config.resendFromEmail || config.brevoSenderEmail;
    if (adminEmail) {
      await sendNotificationEmail(
        adminEmail,
        `🔄 Site Updated: ${siteConfig.lead?.name || siteId}`,
        `A site was updated via AI natural-language edit.\n\nSite ID: ${siteId}\nBusiness: ${siteConfig.lead?.name || 'Unknown'}\nRequest: "${description}"\n\nApplied Delta:\n${JSON.stringify(delta, null, 2)}\n\nGitHub Status: ${githubStatus}`
      );
    }

    return NextResponse.json({
      success: true,
      githubStatus,
      appliedDelta: delta,
      message: githubStatus === 'SUCCESS'
        ? 'Site updated and deployed! Changes will be live in ~60 seconds.'
        : 'Site config updated locally. Set GITHUB_PAT and GITHUB_REPO to enable auto-deploy.',
    });

  } catch (err: any) {
    console.error('[/api/sites/update] Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
