// scripts/run_all_migrations.js
const fs = require('fs');
const path = require('path');

// Manually parse env files (try .env.local, .env, .env.vercel in order)
const envFiles = ['.env.local', '.env', '.env.vercel'];
for (const file of envFiles) {
  const envPath = path.join(__dirname, '..', file);
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const match = line.match(/^\s*([\w\.\-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = (match[2] || '').trim();
        if (value.startsWith('"') && value.endsWith('"')) value = value.substring(1, value.length - 1);
        if (value.startsWith("'") && value.endsWith("'")) value = value.substring(1, value.length - 1);
        // Only set if not already set, to respect precedence
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    });
  }
}

const { Client } = require('pg');

async function runAllMigrations() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const match = supabaseUrl.match(/https:\/\/([a-z0-9]+)\.supabase\.co/i);
  const projectRef = match ? match[1] : '';
  const password = process.env.DATABASE_PASSWORD || 'pHqrTQc2gpdSqnAx';

  if (!projectRef) {
    console.error("Error: Could not parse project ref from SUPABASE_URL / NEXT_PUBLIC_SUPABASE_URL.");
    console.error("Please configure SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL in your environment variables/file.");
    return false;
  }

  const strategies = [
    {
      label: "Shared connection pooler (IPv4-compatible, port 6543)",
      connectionString: `postgresql://postgres.${projectRef}:${encodeURIComponent(password)}@aws-1-eu-central-1.pooler.supabase.com:6543/postgres`
    },
    {
      label: "Direct database connection (IPv6, port 6543)",
      connectionString: `postgresql://postgres:${encodeURIComponent(password)}@db.${projectRef}.supabase.co:6543/postgres?sslmode=require`
    }
  ];

  let client;
  let connected = false;
  for (const strategy of strategies) {
    console.log(`Attempting connection Strategy: ${strategy.label}...`);
    client = new Client({
      connectionString: strategy.connectionString,
      ssl: {
        rejectUnauthorized: false
      }
    });
    try {
      await client.connect();
      console.log(`✔ Connected successfully using Strategy: ${strategy.label}`);
      connected = true;
      break;
    } catch (err) {
      console.warn(`⚠ Connection failed for strategy "${strategy.label}":`, err.message);
      try { await client.end(); } catch (e) {}
    }
  }

  if (!connected) {
    console.error("❌ All database connection strategies failed. Could not connect to Supabase.");
    return false;
  }

  try {
    console.log("✔ Connected successfully to database!");

    const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');
    if (!fs.existsSync(migrationsDir)) {
      throw new Error(`Migrations directory not found at: ${migrationsDir}`);
    }

    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort(); // Sort files alphabetically (e.g. 001_init.sql, 2026...sql)

    console.log(`Discovered ${files.length} SQL migration files in database folder.`);

    for (const file of files) {
      const migrationFile = path.join(migrationsDir, file);
      console.log(`Executing migration sequence: ${file}...`);
      const sql = fs.readFileSync(migrationFile, 'utf8');

      // Execute each query file
      await client.query(sql);
      console.log(`✔ successfully applied: ${file}`);
    }

    console.log("\nVerifying database schema existence...");
    const checkQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('leads', 'dnc', 'logs', 'scrape_jobs', 'sync_logs', 'outreach_campaigns');
    `;
    const res = await client.query(checkQuery);
    const existingTables = res.rows.map(r => r.table_name);
    console.log("Existing tables in public schema:", existingTables);
    
    const requiredTables = ['leads', 'dnc', 'logs', 'scrape_jobs', 'sync_logs', 'outreach_campaigns'];
    const missing = requiredTables.filter(t => !existingTables.includes(t));
    
    if (missing.length === 0) {
      console.log("🎉 SUCCESS: All required tables exist and schema database is hardened!");
      return true;
    } else {
      console.warn("⚠ Warning: The following tables are still missing:", missing);
      return false;
    }
  } catch (err) {
    console.error("❌ SQL Migration sequence failed:", err.message);
    return false;
  } finally {
    await client.end();
  }
}

if (require.main === module) {
  runAllMigrations();
}

module.exports = { runAllMigrations };
