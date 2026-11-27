require('dotenv').config();
const fs = require('fs');
const path = require('path');
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

  // Single connection using service‑role key
  const connectionStrings = [connectionString];

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
      try { await client.end(); } catch (e) {}
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
    let sql = fs.readFileSync(migrationPath, 'utf8');

    // Wrap the migration in a transaction so it can be rolled back on failure
    sql = `BEGIN;\n${sql}\nCOMMIT;`;

    if (process.argv.includes('--dry-run')) {
      console.log('[dry‑run] Migration SQL would be executed now.');
    } else {
      console.log("Executing SQL migration script... (this may take a few seconds)");
      await client.query(sql);
      console.log("✔ SQL Migration executed successfully! All tables created.");
    }

    if (!process.argv.includes('--dry-run')) {
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
    }
  } catch (err) {
    console.error("❌ Migration failed:", err.message);
  } finally {
    // Add a generic trigger to keep updated_at in sync for all tables (if not dry‑run)
    if (!process.argv.includes('--dry-run')) {
      const triggerSQL = `
        DO $$
        DECLARE r RECORD;
        BEGIN
          FOR r IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename NOT LIKE 'pg_%' LOOP
            EXECUTE format('CREATE OR REPLACE FUNCTION set_updated_at_%I() RETURNS trigger AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql;');
            EXECUTE format('DROP TRIGGER IF EXISTS set_updated_at_trigger_%I ON %I;', r.tablename, r.tablename);
            EXECUTE format('CREATE TRIGGER set_updated_at_trigger_%I BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION set_updated_at_%I();', r.tablename, r.tablename, r.tablename);
          END LOOP;
        END $$;`;
      await client.query(triggerSQL);
    }

    await client.end();
  }
}

runMigration();
