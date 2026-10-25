const fs = require('fs');
const path = require('path');

const enginePath = path.join(__dirname, 'nairaland_autonomous_engine.js');
let code = fs.readFileSync(enginePath, 'utf8');

// 1. Add getContextualBumpMessage function
const bumpHelper = `function getContextualBumpMessage(campaignKey) {
  if (campaignKey === 'tokunbo-duty') {
    return \`[b]⚡ 2026 PTML & Tin Can Port Clearance Update:[/b]

To car buyers and auto importers asking about terminal dwell time and statutory clearing:
• Remember that statutory Customs Duty (20%) + NAC Levy (15%) + VAT (7.5%) are strictly calculated on the assessed CIF valuation sheet, not on your auction bid price.
• Always verify the statutory duty and terminal landing fees before wiring auction payments:
[url=https://www.bethelmindanalytics.com/tools/tokunbo-duty][b]👉 Test Exact Tokunbo VIN Customs Duty & Port Landing Sizer Free[/b][/url]

[b]⚡ For Car Dealers & Clearing Agents:[/b]
Want this exact live clearing duty calculator deployed under your own dealership brand and WhatsApp number for ₦35,000? WhatsApp our desk on [b]0802 279 1227[/b] (CAC Certified RC 7034297).
Drop your car year and model below for instant estimates!\`;
  }

  if (campaignKey === 'fake-alert-shield') {
    return \`[b]⚡ Retail Fraud Prevention Update for Weekend Trading:[/b]

To boutique, supermarket, and pharmacy cashiers dealing with rush hour queues:
• Fake bank debit alert apps and modified SMS sender IDs spike during Friday–Sunday evening trading.
• Never hand over goods based on customer phone screenshots or unverified SMS alerts. Only release items upon verified server ledger credit.
• Test the live sub-2.5s Moniepoint/OPay webhook reconciliation and WhatsApp receipt closer free on your phone:
[url=https://www.bethelmindanalytics.com/tools/retail-catalog][b]👉 Test Free Retail WhatsApp Closer & Anti-Fake Alert Engine[/b][/url]

[b]⚡ For Store Owners & Supermarkets:[/b]
Deploy this exact webhook verification screen + WhatsApp closer for your cashiers in 24 hours (₦35,000 Starter Setup / ₦25,000 monthly). WhatsApp: [b]0802 279 1227[/b].
How does your store currently handle transfer confirmations during rush hours? Share below!\`;
  }

  // Default Solar BOQ
  return \`[b]⚡ Practical Sizing & Diesel Replacement Update:[/b]

For those asking about sizing during peak sunshine hours:
• Prioritize heavy appliance operation (water pumping, pressing iron, deep freezer freezing cycles) between 11:00 AM and 02:30 PM to run 100% on direct solar PV without battery degradation.
• Test your exact custom kVA and monthly diesel displacement calculation free on your phone:
[url=https://www.bethelmindanalytics.com/tools/solar-boq][b]👉 Test Free 5kVA–20kVA Solar & Lithium BOQ Sizer[/b][/url]

[b]⚡ For Registered Solar Installers & Clean Energy Contractors:[/b]
Want this exact automated load calculator + 24/7 WhatsApp BOQ closer deployed with your company logo & phone number in 24 hours (₦35k Starter / ₦75k deposit for full custom domain)? WhatsApp our engineering desk: [b]0802 279 1227[/b].
Drop your current monthly generator fuel spend or DisCo tariff below for custom sizing!\`;
}
`;

if (!code.includes('function getContextualBumpMessage')) {
  code = code.replace('// 3. Autonomous Bump & Auto-Reply Engine', bumpHelper + '\n// 3. Autonomous Bump & Auto-Reply Engine');
}

// 2. Replace hardcoded bump message with getContextualBumpMessage(thread.campaignKey)
const oldBumpMsg = `        const bumpMessage = \`[b]⚡ Quick Sizing Update for Inquirers:[/b]`;
if (code.includes(oldBumpMsg)) {
  const bumpMsgEnd = `Drop your current daily fuel spend or Disco tariff below if you want custom calculations.\`;`;
  const startIdx = code.indexOf(oldBumpMsg);
  const endIdx = code.indexOf(bumpMsgEnd, startIdx);
  if (startIdx !== -1 && endIdx !== -1) {
    const fullOld = code.substring(startIdx, endIdx + bumpMsgEnd.length);
    code = code.replace(fullOld, `const bumpMessage = getContextualBumpMessage(thread.campaignKey);`);
  }
}

// 3. Update Solar BOQ campaign body with B2B SME deployment notice
const b2bSolarNotice = `

[quote]
[b]⚡ Enterprise Deployment Notice for Solar Installers & Contractors:[/b]
If you are still sending manual Word/PDF quotations that clients reject, get this automated 5kVA–20kVA load calculator + 24/7 AI WhatsApp BOQ closer deployed under your company brand in 24 hours:
• [b]Tier 1 (Starter Go-Live):[/b] ₦35,000 one-time (or ₦25,000/month Pay-Small-Small) — Live in 24 Hours.
• [b]Tier 2 (Turnkey Custom Domain Suite):[/b] ₦75,000 Milestone Deposit (₦150,000 Total) — Dedicated .com.ng domain, Google SEO, 100% code ownership in 48 hours.
Settlement via Moniepoint Microfinance Bank (6805375225 - Bethelmind Digital Solutions, CAC RC 7034297).
WhatsApp Closer Desk: [b]0802 279 1227[/b]
[/quote]`;

if (!code.includes('Enterprise Deployment Notice for Solar Installers')) {
  code = code.replace(
    'generate an audited WhatsApp proposal instantly.\n\n[i]Updated:',
    'generate an audited WhatsApp proposal instantly.' + b2bSolarNotice + '\n\n[i]Updated:'
  );
  if (!code.includes('Enterprise Deployment Notice for Solar Installers')) {
    code = code.replace(
      'generate an audited WhatsApp proposal instantly.\r\n\r\n[i]Updated:',
      'generate an audited WhatsApp proposal instantly.' + b2bSolarNotice.replace(/\n/g, '\r\n') + '\r\n\r\n[i]Updated:'
    );
  }
}

// 4. Update Tokunbo Duty campaign body with B2B SME deployment notice
const b2bAutoNotice = `

[quote]
[b]⚡ Enterprise Notice for Lagos Auto Dealers & Clearing Agents:[/b]
Embed this exact live 17-digit VIN Customs Duty & PTML Surcharge Calculator directly onto your dealership website or WhatsApp business profile:
• [b]Tier 1 (Starter Go-Live):[/b] ₦35,000 one-time (or ₦25,000/month) — Active in 24 Hours.
• [b]Tier 2 (Full Turnkey Suite):[/b] ₦75,000 Deposit (₦150,000 Total) — Dedicated domain + Google SEO ranking.
Settlement via Moniepoint Microfinance Bank (6805375225 - Bethelmind Digital Solutions, CAC RC 7034297).
WhatsApp Closer Desk: [b]0802 279 1227[/b]
[/quote]`;

if (!code.includes('Enterprise Notice for Lagos Auto Dealers')) {
  code = code.replace(
    '[url=https://www.bethelmindanalytics.com/tools/tokunbo-duty][b]👉 Check Exact Tokunbo Customs Duty & Port Landing Cost Free[/b][/url]',
    '[url=https://www.bethelmindanalytics.com/tools/tokunbo-duty][b]👉 Check Exact Tokunbo Customs Duty & Port Landing Cost Free[/b][/url]' + b2bAutoNotice
  );
}

fs.writeFileSync(enginePath, code, 'utf8');
console.log('Successfully upgraded nairaland_autonomous_engine.js with B2B SME conversion funnels and contextual bumping!');
