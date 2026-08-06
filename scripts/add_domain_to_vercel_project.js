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
const projectId = 'prj_vfMEvGXha5E1pvAZLXY9F9F0dp0n';

async function addDomain(domain) {
  return new Promise((resolve) => {
    const payload = JSON.stringify({ name: domain });
    const req = https.request({
      hostname: 'api.vercel.com',
      path: `/v10/projects/${projectId}/domains`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, res => {
      let raw = '';
      res.on('data', d => raw += d);
      res.on('end', () => {
        console.log(`Add ${domain} Status: ${res.statusCode}`);
        console.log(`Response: ${raw}`);
        resolve();
      });
    });
    req.on('error', console.error);
    req.write(payload);
    req.end();
  });
}

async function main() {
  await addDomain('bethelmindanalytics.com');
  await addDomain('www.bethelmindanalytics.com');
}

main();
