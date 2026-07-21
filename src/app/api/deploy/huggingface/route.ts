import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getRuntimeConfig, saveLocalConfig } from '@/lib/localConfig';

interface CommitAction {
  operation: 'add';
  path: string;
  content: string;
  encoding: 'base64';
}

// Helper to recursively collect files for deployment
function getFilesToDeploy(dir: string, baseDir: string = dir): CommitAction[] {
  const actions: CommitAction[] = [];
  if (!fs.existsSync(dir)) return actions;

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  const ignoredNames = new Set([
    'node_modules',
    '.next',
    '.git',
    'video',
    'scratch',
    '.vercel',
    'leads.xlsx',
    'Bethelmind_Leads_Template.xlsx',
    'detail_inspect_results.json',
    'response.json',
    'package-lock.json',
    'local_runner.log',
    'services_output.log',
    'startup_log.txt',
    'whatsapp_baileys.log',
    'local_runner_heartbeat.json',
    'local_runner_parent_pid.json',
    '.env.local'
  ]);

  const ignoredExtensions = new Set([
    '.webm',
    '.png',
    '.jpg',
    '.jpeg',
    '.gif',
    '.ico',
    '.pdf',
    '.zip',
    '.tar.gz'
  ]);

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, '/');

    if (ignoredNames.has(entry.name) || ignoredNames.has(relativePath)) {
      continue;
    }

    if (entry.isDirectory()) {
      actions.push(...getFilesToDeploy(fullPath, baseDir));
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (ignoredExtensions.has(ext)) {
        continue;
      }

      try {
        const stats = fs.statSync(fullPath);
        // Skip files larger than 1.5MB to optimize payload size
        if (stats.size > 1.5 * 1024 * 1024) {
          continue;
        }

        const buffer = fs.readFileSync(fullPath);
        const base64Content = buffer.toString('base64');

        let repoPath = relativePath;
        if (relativePath === 'Dockerfile.huggingface') {
          repoPath = 'Dockerfile';
        } else if (relativePath === 'Dockerfile') {
          // Skip general VPS dockerfile
          continue;
        }

        actions.push({
          operation: 'add',
          path: repoPath,
          content: base64Content,
          encoding: 'base64'
        });
      } catch (err) {
        console.error(`Error reading ${relativePath} for HF deployment:`, err);
      }
    }
  }

  return actions;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { hfToken, spaceName, isPrivate } = body;

    if (!hfToken || !spaceName) {
      return NextResponse.json({ success: false, error: 'hfToken and spaceName are required.' }, { status: 400 });
    }

    // 1. Get user name from whoami
    const whoamiRes = await fetch('https://huggingface.co/api/whoami-v2', {
      headers: { Authorization: `Bearer ${hfToken}` }
    });

    if (!whoamiRes.ok) {
      const errorMsg = await whoamiRes.text();
      return NextResponse.json({ success: false, error: `Hugging Face Auth Failed: ${errorMsg}` }, { status: 401 });
    }

    const userData = await whoamiRes.json();
    const username = userData.name;

    if (!username) {
      return NextResponse.json({ success: false, error: 'Could not resolve Hugging Face username.' }, { status: 400 });
    }

    // 2. Create the Space repository
    const createRepoRes = await fetch('https://huggingface.co/api/repos/create', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${hfToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: spaceName,
        type: 'space',
        sdk: 'docker',
        private: !!isPrivate
      })
    });

    if (!createRepoRes.ok && createRepoRes.status !== 409) {
      const errorMsg = await createRepoRes.text();
      return NextResponse.json({ success: false, error: `Failed to create Hugging Face Space: ${errorMsg}` }, { status: createRepoRes.status });
    }

    // 3. Set secrets from current runtime config
    const currentConfig = getRuntimeConfig();
    const secretsToSet = [
      { key: 'SUPABASE_URL', value: currentConfig.supabaseUrl || '' },
      { key: 'SUPABASE_SERVICE_ROLE_KEY', value: currentConfig.supabaseKey || '' },
      { key: 'GEMINI_API_KEY', value: currentConfig.geminiApiKey || '' },
      { key: 'BROWSERLESS_API_KEY', value: Array.isArray(currentConfig.browserlessApiKeys) && currentConfig.browserlessApiKeys.length > 0 ? currentConfig.browserlessApiKeys[0] : '' },
      { key: 'BROWSERBASE_API_KEY', value: Array.isArray(currentConfig.browserbaseApiKeys) && currentConfig.browserbaseApiKeys.length > 0 ? currentConfig.browserbaseApiKeys[0] : '' },
      { key: 'ACTIVE_BROWSER_PROVIDER', value: currentConfig.activeBrowserProvider || 'local' }
    ];

    for (const secret of secretsToSet) {
      if (secret.value) {
        try {
          const secretRes = await fetch(`https://huggingface.co/api/spaces/${username}/${spaceName}/secrets`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${hfToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ key: secret.key, value: secret.value })
          });

          if (!secretRes.ok) {
            console.error(`Failed to set secret ${secret.key} on Hugging Face Space:`, await secretRes.text());
          }
        } catch (err) {
          console.error(`Error setting secret ${secret.key} on Hugging Face:`, err);
        }
      }
    }

    // 4. Bundle and upload files
    const projectDir = process.cwd();
    const actions = getFilesToDeploy(projectDir);

    if (actions.length === 0) {
      return NextResponse.json({ success: false, error: 'No deployable files found in project directory.' }, { status: 500 });
    }

    // Commit files to main branch
    const commitRes = await fetch(`https://huggingface.co/api/spaces/${username}/${spaceName}/commit/main`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${hfToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        commit_message: 'Automated deployment of Lead Gen Background Runner',
        actions
      })
    });

    if (!commitRes.ok) {
      const errorMsg = await commitRes.text();
      return NextResponse.json({ success: false, error: `Failed to commit files to Hugging Face Space: ${errorMsg}` }, { status: commitRes.status });
    }

    // Persist new deployment configurations and activate Space runner backend
    try {
      saveLocalConfig({
        hfToken,
        spaceName,
        activeRunnerBackend: 'huggingface'
      });
    } catch (saveErr: any) {
      console.error('Failed to auto-save deployment configs to config.json:', saveErr.message);
    }

    return NextResponse.json({
      success: true,
      spaceUrl: `https://huggingface.co/spaces/${username}/${spaceName}`
    });

  } catch (err: any) {
    console.error('Hugging Face deployment error:', err);
    return NextResponse.json({ success: false, error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
