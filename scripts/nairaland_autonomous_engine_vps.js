#!/usr/bin/env node
/**
 * BETHELMIND DIGITAL SOLUTIONS — AUTONOMOUS NAIRALAND FORUM ENGINE
 * 
 * Features:
 * 1. Cloudflare-Bypassing Stealth Playwright Browser Context.
 * 2. Persistent Session Management (`local_db/nairaland_session.json`).
 * 3. Autonomous Topic Publisher across targeted Nairaland boards (Auto, Properties, Business, Education, Food).
 * 4. Anti-Duplicate Content Jitter & Dynamic BBCode Formatting.
 * 5. Autonomous Thread Bumper & Reply Monitor.
 * 6. Thread Ledger Persistence (`local_db/nairaland_campaigns.json`).
 */

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const ACCOUNTS_REGISTRY = path.join(__dirname, '..', 'local_db', 'nairaland_accounts.json');

function getActiveAccountName() {
  const accountArg = process.argv.find(a => a.startsWith('--account=') || a.startsWith('--user='));
  if (accountArg) return accountArg.split('=')[1].trim();
  return null;
}

function resolveSessionFile(accountOverride = null) {
  const acc = accountOverride || getActiveAccountName();
  if (acc) {
    if (acc.toLowerCase().includes('kenetwork')) {
      return path.join(__dirname, '..', 'local_db', 'nairaland_session_kenetwork2026.json');
    }
    if (acc.toLowerCase().includes('4thmainland')) {
      return path.join(__dirname, '..', 'local_db', 'nairaland_session_4thmainland.json');
    }
    if (acc.toLowerCase().includes('bethelsolution')) {
      return path.join(__dirname, '..', 'local_db', 'nairaland_session.json');
    }
  }
  return path.join(__dirname, '..', 'local_db', 'nairaland_session.json');
}

let SESSION_FILE = resolveSessionFile();
const CAMPAIGNS_LEDGER = path.join(__dirname, '..', 'local_db', 'nairaland_campaigns.json');

// Nairaland Board Mapping
const BOARDS = {
  vin: { id: 78, name: 'Car Talk', slug: 'tokunbo-vin-checker' },
  arbitrage: { id: 15, name: 'Computers', slug: 'p2p-arbitrage' },
  solar: { id: 14, name: 'Properties', slug: 'solar-boq' },
  auto: { id: 78, name: 'Car Talk', slug: 'tokunbo-duty' },
  properties: { id: 14, name: 'Properties', slug: 'mortgage-calculator' },
  business: { id: 24, name: 'Business', slug: 'fake-alert-shield' },
  education: { id: 19, name: 'Education', slug: 'school-portal' },
  salon: { id: 37, name: 'Fashion & Beauty', slug: 'salon-booking' },
  restaurant: { id: 38, name: 'Food', slug: 'restaurant-order' },
  logistics: { id: 24, name: 'Business', slug: 'logistics-quote' },
  sports: { id: 22, name: 'Sports', slug: 'footy-wordle' },
  investment: { id: 9, name: 'Investment', slug: 'p2p-arbitrage-desk' },
  agriculture: { id: 28, name: 'Agriculture', slug: 'agribusiness-boq' },
  phones: { id: 16, name: 'Phones', slug: 'retail-anti-fraud' },
  jobs: { id: 13, name: 'Career', slug: 'recruitment-engine' },
  health: { id: 33, name: 'Health', slug: 'clinic-booking' },
  general: { id: 1, name: 'General', slug: 'solar-boq' },
};

// Campaign Catalog with Anti-Duplicate Templates
const CAMPAIGN_CATALOG = {
  'tokunbo-vin-checker': {
    boardId: 78,
    boardName: 'Car Talk',
    toolSlug: 'vin',
    titles: [
      'How to Check Tokunbo VIN Free & Detect Auction Water-Damage Before Wiring Millions in Lagos',
      'Lagos Auto Buyers Guide: 17-Digit VIN Decoders, Copart Salvage Traps & NCS Customs Duty (2026)',
      'Before You Buy That Tokunbo Lexus RX350 or Corolla in Lagos: Free Salvage & VIN Decoder'
    ],
    generateBody: () => {
      const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      return `[b]How to Check Tokunbo VIN Free & Detect Auction Water-Damage Before Wiring Millions in Lagos[/b]

To all car buyers, auto enthusiasts, and Tokunbo car dealers on Nairaland,

With standard Tokunbo vehicles (Lexus RX350, Toyota Corolla, Camry, Honda Accord) currently trading between [b]₦14,000,000 to ₦26,000,000[/b] in Lagos, buying a bad car with hidden salvage history is an expensive mistake.

Over 35% of auction vehicles shipped through Tin Can and PTML ports have hidden issues:
[quote]
[b]The 3 Big Traps in Nigerian Tokunbo Dealerships:[/b]
1. [b]Flood & Saltwater Submersion:[/b] Hurricane flood-damaged cars from Texas/Florida auctioned as clean titles. Corroded wiring harnesses cause electrical fires within 3 months.
2. [b]Odometer Rollback:[/b] Mileage wound back from 180,000 miles to 65,000 miles before container loading.
3. [b]Stolen Catalytic Converters:[/b] Exhaust components hollowed out before port discharge, triggering immediate check engine lights.
[/quote]

[b]How to Verify Any 17-Digit VIN Free Before Leaving Home:[/b]
Instead of paying roadside mechanics to guess, you can decode the complete factory specs, NHTSA recalls, and auction history free on your phone:

[url=https://www.bethelmindanalytics.com/vin][b]🚗 Test The Free 17-Digit Tokunbo VIN & Salvage Checker[/b][/url]
[url=https://t.me/BethelmindAsistantBot][b]🤖 Run on 24/7 Telegram Master Bot: @BethelmindAsistantBot (Send /vin)[/b][/url]

[quote]
[b]💳 Need an Official Stamped NCS Valuation & VIN Passport Certificate?[/b]
Generate an instant official PDF report for vehicle registration, customs clearance, or buyer confidence (₦2,500 via Card/OPay):
👉 [url=https://selar.com/showlove/bethelmind?amount=2500][b]Order Official Stamped VIN Certificate (₦2,500 via Selar)[/b][/url]
[/quote]

[quote]
[b]⚡ Enterprise Notice for Lagos Auto Dealers & Clearing Agents:[/b]
Deploy this exact live 17-digit VIN Customs Duty & Salvage History Checker on your dealership website and WhatsApp profile:
• [b]Tier 1 (Starter Go-Live):[/b] ₦35,000 one-time (or ₦25,000/month) — Active in 24 Hours.
• [b]Tier 2 (Turnkey Custom Domain Suite):[/b] ₦75,000 Deposit (₦150,000 Total) — Dedicated .com.ng domain + Google SEO.
Settlement: Moniepoint Microfinance Bank (6805375225 - Bethelmind Digital Solutions, CAC CAC Reg: 9912717).
WhatsApp Closer Desk: [b]0802 279 1227[/b]
[/quote]

[b]Car Buyers & Dealers:[/b] Drop your 17-digit VIN or vehicle model below for instant audit specs!

[i]Updated: ${dateStr} · Source: Bethelmind Digital Solutions (CAC Certified Enterprise CAC Reg: 9912717)[/i]`;
    }
  },

  'construction-estimator': {
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
      return `[b]Building in Lagos 2026: Exact Cement, Sand, Granite & Iron Rod Cost Matrix (Avoid 30% Site Pilferage)[/b]

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
Settlement via Moniepoint Microfinance Bank (6805375225 - Bethelmind Digital Solutions, CAC CAC Reg: 9912717).
WhatsApp Closer Desk: [b]0802 279 1227[/b]
[/quote]

[b]Engineers & Homebuilders:[/b] What stage of building are you currently executing (Foundation, German Floor, Decking, or Roofing)? Drop your specs below for estimated material quantities!

[i]Updated: ${dateStr} · Source: Bethelmind Digital Solutions (CAC Certified Enterprise CAC Reg: 9912717)[/i]`;
    }
  },

  'fake-alert-shield': {
    boardId: 15,
    boardName: 'Computers',
    toolSlug: 'retail-catalog',
    titles: [
      'How Lagos Retailers & Supermarkets Stop Weekend Fake Alerts with Automated Webhook Reconciliation',
      'The Fake Alert Epidemic in Nigerian Retail: Why SMS/Email Alerts Fail and How Webhooks Solve It',
      'Stopping Fake Bank Transfers in Walk-in Boutiques: Moniepoint Webhook Verification Matrix'
    ],
    generateBody: () => {
      const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      return `[b]The Fake Alert Epidemic in Nigerian Retail: Why SMS/Email Alerts Fail and How Direct Webhooks Protect Cashiers[/b]

To business owners, boutique managers, and supermarket operators across Nigeria,

Every weekend, Nigerian retail merchants lose hundreds of thousands of Naira to sophisticated fake bank transfer fraud. 

The two most common fraud schemes:
1. [b]Counterfeit Transfer Receipts:[/b] Fraudsters use mobile graphic apps to generate photorealistic bank debit slips bearing your exact business name.
2. [b]Spoofed SMS Sender IDs:[/b] Bulk SMS gateways are abused to send fake credit alerts impersonating your bank before the customer walks out of the store.

[quote]
[b]The Real Difference: Surface Alerts vs. Programmatic Ledger Reconciliation[/b]

• [b]SMS/Email Alerts:[/b] Highly delayed (especially on weekends) and trivially spoofed. Relying on cashier phones creates long customer queues.
• [b]Automated Webhook Ledger:[/b] The instant a customer transfers funds to your Moniepoint or OPay virtual account, a secure 256-bit server webhook fires directly to your cashier screen or printer in [b]under 2.5 seconds[/b].
• [b]Result:[/b] Goods are never handed over based on customer phone screenshots. Zero fake alerts, zero cashier arguments, and instantaneous digital WhatsApp receipts.
[/quote]

To test how an automated WhatsApp catalog and instant anti-fake alert reconciliation ledger works for retail stores, test the free interactive engine here:

[url=https://www.bethelmindanalytics.com/tools/retail-catalog][b]👉 Test The Free Retail WhatsApp Closer & Anti-Fake Alert Engine[/b][/url]

[b]Business Owners & Retailers:[/b] How does your shop currently handle bank transfer confirmations during peak weekend rush hours? Share your experience below!

[i]Updated: ${dateStr} · Source: Bethelmind Digital Solutions (CAC Certified Enterprise CAC Reg: 9912717)[/i]`;
    }
  },

  'footy-wordle': {
    boardId: 22,
    boardName: 'Sports',
    toolSlug: 'footy-wordle',
    titles: [
      'FootyWordle AI: Daily 5-Letter Football Star Mystery & Transfer Value Guessing Game',
      'Free Daily Football Wordle For Nigerian Fans (Test Your Premier League & UCL Knowledge)',
      'How Many Tries To Guess Today 5-Letter Mystery Player? (Naija Football Fans Challenge)'
    ],
    generateBody: () => {
      const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      return `[b]⚽ Daily Football Mystery Player & Transfer Value Game (Play Free in Browser)[/b]

Naija Football Fans & Premier League Analysts,

We built a free, lightweight [b]daily 5-letter football Wordle game[/b] tailored for African sports enthusiasts. 

[quote]
[b]How to Play:[/b]
• Guess today's 5-letter football superstar or iconic club in 6 tries.
• Each guess gives you instant green/yellow letter clues.
• Once solved, view current transfer market valuations, league stats & historical trophies.
• Share your emoji score grid on WhatsApp or right here on Nairaland to challenge your friends!
[/quote]

Test today's mystery puzzle directly on your phone:

[url=https://www.bethelmindanalytics.com/tools/footy-wordle][b]👉 Play Today's Daily FootyWordle Free Here[/b][/url]

[b]Challenge:[/b] How many tries did it take you to crack today's player? Share your emoji grid results in the comments below!

[i]Updated: ${dateStr} · Source: Bethelmind Digital Solutions[/i]`;
    }
  },
  'solar-boq': {
    boardId: 14,
    boardName: 'Properties',
    toolSlug: 'solar-boq',
    titles: [
      '2026 Reality: How A 5kVA Solar Setup Replaces N312,500/Month Diesel at NERC Band A Tariffs',
      'Band A (N209.50/kWh) vs N1,250 Diesel: Audited 5kVA Solar Sizing & Payback Matrix',
      'Stop Overpaying Solar Installers in Lagos: Exact 5kVA Hybrid Inverter & Lithium BOQ Breakdown',
    ],
    generateBody: () => {
      const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      return `[b]2026 Reality: How A 5kVA Solar Setup Replaces N312,500/Month Diesel at NERC Band A Tariffs (Audited Breakdown)[/b]

Fellow Nairalanders,

With petrol and diesel sitting between [b]N1,250 to N1,350 per liter[/b] and NERC DisCo Band A billing at [b]N209.50/kWh[/b], running a home or business in Nigeria on generator power is no longer sustainable.

Here is an audited, practical engineering breakdown for a standard [b]5kVA Hybrid Solar System[/b] (Tier-1 51.2V LiFePO4 Lithium Battery):

[quote]
[b]• System Sizing:[/b] 5.0 kVA Pure Sine Inverter + 10kWh 51.2V Lithium Battery + 8x 550W Mono Half-Cell Panels
[b]• Daily Appliance Load:[/b] 1-2 Inverter ACs, Refrigerator, Deep Freezer, Water Pump, TV & Full LED Lighting
[b]• Monthly Diesel Displaced:[/b] ~250 Liters/month ([b]approx N312,500/month saved[/b])
[b]• Complete BOQ Procurement:[/b] ~N4,500,000 – N5,200,000 (depending on cable runs & surge protection)
[b]• Payback Runway:[/b] [b]14 to 16 Months[/b] (After month 16, electricity is virtually free)
[/quote]

Instead of guessing your sizing or overpaying roadside technicians, you can run your exact property numbers free on your phone:

[url=https://www.bethelmindanalytics.com/tools/solar-boq][b]👉 Test Your Exact Property Load & DisCo Sizing Free (No Sign-Up Needed)[/b][/url]

You can select Flat, Duplex, or Commercial Facility, enter your current monthly diesel spend, and generate an audited WhatsApp proposal instantly.

[quote]
[b]⚡ Enterprise Deployment Notice for Solar Installers & Contractors:[/b]
If you are still sending manual Word/PDF quotations that clients reject, get this automated 5kVA–20kVA load calculator + 24/7 AI WhatsApp BOQ closer deployed under your company brand in 24 hours:
• [b]Tier 1 (Starter Go-Live):[/b] ₦35,000 one-time (or ₦25,000/month Pay-Small-Small) — Live in 24 Hours.
• [b]Tier 2 (Turnkey Custom Domain Suite):[/b] ₦75,000 Milestone Deposit (₦150,000 Total) — Dedicated .com.ng domain, Google SEO, 100% code ownership in 48 hours.
Settlement via Moniepoint Microfinance Bank (6805375225 - Bethelmind Digital Solutions, CAC CAC Reg: 9912717).
WhatsApp Closer Desk: [b]0802 279 1227[/b]
[/quote]

[i]Updated: ${dateStr} · Source: Bethelmind Digital Solutions (CAC Certified Enterprise CAC Reg: 9912717)[/i]`;
    }
  },

  'tokunbo-duty': {
    boardId: 78,
    boardName: 'Car Talk',
    toolSlug: 'tokunbo-duty',
    titles: [
      'OFFICIAL 2026 Tin Can & PTML Customs Duty Calculation on Tokunbo Vehicles (20% Duty + 15% NAC Matrix)',
      'How to Calculate Exact Port Clearing Duty for Tokunbo Cars Before Wiring Funds (NCS 2026)',
      'Lexus RX350 & Corolla Tin Can Customs Clearing Sheet: Statutory Duty vs Terminal Surcharges',
    ],
    generateBody: () => {
      const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      return `[b]OFFICIAL 2026 Tin Can & PTML Customs Duty Calculation on Tokunbo Vehicles (20% Duty + 15% NAC Matrix)[/b]

To all car buyers, clearing agents, and auto dealers on Nairaland,

One of the biggest issues when buying or importing a Tokunbo vehicle is not knowing the [b]exact statutory Nigerian Customs Service (NCS) duty[/b] before the vessel berths at Tin Can Island or PTML Lagos.

Here is the statutory NCS clearing formula:

[quote]
[b]1. Statutory Import Duty:[/b] 20% of assessed CIF (Cost, Insurance & Freight) valuation
[b]2. National Automotive Council (NAC) Levy:[/b] 15% of CIF
[b]3. Statutory VAT:[/b] 7.5%
[b]4. Port Terminal Charges (PTML / Tin Can):[/b] Approx N280,000 – N380,000 depending on dwell time and shipping line
[b]5. Example (2018 Lexus RX350 @ N18.5m CIF):[/b] Duty (N3.7m) + NAC (N2.775m) + VAT & Terminal Fees = ~[b]N7,250,000 Total Port Landing Clearance[/b]
[/quote]

To verify vehicle duty before committing funds or wiring money to auction houses, you can run the live 17-digit VIN clearing calculator here:

[url=https://www.bethelmindanalytics.com/vin][b]👉 Check Exact Tokunbo VIN History & Customs Duty Free[/b][/url]

[url=https://t.me/BethelmindAsistantBot][b]🤖 Run on 24/7 Telegram Master Bot: @BethelmindAsistantBot[/b][/url]

[quote]
[b]💳 Need an Official NCS Valuation Certificate for Clearing or Resale?[/b]
Generate an instant official stamped Tokunbo Passport PDF with customs clearing breakdown via Selar / Card / OPay (₦2,000):
👉 [url=https://selar.com/showlove/bethelmind?amount=2500][b]Order Official Stamped Certificate (₦2,500 on Selar)[/b][/url]
[/quote]

[quote]
[b]⚡ Enterprise Notice for Lagos Auto Dealers & Clearing Agents:[/b]
Embed this exact live 17-digit VIN Customs Duty & PTML Surcharge Calculator directly onto your dealership website or WhatsApp business profile:
• [b]Tier 1 (Starter Go-Live):[/b] ₦35,000 one-time (or ₦25,000/month) — Active in 24 Hours.
• [b]Tier 2 (Full Turnkey Suite):[/b] ₦75,000 Deposit (₦150,000 Total) — Dedicated domain + Google SEO ranking.
Settlement via Moniepoint Microfinance Bank (6805375225 - Bethelmind Digital Solutions, CAC CAC Reg: 9912717).
WhatsApp Closer Desk: [b]0802 279 1227[/b]
[/quote]

[i]Updated: ${dateStr} · Source: Bethelmind Digital Solutions (CAC Certified Enterprise CAC Reg: 9912717)[/i]`;
    }
  },

  'p2p-arbitrage': {
    boardId: 15,
    boardName: 'Computers',
    toolSlug: 'p2p-arbitrage',
    titles: [
      'Official 2026 Binance P2P vs Bybit Dollar Spread Matrix: How to Legally Arbitrage ₦15–₦45/$ Daily',
      'Automated 2026 Binance P2P vs Bybit Dollar Spread Desk: How Traders Track ₦15–₦45/$ Arbitrage Free',
      'The 2026 Nigerian Dollar Arbitrage Blueprint: Capital Rotation, Account Safety & Live Spread Desk'
    ],
    generateBody: () => {
      const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      return `[b]Official 2026 Binance P2P vs Bybit Dollar Spread Matrix: How to Legally Arbitrage ₦15–₦45/$ Daily[/b]

To all digital merchants, P2P vendors, crypto traders, software developers, and FX operators on Nairaland,

In the current Nigerian foreign exchange landscape, market fragmentation between major orderbooks (Binance P2P, Bybit, KuCoin) and OTC bank settlement desks creates persistent daily price spreads ranging from [b]₦15 to ₦50 per USDT/Dollar[/b].

Here is how quantitative P2P arbitrage works legally and sustainably:

[quote]
[b]1. The Core Arbitrage Mechanism:[/b]
When Binance P2P buy orders clear at ₦1,485/$ and Bybit sell desks absorb volume at ₦1,510/$, an instant gross spread of [b]₦25/USDT[/b] exists across orderbooks.

[b]2. Daily Capital Rotation Return:[/b]
• Capital: $1,000 (Approx ₦1,485,000)
• Net spread after taker/merchant fees (0.15%): ₦22/USDT
• Net profit per completed rotation cycle: [b]₦22,000[/b]
• Rotating the same capital 3 times daily = [b]₦66,000 net profit / day[/b]

[b]3. Critical Risk Controls (Account Safety):[/b]
• Only trade with 98%+ completion merchants to prevent 3rd-party fraudulent bank transfer flags.
• Strictly utilize dedicated merchant accounts (OPay, Kuda, Moniepoint) with verified narration tags.
• Never hold volatile assets—execute instant USDT/NGN conversion cycles within sub-4 minute windows.
[/quote]

To monitor live real-time Binance vs Bybit spreads, black market parallel rates, and calculate instant rotation profits free:

[url=https://www.bethelmindanalytics.com/arbitrage][b]⚡ Open Live Bethelmind P2P Arbitrage & FX Desk Free[/b][/url]

[url=https://t.me/BethelmindAsistantBot][b]🤖 Receive 24/7 Live Spread Alerts on Telegram: @BethelmindAsistantBot[/b][/url]

[quote]
[b]⭐ Upgrade to VIP Real-Time Arbitrage Alert Stream:[/b]
Get instant automated notifications pushed directly to your Telegram the second a ₦15–₦50 spread opens, plus audited dealer orderbooks:
• [b]Subscription:[/b] ₦3,500/month (One $500 rotation pays back the entire subscription immediately).
👉 [url=https://selar.com/showlove/bethelmind?amount=3500][b]Join VIP Instant Signals via Selar / Card / OPay (₦3,500/mo)[/b][/url]
[/quote]

[b]📥 FREE ON WHATSAPP:[/b] Need our verified P2P Merchant Ledger & Bank Narration Safety Guide? Send "ARBITRAGE GUIDE" to our desk on [b]0802 279 1227[/b] ([url=https://wa.me/2348022791227?text=Please%20send%20me%20the%20P2P%20Arbitrage%20Safety%20Guide][b]Click Here to Chat on WhatsApp[/b][/url]).

[i]Updated: ${dateStr} · Source: Bethelmind Analytics FX Desk (CAC Certified Enterprise CAC Reg: 9912717)[/i]`;
    }
  },

  'salon-booking': {
    boardId: 37,
    boardName: 'Fashion & Beauty',
    toolSlug: 'salon-booking',
    titles: [
      'How Lagos Salons & Spas Are Stopping Fake Alerts and No-Shows with 25% WhatsApp Deposit Locks',
      'The 25% Seat Deposit Solution: How Beauty Parlors in Ikeja & Lekki Recover Vacant Chairs',
    ],
    generateBody: () => {
      const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      return `[b]How Lagos Salons & Spas Are Stopping Fake Alerts and No-Shows with 25% WhatsApp Deposit Locks[/b]

If you operate a hair salon, spa, nail bar, or executive barbershop in Lagos, Abuja, or Port Harcourt, you already know the two biggest revenue killers:
1. Customer No-Shows: A client books bridal fixing for Saturday 11 AM, your senior stylist sits waiting, and the client never shows up.
2. Fake Bank Credit Alerts: In a busy salon on weekend evenings, customers show fake bank transfer screenshots before walking out.

[quote]
[b]The Solution:[/b] 24/7 WhatsApp Appointment Booking with an instant [b]25% Seat Deposit Lock[/b].
• Client picks stylist, service, and time slot on your mobile menu.
• System instantly provisions a dynamic Moniepoint virtual account.
• When the 25% seat deposit clears, the chair is locked and calendar invite auto-dispatches.
• Zero fake alerts, zero vacant stylist hours.
[/quote]

Test the interactive prototype on your phone here:

[url=https://www.bethelmindanalytics.com/tools/salon-booking][b]👉 Test The Free 24/7 Salon Booking & Deposit Lock Engine[/b][/url]

[i]Updated: ${dateStr} · Source: Bethelmind Digital Solutions[/i]`;
    }
  },

  'restaurant-order': {
    boardId: 38,
    boardName: 'Food',
    toolSlug: 'restaurant-order',
    titles: [
      'Stop Giving 25% of Your Food Revenue to Third-Party Delivery Apps: The Direct WhatsApp Menu',
      'How Lagos Restaurants Are Slashing Delivery App Commissions with 0% Direct Digital Menus',
    ],
    generateBody: () => {
      const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      return `[b]Stop Giving 25% of Your Food Revenue to Third-Party Delivery Apps: The Direct WhatsApp Menu[/b]

Restaurant and lounge owners in Nigeria are currently getting squeezed by 25% - 30% commission cuts from delivery aggregators (Chowdeck, Glovo, FoodCourt).

On an order of N16,500 (Party Jollof & Jumbo Turkey), the aggregator takes [b]over N4,125[/b] in fees, wiping out the kitchen's profit margin.

[quote]
[b]The Alternative:[/b] A lightweight Direct Digital Menu + Kitchen Ticket Generator that routes 100% of customer orders directly to your WhatsApp and Moniepoint account with [b]0% commission deducted[/b].
[/quote]

Test the live interactive 0% commission food ordering engine here:

[url=https://www.bethelmindanalytics.com/tools/restaurant-order][b]👉 Test The 0% Commission Direct Restaurant Ordering Suite[/b][/url]

[i]Updated: ${dateStr} · Source: Bethelmind Digital Solutions[/i]`;
    }
  },

  'school-portal': {
    boardId: 19,
    boardName: 'Education',
    toolSlug: 'school-portal',
    titles: [
      'Private School Administrators: How to Gate Digital Result Sheets Until Term Fees Are 100% Cleared',
      'Recovering Outstanding Term Fees: Automated Result PIN Portals for Nigerian Private Schools',
    ],
    generateBody: () => {
      const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      return `[b]Private School Administrators: How to Gate Digital Result Sheets Until Term Fees Are 100% Cleared[/b]

Every school term, private nursery, primary, and secondary school proprietors struggle with unpaid tuition fees. Once report cards are issued, collecting fee arrears becomes nearly impossible.

[quote]
[b]The Solution:[/b] Automated Student Term Fee Portals with Scratch-PIN / Digital Result Gating.
• Term report cards and exam broadsheets remain strictly locked behind an automated gateway.
• Parents settle term tuition via instant Moniepoint bank transfer or unique student PIN.
• The moment payment clears in the school's ledger, the digital report card unlocks immediately.
[/quote]

Test the interactive school tuition & PIN ledger suite here:

[url=https://www.bethelmindanalytics.com/tools/school-portal][b]👉 Test The School Tuition & Result PIN Ledger Free[/b][/url]

[quote]
[b]⚡ Enterprise Deployment Notice for School Proprietors & Principals:[/b]
Deploy this automated term tuition portal + Scratch-PIN broadsheet result gating suite under your school's dedicated domain in 24 hours:
• [b]Tier 1 (Starter Go-Live):[/b] ₦35,000 one-time (or ₦25,000/month) — Active in 24 Hours.
• [b]Tier 2 (Full Turnkey School Suite):[/b] ₦75,000 Milestone Deposit (₦150,000 Total) — Custom domain + full PIN batch accounting.
Settlement via Moniepoint Microfinance Bank (6805375225 - Bethelmind Digital Solutions, CAC CAC Reg: 9912717).
WhatsApp Closer Desk: [b]0802 279 1227[/b]
[/quote]

[b]Proprietors & Educators:[/b] How do you currently handle parents who owe second-term fees before exam slips are released? Share your experience below!

[i]Updated: ${dateStr} · Source: Bethelmind Digital Solutions[/i]`;
    }
  }
};

// Ensure Ledger exists
function loadLedger() {
  if (fs.existsSync(CAMPAIGNS_LEDGER)) {
    try {
      return JSON.parse(fs.readFileSync(CAMPAIGNS_LEDGER, 'utf8'));
    } catch {
      return { threads: [], stats: { totalPosted: 0, totalBumps: 0 } };
    }
  }
  return { threads: [], stats: { totalPosted: 0, totalBumps: 0 } };
}

function saveLedger(ledger) {
  const dir = path.dirname(CAMPAIGNS_LEDGER);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(CAMPAIGNS_LEDGER, JSON.stringify(ledger, null, 2), 'utf8');
}

// Browser Launch Helper with Cloudflare Stealth
async function createStealthBrowser(headless = true, ignoreSavedSession = false) {
  const browser = await chromium.launch({
    headless,
    args: [
      '--disable-blink-features=AutomationControlled',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-infobars',
    ]
  });

  const contextOptions = {
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 800 },
    locale: 'en-US',
  };

  if (!ignoreSavedSession && fs.existsSync(SESSION_FILE)) {
    try {
      const raw = JSON.parse(fs.readFileSync(SESSION_FILE, 'utf8'));
      const sessionCookie = raw.cookies?.find(c => c.name === 'session');
      if (sessionCookie && sessionCookie.value && sessionCookie.value !== '""' && sessionCookie.value.length > 5) {
        contextOptions.storageState = SESSION_FILE;
        console.log('✓ Loaded valid existing session from:', SESSION_FILE);
      } else {
        console.log('Skipping unauthenticated / empty session in:', SESSION_FILE);
      }
    } catch (e) {
      console.warn('Could not parse session file:', e.message);
    }
  }

  const context = await browser.newContext(contextOptions);

  // Stealth script
  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });

  return { browser, context };
}

// Dedicated Direct Login with Credentials
async function loginWithCredentials(username, password, headless = false) {
  if (!username || !password) {
    throw new Error('Both username and password are required for direct login.');
  }

  console.log(`\n[NAIRALAND DIRECT LOGIN] Attempting login for user: ${username}...`);
  const { browser, context } = await createStealthBrowser(headless, true);
  const page = await context.newPage();

  try {
    await page.goto('https://www.nairaland.com/login', { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    // Fill credentials
    await page.fill('input[name="login"]', username);
    await page.fill('input[name="password"]', password);
    await page.click('input[value="Login"]');

    // Wait for page to navigate / process
    await page.waitForTimeout(3000);

    const bodyText = await page.innerText('body').catch(() => '');
    const isGuest = bodyText.includes('Welcome, Guest') || bodyText.includes('Login With Password:');
    const hasLogout = bodyText.includes('Logout');
    const welcomeMatch = bodyText.match(/Welcome,\s+([A-Za-z0-9_-]+)/i);
    const memberName = (welcomeMatch && welcomeMatch[1].toLowerCase() !== 'guest') ? welcomeMatch[1] : null;

    const cookies = await context.cookies();
    const sessionCookie = cookies.find(c => c.name === 'session');
    const hasValidCookie = sessionCookie && sessionCookie.value && sessionCookie.value !== '""' && sessionCookie.value.length > 5;

    if (!isGuest && (hasLogout || memberName) && hasValidCookie) {
      const activeUser = memberName || username;
      console.log(`✓ Authentication SUCCESSFUL! Logged in as: ${activeUser}`);
      
      const sessionObj = {
        username: activeUser,
        savedAt: new Date().toISOString(),
        cookies: cookies,
        origins: []
      };

      const dir1 = path.dirname(SESSION_FILE);
      if (!fs.existsSync(dir1)) fs.mkdirSync(dir1, { recursive: true });
      fs.writeFileSync(SESSION_FILE, JSON.stringify(sessionObj, null, 2), 'utf8');

      const altFile = path.join(__dirname, '..', 'data', 'nairaland_session.json');
      const dir2 = path.dirname(altFile);
      if (!fs.existsSync(dir2)) fs.mkdirSync(dir2, { recursive: true });
      fs.writeFileSync(altFile, JSON.stringify(sessionObj, null, 2), 'utf8');

      console.log('✓ Session cookies saved permanently to:', SESSION_FILE);
      await browser.close();
      return { success: true, username: activeUser };
    } else {
      console.error('✗ Login failed: Credentials may be incorrect or Nairaland returned an error.');
      await browser.close();
      return { success: false, reason: 'INVALID_CREDENTIALS', message: 'Could not log into Nairaland with provided credentials.' };
    }
  } catch (err) {
    console.error('✗ Login error:', err.message);
    await browser.close();
    return { success: false, error: err.message };
  }
}

// 1. Interactive Session Setup (User logs in once, browser stays open until confirmed)
async function setupInteractiveSession() {
  console.log('\n============================================================');
  console.log('NAIRALAND INTERACTIVE SESSION SETUP (1-TIME INITIALIZATION)');
  console.log('============================================================');
  console.log('Opening visible browser window on your screen...');
  console.log('The browser window will STAY OPEN until you log into your account.\n');

  // Launch visible browser, strictly ignoring any existing/corrupted session
  const { browser, context } = await createStealthBrowser(false, true);
  const page = await context.newPage();

  console.log('Navigating to Nairaland login page...');
  await page.goto('https://www.nairaland.com/login', { waitUntil: 'domcontentloaded' });

  // If credentials exist in .env.local, auto-fill them
  const username = process.env.NAIRALAND_USERNAME;
  const password = process.env.NAIRALAND_PASSWORD;

  if (username && password) {
    console.log(`Auto-filling credentials for user: ${username}...`);
    try {
      await page.fill('input[name="login"]', username);
      await page.fill('input[name="password"]', password);
      await page.click('input[value="Login"]');
    } catch (err) {
      console.log('Auto-fill note:', err.message);
    }
  }

  console.log('\n👉 BROWSER IS READY:');
  console.log('Please enter your Nairaland username & password in the browser window and click Login.');
  console.log('Waiting for your login (monitoring up to 5 minutes)...\n');

  let loggedIn = false;
  let detectedUsername = '';

  for (let i = 0; i < 200; i++) {
    await page.waitForTimeout(1500);

    // If user closed the window manually
    if (page.isClosed()) {
      console.log('Browser window was closed by user.');
      break;
    }

    try {
      const bodyText = await page.innerText('body').catch(() => '');
      const isGuest = bodyText.includes('Welcome, Guest') || bodyText.includes('Login With Password:');
      const hasLogout = bodyText.includes('Logout');
      const welcomeMatch = bodyText.match(/Welcome,\s+([A-Za-z0-9_-]+)/i);
      const memberName = (welcomeMatch && welcomeMatch[1].toLowerCase() !== 'guest') ? welcomeMatch[1] : null;

      const cookies = await context.cookies();
      const sessionCookie = cookies.find(c => c.name === 'session');
      const hasValidCookie = sessionCookie && sessionCookie.value && sessionCookie.value !== '""' && sessionCookie.value.length > 5;

      // STRICT VALIDATION: Must NOT be guest, must have Logout or member name, and must have session cookie
      if (!isGuest && (hasLogout || memberName) && hasValidCookie) {
        loggedIn = true;
        detectedUsername = memberName || username || 'Active Member';
        break;
      }
    } catch (e) {
      // Catch navigation transient errors
    }
  }

  if (loggedIn) {
    console.log(`\n✓ SUCCESS! Authenticated as: ${detectedUsername}`);
    const cookies = await context.cookies();
    const sessionObj = {
      username: detectedUsername,
      savedAt: new Date().toISOString(),
      cookies: cookies,
      origins: []
    };

    const dir = path.dirname(SESSION_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(SESSION_FILE, JSON.stringify(sessionObj, null, 2), 'utf8');

    const altFile = path.join(__dirname, '..', 'data', 'nairaland_session.json');
    const altDir = path.dirname(altFile);
    if (!fs.existsSync(altDir)) fs.mkdirSync(altDir, { recursive: true });
    fs.writeFileSync(altFile, JSON.stringify(sessionObj, null, 2), 'utf8');

    console.log('✓ Session cookies saved permanently to:', SESSION_FILE);
  } else {
    console.error('\n✗ Authentication not completed or timed out.');
  }

  try {
    await browser.close();
  } catch {}
  return loggedIn;
}

// 2. Autonomous Topic Poster
async function postCampaign(campaignKey = 'solar-boq') {
  const campaign = CAMPAIGN_CATALOG[campaignKey];
  if (!campaign) {
    throw new Error(`Unknown campaign key: ${campaignKey}. Available: ${Object.keys(CAMPAIGN_CATALOG).join(', ')}`);
  }

  console.log(`\n[AUTONOMOUS POST] Launching Campaign: ${campaignKey} on Board: ${campaign.boardName} (#${campaign.boardId})...`);

  const isVisible = process.argv.includes('--visible') || process.argv.includes('--headful');
  const { browser, context } = await createStealthBrowser(!isVisible);
  const page = await context.newPage();

  try {
    // Navigate to target new topic URL
    const targetUrl = `https://www.nairaland.com/newtopic?board=${campaign.boardId}`;
    console.log(`Navigating to: ${targetUrl}...`);
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

    const currentUrl = page.url();
    if (currentUrl.includes('/login')) {
      console.warn('⚠️ Session expired or not logged in! Redirected to login page.');
      await browser.close();
      return { success: false, reason: 'AUTH_REQUIRED', message: 'Nairaland session expired. Run --interactive-login' };
    }

    // Pick random title variation to avoid duplicate hash
    const title = campaign.titles[Math.floor(Math.random() * campaign.titles.length)];
    const body = campaign.generateBody();

    console.log(`Setting Title: "${title}"`);

    // Type title and body
    await page.fill('input[name="title"]', title);
    await page.fill('textarea[name="body"]', body);

    // Human pause before clicking submit
    await page.waitForTimeout(2000);

    console.log('Submitting topic to Nairaland...');
    await page.click('input[value="Submit"]');

    // Wait for Cloudflare verification challenge to complete & redirect to thread (up to 30s)
    console.log('Waiting for Cloudflare security verification and thread redirect...');
    let postResultUrl = page.url();
    for (let w = 0; w < 15; w++) {
      await page.waitForTimeout(2000);
      postResultUrl = page.url();
      if (!postResultUrl.includes('/do_newtopic') && postResultUrl.match(/\/(\d+)\//)) {
        console.log('✓ Redirect confirmed to live thread!');
        break;
      }
      // Check for Turnstile frame
      const frames = page.frames();
      for (const frame of frames) {
        if (frame.url().includes('cloudflare') || frame.url().includes('turnstile') || frame.url().includes('challenge')) {
          const box = await frame.$('input[type="checkbox"], .ctp-checkbox-label, #cf-stage, #challenge-stage');
          if (box) {
            await box.click().catch(() => {});
            console.log('Detected Turnstile frame: clicked checkbox.');
          }
        }
      }
    }
    console.log('Post Result URL:', postResultUrl);

    let threadId = null;
    const match = postResultUrl.match(/\/(\d+)\//);
    if (match) {
      threadId = match[1];
    }

    if (threadId && !postResultUrl.includes('/do_newtopic') && !postResultUrl.includes('/newtopic')) {
      const ledger = loadLedger();
      const threadRecord = {
        id: threadId,
        campaignKey,
        title,
        boardId: campaign.boardId,
        boardName: campaign.boardName,
        url: postResultUrl,
        postedAt: new Date().toISOString(),
        lastBumpedAt: new Date().toISOString(),
        bumpCount: 0,
        repliesCount: 0,
      };

      const exists = (ledger.threads || []).some(t => t.id === threadId);
      if (!exists) {
        ledger.threads.unshift(threadRecord);
        ledger.stats.totalPosted = (ledger.stats.totalPosted || 0) + 1;
        saveLedger(ledger);
      }

      console.log('✓ Topic successfully posted and recorded in ledger:', threadRecord.url);
      await browser.close();
      return { success: true, thread: threadRecord };
    } else {
      console.warn('⚠️ Topic publication did not redirect to a live topic URL. Current URL:', postResultUrl);
      await browser.close();
      return { success: false, reason: 'NOT_REDIRECTED', url: postResultUrl };
    }

  } catch (err) {
    console.error('Error during post:', err.message);
    await browser.close();
    return { success: false, error: err.message };
  }
}

function getContextualBumpMessage(campaignKey) {
  if (campaignKey === 'construction-estimator') {
    return `[b]⚡ Site Procurement & Cement Price Update (Lagos):[/b]

To site engineers and developers procuring materials this week:
• Cement distributors in Ikorodu, Epe, and Agege are holding 42.5R Grade at N10,400 – N10,800/bag.
• For decking slabs, ensure your gravel-to-sand ratio is strictly measured in gauge boxes rather than unverified headpan counts to prevent 20% cement overconsumption.
• Test the live property layout, survey levies, and structural concrete estimator free on your phone:
[url=https://www.bethelmindanalytics.com/tools/mortgage-calc][b]👉 Test Free Lagos Construction & Layout Sizer[/b][/url]

[b]📥 FREE ON WHATSAPP:[/b] Need the Lekki-Epe Soil Piling Engineering Guide & Direct Ogun Quarry Tipper Driver Contacts? Send "QUARRY CONTACTS" to our desk: [b]0802 279 1227[/b] ([url=https://wa.me/2348022791227?text=Please%20send%20me%20the%20Lekki%20Soil%20Piling%20Guide%20and%20Quarry%20Contacts][b]Click Here to Receive on WhatsApp[/b][/url]).

[b]Building Contractors & Engineers:[/b] Want this automated material estimator deployed with your construction firm branding for ₦35,000? WhatsApp our desk: [b]0802 279 1227[/b].
Drop your building stage below for estimated material quantities!`;
  }

  if (campaignKey === 'tokunbo-duty' || campaignKey === 'tokunbo-vin-checker') {
    return `[b]⚡ 2026 PTML & Tin Can Port Clearance & Tokunbo VIN Passport Update:[/b]

To car buyers and auto importers asking about terminal dwell time, statutory clearing, and auction salvage traps:
• Remember that statutory Customs Duty (20%) + NAC Levy (15%) + VAT (7.5%) are strictly calculated on the assessed CIF valuation sheet, not on auction bid prices.
• Over 40% of salvage auction cars imported into Lagos have undisclosed salt-water flood submersion or missing catalytic converters.
• Always verify the statutory duty and salvage history before wiring auction payments:
[url=https://www.bethelmindanalytics.com/vin][b]🚗 Test Exact Tokunbo VIN Customs Duty & Salvage Auditor Free[/b][/url]
[url=https://t.me/BethelmindAsistantBot][b]🤖 Telegram Master Bot: @BethelmindAsistantBot (Instant /vin command)[/b][/url]
[url=https://selar.com/showlove/bethelmind?amount=2500][b]💳 Instant Official Stamped PDF Valuation Certificate (₦2,500 via Selar)[/b][/url]

[b]📥 FREE ON WHATSAPP:[/b] Need the NCS 2026 Single-Sheet Valuation Matrix & FOU Road Interception Clearance Checklist? Send "CUSTOMS SHEET" to our desk: [b]0802 279 1227[/b] ([url=https://wa.me/2348022791227?text=Please%20send%20me%20the%20NCS%202026%20Customs%20Valuation%20Sheet][b]Click Here to Receive on WhatsApp[/b][/url]).

[b]⚡ For Car Dealers & Clearing Agents:[/b]
Want this exact live clearing duty calculator deployed under your own dealership brand and WhatsApp number for ₦35,000? WhatsApp our desk on [b]0802 279 1227[/b] (CAC Certified CAC Reg: 9912717).
[b]🚨 Free 2026 Tokunbo VIN Pre-Purchase & Customs Duty Audit for Nairalanders:[/b]
Before wiring millions, drop your 17-digit VIN or model below OR message WhatsApp [b]0802 279 1227[/b]. We will decode factory specs, auction flood history, and calculate exact NCS customs duty 100% FREE!
[b]⚡ Auto Dealers:[/b] Test our 48-Hour Live Dealership Quoter with ₦0 Upfront. Pay ₦35,000 only after live approval.`;
  }

  if (campaignKey === 'p2p-arbitrage') {
    return `[b]⚡ Live P2P Arbitrage & Parallel Market Spread Alert:[/b]

To crypto merchants and FX operators monitoring orderbook volatility:
• Spreads between Binance P2P and Bybit merchant desks peak during 11:00 AM – 2:00 PM and 8:00 PM – 11:00 PM WAT.
• Always calculate taker/merchant fees and bank transfer tariffs before locking orderbook inventory.
• Track live real-time spreads and test the profit rotation calculator free on your phone:
[url=https://www.bethelmindanalytics.com/arbitrage][b]⚡ Live P2P Arbitrage & FX Terminal[/b][/url]
[url=https://t.me/BethelmindAsistantBot][b]🤖 Run on Telegram: @BethelmindAsistantBot (Instant /arbitrage and /calc)[/b][/url]
[url=https://selar.com/showlove/bethelmind?amount=3500][b]💳 Join VIP 24/7 High-Spread Signal Feed (₦3,500/mo via Selar)[/b][/url]

Drop your trading capital size below to see your net daily rotation profit!`;
  }

  if (campaignKey === 'fake-alert-shield') {
    return `[b]⚡ Retail Fraud Prevention Update for Weekend Trading:[/b]

To boutique, supermarket, and pharmacy cashiers dealing with rush hour queues:
• Fake bank debit alert apps and modified SMS sender IDs spike during Friday–Sunday evening trading.
• Never hand over goods based on customer phone screenshots or unverified SMS alerts. Only release items upon verified server ledger credit.
• Test the live sub-2.5s Moniepoint/OPay webhook reconciliation and WhatsApp receipt closer free on your phone:
[url=https://www.bethelmindanalytics.com/tools/retail-catalog][b]👉 Test Free Retail WhatsApp Closer & Anti-Fake Alert Engine[/b][/url]

[b]📥 FREE ON WHATSAPP:[/b] Need the Weekend Fake Alert App Blacklist & Automated Moniepoint Webhook Setup Card? Send "FAKE ALERT BLACKLIST" to our desk: [b]0802 279 1227[/b] ([url=https://wa.me/2348022791227?text=Please%20send%20me%20the%20Fake%20Alert%20Blacklist][b]Click Here to Receive on WhatsApp[/b][/url]).

[b]⚡ For Store Owners & Supermarkets:[/b]
Deploy this exact webhook verification screen + WhatsApp closer for your cashiers in 24 hours (₦35,000 Starter Setup / ₦25,000 monthly). WhatsApp: [b]0802 279 1227[/b].
How does your store currently handle transfer confirmations during rush hours? Share below!`;
  }

  // Default Solar BOQ
  return `[b]⚡ Practical Sizing & Diesel Replacement Update:[/b]

For those asking about sizing during peak sunshine hours:
• Prioritize heavy appliance operation (water pumping, pressing iron, deep freezer freezing cycles) between 11:00 AM and 02:30 PM to run 100% on direct solar PV without battery degradation.
• Test your exact custom kVA and monthly diesel displacement calculation free on your phone:
[url=https://www.bethelmindanalytics.com/tools/solar-boq][b]👉 Test Free 5kVA–20kVA Solar & Lithium BOQ Sizer[/b][/url]

[b]📥 FREE ON WHATSAPP:[/b] Want the confidential 2026 Alaba & Trade Fair Wholesale Supplier Directory (CATL lithium cells & Tier-1 Growatt distributors)? Send "ALABA DIRECTORY" to our WhatsApp desk: [b]0802 279 1227[/b] ([url=https://wa.me/2348022791227?text=Please%20send%20me%20the%202026%20Alaba%20Solar%20Wholesale%20Directory][b]Click Here to Receive Free on WhatsApp[/b][/url]).

[b]⚡ For Registered Solar Installers & Clean Energy Contractors:[/b]
Want this exact automated load calculator + 24/7 WhatsApp BOQ closer deployed with your company logo & phone number in 24 hours (₦35k Starter / ₦75k deposit for full custom domain)? WhatsApp our engineering desk: [b]0802 279 1227[/b].
[b]🚨 Free 2026 Solar Load Sizing & DisCo Band A Audit for Nairalanders:[/b]
Reply below with your appliance list (e.g. 1.5HP AC, freezer, lighting) OR WhatsApp [b]0802 279 1227[/b]. We will calculate your exact continuous wattage and generate your audited 2026 BOQ 100% FREE!
[b]⚡ Registered Installers:[/b] Test our 48-Hour Live WhatsApp Pilot with ₦0 Upfront deposit. Pay ₦35,000 only after live phone approval.`;
}

// 3. Autonomous Bump & Auto-Reply Engine
async function bumpAndReplyToThreads() {
  const ledger = loadLedger();
  if (!ledger.threads || ledger.threads.length === 0) {
    console.log('No active threads in ledger to bump.');
    return { success: true, bumpedCount: 0 };
  }

  console.log(`\n[AUTONOMOUS BUMPER] Checking ${ledger.threads.length} active threads...`);
  const isVisible = process.argv.includes('--visible') || process.argv.includes('--headful');
  const { browser, context } = await createStealthBrowser(!isVisible);
  const page = await context.newPage();

  let bumped = 0;

  for (const thread of ledger.threads) {
    if (!thread.url || thread.url.includes('/newtopic')) continue;

    // Safety Throttle: Minimum 60 minutes between bumps per thread to prevent spambot detection
    const lastBumpTime = new Date(thread.lastBumpedAt || thread.postedAt || 0).getTime();
    const elapsedMinutes = (Date.now() - lastBumpTime) / (1000 * 60);
    if (elapsedMinutes < 60 && !process.env.FORCE_BUMP) {
      console.log(`⏳ Thread "${thread.title}" was bumped ${Math.round(elapsedMinutes)}m ago. Nairaland anti-spam guard requires $\\ge$60m cadence. Skipping.`);
      continue;
    }

    const threadIdMatch = (thread.id && !thread.id.startsWith('NL-')) ? thread.id : (thread.url ? thread.url.match(/\/(\d+)\//) : null);
    const threadId = Array.isArray(threadIdMatch) ? threadIdMatch[1] : threadIdMatch;
    if (!threadId) {
      console.log(`Skipping unposted or placeholder thread: ${thread.title}`);
      continue;
    }
    const replyUrl = `https://www.nairaland.com/newpost?topic=${threadId}`;
    console.log(`Navigating to reply page for "${thread.title}": ${replyUrl}...`);
    try {
      await page.goto(replyUrl, { waitUntil: 'domcontentloaded', timeout: 25000 });
      const currentUrl = page.url();
      if (currentUrl.includes('/login')) {
        console.warn('⚠️ Session expired. Skipping bumps.');
        break;
      }

      // Check if fast reply form exists (input[name="body"] or textarea)
      const hasReplyBox = await page.$('textarea[name="body"]');
      if (hasReplyBox) {
        // Compose an expert organic bump message
const bumpMessage = getContextualBumpMessage(thread.campaignKey);

        await page.fill('textarea[name="body"]', bumpMessage);
        await page.waitForTimeout(2000);
        console.log('Submitting bump reply...');
        await page.click('input[value="Submit"]');
        
        // Wait up to 15s for Cloudflare or redirect
        for (let w = 0; w < 6; w++) {
          await page.waitForTimeout(2000);
          if (page.url().includes('/' + threadId + '/')) {
            console.log('✓ Bump confirmed on live thread!');
            break;
          }
        }

        thread.lastBumpedAt = new Date().toISOString();
        thread.bumpCount = (thread.bumpCount || 0) + 1;
        bumped++;
        console.log(`✓ Thread bumped successfully! (Total bumps: ${thread.bumpCount})`);

        // Wait 10 seconds between bumps to maintain human cadence
        await page.waitForTimeout(10000);
      }
    } catch (err) {
      console.warn(`Could not bump thread ${thread.id}:`, err.message);
    }
  }

  ledger.stats.totalBumps = (ledger.stats.totalBumps || 0) + bumped;
  saveLedger(ledger);

  await browser.close();
  return { success: true, bumpedCount: bumped };
}

// 4. Status Check
function getStatus() {
  let authenticated = false;
  let username = null;
  let lastActive = null;

  if (fs.existsSync(SESSION_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(SESSION_FILE, 'utf8'));
      const sessionCookie = data.cookies?.find(c => c.name === 'session');
      if (sessionCookie && sessionCookie.value && sessionCookie.value !== '""' && sessionCookie.value.length > 5) {
        authenticated = true;
        username = data.username || 'Active Member';
        lastActive = data.savedAt || null;
      }
    } catch {}
  }

  const ledger = loadLedger();
  return {
    authenticated,
    username,
    lastActive,
    sessionPath: SESSION_FILE,
    totalCampaignsAvailable: Object.keys(CAMPAIGN_CATALOG).length,
    catalog: Object.keys(CAMPAIGN_CATALOG),
    ledgerStats: ledger.stats,
    activeThreadsCount: ledger.threads.length,
    recentThreads: ledger.threads.slice(0, 5),
  };
}

// 5. Autonomous 24/7 Full Cycle (Posts next tool if >=12h, and bumps active threads)
async function runAutonomousCycle() {
  console.log('\n============================================================');
  console.log('NAIRALAND AUTONOMOUS 24/7 CYCLE INITIATED');
  console.log('============================================================');

  const ledger = loadLedger();

  // 1. Check if we should post a new topic
  const lastPostTime = ledger.threads && ledger.threads.length > 0 
    ? new Date(ledger.threads[0].postedAt).getTime() 
    : 0;
  const hoursSinceLastPost = (Date.now() - lastPostTime) / (1000 * 60 * 60);

  console.log(`Hours since last published topic: ${hoursSinceLastPost.toFixed(1)}h`);

  if (hoursSinceLastPost >= 12 || !ledger.threads || ledger.threads.length === 0) {
    const postedKeys = (ledger.threads || []).map(t => t.campaignKey);
    const catalogKeys = Object.keys(CAMPAIGN_CATALOG);
    
    // Pick the first unposted campaign
    let nextCampaignKey = catalogKeys.find(k => !postedKeys.includes(k));
    if (!nextCampaignKey) {
      nextCampaignKey = catalogKeys[Math.floor(Math.random() * catalogKeys.length)];
    }

    console.log(`🚀 Scheduling new topic publication: [${nextCampaignKey}]...`);
    try {
      await postCampaign(nextCampaignKey);
    } catch (err) {
      console.warn(`Could not post campaign ${nextCampaignKey}:`, err.message);
    }
  } else {
    console.log(`⏳ Topic publication paused: Last post was ${hoursSinceLastPost.toFixed(1)}h ago (Required cadence: >=12h to protect account).`);
  }

  // 2. Run Bumper on all active threads
  console.log('\nChecking active threads for autonomous bumps...');
  await bumpAndReplyToThreads();
  console.log('============================================================\n');
}

// CLI Command Dispatcher
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || '--status';

  if (command === '--auto-cycle' || command === '--cycle') {
    await runAutonomousCycle();
  } else if (command === '--interactive-login') {
    await setupInteractiveSession();
  } else if (command === '--login') {
    const userArg = args.find(a => a.startsWith('--user=') || a.startsWith('--username='));
    const passArg = args.find(a => a.startsWith('--pass=') || a.startsWith('--password='));
    const username = userArg ? userArg.split('=')[1] : process.env.NAIRALAND_USERNAME;
    const password = passArg ? passArg.split('=')[1] : process.env.NAIRALAND_PASSWORD;
    if (username && password) {
      await loginWithCredentials(username, password, false);
    } else {
      await setupInteractiveSession();
    }
  } else if (command === '--post') {
    const campaignArg = args.find(a => a.startsWith('--campaign='));
    const campaignKey = campaignArg ? campaignArg.split('=')[1] : 'solar-boq';
    await postCampaign(campaignKey);
  } else if (command === '--bump' || command === '--monitor') {
    await bumpAndReplyToThreads();
  } else if (command === '--status') {
    const status = getStatus();
    console.log('\n============================================================');
    console.log('BETHELMIND NAIRALAND AUTONOMOUS ENGINE STATUS');
    console.log('============================================================');
    console.log('Authenticated Session:', status.authenticated ? `🟢 Active (${status.username})` : '🔴 Not Connected (Run --interactive-login)');
    console.log('Total Published Threads:', status.ledgerStats.totalPosted || 0);
    console.log('Total Thread Bumps Dispatched:', status.ledgerStats.totalBumps || 0);
    console.log('Available Campaigns:', status.catalog.join(', '));
    if (status.recentThreads.length > 0) {
      console.log('\nRecent Threads:');
      status.recentThreads.forEach((t, i) => {
        console.log(`  ${i + 1}. [${t.boardName}] ${t.title} (${t.url})`);
      });
    }
    console.log('============================================================\n');
  } else {
    console.log(`
Usage:
  node scripts/nairaland_autonomous_engine.js --status
  node scripts/nairaland_autonomous_engine.js --interactive-login
  node scripts/nairaland_autonomous_engine.js --login --user=USERNAME --pass=PASSWORD
  node scripts/nairaland_autonomous_engine.js --post --campaign=solar-boq
  node scripts/nairaland_autonomous_engine.js --post --campaign=tokunbo-duty
  node scripts/nairaland_autonomous_engine.js --bump
`);
  }
}

if (require.main === module) {
  main().catch(err => {
    console.error('Engine error:', err);
    process.exit(1);
  });
}

module.exports = {
  runAutonomousCycle,
  createStealthBrowser,
  setupInteractiveSession,
  loginWithCredentials,
  postCampaign,
  bumpAndReplyToThreads,
  getStatus,
  CAMPAIGN_CATALOG
};
