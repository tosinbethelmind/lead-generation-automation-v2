/**
 * setup_new_supabase.js
 * 
 * Interactive one-shot setup script:
 * 1. Prompts you for your new Supabase credentials
 * 2. Updates .env.local automatically
 * 3. Runs the full database schema migration
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const readline = require('readline');
const { Client } = require('pg');

const ENV_PATH = path.join(__dirname, '..', '.env.local');
const SCHEMA_PATH = path.join(__dirname, '..', 'supabase_schema.sql');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  bold: '\x1b[1m',
};

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((res) => rl.question(q, res));

// ─────────────────────────────────────────────────────────────────────────────
// DNS-over-HTTPS resolver (bypasses local UDP DNS block)
// ─────────────────────────────────────────────────────────────────────────────
function resolveDoh(host, type = 'A') {
  return new Promise((resolve, reject) => {
    const url = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(host)}&type=${type}`;
    https.get(url, { headers: { accept: 'application/dns-json' } }, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const record = (json.Answer || []).find((a) => a.type === (type === 'A' ? 1 : 28));
          if (record) resolve(record.data);
          else reject(new Error(`No ${type} record for ${host}`));
        } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// .env.local updater
// ─────────────────────────────────────────────────────────────────────────────
function updateEnv(newValues) {
  let content = fs.existsSync(ENV_PATH) ? fs.readFileSync(ENV_PATH, 'utf8') : '';

  for (const [key, value] of Object.entries(newValues)) {
    const regex = new RegExp(`^(${key}\\s*=).*$`, 'm');
    const line = `${key}="${value}"`;
    if (regex.test(content)) {
      content = content.replace(regex, line);
    } else {
      content += `\n${line}`;
    }
  }

  fs.writeFileSync(ENV_PATH, content.trimStart(), 'utf8');
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n${colors.cyan}${colors.bold}`);
  console.log('══════════════════════════════════════════════════════');
  console.log('  🚀 Bethelmind Analytics — Supabase Migration Setup  ');
  console.log('══════════════════════════════════════════════════════');
  console.log(colors.reset);
  console.log('Please enter the credentials from your NEW Supabase project.');
  console.log(`${colors.yellow}(Find these in Supabase Dashboard → Project Settings → API)${colors.reset}\n`);

  // ── Collect credentials ──────────────────────────────────────────────────
  let supabaseUrl = (await ask('  Supabase URL (e.g. https://xxxx.supabase.co): ')).trim();
  if (!supabaseUrl.startsWith('http')) {
    supabaseUrl = 'https://' + supabaseUrl;
  }

  const anonKey = (await ask('  Anon / Public Key                           : ')).trim();
  const serviceRoleKey = (await ask('  Service Role Key                             : ')).trim();
  const dbPassword = (await ask('  Database Password (set during project setup) : ')).trim();

  rl.close();

  // ── Validate URL & extract project ref ──────────────────────────────────
  const match = supabaseUrl.match(/https:\/\/([a-z0-9]+)\.supabase\.co/);
  if (!match) {
    console.error(`\n${colors.red}❌ Invalid Supabase URL format. Expected: https://xxxx.supabase.co${colors.reset}`);
    process.exit(1);
  }
  const projectRef = match[1];
  console.log(`\n${colors.green}✅ Project reference detected: ${colors.bold}${projectRef}${colors.reset}`);

  // ── Update .env.local ───────────────────────────────────────────────────
  console.log(`\n${colors.cyan}[1/3] Updating .env.local...${colors.reset}`);
  updateEnv({
    NEXT_PUBLIC_SUPABASE_URL: supabaseUrl,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: anonKey,
    SUPABASE_SERVICE_ROLE_KEY: serviceRoleKey,
    DATABASE_PASSWORD: dbPassword,
  });
  console.log(`${colors.green}✅ .env.local updated successfully.${colors.reset}`);

  // ── Resolve connection pooler via DoH ───────────────────────────────────
  console.log(`\n${colors.cyan}[2/3] Resolving Supabase connection pooler via DNS-over-HTTPS...${colors.reset}`);
  const poolerHostname = 'aws-1-eu-central-1.pooler.supabase.com';
  let poolerAddress = poolerHostname;
  try {
    poolerAddress = await resolveDoh(poolerHostname);
    console.log(`${colors.green}✅ Resolved ${poolerHostname} → ${poolerAddress}${colors.reset}`);
  } catch (e) {
    console.warn(`${colors.yellow}⚠️  DoH resolution failed (${e.message}). Using hostname directly.${colors.reset}`);
  }

  // ── Connect & run schema ────────────────────────────────────────────────
  console.log(`\n${colors.cyan}[3/3] Connecting to database and applying schema...${colors.reset}`);
  if (!fs.existsSync(SCHEMA_PATH)) {
    console.error(`${colors.red}❌ Schema file not found: ${SCHEMA_PATH}${colors.reset}`);
    process.exit(1);
  }

  const sql = fs.readFileSync(SCHEMA_PATH, 'utf8');
  const connectionString = `postgresql://postgres.${projectRef}:${encodeURIComponent(dbPassword)}@${poolerAddress}:6543/postgres`;

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000,
  });

  try {
    await client.connect();
    console.log(`${colors.green}✅ Connected to database!${colors.reset}`);

    console.log('   Applying supabase_schema.sql — creating all tables...');
    await client.query(sql);

    console.log(`\n${colors.green}${colors.bold}`);
    console.log('══════════════════════════════════════════════════════');
    console.log('  🎉 MIGRATION COMPLETE! All tables created.         ');
    console.log('     Your app is now pointing to the new database.   ');
    console.log('══════════════════════════════════════════════════════');
    console.log(colors.reset);
  } catch (err) {
    console.error(`\n${colors.red}❌ Migration failed: ${err.message}${colors.reset}`);
    console.error('   Tip: Make sure your database password is correct and the project is not paused.');
    process.exit(1);
  } finally {
    try { await client.end(); } catch (_) {}
  }
}

main();
