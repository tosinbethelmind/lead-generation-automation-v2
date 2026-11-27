const fs = require('fs');
const path = require('path');

// Manually parse env files (try .env.local, .env, .env.vercel in order)
const envFiles = ['.env.local', '.env', '.env.vercel'];
for (const file of envFiles) {
  const envPath = path.join(__dirname, file);
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

async function runMigration() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const match = supabaseUrl.match(/https:\/\/([a-z0-9]+)\.supabase\.co/i);
  const projectRef = match ? match[1] : '';
  const password = process.env.DATABASE_PASSWORD || 'pHqrTQc2gpdSqnAx';

  const connectionString = projectRef
    ? `postgresql://postgres:${encodeURIComponent(password)}@db.${projectRef}.supabase.co:6543/postgres?sslmode=require`
    : null;

  if (!connectionString) {
    console.error("Error: Could not parse project ref from SUPABASE_URL / NEXT_PUBLIC_SUPABASE_URL.");
    process.exit(1);
  }

  console.log("Connecting to Supabase PostgreSQL database...");
  const client = new Client({ 
    connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log("✔ Connected successfully!");

    const migrationPath = path.join(__dirname, 'supabase', 'migrations', '20260701_cache_columns_and_overrides.sql');
    if (!fs.existsSync(migrationPath)) {
      throw new Error(`Migration file not found at ${migrationPath}`);
    }

    console.log("Reading migration SQL script...");
    const sql = fs.readFileSync(migrationPath, 'utf8');

    console.log("Executing SQL migration script...");
    await client.query(sql);
    console.log("✔ SQL Migration executed successfully! Caching and override columns added to 'leads' table.");
  } catch (err) {
    console.error("❌ Migration failed:", err);
  } finally {
    await client.end();
  }
}

runMigration();
