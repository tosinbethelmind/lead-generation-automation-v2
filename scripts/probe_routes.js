const http = require('http');

const urls = [
  'http://localhost:3006/home',
  'http://localhost:3006/tools',
  'http://localhost:3006/tools/solar-boq',
  'http://localhost:3006/pricing',
  'http://localhost:3006/results',
  'http://localhost:3006/how-it-works',
  'http://localhost:3006/support',
  'http://localhost:3006/contact',
  'http://localhost:3006/legal/privacy',
  'http://localhost:3006/legal/terms',
  'http://localhost:3006/legal/refund',
  'http://localhost:3006/api/sector-tools?action=list'
];

async function check() {
  console.log('Testing routes on port 3006...');
  for (const url of urls) {
    const t0 = Date.now();
    try {
      const res = await new Promise((resolve, reject) => {
        const req = http.get(url, { timeout: 60000 }, (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => resolve({ statusCode: res.statusCode, length: data.length }));
        });
        req.on('error', reject);
        req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
      });
      console.log(`[${res.statusCode}] ${url} (${res.length} bytes, ${Date.now() - t0}ms)`);
    } catch (err) {
      console.error(`[ERR] ${url}: ${err.message} (${Date.now() - t0}ms)`);
    }
  }
}
check();
