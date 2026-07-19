// scripts/migrate_schedule.js
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const regions = [
  'us-east-1', 'us-east-2', 'us-west-1', 'us-west-2',
  'ca-central-1', 'sa-east-1', 'eu-west-1', 'eu-west-2',
  'eu-west-3', 'eu-central-1', 'eu-central-2', 'eu-north-1',
  'me-central-1', 'ap-southeast-1', 'ap-southeast-2',
  'ap-south-1', 'ap-northeast-1', 'ap-northeast-2', 'ap-northeast-3'
];

function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) {
    console.warn("No .env.local file found.");
    return;
  }
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const match = trimmed.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let val = match[2].trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.substring(1, val.length - 1);
      }
      process.env[key] = val;
    }
  });
}

async function run() {
  loadEnv();
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
  const password = process.env.DATABASE_PASSWORD;
  
  let projectRef = '';
  const match = supabaseUrl.match(/https:\/\/([^.]+)\.supabase/);
  if (match) {
    projectRef = match[1];
  }

  if (!projectRef || !password) {
    console.error("Error: Could not extract project ref or DATABASE_PASSWORD is not set.");
    process.exit(1);
  }

  const connectionStrings = [
    `postgresql://postgres:${encodeURIComponent(password)}@db.${projectRef}.supabase.co:6543/postgres?sslmode=require`
  ];

  for (const reg of regions) {
    connectionStrings.push(
      `postgresql://postgres.${projectRef}:${encodeURIComponent(password)}@aws-0-${reg}.pooler.supabase.com:6543/postgres?sslmode=require`
    );
  }

  let client;
  let connected = false;

  for (const connectionString of connectionStrings) {
    const parts = connectionString.split('@');
    const host = parts.length > 1 ? parts[1].split(':')[0] : 'unknown';
    const port = parts.length > 1 ? parts[1].split(':')[1]?.split('/')[0] : 'unknown';
    
    console.log(`Trying connection to ${host}:${port}...`);
    client = new Client({
      connectionString,
      ssl: { rejectUnauthorized: false }
    });

    try {
      await client.connect();
      console.log(`✔ Connected successfully to ${host}:${port}`);
      connected = true;
      break;
    } catch (err) {
      // Quietly try the next one
      try { await client.end(); } catch (e) {}
    }
  }

  if (!connected) {
    console.error("❌ All database connection methods failed.");
    process.exit(1);
  }

  try {
    const sqlPath = path.join(__dirname, '..', 'supabase', 'migrations', '20260705_create_query_schedule.sql');
    if (!fs.existsSync(sqlPath)) {
      throw new Error(`SQL file not found at ${sqlPath}`);
    }

    const sql = fs.readFileSync(sqlPath, 'utf8');
    console.log("Executing SQL migration for query_schedule...");
    await client.query(sql);
    console.log("✔ query_schedule migration executed successfully!");
  } catch (err) {
    console.error("❌ Migration failed:", err.message);
  } finally {
    await client.end();
  }
}

run();
