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

const req = https.request({
  hostname: 'api.vercel.com',
  path: `/v9/projects/prj_vfMEvGXha5E1pvAZLXY9F9F0dp0n/domains/bethelmindanalytics.com`,
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
  }
}, res => {
  let raw = '';
  res.on('data', d => raw += d);
  res.on('end', () => {
    console.log(raw);
  });
});

req.on('error', console.error);
req.end();
