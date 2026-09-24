const fs = require('fs');
const path = require('path');
const https = require('https');
const { Client } = require('pg');

// 1. Parse env.local manually
const envPath = path.join(__dirname, '..', '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('Error: .env.local file not found at:', envPath);
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([^#=\s]+)\s*=\s*(.*)$/);
  if (match) {
    let val = match[2].trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.substring(1, val.length - 1);
    env[match[1]] = val;
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const password = env.DATABASE_PASSWORD;

if (!supabaseUrl || !password) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL or DATABASE_PASSWORD missing from .env.local.');
  process.exit(1);
}

// Extract projectRef from URL
const urlMatch = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/);
if (!urlMatch) {
  console.error('Error: Could not extract projectRef from Supabase URL:', supabaseUrl);
  process.exit(1);
}
const projectRef = urlMatch[1];
console.log(`Detected Project Ref: ${projectRef}`);

// 2. DNS-over-HTTPS resolution function
function resolveDoh(host) {
  return new Promise((resolve, reject) => {
    const url = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(host)}&type=A`;
    const options = {
      headers: { 'accept': 'application/dns-json' }
    };
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.Answer && json.Answer.length > 0) {
            const aRecord = json.Answer.find(ans => ans.type === 1);
            if (aRecord) {
              resolve(aRecord.data);
              return;
            }
          }
          reject(new Error(`No A record found in DoH answer for ${host}`));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function runMigration() {
  const poolerHost = 'aws-1-eu-central-1.pooler.supabase.com';
  console.log(`Resolving pooler address via DoH for: ${poolerHost}...`);
  let resolvedIp = '';
  try {
    resolvedIp = await resolveDoh(poolerHost);
    console.log(`✅ Resolved ${poolerHost} to ${resolvedIp}`);
  } catch (err) {
    console.warn(`⚠️ DoH resolution failed: ${err.message}. Falling back to default hostname.`);
    resolvedIp = poolerHost;
  }

  // Build the connection string using the IP (with host parameter for SNI/routing)
  const connectionString = `postgresql://postgres.${projectRef}:${encodeURIComponent(password)}@${resolvedIp}:6543/postgres`;
  console.log('Connecting to database...');

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000
  });

  try {
    await client.connect();
    console.log('✅ Connected successfully to the new database!');

    // Read the schema file
    const schemaPath = path.join(__dirname, '..', 'supabase_schema.sql');
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema file not found at ${schemaPath}`);
    }

    console.log('Reading supabase_schema.sql...');
    const sql = fs.readFileSync(schemaPath, 'utf8');

    console.log('Applying database schema. This may take a moment...');
    // We run the SQL schema commands
    await client.query(sql);
    console.log('🎉 SCHEMA MIGRATION COMPLETED SUCCESSFULLY!');

  } catch (err) {
    console.error('❌ Migration Failed:', err.message || err);
  } finally {
    try {
      await client.end();
    } catch (_) {}
  }
}

runMigration();
