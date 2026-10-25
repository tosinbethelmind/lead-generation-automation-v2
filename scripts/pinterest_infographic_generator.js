const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'pins');

const PIN_TEMPLATES = [
  {
    id: 'tokunbo-vin-pin',
    title: '2026 NCS TOKUNBO CUSTOMS DUTY & VIN FORMULA',
    subtitle: 'Tin Can & PTML Lagos Port Clearance Sheet',
    accentColor: '#10b981', // emerald
    stats: [
      { label: 'Import Duty', val: '20% CIF Valuation' },
      { label: 'NAC Levy', val: '15% Surcharge' },
      { label: 'Statutory VAT', val: '7.5% Assessed' },
      { label: 'Terminal Surcharge', val: '₦280k – ₦380k' },
    ],
    bullets: [
      'Stop paying roadside clearance markup traps',
      'Verify 17-digit VIN flood & salvage history free',
      'Instant NCS single-sheet CIF calculation',
      'Official stamped PDF certificate via Selar'
    ],
    cta: 'Test Free at bethelmindanalytics.com/vin',
    targetUrl: 'https://www.bethelmindanalytics.com/vin'
  },
  {
    id: 'p2p-arbitrage-pin',
    title: 'BINANCE P2P VS BYBIT DOLLAR SPREAD MATRIX',
    subtitle: 'Daily Capital Rotation & Merchant Risk Blueprint (2026)',
    accentColor: '#f59e0b', // amber
    stats: [
      { label: 'Live Desk Spread', val: '₦15 – ₦45 / USDT' },
      { label: '$1,000 Rotation Net', val: '₦22,000 / cycle' },
      { label: '3x Daily Rotation', val: '₦66,000 / day' },
      { label: 'Risk Window', val: 'Sub-4 Min Settlement' },
    ],
    bullets: [
      'Quantitative orderbook price fragmentation tracking',
      'Zero-risk capital turnover across verified desks',
      'Dedicated Moniepoint/OPay merchant tags',
      '24/7 Telegram spread alerts @BethelmindAsistantBot'
    ],
    cta: 'Track Live at bethelmindanalytics.com/arbitrage',
    targetUrl: 'https://www.bethelmindanalytics.com/arbitrage'
  },
  {
    id: 'solar-boq-pin',
    title: '5kVA HYBRID SOLAR VS ₦1,250 DIESEL MATRIX',
    subtitle: 'Audited Lagos Payback & Lithium Sizing Sheet',
    accentColor: '#3b82f6', // blue
    stats: [
      { label: 'DisCo Band A Tariff', val: '₦209.50 / kWh' },
      { label: 'Monthly Diesel Displaced', val: '₦312,500 / month' },
      { label: 'LiFePO4 Battery Bank', val: '10 kWh (51.2V)' },
      { label: 'Full Payback Runway', val: '14 to 16 Months' },
    ],
    bullets: [
      'Stop overpaying uncertified solar technicians',
      'Exact appliance load & inverter sizing sizer',
      'Free 2026 Alaba Trade Fair wholesale directory',
      'Moniepoint/OPay transfer proof setup'
    ],
    cta: 'Size System at bethelmindanalytics.com/tools/solar-boq',
    targetUrl: 'https://www.bethelmindanalytics.com/tools/solar-boq'
  },
  {
    id: 'fake-alert-pin',
    title: 'RETAIL FAKE ALERT & THEFT SHIELD (LAGOS)',
    subtitle: 'Sub-2.5s Automated Webhook Reconciliation',
    accentColor: '#8b5cf6', // purple
    stats: [
      { label: 'Webhook Speed', val: '< 2.5 Seconds' },
      { label: 'Weekend Fraud Drop', val: '100% Guaranteed' },
      { label: 'Cashier Terminal', val: 'Mobile Browser / Tablet' },
      { label: 'Go-Live Activation', val: '₦35k / 24 Hours' },
    ],
    bullets: [
      'Stop trusting fake SMS and customer phone screenshots',
      'Instant Moniepoint/Paystack server-to-server verification',
      '24/7 WhatsApp customer digital receipt dispatch',
      'Multi-branch cashier ledger theft prevention'
    ],
    cta: 'Test Live at bethelmindanalytics.com/tools/retail-catalog',
    targetUrl: 'https://www.bethelmindanalytics.com/tools/retail-catalog'
  }
];

function generateHtml(pin) {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
  body { width: 1000px; height: 1500px; background: #0b0f19; color: #f8fafc; padding: 60px; display: flex; flex-direction: column; justify-content: space-between; }
  .badge { align-self: flex-start; background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.15); padding: 12px 24px; border-radius: 9999px; font-size: 18px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: ${pin.accentColor}; }
  .header { margin-top: 30px; }
  .title { font-size: 54px; font-weight: 900; line-height: 1.15; letter-spacing: -1px; text-transform: uppercase; color: #ffffff; }
  .subtitle { font-size: 24px; font-weight: 600; color: #94a3b8; margin-top: 15px; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 40px; }
  .card { background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 20px; padding: 30px 24px; }
  .card-val { font-size: 34px; font-weight: 800; color: ${pin.accentColor}; }
  .card-lbl { font-size: 16px; font-weight: 600; color: #94a3b8; margin-top: 8px; text-transform: uppercase; letter-spacing: 1px; }
  .bullets-box { background: rgba(255, 255, 255, 0.02); border-left: 6px solid ${pin.accentColor}; padding: 30px; border-radius: 12px; margin-top: 40px; }
  .bullet-item { display: flex; align-items: center; font-size: 22px; font-weight: 600; color: #e2e8f0; margin-bottom: 16px; }
  .bullet-item:last-child { margin-bottom: 0; }
  .bullet-dot { color: ${pin.accentColor}; font-size: 28px; margin-right: 14px; }
  .footer { margin-top: 40px; background: ${pin.accentColor}; color: #0b0f19; padding: 32px 40px; border-radius: 24px; display: flex; justify-content: space-between; align-items: center; }
  .footer-cta { font-size: 26px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px; }
  .footer-sub { font-size: 16px; font-weight: 700; opacity: 0.85; margin-top: 4px; }
  .brand { font-size: 18px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; text-align: center; margin-top: 20px; color: #64748b; }
</style>
</head>
<body>
  <div>
    <div class="badge">Bethelmind Analytics • Free 2026 Engine</div>
    <div class="header">
      <h1 class="title">${pin.title}</h1>
      <p class="subtitle">${pin.subtitle}</p>
    </div>
    <div class="grid">
      ${pin.stats.map(s => `
        <div class="card">
          <div class="card-val">${s.val}</div>
          <div class="card-lbl">${s.label}</div>
        </div>
      `).join('')}
    </div>
    <div class="bullets-box">
      ${pin.bullets.map(b => `
        <div class="bullet-item"><span class="bullet-dot">✓</span> ${b}</div>
      `).join('')}
    </div>
  </div>
  <div>
    <div class="footer">
      <div>
        <div class="footer-cta">${pin.cta}</div>
        <div class="footer-sub">Instant Web Calculation • Zero Registration Barrier</div>
      </div>
      <div style="font-size: 40px;">👉</div>
    </div>
    <div class="brand">Bethelmind Digital Solutions (CAC RC 7034297) • Lagos Desk: 0802 279 1227</div>
  </div>
</body>
</html>`;
}

async function renderPins() {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`[PINTEREST GENERATOR] Rendering ${PIN_TEMPLATES.length} High-Resolution Pins (1000x1500)...`);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1000, height: 1500 } });

  const manifest = [];

  for (const pin of PIN_TEMPLATES) {
    const html = generateHtml(pin);
    await page.setContent(html, { waitUntil: 'networkidle' });
    const filePath = path.join(OUTPUT_DIR, `${pin.id}.png`);
    await page.screenshot({ path: filePath, type: 'png' });
    console.log(`✓ Rendered: ${pin.id}.png (${filePath})`);
    manifest.push({
      id: pin.id,
      title: pin.title,
      description: `${pin.title} - ${pin.subtitle}. ${pin.bullets.join('. ')}. Tested live on Bethelmind Analytics.`,
      targetUrl: pin.targetUrl,
      imagePath: filePath,
      relativeUrl: `/pins/${pin.id}.png`
    });
  }

  await browser.close();
  const manifestPath = path.join(OUTPUT_DIR, 'pins_manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  console.log(`✓ Pin manifest saved to: ${manifestPath}`);
  return manifest;
}

if (require.main === module) {
  renderPins().catch(console.error);
}

module.exports = { renderPins, PIN_TEMPLATES };
