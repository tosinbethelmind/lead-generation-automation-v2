const { Client } = require('pg');

const projectRef = 'szyuterncawfxwzhvwcf';
const password = 'pHqrTQc2gpdSqnAx';

const configs = [
  {
    label: "Standard username format",
    connectionString: `postgresql://postgres.${projectRef}:${password}@aws-0-eu-central-1.pooler.supabase.com:6543/postgres`
  },
  {
    label: "Options parameter format (port 6543)",
    connectionString: `postgresql://postgres:${password}@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?options=project%3D${projectRef}`
  },
  {
    label: "Options parameter format (port 5432)",
    connectionString: `postgresql://postgres:${password}@aws-0-eu-central-1.pooler.supabase.com:5432/postgres?options=project%3D${projectRef}`
  },
  {
    label: "Tenant-specific hostname (port 6543)",
    connectionString: `postgresql://postgres:${password}@szyuterncawfxwzhvwcf.supabase.co:6543/postgres`
  },
  {
    label: "Tenant-specific hostname (port 5432)",
    connectionString: `postgresql://postgres:${password}@szyuterncawfxwzhvwcf.supabase.co:5432/postgres`
  },
  {
    label: "Direct IPv4 (using rest endpoint as host? No, that won't work, but let's try)",
    connectionString: `postgresql://postgres.${projectRef}:${password}@db.szyuterncawfxwzhvwcf.supabase.co:6543/postgres`
  }
];

async function run() {
  for (const config of configs) {
    console.log(`Trying: ${config.label}...`);
    const client = new Client({
      connectionString: config.connectionString,
      ssl: { rejectUnauthorized: false }
    });
    try {
      await client.connect();
      console.log(`SUCCESS! Connected successfully using ${config.label}`);
      const res = await client.query('SELECT NOW()');
      console.log('Query result:', res.rows[0]);
      await client.end();
      return;
    } catch (err) {
      console.log(`Failed: ${err.message}`);
      try { await client.end(); } catch (e) {}
    }
  }
  console.log("All connection variations failed.");
}

run();
