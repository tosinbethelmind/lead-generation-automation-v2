/**
 * scripts/test_lead_journey_accessibility.js
 * 
 * Test Suite for:
 * 1. Easy Accessibility & Zero-Friction Preview Access
 * 2. Frictionless Decision Making & Tier Comparison
 * 3. Prospect Interactions & Intent Scoring (PREVIEW_VIEWED -> INBOUND_REPLY)
 * 4. Drop-Out Detection & Automated Drip Re-Engagement Lifecycle
 */

const BASE_URL = 'http://127.0.0.1:3006';

async function requestHttp(urlPath, method = 'GET', data = null, headers = {}) {
  const url = `${BASE_URL}${urlPath}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 45000);
  try {
    const opts = {
      method,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ApexReachLeadJourneyTester/1.0',
        ...headers
      },
      signal: controller.signal
    };
    if (data) {
      opts.headers['Content-Type'] = 'application/json';
      opts.body = JSON.stringify(data);
    }
    const res = await fetch(url, opts);
    const text = await res.text();
    clearTimeout(timeoutId);
    let json = null;
    try {
      json = JSON.parse(text);
    } catch (_) {}
    return { status: res.status, text, json, ok: res.ok };
  } catch (err) {
    clearTimeout(timeoutId);
    return { status: 0, error: err.message, ok: false };
  }
}

async function runLeadJourneyAccessibilityTests() {
  console.log('====================================================================');
  console.log('🏁 ApexReach Lead Journey, Accessibility & Drop-Out Recovery Test');
  console.log('====================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName, details = '') {
    if (condition) {
      console.log(`  ✅ PASSED: ${testName}${details ? ` (${details})` : ''}`);
      passed++;
    } else {
      console.error(`  ❌ FAILED: ${testName}${details ? ` (${details})` : ''}`);
      failed++;
    }
  }

  const testLeadId = 'test-moniepoint-opay-lead';
  const leadName = 'Apex Solar Solutions Ltd';

  // ---------------------------------------------------------------------------
  // STEP 1: Zero-Friction Easy Accessibility (1-Click Preview Access)
  // ---------------------------------------------------------------------------
  console.log('1️⃣ Testing Zero-Friction Accessibility & Preview Access...');

  const previewAccessRes = await requestHttp(`/preview/${testLeadId}`);
  assert(previewAccessRes.ok && previewAccessRes.text.includes('__next'), 'Zero-Barrier Preview Page Load (1-Click Link Access)', `HTTP ${previewAccessRes.status}`);

  // Track PREVIEW_VIEWED Stage
  const trackViewRes = await requestHttp('/api/lead-journey', 'POST', {
    leadId: testLeadId,
    leadName: leadName,
    category: 'Solar Business',
    phone: '+2348012345678',
    email: 'bethel@testlead.com',
    stage: 'PREVIEW_VIEWED',
    title: 'Prospect Opened Live Custom Landing Page',
    description: 'Lead clicked personalized WhatsApp preview link and spent 2+ mins on landing page.',
    channelUsed: 'WhatsApp Direct Link',
    score: 85,
    previewUrl: `${BASE_URL}/preview/${testLeadId}`
  });
  assert(trackViewRes.ok && trackViewRes.json && trackViewRes.json.success, 'Track PREVIEW_VIEWED Stage Event', `Event ID: ${trackViewRes.json?.event?.id || 'N/A'}`);

  // ---------------------------------------------------------------------------
  // STEP 2: Frictionless Decision Making (Package Comparison & Payment Options)
  // ---------------------------------------------------------------------------
  console.log('\n2️⃣ Testing Frictionless Decision Making & Payment Options...');

  // A. Dynamic Virtual Account (DVA) 1-Tap Account Generation
  const dvaRes = await requestHttp('/api/preview/claim-dva', 'POST', {
    leadId: testLeadId,
    businessName: leadName,
    isDeposit: true
  });
  assert(dvaRes.ok && dvaRes.json && dvaRes.json.success, 'Frictionless 1-Tap DVA Bank Transfer Generation', `Account: Moniepoint MFB ${dvaRes.json?.dva?.accountNumber || 'N/A'}`);

  // B. Instant ₦0 Upfront Risk Claim Option
  const zeroRiskClaimRes = await requestHttp('/api/preview/claim', 'POST', {
    leadId: testLeadId,
    clientName: 'Engr. Bethel',
    clientEmail: 'bethel@testlead.com',
    paymentMethod: 'zero_risk_staging',
    selectedFeatures: ['5-Day Done-For-You Lead Pilot'],
    customInstructions: 'Activate ₦0 Upfront Risk Pilot'
  });
  assert(zeroRiskClaimRes.ok && zeroRiskClaimRes.json && zeroRiskClaimRes.json.success, 'Zero-Risk Claim Option (₦0 Upfront Pilot)', `HTTP ${zeroRiskClaimRes.status}`);

  // ---------------------------------------------------------------------------
  // STEP 3: Prospect Engagement & Intent Signals (INBOUND_REPLY Stage)
  // ---------------------------------------------------------------------------
  console.log('\n3️⃣ Testing Inbound Engagement Signals (Chatbot & Inquiry)...');

  const trackInboundRes = await requestHttp('/api/lead-journey', 'POST', {
    leadId: testLeadId,
    leadName: leadName,
    category: 'Solar Business',
    phone: '+2348012345678',
    email: 'bethel@testlead.com',
    stage: 'INBOUND_REPLY',
    title: 'Prospect Asked AI Chatbot About Solar BOQ',
    description: 'Prospect submitted technical inquiry for 5kVA solar installation.',
    channelUsed: 'Website AI Chatbot',
    score: 92,
    metadata: { inquiryType: 'solar_boq', kva: 5 }
  });
  assert(trackInboundRes.ok && trackInboundRes.json && trackInboundRes.json.success, 'Track INBOUND_REPLY Stage Event', `Stage: ${trackInboundRes.json?.event?.stage}`);

  // ---------------------------------------------------------------------------
  // STEP 4: Drop-Out Tracking & Automated Drip Recovery Lifecycle
  // ---------------------------------------------------------------------------
  console.log('\n4️⃣ Testing Drop-Out Detection & Drip Re-engagement Tracking...');

  // Track Abandoned Checkout / Drop-Out Event
  const trackDropoutRes = await requestHttp('/api/lead-journey', 'POST', {
    leadId: testLeadId,
    leadName: leadName,
    category: 'Solar Business',
    phone: '+2348012345678',
    email: 'bethel@testlead.com',
    stage: 'DEAL_LOST',
    title: 'Checkout Abandoned at Payment Step',
    description: 'Prospect opened payment options but closed browser window without completing transfer.',
    channelUsed: 'Checkout Drop-out Monitor',
    score: 40,
    metadata: { reason: 'Payment step abandoned', dripTriggered: true, reengagementSequence: '24h_whatsapp_followup' }
  });
  assert(trackDropoutRes.ok && trackDropoutRes.json && trackDropoutRes.json.success, 'Track Drop-Out / Abandoned Checkout Event', `Status: ${trackDropoutRes.json?.event?.stage}`);

  // ---------------------------------------------------------------------------
  // STEP 5: Verification of Complete Lead Journey History Timeline
  // ---------------------------------------------------------------------------
  console.log('\n5️⃣ Verifying Complete Lead Journey Timeline History...');

  const journeyHistoryRes = await requestHttp(`/api/lead-journey?leadId=${testLeadId}`);
  assert(journeyHistoryRes.ok && journeyHistoryRes.json && journeyHistoryRes.json.journey, 'Fetch Complete Lead Journey Timeline (GET /api/lead-journey)', `Total events: ${journeyHistoryRes.json?.journey?.events?.length || 0}`);

  const events = journeyHistoryRes.json?.journey?.events || [];
  const stagesTracked = events.map(e => e.stage);
  console.log(`     📍 Captured Lifecycle Timeline Stages: ${stagesTracked.join(' ➔ ')}`);
  assert(stagesTracked.length >= 2, 'Journey Timeline Stages Successfully Preserved');

  // ---------------------------------------------------------------------------
  // SUMMARY REPORT
  // ---------------------------------------------------------------------------
  console.log('\n====================================================================');
  console.log(`📊 LEAD JOURNEY & DROP-OUT RECOVERY RESULT: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runLeadJourneyAccessibilityTests().catch(err => {
  console.error('Fatal Lead Journey Test Error:', err);
  process.exit(1);
});
