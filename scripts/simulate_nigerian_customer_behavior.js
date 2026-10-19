/**
 * @file scripts/simulate_nigerian_customer_behavior.js
 * 
 * 🇳🇬 NIGERIAN COMMERCIAL SME BEHAVIORAL SIMULATOR & CONVERSION AUDIT SUITE
 * Bethelmind Digital Solutions · Product & Conversion Lab
 * 
 * Inspired by Agentic Persona Modeling (SCOPE, Generative Personas, Synthetic Users).
 * Grounded specifically in Nigerian SME operating reality:
 * - Tecno / Infinix / Samsung A-series mobile devices
 * - Metered Airtel / MTN 3G/4G broadband & data conservation
 * - High fraud skepticism (419, smishing, fake bank alerts, distrust of raw links)
 * - Cultural WhatsApp-first preference & negotiation habits
 * - Immediate cashflow & operational bottlenecks
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');

// ── 1. REALISTIC NIGERIAN SME ARCHETYPES ──────────────────────────────────────
const PERSONAS = [
  {
    id: 'persona_market_retail',
    name: 'Alhaji Musa (Balogun/Trade Fair Wholesale Importer & Retailer)',
    sector: 'Commercial Retail / Fashion / Goods',
    device: 'Tecno Camon 20 (Android 13, 720p screen, metered MTN 4G)',
    dailyContext: 'Busy in crowded market shop, receives 150+ WhatsApp messages daily from buyers asking "how much last" and "send video".',
    psychology: {
      skepticismLevel: 'EXTREME',
      scamFear: 'High fear of bank hacking and Yahoo fake links.',
      attentionSpanSec: 4, // If not hooked in 4 seconds, deletes SMS
      dataConsciousness: 'High (avoids downloading heavy apps or loading heavy video sites)'
    },
    primaryPain: 'Losing evening and Sunday buyers when his shop is closed; manual WhatsApp negotiation fatigue.',
    buyingTriggers: ['CAC registered corporate bank account', 'Clear Naira pricing without hidden USD fees', 'Instant WhatsApp preview']
  },
  {
    id: 'persona_solar_contractor',
    name: 'Engr. Emeka (Solar & Renewable Energy Installer, Ikeja)',
    sector: 'Solar & Inverter Systems',
    device: 'Infinix Note 12 (Android 12, Airtel 4G)',
    dailyContext: 'Frequently on client roofs or in Lagos traffic. Spends 2 hours every evening calculating wattage loads on notepads.',
    psychology: {
      skepticismLevel: 'HIGH',
      scamFear: 'Thinks software developers are theorists who don\'t understand real solar hardware.',
      attentionSpanSec: 8,
      dataConsciousness: 'Moderate'
    },
    primaryPain: 'Non-serious prospects asking for quotes on WhatsApp who ghost after he spends 40 minutes computing load sheets.',
    buyingTriggers: ['Realistic KVA & battery sizing math', 'Ability to send branded PDF/WhatsApp BOQ instantly to client', 'Pay-Small-Small option']
  },
  {
    id: 'persona_beauty_salon',
    name: 'Blessing (Lekki / Ikeja Beauty Salon & Wig Studio Owner)',
    sector: 'Beauty, Hair & Spa',
    device: 'iPhone 11 / Samsung Galaxy A32 (Glo & MTN)',
    dailyContext: 'Styling clients in salon all day. Misses Instagram DMs and phone calls; suffers from Saturday appointment no-shows.',
    psychology: {
      skepticismLevel: 'MODERATE',
      scamFear: 'Wary of unknown numbers, but highly receptive to modern aesthetics and Instagram-ready design.',
      attentionSpanSec: 6,
      dataConsciousness: 'Moderate'
    },
    primaryPain: 'Clients booking Saturday 2 PM slot on WhatsApp and not showing up, leaving stylists idle.',
    buyingTriggers: ['Deposit-locking calendar (Paystack/OPay/Moniepoint deposit)', 'Clean mobile look that matches her luxury salon brand']
  },
  {
    id: 'persona_healthcare_clinic',
    name: 'Dr. Folake (Director, Private Healthcare Clinic, Lagos/Abuja)',
    sector: 'Clinics & Healthcare',
    device: 'Samsung Galaxy S22 (Wi-Fi & MTN 5G)',
    dailyContext: 'Managing doctors, nurses, and patient intake. Sensitive to medical ethics and confidentiality.',
    psychology: {
      skepticismLevel: 'VERY HIGH',
      scamFear: 'Strict aversion to unprofessional, generic, or broken bot messaging.',
      attentionSpanSec: 5,
      dataConsciousness: 'Low'
    },
    primaryPain: 'Patients calling after clinic hours for consultation fees or appointment slots and getting no response.',
    buyingTriggers: ['Corporate legal standing (CAC Enterprise)', 'Professional intake portal', 'Direct Moniepoint/NIP payment receipting']
  },
  {
    id: 'persona_hotel_md',
    name: 'Chief Adebayo (Hotels & Shortlet Suites MD, Ibadan/Lagos)',
    sector: 'Hospitality & Shortlets',
    device: 'Samsung Galaxy A53 (Airtel 4G)',
    dailyContext: 'Managing multiple hotel properties. Watches night occupancy and staff revenue leakage.',
    psychology: {
      skepticismLevel: 'HIGH',
      scamFear: 'Suspicious of unsolicited offers; hates being addressed informally.',
      attentionSpanSec: 5,
      dataConsciousness: 'Moderate'
    },
    primaryPain: 'Receptionists sleeping at night or pocketing cash from walk-in late night travelers.',
    buyingTriggers: ['Direct guest booking without paying 20% commission to Booking.com/Jumia', 'Zero-theft automated bank reconciliation']
  }
];

// ── 2. OUTREACH ASSETS UNDER TEST ─────────────────────────────────────────────
const OUTREACH_SAMPLES = [
  {
    type: 'SMS_OLD_OCT16',
    label: 'Old 2-Message Drip Sequence (Oct 16 Campaign)',
    prepText: 'Good day All Imo Hote team. Guests checking rooms at night often book elsewhere. We built a 24/7 direct WhatsApp booking tool. May I share a quick demo?',
    linkText: 'Hello All Imo Hote! Tap demo: https://www.bethelmindanalytics.com/preview/all-imo-hotels-boo (WhatsApp: wa.me/2348022791227?text=All%20Imo%20Hote)',
    charCount: 151 + 185,
    segmentCount: 3,
    urlCount: 2,
    hasNameTruncation: true,
    hasDirectLink: true
  },
  {
    type: 'SMS_NEW_SINGLE_CREDIT',
    label: 'New Solidified 1-Credit SMS (<= 158 Chars)',
    prepText: 'Good day [Clean Business Name]. When customers search you on Google, only competitors show. We built your official mobile site: https://bethelmindanalytics.com/p/[slug]',
    linkText: '',
    charCount: 146,
    segmentCount: 1,
    urlCount: 1,
    hasNameTruncation: false,
    hasDirectLink: true
  },
  {
    type: 'WHATSAPP_VOICE_NOTE',
    label: 'WhatsApp 15s Native Audio Bubble + One-Tap Interactive Prototype',
    audioBubble: '15-second natural Nigerian voice note (en-NG-EzinneNeural)',
    textCopy: 'Good day Engr. Emeka. Notice when solar buyers message you on WhatsApp at night asking for 5KVA prices, you spend hours doing manual load math? We built an instant 24/7 Solar BOQ calculator for your company that computes wattage and sends WhatsApp quotes automatically. Test your live prototype here: https://www.bethelmindanalytics.com/preview/[slug]',
    hasVoiceNote: true,
    hasDirectLink: true
  }
];

// ── 3. SIMULATION LOGIC: EVALUATING OUTREACH HOOK & COGNITIVE TRUST ───────────
function simulateOutreachPhase(persona, outreach) {
  let trustScore = 70;
  let clickProbability = 0;
  const objections = [];
  const positiveTriggers = [];

  // 1. Truncated Name Factor
  if (outreach.hasNameTruncation) {
    trustScore -= 45;
    objections.push('They chopped my company name ("All Imo Hote"). This is clearly a broken automated bot or 419 scammer. Deleting immediately.');
  } else {
    trustScore += 15;
    positiveTriggers.push('Company name is accurately spelled and professional.');
  }

  // 2. Multi-link / Telco Spam Factor
  if (outreach.urlCount > 1) {
    trustScore -= 25;
    objections.push('Two different raw links in one SMS looks like phishing / malware.');
  }

  // 3. Number of SMS Segments & Drip Delay
  if (outreach.segmentCount > 1) {
    trustScore -= 15;
    objections.push('Message arrived split in two parts or out of order. Feels like an aggressive text blast.');
  }

  // 4. Voice Note Super-Multiplier
  if (outreach.hasVoiceNote) {
    trustScore += 35;
    positiveTriggers.push('Heard a professional, calm Nigerian voice speaking directly to me. Instant credibility. Proves it is not a bot.');
  }

  // 5. Google Competitor Hook Resonance
  if (outreach.prepText && outreach.prepText.includes('competitors show')) {
    trustScore += 20;
    positiveTriggers.push('"Competitors are stealing my Google searches" touches a real revenue pain.');
  }

  // Calculate final click probability
  clickProbability = Math.max(0, Math.min(95, trustScore - (persona.psychology.skepticismLevel === 'EXTREME' ? 25 : 10)));

  return {
    trustScore: Math.max(0, Math.min(100, trustScore)),
    clickProbability: Math.round(clickProbability),
    decision: clickProbability >= 40 ? 'CLICK_THROUGH' : 'DELETE_OR_IGNORE',
    objections,
    positiveTriggers
  };
}

// ── 4. SIMULATION LOGIC: LANDING PAGE & CONVERSION FUNNEL EVALUATION ───────────
function simulateLandingPagePhase(persona, pageData) {
  let frictionScore = 20; // Lower is better
  let conversionProbability = 45;
  const frictionPoints = [];
  const valueDrivers = [];

  // 1. Load Speed on Metered Mobile (Payload & Assets)
  if (pageData.hasHeavyVideoOverlay) {
    frictionScore += 30;
    conversionProbability -= 25;
    frictionPoints.push('Video overlay blocked screen on mobile and consumed data before showing the site.');
  } else {
    valueDrivers.push('Page rendered instantaneously without blocking spinners.');
  }

  // 2. Trust Badges & Corporate Identity
  if (pageData.hasCacBadge && pageData.hasMoniepointAccount) {
    conversionProbability += 25;
    valueDrivers.push('Saw CAC Certified Enterprise badge and Moniepoint Corporate Account (6805375225 - Bethelmind Digital Solutions). Proves legitimacy.');
  } else {
    frictionScore += 20;
    frictionPoints.push('Unclear who is behind the site or where money is being sent.');
  }

  // 3. Sector Relevance of the Demo Tool
  if (pageData.sectorToolMatch) {
    conversionProbability += 30;
    valueDrivers.push(`Interactive ${pageData.sectorName} tool solved their exact bottleneck.`);
  } else {
    frictionScore += 40;
    conversionProbability -= 35;
    frictionPoints.push('Tool shown does not match my business (e.g. Solar calculator shown to a restaurant).');
  }

  // 4. Pricing Friction (₦35k Starter vs ₦75k Milestone vs ₦150k)
  if (pageData.hasLowFrictionStarter) {
    conversionProbability += 15;
    valueDrivers.push('₦35,000 Starter Go-Live (or ₦25k/mo Pay-Small-Small) removes price resistance.');
  } else {
    frictionScore += 25;
    frictionPoints.push('Only saw high upfront cost (₦150,000) without a low-risk starter tier.');
  }

  // 5. WhatsApp Closer Desk Accessibility
  if (pageData.hasDirectWhatsAppCloser) {
    conversionProbability += 20;
    valueDrivers.push('Direct 1-Tap button to chat on WhatsApp (wa.me/2348022791227) matches how Nigerians do business.');
  }

  return {
    frictionScore: Math.min(100, frictionScore),
    conversionProbability: Math.max(0, Math.min(95, conversionProbability)),
    decision: conversionProbability >= 50 ? 'WILL_CONVERT_OR_INQUIRE' : 'DROP_OFF',
    frictionPoints,
    valueDrivers
  };
}

// ── 5. RUN FULL MULTI-PERSONA SIMULATION ───────────────────────────────────────
async function runNigerianCustomerSimulation() {
  console.log('========================================================================');
  console.log('🇳🇬 STARTING NIGERIAN SME BEHAVIORAL CUSTOMER SIMULATION SUITE');
  console.log('👥 Personas: 5 Nigerian Commercial SME Archetypes');
  console.log('📡 Channels: Old 2-Part SMS vs New 1-Credit SMS vs WhatsApp Voice Notes');
  console.log('========================================================================\n');

  const report = {
    timestamp: new Date().toISOString(),
    personasEvaluated: PERSONAS.length,
    outreachComparisons: [],
    overallConclusions: []
  };

  // Evaluate each outreach channel across all 5 personas
  for (const outreach of OUTREACH_SAMPLES) {
    console.log(`\n────────────────────────────────────────────────────────────────────────`);
    console.log(`📢 TESTING OUTREACH: ${outreach.label}`);
    console.log(`────────────────────────────────────────────────────────────────────────`);

    let totalTrust = 0;
    let totalClicks = 0;
    const personaResults = [];

    for (const persona of PERSONAS) {
      const res = simulateOutreachPhase(persona, outreach);
      totalTrust += res.trustScore;
      totalClicks += (res.decision === 'CLICK_THROUGH' ? 1 : 0);

      personaResults.push({
        personaName: persona.name,
        sector: persona.sector,
        trustScore: res.trustScore,
        clickProbability: `${res.clickProbability}%`,
        decision: res.decision,
        topObjection: res.objections[0] || 'None',
        topTrigger: res.positiveTriggers[0] || 'None'
      });

      console.log(`  👤 ${persona.name}:`);
      console.log(`     Decision: ${res.decision === 'CLICK_THROUGH' ? '✅ CLICKED LINK' : '❌ DELETED / IGNORED'}`);
      console.log(`     Trust Score: ${res.trustScore}/100 | Click Likelihood: ${res.clickProbability}%`);
      if (res.objections.length > 0) console.log(`     Friction: "${res.objections[0]}"`);
      if (res.positiveTriggers.length > 0) console.log(`     Hook: "${res.positiveTriggers[0]}"`);
    }

    const avgTrust = Math.round(totalTrust / PERSONAS.length);
    const ctr = Math.round((totalClicks / PERSONAS.length) * 100);

    console.log(`\n  📊 SUMMARY FOR ${outreach.label}:`);
    console.log(`     Average Trust Score: ${avgTrust}/100`);
    console.log(`     Simulated Click-Through Rate (CTR): ${ctr}% (${totalClicks}/${PERSONAS.length} personas)`);

    report.outreachComparisons.push({
      outreachType: outreach.type,
      label: outreach.label,
      averageTrust: avgTrust,
      simulatedCtr: `${ctr}%`,
      personaBreakdown: personaResults
    });
  }

  // Evaluate Landing Page & Tool Experience
  console.log(`\n========================================================================`);
  console.log(`🌐 SIMULATING LANDING PAGE & SECTOR TOOL CONVERSION FUNNEL`);
  console.log(`========================================================================\n`);

  const mockLandingPageScenarios = [
    {
      name: 'Old Landing Page Experience (Heavy Preloader + Truncated Slug + Wrong Tool)',
      hasHeavyVideoOverlay: true,
      hasCacBadge: false,
      hasMoniepointAccount: false,
      sectorToolMatch: false,
      hasLowFrictionStarter: false,
      hasDirectWhatsAppCloser: true
    },
    {
      name: 'Current Optimized Experience (Instant Paint + CAC Badge + Moniepoint Account + Matched Tool + ₦35k Starter)',
      hasHeavyVideoOverlay: false,
      hasCacBadge: true,
      hasMoniepointAccount: true,
      sectorToolMatch: true,
      hasLowFrictionStarter: true,
      hasDirectWhatsAppCloser: true
    }
  ];

  for (const scenario of mockLandingPageScenarios) {
    console.log(`🔍 Scenario: ${scenario.name}`);
    let totalConversionProb = 0;
    let converts = 0;

    for (const persona of PERSONAS) {
      const res = simulateLandingPagePhase(persona, scenario);
      totalConversionProb += res.conversionProbability;
      if (res.decision === 'WILL_CONVERT_OR_INQUIRE') converts++;
    }

    const avgConv = Math.round(totalConversionProb / PERSONAS.length);
    console.log(`   Simulated Lead-to-Inquiry Rate: ${avgConv}% (${converts}/${PERSONAS.length} will message WhatsApp/Close)\n`);
  }

  return report;
}

if (require.main === module) {
  runNigerianCustomerSimulation().then(() => {
    console.log('✅ Nigerian SME Behavioral Simulation Complete.');
  }).catch(err => {
    console.error('Simulation error:', err);
  });
}

module.exports = { runNigerianCustomerSimulation, PERSONAS };
