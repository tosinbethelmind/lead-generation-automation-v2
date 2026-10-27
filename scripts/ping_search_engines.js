/**
 * @file scripts/ping_search_engines.js
 * BETHELMIND DIGITAL SOLUTIONS (CAC Reg: 9912717)
 * 
 * Automatically pings Google, Bing, and IndexNow endpoints with our updated sitemap
 * and high-priority programmatic SEO URLs to accelerate indexing from weeks to hours.
 */

const https = require('https');
const http = require('http');

const SITEMAP_URL = 'https://www.bethelmindanalytics.com/sitemap.xml';
const HOST = 'www.bethelmindanalytics.com';

const PRIORITY_URLS = [
  'https://www.bethelmindanalytics.com/tools/solar-boq/ikeja',
  'https://www.bethelmindanalytics.com/tools/solar-boq/lekki',
  'https://www.bethelmindanalytics.com/tools/solar-boq/abuja-wuse-2',
  'https://www.bethelmindanalytics.com/tools/solar-boq/port-harcourt-trans-amadi',
  'https://www.bethelmindanalytics.com/tools/tokunbo-duty/toyota-corolla-2015',
  'https://www.bethelmindanalytics.com/tools/tokunbo-duty/lexus-rx350-2017',
  'https://www.bethelmindanalytics.com/tools/tokunbo-duty/toyota-camry-2016',
  'https://www.bethelmindanalytics.com/tools/tokunbo-duty/mercedes-benz-c300-2017',
  'https://www.bethelmindanalytics.com/tools/construction-estimator/lekki-phase-1',
  'https://www.bethelmindanalytics.com/tools/construction-estimator/ibeju-lekki',
  'https://www.bethelmindanalytics.com/tools/construction-estimator/abuja-guzape',
  'https://www.bethelmindanalytics.com/vin',
  'https://www.bethelmindanalytics.com/solar'
];

function pingUrl(url) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({ url, statusCode: res.statusCode, body: body.slice(0, 150) });
      });
    }).on('error', (err) => {
      resolve({ url, error: err.message });
    });
  });
}

function submitIndexNow() {
  return new Promise((resolve) => {
    const payload = JSON.stringify({
      host: HOST,
      key: 'bethelmindindexkey2026',
      keyLocation: `https://${HOST}/bethelmindindexkey2026.txt`,
      urlList: PRIORITY_URLS
    });

    const req = https.request('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({ platform: 'IndexNow (Bing/Yandex/Seznam)', statusCode: res.statusCode, body });
      });
    });

    req.on('error', (err) => {
      resolve({ platform: 'IndexNow', error: err.message });
    });

    req.write(payload);
    req.end();
  });
}

async function main() {
  console.log('🚀 [P4 AUTOMATION] Pinging Search Engines for Bethelmind Programmatic SEO...');
  console.log(`• Sitemap Target: ${SITEMAP_URL}`);
  console.log(`• Total Priority Dynamic Routes: ${PRIORITY_URLS.length}\n`);

  // 1. Ping Google Search Console Sitemap endpoint
  const googlePingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`;
  console.log('1. Pinging Google Sitemap Endpoint...');
  const googleRes = await pingUrl(googlePingUrl);
  console.log(`   Google Status: ${googleRes.statusCode || 'Done'} (${googleRes.error || 'Acknowledged'})\n`);

  // 2. Ping Bing Webmaster endpoint
  const bingPingUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`;
  console.log('2. Pinging Bing Webmaster Endpoint...');
  const bingRes = await pingUrl(bingPingUrl);
  console.log(`   Bing Status: ${bingRes.statusCode || 'Done'} (${bingRes.error || 'Acknowledged'})\n`);

  // 3. Submit directly to IndexNow
  console.log('3. Submitting 13 Priority Hub URLs to IndexNow API...');
  const indexNowRes = await submitIndexNow();
  console.log(`   IndexNow Status: HTTP ${indexNowRes.statusCode || 'N/A'} (${indexNowRes.error || 'Submitted successfully'})\n`);

  console.log('✅ Search engine indexing notification sequence completed!');
}

main().catch(console.error);
