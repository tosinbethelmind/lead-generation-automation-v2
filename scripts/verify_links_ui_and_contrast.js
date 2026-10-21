/**
 * @file scripts/verify_links_ui_and_contrast.js
 * 
 * 🔍 COMPREHENSIVE LINK INTEGRITY, UI FUNCTIONALITY & CONTRAST AUDITOR
 * Bethelmind Digital Solutions
 * 
 * Verifies:
 * 1. All Navigation & New Routes (/vin, /arbitrage, /tools/website-grader, /blog, /preview)
 * 2. API Proxy Engines (VPS VIN 5000 & Arbitrage 5001)
 * 3. UI Anti-Patterns (NaN, undefined, null, [object Object], empty hrefs)
 * 4. WCAG 2.1 AA/AAA Contrast Ratios across dark-mode palettes
 */

const https = require('https');
const BASE_URL = 'https://www.bethelmindanalytics.com';

function fetchUrl(path, options = {}) {
  return new Promise((resolve) => {
    const fullUrl = path.startsWith('http') ? path : `${BASE_URL}${path}`;
    const urlObj = new URL(fullUrl);
    const start = Date.now();

    const reqOptions = {
      hostname: urlObj.hostname,
      port: 443,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Bethelmind-QA-Bot',
        ...(options.headers || {})
      },
      timeout: 15000
    };

    const req = https.request(reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const durationMs = Date.now() - start;
        let json = null;
        try { json = JSON.parse(data); } catch (_) {}
        resolve({
          path,
          status: res.statusCode,
          durationMs,
          body: data,
          json,
          success: res.statusCode >= 200 && res.statusCode < 400
        });
      });
    });

    req.on('error', (e) => {
      resolve({
        path,
        status: 500,
        durationMs: Date.now() - start,
        error: e.message,
        success: false
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        path,
        status: 408,
        durationMs: Date.now() - start,
        error: 'Timeout',
        success: false
      });
    });

    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

// WCAG Contrast calculation formulas
function hexToRgb(hex) {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const num = parseInt(c, 16);
  return [num >> 16, (num >> 8) & 255, num & 255];
}

function luminance(rgb) {
  const [r, g, b] = rgb.map(val => {
    const s = val / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(fgHex, bgHex) {
  const l1 = luminance(hexToRgb(fgHex));
  const l2 = luminance(hexToRgb(bgHex));
  const hi = Math.max(l1, l2);
  const lo = Math.min(l1, l2);
  return (hi + 0.05) / (lo + 0.05);
}

async function runQaAudit() {
  console.log('========================================================================');
  console.log('🧪 RUNNING PRODUCTION LINK INTEGRITY, UI HEALTH & CONTRAST AUDIT');
  console.log(`🌐 Base URL: ${BASE_URL}`);
  console.log('========================================================================\n');

  let passed = 0;
  let failed = 0;
  const issues = [];

  function record(testName, isSuccess, details = '') {
    if (isSuccess) {
      console.log(`✅ [PASS] ${testName} ${details ? '— ' + details : ''}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName} — ${details}`);
      failed++;
      issues.push({ testName, details });
    }
  }

  // --------------------------------------------------------------------------
  // 1. CORE ROUTE LINK INTEGRITY & LATENCY
  // --------------------------------------------------------------------------
  console.log('--- 1. Testing Live Route & Navigation Links ---');
  const targetRoutes = [
    { path: '/', label: 'Home Page' },
    { path: '/vin', label: '🚗 Tokunbo VIN Checker Page' },
    { path: '/arbitrage', label: '⚡ P2P FX Arbitrage Alert Desk' },
    { path: '/blog', label: '📰 Commercial Intelligence Blog' },
    { path: '/tools/website-grader', label: '🔍 SME Google Visibility Grader' },
    { path: '/tools/solar-boq', label: '⚡ Solar BOQ Calculator' },
    { path: '/preview/future-link-car', label: '📱 SME Live Prototype Preview' },
    { path: '/solutions', label: '💼 Solutions Suite' },
    { path: '/marketplace', label: '🛒 Marketplace' },
  ];

  const htmlBodies = {};

  for (const r of targetRoutes) {
    const res = await fetchUrl(r.path);
    const ok = res.success && res.status === 200;
    record(r.label, ok, `HTTP ${res.status} (${res.durationMs}ms, ${res.body?.length || 0} bytes)`);
    if (res.body) {
      htmlBodies[r.path] = res.body;
    }
  }

  // --------------------------------------------------------------------------
  // 2. BACKEND API PROXIES (VPS 5000 & 5001)
  // --------------------------------------------------------------------------
  console.log('\n--- 2. Testing VPS API Proxy Endpoints ---');
  
  // Test Arbitrage Rates Proxy
  const arbRes = await fetchUrl('/api/arbitrage-proxy/rates');
  const arbOk = arbRes.status === 200 && arbRes.json?.success === true;
  record(
    'Arbitrage Rates Proxy (/api/arbitrage-proxy/rates)', 
    arbOk, 
    arbOk ? `Binance Buy: ₦${arbRes.json.data.markets.binanceP2p.buyPrice}, Bybit: ₦${arbRes.json.data.markets.bybitP2p.buyPrice}` : `Status ${arbRes.status}`
  );

  // Test VIN Decode Proxy
  const vinRes = await fetchUrl('/api/vin-proxy/vin/decode', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ vin: '4T1BF1FK7FU552011' })
  });
  const vinOk = vinRes.status === 200 && vinRes.json?.success === true;
  record(
    'VIN Decode Proxy (/api/vin-proxy/vin/decode)',
    vinOk,
    vinOk ? `Decoded: ${vinRes.json.data.year} ${vinRes.json.data.make} ${vinRes.json.data.model} (${vinRes.json.data.riskTier})` : `Status ${vinRes.status}`
  );

  // --------------------------------------------------------------------------
  // 3. UI INTEGRITY & ANTI-PATTERNS (NaN, null, [object Object], undefined)
  // --------------------------------------------------------------------------
  console.log('\n--- 3. Testing UI Rendering & Anti-Pattern Detection ---');
  
  for (const [routePath, html] of Object.entries(htmlBodies)) {
    const hasNaN = />\s*NaN\s*</i.test(html) || /₦\s*NaN/i.test(html);
    const hasObjectObject = /\[object Object\]/i.test(html);
    const hasUndefinedText = />\s*undefined\s*</i.test(html) || /₦\s*undefined/i.test(html);
    const hasEmptyHref = /href=""|href="undefined"/i.test(html);

    record(`${routePath} NaN check`, !hasNaN, hasNaN ? 'DETECTED visible NaN in UI' : 'Clean');
    record(`${routePath} [object Object] check`, !hasObjectObject, hasObjectObject ? 'DETECTED [object Object] string' : 'Clean');
    record(`${routePath} undefined text check`, !hasUndefinedText, hasUndefinedText ? 'DETECTED undefined text in UI' : 'Clean');
    record(`${routePath} empty href check`, !hasEmptyHref, hasEmptyHref ? 'DETECTED empty or undefined href' : 'Clean');
  }

  // --------------------------------------------------------------------------
  // 4. UI COLOR CONTRAST RATIO & ACCESSIBILITY AUDIT (WCAG 2.1 AA/AAA)
  // --------------------------------------------------------------------------
  console.log('\n--- 4. Testing UI Color Contrast Ratios (WCAG 2.1 AA / AAA) ---');
  
  // Key color pairs utilized in the dark theme UI
  const colorPairs = [
    { name: 'Primary White Heading on Slate-950 Background', fg: '#ffffff', bg: '#020617', target: 7.0 },
    { name: 'Body Slate-100 on Slate-950 Background', fg: '#f1f5f9', bg: '#020617', target: 7.0 },
    { name: 'Body Slate-300 on Slate-900 Card', fg: '#cbd5e1', bg: '#0f172a', target: 4.5 },
    { name: 'Sub-label Slate-400 on Slate-900 Card', fg: '#94a3b8', bg: '#0f172a', target: 4.5 },
    { name: 'Amber Accent Heading (#fbbf24) on Slate-950', fg: '#fbbf24', bg: '#020617', target: 4.5 },
    { name: 'Emerald Ticker (#34d399) on Slate-950', fg: '#34d399', bg: '#020617', target: 4.5 },
    { name: 'Black Text (#020617) on Amber Button (#f59e0b)', fg: '#020617', bg: '#f59e0b', target: 4.5 },
    { name: 'Black Text (#020617) on Emerald Button (#10b981)', fg: '#020617', bg: '#10b981', target: 4.5 },
    { name: 'White Text (#ffffff) on Dark Red Alert (#881337)', fg: '#ffffff', bg: '#881337', target: 4.5 },
    { name: 'Rose Accent (#f43f5e) on Slate-950', fg: '#f43f5e', bg: '#020617', target: 4.5 },
  ];

  for (const pair of colorPairs) {
    const ratio = contrastRatio(pair.fg, pair.bg);
    const passesAA = ratio >= pair.target;
    const passesAAA = ratio >= 7.0;
    const level = passesAAA ? 'AAA' : (passesAA ? 'AA' : 'FAIL');
    
    record(
      `${pair.name}`,
      passesAA,
      `Ratio: ${ratio.toFixed(2)}:1 (Required: ${pair.target}:1, Level: ${level})`
    );
  }

  // --------------------------------------------------------------------------
  // SUMMARY
  // --------------------------------------------------------------------------
  console.log('\n========================================================================');
  console.log(`📊 FINAL QA SUMMARY:`);
  console.log(`   • Total Checks Conducted: ${passed + failed}`);
  console.log(`   • Passed: ${passed}`);
  console.log(`   • Failed: ${failed}`);
  console.log(`   • Overall Health Parity: ${Math.round((passed / (passed + failed)) * 100)}%`);
  console.log('========================================================================\n');

  if (failed > 0) {
    console.error('Identified Issues:');
    issues.forEach(i => console.error(`  - ${i.testName}: ${i.details}`));
    process.exit(1);
  } else {
    console.log('🎉 ALL LINKS, UI RENDERS, BACKEND PROXIES, AND CONTRAST RATIOS ARE 100% HEALTHY!');
  }
}

runQaAudit();
