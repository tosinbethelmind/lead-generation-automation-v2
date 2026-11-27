const { Client } = require('pg');

const ipv6 = '2a05:d014:1e9b:b301:5594:5c7e:941c:8486';
const password = 'pHqrTQc2gpdSqnAx';

async function run() {
  console.log(`Trying direct IPv6 address: ${ipv6} on port 5432...`);
  const client = new Client({
    host: ipv6,
    port: 5432,
    user: 'postgres',
    password: password,
    database: 'postgres',
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("SUCCESS! Connected via direct IPv6!");
    const res = await client.query('SELECT NOW()');
    console.log('Query result:', res.rows[0]);
    await client.end();
  } catch (err) {
    console.log(`Failed: ${err.message}`);
    try { await client.end(); } catch (e) {}
  }
}

run();
