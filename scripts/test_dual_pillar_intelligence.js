/**
 * @file scripts/test_dual_pillar_intelligence.js
 * Comprehensive automated verification for Dual-Pillar WhatsApp Intelligence.
 */

const { handlePostContactInquiryAsync, lookupLeadForWhatsApp } = require('./lib/closer_engine');
const { isPillar2Phone, registerPillar2Contact } = require('./lib/pillar2_contacts_registry');

async function runTestSuite() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('🧪 DUAL-PILLAR WHATSAPP CLOSER INTELLIGENCE VERIFICATION');
  console.log('═══════════════════════════════════════════════════════════════\n');

  let passed = 0;
  let total = 0;

  function assert(condition, testName, details = '') {
    total++;
    if (condition) {
      passed++;
      console.log(`✅ [PASS] ${testName}`);
    } else {
      console.error(`❌ [FAIL] ${testName} - ${details}`);
    }
  }

  // ── TEST 1: Whitelisted Real Estate Broker Phone Recognition ─────────────
  const jideTaiwoPhone = '07052090092';
  const jideTail = isPillar2Phone(jideTaiwoPhone);
  assert(
    jideTail !== null && jideTail.brokerName.includes('Jide Taiwo'),
    'Jide Taiwo (07052090092) automatically recognized in Pillar 2 Registry'
  );

  const oraPhone = '08038774238';
  const oraTail = isPillar2Phone(oraPhone);
  assert(
    oraTail !== null && oraTail.brokerName.includes('Ora Egbunike'),
    'Ora Egbunike (08038774238) automatically recognized in Pillar 2 Registry'
  );

  // ── TEST 2: Pillar 2 Conversation: Casual Greeting from Broker ───────────
  const leadP2 = lookupLeadForWhatsApp(jideTaiwoPhone, 'Good morning');
  const decP2Greeting = await handlePostContactInquiryAsync('Good morning', {
    ...leadP2,
    phone: jideTaiwoPhone
  });
  assert(
    decP2Greeting.messageText.includes('Bethelmind Corporate Property Desk') &&
    !decP2Greeting.messageText.includes('₦35,000') &&
    !decP2Greeting.messageText.includes('website'),
    'Pillar 2 Greeting: Broker receives executive real estate reply (Zero SME copy)',
    decP2Greeting.messageText
  );

  // ── TEST 3: Pillar 2 Conversation: Identity Query ("Who is this?") ───────
  const decP2Identity = await handlePostContactInquiryAsync('Who is this?', {
    ...leadP2,
    phone: jideTaiwoPhone
  });
  assert(
    decP2Identity.messageText.includes('Tosin Oyelakin') &&
    decP2Identity.messageText.includes('CAC Certified Nigerian Enterprise: Reg 9912717') &&
    decP2Identity.messageText.includes('LASRERA 80/20 co-brokerage'),
    'Pillar 2 Identity: Explains Corporate Desk & 80/20 mandate terms',
    decP2Identity.messageText
  );

  // ── TEST 4: Pillar 2 Conversation: Confirmation ("Yes, it is available") ─
  const decP2Avail = await handlePostContactInquiryAsync('Yes, it is available', {
    ...leadP2,
    phone: jideTaiwoPhone
  });
  assert(
    decP2Avail.intent === 'PILLAR2_AVAILABILITY_CONFIRMED' &&
    decP2Avail.messageText.includes('https://www.bethelmindanalytics.com/mandate'),
    'Pillar 2 Availability: Directs broker to Joint Inspection Memorandum portal',
    decP2Avail.messageText
  );

  // ── TEST 5: Pillar 2 Conversation: Call Request ("Please call me") ───────
  const decP2Call = await handlePostContactInquiryAsync('Please call my phone now', {
    ...leadP2,
    phone: jideTaiwoPhone
  });
  assert(
    decP2Call.intent === 'PILLAR2_CALL_REQUEST' &&
    decP2Call.messageText.includes('dial your line shortly'),
    'Pillar 2 Call Request: Acknowledges call and supplies desk hotline',
    decP2Call.messageText
  );

  // ── TEST 6: Pillar 2 Conversation: Sold / Not Available ──────────────────
  const decP2Sold = await handlePostContactInquiryAsync('The property has been sold', {
    ...leadP2,
    phone: jideTaiwoPhone
  });
  assert(
    decP2Sold.intent === 'PILLAR2_MANDATE_UNAVAILABLE' &&
    decP2Sold.isOptOut === true &&
    decP2Sold.messageText.includes('Understood and noted'),
    'Pillar 2 Sold: Archives mandate respectfully without spam',
    decP2Sold.messageText
  );

  // ── TEST 7: Pillar 1 Conversation: Retail SME Business ───────────────────
  const retailPhone = '08031234567';
  const leadP1 = lookupLeadForWhatsApp(retailPhone, 'Hello, I saw your message');
  const decP1 = await handlePostContactInquiryAsync('Hello, I saw your message', {
    ...leadP1,
    businessName: 'Glamour Beauty Hub',
    category: 'Salons & Spas',
    area: 'Ikeja',
    phone: retailPhone
  });
  assert(
    !decP1.messageText.includes('LASRERA') &&
    !decP1.messageText.includes('mandate') &&
    (decP1.messageText.includes('Boss') || decP1.messageText.includes('storefront') || decP1.messageText.includes('website')),
    'Pillar 1 Retail SME: Receives commercial SME website reply (Zero Real Estate copy)',
    decP1.messageText
  );

  // ── TEST 8: Semantic Routing from an Unknown Number ──────────────────────
  const unknownPhone = '08129998877';
  const decSemanticP2 = await handlePostContactInquiryAsync('Do you have a diaspora buyer for a duplex in Banana Island?', {
    phone: unknownPhone
  });
  assert(
    decSemanticP2.messageText.includes('Corporate & Diaspora Property Desk') ||
    decSemanticP2.messageText.includes('mandate') ||
    decSemanticP2.intent.startsWith('PILLAR2_'),
    'Semantic Real Estate Intercept: Unknown number inquiring about Banana Island duplex routes to Pillar 2',
    decSemanticP2.messageText
  );

  console.log(`\n═══════════════════════════════════════════════════════════════`);
  console.log(`🏁 TEST RESULTS: ${passed}/${total} PASSED (${Math.round((passed/total)*100)}%)`);
  console.log(`═══════════════════════════════════════════════════════════════`);

  if (passed === total) {
    console.log('🎉 ALL DUAL-PILLAR INTELLIGENCE TESTS PASSED PERFECTLY!');
  } else {
    process.exit(1);
  }
}

runTestSuite().catch(err => {
  console.error('Test Suite Failed:', err);
  process.exit(1);
});
