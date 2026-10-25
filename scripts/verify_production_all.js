const https = require('https');

const endpoints = [
  'https://www.bethelmindanalytics.com/tools',
  'https://www.bethelmindanalytics.com/calc/wealth-calculator.html',
  'https://www.bethelmindanalytics.com/calc/wealth-calculator',
  'https://www.bethelmindanalytics.com/tools/wealth-calculator',
  'https://www.bethelmindanalytics.com/tools/deal-calculator',
  'https://www.bethelmindanalytics.com/tools/solar-boq',
  'https://www.bethelmindanalytics.com/tools/ai-stack-finder',
  'https://www.bethelmindanalytics.com/manifest.webmanifest',
  'https://www.bethelmindanalytics.com/home'
];

async function checkUrl(url) {
  return new Promise((resolve) => {
    const req = https.get(url, (res) => {
      let body = '';
      res.on('data', chunk => {
        if (body.length < 50000) body += chunk;
      });
      res.on('end', () => {
        const hasLeakedToken = body.includes('bethelmind_admin_2026');
        resolve({
          url,
          status: res.statusCode,
          hasLeakedToken,
          location: res.headers.location || null
        });
      });
    });
    req.on('error', (err) => {
      resolve({ url, status: 'ERR: ' + err.message, hasLeakedToken: false });
    });
    req.setTimeout(10000, () => {
      req.abort();
      resolve({ url, status: 'TIMEOUT', hasLeakedToken: false });
    });
  });
}

async function run() {
  console.log('=== PHYSICAL VERIFICATION OF ALL PRODUCTION ENDPOINTS ===\n');
  for (const u of endpoints) {
    const res = await checkUrl(u);
    const pass = (res.status === 200 || (res.status === 308 && res.location)) && !res.hasLeakedToken;
    const statusText = pass ? '✅ PASS' : '❌ FAIL';
    console.log(`${statusText} [HTTP ${res.status}] ${res.url} ${res.location ? '-> ' + res.location : ''}`);
    if (res.hasLeakedToken) {
      console.error(`  🚨 SECURITY ALERT: Admin token found in response body for ${res.url}!`);
    }
  }
  console.log('\n=== VERIFICATION COMPLETE ===');
}

run();
