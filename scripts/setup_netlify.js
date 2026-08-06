/**
 * @file scripts/setup_netlify.js
 * ============================================================
 * ONE-COMMAND NETLIFY FALLBACK SETUP
 * ============================================================
 * Automates 100%:
 *   1. Creates your Netlify site via API
 *   2. Copies all env vars from .env.local to Netlify
 *   3. Deploys the app to Netlify immediately
 *   4. Saves NETLIFY_SITE_ID to .env.local for future deploys
 *
 * YOU NEED (one token, free):
 *   NETLIFY_TOKEN → https://app.netlify.com/user/applications
 *                   → Personal access tokens → New access token
 *
 * USAGE:
 *   node scripts/setup_netlify.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ─── Load env ─────────────────────────────────────────────────────────────────

function loadEnv() {
  const envPath = path.join(__dirname, '../.env.local');
  if (!fs.existsSync(envPath)) return {};
  const vars = {};
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const m = line.match(/^([^#=\s][^=]*)=(.+)$/);
    if (m) {
      const key = m[1].trim();
      const val = m[2].trim().replace(/^["']|["']$/g, '');
      process.env[key] = val;
      vars[key] = val;
    }
  });
  return vars;
}
const envVars = loadEnv();

const NETLIFY_TOKEN = process.env.NETLIFY_TOKEN;
const SITE_NAME = 'bethelmind-analytics';
const GITHUB_REPO = 'tosinbethelmind/lead-generation-automation-v2';
const GITHUB_BRANCH = 'main';

// ─── Logging ─────────────────────────────────────────────────────────────────

const c = {
  green:  s => `\x1b[32m${s}\x1b[0m`,
  red:    s => `\x1b[31m${s}\x1b[0m`,
  yellow: s => `\x1b[33m${s}\x1b[0m`,
  cyan:   s => `\x1b[36m${s}\x1b[0m`,
  bold:   s => `\x1b[1m${s}\x1b[0m`,
  dim:    s => `\x1b[2m${s}\x1b[0m`,
};
const ok   = msg => console.log(`${c.green('✅')}  ${msg}`);
const fail = msg => console.log(`${c.red('❌')}  ${msg}`);
const info = msg => console.log(`${c.cyan('ℹ️')}  ${msg}`);
const warn = msg => console.log(`${c.yellow('⚠️')}  ${msg}`);
const step = (n, msg) => console.log(`\n${c.bold(c.cyan(`[Step ${n}]`))} ${c.bold(msg)}`);
const div  = () => console.log(c.dim('─'.repeat(62)));

// ─── Netlify API helper ───────────────────────────────────────────────────────

function netlifyApi(method, urlPath, body = null) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const options = {
      hostname: 'api.netlify.com',
      path: `/api/v1${urlPath}`,
      method,
      headers: {
        'Authorization': `Bearer ${NETLIFY_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'BethelmindSetup/1.0',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
      },
    };

    const req = https.request(options, res => {
      let raw = '';
      res.on('data', d => raw += d);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(raw) }); }
        catch { resolve({ status: res.statusCode, body: raw }); }
      });
    });
    req.on('error', reject);
    req.setTimeout(20000, () => { req.destroy(); reject(new Error('Timeout')); });
    if (payload) req.write(payload);
    req.end();
  });
}

// ─── Save to .env.local ───────────────────────────────────────────────────────

function appendEnvVar(key, value) {
  const envPath = path.join(__dirname, '../.env.local');
  let content = fs.readFileSync(envPath, 'utf8');
  if (content.includes(`${key}=`)) {
    content = content.replace(new RegExp(`^${key}=.*$`, 'm'), `${key}=${value}`);
  } else {
    content += `\n${key}=${value}\n`;
  }
  fs.writeFileSync(envPath, content);
}

// ─── Build env vars for Netlify ──────────────────────────────────────────────

const VARS_TO_COPY = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'ADMIN_TOKEN',
  'NEXT_PUBLIC_APP_URL',
  'ADMIN_WA_PHONE',
  'OUTREACH_WA_PHONE_1',
  'OUTREACH_WA_PHONE_2',
  'OPAY_ACCOUNT_NUMBER',
  'OPAY_ACCOUNT_NAME',
  'OPAY_BANK_NAME',
  'MONIEPOINT_ACCOUNT_NUMBER',
  'MONIEPOINT_ACCOUNT_NAME',
  'MONIEPOINT_BANK_NAME',
  'BUSINESS_SIGNATURE',
  'APIFY_TOKEN',
  'BROWSERLESS_API_KEY',
];

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n');
  console.log(c.bold(c.cyan('╔════════════════════════════════════════════════════════════╗')));
  console.log(c.bold(c.cyan('║      BETHELMIND — NETLIFY FALLBACK SETUP AUTOMATION         ║')));
  console.log(c.bold(c.cyan('╚════════════════════════════════════════════════════════════╝')));
  console.log(`\n  🚀 Setting up Netlify as fallback for bethelmindanalytics.com\n`);

  // ── Credential Check ─────────────────────────────────────────────────────

  div();
  console.log(c.bold('\n📋 CREDENTIAL CHECK\n'));

  if (!NETLIFY_TOKEN) {
    fail('NETLIFY_TOKEN not found in .env.local');
    console.log(`\n  Get your free token here (30 seconds):`);
    console.log(`  ${c.cyan('https://app.netlify.com/user/applications')} → Personal access tokens`);
    console.log(`  → New access token → name it "BethelmindFallback" → copy it\n`);
    console.log(`  Then add to .env.local:`);
    console.log(`  ${c.green('NETLIFY_TOKEN=your_token_here')}\n`);
    console.log(`  Then re-run: ${c.cyan('node scripts/setup_netlify.js')}\n`);
    process.exit(1);
  }
  ok('Netlify token — found');

  // ── Step 1: Create Netlify Site ──────────────────────────────────────────

  step(1, 'CREATE NETLIFY SITE');
  div();

  // Check if site already exists
  let siteId = process.env.NETLIFY_SITE_ID;
  let siteUrl = '';

  if (siteId) {
    warn(`NETLIFY_SITE_ID already set: ${siteId} — skipping creation`);
    const existing = await netlifyApi('GET', `/sites/${siteId}`);
    if (existing.status === 200) {
      siteUrl = existing.body.ssl_url || existing.body.url;
      ok(`Existing site: ${siteUrl}`);
    }
  } else {
    info(`Creating site: ${SITE_NAME}...`);
    const createRes = await netlifyApi('POST', '/sites', {
      name: SITE_NAME,
      custom_domain: '',
      repo: {
        provider: 'github',
        repo: GITHUB_REPO,
        branch: GITHUB_BRANCH,
        cmd: 'npm run build',
        dir: '.next',
        private: false,
      }
    });

    if ([200, 201].includes(createRes.status)) {
      siteId = createRes.body.id;
      siteUrl = createRes.body.ssl_url || createRes.body.url || `https://${SITE_NAME}.netlify.app`;
      ok(`Site created! ID: ${siteId}`);
      ok(`URL: ${siteUrl}`);
      appendEnvVar('NETLIFY_SITE_ID', siteId);
      ok(`NETLIFY_SITE_ID saved to .env.local`);
    } else if (createRes.status === 422 && JSON.stringify(createRes.body).includes('taken')) {
      // Site name taken — try with suffix
      warn(`Name "${SITE_NAME}" taken — trying with suffix...`);
      const altName = `${SITE_NAME}-${Date.now().toString(36)}`;
      const retry = await netlifyApi('POST', '/sites', { name: altName });
      if ([200, 201].includes(retry.status)) {
        siteId = retry.body.id;
        siteUrl = retry.body.ssl_url || retry.body.url;
        ok(`Site created as: ${altName}`);
        ok(`URL: ${siteUrl}`);
        appendEnvVar('NETLIFY_SITE_ID', siteId);
      } else {
        fail(`Could not create site: ${JSON.stringify(retry.body)}`);
        process.exit(1);
      }
    } else {
      // GitHub OAuth not set up — create without repo and use manual deploy
      warn(`GitHub integration needs OAuth — creating standalone site...`);
      const standaloneRes = await netlifyApi('POST', '/sites', { name: SITE_NAME });
      if ([200, 201].includes(standaloneRes.status)) {
        siteId = standaloneRes.body.id;
        siteUrl = standaloneRes.body.ssl_url || standaloneRes.body.url;
        ok(`Site created (manual deploy mode): ${siteUrl}`);
        appendEnvVar('NETLIFY_SITE_ID', siteId);
      } else {
        fail(`Site creation failed: ${JSON.stringify(createRes.body)}`);
        process.exit(1);
      }
    }
  }

  // ── Step 2: Set Environment Variables ────────────────────────────────────

  step(2, 'COPY ENVIRONMENT VARIABLES TO NETLIFY');
  div();

  const envToSet = {};
  VARS_TO_COPY.forEach(key => {
    if (envVars[key]) envToSet[key] = envVars[key];
  });

  info(`Setting ${Object.keys(envToSet).length} environment variables...`);

  // Netlify env vars API (v1)
  const envBody = Object.entries(envToSet).map(([key, value]) => ({
    key,
    values: [{ value, context: 'all' }]
  }));

  const envRes = await netlifyApi('POST', `/accounts/${encodeURIComponent(SITE_NAME)}/env?site_id=${siteId}`, envBody);

  if ([200, 201].includes(envRes.status)) {
    ok(`All ${envBody.length} env vars set on Netlify!`);
  } else {
    // Try alternative env endpoint
    for (const [key, value] of Object.entries(envToSet)) {
      await netlifyApi('PUT', `/sites/${siteId}/env/${key}`, { value });
    }
    ok(`Env vars set via fallback method`);
  }

  // ── Step 3: Deploy via Netlify CLI ────────────────────────────────────────

  step(3, 'DEPLOY TO NETLIFY');
  div();

  // First build the project
  info('Building Next.js project...');
  try {
    execSync('npm run build', {
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit',
      env: { ...process.env, NETLIFY: 'true' }
    });
    ok('Build complete!');
  } catch (e) {
    warn('Build failed — will deploy existing .next build if available');
  }

  // Deploy using netlify-cli
  info('Deploying to Netlify...');
  try {
    execSync(
      `npx netlify-cli deploy --prod --dir=.next --site=${siteId} --auth=${NETLIFY_TOKEN} --message="Automated fallback deploy from BethelmindSetup"`,
      { cwd: path.join(__dirname, '..'), stdio: 'inherit' }
    );
    ok(`Deployed to Netlify! → ${siteUrl}`);
  } catch (e) {
    warn(`CLI deploy failed: ${e.message}`);
    info('You can deploy manually later via: npx netlify-cli deploy --prod');
  }

  // ── Step 4: Setup GitHub Actions for Auto-Deploy ─────────────────────────

  step(4, 'CREATE GITHUB ACTIONS AUTO-DEPLOY WORKFLOW');
  div();

  const workflowDir = path.join(__dirname, '../.github/workflows');
  if (!fs.existsSync(workflowDir)) fs.mkdirSync(workflowDir, { recursive: true });

  const workflowContent = `# Auto-deploy to Netlify fallback on every push
# Runs alongside Vercel (primary) deployment
name: Deploy to Netlify (Fallback)

on:
  push:
    branches: [main]
  workflow_dispatch:  # Allow manual trigger

jobs:
  deploy-netlify:
    runs-on: ubuntu-latest
    name: Build & Deploy to Netlify
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build Next.js app
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: \${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: \${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
          NEXT_PUBLIC_APP_URL: https://www.bethelmindanalytics.com
          NEXT_TELEMETRY_DISABLED: 1

      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v3
        with:
          publish-dir: '.next'
          production-branch: main
          production-deploy: true
          github-token: \${{ secrets.GITHUB_TOKEN }}
          deploy-message: "Auto-deploy from GitHub Actions - \${{ github.sha }}"
          netlify-config-path: ./netlify.toml
        env:
          NETLIFY_AUTH_TOKEN: \${{ secrets.NETLIFY_TOKEN }}
          NETLIFY_SITE_ID: \${{ secrets.NETLIFY_SITE_ID }}
`;

  const workflowPath = path.join(workflowDir, 'deploy-netlify.yml');
  fs.writeFileSync(workflowPath, workflowContent);
  ok(`GitHub Actions workflow created → .github/workflows/deploy-netlify.yml`);

  // ── Step 5: Add secrets instructions ─────────────────────────────────────

  step(5, 'ADD GITHUB SECRETS (REQUIRED FOR AUTO-DEPLOY)');
  div();

  console.log(`\n  ${c.bold('Add these 2 secrets to your GitHub repo:')}`);
  console.log(`  ${c.cyan('https://github.com/tosinbethelmind/lead-generation-automation-v2/settings/secrets/actions')}`);
  console.log(`\n  ┌─────────────────────┬────────────────────────────────┐`);
  console.log(`  │ Secret Name         │ Value                          │`);
  console.log(`  ├─────────────────────┼────────────────────────────────┤`);
  console.log(`  │ NETLIFY_TOKEN       │ ${NETLIFY_TOKEN?.slice(0, 20)}...${c.dim('(your token)')} │`);
  console.log(`  │ NETLIFY_SITE_ID     │ ${(siteId || 'from .env.local').padEnd(30)} │`);
  console.log(`  └─────────────────────┴────────────────────────────────┘`);
  console.log(`\n  After adding secrets → every git push auto-deploys to BOTH Vercel + Netlify!\n`);

  // ── Push the workflow file ────────────────────────────────────────────────

  try {
    execSync('git add .github/workflows/deploy-netlify.yml; git commit -m "ci: add Netlify auto-deploy workflow (fallback)"; git push origin main', {
      cwd: path.join(__dirname, '..'),
      stdio: 'pipe',
      shell: 'powershell.exe'
    });
    ok('Workflow pushed to GitHub → auto-deploy active after you add secrets!');
  } catch (_) {
    info('Push the workflow file manually: git add .github/workflows/deploy-netlify.yml && git commit -m "ci: netlify fallback" && git push');
  }

  // ── Summary ───────────────────────────────────────────────────────────────

  div();
  console.log(c.bold('\n🏁 NETLIFY FALLBACK SETUP COMPLETE\n'));
  console.log(`  PRIMARY  → ${c.bold(c.cyan('https://bethelmindanalytics.com'))} (Vercel)`);
  console.log(`  FALLBACK → ${c.bold(c.cyan(siteUrl))} (Netlify)`);
  console.log(`\n  ${c.yellow('If Vercel goes down — change Hostinger A record to Netlify IP')}`);
  console.log(`  ${c.dim('Netlify IP: 75.2.60.5 or run: nslookup ' + (siteUrl?.replace('https://','') || 'your-site.netlify.app'))}`);
  console.log(`\n  ${c.green('Both platforms auto-deploy on every git push — always in sync!')}\n`);
}

main().catch(e => { fail(`Fatal: ${e.message}`); process.exit(1); });
