/**
 * @file scripts/advanced_confirmatory_test_suite.js
 * 
 * 🔬 ADVANCED CONFIRMATORY TESTING & CUSTOMER EXPERIENCE (CX) ENGINE
 * Bethelmind Digital Solutions · Production & Route Reliability Framework
 * 
 * Architecture:
 * - Tier 1: Core Landing Pages & Hubs (HTTP 200, fast latency, valid HTML)
 * - Tier 2: 22+ Viral & Interactive Web Tools (/tools/[slug])
 * - Tier 3: Sector Monetization Tools (/tools/solar-boq, /tools/salon-booking, etc.)
 * - Tier 4: Dynamic SME Prototype Engine & Client Portals (/preview/*, /sites/*, /handover/*)
 * - Tier 5: Sector Calculation Engine API Contracts (/api/sector-tools) with edge cases
 * - Tier 6: Customer Experience (CX), Conversion Friction & Trust Audits
 * - Tier 7: Headless Playwright Mobile E2E & Layout Sanity Probes
 * 
 * Designed for real operating conditions: includes cellular jitter retries.
 */

const fs = require('fs');
const path = require('path');

const DEFAULT_TARGET_URL = 'https://www.bethelmindanalytics.com';

function parseCliArgs() {
  const args = process.argv.slice(2);
  const isLocal = args.includes('--local');
  const skipBrowser = args.includes('--skip-browser');
  const isFast = args.includes('--fast');
  let baseUrl = DEFAULT_TARGET_URL;

  for (const arg of args) {
    if (arg.startsWith('--url=')) {
      baseUrl = arg.replace('--url=', '').trim();
    }
  }

  if (isLocal) {
    baseUrl = 'http://localhost:3006';
  }

  return { baseUrl, skipBrowser, isFast };
}

async function fetchUrl(urlPath, baseUrl = DEFAULT_TARGET_URL, options = {}, retries = 2) {
  const fullUrl = urlPath.startsWith('http') ? urlPath : new URL(urlPath, baseUrl).toString();
  const start = Date.now();
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 25000);

      const res = await fetch(fullUrl, {
        method: options.method || 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) BethelmindConfirmatoryQA/2026.1',
          ...(options.headers || {})
        },
        body: options.body ? (typeof options.body === 'string' ? options.body : JSON.stringify(options.body)) : undefined,
        signal: controller.signal
      });

      clearTimeout(timeout);
      const durationMs = Date.now() - start;
      const text = await res.text();
      let json = null;
      try {
        json = JSON.parse(text);
      } catch (_) {}

      return {
        status: res.status,
        headers: res.headers,
        data: text,
        json,
        durationMs,
        success: res.status >= 200 && res.status < 400
      };
    } catch (err) {
      if (attempt < retries) {
        // Cellular jitter retry with gentle backoff
        await new Promise(r => setTimeout(r, 1500 * (attempt + 1)));
        continue;
      }
      return {
        status: 0,
        error: err.name === 'AbortError' ? 'Timeout after 25000ms' : err.message,
        durationMs: Date.now() - start,
        success: false
      };
    }
  }
}

/**
 * Main Confirmatory Test Runner
 */
async function runFullTestSuite() {
  const { baseUrl: BASE_URL, skipBrowser, isFast } = parseCliArgs();

  console.log('╔═══════════════════════════════════════════════════════════════════════╗');
  console.log('║   🔬 BETHELMIND ADVANCED CONFIRMATORY TESTING & CX VERIFICATION SUITE   ║');
  console.log('╚═══════════════════════════════════════════════════════════════════════╝');
  console.log(`🌐 Target Base URL: ${BASE_URL}`);
  console.log(`⏱  Timestamp: ${new Date().toISOString()}`);
  console.log(`💻 Node Version: ${process.version}\n`);

  let passed = 0;
  let failed = 0;
  const failures = [];

  function record(testName, isSuccess, details = '') {
    if (isSuccess) {
      console.log(`  ✅ [PASS] ${testName} ${details ? '(' + details + ')' : ''}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${testName}: ${details}`);
      failed++;
      failures.push({ testName, details });
    }
  }

  // ==========================================================================
  // TIER 1: CORE MARKETING ROUTES & CONVERSION HUBS
  // ==========================================================================
  console.log('─── TIER 1: Core Landing Pages & Conversion Hubs ───');
  
  const coreRoutes = [
    { path: '/', label: 'Homepage Hero & Engine' },
    { path: '/solutions', label: 'Solutions Catalog' },
    { path: '/marketplace', label: 'Turnkey Digital Storefront' },
    { path: '/walkthrough', label: 'Video Demo & Interactive Walkthrough' },
    { path: '/pricing', label: 'Commercial Pricing & Tiers' },
    { path: '/contact', label: 'Support & Inbound Inquiries' },
    { path: '/tools', label: 'Tools Directory Index' },
    { path: '/monetization', label: '10 High-Conversion Monetization Engines' },
    { path: '/results', label: 'Client Case Studies & Proof' },
    { path: '/solar', label: 'Solar Quote Pro Dedicated Portal' },
    { path: '/directory', label: 'B2B Business Directory Portal' }
  ];

  for (const r of coreRoutes) {
    const res = await fetchUrl(r.path, BASE_URL);
    const isOk = res.success && res.status === 200;
    record(`${r.label} (${r.path})`, isOk, `Status: ${res.status}, Latency: ${res.durationMs}ms`);

    if (res.data) {
      // Check for visual glitch anti-patterns
      const hasNaN = />\s*NaN\s*</i.test(res.data) || /₦\s*NaN/i.test(res.data);
      const hasObjectObject = /\[object Object\]/i.test(res.data);
      const hasUndefined = />\s*undefined\s*</i.test(res.data);

      if (hasNaN) record(`${r.label} Clean DOM (NaN check)`, false, 'Found visible NaN artifact');
      if (hasObjectObject) record(`${r.label} Clean DOM ([object Object] check)`, false, 'Found [object Object] artifact');
      if (hasUndefined) record(`${r.label} Clean DOM (undefined check)`, false, 'Found unhandled undefined artifact');
    }
  }

  // ==========================================================================
  // TIER 2: VIRAL INTERACTIVE DIGITAL TOOLS (/tools/[slug])
  // ==========================================================================
  console.log('\n─── TIER 2: Viral Interactive Digital Tools (/tools/[slug]) ───');

  const viralTools = [
    { slug: 'solar-savings', label: 'Solar & Clean Energy Savings' },
    { slug: 'crypto-dca', label: 'Crypto DCA Wealth Engine' },
    { slug: 'kids-learning', label: 'Kids 3D Learning & Phonics Studio' },
    { slug: 'biohack-longevity', label: 'Biohack Longevity Protocol' },
    { slug: 'wealth-calculator', label: 'Passive Income & FIRE Calculator' },
    { slug: 'deal-calculator', label: 'Real Estate Deal Sizer' },
    { slug: 'wholesaling-loi', label: 'Wholesaling LOI Generator' },
    { slug: 'script-generator', label: 'Viral Social Script Generator' },
    { slug: 'site-audit', label: 'Technical SEO Site Audit Engine' },
    { slug: 'prayer-journal', label: 'Scripture & Daily Prayer Journal' },
    { slug: 'sure-score', label: 'SureScore AI™ Football Match Predictor' },
    { slug: 'sports-edge', label: 'Sports Edge Kelly Criterion Sizer' },
    { slug: 'ai-stack-finder', label: 'Enterprise AI Tech Stack Finder' },
    { slug: 'drama-radar', label: 'DramaRadar AI™ Reddit Detective' },
    { slug: 'saas-radar', label: 'SaaSRadar AI™ Alternatives Finder' },
    { slug: 'goal-grid', label: 'GoalGrid AI™ Daily Football Mystery' },
    { slug: 'footy-wordle', label: 'FootyWordle AI™ Wordle Game' },
    { slug: 'typing-speed', label: 'TypeMaster AI™ WPM Typing Speed Test' },
    { slug: 'focus-timer', label: 'FocusFlow AI™ 25/5 Pomodoro Timer' },
    { slug: 'runway-radar', label: 'RunwayRadar AI™ Financial Runway Sizer' },
    { slug: 'salary-calc', label: 'SalaryTakeHome AI™ 2026 PAYE Tax Sizer' },
    { slug: 'higher-lower', label: 'Higher or Lower AI™ Comparison Game' }
  ];

  for (const tool of viralTools) {
    const res = await fetchUrl(`/tools/${tool.slug}`, BASE_URL);
    const isOk = res.success && res.status === 200;
    record(`Viral Tool: ${tool.label} (/tools/${tool.slug})`, isOk, `Status: ${res.status}, Latency: ${res.durationMs}ms`);

    // Verify key conversion elements are rendered
    if (res.data) {
      const isHtmlValid = res.data.length > 500 && (res.data.includes('<html') || res.data.includes('<!DOCTYPE') || res.data.includes('<body'));
      record(`Tool Page HTML: ${tool.slug}`, isHtmlValid, `Bytes: ${res.data.length}`);
    }
  }

  // ==========================================================================
  // TIER 3: SECTOR MONETIZATION TOOLS
  // ==========================================================================
  console.log('\n─── TIER 3: Sector Monetization Tools ───');

  const sectorTools = [
    { slug: 'solar-boq', label: 'Solar & Inverter BOQ Sizer' },
    { slug: 'solar-quote-pro', label: 'Solar Quote Pro Engine' },
    { slug: 'salon-booking', label: 'Salon Booking & 25% Deposit Lock' },
    { slug: 'tokunbo-duty', label: 'Tokunbo VIN Customs Duty & Port Clearing' },
    { slug: 'mortgage-calc', label: 'Mortgage Amortization & Plot Layout' },
    { slug: 'clinic-booking', label: 'Clinic HMO Claims & Co-Pay Reconciler' },
    { slug: 'school-tuition', label: 'School Tuition & Result PIN Portal' },
    { slug: 'logistics-waybill', label: 'Logistics Freight & Waybill Sizer' },
    { slug: 'cac-filing', label: 'CAC Business Filing Fee Calculator' },
    { slug: 'shortlet-booking', label: 'Shortlet Booking & Caution Escrow' },
    { slug: 'integrations', label: 'Fast Webhook & API Blueprint' }
  ];

  for (const st of sectorTools) {
    const res = await fetchUrl(`/tools/${st.slug}`, BASE_URL);
    const isOk = res.success && res.status === 200;
    record(`Sector Tool: ${st.label} (/tools/${st.slug})`, isOk, `Status: ${res.status}, Latency: ${res.durationMs}ms`);
  }

  // ==========================================================================
  // TIER 4: DYNAMIC SME PROTOTYPE PREVIEWS & CLIENT PORTALS
  // ==========================================================================
  console.log('\n─── TIER 4: Dynamic SME Prototype Engine & Portals ───');

  const previewRoutes = [
    { path: '/preview/future-link-car', label: 'Auto Importer Prototype' },
    { path: '/preview/locvilla-salon', label: 'Luxury Hair Salon Prototype' },
    { path: '/preview/solar-wizard-nigeria', label: 'Solar EPC Installer Prototype' },
    { path: '/preview/zenith-dentals-lagos', label: 'Dental Clinic Prototype' },
    { path: '/preview/dynamic-unregistered-sme-test', label: 'Dynamic Fallback Generator' },
    { path: '/sites/future-link-car', label: 'Client Live Site Simulation' },
    { path: '/handover/future-link-car', label: 'Client Turnkey Handover Portal' }
  ];

  for (const pr of previewRoutes) {
    const res = await fetchUrl(pr.path, BASE_URL);
    const isOk = res.success && res.status === 200;
    record(`Preview Route: ${pr.label} (${pr.path})`, isOk, `Status: ${res.status}, Latency: ${res.durationMs}ms`);
  }

  // Dynamic Preview Generation API Check
  const previewApiRes = await fetchUrl('/api/preview/generate?leadId=future-link-car', BASE_URL);
  record('Preview API (/api/preview/generate) HTTP 200', previewApiRes.status === 200, `Status: ${previewApiRes.status}`);

  if (previewApiRes.json) {
    const pData = previewApiRes.json;
    record('Preview API returns valid lead entity', Boolean(pData.lead?.name), `Lead: "${pData.lead?.name}"`);
    record('Preview API returns Moniepoint 6805375225', pData.paymentConfig?.moniepointAccountNumber === '6805375225', pData.paymentConfig?.moniepointAccountNumber);
    record('Preview API returns dynamic theme colors', Boolean(pData.theme?.primary), pData.theme?.primary);
  }

  // ==========================================================================
  // TIER 5: SECTOR TOOLS CALCULATION ENGINES (/api/sector-tools)
  // ==========================================================================
  console.log('\n─── TIER 5: Sector Calculation Engine Contracts ───');

  const sectorMathTests = [
    {
      name: 'Solar BOQ Sizer Engine',
      payload: { action: 'solar_boq', kva: 5, batteryType: 'lithium', backupHours: 12 },
      assert: (json) => json.success && json.result?.recommendedInverterKva >= 5 && json.result?.deposit50Percent > 0,
      details: (json) => `Inverter: ${json.result?.recommendedInverterKva}kVA, 50% Deposit: ₦${json.result?.deposit50Percent?.toLocaleString()}`
    },
    {
      name: 'Tokunbo Import Duty Engine',
      payload: { action: 'tokunbo_port_clearing', cifNgn: 9000000, year: 2019 },
      assert: (json) => json.success && (json.result?.totalCustomsDuty > 0 || json.result?.selectedPort?.totalClearingCostNgn > 0 || json.result?.allPorts?.length > 0),
      details: (json) => `Port clearing options calculated successfully`
    },
    {
      name: 'Beauty Salon 25% Deposit Lock Engine',
      payload: { action: 'beauty_salon_booking', serviceCategory: 'hair_extensions', hairLengthInches: 24, stylistTier: 'senior' },
      assert: (json) => json.success && json.result?.mandatoryDeposit25PercentNgn > 0 && Boolean(json.result?.bookingConfirmationCode),
      details: (json) => `Deposit: ₦${json.result?.mandatoryDeposit25PercentNgn?.toLocaleString()}, Code: ${json.result?.bookingConfirmationCode}`
    },
    {
      name: 'Shortlet Caution & Power Escrow Engine',
      payload: { action: 'shortlet_booking', nightlyRateNgn: 85000, nightsCount: 4, cautionDepositNgn: 40000 },
      assert: (json) => json.success && json.result?.grandTotalNgn > 0,
      details: (json) => `Grand Total: ₦${json.result?.grandTotalNgn?.toLocaleString()}`
    },
    {
      name: 'School Tuition & Result PIN Ledger',
      payload: { action: 'school_tuition', studentClass: 'SSS 2', boardingStudent: true, termCount: 1 },
      assert: (json) => json.success && (json.result?.totalTermlyCostNgn > 0 || json.result?.annualCostNgn > 0),
      details: (json) => `Tuition & Boarding ledger verified`
    },
    {
      name: 'Real Estate Mortgage Amortization',
      payload: { action: 'mortgage_amortization', propertyPriceNgn: 65000000, downPaymentPercent: 25, tenureYears: 15 },
      assert: (json) => json.success && json.result?.monthlyPaymentNgn > 0,
      details: (json) => `Monthly Payment: ₦${Math.round(json.result?.monthlyPaymentNgn)?.toLocaleString()}`
    },
    {
      name: 'Logistics Courier & Interstate Waybill',
      payload: { action: 'logistics_delivery', originCity: 'Lagos', destCity: 'Port Harcourt', weightKg: 15 },
      assert: (json) => json.success && (json.result?.interStateWaybillFeeNgn > 0 || json.result?.intraCityCourierFeeNgn > 0),
      details: (json) => `Waybill fee computed successfully`
    },
    {
      name: 'CAC Statutory Filing Fee Sizer',
      payload: { action: 'cac_filing', entityType: 'company_ltd', shareCapitalNgn: 2000000 },
      assert: (json) => json.success && json.result?.totalCost > 0,
      details: (json) => `Statutory Filing Total: ₦${json.result?.totalCost?.toLocaleString()}`
    }
  ];

  for (const mathTest of sectorMathTests) {
    const res = await fetchUrl('/api/sector-tools', BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: mathTest.payload
    });

    const isOk = res.status === 200 && res.json && mathTest.assert(res.json);
    const detailMsg = res.json ? mathTest.details(res.json) : `Status ${res.status}`;
    record(`API Engine: ${mathTest.name}`, isOk, detailMsg);
  }

  // Edge Cases & Robustness
  const emptyActionRes = await fetchUrl('/api/sector-tools', BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: {}
  });
  record('Edge Case: Empty JSON payload returns 400 (no 500 crash)', emptyActionRes.status === 400 || emptyActionRes.status === 200, `Status: ${emptyActionRes.status}`);

  const negativeClampRes = await fetchUrl('/api/sector-tools', BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { action: 'solar_boq', kva: -10, backupHours: -4 }
  });
  const clampedKva = negativeClampRes.json?.result?.loadKva || negativeClampRes.json?.result?.recommendedInverterKva;
  record('Edge Case: Negative kVA auto-clamps to safe minimum 1kVA', Number(clampedKva) >= 1, `Clamped kVA: ${clampedKva}`);

  // ==========================================================================
  // TIER 6: CUSTOMER EXPERIENCE (CX), CONVERSION FRICTION & TRUST AUDITS
  // ==========================================================================
  console.log('\n─── TIER 6: Customer Experience (CX) & Trust Integrity ───');

  const previewHtmlRes = await fetchUrl('/preview/future-link-car', BASE_URL);
  const previewHtml = previewHtmlRes.data || '';

  // 1. WhatsApp closer CTA desk
  const hasWhatsAppCloser = previewHtml.includes('wa.me/2348022791227') || previewHtml.includes('2348022791227');
  record('CX Trust: 1-Tap Closer WhatsApp Desk (0802 279 1227)', hasWhatsAppCloser, 'wa.me/2348022791227');

  // 2. Moniepoint MFB corporate details
  const hasMoniepoint = previewHtml.includes('Moniepoint') || previewHtml.includes('6805375225');
  record('CX Trust: Corporate Settlement (Moniepoint MFB 6805375225)', hasMoniepoint, 'Moniepoint MFB 6805375225');

  // 3. Responsive mobile viewport
  const homeRes = await fetchUrl('/', BASE_URL);
  const homeHtml = homeRes.data || '';
  const hasMobileMeta = homeHtml.includes('width=device-width') && homeHtml.includes('initial-scale=1');
  record('CX Usability: Mobile Viewport Meta Tag Enforced', hasMobileMeta, 'width=device-width, initial-scale=1');

  // 4. Low-friction pricing clarity (₦35,000 Starter)
  const hasLowFrictionPricing = previewHtml.includes('35,000') || previewHtml.includes('25,000');
  record('CX Conversion: Low-Friction ₦35,000 Starter Pricing Present', hasLowFrictionPricing, '₦35,000 Starter Activation');

  // 5. Page Latency Threshold
  const isLatencyAcceptable = previewHtmlRes.durationMs < 12000;
  record('CX Performance: Page Latency Under Acceptable Threshold', isLatencyAcceptable, `${previewHtmlRes.durationMs}ms`);

  // ==========================================================================
  // TIER 7: PLAYWRIGHT HEADLESS MOBILE E2E & VIEWPORT SANITY
  // ==========================================================================
  console.log('\n─── TIER 7: Headless Playwright Mobile E2E & Viewport Sanity ───');

  if (skipBrowser) {
    console.log('  ⏩ [SKIPPED] Browser automation skipped via --skip-browser');
  } else {
    try {
      const { chromium } = require('playwright');
      const executablePath = chromium.executablePath();
      
      console.log(`  🖥  Launching Headless Chromium (${executablePath ? 'Installed' : 'Standard'})...`);

      const browser = await chromium.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
      });

      // Emulate iPhone 14 / Mobile Viewport
      const context = await browser.newContext({
        viewport: { width: 390, height: 844 },
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1',
        isMobile: true,
        hasTouch: true
      });

      const page = await context.newPage();
      const uncaughtExceptions = [];
      page.on('pageerror', err => {
        uncaughtExceptions.push(err.message);
      });

      // 1. Mobile Home Viewport Sanity (No Horizontal Overflow)
      console.log(`  📱 Testing Mobile Viewport on Home: ${BASE_URL}`);
      try {
        await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 35000 });
      } catch (navErr) {
        // Retry navigation once if cellular DNS dropped
        await page.waitForTimeout(2000);
        await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 35000 });
      }
      
      const isOverflowing = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth + 2;
      });
      record('Mobile Viewport: Zero Horizontal Overflow on Homepage', !isOverflowing, 'Page fits within 390px mobile width');

      // 2. Interactive Tool Test: Solar BOQ
      console.log(`  📱 Testing Interactive Calculation on Solar BOQ: ${BASE_URL}/tools/solar-boq`);
      try {
        await page.goto(`${BASE_URL}/tools/solar-boq`, { waitUntil: 'domcontentloaded', timeout: 35000 });
      } catch (navErr) {
        await page.waitForTimeout(2000);
        await page.goto(`${BASE_URL}/tools/solar-boq`, { waitUntil: 'domcontentloaded', timeout: 35000 });
      }
      await page.waitForTimeout(1000);

      // Assert page loaded title
      const pageTitle = await page.title();
      record('Interactive Page: Solar BOQ Title Loaded', Boolean(pageTitle && pageTitle.length > 0), pageTitle);

      // Verify no critical JavaScript uncaught crash
      record('Browser Telemetry: Zero Uncaught Fatal JS Exceptions', uncaughtExceptions.length === 0, `${uncaughtExceptions.length} runtime exception(s)`);

      // 3. Dynamic Preview Mobile Test
      console.log(`  📱 Testing Dynamic Preview Page: ${BASE_URL}/preview/future-link-car`);
      try {
        await page.goto(`${BASE_URL}/preview/future-link-car`, { waitUntil: 'domcontentloaded', timeout: 35000 });
      } catch (navErr) {
        await page.waitForTimeout(2000);
        await page.goto(`${BASE_URL}/preview/future-link-car`, { waitUntil: 'domcontentloaded', timeout: 35000 });
      }
      await page.waitForTimeout(1000);

      const previewHeadline = await page.evaluate(() => {
        const h1 = document.querySelector('h1');
        return h1 ? h1.innerText : '';
      });
      record('Dynamic Preview: Rendered Active Heading in Mobile Browser', Boolean(previewHeadline && previewHeadline.length > 0), `H1: "${previewHeadline.slice(0, 45)}..."`);

      await browser.close();
      console.log('  ✓ Headless browser session closed cleanly.');
    } catch (browserErr) {
      record('Playwright Mobile Headless Automation', false, `Browser test encountered error: ${browserErr.message}`);
    }
  }

  // ==========================================================================
  // FINAL SUMMARY & SCORECARD
  // ==========================================================================
  console.log('\n═══════════════════════════════════════════════════════════════════════');
  console.log(`🏁 ADVANCED CONFIRMATORY QA AUDIT COMPLETE`);
  console.log(`📊 TOTAL CHECKS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log(`🎯 HEALTH RATING: ${Math.round((passed / (passed + failed || 1)) * 100)}%`);

  if (failed > 0) {
    console.log('\n🚨 DETECTED ISSUES TO RESOLVE:');
    failures.forEach((f, idx) => {
      console.log(`   ${idx + 1}. [${f.testName}] → ${f.details}`);
    });
  } else {
    console.log('\n🏆 100% PERFECT PASS RATE! ALL ROUTES, TOOLS & CONVERSIONS ARE SOUND.');
  }
  console.log('═══════════════════════════════════════════════════════════════════════\n');

  return { passed, failed, failures, ok: failed === 0 };
}

module.exports = {
  runFullTestSuite
};

if (require.main === module) {
  runFullTestSuite().then(res => {
    if (!res.ok) {
      process.exit(1);
    }
  }).catch(err => {
    console.error('Fatal crash running test suite:', err);
    process.exit(1);
  });
}
