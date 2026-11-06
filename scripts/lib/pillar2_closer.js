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
const { 
  TOP_LAGOS_BROKER_PROFILES, 
  normalizePhoneTail, 
  isPillar2Phone, 
  registerPillar2Contact 
} = require('./pillar2_contacts_registry');

const CORPORATE_SETTLEMENT = {
  bankName: 'Moniepoint Microfinance Bank',
  accountNumber: '6805375225',
  accountName: 'Bethelmind Digital Solutions',
  cacReg: 'Reg 9912717',
  deskHotline: '+234 802 279 1227',
  principal: 'Tosin Oyelakin'
};

// Comprehensive list of keywords that trigger Pillar 2 recognition
const PILLAR2_SEMANTIC_KEYWORDS = [
  'mandate', 'listing', 'joint inspection', 'jim', 'co-brokerage', '80/20', 'lasrera',
  'duplex', 'penthouse', 'mansion', 'detached house', 'banana island', 'ikoyi',
  'lekki phase 1', 'amen estate', 'victoria island', 'governor\'s consent', 'c of o',
  'diaspora buyer', 'syndicate', 'agency fee', 'inspection schedule', 'inspection memo',
  'realtor', 'property', 'properties', 'real estate', 'land', 'plot', 'acre',
  'survey plan', 'deed of assignment', 'buyer', 'commission split', 'valuation',
  'architect', 'developer', 'amenities', 'semi-detached', 'terrace', 'waterfront'
];

/**
 * Determines whether an incoming WhatsApp message belongs to Pillar 2 (Real Estate Co-Brokerage)
 */
function isPillar2Conversation(senderPhone, clientMessage = '', leadData = {}) {
  const tail = normalizePhoneTail(senderPhone);
  const msg = String(clientMessage || '').toLowerCase().trim();

  // 1. Direct match with registered Pillar 2 contacts registry (Whitelisted brokers + saved contacts)
  const registered = isPillar2Phone(senderPhone);
  if (registered) {
    return {
      isPillar2: true,
      broker: registered,
      matchReason: 'REGISTERED_PILLAR2_PHONE',
      brokerName: registered.brokerName
    };
  }

  // 2. Check local pacer state / dispatch log
  try {
    const pacerPath = path.join(__dirname, '../../local_db/pillar2_pacer_state.json');
    if (fs.existsSync(pacerPath)) {
      const pacerData = JSON.parse(fs.readFileSync(pacerPath, 'utf8'));
      if (Array.isArray(pacerData.dispatchLogToday)) {
        const found = pacerData.dispatchLogToday.find(entry => {
          const recPhone = normalizePhoneTail(entry.recipient || '');
          return recPhone && recPhone === tail;
        });
        if (found) {
          const matchedProfile = TOP_LAGOS_BROKER_PROFILES.find(b => found.recipient.includes(b.name)) || null;
          registerPillar2Contact(senderPhone, {
            brokerName: matchedProfile ? matchedProfile.name : 'Real Estate Partner',
            source: 'PACER_DISPATCH_MATCH'
          });
          return { isPillar2: true, broker: matchedProfile, matchReason: 'RECENT_PACER_DISPATCH' };
        }
      }
    }
  } catch (_) {}

  // 3. Explicit sector check from leadData
  if (leadData.category === 'Real Estate & Properties' || leadData.category === 'Real Estate & Luxury Homes' || leadData.sector === 'Real Estate' || leadData.isPillar2) {
    registerPillar2Contact(senderPhone, {
      brokerName: leadData.businessName || 'Real Estate Partner',
      source: 'LEAD_CATEGORY_REAL_ESTATE'
    });
    return { isPillar2: true, broker: null, matchReason: 'LEAD_CATEGORY_REAL_ESTATE' };
  }

  // 4. Semantic / Vocabulary Detection (Real Estate & Co-brokerage terms)
  const matchedKeywords = PILLAR2_SEMANTIC_KEYWORDS.filter(kw => msg.includes(kw));
  if (matchedKeywords.length >= 1) {
    registerPillar2Contact(senderPhone, {
      brokerName: leadData.businessName || 'Property Contact',
      source: `SEMANTIC_MATCH:${matchedKeywords.join(',')}`
    });
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
  const brokerName = broker ? (broker.brokerName || broker.name) : (context.businessName || 'Partner');
  const propertyListing = broker ? (broker.defaultListing || 'Prime Lagos Luxury Mandate') : (context.propertyListing || 'Prime Lagos Luxury Mandate');
  const ticketId = broker ? (broker.defaultTicketId || 'DEAL-MANDATE-DESK') : (context.ticketId || 'DEAL-MANDATE-DESK');

  // ── 1. OPT-OUT / NOT AVAILABLE / SOLD INTERCEPT ──────────────────────────
  if (/sold|no longer available|taken|not for sale|off market|cancel|stop\b|wrong number/i.test(msg)) {
    return {
      intent: 'PILLAR2_MANDATE_UNAVAILABLE',
      isOptOut: true,
      messageText:
        `Understood and noted. Thank you for the update on "${propertyListing}".\n\n` +
        `We have updated our active mandate book accordingly. Should you onboard any new direct luxury mandates across Lekki Phase 1, Ikoyi, VI, or Banana Island for diaspora buyers, please notify our desk.\n\n` +
        `Warm regards,\nTosin Oyelakin\nBethelmind Corporate & Diaspora Property Desk (CAC Reg: 9912717)\nDesk Hotline: ${CORPORATE_SETTLEMENT.deskHotline}`,
      suggestedAction: 'ARCHIVE_MANDATE'
    };
  }

  // ── 2. IDENTITY / "WHO IS THIS?" / "WHAT IS THIS ABOUT?" ────────────────
  if (/who is this|who are you|which company|what is this|what company|who is calling|who is speaking|who am i chatting with/i.test(msg)) {
    return {
      intent: 'PILLAR2_CORPORATE_IDENTITY',
      isOptOut: false,
      messageText:
        `Good day Management at *${brokerName}*,\n\n` +
        `This is Tosin Oyelakin, Principal Partner at Bethelmind Corporate & Diaspora Property Desk (CAC Certified Nigerian Enterprise: Reg 9912717).\n\n` +
        `We are contacting your firm regarding the prime mandate for "${propertyListing}" on behalf of our North America & UK diaspora buyer syndicate.\n\n` +
        `We operate strictly under LASRERA 80/20 co-brokerage guidelines (your firm retains 80% of agency commission; Bethelmind Desk retains 20% origination fee).\n\n` +
        `Are you the direct mandate holder for this listing?`,
      suggestedAction: 'QUALIFY_MANDATE_HOLDER'
    };
  }

  // ── 3. GREETINGS ("Hello", "Good morning", "Hi", "Good day", "Hey") ─────
  if (/^(hello|hi|good morning|good afternoon|good day|hey|greetings|morning|afternoon)\b/i.test(msg) && msg.length < 35) {
    return {
      intent: 'PILLAR2_EXECUTIVE_GREETING',
      isOptOut: false,
      messageText:
        `Good day Management at *${brokerName}*,\n\n` +
        `Thank you for connecting with the Bethelmind Corporate Property Desk regarding "${propertyListing}".\n\n` +
        `Our diaspora buyer principal is prepared for an accompanied physical inspection within 24–48 hours upon mutual execution of our Joint Inspection Memorandum (JIM):\n` +
        `👉 https://www.bethelmindanalytics.com/mandate\n\n` +
        `Could you confirm if the property is currently vacant and available for inspection this week?`,
      suggestedAction: 'CONFIRM_INSPECTION_WINDOW'
    };
  }

  // ── 4B. ACTIVE BUYING SIGNAL / "WE ARE INTERESTED" / "HOW DO WE PROCEED" ──
  if (/\b(we are interested|i am interested|i'm interested|we're interested|very interested|how do we proceed|how to proceed|let's proceed|ready to proceed|ready to start|interested|ready to co-broker|send the agreement|send agreement|send contract)\b/i.test(msg)) {
    return {
      intent: 'PILLAR2_INTEREST_AND_PROCEED_CONFIRMED',
      isOptOut: false,
      messageText:
        `Good day Management at *${brokerName}* 🤝\n\n` +
        `Outstanding to hear from your team. We are eager to co-broker with *${brokerName}* on "${propertyListing}".\n\n` +
        `Here is our exact institutional closing procedure to proceed immediately:\n\n` +
        `1️⃣ *Electronic Joint Inspection Memorandum (JIM) Execution:*\n` +
        `Kindly review and electronically execute our 1-page LASRERA 80/20 Co-Brokerage Mandate & Joint Inspection Memorandum (JIM):\n` +
        `👉 https://www.bethelmindanalytics.com/mandate\n` +
        `*(Safeguards your firm's 80% agency commission and Bethelmind Desk's 20% origination fee under Section 84 Evidence Act 2011 & LASRERA Law 2022).*\n\n` +
        `2️⃣ *Buyer Inspection Window Alignment:*\n` +
        `Our buyer syndicate's accredited legal counsel and inspection liaison is prepared for accompanied physical inspection within 24 to 48 hours of endorsement.\n\n` +
        `3️⃣ *Direct Desk Counter-Signature & Call:*\n` +
        `Upon your signature, Desk Principal (Tosin Oyelakin) will immediately countersign and connect with your team to align on gate access & timing.\n\n` +
        `🏛️ *Bethelmind Corporate & Diaspora Property Desk*\n` +
        `• CAC Certified Nigerian Enterprise (Reg: 9912717)\n` +
        `• Primary Settlement Bank: Moniepoint Microfinance Bank (6805375225 — Bethelmind Digital Solutions)\n` +
        `• Desk Closer Hotline: ${CORPORATE_SETTLEMENT.deskHotline}\n\n` +
        `What day and time window works best for your team for the accompanied physical walkthrough: Tomorrow Morning (10:00 AM) or Afternoon (02:00 PM)?`,
      suggestedAction: 'DISPATCH_P2_JIM_CLOSER'
    };
  }

  // ── 4. CONFIRMATION OF AVAILABILITY / "YES" / "AVAILABLE" ────────────────
  if (/(yes|available|it is available|still available|we have it|still on the market|active|direct mandate|i am the agent)/i.test(msg)) {
    return {
      intent: 'PILLAR2_AVAILABILITY_CONFIRMED',
      isOptOut: false,
      messageText:
        `Excellent. Thank you for confirming availability for "${propertyListing}".\n\n` +
        `We are logging *${brokerName}* as the primary mandated firm for this transaction in our buyer allocation book.\n\n` +
        `To legally lock both firms' commission allocations (80% to your firm, 20% origination fee to Bethelmind Desk under LASRERA standards), kindly execute our 1-page Joint Inspection Memorandum (JIM):\n` +
        `👉 https://www.bethelmindanalytics.com/mandate\n\n` +
        `Once signed, our buyer's legal proxy is ready for accompanied physical inspection within 24 to 48 hours. What day suits your schedule?`,
      suggestedAction: 'DISPATCH_JIM'
    };
  }

  // ── 5. BUYER IDENTITY / PROOF OF FUNDS / "WHO IS BUYING?" ───────────────
  if (/buyer|who is (the )?buyer|client name|proof of funds|pof|profile|foreign buyer|diaspora/i.test(msg)) {
    return {
      intent: 'PILLAR2_BUYER_IDENTITY_PROTOCOL',
      isOptOut: false,
      messageText:
        `Good day Management at *${brokerName}*,\n\n` +
        `Under our client representation mandate and LASRERA NDNC guidelines, our buyer principal (North America & UK Diaspora Real Estate Syndicate) is represented exclusively by Bethelmind Desk until the Joint Inspection Memorandum (JIM) is executed.\n\n` +
        `• *Liquidity Status:* 100% pre-allocated liquid funds in Tier-1 Private Banking (Zero mortgage delay).\n` +
        `• *Inspection Protocol:* Accompanied physical inspection by accredited legal counsel & desk inspection liaison.\n\n` +
        `To execute the JIM and lock commission splits before physical viewing:\n` +
        `👉 https://www.bethelmindanalytics.com/mandate`,
      suggestedAction: 'EXECUTE_JIM'
    };
  }

  // ── 6. COMMISSION SPLIT / "80/20" / "HOW MUCH IS COMMISSION?" ───────────
  if (/commission|fee|split|80\/20|how much|what percent|percentage|origination/i.test(msg)) {
    return {
      intent: 'PILLAR2_COMMISSION_ASSERTION',
      isOptOut: false,
      messageText:
        `Good day Management at *${brokerName}*,\n\n` +
        `Our standard 80/20 co-brokerage split is our fixed institutional standard under LASRERA guidelines:\n\n` +
        `• *Your Firm Retains:* *80%* of the total 5% agency commission pool.\n` +
        `• *Bethelmind Desk:* *20%* origination & diaspora buyer procurement cut.\n` +
        `• *Legal Backing:* Fully documented in our Joint Inspection Memorandum (JIM).\n\n` +
        `Access and execute the memorandum here:\n` +
        `👉 https://www.bethelmindanalytics.com/mandate`,
      suggestedAction: 'AFFIRM_80_20_SPLIT'
    };
  }

  // ── 7. JIM / AGREEMENT / MEMORANDUM REQUEST ──────────────────────────────
  if (/jim|agreement|contract|memorandum|send (the )?link|document|form|sign/i.test(msg)) {
    return {
      intent: 'PILLAR2_DISPATCH_JIM',
      isOptOut: false,
      messageText:
        `Excellent. Here is the official Bethelmind Joint Inspection Memorandum (JIM) portal for "${propertyListing}":\n\n` +
        `👉 https://www.bethelmindanalytics.com/mandate\n\n` +
        `Upon your firm's electronic endorsement, our Desk Principal (Tosin Oyelakin) will countersign immediately and align with your team on the inspection window.\n\n` +
        `Desk Settlement Account: Moniepoint Microfinance Bank (6805375225 - Bethelmind Digital Solutions | CAC Reg: 9912717).`,
      suggestedAction: 'CONFIRM_JIM_PORTAL'
    };
  }

  // ── 8. INSPECTION SCHEDULING / "WHEN CAN WE VIEW?" ───────────────────────
  if (/inspect|viewing|schedule|when can|time|date|come and see|visit/i.test(msg)) {
    return {
      intent: 'PILLAR2_INSPECTION_SCHEDULING',
      isOptOut: false,
      messageText:
        `Good day Management at *${brokerName}*,\n\n` +
        `Our buyer's legal proxy is ready to inspect "${propertyListing}" with 24 to 48 hours notice.\n\n` +
        `Kindly execute our Joint Inspection Memorandum (JIM) to formalize agency allocations before the physical viewing:\n` +
        `👉 https://www.bethelmindanalytics.com/mandate\n\n` +
        `Kindly state your preferred time: Morning (10:00 AM) or Afternoon (02:00 PM)?`,
      suggestedAction: 'CONFIRM_TIME_SLOT'
    };
  }

  // ── 9. CALL REQUEST ("Call me", "Speak on phone") ────────────────────────
  if (/call (me|my phone|us|our desk)|give me a call|phone call|speak on (phone|call)|ring me|reach me on|dial (my|our) (number|phone|line)/i.test(msg)) {
    return {
      intent: 'PILLAR2_CALL_REQUEST',
      isOptOut: false,
      messageText:
        `Understood! Our Desk Principal Partner (Tosin Oyelakin) has been notified immediately and will dial your line shortly to discuss the mandate details and inspection schedule.\n\n` +
        `You can also reach our direct closer hotline anytime on ${CORPORATE_SETTLEMENT.deskHotline}. Thank you!`,
      suggestedAction: 'CALL_BROKER_NOW'
    };
  }

  // ── 10. DEFAULT PILLAR 2 FALLBACK (INSTITUTIONAL & CONTEXTUAL) ───────────
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
  CORPORATE_SETTLEMENT,
  PILLAR2_SEMANTIC_KEYWORDS
};
