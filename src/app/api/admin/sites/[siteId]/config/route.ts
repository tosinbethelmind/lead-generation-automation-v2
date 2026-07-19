import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getRuntimeConfig } from '@/lib/localConfig';
import { commitFileToGitHub } from '@/lib/github';
import { getActiveLeadRepository } from '@/lib/googleSheets';
import { getDesignTheme, buildFallbackCopy } from '@/lib/designGenerator';

const SITES_DIR = path.join(process.cwd(), 'src', 'data', 'sites');

// Password verification helper
function verifyPassword(req: NextRequest): boolean {
  const password = req.headers.get('x-admin-password');
  const expectedPassword = process.env.ADMIN_PASSWORD || 'admin123';
  return password === expectedPassword;
}

// GET /api/admin/sites/[siteId]/config
export async function GET(
  req: NextRequest,
  context: any
) {
  try {
    if (!verifyPassword(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = typeof context?.params?.then === 'function'
      ? await context.params
      : context?.params;
    const siteId = resolvedParams?.siteId;

    if (!siteId) {
      return NextResponse.json({ error: 'siteId is required' }, { status: 400 });
    }

    const sitePath = path.join(SITES_DIR, `${siteId}.json`);
    
    // 1. Try file system
    if (fs.existsSync(sitePath)) {
      const content = fs.readFileSync(sitePath, 'utf8');
      return NextResponse.json({ success: true, config: JSON.parse(content), source: 'file' });
    }

    // 2. Try database/CRM fallback
    try {
      const repo = getActiveLeadRepository();
      const lead = await repo.getLeadById(siteId);
      if (lead) {
        const theme = getDesignTheme(lead.category);
        const copy = buildFallbackCopy(lead);
        const defaultConfig = {
          lead,
          theme,
          copy,
          visibility: {
            hero: true,
            services: true,
            about: true,
            testimonials: true,
            booking: true,
            claim: true
          }
        };
        return NextResponse.json({ success: true, config: defaultConfig, source: 'fallback' });
      }
    } catch (dbErr) {
      console.warn('Fallback CRM lookup failed:', dbErr);
    }

    return NextResponse.json({ error: `Site config ${siteId}.json not found` }, { status: 404 });
  } catch (err: any) {
    console.error('[/api/admin/sites/config] GET Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/admin/sites/[siteId]/config
export async function POST(
  req: NextRequest,
  context: any
) {
  try {
    if (!verifyPassword(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = typeof context?.params?.then === 'function'
      ? await context.params
      : context?.params;
    const siteId = resolvedParams?.siteId;

    if (!siteId) {
      return NextResponse.json({ error: 'siteId is required' }, { status: 400 });
    }

    const body = await req.json();
    const { config: updatedConfig, commitToGit } = body;

    if (!updatedConfig) {
      return NextResponse.json({ error: 'config payload is required' }, { status: 400 });
    }

    // Ensure SITES_DIR exists
    if (!fs.existsSync(SITES_DIR)) {
      fs.mkdirSync(SITES_DIR, { recursive: true });
    }

    const sitePath = path.join(SITES_DIR, `${siteId}.json`);
    const updatedJson = JSON.stringify(updatedConfig, null, 2);

    // 1. Write locally
    fs.writeFileSync(sitePath, updatedJson, 'utf-8');

    // 2. Commit to Git if requested
    let githubStatus = 'SKIPPED';
    if (commitToGit) {
      const configObj = getRuntimeConfig();
      const githubPat = process.env.GITHUB_PAT || configObj.googleRefreshToken; // fallback or from env
      const githubRepo = process.env.GITHUB_REPO || configObj.googleClientId; // fallback or env
      const githubBranch = process.env.GITHUB_BRANCH || 'main';

      if (githubPat && githubRepo) {
        try {
          const [owner, repoName] = githubRepo.split('/');
          await commitFileToGitHub({
            owner,
            repo: repoName,
            filePath: `src/data/sites/${siteId}.json`,
            content: updatedJson,
            commitMessage: `chore: admin override update for ${updatedConfig.lead?.name || siteId}`,
            token: githubPat,
            branch: githubBranch,
          });
          githubStatus = 'SUCCESS';
        } catch (ghErr: any) {
          console.error('GitHub commit failed:', ghErr.message);
          githubStatus = `FAILED: ${ghErr.message}`;
        }
      } else {
        githubStatus = 'FAILED: GITHUB_PAT or GITHUB_REPO not configured in environment';
      }
    }

    return NextResponse.json({
      success: true,
      githubStatus,
      message: githubStatus === 'SUCCESS'
        ? 'Changes saved locally and deployed live to GitHub.'
        : 'Changes saved locally.'
    });
  } catch (err: any) {
    console.error('[/api/admin/sites/config] POST Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
