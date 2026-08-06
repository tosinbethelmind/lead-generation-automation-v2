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
const oldProjectId = 'prj_rgw3SuG30SnFMSYp4D5YGnM6MQfz';
const targetProjectId = 'prj_vfMEvGXha5E1pvAZLXY9F9F0dp0n'; // lead-generation-automation-v2

function request(method, pathUrl, body = null) {
  return new Promise((resolve) => {
    const payload = body ? JSON.stringify(body) : null;
    const req = https.request({
      hostname: 'api.vercel.com',
      path: pathUrl,
      method: method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {})
      }
    }, res => {
      let raw = '';
      res.on('data', d => raw += d);
      res.on('end', () => resolve({ status: res.statusCode, body: raw }));
    });
    req.on('error', console.error);
    if (payload) req.write(payload);
    req.end();
  });
}

async function main() {
  console.log('1. Removing domain from old project:', oldProjectId);
  await request('DELETE', `/v9/projects/${oldProjectId}/domains/bethelmindanalytics.com`);
  await request('DELETE', `/v9/projects/${oldProjectId}/domains/www.bethelmindanalytics.com`);

  console.log('2. Adding domain to target project:', targetProjectId);
  const addApex = await request('POST', `/v10/projects/${targetProjectId}/domains`, { name: 'bethelmindanalytics.com' });
  console.log('Apex Add Status:', addApex.status, addApex.body);

  const addWww = await request('POST', `/v10/projects/${targetProjectId}/domains`, { name: 'www.bethelmindanalytics.com' });
  console.log('WWW Add Status:', addWww.status, addWww.body);
}

main();
