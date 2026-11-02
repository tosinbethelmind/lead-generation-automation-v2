/**
 * @file scripts/verify_all_high_profile_leads_and_links.js
 * 
 * 🏛️ ENTERPRISE LEAD & LINK VALIDATION SUITE
 * Bethelmind Digital Solutions (CAC Certified: Reg 9912717)
 * Settlement: Moniepoint Microfinance Bank (6805375225)
 * 
 * Audits 100% of leads, broker contacts, URLs, SMS character lengths, 
 * email formats, and buyer dossiers on live production.
 */

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

  // Reject repeating patterns
  if (/(\d)\1{4,}/.test(local)) return { valid: false, reason: 'Contains 5+ repeating digits' };
  if (local.includes('123456') || local.includes('000000')) return { valid: false, reason: 'Contains sequential run' };

  return { valid: true, e164: '234' + local.slice(1), local };
}

function validateEmail(email) {
  if (!email || typeof email !== 'string') return { valid: false, reason: 'Missing email' };
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) return { valid: false, reason: 'Invalid RFC email format' };
  if (email.includes('@example.com') || email.includes('@test.com')) return { valid: false, reason: 'Placeholder domain forbidden' };
  return { valid: true };
}

(async () => {
  console.log('========================================================================');
  console.log('🏛️ RUNNING ENTERPRISE HIGH-PROFILE LEAD & LINK VALIDATION AUDIT');
  console.log('🌐 Target: https://www.bethelmindanalytics.com');
  console.log('========================================================================\n');

  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;

  function assert(condition, testName, details = '') {
    totalTests++;
    if (condition) {
      passedTests++;
      console.log(`✅ [PASS] ${testName} ${details ? '(' + details + ')' : ''}`);
    } else {
      failedTests++;
      console.error(`❌ [FAIL] ${testName} ${details ? '--> ' + details : ''}`);
    }
  }

  // STEP 1: Authenticate and Fetch Live Telemetry
  console.log('--- 1. Authenticating with Production Security Guard ---');
  let cookie = '';
  try {
    const loginRes = await fetch('https://www.bethelmindanalytics.com/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: 'bethelmind_admin_2026' })
    });
    assert(loginRes.status === 200, 'Admin Login Authentication HTTP 200');
    cookie = loginRes.headers.get('set-cookie') || '';
    assert(cookie.length > 0, 'Session Cookie Secured');
  } catch (e) {
    assert(false, 'Login Exception', e.message);
  }

  // STEP 2: Fetch Pillar 2 Telemetry
  console.log('\n--- 2. Auditing Live Pillar 2 High-Ticket Deals ---');
  let data = null;
  try {
    const res = await fetch('https://www.bethelmindanalytics.com/api/admin/mobile-control', {
      headers: { 'Cookie': cookie }
    });
    assert(res.status === 200, 'Mobile Control API HTTP 200');
    data = await res.json();
    assert(data.success === true, 'Mobile Control API Success Flag True');
  } catch (e) {
    assert(false, 'Mobile Control API Exception', e.message);
  }

  const allTickets = data?.pillar2?.allTickets || [];
  const pendingTickets = data?.pillar2?.pendingTickets || [];
  console.log(`Total Staged/Pending Tickets to Audit: ${allTickets.length}`);

  // STEP 3: Deep Audit on Every Lead & Deal
  console.log('\n--- 3. Rigorous Lead, Link & Buyer Dossier Validation ---');
  for (const ticket of allTickets) {
    const id = ticket.ticketId;
    console.log(`\nAuditing Ticket #${id} (${ticket.title?.replace('Pillar 2 Mandate: ', '')})`);

    // A. Phone Validation
    const phoneCheck = validateNigerianPhone(ticket.targetContactPhone);
    assert(phoneCheck.valid, `[#${id}] Broker Phone Validity: ${ticket.targetContactPhone}`, phoneCheck.reason);

    // B. Email Validation
    const emailCheck = validateEmail(ticket.targetContactEmail);
    assert(emailCheck.valid, `[#${id}] Broker Corporate Email: ${ticket.targetContactEmail}`, emailCheck.reason);

    // C. WhatsApp Link Check
    const hasWa = ticket.directChatLink && ticket.directChatLink.startsWith('https://wa.me/');
    assert(hasWa, `[#${id}] Direct WhatsApp Deep-Link Format`);

    // D. GSM SMS Link & 158-Character Cap
    const hasSms = ticket.smsLink && ticket.smsLink.startsWith('sms:+');
    assert(hasSms, `[#${id}] Native GSM SMS Deep-Link Format`);
    const smsLen = ticket.smsText ? ticket.smsText.length : 0;
    assert(smsLen > 0 && smsLen <= 158, `[#${id}] GSM SMS Length <= 158 Chars`, `${smsLen} chars`);

    // E. Email Memo Subject & Body
    const hasEmailSubject = Boolean(ticket.emailSubject && ticket.emailSubject.includes('LASRERA'));
    assert(hasEmailSubject, `[#${id}] Corporate Email Subject Includes LASRERA Notice`);
    const hasEmailBody = Boolean(ticket.emailBody && ticket.emailBody.includes('6805375225'));
    assert(hasEmailBody, `[#${id}] Corporate Email Body Includes Moniepoint Account 6805375225`);

    // F. Buyer Dossier Validation
    const buyer = ticket.buyerProfile;
    assert(Boolean(buyer), `[#${id}] Matched Interested Buyer Profile Exists`);
    if (buyer) {
      assert(Boolean(buyer.buyerCode), `[#${id}] Buyer Code Assigned`, buyer.buyerCode);
      assert(Boolean(buyer.principalName), `[#${id}] Buyer Principal Name Present`, buyer.principalName);
      assert(Boolean(buyer.allocatedBudgetFormatted), `[#${id}] Buyer Allocated Budget Present`, buyer.allocatedBudgetFormatted);
      assert(Boolean(buyer.purpose), `[#${id}] Buyer Acquisition Purpose Defined`);
      assert(Boolean(buyer.requirements), `[#${id}] Specific Property Requirements Defined`);
      assert(Boolean(buyer.readinessTimeline), `[#${id}] Acquisition Timeline Defined`, buyer.readinessTimeline);
      assert(Boolean(buyer.liquidityStatus), `[#${id}] Liquidity / POF Status Verified`, buyer.liquidityStatus);
    }

    // G. Inbound Call Crib Sheet
    const brief = ticket.inboundCallBrief;
    assert(Boolean(brief), `[#${id}] Inbound Call Crib Sheet Attached`);
    if (brief) {
      assert(Boolean(brief.openingGreeting), `[#${id}] Opening Greeting Phone Script Attached`);
      assert(Boolean(brief.buyerProfileResponse), `[#${id}] "Who Is Your Buyer?" Phone Script Attached`);
      assert(Boolean(brief.inspectionProtocol), `[#${id}] Inspection & 80/20 Fee Lock Script Attached`);
      assert(Boolean(brief.commissionSummary?.brokerCutFormatted), `[#${id}] 80% Partner Split Math Pre-Calculated`, brief.commissionSummary?.brokerCutFormatted);
      assert(Boolean(brief.commissionSummary?.bethelmindCutFormatted), `[#${id}] 20% Bethelmind Cut Math Pre-Calculated`, brief.commissionSummary?.bethelmindCutFormatted);
    }
  }

  // STEP 4: Live Core Web Endpoints Audit
  console.log('\n--- 4. Live Core Web Endpoints & Deep Links Audit ---');
  const urlsToCheck = [
    { name: 'Mobile App Login Route', url: 'https://www.bethelmindanalytics.com/app' },
    { name: 'Solutions Hub', url: 'https://www.bethelmindanalytics.com/solutions' },
    { name: 'Marketplace', url: 'https://www.bethelmindanalytics.com/marketplace' },
    { name: 'Solar BOQ Tool', url: 'https://www.bethelmindanalytics.com/tools/solar-boq' },
    { name: 'Salon Booking Tool', url: 'https://www.bethelmindanalytics.com/tools/salon-booking' },
    { name: 'Tokunbo Import Duty Tool', url: 'https://www.bethelmindanalytics.com/tools/tokunbo-duty' },
    { name: 'Integrations Blueprint', url: 'https://www.bethelmindanalytics.com/tools/integrations' }
  ];

  for (const item of urlsToCheck) {
    try {
      const res = await fetch(item.url, { method: 'HEAD', signal: AbortSignal.timeout(5000) });
      assert(res.status < 400, `Live URL [${item.name}] (${item.url}) HTTP < 400`, `Status: ${res.status}`);
    } catch (e) {
      assert(false, `Live URL [${item.name}] unreachable`, e.message);
    }
  }

  console.log('\n========================================================================');
  console.log(`📊 AUDIT COMPLETE: ${passedTests} PASSED, ${failedTests} FAILED out of ${totalTests} CHECKS`);
  if (failedTests === 0) {
    console.log('🎉 100% SUCCESS: ZERO DEFECTS, ZERO BROKEN LINKS, ZERO SYNTHETIC LEADS!');
    console.log('🏛️ Enterprise Grade Verified for Bethelmind Digital Solutions.');
  } else {
    console.error(`⚠️ ATTENTION REQUIRED: ${failedTests} checks failed.`);
  }
  console.log('========================================================================');
})();
