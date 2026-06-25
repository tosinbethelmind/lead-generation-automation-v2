const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

async function runMigration() {
  const password = process.argv[2] || process.env.DB_PASSWORD;
  
  if (!password) {
    console.error("Error: Please provide your database password as a command line argument or set the DB_PASSWORD environment variable.");
    console.error("Usage: node run-migration.js <your_database_password>");
    process.exit(1);
  }

  // Try different connection methods sequentially
  const connectionStrings = [
    // 1. Pooler Session Mode (Port 5432)
    `postgresql://postgres.szyuterncawfxwzhvwcf:${encodeURIComponent(password)}@aws-0-eu-central-1.pooler.supabase.com:5432/postgres?sslmode=require`,
    // 2. Pooler Transaction Mode (Port 6543)
    `postgresql://postgres.szyuterncawfxwzhvwcf:${encodeURIComponent(password)}@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?sslmode=require`,
    // 3. Direct Connection via resolved IPv6 literal
    `postgresql://postgres:${encodeURIComponent(password)}@[2a05:d014:1e9b:b301:5594:5c7e:941c:8486]:5432/postgres?sslmode=require`
  ];

  let client;
  let connected = false;

  for (let i = 0; i < connectionStrings.length; i++) {
    const connectionString = connectionStrings[i];
    console.log(`\nAttempting connection method ${i + 1}...`);
    client = new Client({ 
      connectionString,
      ssl: {
        rejectUnauthorized: false
      }
    });

    try {
      await client.connect();
      console.log(`✔ Connection method ${i + 1} succeeded!`);
      connected = true;
      break;
    } catch (err) {
      console.warn(`⚠ Method ${i + 1} failed:`, err.message);
      try {
        await client.end();
      } catch (e) {}
    }
  }

  if (!connected) {
    console.error("\n❌ All database connection methods failed.");
    process.exit(1);
  }

  try {
    const migrationPath = path.join(__dirname, 'supabase', 'migrations', '001_init.sql');
    if (!fs.existsSync(migrationPath)) {
      throw new Error(`Migration file not found at ${migrationPath}`);
    }

    console.log("Reading 001_init.sql migration script...");
    const sql = fs.readFileSync(migrationPath, 'utf8');

    console.log("Executing SQL migration script... (this may take a few seconds)");
    await client.query(sql);
    console.log("✔ SQL Migration executed successfully! All tables created.");

    // Validate that tables now exist
    console.log("\nVerifying table schema existence...");
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
      console.log("🎉 SUCCESS: All 6 tables are verified and ready!");
    } else {
      console.warn("⚠ Warning: The following tables are still missing:", missing);
    }
  } catch (err) {
    console.error("❌ Migration failed:", err.message);
  } finally {
    await client.end();
  }
}

runMigration();
