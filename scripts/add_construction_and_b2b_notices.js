const fs = require('fs');
const path = require('path');

const enginePath = path.join(__dirname, 'nairaland_autonomous_engine.js');
let code = fs.readFileSync(enginePath, 'utf8');

// 1. Add construction-estimator campaign
const constructionCampaign = `  'construction-estimator': {
    boardId: 14,
    boardName: 'Properties',
    toolSlug: 'mortgage-calc',
    titles: [
      'Building in Lagos 2026: Exact Cement, Sand, Granite & Iron Rod Cost Matrix Before Mobilizing Workers',
      'Audited Lagos Duplex Foundation & Decking Sheet: How to Avoid 30% Site Material Pilferage',
      '2026 Reality of Building in Lekki & Ibeju: Real Cost of Sharp Sand, Granite & 42.5R Cement'
    ],
    generateBody: () => {
      const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      return \`[b]Building in Lagos 2026: Exact Cement, Sand, Granite & Iron Rod Cost Matrix (Avoid 30% Site Pilferage)[/b]

To all home builders, site supervisors, engineers, and property developers on Nairaland,

Building in Lagos in 2026 requires strict mathematical auditing. With [b]42.5R Grade Cement sitting at N10,200 – N10,800 per bag[/b], sharp sand tippers at [b]N140,000 – N180,000[/b], and high-yield 16mm iron rods at [b]N18,500 – N21,000 per length[/b], any unchecked site wastage or worker theft will blow your building budget by millions.

Here is an audited material matrix for a standard [b]1:2:4 Mix Ratio (Decking / German Floor Slab)[/b]:

[quote]
[b]• Cement Requirement:[/b] ~7.5 bags per cubic meter of finished structural concrete
[b]• Sharp Sand:[/b] ~0.5 cubic meters (Clean washed dredged sand, zero clay silt)
[b]• 3/4 Clean Granite:[/b] ~0.85 cubic meters (Crushed granite, zero dust)
[b]• Water-Cement Ratio:[/b] Strictly 0.45 – 0.50 (Excessive water weakens concrete compressive strength below 25 N/mm²)
[b]• Reinforcement (TMT):[/b] High-yield ribbed 12mm & 16mm rods tied with double binding wire at 150mm centers
[/quote]

To audit your plot layout, deed fees, and structural material requirements before buying materials or wiring money to site foremen, run the free interactive estimator on your phone:

[url=https://www.bethelmindanalytics.com/tools/mortgage-calc][b]👉 Test The Free Lagos Property Layout, Survey & Material Estimator[/b][/url]

[quote]
[b]⚡ Enterprise Deployment Notice for Building Contractors, Engineers & Developers:[/b]
If you run a construction or civil engineering firm and want this automated material estimator + 24/7 AI WhatsApp site quoting engine deployed under your company brand in 24 hours:
• [b]Tier 1 (Starter Go-Live):[/b] ₦35,000 one-time (or ₦25,000/month Pay-Small-Small) — Live in 24 Hours.
• [b]Tier 2 (Turnkey Custom Domain Suite):[/b] ₦75,000 Milestone Deposit (₦150,000 Total) — Dedicated .com.ng domain, Google SEO, 100% code ownership in 48 hours.
Settlement via Moniepoint Microfinance Bank (6805375225 - Bethelmind Digital Solutions, CAC RC 7034297).
WhatsApp Closer Desk: [b]0802 279 1227[/b]
[/quote]

[b]Engineers & Homebuilders:[/b] What stage of building are you currently executing (Foundation, German Floor, Decking, or Roofing)? Drop your specs below for estimated material quantities!

[i]Updated: \${dateStr} · Source: Bethelmind Digital Solutions (CAC Certified Enterprise RC 7034297)[/i]\`;
    }
  },\n`;

if (!code.includes("'construction-estimator':")) {
  code = code.replace("const CAMPAIGN_CATALOG = {", "const CAMPAIGN_CATALOG = {\n" + constructionCampaign);
}

// 2. Add B2B notice to school-portal if not present
const b2bSchoolNotice = `

[quote]
[b]⚡ Enterprise Deployment Notice for School Proprietors & Principals:[/b]
Deploy this automated term tuition portal + Scratch-PIN broadsheet result gating suite under your school's dedicated domain in 24 hours:
• [b]Tier 1 (Starter Go-Live):[/b] ₦35,000 one-time (or ₦25,000/month) — Active in 24 Hours.
• [b]Tier 2 (Full Turnkey School Suite):[/b] ₦75,000 Milestone Deposit (₦150,000 Total) — Custom domain + full PIN batch accounting.
Settlement via Moniepoint Microfinance Bank (6805375225 - Bethelmind Digital Solutions, CAC RC 7034297).
WhatsApp Closer Desk: [b]0802 279 1227[/b]
[/quote]

[b]Proprietors & Educators:[/b] How do you currently handle parents who owe second-term fees before exam slips are released? Share your experience below!`;

if (!code.includes('Enterprise Deployment Notice for School Proprietors')) {
  code = code.replace(
    '[url=https://www.bethelmindanalytics.com/tools/school-portal][b]👉 Test The School Tuition & Result PIN Ledger Free[/b][/url]',
    '[url=https://www.bethelmindanalytics.com/tools/school-portal][b]👉 Test The School Tuition & Result PIN Ledger Free[/b][/url]' + b2bSchoolNotice
  );
}

// 3. Add B2B notice to restaurant-order if not present
const b2bRestaurantNotice = `

[quote]
[b]⚡ Enterprise Deployment Notice for Restaurant & Lounge Operators:[/b]
Stop losing 25% of your food ticket to delivery aggregators. Deploy your own 0% commission direct WhatsApp menu & kitchen order ticket (KOT) system in 24 hours:
• [b]Tier 1 (Starter Go-Live):[/b] ₦35,000 one-time (or ₦25,000/month) — Active in 24 Hours.
• [b]Tier 2 (Full Custom Suite):[/b] ₦75,000 Milestone Deposit (₦150,000 Total) — Dedicated .com.ng domain + digital ordering dashboard.
Settlement via Moniepoint Microfinance Bank (6805375225 - Bethelmind Digital Solutions, CAC RC 7034297).
WhatsApp Closer Desk: [b]0802 279 1227[/b]
[/quote]

[b]Food Vendors & Restaurateurs:[/b] What percentage of your monthly sales currently goes to third-party delivery apps? Drop your numbers below!`;

if (!code.includes('Enterprise Deployment Notice for Restaurant & Lounge Operators')) {
  code = code.replace(
    '[url=https://www.bethelmindanalytics.com/tools/restaurant-order][b]👉 Test The 0% Commission Direct WhatsApp Menu Free[/b][/url]',
    '[url=https://www.bethelmindanalytics.com/tools/restaurant-order][b]👉 Test The 0% Commission Direct WhatsApp Menu Free[/b][/url]' + b2bRestaurantNotice
  );
}

// 4. Add construction-estimator to getContextualBumpMessage
const bumpConstruction = `  if (campaignKey === 'construction-estimator') {
    return \`[b]⚡ Site Procurement & Cement Price Update (Lagos):[/b]

To site engineers and developers procuring materials this week:
• Cement distributors in Ikorodu, Epe, and Agege are holding 42.5R Grade at N10,400 – N10,800/bag.
• For decking slabs, ensure your gravel-to-sand ratio is strictly measured in gauge boxes rather than unverified headpan counts to prevent 20% cement overconsumption.
• Test the live property layout, survey levies, and structural concrete estimator free on your phone:
[url=https://www.bethelmindanalytics.com/tools/mortgage-calc][b]👉 Test Free Lagos Construction & Layout Sizer[/b][/url]

[b]Building Contractors & Engineers:[/b] Want this automated material estimator deployed with your construction firm branding for ₦35,000? WhatsApp our desk: [b]0802 279 1227[/b].
Drop your building stage below for estimated material quantities!\`;
  }\n\n`;

if (!code.includes("campaignKey === 'construction-estimator'")) {
  code = code.replace(
    "function getContextualBumpMessage(campaignKey) {",
    "function getContextualBumpMessage(campaignKey) {\n" + bumpConstruction
  );
}

fs.writeFileSync(enginePath, code, 'utf8');
console.log('Successfully added construction-estimator and B2B SME conversion notices across all campaigns!');
