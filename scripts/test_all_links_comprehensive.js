/**
 * scripts/test_all_links_comprehensive.js
 * Runs a complete test of all production links, previews, and core routes.
 */
const https = require('https');
const http = require('http');
const { URL } = require('url');

const testUrls = [
  // 1. Core Domains
  { name: 'WWW Home', url: 'https://www.bethelmindanalytics.com' },
  { name: 'WWW /home direct', url: 'https://www.bethelmindanalytics.com/home' },
  { name: 'Apex Domain', url: 'https://bethelmindanalytics.com' },

  // 2. Prospect Preview Links
  { name: "Preview: FAVOURITES' KITCHEN", url: 'https://www.bethelmindanalytics.com/preview/favourites_kitchen' },
  { name: 'Preview: Zeek Solar Shop', url: 'https://www.bethelmindanalytics.com/preview/zeek_solar_shop' },
  { name: 'Preview: BlessIfe Catering', url: 'https://www.bethelmindanalytics.com/preview/blessife_catering_services' },
  { name: 'Preview: Lagos Business Owner', url: 'https://www.bethelmindanalytics.com/preview/lagos_business_owner' },
  { name: 'Preview: Healthcare Kaduna', url: 'https://www.bethelmindanalytics.com/preview/healthcare_kaduna_34' },

  // 3. Fallback Vercel Production Mirror Links
  { name: 'Vercel Mirror: Root', url: 'https://lead-generation-automation-v2-dk3imdpd4-tosin4.vercel.app' },
  { name: 'Vercel Mirror: Preview', url: 'https://lead-generation-automation-v2-dk3imdpd4-tosin4.vercel.app/preview/favourites_kitchen' },

  // 4. Key Platform Pages
  { name: 'Legal Terms', url: 'https://www.bethelmindanalytics.com/legal/terms' },
  { name: 'Legal Privacy', url: 'https://www.bethelmindanalytics.com/legal/privacy' }
];

function fetchWithRedirect(targetUrl, maxRedirects = 3) {
  return new Promise((resolve) => {
    const start = Date.now();

    function doReq(curUrl, redirectCount) {
      if (redirectCount > maxRedirects) {
        return resolve({
          url: targetUrl,
          statusCode: 0,
          latency: Date.now() - start,
          status: 'TOO_MANY_REDIRECTS',
          finalUrl: curUrl
        });
      }

      let parsed;
      try {
        parsed = new URL(curUrl);
      } catch (e) {
        return resolve({ url: targetUrl, statusCode: 0, latency: Date.now() - start, status: 'INVALID_URL', error: e.message });
      }

      const client = parsed.protocol === 'http:' ? http : https;
      const req = client.get(curUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        timeout: 10000
      }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const redirectUrl = new URL(res.headers.location, curUrl).toString();
          return doReq(redirectUrl, redirectCount + 1);
        }

        let body = '';
        res.on('data', chunk => {
          if (body.length < 50000) body += chunk;
        });
        res.on('end', () => {
          const title = body.match(/<title[^>]*>(.*?)<\/title>/i)?.[1]?.trim() || '';
          resolve({
            url: targetUrl,
            finalUrl: curUrl,
            statusCode: res.statusCode,
            latency: Date.now() - start,
            status: res.statusCode === 200 ? 'OK' : `STATUS_${res.statusCode}`,
            title: title ? title.replace(/&amp;/g, '&').replace(/&#39;/g, "'") : '',
            sizeBytes: body.length
          });
        });
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({ url: targetUrl, statusCode: 0, latency: Date.now() - start, status: 'TIMEOUT' });
      });

      req.on('error', (err) => {
        resolve({ url: targetUrl, statusCode: 0, latency: Date.now() - start, status: 'ERROR', error: err.message });
      });
    }

    doReq(targetUrl, 0);
  });
}

async function run() {
  console.log('\n========================================================================');
  console.log('🚀 TESTING ALL LIVE PRODUCTION LINKS (Bethelmind Analytics Lagos Desk)');
  console.log('========================================================================\n');

  const results = [];
  for (const item of testUrls) {
    process.stdout.write(`Testing [${item.name}] ... `);
    const res = await fetchWithRedirect(item.url);
    results.push({ ...item, ...res });
    if (res.statusCode === 200) {
      console.log(`✅ 200 OK (${res.latency}ms) [${res.title || 'OK'}]`);
    } else {
      console.log(`⚠️ ${res.status} (${res.latency}ms) ${res.error || ''}`);
    }
  }

  console.log('\n========================================================================');
  console.log('SUMMARY TABLE:');
  console.log('========================================================================');
  console.table(results.map(r => ({
    Name: r.name,
    Status: r.statusCode === 200 ? '✅ 200 OK' : `❌ ${r.status}`,
    Latency: `${r.latency}ms`,
    Title: r.title ? (r.title.slice(0, 35) + '...') : (r.error || '-'),
    URL: r.url
  })));

  const allPassed = results.every(r => r.statusCode === 200);
  console.log(`\nResult: ${results.filter(r => r.statusCode === 200).length} / ${results.length} links responded with 200 OK.`);
}

run();
