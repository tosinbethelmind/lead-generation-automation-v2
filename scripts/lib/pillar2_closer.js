/**
 * @file scripts/lib/pillar2_closer.js
 * 
 * 🏛️ BETHELMIND PILLAR 2: HIGH-TICKET LUXURY REAL ESTATE CO-BROKERAGE CLOSER
 * 
 * Specifically handles inquiries from verified Nigerian brokers, surveyors, 
 * and valuation partners for LASRERA 80/20 Joint Mandates across Lagos.
 * 
 * STRICT INVARIANT:
 * Zero website pitches, zero shop photo requests, zero ₦35k/₦25k pricing.
 * Strictly operates as the Bethelmind Corporate & Diaspora Property Desk
 * (CAC Certified: Reg 9912717 | Moniepoint MFB: 6805375225).
 */

const fs = require('fs');
const path = require('path');

const CORPORATE_SETTLEMENT = {
  bankName: 'Moniepoint Microfinance Bank',
  accountNumber: '6805375225',
  accountName: 'Bethelmind Digital Solutions',
  cacReg: 'Reg 9912717',
  deskHotline: '+234 802 279 1227',
  principal: 'Tosin Oyelakin'
};

const VERIFIED_BROKERS = [
  {
    name: 'Ora Egbunike & Associates',
    phones: ['08038774238', '08021061457', '09033157777'],
    email: 'info@oraegbunike.com',
    defaultListing: '7bdrm Sovereign Mansion in Amen Estate, Lekki Expressway (₦500M)',
    defaultTicketId: 'DEAL-AMEN-500M',
    city: 'Victoria Island / Onikan, Lagos'
  },
  {
    name: 'Deep-Delve Concepts',
    phones: ['08033008985'],
    email: 'mandates@deepdelve.ng',
    defaultListing: '7bdrm Sovereign Mansion in Amen Estate, Lekki Expressway (₦500M)',
    defaultTicketId: 'DEAL-AMEN-500M',
    city: 'Lekki Phase 1, Lagos'
  },
  {
    name: 'Jide Taiwo & Co',
    phones: ['07052090092', '07052090118'],
    email: 'properties@jidetaiwoandco.com',
    defaultListing: 'Waterfront 6-Bedroom Contemporary Villa in Banana Island, Ikoyi (₦1.5B)',
    defaultTicketId: 'DEAL-BANANA-1500M',
    city: 'Victoria Island / Ikeja, Lagos'
  },
  {
    name: 'Broll Property Services Nigeria',
    phones: ['08033214589'],
    email: 'nigeria@broll.com',
    defaultListing: '5bdrm Contemporary Detached Duplex in Lekki Phase 1 (₦480M)',
    defaultTicketId: 'DEAL-LEKKI1-480M',
    city: 'Victoria Island, Lagos'
  },
  {
    name: 'Diya Fatimilehin & Co',
    phones: ['09053964068', '08113950582', '09154094445', '08023456781'],
    email: 'mandates@diyafatimilehin.com',
    defaultListing: '5-Bedroom Fully Automated Detached House in Victoria Island Commercial Corridor (₦850M)',
    defaultTicketId: 'DEAL-VI-850M',
    city: 'Lekki / Ikoyi, Lagos'
  },
  {
    name: 'Knight Frank Nigeria',
    phones: ['08035678912'],
    email: 'commercial@ng.knightfrank.com',
    defaultListing: 'Commercial High-Rise Development Plot along Lekki-Epe Expressway Corridor (₦750M)',
    defaultTicketId: 'DEAL-LEKKIEPE-750M',
    city: 'Victoria Island, Lagos'
  },
  {
    name: 'Ubosi Eleh & Co',
    phones: ['08054797515', '08028765432'],
    email: 'valuation@ubosielehandco.com',
    defaultListing: '4-Bedroom Luxury Sky Penthouse overlooking Ikoyi Golf Course (₦420M)',
    defaultTicketId: 'DEAL-IKOYI-420M',
    city: 'Ikeja / Victoria Island, Lagos'
  },
  {
    name: 'Alpha Mead Real Estate Partners',
    phones: ['07019999343', '08091124022'],
    email: 'realestate@alphamead.com',
    defaultListing: 'Prime Logistics & Industrial Warehouse Complex in Ikeja Industrial Estate (₦650M)',
    defaultTicketId: 'DEAL-IKEJA-650M',
    city: 'Victoria Island / Ikoyi, Lagos'
  }
];

/**
 * Normalizes phone number to last 10 digits for robust comparison
 */
function cleanPhoneTail(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  return digits.length >= 10 ? digits.slice(-10) : digits;
}

/**
 * Determines whether an incoming WhatsApp message belongs to Pillar 2 (Real Estate Co-Brokerage)
 */
function isPillar2Conversation(senderPhone, clientMessage = '', leadData = {}) {
  const tail = cleanPhoneTail(senderPhone);
  const msg = String(clientMessage || '').toLowerCase();

  // 1. Direct match with verified broker phone registry
  if (tail && tail.length === 10) {
    for (const b of VERIFIED_BROKERS) {
      for (const p of b.phones) {
        if (cleanPhoneTail(p) === tail) {
          return { isPillar2: true, broker: b, matchReason: 'VERIFIED_BROKER_PHONE' };
        }
      }
    }
  }

  // 2. Check local pacer state / dispatch log
  try {
    const pacerPath = path.join(__dirname, '../../local_db/pillar2_pacer_state.json');
    if (fs.existsSync(pacerPath)) {
      const pacerData = JSON.parse(fs.readFileSync(pacerPath, 'utf8'));
      if (Array.isArray(pacerData.dispatchLogToday)) {
        const found = pacerData.dispatchLogToday.find(entry => {
          const recPhone = cleanPhoneTail(entry.recipient || '');
          return recPhone && recPhone === tail;
        });
        if (found) {
          const matchedBroker = VERIFIED_BROKERS.find(b => found.recipient.includes(b.name)) || null;
          return { isPillar2: true, broker: matchedBroker, matchReason: 'RECENT_PACER_DISPATCH' };
        }
      }
    }
  } catch (_) {}

  // 3. Explicit sector check from leadData
  if (leadData.category === 'Real Estate & Properties' || leadData.sector === 'Real Estate' || leadData.isPillar2) {
    return { isPillar2: true, broker: null, matchReason: 'LEAD_CATEGORY_REAL_ESTATE' };
  }

  // 4. Semantic / Vocabulary Detection (Real Estate & Co-brokerage terms)
  const realEstateKeywords = [
    'mandate', 'listing', 'joint inspection', 'jim', 'co-brokerage', '80/20', 'lasrera',
    'duplex', 'penthouse', 'mansion', 'detached house', 'banana island', 'ikoyi',
    'lekki phase 1', 'amen estate', 'victoria island', 'governor\'s consent', 'c of o',
    'diaspora buyer', 'syndicate', 'agency fee', 'inspection schedule', 'inspection memo'
  ];

  const matchedKeywords = realEstateKeywords.filter(kw => msg.includes(kw));
  if (matchedKeywords.length >= 2 || (matchedKeywords.length === 1 && (msg.includes('jim') || msg.includes('80/20') || msg.includes('lasrera') || msg.includes('mandate')))) {
    return { isPillar2: true, broker: null, matchReason: 'REAL_ESTATE_SEMANTIC_MATCH', keywords: matchedKeywords };
  }

  return { isPillar2: false };
}

/**
 * Institutional Decision Matrix for Pillar 2 WhatsApp Responses
 */
function handlePillar2Inquiry(clientMessage, context = {}) {
  const rawMsg = String(clientMessage || '').trim();
  const msg = rawMsg.toLowerCase();
  const broker = context.broker || null;
  const brokerName = broker ? broker.name : (context.businessName || 'Partner');
  const propertyListing = broker ? broker.defaultListing : 'Prime Lagos Luxury Mandate';
  const ticketId = broker ? broker.defaultTicketId : 'DEAL-MANDATE-DESK';

  // ── 1. OPT-OUT / NOT AVAILABLE / SOLD INTERCEPT ──────────────────────────
  if (/sold|no longer available|taken|not for sale|off market|cancel|stop\b/i.test(msg)) {
    return {
      intent: 'PILLAR2_MANDATE_UNAVAILABLE',
      isOptOut: true,
      messageText:
        `Understood and noted. Thank you for the update on "${propertyListing}".\n\n` +
        `We will update our active mandate book accordingly. Should you onboard any new direct luxury mandates (Lekki Phase 1, Ikoyi, VI, or Banana Island) for high-net-worth diaspora buyers, please notify our desk.\n\n` +
        `Warm regards,\nTosin Oyelakin\nBethelmind Corporate & Diaspora Property Desk (CAC Reg: 9912717)\nDesk Hotline: ${CORPORATE_SETTLEMENT.deskHotline}`,
      suggestedAction: 'ARCHIVE_MANDATE'
    };
  }

  // ── 2. BUYER IDENTITY / PROOF OF FUNDS / NDNC PROTOCOL ───────────────────
  if (/who is (the|your) buyer|who is buying|client name|speak with (the )?buyer|proof of funds|buyer profile|buyer direct|buyer identity/i.test(msg)) {
    return {
      intent: 'PILLAR2_BUYER_IDENTITY_PROTOCOL',
      isOptOut: false,
      messageText:
        `Good day Management at *${brokerName}*,\n\n` +
        `Under our client representation agreement and LASRERA NDNC guidelines, our buyer principal (North America & UK Diaspora Real Estate Syndicate) is represented exclusively by Bethelmind Desk until the Joint Inspection Memorandum (JIM) is executed.\n\n` +
        `• *Liquidity Status:* 100% pre-allocated liquid funds in Tier-1 Private Banking (Zero mortgage delay).\n` +
        `• *Closing Timeline:* Prepared to execute within 14–21 days of satisfactory title search.\n` +
        `• *Legal Representation:* Barrister Babatunde Alabi (SAN Nominee) & family liaison conduct accompanied inspections.\n\n` +
        `Once our Joint Inspection Memorandum is executed, full buyer identity, legal proxy contacts, and inspection protocol are formally countersigned.\n\n` +
        `May we transmit the Joint Inspection Memorandum for execution?`,
      suggestedAction: 'SEND_JIM_MEMO'
    };
  }

  // ── 3. COMMISSION SPLIT / 80-20 INQUIRY OR NEGOTIATION ───────────────────
  if (/80\/20|50\/50|10%|commission|origination fee|agency fee|fee split|split ratio|why 20%|take less/i.test(msg)) {
    return {
      intent: 'PILLAR2_COMMISSION_ASSERTION',
      isOptOut: false,
      messageText:
        `Good day Management at *${brokerName}*,\n\n` +
        `Our standard 80/20 co-brokerage split is our fixed institutional standard under LASRERA guidelines:\n\n` +
        `• *Your Firm Retains:* *80%* of the total 5% agency commission pool.\n` +
        `• *Bethelmind Desk:* *20%* origination fee for buyer syndicate introduction & transaction closing.\n\n` +
        `This is significantly more advantageous to your firm than the conventional 50/50 co-brokerage demands in Lagos. You maintain your primary mandate authority, and your 80% cut is legally protected in our Joint Inspection Memorandum before any inspection takes place.\n\n` +
        `Shall we issue the Joint Inspection Memorandum to secure your commission?`,
      suggestedAction: 'CONFIRM_80_20_SPLIT'
    };
  }

  // ── 4. AGREED / SEND JIM / SEND DOCUMENTS / PROCEED ──────────────────────
  if (/^(yes|agreed|send jim|send the jim|send agreement|send document|send details|share agreement|send form|let's proceed|proceed|ok send|okay send|share am)\b/i.test(msg) ||
      /send (the )?(memorandum|agreement|document|contract|form)/i.test(msg)) {
    return {
      intent: 'PILLAR2_DISPATCH_JIM',
      isOptOut: false,
      messageText:
        `Excellent. We are logging *${brokerName}* as the primary mandated firm for this transaction.\n\n` +
        `📄 *Joint Inspection Memorandum (JIM) & Mandate Brief:*\n` +
        `👉 https://www.bethelmindanalytics.com/mandate\n\n` +
        `Please review the brief and confirm your preferred inspection time window (24–48 hours notice) so our Principal Partner (Tosin Oyelakin: ${CORPORATE_SETTLEMENT.deskHotline}) can coordinate with the buyer's legal counsel.\n\n` +
        `Official Desk Attestation:\n` +
        `• Corporate: Bethelmind Digital Solutions (CAC Certified: Reg 9912717)\n` +
        `• Direct Hotline: ${CORPORATE_SETTLEMENT.deskHotline}\n` +
        `• Corporate Settlement: Moniepoint MFB (6805375225)`,
      suggestedAction: 'LOCK_JIM_EXECUTION'
    };
  }

  // ── 5. CONFIRMED AVAILABLE ("Yes it is available", "Still available", "Yes", "Available") ─
  if (/^(yes|available|still available|it is available|active|yes it is|very available|yes available|yes boss)\b/i.test(msg) ||
      /(is|still) available/i.test(msg)) {
    return {
      intent: 'PILLAR2_AVAILABILITY_CONFIRMED',
      isOptOut: false,
      messageText:
        `Thank you for confirming availability for "${propertyListing}".\n\n` +
        `Our Corporate & Diaspora Property Desk is actively matching verified buyer requirements for this corridor.\n\n` +
        `To proceed legally:\n` +
        `1. Do you confirm agreement to our standard 80/20 agency fee split (your firm retains 80%, Bethelmind retains 20% origination fee) under LASRERA guidelines?\n` +
        `2. Upon confirmation, we issue our formal Joint Inspection Memorandum (JIM) to legally safeguard your agency commission and schedule the accompanied inspection with our buyer's representative.\n\n` +
        `Shall I transmit the Joint Inspection Memorandum for your review?`,
      suggestedAction: 'AWAIT_80_20_CONFIRMATION'
    };
  }

  // ── 6. INSPECTION DATE / SCHEDULING LOGISTICS ────────────────────────────
  if (/inspect|when can (they|we)|time of inspection|schedule|tomorrow|thursday|friday|saturday|date|viewing/i.test(msg)) {
    return {
      intent: 'PILLAR2_INSPECTION_SCHEDULING',
      isOptOut: false,
      messageText:
        `Good day Management at *${brokerName}*,\n\n` +
        `Our buyer's legal proxy (Barrister Babatunde Alabi & family liaison) is ready to inspect within 24 to 48 hours notice.\n\n` +
        `Kindly execute our Joint Inspection Memorandum (JIM) so that both parties' commission splits are legally locked before the physical inspection:\n` +
        `👉 https://www.bethelmindanalytics.com/mandate\n\n` +
        `What time window works best for your team for the walkthrough? Our Principal Partner (${CORPORATE_SETTLEMENT.deskHotline}) will align immediately.`,
      suggestedAction: 'COORDINATE_INSPECTION_WINDOW'
    };
  }

  // ── 7. CORPORATE CREDENTIALS & SETTLEMENT VERIFICATION ───────────────────
  if (/who are you|account details|account number|cac|registration|moniepoint|bank|credentials|office address|where are you located/i.test(msg)) {
    return {
      intent: 'PILLAR2_CORPORATE_CREDENTIALS',
      isOptOut: false,
      messageText:
        `Bethelmind Digital Solutions is a CAC Certified Nigerian Enterprise (Reg: 9912717), operating the Corporate & Diaspora Property Desk in Lagos.\n\n` +
        `🏦 *Institutional Settlement & Verification:*\n` +
        `• Bank: Moniepoint Microfinance Bank\n` +
        `• Account Number: 6805375225\n` +
        `• Account Name: Bethelmind Digital Solutions\n` +
        `• CAC Registration: Reg 9912717\n` +
        `• Desk Principal: Tosin Oyelakin\n` +
        `• Hotline / WhatsApp: ${CORPORATE_SETTLEMENT.deskHotline}\n` +
        `• Official Portal: https://www.bethelmindanalytics.com\n\n` +
        `We look forward to a successful transaction on "${propertyListing}".`,
      suggestedAction: 'VERIFY_CORPORATE_PROFILE'
    };
  }

  // ── 8. CALL REQUEST ("Call me", "Speak on phone") ────────────────────────
  if (/call me|give me a call|phone call|speak on (phone|call)|ring me/i.test(msg)) {
    return {
      intent: 'PILLAR2_CALL_REQUEST',
      isOptOut: false,
      messageText:
        `Understood! Our Desk Principal Partner (Tosin Oyelakin) has been notified immediately and will dial your line shortly to discuss the mandate details and inspection schedule.\n\n` +
        `You can also reach our direct closer hotline anytime on ${CORPORATE_SETTLEMENT.deskHotline}. Thank you!`,
      suggestedAction: 'CALL_BROKER_NOW'
    };
  }

  // ── 9. DEFAULT PILLAR 2 FALLBACK (INSTITUTIONAL & CONTEXTUAL) ────────────
  return {
    intent: 'PILLAR2_INSTITUTIONAL_FALLBACK',
    isOptOut: false,
    messageText:
      `Good day Management at *${brokerName}*,\n\n` +
      `Thank you for your message regarding "${propertyListing}".\n\n` +
      `We operate the Bethelmind Corporate & Diaspora Property Desk, onboarding direct mandates for pre-qualified executive diaspora buyers under LASRERA 80/20 co-brokerage guidelines.\n\n` +
      `If the listing is confirmed available under your direct mandate, we are ready to execute our Joint Inspection Memorandum (JIM) and schedule the accompanied inspection:\n` +
      `👉 https://www.bethelmindanalytics.com/mandate\n\n` +
      `Please let us know how your team wishes to proceed. Thank you!\n` +
      `Desk Hotline: ${CORPORATE_SETTLEMENT.deskHotline}`,
    suggestedAction: 'ENGAGE_PILLAR2_MANDATE'
  };
}

module.exports = {
  isPillar2Conversation,
  handlePillar2Inquiry,
  VERIFIED_BROKERS,
  CORPORATE_SETTLEMENT
};
