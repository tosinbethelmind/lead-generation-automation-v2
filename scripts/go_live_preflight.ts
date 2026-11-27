import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';

const ENV_LOCAL_PATH = path.join(process.cwd(), '.env.local');
const MIGRATION_PATH = path.join(process.cwd(), 'supabase', 'migrations', '20261126_three_division_commerce.sql');

function parseEnvFile(): Record<string, string> {
  if (!fs.existsSync(ENV_LOCAL_PATH)) return {};
  return dotenv.parse(fs.readFileSync(ENV_LOCAL_PATH, 'utf8'));
}

function appendEnvVars(vars: Record<string, string>) {
  const lines = Object.entries(vars).map(([k, v]) => `${k}=${v}`);
  fs.appendFileSync(ENV_LOCAL_PATH, `\n# Added by go_live_preflight\n${lines.join('\n')}\n`, 'utf8');
}

async function main() {
  const shouldGenerateTokens = process.argv.includes('--init-tokens');
  const shouldApplyMigration = process.argv.includes('--apply-db');

  const env = parseEnvFile();

  console.log('\n=== BETHELMIND GO-LIVE PREFLIGHT CHECK ===');
  const requiredKeys = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'PAYSTACK_SECRET_KEY',
    'ADMIN_TOKEN',
    'CRON_SECRET',
  ];
  const trackingKeys = [
    'NEXT_PUBLIC_GOOGLE_ADS_ID',
    'NEXT_PUBLIC_GA4_MEASUREMENT_ID',
    'NEXT_PUBLIC_GOOGLE_ADS_LEAD_CONVERSION_LABEL',
    'NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_CONVERSION_LABEL',
  ];

  const toAdd: Record<string, string> = {};

  for (const key of requiredKeys) {
    const val = (env[key] || process.env[key] || '').trim();
    if (val) {
      console.log(`  [OK] ${key} is configured`);
    } else if (shouldGenerateTokens && (key === 'ADMIN_TOKEN' || key === 'CRON_SECRET')) {
      const generated = crypto.randomBytes(24).toString('hex');
      toAdd[key] = generated;
      console.log(`  [GENERATED] ${key} written to .env.local`);
    } else {
      console.log(`  [MISSING] ${key}`);
    }
  }

  if (Object.keys(toAdd).length > 0) {
    appendEnvVars(toAdd);
  }

  console.log('\nTracking Variables:');
  for (const key of trackingKeys) {
    const val = (env[key] || process.env[key] || '').trim();
    console.log(`  ${val ? '[OK]' : '[OPTIONAL/UNSET]'} ${key}`);
  }

  if (shouldApplyMigration) {
    const dbUrl = (env.DATABASE_URL || process.env.DATABASE_URL || '').trim();
    if (!dbUrl) {
      console.log('\n[DB MIGRATION] DATABASE_URL not found in .env.local.');
      console.log(`  Run ${MIGRATION_PATH} manually in Supabase Dashboard -> SQL Editor.`);
    } else {
      const { Client } = await import('pg');
      const sql = fs.readFileSync(MIGRATION_PATH, 'utf8');
      const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
      await client.connect();
      await client.query(sql);
      await client.end();
      console.log('\n[DB MIGRATION] Applied 20261126_three_division_commerce.sql to PostgreSQL successfully.');
    }
  }

  console.log('\nFastest Launch Commands:');
  console.log('  1. Generate local ADMIN_TOKEN & CRON_SECRET: npx tsx scripts/go_live_preflight.ts --init-tokens');
  console.log('  2. Apply DB migration (if DATABASE_URL set): npx tsx scripts/go_live_preflight.ts --apply-db');
  console.log('  3. Sync secrets to Vercel & deploy:           npx vercel --prod');
  console.log('  4. Verify automation suite:                  npx tsx scripts/verify_commerce_automation.ts\n');
}

main().catch((err) => {
  console.error('Preflight error:', err.message);
  process.exit(1);
});
