const https = require('https');
const http = require('http');
const { URL } = require('url');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://www.bethelmindanalytics.com';

const TOOL_ROUTES = [
  '/tools',
  '/tools/solar-boq',
  '/tools/tokunbo-duty',
  '/tools/salon-booking',
  '/tools/restaurant-order',
  '/tools/retail-catalog',
  '/tools/mortgage-calculator',
  '/tools/clinic-hmo',
  '/tools/school-portal',
  '/tools/logistics-quote',
  '/tools/cac-filing',
  '/tools/shortlet-reconciler',
  '/tools/fake-alert-shield',
  '/tools/kids-learning',
  '/tools/biohack-longevity',
  '/tools/prayer-journal',
  '/tools/sure-score',
  '/tools/drama-radar',
  '/tools/saas-radar',
  '/tools/goal-grid',
  '/tools/typing-speed',
  '/tools/focus-timer',
  '/tools/runway-radar',
  '/tools/salary-calc',
  '/tools/higher-lower',
  '/tools/solar-savings',
  '/tools/crypto-dca',
  '/tools/wealth-calculator',
  '/tools/deal-calculator',
  '/tools/cashflow',
  '/tools/wholesaling-loi',
  '/tools/script-generator',
  '/tools/site-audit',
  '/tools/sports-edge',
  '/tools/ai-stack-finder',
  '/tools/footy-wordle'
];

const CALC_FILES = [
  'ai-stack-finder.html',
  'biohack-longevity.html',
  'cashflow-calculator.html',
  'crypto-dca.html',
  'drama-radar.html',
  'focus-timer.html',
  'footy-wordle.html',
  'goal-grid.html',
  'higher-lower.html',
  'index.html',
  'kids-learning.html',
  'monetization-widget.js',
  'prayer-journal.html',
  'runway-radar.html',
  'saas-radar.html',
  'salary-calc.html',
  'script-generator.html',
  'site-audit.html',
  'solar-savings.html',
  'sports-edge.html',
  'sure-score.html',
  'typing-speed.html',
  'wealth-calculator.html',
  'wholesaling-loi.html'
];

function fetchUrl(targetUrl, maxRedirects = 5) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const urlObj = new URL(targetUrl);
    const client = urlObj.protocol === 'https:' ? https : http;

    const req = client.get(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) BethelMindAudit/2026.1',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      timeout: 10000
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', async () => {
        const latency = Date.now() - startTime;
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location && maxRedirects > 0) {
          const redirectTarget = new URL(res.headers.location, targetUrl).toString();
          const redirectRes = await fetchUrl(redirectTarget, maxRedirects - 1);
          resolve({
            url: targetUrl,
            status: res.statusCode,
            redirectedTo: redirectTarget,
            finalStatus: redirectRes.finalStatus || redirectRes.status,
            latency: latency + (redirectRes.latency || 0),
            bodyLength: redirectRes.bodyLength,
            body: redirectRes.body,
            headers: res.headers
          });
        } else {
          resolve({
            url: targetUrl,
            status: res.statusCode,
            finalStatus: res.statusCode,
            latency,
            bodyLength: body.length,
            body,
            headers: res.headers
          });
        }
      });
    });

    req.on('error', (err) => {
      resolve({
        url: targetUrl,
        status: 'NETWORK_ERROR',
        finalStatus: 'NETWORK_ERROR',
        latency: Date.now() - startTime,
        error: err.message
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        url: targetUrl,
        status: 'TIMEOUT',
        finalStatus: 'TIMEOUT',
        latency: 10000,
        error: 'Request timed out after 10000ms'
      });
    });
  });
}

async function runFullInspection() {
  console.log(`========================================================================`);
  console.log(`🚀 INITIATING PHYSICAL INSPECTION: BETHELMIND ANALYTICS`);
  console.log(`Target: ${BASE_URL}`);
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log(`========================================================================\n`);

  const results = {
    summary: { total: 0, passed: 0, failed: 0, warnings: 0 },
    toolPages: [],
    calcFiles: [],
    embeddedIframes: [],
    externalLinks: [],
    failures: []
  };

  // Phase 1: Inspect all Tool Pages
  console.log(`--- [PHASE 1] INSPECTING ${TOOL_ROUTES.length} TOOL ROUTES ---`);
  for (const route of TOOL_ROUTES) {
    results.summary.total++;
    const fullUrl = `${BASE_URL}${route}`;
    const res = await fetchUrl(fullUrl);
    const pass = res.finalStatus === 200;

    if (pass) {
      results.summary.passed++;
      console.log(`  ✅ [${res.finalStatus}] ${route} (${res.latency}ms, ${res.bodyLength} bytes)`);
    } else {
      results.summary.failed++;
      console.log(`  ❌ [${res.finalStatus}] ${route} - FAILED!`);
      results.failures.push({ type: 'TOOL_ROUTE', url: fullUrl, status: res.finalStatus, error: res.error });
    }

    // Parse iframes and links
    if (res.body) {
      const iframeMatches = [...res.body.matchAll(/<iframe[^>]+src=["']([^"']+)["']/gi)];
      for (const m of iframeMatches) {
        const src = m[1];
        if (!results.embeddedIframes.includes(src)) {
          results.embeddedIframes.push(src);
        }
      }

      const selarMatches = [...res.body.matchAll(/https:\/\/selar\.com\/[^\s"'>]+/gi)];
      for (const s of selarMatches) {
        if (!results.externalLinks.includes(s[0])) {
          results.externalLinks.push(s[0]);
        }
      }

      const waMatches = [...res.body.matchAll(/https:\/\/wa\.me\/[^\s"'>]+/gi)];
      for (const w of waMatches) {
        if (!results.externalLinks.includes(w[0])) {
          results.externalLinks.push(w[0]);
        }
      }
    }

    results.toolPages.push({
      route,
      status: res.status,
      finalStatus: res.finalStatus,
      latency: res.latency,
      bodyLength: res.bodyLength,
      pass
    });
  }

  // Phase 2: Inspect all Standalone Calc / Game HTML & JS files
  console.log(`\n--- [PHASE 2] INSPECTING ${CALC_FILES.length} CALC / GAME STATIC ASSETS ---`);
  for (const file of CALC_FILES) {
    results.summary.total++;
    const fileUrl = `${BASE_URL}/calc/${file}`;
    const res = await fetchUrl(fileUrl);
    const pass = res.finalStatus === 200;

    if (pass) {
      results.summary.passed++;
      console.log(`  ✅ [${res.finalStatus}] /calc/${file} (${res.latency}ms, ${res.bodyLength} bytes)`);
    } else {
      results.summary.failed++;
      console.log(`  ❌ [${res.finalStatus}] /calc/${file} - FAILED!`);
      results.failures.push({ type: 'CALC_FILE', url: fileUrl, status: res.finalStatus, error: res.error });
    }

    results.calcFiles.push({
      file,
      status: res.status,
      finalStatus: res.finalStatus,
      latency: res.latency,
      bodyLength: res.bodyLength,
      pass
    });
  }

  // Phase 3: Inspect Embedded Iframes
  console.log(`\n--- [PHASE 3] INSPECTING ${results.embeddedIframes.length} EMBEDDED IFRAME TARGETS ---`);
  const iframeResults = [];
  for (const iframeSrc of results.embeddedIframes) {
    results.summary.total++;
    const targetUrl = iframeSrc.startsWith('http') ? iframeSrc : `${BASE_URL}${iframeSrc}`;
    const res = await fetchUrl(targetUrl);
    const pass = res.finalStatus === 200;

    if (pass) {
      results.summary.passed++;
      console.log(`  ✅ [${res.finalStatus}] Iframe: ${iframeSrc} (${res.latency}ms, ${res.bodyLength} bytes)`);
    } else {
      results.summary.failed++;
      console.log(`  ❌ [${res.finalStatus}] Iframe: ${iframeSrc} - FAILED!`);
      results.failures.push({ type: 'IFRAME', url: targetUrl, status: res.finalStatus, error: res.error });
    }

    iframeResults.push({
      iframeSrc,
      status: res.status,
      finalStatus: res.finalStatus,
      latency: res.latency,
      pass
    });
  }

  // Phase 4: Inspect External Destinations (Selar store & WhatsApp link formats)
  console.log(`\n--- [PHASE 4] INSPECTING EXTERNAL LINKS & REDIRECTIONS ---`);
  console.log(`  Total Unique Selar Product Links: ${results.externalLinks.filter(l => l.includes('selar.com')).length}`);
  console.log(`  Total Unique WhatsApp Endpoints: ${results.externalLinks.filter(l => l.includes('wa.me')).length}`);

  // Probe Selar Store
  const selarBase = 'https://selar.com/showlove/bethelmind';
  results.summary.total++;
  const selarRes = await fetchUrl(selarBase);
  if (selarRes.finalStatus === 200 || selarRes.finalStatus === 301 || selarRes.finalStatus === 302) {
    results.summary.passed++;
    console.log(`  ✅ [${selarRes.finalStatus}] Selar Store Base (${selarBase}) is reachable`);
  } else {
    results.summary.warnings++;
    console.log(`  ⚠️ [${selarRes.finalStatus}] Selar Store Base check`);
  }

  // Save audit log
  const auditPath = path.join('c:/Users/HomePC/Desktop/website Projects/lead generation automation/local_db/physical_inspection_report.json');
  fs.writeFileSync(auditPath, JSON.stringify(results, null, 2), 'utf8');

  console.log(`\n========================================================================`);
  console.log(`📊 PHYSICAL INSPECTION AUDIT COMPLETE`);
  console.log(`Total Inspected: ${results.summary.total}`);
  console.log(`Passed: ${results.summary.passed}`);
  console.log(`Failed: ${results.summary.failed}`);
  console.log(`Audit saved to: ${auditPath}`);
  console.log(`========================================================================\n`);

  if (results.failures.length > 0) {
    console.error('FAILURES DETECTED:');
    console.error(JSON.stringify(results.failures, null, 2));
    process.exit(1);
  } else {
    console.log('🎉 100% SUCCESS: Zero broken links, zero 404s, zero redirection failures.');
  }
}

runFullInspection().catch(err => {
  console.error('Fatal inspection error:', err);
  process.exit(1);
});
