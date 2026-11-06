const fs = require('fs');
const path = require('path');

// 1. Patch scripts/lib/pillar2_contacts_registry.js
const registryFile = path.join(__dirname, 'lib/pillar2_contacts_registry.js');
let regCode = fs.readFileSync(registryFile, 'utf8');

regCode = regCode.replace(
  `function isPillar2Phone(phone) {
  const tail = normalizePhoneTail(phone);
  if (!tail) return null;
  return inMemoryRegistry.get(tail) || null;
}`,
  `function isPillar2Phone(phone) {
  const clean = String(phone || '').replace(/@.*$/, '').replace(/\\D/g, '');
  const tail = normalizePhoneTail(clean);
  if (!clean && !tail) return null;
  return inMemoryRegistry.get(tail) || inMemoryRegistry.get(clean) || null;
}`
);

fs.writeFileSync(registryFile, regCode, 'utf8');
console.log('✅ Updated isPillar2Phone in scripts/lib/pillar2_contacts_registry.js');

// 2. Patch scripts/lib/pillar2_closer.js
const closerFile = path.join(__dirname, 'lib/pillar2_closer.js');
let closerCode = fs.readFileSync(closerFile, 'utf8');

// Broaden PILLAR2_SEMANTIC_KEYWORDS
const oldKeywords = `'survey plan', 'deed of assignment', 'buyer', 'commission split', 'valuation',
  'architect', 'developer', 'amenities', 'semi-detached', 'terrace', 'waterfront'`;

const newKeywords = `'survey plan', 'deed of assignment', 'buyer', 'commission split', 'valuation',
  'architect', 'developer', 'amenities', 'semi-detached', 'terrace', 'waterfront',
  'estate', 'tenant', 'rent', 'service charge', 'facility', 'realtors', 'brokerage', 'joint mandate', 'inspection'`;

closerCode = closerCode.replace(oldKeywords, newKeywords);

// Add Interest & Proceed handler before availability confirmed
const p2InterestBlock = `  // ── 4B. ACTIVE BUYING SIGNAL / "WE ARE INTERESTED" / "HOW DO WE PROCEED" ──
  if (/\\b(we are interested|i am interested|i'm interested|we're interested|very interested|how do we proceed|how to proceed|let's proceed|ready to proceed|ready to start|interested|ready to co-broker|send the agreement|send agreement|send contract)\\b/i.test(msg)) {
    return {
      intent: 'PILLAR2_INTEREST_AND_PROCEED_CONFIRMED',
      isOptOut: false,
      messageText:
        \`Good day Management at *\${brokerName}* 🤝\\n\\n\` +
        \`Outstanding to hear from your team. We are eager to co-broker with *\${brokerName}* on "\${propertyListing}".\\n\\n\` +
        \`Here is our exact institutional closing procedure to proceed immediately:\\n\\n\` +
        \`1️⃣ *Electronic Joint Inspection Memorandum (JIM) Execution:*\\n\` +
        \`Kindly review and electronically execute our 1-page LASRERA 80/20 Co-Brokerage Mandate & Joint Inspection Memorandum (JIM):\\n\` +
        \`👉 https://www.bethelmindanalytics.com/mandate\\n\` +
        \`*(Safeguards your firm's 80% agency commission and Bethelmind Desk's 20% origination fee under Section 84 Evidence Act 2011 & LASRERA Law 2022).*\\n\\n\` +
        \`2️⃣ *Buyer Inspection Window Alignment:*\\n\` +
        \`Our buyer's legal proxy (Barrister Babatunde Alabi & family liaison) is prepared for accompanied physical inspection within 24 to 48 hours of endorsement.\\n\\n\` +
        \`3️⃣ *Direct Desk Counter-Signature & Call:*\\n\` +
        \`Upon your signature, Desk Principal (Tosin Oyelakin) will immediately countersign and connect with your team to align on gate access & timing.\\n\\n\` +
        \`🏛️ *Bethelmind Corporate & Diaspora Property Desk*\\n\` +
        \`• CAC Certified Nigerian Enterprise (Reg: 9912717)\\n\` +
        \`• Primary Settlement Bank: Moniepoint Microfinance Bank (6805375225 — Bethelmind Digital Solutions)\\n\` +
        \`• Desk Closer Hotline: \${CORPORATE_SETTLEMENT.deskHotline}\\n\\n\` +
        \`What day and time window works best for your team for the accompanied physical walkthrough: Tomorrow Morning (10:00 AM) or Afternoon (02:00 PM)?\`,
      suggestedAction: 'DISPATCH_P2_JIM_CLOSER'
    };
  }\n\n`;

if (!closerCode.includes('PILLAR2_INTEREST_AND_PROCEED_CONFIRMED')) {
  closerCode = closerCode.replace(
    "  // ── 4. CONFIRMATION OF AVAILABILITY",
    p2InterestBlock + "  // ── 4. CONFIRMATION OF AVAILABILITY"
  );
}

fs.writeFileSync(closerFile, closerCode, 'utf8');
console.log('✅ Updated scripts/lib/pillar2_closer.js with PILLAR2_INTEREST_AND_PROCEED_CONFIRMED!');
