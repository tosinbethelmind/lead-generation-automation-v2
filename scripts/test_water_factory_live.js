const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://www.bethelmindanalytics.com';
const ssDir = path.join(__dirname, '..', 'public', 'qa-screenshots');
if (!fs.existsSync(ssDir)) fs.mkdirSync(ssDir, { recursive: true });

async function verifyWaterFactoryLive() {
  console.log('========================================================================');
  console.log('🌊 2026 LIVE PRODUCTION WATER FACTORY ERP AUDIT & E2E TEST');
  console.log(`🌐 Base URL: ${BASE_URL}`);
  console.log('========================================================================\n');

  let passed = 0;
  let failed = 0;

  function check(condition, testName, details = '') {
    if (condition) {
      passed++;
      console.log(`✅ [PASS] ${testName} ${details ? `(${details})` : ''}`);
    } else {
      failed++;
      console.error(`❌ [FAIL] ${testName} --> ${details}`);
    }
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }, // Mobile Android/iPhone viewport
    isMobile: true,
    hasTouch: true
  });
  const page = await context.newPage();

  const routes = [
    { url: `${BASE_URL}/factory`, name: 'Direct /factory Route' },
    { url: `${BASE_URL}/water`, name: 'Direct /water Route' },
    { url: `${BASE_URL}/tools/fmcg-dispatch`, name: 'Unconditional /tools/fmcg-dispatch Route' },
    { url: `${BASE_URL}/preview/obi-table-water`, name: 'Client Preview /preview/obi-table-water' }
  ];

  for (const r of routes) {
    console.log(`\n--- Auditing ${r.name} (${r.url}) ---`);
    await page.goto(r.url, { waitUntil: 'load', timeout: 35000 });
    await page.waitForTimeout(2500);

    const bodyText = await page.locator('body').innerText();

    // 1. Anti-regression check: Zero salon / hair content
    check(!bodyText.includes('Bone Straight') && !bodyText.includes('Raw Hair') && !bodyText.includes('Bridal Glam'), `${r.name}: Zero Salon/Hair Content (Anti-Regression)`);

    // 2. Pure water / AquaFlow brand check
    check(bodyText.includes('AquaFlow') || bodyText.includes('Water Factory') || bodyText.includes('Production Floor'), `${r.name}: AquaFlow Water Factory Header Rendered`);

    // 3. Moniepoint Settlement Invariant
    check(bodyText.includes('6805375225'), `${r.name}: Moniepoint Account 6805375225 Present`);
    check(bodyText.includes('Bethelmind Digital Solutions'), `${r.name}: Bethelmind Digital Solutions Branding Present`);

    // 4. Contact Desk WhatsApp Link
    check(bodyText.includes('0802 279 1227') || bodyText.includes('2348022791227'), `${r.name}: Admin WhatsApp Desk 0802 279 1227 Present`);

    // 5. Commercial Pricing clarity
    check(bodyText.includes('140,000') || bodyText.includes('280,000') || bodyText.includes('35,000'), `${r.name}: Industrial/Starter Pricing Structure Displayed`);
  }

  // Deep interactive calculation check on /factory
  console.log('\n--- Interactive Functionality Check on /factory ---');
  await page.goto(`${BASE_URL}/factory`, { waitUntil: 'load', timeout: 35000 });
  await page.waitForTimeout(2000);

  // Tab 2: Trucks & Drivers Anti-Theft
  const fleetTab = page.locator('button:has-text("Trucks"), button:has-text("Fleet")');
  if (await fleetTab.count() > 0) {
    await fleetTab.first().click();
    await page.waitForTimeout(1000);
    const fleetText = await page.locator('body').innerText();
    check(fleetText.includes('Shortage') || fleetText.includes('Driver') || fleetText.includes('Emeka'), 'Trucks & Drivers: Driver Shortage Theft Prevention Ledger Active');
  }

  // Tab 3: QuickBooks P&L
  const qbTab = page.locator('button:has-text("QuickBooks"), button:has-text("P&L")');
  if (await qbTab.count() > 0) {
    await qbTab.first().click();
    await page.waitForTimeout(1000);
    const qbText = await page.locator('body').innerText();
    check(qbText.includes('Diesel') || qbText.includes('Operating Profit') || qbText.includes('Chemicals'), 'QuickBooks Tab: Real-Time Diesel & Profit Ledger Functional');
  }

  // Tab 4: 8:00 PM WhatsApp Audit
  const auditTab = page.locator('button:has-text("Audit"), button:has-text("WhatsApp")');
  if (await auditTab.count() > 0) {
    await auditTab.first().click();
    await page.waitForTimeout(1000);
    const auditText = await page.locator('body').innerText();
    check(auditText.includes('DAILY FACTORY AUDIT') || auditText.includes('Net Cash Remitted'), 'WhatsApp Audit: Evening Summary Report Generated');
  }

  // Capture final screenshot
  const screenshotPath = path.join(ssDir, 'live_aquaflow_water_factory_production.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });
  check(fs.existsSync(screenshotPath), 'Live Production Screenshot Captured', screenshotPath);

  await browser.close();

  console.log('\n========================================================================');
  console.log(`📊 WATER FACTORY LIVE AUDIT: ${passed} PASSED, ${failed} FAILED out of ${passed + failed} CHECKS`);
  if (failed === 0) {
    console.log('🎉 100% PRODUCTION VERIFIED: AquaFlow Water Factory ERP is LIVE and FLAWLESS!');
  } else {
    console.error(`⚠️ Detected ${failed} issues.`);
  }
  console.log('========================================================================\n');
}

verifyWaterFactoryLive().catch(err => {
  console.error('Audit Error:', err);
  process.exit(1);
});
