const https = require('https');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '../.env.local');
let token = '';
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(l => {
    const m = l.match(/^VERCEL_TOKEN=(.+)$/);
    if (m) token = m[1].trim().replace(/^["']|["']$/g, '');
  });
}

const projectId = 'prj_vfMEvGXha5E1pvAZLXY9F9F0dp0n';
const payload = JSON.stringify({
  redirect: 'www.bethelmindanalytics.com',
  redirectStatusCode: 308
});

const req = https.request({
  hostname: 'api.vercel.com',
  path: `/v9/projects/${projectId}/domains/bethelmindanalytics.com`,
  method: 'PATCH',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload)
  }
}, res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => console.log('Update status:', res.statusCode, d));
});
req.write(payload);
req.end();
