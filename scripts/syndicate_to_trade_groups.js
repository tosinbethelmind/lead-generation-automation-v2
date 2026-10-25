/**
 * @file syndicate_to_trade_groups.js
 * BETHELMIND DIGITAL SOLUTIONS (RC 7034297)
 * Automated Multi-Platform B2B Trade Group Syndication Engine
 * Generates and manages high-engagement authority discussion guides for
 * Nigerian Facebook Trade Groups, LinkedIn Executives, and Association Forums.
 */

const fs = require('fs');
const path = require('path');

const REGISTRY_FILE = path.join(process.cwd(), 'local_db', 'syndication_registry.json');

const TRADE_CAMPAIGNS = [
  {
    id: 'solar-trade-fb',
    platform: 'Facebook Trade Groups',
    targetCommunity: 'Solar Energy & Inverter Installers Nigeria (140,000+ Members)',
    topic: '2026 Component BOQ Pricing: Stop Roadside Battery Undersizing',
    targetTool: 'https://www.bethelmindanalytics.com/tools/solar-boq?utm_source=fb_solar_trade&utm_medium=organic',
    body: 
`[2026 Solar Installers Reality Check] Why clients think 5kVA installations are "too expensive" and how to prove the math on paper before you climb the roof:

Fellow Installers & EPC Engineers,

With NERC Band A tariffs at N209.50/kWh and diesel at N1,300/L, our clients are desperate for solar. But the moment you submit an N8M quote for a 5kVA setup, they accuse you of overcharging because roadside technicians told them "N2.5M is enough".

Here is the exact component breakdown for a genuine Tier-1 5kVA Hybrid Setup (10kWh LiFePO4 Battery + 8x 550W Mono Half-Cell Panels):

1. Tier-1 5.0kVA Pure Sine Inverter (Growatt/Deye/Must): ~N850,000 - N1,150,000
2. 51.2V 200Ah (10.24kWh) Wall-Mount LiFePO4 Battery (CATL/EVE cells): ~N2,450,000 - N2,850,000
3. 8x 550W Tier-1 Monocrystalline Half-Cell Panels: ~N920,000 (at N115k/panel)
4. Heavy DC Cable Runs, 63A DC MCB, Surge Arrester & Rail Racks: ~N350,000
TOTAL AUDITED PROCUREMENT: ~N4,570,000 - N5,270,000 (excluding your installation markup).

Anything quoted at N2.5M is either using degraded second-life cells, Gel batteries that die in 8 months, or undersized fake panels that fail during Harmattan.

You can run your client's exact appliance load and generate a professional WhatsApp proposal free on your phone:
👉 https://www.bethelmindanalytics.com/tools/solar-boq?utm_source=fb_solar_trade

📥 FREE ON WHATSAPP: Want the confidential 2026 Alaba & Trade Fair Direct Importer Directory with phone numbers of verified CATL cell & Growatt distributors? Message our desk directly: https://wa.me/2348022791227?text=Please%20send%20me%20the%202026%20Alaba%20Solar%20Wholesale%20Directory

(If you want this exact quoting engine deployed on your own business website with your logo and WhatsApp number, you can activate it in 24 hours).`
  },
  {
    id: 'car-dealers-fb',
    platform: 'Facebook Trade Groups',
    targetCommunity: 'Lagos Car Dealers & Auto Auction Importers (210,000+ Members)',
    topic: '2026 Tokunbo Customs Duty Sheet: 2007-2016 Camry & RX350 Surcharges',
    targetTool: 'https://www.bethelmindanalytics.com/tools/tokunbo-duty?utm_source=fb_car_dealers&utm_medium=organic',
    body: 
`[Tin Can & PTML Clearing Update 2026] Don't wire money for Copart or Manheim cars until you confirm statutory duty vs terminal surcharges:

Colleagues in the auto trade,

Too many importers are having their capital trapped at the port because clearing agents gave estimated quotes without accounting for the 15% NAC levy and terminal demurrage.

Here is the audited breakdown for the most imported models right now:

• 2007-2010 Toyota Camry Muscle (PTML Grimaldi):
  - Statutory 20% Duty: ~N928,000 - N1,189,000
  - 15% NAC Levy: ~N696,000 - N891,750
  - 7.5% VAT: ~N348,000 - N445,875
  - Terminal & Shipping Surcharge: ~N420,000
  - Total Realistic Clearing: ~N2.4M - N2.95M

• 2010-2013 Lexus RX350 AWD (Tin Can Island):
  - Statutory 20% Duty: ~N1,798,000 - N2,465,000
  - 15% NAC Levy: ~N1,348,500 - N1,848,750
  - 7.5% VAT: ~N674,250 - N924,375
  - Terminal Demurrage & Handling: ~N550,000 - N580,000
  - Total Realistic Clearing: ~N4.37M - N5.82M

Verify your 17-digit VIN duty and terminal cost free before bidding:
👉 https://www.bethelmindanalytics.com/tools/tokunbo-duty?utm_source=fb_car_dealers

📥 FREE ON WHATSAPP: Want the NCS 2026 Single-Sheet Valuation Matrix & FOU Road Interception Clearance Checklist to verify your clearing slip? Message our desk directly: https://wa.me/2348022791227?text=Please%20send%20me%20the%20NCS%202026%20Customs%20Valuation%20Sheet`
  },
  {
    id: 'builders-civil-fb',
    platform: 'Facebook Trade Groups',
    targetCommunity: 'Nigeria Builders, Civil Engineers & Quantity Surveyors (180,000+ Members)',
    topic: '2026 Lekki & Ibeju Soil Reality: Piling vs Raft Foundations',
    targetTool: 'https://www.bethelmindanalytics.com/tools/construction-estimator/ibeju-lekki?utm_source=fb_builders&utm_medium=organic',
    body: 
`[Site Engineering Advisory 2026] The real danger of using strip foundations in Lekki Phase 1 vs Ibeju-Lekki sandy corridors:

Distinguished Site Engineers & Project Managers,

Before casting any slab in the Lekki-Epe axis, verify your soil strata. Lekki Phase 1 and Sangotedo sit on swampy marine clay where water table is less than 1.5m below ground level. Attempting a simple strip foundation results in wall shear cracks within 24 months.

Current Lekki Building Material Procurement Sheet:
• 20-tonne tipper sharp sand (Lekki): ~N120,000 vs Ibeju-Lekki: ~N85,000
• 30-tonne granite (3/4"): ~N260,000 - N280,000
• Dangote/BUA 42.5R Cement: ~N9,600 - N9,800/bag
• 16mm High-Yield TMT Iron Rods: ~N1,250,000/tonne

Run your site Bill of Quantities (BOQ) free on your phone:
👉 https://www.bethelmindanalytics.com/tools/construction-estimator?utm_source=fb_builders

📥 FREE ON WHATSAPP: Want the Lekki-Epe Soil Piling Engineering Guide & Direct Ogun Quarry Tipper Driver Contacts? Message our desk directly: https://wa.me/2348022791227?text=Please%20send%20me%20the%20Lekki%20Soil%20Piling%20Guide%20and%20Quarry%20Contacts`
  },
  {
    id: 'school-proprietors-linkedin',
    platform: 'LinkedIn & Education Association',
    targetCommunity: 'Association of Private School Owners Nigeria (APSON) & Lagos School Heads',
    topic: 'Eliminating Unpaid Third-Term School Fees: Automated Result Gating',
    targetTool: 'https://www.bethelmindanalytics.com/tools/school-tuition?utm_source=linkedin_schools&utm_medium=organic',
    body: 
`To Private School Proprietors and Administrators in Nigeria:

Why do schools struggle with unpaid term fees every holiday?
Because parents know that once the hardcopy report card is handed to the child, the school loses its financial leverage.

How top Lagos and Abuja private schools solved this:
1. Student digital report sheets are locked behind an encrypted parent portal.
2. Parents enter the student's admission number on their phone.
3. If outstanding balance is N0.00, the official stamped PDF result unlocks instantly.
4. If fees are pending, the portal presents instant Paystack/Moniepoint bank transfer with 10-second automatic ledger reconciliation.

Result: 94% fee recovery before vacation day.

Test the automated school fee and result gating portal free:
👉 https://www.bethelmindanalytics.com/tools/school-tuition?utm_source=linkedin_schools

📥 FREE ON WHATSAPP: Want the full Automated Result Gating Technical Blueprint and Parent WhatsApp Reminder Scripts? Message our desk directly: https://wa.me/2348022791227?text=Please%20send%20me%20the%20Automated%20Result%20Gating%20Blueprint`
  }
];

function initRegistry() {
  if (!fs.existsSync(path.dirname(REGISTRY_FILE))) {
    fs.mkdirSync(path.dirname(REGISTRY_FILE), { recursive: true });
  }
  if (!fs.existsSync(REGISTRY_FILE)) {
    fs.writeFileSync(REGISTRY_FILE, JSON.stringify({
      lastSyndicatedAt: null,
      campaigns: TRADE_CAMPAIGNS.map(c => ({
        id: c.id,
        platform: c.platform,
        targetCommunity: c.targetCommunity,
        topic: c.topic,
        status: 'READY_TO_DISPATCH',
        dispatchesCount: 0,
        lastDispatchedAt: null
      }))
    }, null, 2));
  }
}

function getSyndicationDeck() {
  initRegistry();
  return TRADE_CAMPAIGNS;
}

function printSyndicationDeck() {
  initRegistry();
  console.log('===============================================================');
  console.log('BETHELMIND AUTOMATED MULTI-PLATFORM SYNDICATION DECK');
  console.log('Ready-to-Post High-Intent Nigerian Trade Community Guides');
  console.log('===============================================================\n');

  TRADE_CAMPAIGNS.forEach((c, idx) => {
    console.log(`[CAMPAIGN #${idx + 1}] ${c.platform.toUpperCase()} -> ${c.targetCommunity}`);
    console.log(`Topic: ${c.topic}`);
    console.log(`Tracked URL: ${c.targetTool}`);
    console.log('---------------------------------------------------------------');
    console.log(c.body);
    console.log('\n===============================================================\n');
  });
}

if (require.main === module) {
  printSyndicationDeck();
}

module.exports = {
  getSyndicationDeck,
  TRADE_CAMPAIGNS
};
