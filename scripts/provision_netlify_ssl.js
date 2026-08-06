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

const token = process.env.NETLIFY_TOKEN;
const siteId = process.env.NETLIFY_SITE_ID;

console.log(`Provisioning SSL for Netlify Site ${siteId}...`);

const req = https.request({
  hostname: 'api.netlify.com',
  path: `/api/v1/sites/${siteId}/ssl`,
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
}, res => {
  let raw = '';
  res.on('data', d => raw += d);
  res.on('end', () => {
    console.log(`SSL Provision Status: ${res.statusCode}`);
    console.log(`Response: ${raw.slice(0, 300)}`);
  });
});

req.on('error', console.error);
req.end();
