import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import sodium from 'libsodium-wrappers';
import { getRuntimeConfig } from '@/lib/localConfig';

// Hardcoded fallback in case the local file is pruned during serverless builds
const WORKFLOW_FALLBACK = `name: Bethelmind Scraper Queue Runner

on:
  schedule:
    # Run every hour
    - cron: '0 * * * *'
  workflow_dispatch:

jobs:
  run-scraper:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Install Playwright Chromium & System Dependencies
        run: |
          npx playwright install chromium --with-deps

      - name: Build Next.js Application
        env:
          NEXT_PUBLIC_SUPABASE_URL: \${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          SUPABASE_SERVICE_ROLE_KEY: \${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
        run: npm run build

      - name: Start Next.js Server
        env:
          PORT: 3006
          NEXT_PUBLIC_SUPABASE_URL: \${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          SUPABASE_SERVICE_ROLE_KEY: \${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
        run: |
          npx next start -p 3006 &
          echo "Waiting for Next.js server to start..."
          for i in {1..30}; do
            if curl -s http://localhost:3006/api/config > /dev/null; then
              echo "Next.js server is up and responding!"
              break
            fi
            sleep 2
          done

      - name: Execute Queue Poller (RUN_ONCE)
        env:
          RUN_ONCE: true
          PORT: 3006
          NEXT_PUBLIC_SUPABASE_URL: \${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          SUPABASE_SERVICE_ROLE_KEY: \${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
          ACTIVE_BROWSER_PROVIDER: local
        run: npx tsx scripts/local_job_runner.ts
`;

async function encryptSecret(publicKeyBase64: string, secretValue: string) {
  await sodium.ready;
  const keyBytes = sodium.from_base64(publicKeyBase64, sodium.base64_variants.ORIGINAL);
  const secretBytes = sodium.from_string(secretValue);
  const encryptedBytes = sodium.crypto_box_seal(secretBytes, keyBytes);
  return sodium.to_base64(encryptedBytes, sodium.base64_variants.ORIGINAL);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { githubToken, repoFullName } = body; // e.g. "owner/repo"

    if (!githubToken || !repoFullName || !repoFullName.includes('/')) {
      return NextResponse.json({ success: false, error: 'githubToken and valid repoFullName (owner/repo) are required.' }, { status: 400 });
    }

    const [owner, repo] = repoFullName.split('/');

    // 1. Fetch current config
    const currentConfig = getRuntimeConfig();
    const secretsToSet = [
      { key: 'NEXT_PUBLIC_SUPABASE_URL', value: currentConfig.supabaseUrl || '' },
      { key: 'SUPABASE_SERVICE_ROLE_KEY', value: currentConfig.supabaseKey || '' },
      { key: 'GEMINI_API_KEY', value: currentConfig.geminiApiKey || '' },
      { key: 'BROWSERLESS_API_KEY', value: Array.isArray(currentConfig.browserlessApiKeys) && currentConfig.browserlessApiKeys.length > 0 ? currentConfig.browserlessApiKeys[0] : '' },
      { key: 'BROWSERBASE_API_KEY', value: Array.isArray(currentConfig.browserbaseApiKeys) && currentConfig.browserbaseApiKeys.length > 0 ? currentConfig.browserbaseApiKeys[0] : '' }
    ];

    // 2. Fetch the repo public key from GitHub
    const pubKeyUrl = `https://api.github.com/repos/${owner}/${repo}/actions/secrets/public-key`;
    const pubKeyRes = await fetch(pubKeyUrl, {
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'nextjs-deploy-agent'
      }
    });

    if (!pubKeyRes.ok) {
      const errorMsg = await pubKeyRes.text();
      return NextResponse.json({ success: false, error: `Failed to fetch GitHub repository public key: ${errorMsg}` }, { status: pubKeyRes.status });
    }

    const { key_id, key: publicKeyBase64 } = await pubKeyRes.json();

    // 3. Encrypt and set each secret
    const results: string[] = [];
    for (const secret of secretsToSet) {
      if (secret.value) {
        try {
          const encryptedValue = await encryptSecret(publicKeyBase64, secret.value);

          const putSecretUrl = `https://api.github.com/repos/${owner}/${repo}/actions/secrets/${secret.key}`;
          const putSecretRes = await fetch(putSecretUrl, {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${githubToken}`,
              Accept: 'application/vnd.github.v3+json',
              'Content-Type': 'application/json',
              'User-Agent': 'nextjs-deploy-agent'
            },
            body: JSON.stringify({
              encrypted_value: encryptedValue,
              key_id
            })
          });

          if (!putSecretRes.ok) {
            console.error(`Failed to set GitHub secret ${secret.key}:`, await putSecretRes.text());
          } else {
            results.push(secret.key);
          }
        } catch (err) {
          console.error(`Error processing secret ${secret.key}:`, err);
        }
      }
    }

    // 4. Commit workflow file to GitHub repository
    const workflowPath = '.github/workflows/scrape-runner.yml';
    let workflowContent = WORKFLOW_FALLBACK;

    try {
      const localPath = path.join(process.cwd(), '.github', 'workflows', 'scrape-runner.yml');
      if (fs.existsSync(localPath)) {
        workflowContent = fs.readFileSync(localPath, 'utf8');
      }
    } catch (err) {
      console.warn('Could not read local workflow file, using fallback.', err);
    }

    const base64Workflow = Buffer.from(workflowContent).toString('base64');

    // Check if the file already exists on GitHub to get its SHA
    const fileUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${workflowPath}`;
    const fileCheckRes = await fetch(fileUrl, {
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'nextjs-deploy-agent'
      }
    });

    let sha: string | undefined;
    if (fileCheckRes.ok) {
      const fileData = await fileCheckRes.json();
      sha = fileData.sha;
    }

    const commitRes = await fetch(fileUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'nextjs-deploy-agent'
      },
      body: JSON.stringify({
        message: 'Automated setup of scrape-runner cron workflow',
        content: base64Workflow,
        sha
      })
    });

    if (!commitRes.ok) {
      const errorMsg = await commitRes.text();
      console.error('Failed to commit workflow file to GitHub:', errorMsg);
      return NextResponse.json({
        success: true,
        warnings: [`Secrets configured successfully, but failed to commit workflow: ${errorMsg}`],
        configuredSecrets: results
      });
    }

    return NextResponse.json({
      success: true,
      configuredSecrets: results,
      workflowUrl: `https://github.com/repos/${owner}/${repo}/blob/main/${workflowPath}`
    });

  } catch (err: any) {
    console.error('GitHub secrets configuration error:', err);
    return NextResponse.json({ success: false, error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
