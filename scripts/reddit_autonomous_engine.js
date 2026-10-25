/**
 * 🇳🇬 Bethelmind Digital Solutions - Reddit Autonomous Distribution Engine
 * RC 7034297 • 24/7 Multi-Subreddit Educational Marketing & Lead Generation
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const SESSION_FILE = path.join(__dirname, '..', 'local_db', 'reddit_session.json');
const LEDGER_FILE = path.join(__dirname, '..', 'local_db', 'reddit_campaigns.json');

const REDDIT_CAMPAIGNS = {
  'tokunbo-vin': {
    targetSubreddits: ['Nigeria', 'Lagos', 'UsedCars'],
    title: 'The Real 2026 NCS Tokunbo Customs Duty Formula (20% Duty + 15% NAC Levy) and Flood Salvage Traps at Lagos Ports',
    body: `Fellow Nigerians & Car Buyers,

With standard Tokunbo vehicles (Lexus RX350, Toyota Corolla, Camry, Honda Accord) trading between **₦14,000,000 to ₦26,000,000** in Lagos dealerships, clearing agents and buyers frequently lose millions due to undisclosed valuation rules and hidden auction salvage history.

Here is the exact statutory Nigerian Customs Service (NCS) duty calculation sheet:

### 1. Statutory Import Duty Formula
* **Statutory Import Duty:** Exactly 20% of the assessed CIF (Cost, Insurance & Freight) valuation.
* **National Automotive Council (NAC) Levy:** 15% surcharge on CIF.
* **Statutory VAT:** 7.5% assessed on (CIF + Duty + NAC).
* **Port Terminal & Dwell Charges (PTML / Tin Can):** Approx ₦280,000 – ₦380,000 depending on shipping line dwell days.
* **Example (2018 Lexus RX350 assessed @ ₦18.5m CIF):**
  * Duty: ₦3,700,000
  * NAC (15%): ₦2,775,000
  * VAT & Terminal Surcharges: ~₦1,775,000
  * **Total Port Landing Clearance: ~₦8,250,000**

### 2. The 3 Hidden Traps in Nigerian Dealerships
1. **Salt-Water Flood Submersion:** Over 35% of auction cars shipped from Texas/Florida hurricanes have submerged electrical harnesses that rot within 90 days.
2. **Odometer Rollback:** Clocks wound back from 180k miles to 65k miles before container shipping.
3. **Missing Catalytic Converters:** Exhaust platinum catalysts stolen prior to discharge.

### Free Verification Resources:
* **Instant Free VIN Decoder & NCS Duty Calculator:** [bethelmindanalytics.com/vin](https://www.bethelmindanalytics.com/vin)
* **24/7 Telegram Master Bot:** Search **@BethelmindAsistantBot** on Telegram (Send \`/vin <your_vin>\` for instant factory specs & recall check).
* **Official Stamped PDF Valuation Certificate:** ₦2,500 via Card/OPay on [Selar](https://selar.com/showlove/bethelmind?amount=2500).
* **WhatsApp Consultation Desk:** Direct desk at **0802 279 1227** ([WhatsApp Link](https://wa.me/2348022791227?text=Please%20send%20me%20the%20NCS%20Customs%20Valuation%20Sheet)).

Drop any car year and model below if you want an estimated statutory customs duty breakdown!`
  },

  'p2p-arbitrage': {
    targetSubreddits: ['Nigeria', 'CryptoCurrency', 'arbitrage'],
    title: 'How Quantitative P2P Dollar Arbitrage Works in Nigeria (Binance P2P vs Bybit ₦15–₦45/$ Spread Matrix)',
    body: `To crypto merchants, P2P vendors, and digital operators in Nigeria,

Because of market fragmentation between major international orderbooks (Binance P2P, Bybit, KuCoin) and domestic bank settlement desks, daily price spreads between **₦15 to ₦50 per USDT** exist continuously.

### The Mechanics of Legitimate Capital Turnover:
1. **Gross Cross-Desk Spread:**
   * Binance P2P maker buy orders clear around ₦1,485/$
   * Bybit merchant taker sell orders clear around ₦1,510/$
   * Gross Spread: **₦25/USDT**
2. **Capital Rotation Math:**
   * Capital: $1,000 (Approx ₦1,485,000)
   * Net profit per completed rotation (after 0.15% merchant fee): **₦22,000**
   * Executing 3 rotations daily = **₦66,000 net profit / day**
3. **Critical Account Safety Invariants:**
   * Trade strictly with 98%+ completion merchants to prevent 3rd-party fraudulent bank transfer flags.
   * Utilize dedicated corporate merchant accounts (OPay, Moniepoint, Kuda) with neutral commercial remark tags.
   * Zero holding risk: Sub-4 minute USDT/NGN conversion cycles.

### Live Free Spread Tracking & Signals:
* **Live Web Desk & Profit Calculator:** [bethelmindanalytics.com/arbitrage](https://www.bethelmindanalytics.com/arbitrage)
* **24/7 Live Spread Telegram Bot:** **@BethelmindAsistantBot** (Commands: \`/rates\`, \`/calc <usd>\`)
* **VIP Automated Telegram Alerts:** ₦3,500/month on [Selar](https://selar.com/showlove/bethelmind?amount=3500)
* **WhatsApp Assistance:** **0802 279 1227** ([WhatsApp Link](https://wa.me/2348022791227?text=Please%20send%20me%20the%20P2P%20Arbitrage%20Safety%20Guide))

Share your thoughts or current desk spreads in the comments below!`
  },

  'solar-boq': {
    targetSubreddits: ['Nigeria', 'solar', 'RenewableEnergy'],
    title: 'Audited 5kVA Solar Sizing vs ₦1,250 Diesel in Lagos: Exact LiFePO4 & Hybrid Inverter Payback Matrix',
    body: `With diesel and petrol averaging **₦1,250 to ₦1,350/L** and DisCo Band A tariffs at **₦209.50/kWh**, running residential generators in Nigeria has become economically disastrous.

Here is an audited engineering cost matrix for a standard 5kVA hybrid setup:

### System Sizing & Cost:
* **Inverter:** 5.0 kVA Pure Sine Wave Hybrid Inverter
* **Storage:** 10 kWh 51.2V LiFePO4 Lithium Battery (Tier-1 CATL/EVE cells)
* **Solar PV:** 8x 550W Monocrystalline Half-Cell Panels (4.4 kWp array)
* **Monthly Diesel Displaced:** ~250 Liters/month (**approx ₦312,500/month saved**)
* **Procurement & Surge Protection:** ~₦4,800,000 total capital outlay
* **Payback Runway:** **14 to 16 Months** (After month 16, electricity is virtually 100% free for 10+ years)

### Free Solar Sizing Tools:
* **Interactive Load Calculator:** [bethelmindanalytics.com/tools/solar-boq](https://www.bethelmindanalytics.com/tools/solar-boq)
* **WhatsApp Engineering Desk:** **0802 279 1227** ([WhatsApp Link](https://wa.me/2348022791227?text=Please%20send%20me%20the%202026%20Alaba%20Solar%20Wholesale%20Directory))
* **24/7 Telegram Assistant:** **@BethelmindAsistantBot**

Drop your monthly power consumption or generator fuel bill below for custom sizing!`
  }
};

function loadLedger() {
  if (fs.existsSync(LEDGER_FILE)) {
    try { return JSON.parse(fs.readFileSync(LEDGER_FILE, 'utf8')); } catch {}
  }
  return { posts: [], stats: { totalPosts: 0 } };
}

function saveLedger(ledger) {
  const dir = path.dirname(LEDGER_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(LEDGER_FILE, JSON.stringify(ledger, null, 2), 'utf8');
}

async function postToReddit(campaignKey = 'tokunbo-vin', subreddit = 'Nigeria') {
  const campaign = REDDIT_CAMPAIGNS[campaignKey];
  if (!campaign) throw new Error(`Unknown campaign: ${campaignKey}`);

  console.log(`\n[REDDIT ENGINE] Preparing post for campaign [${campaignKey}] on r/${subreddit}...`);
  const ledger = loadLedger();

  // Record staged/posted entry
  const record = {
    id: `reddit_${Date.now()}`,
    campaignKey,
    subreddit,
    title: campaign.title,
    body: campaign.body,
    createdAt: new Date().toISOString(),
    status: fs.existsSync(SESSION_FILE) ? 'ready_to_dispatch' : 'staged_session_pending',
    targetUrl: campaignKey === 'tokunbo-vin' ? 'https://www.bethelmindanalytics.com/vin' : 'https://www.bethelmindanalytics.com/arbitrage'
  };

  ledger.posts.unshift(record);
  ledger.stats.totalPosts = (ledger.stats.totalPosts || 0) + 1;
  saveLedger(ledger);
  console.log(`✓ Campaign [${campaignKey}] logged to Reddit ledger (Total posts tracked: ${ledger.stats.totalPosts})`);
  return record;
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const campaign = args[0] || 'tokunbo-vin';
  const sub = args[1] || 'Nigeria';
  postToReddit(campaign, sub).catch(console.error);
}

module.exports = { postToReddit, REDDIT_CAMPAIGNS };
