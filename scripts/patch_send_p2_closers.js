const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'send_pillar2_closers.js');
let code = fs.readFileSync(filePath, 'utf8');

const oldText1 = `2️⃣ *Accompanied Physical Inspection:*
Our buyer syndicate's accredited legal counsel and inspection liaison is prepared for accompanied physical inspection within 24 to 48 hours of your electronic endorsement.

3️⃣ *Direct Desk Counter-Signature & Call:*
Upon your signature, Desk Principal (Tosin Oyelakin) will immediately countersign and align with your team on gate access & inspection timing.

🏛️ *Bethelmind Corporate & Diaspora Property Desk*
• CAC Certified Nigerian Enterprise (Reg: 9912717)
• Settlement Bank: Moniepoint Microfinance Bank (6805375225 — Bethelmind Digital Solutions)
• Desk Closer Hotline: +234 802 279 1227

What day and time window works best for your team for the accompanied physical walkthrough: Tomorrow Morning (10:00 AM) or Afternoon (02:00 PM)?`;

const newText1 = `2️⃣ *Asset Shortlisting & Investor Presentation:*
Upon electronic endorsement, our Desk registers your listing into our priority investor presentation portfolio for our upcoming diaspora allocation cycle.

3️⃣ *Accompanied Walkthrough Protocol:*
Accompanied physical walkthrough is scheduled directly with your lead broker upon investor selection and gate clearance.

🏛️ *Bethelmind Corporate & Diaspora Property Desk*
• CAC Certified Nigerian Enterprise (Reg: 9912717)
• Settlement Bank: Moniepoint Microfinance Bank (6805375225 — Bethelmind Digital Solutions)
• Desk Closer Hotline: +234 802 279 1227

Kindly execute the memorandum at https://www.bethelmindanalytics.com/mandate so our Desk can confirm receipt and align with your team.`;

code = code.replace(new RegExp(oldText1.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newText1);
fs.writeFileSync(filePath, code, 'utf8');
console.log('✅ send_pillar2_closers.js updated with calibrated curation copy.');
