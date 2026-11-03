const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  console.log('🔍 [AGENCY REALITY CHECKER] Starting Full Integration Audit...');
  const results = {
    timestamp: new Date().toISOString(),
    routesTested: [],
    errors: [],
    status: 'NEEDS WORK'
  };

  const browser = await chromium.launch({ headless: true });

  // ── TEST 1: Deal Teaser & Signature Canvas on Mobile (iPhone 12 viewport) ──
  console.log('📱 Testing Deal Teaser on Mobile (390x844)...');
  const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  let mobileErrors = 0;
  mobilePage.on('pageerror', err => { mobileErrors++; console.error('Mobile PageError:', err.message); });

  const t0 = Date.now();
  await mobilePage.goto('https://www.bethelmindanalytics.com/deal/demo', { waitUntil: 'domcontentloaded' });
  const loadTimeMobile = Date.now() - t0;
  await mobilePage.waitForTimeout(2000);

  const canvas = await mobilePage.$('canvas');
  const claimButton = await mobilePage.$('button[type="submit"]');
  const checkbox = await mobilePage.$('input[type="checkbox"]');
  const hasValueEquation = await mobilePage.textContent('body').then(t => t.includes('Grand Slam Co-Brokerage') || t.includes('₦0 Upfront'));

  results.routesTested.push({
    route: '/deal/demo',
    device: 'Mobile (390x844)',
    loadTimeMs: loadTimeMobile,
    canvasPresent: !!canvas,
    buttonPresent: !!claimButton,
    checkboxPresent: !!checkbox,
    valueEquationPresent: hasValueEquation,
    errorsCount: mobileErrors
  });

  await mobilePage.screenshot({ path: 'scripts/reality_check_deal_mobile.png' });
  await mobilePage.close();

  // ── TEST 2: Legal Mandate Printable Document (Desktop 1440x900) ──
  console.log('📜 Testing Official Signed Mandate on Desktop...');
  const desktopPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  let desktopErrors = 0;
  desktopPage.on('pageerror', err => { desktopErrors++; console.error('Desktop PageError:', err.message); });

  const t1 = Date.now();
  await desktopPage.goto('https://www.bethelmindanalytics.com/deal/demo/mandate', { waitUntil: 'domcontentloaded' });
  const loadTimeDesktop = Date.now() - t1;
  await desktopPage.waitForTimeout(2000);

  const mandateBody = await desktopPage.textContent('main');
  const hasCac = mandateBody.includes('9912717');
  const hasMoniepoint = mandateBody.includes('6805375225');
  const hasSection84 = mandateBody.includes('SECTION 84 EVIDENCE ACT');
  const hasSupremeCourt = mandateBody.includes('Philip Kayode Olusegun Ojo');

  results.routesTested.push({
    route: '/deal/demo/mandate',
    device: 'Desktop (1440x900)',
    loadTimeMs: loadTimeDesktop,
    hasCac,
    hasMoniepoint,
    hasSection84,
    hasSupremeCourt,
    errorsCount: desktopErrors
  });

  await desktopPage.screenshot({ path: 'scripts/reality_check_mandate_desktop.png' });
  await desktopPage.close();

  // ── TEST 3: Sovereign Command Deck ──
  console.log('👑 Testing Sovereign Command Deck with Admin Token...');
  const adminPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await adminPage.goto('https://www.bethelmindanalytics.com/admin/luxury?token=bethelmind_admin_2026', { waitUntil: 'domcontentloaded' });
  await adminPage.waitForTimeout(2000);
  await adminPage.screenshot({ path: 'scripts/reality_check_admin_desktop.png' });
  await adminPage.close();

  await browser.close();

  // Overall Verdict
  const allLoaded = results.routesTested.every(r => r.loadTimeMs < 4000);
  const zeroErrors = results.routesTested.every(r => r.errorsCount === 0);
  if (allLoaded && zeroErrors && hasCac && hasMoniepoint && hasSection84) {
    results.status = 'CERTIFIED_EVIDENCE_BACKED';
  }

  console.log('═══════════════════════════════════════════════════════');
  console.log('🏁 REALITY CHECKER AUDIT COMPLETE');
  console.log('Status:', results.status);
  console.log(JSON.stringify(results, null, 2));
  console.log('═══════════════════════════════════════════════════════');
})();
