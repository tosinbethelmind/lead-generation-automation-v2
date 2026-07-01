const { Client } = require('pg');

const regions = [
  'us-east-1', 'us-east-2', 'us-west-1', 'us-west-2',
  'ca-central-1', 'sa-east-1', 'eu-west-1', 'eu-west-2',
  'eu-west-3', 'eu-central-1', 'eu-central-2', 'eu-north-1',
  'me-central-1', 'ap-southeast-1', 'ap-southeast-2',
  'ap-south-1', 'ap-northeast-1', 'ap-northeast-2', 'ap-northeast-3'
];

const projectRef = 'xrbuzirrsybuudmbklsm';
const password = 'pHqrTQc2gpdSqnAx';

async function testConnections() {
  console.log(`Testing connections for project ${projectRef}...`);
  
  for (const reg of regions) {
    const host = `aws-0-${reg}.pooler.supabase.com`;
    const connectionString = `postgresql://postgres.${projectRef}:${password}@${host}:6543/postgres`;
    
    console.log(`Testing ${host}...`);
    const client = new Client({ 
      connectionString,
      ssl: { rejectUnauthorized: false }
    });
    
    try {
      await client.connect();
      console.log(`SUCCESS! Connected to ${host}`);
      
      const res = await client.query('SELECT NOW()');
      console.log('Query result:', res.rows[0]);
      
      await client.end();
      process.exit(0);
    } catch (err) {
      if (err.message.includes('tenant') || err.message.includes('not found') || err.message.includes('getaddrinfo ENOTFOUND')) {
        // console.log(`  Failed: ${err.message}`);
      } else {
        console.log(`  Error: ${err.message}`);
      }
      try { await client.end(); } catch (e) {}
    }
  }
  console.log('All connection attempts failed.');
}

testConnections();
