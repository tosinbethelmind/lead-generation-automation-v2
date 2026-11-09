const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'lib', 'pillar2_closer.js');
let code = fs.readFileSync(filePath, 'utf8');

// 1. Calibrate PILLAR2_INTEREST_AND_PROCEED_CONFIRMED
const oldInterestBlock = `      messageText:
        \`Good day Management at *\${brokerName}* 🤝\\n\\n\` +
        \`Outstanding to hear from your team. We are eager to co-broker with *\${brokerName}* on "\${propertyListing}".\\n\\n\` +
        \`Here is our exact institutional closing procedure to proceed immediately:\\n\\n\` +
        \`1️⃣ *Electronic Joint Inspection Memorandum (JIM) Execution:*\\n\` +
        \`Kindly review and electronically execute our 1-page LASRERA 80/20 Co-Brokerage Mandate & Joint Inspection Memorandum (JIM):\\n\` +
        \`👉 https://www.bethelmindanalytics.com/mandate\\n\` +
        \`*(Safeguards your firm's 80% agency commission and Bethelmind Desk's 20% origination fee under Section 84 Evidence Act 2011 & LASRERA Law 2022).*\\n\\n\` +
        \`2️⃣ *Buyer Inspection Window Alignment:*\\n\` +
        \`Our buyer syndicate's accredited legal counsel and inspection liaison is prepared for accompanied physical inspection within 24 to 48 hours of endorsement.\\n\\n\` +
        \`3️⃣ *Direct Desk Counter-Signature & Call:*\\n\` +
        \`Upon your signature, Desk Principal (Tosin Oyelakin) will immediately countersign and connect with your team to align on gate access & timing.\\n\\n\` +
        \`🏛️ *Bethelmind Corporate & Diaspora Property Desk*\\n\` +
        \`• CAC Certified Nigerian Enterprise (Reg: 9912717)\\n\` +
        \`• Primary Settlement Bank: Moniepoint Microfinance Bank (6805375225 — Bethelmind Digital Solutions)\\n\` +
        \`• Desk Closer Hotline: \${CORPORATE_SETTLEMENT.deskHotline}\\n\\n\` +
        \`What day and time window works best for your team for the accompanied physical walkthrough: Tomorrow Morning (10:00 AM) or Afternoon (02:00 PM)?\`,`;

const newInterestBlock = `      messageText:
        \`Good day Management at *\${brokerName}* 🤝\\n\\n\` +
        \`Outstanding to hear from your team. We are onboarding *\${brokerName}* for "\${propertyListing}".\\n\\n\` +
        \`Here is our exact institutional co-brokerage procedure to proceed:\\n\\n\` +
        \`1️⃣ *Electronic Joint Inspection Memorandum (JIM) Execution:*\\n\` +
        \`Kindly review and electronically execute our 1-page LASRERA 80/20 Co-Brokerage Mandate & Joint Inspection Memorandum (JIM):\\n\` +
        \`👉 https://www.bethelmindanalytics.com/mandate\\n\` +
        \`*(Safeguards your firm's 80% agency commission and Bethelmind Desk's 20% origination fee under Section 84 Evidence Act 2011 & LASRERA Law 2022).*\\n\\n\` +
        \`2️⃣ *Asset Shortlisting & Investor Presentation:*\\n\` +
        \`Upon endorsement, our Desk logs your direct listing into our private investor presentation portfolio for our upcoming diaspora allocation cycle.\\n\\n\` +
        \`3️⃣ *Accompanied Walkthrough Protocol:*\\n\` +
        \`Accompanied physical walkthrough is scheduled directly with your lead broker upon investor asset selection and gate access clearance.\\n\\n\` +
        \`🏛️ *Bethelmind Corporate & Diaspora Property Desk*\\n\` +
        \`• CAC Certified Nigerian Enterprise (Reg: 9912717)\\n\` +
        \`• Primary Settlement Bank: Moniepoint Microfinance Bank (6805375225 — Bethelmind Digital Solutions)\\n\` +
        \`• Desk Closer Hotline: \${CORPORATE_SETTLEMENT.deskHotline}\\n\\n\` +
        \`Kindly execute the memorandum at https://www.bethelmindanalytics.com/mandate so our Desk can confirm receipt and align with your team.\`,`;

// 2. Calibrate PILLAR2_AVAILABILITY_CONFIRMED
const oldAvail = `Once signed, our buyer's legal proxy is ready for accompanied physical inspection within 24 to 48 hours. What day suits your schedule?`;
const newAvail = `Once signed, our Desk logs your asset into our priority investor presentation portfolio and coordinates viewing protocol with your team.`;

// 3. Calibrate PILLAR2_BUYER_IDENTITY_PROTOCOL
const oldPof = `• *Liquidity Status:* 100% pre-allocated liquid funds in Tier-1 Private Banking (Zero mortgage delay).\\n\` +
        \`• *Inspection Protocol:* Accompanied physical inspection by accredited legal counsel & desk inspection liaison.`;
const newPof = `• *Investor Profile:* Pre-screened diaspora executives and institutional family offices.\\n\` +
        \`• *Inspection Protocol:* Accompanied physical walkthrough coordinated under bilateral LASRERA guidelines upon memorandum endorsement.`;

code = code.replace(oldInterestBlock, newInterestBlock);
code = code.replace(oldAvail, newAvail);
code = code.replace(oldPof, newPof);

fs.writeFileSync(filePath, code, 'utf8');
console.log('✅ pillar2_closer.js updated with calibrated curation desk copy.');
