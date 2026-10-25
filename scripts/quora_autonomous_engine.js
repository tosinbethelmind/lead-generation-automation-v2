/**
 * 🇳🇬 Bethelmind Digital Solutions - Quora High-Authority Q&A Engine
 * RC 7034297 • SEO Search Rank Hijacking & Inbound Lead Acquisition
 */

const path = require('path');
const fs = require('fs');

const LEDGER_FILE = path.join(__dirname, '..', 'local_db', 'quora_campaigns.json');

const QUORA_KNOWLEDGE_BASE = [
  {
    id: 'quora-customs-duty',
    questionKeywords: ['customs duty', 'tokunbo car', 'ptml', 'tin can', 'clearing car in nigeria'],
    questionTitle: 'How is Nigerian Customs Service (NCS) duty calculated on Tokunbo imported cars in 2026?',
    targetQuestionUrl: 'https://www.quora.com/How-is-customs-duty-calculated-on-cars-in-Nigeria',
    answer: `In Nigeria, customs duty on imported used (Tokunbo) vehicles is strictly regulated by the statutory **Common External Tariff (CET)** matrix administered by the Nigerian Customs Service (NCS).

Here is the exact formula applied at Lagos ports (Tin Can Island and PTML):

### 1. The Statutory Clearing Equation
* **Import Duty:** 20% of assessed CIF (Cost, Insurance, and Freight) valuation.
* **National Automotive Council (NAC) Levy:** 15% of CIF.
* **Statutory VAT:** 7.5% assessed on (CIF + Import Duty + NAC).
* **Terminal & Shipping Surcharges (PTML / Grimaldi / TICT):** Approximately ₦280,000 to ₦380,000 depending on container size and dwell time.

### 2. Practical Example: 2018 Lexus RX350
If the NCS single-sheet assessment assigns a CIF benchmark of **₦18,500,000**:
1. Statutory Duty (20%) = ₦3,700,000
2. NAC Levy (15%) = ₦2,775,000
3. VAT & Surcharges = ~₦1,775,000
4. **Total Port Clearance Landing Cost:** **~₦8,250,000**

### 3. Critical Pre-Purchase Safeguards:
Before wiring funds or auction bids to Copart/Manheim, verify whether the car has undisclosed flood submersion or a missing catalytic converter. Over 35% of salvage vehicles shipped to Lagos have rotted wiring harnesses.

* **Free 17-Digit VIN Clearing Calculator & Salvage Auditor:** You can calculate your exact model duty free at [bethelmindanalytics.com/vin](https://www.bethelmindanalytics.com/vin).
* **Telegram Bot:** You can also run instant checks via Telegram on **@BethelmindAsistantBot** (type \`/vin <your_vin>\`).
* **Official Stamped PDF Valuation Certificate:** Available via [Selar](https://selar.com/showlove/bethelmind?amount=2500) for ₦2,500.
* **Lagos Clearing Desk:** For direct customs clearing advisory, contact Bethelmind Digital Solutions on WhatsApp at **0802 279 1227**.`
  },

  {
    id: 'quora-p2p-arbitrage',
    questionKeywords: ['binance p2p', 'crypto arbitrage nigeria', 'bybit usdt', 'make money p2p nigeria'],
    questionTitle: 'Is crypto P2P arbitrage still profitable in Nigeria, and how does it work?',
    targetQuestionUrl: 'https://www.quora.com/Is-crypto-arbitrage-profitable-in-Nigeria',
    answer: `Yes, crypto P2P arbitrage remains consistently profitable in Nigeria because of persistent price fragmentation between international exchange orderbooks (Binance P2P, Bybit, KuCoin) and domestic bank OTC liquidity desks.

### How the Arbitrage Model Works:
1. **The Price Spread:**
   At any given hour, market liquidity differences create a spread between buy and sell desks:
   * Buying USDT via low-limit maker ads on Binance at **₦1,485/$**
   * Selling USDT on Bybit merchant taker orderbooks at **₦1,510/$**
   * Instant gross spread: **+₦25 per USDT**.

2. **The Turnover Math:**
   * Working capital: $1,000 (~₦1,485,000)
   * Net profit after 0.15% merchant transaction fee: **₦22,000 per completed rotation**
   * Executing 3 rotations daily yields **₦66,000 net profit per day**.

3. **Essential Risk Safeguards:**
   * Only transact with merchants possessing a 98%+ completion record to avoid third-party account restriction flags.
   * Use dedicated corporate fintech accounts (OPay, Moniepoint) with neutral commercial remark codes.
   * Avoid holding open crypto positions; execute buy-sell rotations in sub-4 minute windows.

* **Live Real-Time P2P Arbitrage Spread Terminal:** [bethelmindanalytics.com/arbitrage](https://www.bethelmindanalytics.com/arbitrage)
* **24/7 Telegram Spread Alert Feed:** **@BethelmindAsistantBot**
* **VIP High-Spread Desk:** [Selar Subscription (₦3,500/mo)](https://selar.com/showlove/bethelmind?amount=3500)
* **Desk Contact:** WhatsApp **0802 279 1227**.`
  },

  {
    id: 'quora-solar-cost',
    questionKeywords: ['5kva solar cost nigeria', 'solar inverter lagos price', 'diesel generator vs solar'],
    questionTitle: 'How much does a 5kVA solar inverter system cost in Nigeria, and does it save money compared to a generator?',
    targetQuestionUrl: 'https://www.quora.com/How-much-does-a-5kVA-solar-system-cost-in-Nigeria',
    answer: `With diesel prices at **₦1,250 – ₦1,350 per liter** and NERC Band A electricity tariffs at **₦209.50/kWh**, a 5kVA hybrid solar system typically pays for itself in **14 to 16 months**.

### Audited Engineering Procurement (Tier-1 Standard):
* **Inverter:** 5kVA 48V Pure Sine Wave Hybrid Inverter (~₦950k – ₦1.2m)
* **Battery Bank:** 10kWh 51.2V LiFePO4 Lithium Battery (CATL/EVE cells) (~₦2.4m – ₦2.8m)
* **Solar Panels:** 8x 550W Mono Half-Cell Panels (4.4 kWp) (~₦1.1m)
* **Protection & Installation:** AC/DC breakers, lightning surge arrestors, 16mm copper cables (~₦350k)
* **Total Turnkey Capital Outlay:** **~₦4,800,000 – ₦5,400,000**

### Operating Savings:
* Monthly diesel displaced: ~250 Liters = **₦312,500/month in generator fuel savings**.
* After month 16, power generation is effectively free for the remaining 10+ year lifespan of the lithium battery.

* **Test Your Custom Load & DisCo Sizing Free:** [bethelmindanalytics.com/tools/solar-boq](https://www.bethelmindanalytics.com/tools/solar-boq)
* **Direct Alaba Wholesale Sourcing Assistance:** WhatsApp **0802 279 1227** (Bethelmind Digital Solutions, CAC RC 7034297).`
  }
];

function loadLedger() {
  if (fs.existsSync(LEDGER_FILE)) {
    try { return JSON.parse(fs.readFileSync(LEDGER_FILE, 'utf8')); } catch {}
  }
  return { answers: [], stats: { totalAnswers: 0 } };
}

function saveLedger(ledger) {
  const dir = path.dirname(LEDGER_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(LEDGER_FILE, JSON.stringify(ledger, null, 2), 'utf8');
}

function getAnswerForTopic(topicId) {
  return QUORA_KNOWLEDGE_BASE.find(q => q.id === topicId) || QUORA_KNOWLEDGE_BASE[0];
}

async function recordQuoraAnswer(topicId = 'quora-customs-duty', directUrl = null) {
  const item = getAnswerForTopic(topicId);
  const ledger = loadLedger();

  const record = {
    id: `quora_${Date.now()}`,
    topicId: item.id,
    questionTitle: item.questionTitle,
    targetUrl: directUrl || item.targetQuestionUrl,
    answerContent: item.answer,
    stagedAt: new Date().toISOString(),
    status: 'staged_ready'
  };

  ledger.answers.unshift(record);
  ledger.stats.totalAnswers = (ledger.stats.totalAnswers || 0) + 1;
  saveLedger(ledger);
  console.log(`✓ Staged Quora Answer: "${item.questionTitle}" -> Ledger Updated (Total: ${ledger.stats.totalAnswers})`);
  return record;
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const topic = args[0] || 'quora-customs-duty';
  recordQuoraAnswer(topic).catch(console.error);
}

module.exports = { recordQuoraAnswer, QUORA_KNOWLEDGE_BASE, getAnswerForTopic };
