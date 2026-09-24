const https = require('https');
const path = require('path');
const fs = require('fs');

const envPath = path.join(__dirname, '../.env.local');
let token = '';
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const m = line.match(/^VERCEL_TOKEN=(.+)$/);
    if (m) token = m[1].trim().replace(/^["']|["']$/g, '');
  });
}

async function checkConfig(domain) {
  return new Promise(resolve => {
    https.get({
      hostname: 'api.vercel.com',
      path: `/v6/domains/${domain}/config`,
      headers: { Authorization: `Bearer ${token}` }
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        console.log(`=== Config for ${domain} ===`);
        console.log(JSON.stringify(JSON.parse(d), null, 2));
        resolve();
      });
    });
  });
}

async function run() {
  await checkConfig('bethelmindanalytics.com');
  await checkConfig('www.bethelmindanalytics.com');
}
run();
