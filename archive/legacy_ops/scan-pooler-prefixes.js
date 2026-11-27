const { Client } = require('pg');

const projectRef = 'szyuterncawfxwzhvwcf';
const password = 'pHqrTQc2gpdSqnAx';

const regions = ['eu-central-1', 'eu-west-1', 'eu-west-2', 'eu-west-3'];
const prefixes = ['aws-0', 'aws-1', 'aws-2', 'aws-3'];

async function scan() {
  for (const region of regions) {
    for (const prefix of prefixes) {
      const host = `${prefix}-${region}.pooler.supabase.com`;
      const connectionString = `postgresql://postgres.${projectRef}:${password}@${host}:6543/postgres`;
      console.log(`Checking: ${host}...`);
      const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 5000
      });
      try {
        await client.connect();
        console.log(`🎉 SUCCESS: Connected to ${host}!`);
        await client.end();
        return;
      } catch (err) {
        console.log(`  Result for ${host}: ${err.message}`);
        try { await client.end(); } catch (e) {}
      }
    }
  }
  console.log("Scan finished.");
}

scan();
