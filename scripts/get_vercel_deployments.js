const https = require('https');
const path = require('path');
const fs = require('fs');

function loadEnv() {
  const envPath = path.join(__dirname, '../.env.local');
  if (!fs.existsSync(envPath)) return;
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const m = line.match(/^([^#=\s][^=]*)=(.+)$/);
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '');
  });
}
loadEnv();

const token = process.env.VERCEL_TOKEN;

console.log('Fetching Vercel deployments...');

const req = https.request({
  hostname: 'api.vercel.com',
  path: `/v6/deployments?limit=5`,
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
  }
}, res => {
  let raw = '';
  res.on('data', d => raw += d);
  res.on('end', () => {
    try {
      const data = JSON.parse(raw);
      if (data.deployments) {
        data.deployments.forEach(d => {
          console.log(`- ${d.name} (${d.state}): https://${d.url}`);
        });
      } else {
        console.log(raw);
      }
    } catch (e) {
      console.log(raw);
    }
  });
});

req.on('error', console.error);
req.end();
