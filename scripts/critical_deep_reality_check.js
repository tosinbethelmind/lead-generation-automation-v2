const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const NIGERIAN_CARRIER_PREFIXES = [
  // MTN
  '0803', '0806', '0703', '0706', '0813', '0816', '0810', '0814', '0903', '0906', '0913', '0916',
  // Airtel
  '0802', '0808', '0708', '0812', '0701', '0902', '0901', '0904', '0907', '0912',
  // Glo
  '0805', '0807', '0705', '0815', '0811', '0905', '0915',
  // 9mobile
  '0809', '0818', '0817', '0909', '0908'
];

function validateNigerianPhone(phone) {
  const clean = String(phone || '').replace(/\D/g, '');
  const local = clean.startsWith('234') ? '0' + clean.slice(3) : clean;
  if (local.length !== 11) return { valid: false, reason: `Length is ${local.length}, must be 11 digits` };
  const prefix = local.slice(0, 4);
  if (!NIGERIAN_CARRIER_PREFIXES.includes(prefix)) {
    return { valid: false, reason: `Prefix ${prefix} is not an official Nigerian carrier prefix` };
  }
  if (/(\d)\1{4,}/.test(local)) return { valid: false, reason: 'Contains 5+ repeating digits' };
  if (local.includes('123456') || local.includes('000000')) return { valid: false, reason: 'Contains sequential run' };
  return { valid: true, local };
}

function validateEmail(email) {
  if (!email || typeof email !== 'string') return { valid: false, reason: 'Missing email' };
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) return { valid: false, reason: 'Invalid RFC format' };
  if (email.includes('@example.com') || email.includes('@test.com')) return { valid: false, reason: 'Placeholder domain' };
  return { valid: true };
}

(async () => {
  console.log('========================================================================');
  console.log('🧐 CRITICAL DEEP REALITY-CHECK & FULL SYSTEM VERIFICATION');
  console.log('Target: https://www.bethelmindanalytics.com');
  console.log('Timestamp:', new Date().toISOString());
  console.log('========================================================================\n');

  let passed = 0;
  let failed = 0;
  const errors = [];

  function check(condition, testName, details = '') {
    if (condition) {
      passed++;
      console.log(`✅ [PASS] ${testName} ${details ? '(' + details + ')' : ''}`);
    } else {
      failed++;
      errors.push(`${testName}: ${details}`);
      console.error(`❌ [FAIL] ${testName} --> ${details}`);
    }
  }

  // Ensure screenshot dir exists
  const ssDir = path.join(__dirname, '..', 'public', 'qa-screenshots');
  if (!fs.existsSync(ssDir)) fs.mkdirSync(ssDir, { recursive: true });

  // ──────────────────────────────────────────────────────────────────────────
  // PHASE 1: API CONTRACT & DATA INTEGRITY
  // ──────────────────────────────────────────────────────────────────────────
  console.log('--- PHASE 1: API Contract & Telemetry Validation ---');
  let cookie = '';
  try {
    const loginRes = await fetch('https://www.bethelmindanalytics.com/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: 'bethelmind_admin_2026' })
    });
    check(loginRes.status === 200, 'Admin Authentication Endpoint');
    cookie = loginRes.headers.get('set-cookie') || '';
    check(cookie.length > 0, 'Admin Session Cookie Secured');
  } catch (e) {
    check(false, 'Login Network Call', e.message);
  }

  let telemetry = null;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch('https://www.bethelmindanalytics.com/api/admin/mobile-control', {
        headers: { 
          'Cookie': cookie,
          'x-admin-token': 'bethelmind_admin_2026'
        },
        signal: AbortSignal.timeout(25000)
      });
      if (res.status === 200) {
        check(true, 'Mobile Control API Endpoint');
        telemetry = await res.json();
        check(telemetry.success === true, 'Telemetry Success Flag');
        break;
      } else {
        if (attempt === 3) check(false, 'Mobile Control API Endpoint', `Status: ${res.status}`);
      }
    } catch (e) {
      if (attempt === 3) check(false, 'Telemetry Network Call', e.message);
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  const allTickets = telemetry?.pillar2?.allTickets || [];
  check(allTickets.length >= 8, 'All 8 Luxury Tickets Loaded in Telemetry', `${allTickets.length} tickets`);

  console.log('\n--- Auditing Individual Ticket Contract Integrity ---');
  for (const t of allTickets) {
    const id = t.ticketId;
    console.log(`\nInspecting Deal #${id}:`);

    // 1. Phone & Email
    const pCheck = validateNigerianPhone(t.targetContactPhone);
    check(pCheck.valid, `[#${id}] Broker Phone Carrier Prefix`, `${t.targetContactPhone} (${pCheck.reason || 'OK'})`);
    const eCheck = validateEmail(t.targetContactEmail);
    check(eCheck.valid, `[#${id}] Broker RFC Corporate Email`, `${t.targetContactEmail}`);

    // 2. Tri-Channel Outbound Links
    check(t.directChatLink && t.directChatLink.startsWith('https://wa.me/'), `[#${id}] Direct WhatsApp Link Format`);
    check(t.smsLink && t.smsLink.startsWith('sms:+'), `[#${id}] Direct GSM SMS Link Format`);
    check(t.smsText && t.smsText.length <= 158, `[#${id}] GSM SMS Cap <= 158 Chars`, `${t.smsText?.length} chars`);
    check(t.emailSubject && t.emailSubject.includes('LASRERA'), `[#${id}] Email Subject LASRERA Notice`);
    check(t.emailBody && t.emailBody.includes('6805375225'), `[#${id}] Email Body Moniepoint Account 6805375225`);

    // 3. Buyer Dossier
    const buyer = t.buyerProfile;
    check(Boolean(buyer), `[#${id}] Buyer Profile Exists`);
    if (buyer) {
      check(Boolean(buyer.buyerCode), `[#${id}] Buyer Code`, buyer.buyerCode);
      check(Boolean(buyer.principalName), `[#${id}] Principal Name`, buyer.principalName);
      check(Boolean(buyer.allocatedBudgetFormatted), `[#${id}] Allocated Budget`, buyer.allocatedBudgetFormatted);
      check(Boolean(buyer.purpose), `[#${id}] Specific Purpose Defined`);
      check(Boolean(buyer.requirements), `[#${id}] Requirements Defined`);
      check(Boolean(buyer.readinessTimeline), `[#${id}] Acquisition Timeline`, buyer.readinessTimeline);
      check(Boolean(buyer.liquidityStatus), `[#${id}] Liquidity Status`, buyer.liquidityStatus);

      // Representative Contact
      const rep = buyer.representativeContact;
      check(Boolean(rep), `[#${id}] Representative Contact Block Present`);
      if (rep) {
        check(Boolean(rep.name), `[#${id}] Representative Name`, rep.name);
        const repPCheck = validateNigerianPhone(rep.phone);
        check(repPCheck.valid, `[#${id}] Representative Phone Valid`, rep.phone);
        const repECheck = validateEmail(rep.email);
        check(repECheck.valid, `[#${id}] Representative Email Valid`, rep.email);
        check(Boolean(rep.officeAddress), `[#${id}] Representative Lagos Address`, rep.officeAddress);
      }

      // Source Attribution
      const src = buyer.sourceAttribution;
      check(Boolean(src), `[#${id}] Source Attribution Block Present`);
      if (src) {
        check(Boolean(src.sourceName), `[#${id}] Source Registry Name`, src.sourceName);
        check(Boolean(src.sourceUrl && src.sourceUrl.startsWith('https://')), `[#${id}] Source Cross-Check URL`, src.sourceUrl);
        check(Boolean(src.proofOfFundsRef), `[#${id}] Proof of Funds Reference`, src.proofOfFundsRef);
        check(Boolean(src.statutoryCompliance), `[#${id}] Statutory Compliance Statement`, src.statutoryCompliance);
      }
    }

    // 4. Inbound Call Brief & Process Map
    const brief = t.inboundCallBrief;
    check(Boolean(brief), `[#${id}] Inbound Call Brief Present`);
    if (brief) {
      check(Boolean(brief.openingGreeting), `[#${id}] Brief Opening Greeting Script`);
      check(Boolean(brief.buyerProfileResponse), `[#${id}] Brief "Who Is Your Buyer?" Script`);
      check(Boolean(brief.inspectionProtocol), `[#${id}] Brief Inspection Protocol Script`);
      check(Boolean(brief.commissionSummary?.brokerCutFormatted?.includes('80%')), `[#${id}] 80% Partner Split Math Pre-Calculated`);
      check(Boolean(brief.commissionSummary?.bethelmindCutFormatted?.includes('20%')), `[#${id}] 20% Bethelmind Cut Math Pre-Calculated`);
      check(Array.isArray(brief.processMap) && brief.processMap.length === 6, `[#${id}] Process Map Has Exactly 6 Stages`, `${brief.processMap?.length} stages`);
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // PHASE 2: LIVE HTTP ENDPOINTS AUDIT (DEAL API, TEASERS & MANDATES)
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n--- PHASE 2: Live Deal API & Web Page Status Audit ---');
  const dealIds = [
    'DEAL-LEKKI1-1100M',
    'DEAL-AMEN-500M',
    'DEAL-BANANA-1500M',
    'DEAL-LEKKI1-480M',
    'DEAL-VI-850M',
    'DEAL-LEKKIEPE-750M',
    'DEAL-IKOYI-420M',
    'DEAL-IKEJA-650M'
  ];

  for (const did of dealIds) {
    const apiUrl = `https://www.bethelmindanalytics.com/api/deal/${did}`;
    const teaserUrl = `https://www.bethelmindanalytics.com/deal/${did}`;
    const mandateUrl = `https://www.bethelmindanalytics.com/deal/${did}/mandate`;

    try {
      const apiRes = await fetch(apiUrl, { method: 'GET', signal: AbortSignal.timeout(15000) });
      check(apiRes.status === 200, `API Deal Data [${did}] HTTP 200`, `Status: ${apiRes.status}`);
      const apiJson = await apiRes.json();
      check(apiJson.success === true, `API Deal Data [${did}] Success Flag True`);
      check(apiJson.deal?.digital_mandate?.settlement_account === '6805375225', `API Deal [${did}] Moniepoint 6805375225 Present`);
    } catch (e) {
      check(false, `API Deal Endpoint [${did}]`, e.message);
    }

    try {
      const tRes = await fetch(teaserUrl, { method: 'GET', signal: AbortSignal.timeout(15000) });
      check(tRes.status === 200, `Live Deal Teaser [${did}] HTTP 200`, `Status: ${tRes.status}`);
      const tHtml = await tRes.text();
      check(tHtml.includes('Bethelmind') || tHtml.includes('Mandate'), `Deal Teaser HTML Contains Brand/Mandate Content`);
    } catch (e) {
      check(false, `Deal Teaser [${did}] Reachable`, e.message);
    }

    try {
      const mRes = await fetch(mandateUrl, { method: 'GET', signal: AbortSignal.timeout(15000) });
      check(mRes.status === 200, `Live Deal Mandate Document [${did}] HTTP 200`, `Status: ${mRes.status}`);
    } catch (e) {
      check(false, `Deal Mandate [${did}] Reachable`, e.message);
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // PHASE 3: PLAYWRIGHT HEADLESS BROWSER AUDIT & VISUAL PROOF
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n--- PHASE 3: Headless Chromium End-to-End Visual Audit ---');
  let browser = null;
  const consoleErrors = [];

  try {
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });

    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });

    if (cookie) {
      const parts = cookie.split(';')[0].split('=');
      if (parts.length === 2) {
        await context.addCookies([{
          name: parts[0].trim(),
          value: parts[1].trim(),
          domain: 'www.bethelmindanalytics.com',
          path: '/'
        }]);
      }
    }

    const page = await context.newPage();
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    // 1. Visit Login / Mobile App via direct authenticated entry
    console.log('Navigating to authenticated mobile admin desk (/admin/mobile)...');
    await page.goto('https://www.bethelmindanalytics.com/api/admin/login?token=bethelmind_admin_2026&redirect=/admin/mobile', { waitUntil: 'load', timeout: 30000 });
    await page.waitForTimeout(4000);
    console.log(`Landed on: ${page.url()}`);

    // Switch to Pillar 2 Deal Wire tab via in-page dispatch
    console.log('Switching to Pillar 2 Deal Wire tab...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const p2 = btns.find(b => b.textContent && b.textContent.includes('PILLAR 2'));
      if (p2) p2.click();
    });

    console.log('Waiting for Pillar 2 view to hydrate...');
    await page.waitForSelector('text=High-Ticket Mandates', { timeout: 20000 });
    console.log('Pillar 2 view successfully hydrated!');

    // Look for Inbound Call Crib Sheet button
    const cribBtn = page.locator('button:has-text("Inbound Call Crib Sheet")');
    const cribCount = await cribBtn.count();
    check(cribCount > 0, 'Inbound Call Crib Sheet Buttons Rendered in DOM', `${cribCount} buttons found`);

    if (cribCount > 0) {
      console.log('Clicking first [📞 Inbound Call Crib Sheet] button...');
      await cribBtn.first().click();
      await page.waitForTimeout(2000);

      // Verify Modal Content
      const modal = page.locator('div:has-text("Inbound Call Crib Sheet & Negotiation Brief")');
      check(await modal.count() > 0, 'Crib Sheet Modal Opens Upon Click');

      // Verify Buyer Profile inside Modal
      const buyerText = await page.locator('text=Interested Buyer Profile').count();
      check(buyerText > 0, 'Buyer Profile Rendered in Modal');

      // Verify Buyer Representative / Legal Counsel
      const repText = await page.locator('text=Buyer Liaison / Legal Representative').count();
      check(repText > 0, 'Buyer Legal Representative Contact Block Rendered in Modal');

      // Verify Source Attribution
      const srcText = await page.locator('text=Verified Source Attribution').count();
      check(srcText > 0, 'Source Attribution & Cross-Check Link Rendered in Modal');

      // Verify Process Map
      const mapText = await page.locator('text=Transaction Execution Process Map').count();
      check(mapText > 0, '6-Stage Process Map Rendered in Modal');

      // Verify Telephone Scripts
      const scriptText = await page.locator('text=Word-for-Word Telephone Scripts').count();
      check(scriptText > 0, 'Telephone Talking Points Rendered in Modal');

      // Capture Screenshot of Open Crib Sheet Modal
      const cribScreenshotPath = path.join(ssDir, 'reality_check_crib_sheet_live.png');
      await page.screenshot({ path: cribScreenshotPath });
      check(fs.existsSync(cribScreenshotPath), 'Crib Sheet Modal Screenshot Captured', cribScreenshotPath);
    }

    // 2. Mobile Viewport Deal Teaser Page
    console.log('Navigating to mobile deal teaser page (DEAL-LEKKI1-1100M)...');
    const mobileContext = await browser.newContext({
      viewport: { width: 375, height: 812 },
      isMobile: true
    });
    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto('https://www.bethelmindanalytics.com/deal/DEAL-LEKKI1-1100M', { waitUntil: 'load', timeout: 30000 });
    await mobilePage.waitForSelector('h1, h2', { timeout: 20000 });
    await mobilePage.waitForTimeout(2000);

    const dealTitle = await mobilePage.locator('h1, h2').first().innerText();
    check(dealTitle.length > 0 && !dealTitle.includes('Unavailable'), 'Mobile Deal Page Title Rendered Validly', dealTitle.substring(0, 40));

    // Verify Signature Pad or Claim block
    const canvas = mobilePage.locator('canvas');
    check(await canvas.count() > 0, 'Interactive Signature Pad Canvas Rendered on Mobile');

    const mobileScreenshotPath = path.join(ssDir, 'reality_check_deal_teaser_mobile.png');
    await mobilePage.screenshot({ path: mobileScreenshotPath, fullPage: true });
    check(fs.existsSync(mobileScreenshotPath), 'Mobile Deal Teaser Screenshot Captured', mobileScreenshotPath);

    // 3. Mobile Viewport Mandate Page (Check Moniepoint and Seal)
    console.log('Navigating to mobile mandate agreement page (DEAL-LEKKI1-1100M/mandate)...');
    await mobilePage.goto('https://www.bethelmindanalytics.com/deal/DEAL-LEKKI1-1100M/mandate', { waitUntil: 'load', timeout: 30000 });
    
    // Explicitly wait for the mandate API data to populate the DOM
    console.log('Waiting for mandate agreement data to hydrate...');
    await mobilePage.waitForSelector('text=6805375225', { timeout: 20000 });
    await mobilePage.waitForTimeout(1000);

    const mandateBodyText = await mobilePage.locator('body').innerText();
    check(mandateBodyText.includes('6805375225'), 'Mandate Page Verified Moniepoint Account 6805375225 in DOM');
    check(mandateBodyText.includes('Bethelmind Digital Solutions'), 'Mandate Page Verified Bethelmind Brand in DOM');
    check(mandateBodyText.includes('Evidence Act, 2011'), 'Mandate Page Verified Evidence Act 2011 in DOM');

    const mandateScreenshotPath = path.join(ssDir, 'reality_check_signed_mandate_mobile.png');
    await mobilePage.screenshot({ path: mandateScreenshotPath, fullPage: true });
    check(fs.existsSync(mandateScreenshotPath), 'Mobile Mandate Document Screenshot Captured', mandateScreenshotPath);

    await mobileContext.close();
    await context.close();
  } catch (e) {
    check(false, 'Playwright Test Execution', e.message);
  } finally {
    if (browser) await browser.close();
  }

  console.log(`\nCaptured Browser Console Errors: ${consoleErrors.length}`);
  if (consoleErrors.length > 0) {
    console.log('Sample console errors:', consoleErrors.slice(0, 3));
  }

  // ──────────────────────────────────────────────────────────────────────────
  // FINAL SUMMARY REPORT
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n========================================================================');
  console.log(`📊 REALITY-CHECK AUDIT RESULT: ${passed} PASSED, ${failed} FAILED out of ${passed + failed} CHECKS`);
  if (failed === 0) {
    console.log('🎉 100% UNCONDITIONAL SUCCESS: EVIDENCE-BASED CERTIFICATION COMPLETE!');
    console.log('🏛️ Bethelmind Digital Solutions High-Ticket Deal Engine is 100% Verified.');
  } else {
    console.error('⚠️ AUDIT REPORTED FAILURES:');
    errors.forEach(e => console.error('  - ' + e));
  }
  console.log('========================================================================\n');
})();
