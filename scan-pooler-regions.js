const { Client } = require('pg');

const projectRef = 'szyuterncawfxwzhvwcf';
const password = 'pHqrTQc2gpdSqnAx';

const regions = [
  'us-east-1', 'us-east-2', 'us-west-1', 'us-west-2',
  'ca-central-1', 'sa-east-1', 'eu-west-1', 'eu-west-2',
  'eu-west-3', 'eu-central-1', 'eu-north-1',
  'me-central-1', 'ap-southeast-1', 'ap-southeast-2',
  'ap-south-1', 'ap-northeast-1', 'ap-northeast-2', 'ap-northeast-3'
];

async function scan() {
  for (const region of regions) {
    const host = `aws-0-${region}.pooler.supabase.com`;
    const connectionString = `postgresql://postgres.${projectRef}:${password}@${host}:6543/postgres`;
    console.log(`Checking region: ${region} (${host})...`);
    const client = new Client({
      connectionString,
      ssl: { rejectUnauthorized: false }
    });
    try {
      await client.connect();
      console.log(`🎉 SUCCESS in region ${region}!`);
      await client.end();
      return;
    } catch (err) {
      console.log(`  Error: ${err.message}`);
      try { await client.end(); } catch (e) {}
    }
  }
  console.log("Scan finished.");
}

scan();
