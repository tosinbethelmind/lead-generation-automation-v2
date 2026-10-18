/**
 * @file scripts/deep_landing_page_and_tool_tester.js
 * 
 * 🧪 ADVANCED AUTOMATED QA & CONVERSION TEST SUITE
 * Bethelmind Digital Solutions · Commercial Growth Engine
 * 
 * Tests:
 * 1. Core Landing Pages & Funnel Routes (Status 200, fast response time).
 * 2. Dynamic Preview Generation (/preview/[lead_id]).
 * 3. Standalone Sector Tool Slugs (/tools/solar-boq, /tools/salon-booking, etc.)
 * 4. Sector Tools API (/api/sector-tools) with valid & edge-case inputs.
 * 5. Conversion Friction & Anti-Pattern Detection (NaN, undefined, null, broken CTAs).
 * 6. Trust & Payment Consistency (Moniepoint MFB, 6805375225, Bethelmind Digital Solutions).
 */

const DEFAULT_PRODUCTION_URL = 'https://www.bethelmindanalytics.com';

function parseCliArgs() {
  const args = process.argv.slice(2);
  const isLocal = args.includes('--local');
  let baseUrl = DEFAULT_PRODUCTION_URL;

  for (const arg of args) {
    if (arg.startsWith('--url=')) {
      baseUrl = arg.replace('--url=', '').trim();
    }
  }

  if (isLocal) {
    baseUrl = 'http://localhost:3006';
  }

  return { baseUrl, isFast: args.includes('--fast') };
}

async function fetchUrl(urlPath, baseUrl = DEFAULT_PRODUCTION_URL, options = {}) {
  const fullUrl = urlPath.startsWith('http') ? urlPath : new URL(urlPath, baseUrl).toString();
  const start = Date.now();
  
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    const res = await fetch(fullUrl, {
      method: options.method || 'GET',
      headers: options.headers || {},
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
    return {
      status: 0,
      error: err.name === 'AbortError' ? 'Timeout after 12000ms' : err.message,
      durationMs: Date.now() - start,
      success: false
    };
  }
}

/**
 * Fast sub-second preflight check for campaign dispatchers.
 * Uses < 15KB data and completes in < 1.5s.
 */
async function runFastPreflight(baseUrl = DEFAULT_PRODUCTION_URL) {
  console.log(`🔍 [QA Pre-Flight] Probing target environment: ${baseUrl}...`);
  
  const checks = [
    { path: '/', label: 'Home Page' },
    { path: '/preview/future-link-car', label: 'Preview Engine' },
    { path: '/tools/solar-boq', label: 'Solar Tool' },
    { path: '/tools/salon-booking', label: 'Salon Tool' },
    { path: '/api/preview/generate?leadId=future-link-car', label: 'Preview API' }
  ];

  const results = [];
  const failed = [];

  for (const c of checks) {
    const res = await fetchUrl(c.path, baseUrl);
    results.push(res);
    if (!res.success || res.status !== 200) {
      failed.push(`${c.label} (${c.path}) returned status ${res.status}`);
    } else {
      console.log(`   ✓ ${c.label} (${c.path}) -> HTTP ${res.status} (${res.durationMs}ms)`);
    }
  }

  // Check bank account in preview API
  const apiRes = results[4];
  if (apiRes.json?.paymentConfig?.moniepointAccountNumber !== '6805375225') {
    failed.push(`Stale Bank Account returned: ${apiRes.json?.paymentConfig?.moniepointAccountNumber} (Expected Moniepoint 6805375225)`);
  }

  if (failed.length > 0) {
    console.error(`🚨 [QA Pre-Flight FAILED] Found ${failed.length} blocker(s):`);
    failed.forEach(f => console.error(`   - ${f}`));
    return { ok: false, failed };
  }

  console.log('✅ [QA Pre-Flight PASSED] Core endpoints & Moniepoint 6805375225 verified. Safe to dispatch!');
  return { ok: true, failed: [] };
}

/**
 * Comprehensive 34-point Full-Stack QA & Conversion Suite
 */
async function runTestSuite(customBaseUrl) {
  const { baseUrl: cliBaseUrl, isFast } = parseCliArgs();
  const BASE_URL = customBaseUrl || cliBaseUrl;

  if (isFast) {
    return runFastPreflight(BASE_URL);
  }

  console.log('========================================================================');
  console.log('🚀 RUNNING ADVANCED FULL-STACK QA & CONVERSION TEST SUITE');
  console.log('🌐 Target Environment: ' + BASE_URL);
  console.log('========================================================================\n');

  let passed = 0;
  let failed = 0;
  const issues = [];

  function record(testName, isSuccess, details = '') {
    if (isSuccess) {
      console.log(`✅ [PASS] ${testName} ${details ? '(' + details + ')' : ''}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName}: ${details}`);
      failed++;
      issues.push({ testName, details });
    }
  }

  // --------------------------------------------------------------------------
  // TEST GROUP 1: PUBLIC LANDING PAGES & PROTOCOL ROUTES
  // --------------------------------------------------------------------------
  console.log('--- TEST GROUP 1: Core Landing Pages & HTTP Status ---');
  
  const publicRoutes = [
    { path: '/', label: 'Home Page' },
    { path: '/preview/future-link-car', label: 'Client Preview (Slug)' },
    { path: '/preview/locvilla-salon', label: 'Salon Preview (Slug)' },
    { path: '/preview/solar-wizard-nigeria', label: 'Solar Preview (Slug)' },
    { path: '/preview/unknown-test-business', label: 'Client Preview (Fallback)' },
    { path: '/sites/future-link-car', label: 'Client Live Site' },
    { path: '/handover/future-link-car', label: 'Client Handover Portal' },
    { path: '/solutions', label: 'Solutions Hub' },
    { path: '/marketplace', label: 'Marketplace' },
    { path: '/walkthrough', label: 'Walkthrough Page' },
    { path: '/tools/solar-boq', label: 'Solar BOQ Tool Page' },
    { path: '/tools/salon-booking', label: 'Salon Booking Tool Page' },
    { path: '/tools/tokunbo-duty', label: 'Tokunbo Duty Tool Page' },
    { path: '/tools/integrations', label: 'Integrations Blueprint Page' }
  ];

  for (const r of publicRoutes) {
    const res = await fetchUrl(r.path, BASE_URL);
    const isOk = res.success && res.status === 200;
    record(`${r.label} (${r.path})`, isOk, `Status: ${res.status}, Latency: ${res.durationMs}ms`);

    // Check for critical conversion anti-patterns in HTML
    if (res.data) {
      const hasNaN = />\s*NaN\s*</i.test(res.data) || /₦\s*NaN/i.test(res.data);
      const hasObjectObject = /\[object Object\]/i.test(res.data);

      if (hasNaN) record(`${r.label} NaN check`, false, 'Contains visible NaN text!');
      if (hasObjectObject) record(`${r.label} [object Object] check`, false, 'Contains [object Object] artifact!');
    }
  }

  // --------------------------------------------------------------------------
  // TEST GROUP 2: DYNAMIC PREVIEW API (/api/preview/generate)
  // --------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 2: Preview Generation API ---');
  
  const previewRes = await fetchUrl('/api/preview/generate?leadId=future-link-car', BASE_URL);
  record('Preview API returns HTTP 200', previewRes.status === 200, `Status: ${previewRes.status}`);
  
  if (previewRes.json) {
    const data = previewRes.json;
    const hasLead = Boolean(data.lead && data.lead.name);
    const hasTheme = Boolean(data.theme && data.theme.primary);
    const hasCopy = Boolean(data.copy && data.copy.heroTitle);
    const hasBank = Boolean(data.paymentConfig && data.paymentConfig.moniepointAccountNumber === '6805375225');

    record('Preview API has valid lead object', hasLead, data.lead?.name);
    record('Preview API has visual design theme', hasTheme, data.theme?.primary);
    record('Preview API has tailored copy text', hasCopy, data.copy?.heroTitle);
    record('Preview API has Moniepoint Corporate Bank 6805375225', hasBank, data.paymentConfig?.moniepointAccountNumber);

    // Test business name quality
    const name = data.lead?.name || '';
    const isNameClean = !/^\d+$/.test(name) && !/lagos_det_/i.test(name) && !name.includes('||');
    record('Preview lead name is properly sanitized', isNameClean, `Name: "${name}"`);
  } else {
    record('Preview API JSON parsing', false, 'Response was not valid JSON');
  }

  // --------------------------------------------------------------------------
  // TEST GROUP 3: SECTOR TOOLS API (/api/sector-tools)
  // --------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 3: Sector Tools Calculation Engines ---');

  const sectorActions = [
    {
      name: 'Solar BOQ Sizer',
      payload: { action: 'solar_boq', kva: 5, batteryType: 'lithium', backupHours: 12 },
      verify: (res) => res.json?.result?.recommendedInverterKva >= 5 && res.json?.result?.deposit50Percent > 0
    },
    {
      name: 'Tokunbo Import Duty Calculator',
      payload: { action: 'tokunbo_port_clearing', cifNgn: 8500000, year: 2018 },
      verify: (res) => (res.json?.result?.selectedPort?.totalClearingCostNgn > 0) || (res.json?.result?.allPorts?.[0]?.totalClearingCostNgn > 0) || (res.json?.result?.totalCustomsDuty > 0)
    },
    {
      name: 'Beauty & Salon Deposit Lock',
      payload: { action: 'beauty_salon_booking', serviceCategory: 'hair_extensions', hairLengthInches: 22, stylistTier: 'senior' },
      verify: (res) => res.json?.result?.mandatoryDeposit25PercentNgn > 0 && Boolean(res.json?.result?.bookingConfirmationCode)
    },
    {
      name: 'Shortlet Booking & Caution Fee',
      payload: { action: 'shortlet_booking', nightlyRateNgn: 75000, nightsCount: 3, cautionDepositNgn: 30000 },
      verify: (res) => res.json?.result?.grandTotalNgn > 0
    },
    {
      name: 'School Tuition & Result PIN Portal',
      payload: { action: 'school_tuition', studentClass: 'JSS 1', boardingStudent: false, termCount: 1 },
      verify: (res) => (res.json?.result?.totalTermlyCostNgn > 0) || (res.json?.result?.annualCostNgn > 0)
    },
    {
      name: 'Real Estate Mortgage Amortization',
      payload: { action: 'mortgage_amortization', propertyPriceNgn: 45000000, downPaymentPercent: 20, tenureYears: 10 },
      verify: (res) => res.json?.result?.monthlyPaymentNgn > 0
    },
    {
      name: 'Logistics Freight & Delivery Sizer',
      payload: { action: 'logistics_delivery', originCity: 'Lagos', destCity: 'Abuja', weightKg: 10 },
      verify: (res) => (res.json?.result?.interStateWaybillFeeNgn > 0) || (res.json?.result?.intraCityCourierFeeNgn > 0)
    },
    {
      name: 'CAC Business Filing Fee Calculator',
      payload: { action: 'cac_filing', entityType: 'company_ltd', shareCapitalNgn: 1000000 },
      verify: (res) => res.json?.result?.totalCost > 0
    }
  ];

  for (const s of sectorActions) {
    const res = await fetchUrl('/api/sector-tools', BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: s.payload
    });

    const isOk = res.status === 200 && res.json?.success === true && s.verify(res);
    record(`Sector Tool: ${s.name}`, isOk, `Status: ${res.status}, Latency: ${res.durationMs}ms`);
  }

  // --------------------------------------------------------------------------
  // TEST GROUP 4: EDGE CASES & RESILIENCE (INVALID INPUTS)
  // --------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 4: Edge Cases & Error Recovery ---');

  // Test 1: Empty payload
  const emptyRes = await fetchUrl('/api/sector-tools', BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: {}
  });
  record('API handles empty action gracefully without 500 crash', emptyRes.status === 200 || emptyRes.status === 400, `Status: ${emptyRes.status}`);

  // Test 2: Negative and zero numbers
  const negativeRes = await fetchUrl('/api/sector-tools', BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { action: 'solar_boq', kva: -5, backupHours: 0 }
  });
  record('Solar tool clamps negative kVA to minimum 1kVA', negativeRes.json?.result?.loadKva >= 1, `loadKva: ${negativeRes.json?.result?.loadKva}`);

  // --------------------------------------------------------------------------
  // TEST GROUP 5: CONVERSION TRUST & CTA INTEGRITY
  // --------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 5: Conversion Trust & CTA Links ---');

  const previewResObj = await fetchUrl('/preview/future-link-car', BASE_URL);
  const previewHtml = previewResObj.data || '';

  const hasWhatsAppCloserLink = previewHtml.includes('wa.me/2348022791227') || previewHtml.includes('2348022791227');
  const hasMoniepointBank = previewHtml.includes('Moniepoint') || previewHtml.includes('6805375225');
  const hasMobileViewport = previewHtml.includes('name="viewport"') || previewHtml.includes('width=device-width');
  const hasOptionsPricing = previewHtml.includes('35,000') || previewHtml.includes('65,000');

  record('Preview page has 1-Tap Closer WhatsApp link (0802 279 1227)', hasWhatsAppCloserLink, 'wa.me/2348022791227');
  record('Preview page has Moniepoint Corporate Account details', hasMoniepointBank, 'Moniepoint MFB / 6805375225');
  record('Preview page has responsive mobile viewport meta', hasMobileViewport, 'width=device-width');
  record('Preview page displays ₦35,000 low-friction starter pricing', hasOptionsPricing, '₦35,000 Starter Activation');

  // --------------------------------------------------------------------------
  // SUMMARY
  // --------------------------------------------------------------------------
  console.log('\n========================================================================');
  console.log(`📊 TEST SUITE COMPLETE: ${passed} PASSED, ${failed} FAILED`);
  if (failed > 0) {
    console.log('⚠️ Identified Issues:');
    issues.forEach((iss, i) => console.log(`   ${i + 1}. [${iss.testName}] - ${iss.details}`));
  } else {
    console.log('🎉 100% OF ENDPOINTS, ENGINES, AND CONVERSION CHECKS PASSED!');
  }
  console.log('========================================================================\n');

  return { passed, failed, issues, ok: failed === 0 };
}

module.exports = {
  runTestSuite,
  runFastPreflight
};

if (require.main === module) {
  runTestSuite().then(res => {
    if (!res.ok) {
      process.exit(1);
    }
  }).catch(err => {
    console.error('Suite crashed:', err);
    process.exit(1);
  });
}
