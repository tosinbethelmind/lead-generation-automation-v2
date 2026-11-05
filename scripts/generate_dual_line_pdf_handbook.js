/**
 * @file scripts/generate_dual_line_pdf_handbook.js
 * 
 * Generates the official Dual-Line (Sachet & Bottled Water / Dispenser Jars)
 * PDF Operating Manual for Mr. Obi and saves it in:
 * 1. factory_delivery_pack/OBI_TABLE_WATER_COMPLETE_OPERATING_MANUAL.pdf
 * 2. public/downloads/obi_table_water_complete_handbook.pdf
 * 
 * Hardened Security & Anti-Theft Additions:
 * - Server-Side Constant-Time PIN Authentication & Rate Limiting
 * - Offline-First Persistence Ledger (Zero data loss across NEPA cuts / reloads)
 * - PET Preform Grammage Scrap Scale Verification (18g/pc crushed plastic check)
 * - Moniepoint POS Transfer Reference (RRN) Lock & Gate Clearance Pass
 * - 19L Dispenser Jar Quality Inspection & Battered Jar Liability (₦4,500 penalty)
 */

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

async function generateHandbook() {
  console.log('📄 Rendering Upgraded Dual-Line Operating Manual PDF...');

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Obi Table Water OS — Dual-Line Operating Manual & Security Standard</title>
  <style>
    @page {
      size: A4;
      margin: 18mm 14mm 18mm 14mm;
      @bottom-right {
        content: counter(page);
        font-size: 8.5pt;
        color: #64748b;
      }
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      line-height: 1.45;
      font-size: 10pt;
      background: #ffffff;
      margin: 0;
      padding: 0;
    }
    .header {
      border-bottom: 2px solid #0284c7;
      padding-bottom: 10px;
      margin-bottom: 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .header-logo {
      font-size: 15pt;
      font-weight: 900;
      color: #0369a1;
      letter-spacing: -0.5px;
    }
    .header-meta {
      font-size: 8pt;
      color: #64748b;
      text-align: right;
    }
    h1 {
      font-size: 18pt;
      font-weight: 900;
      color: #0f172a;
      line-height: 1.2;
      margin: 0 0 6px 0;
    }
    .subtitle {
      font-size: 11pt;
      color: #0369a1;
      font-weight: 700;
      margin-bottom: 16px;
    }
    .badge {
      display: inline-block;
      background: #e0f2fe;
      color: #0369a1;
      font-size: 7.5pt;
      font-weight: 800;
      padding: 2px 7px;
      border-radius: 4px;
      border: 1px solid #bae6fd;
      text-transform: uppercase;
      margin-bottom: 12px;
    }
    h2 {
      font-size: 12pt;
      font-weight: 800;
      color: #0f172a;
      border-bottom: 1.5px solid #e2e8f0;
      padding-bottom: 4px;
      margin-top: 20px;
      margin-bottom: 8px;
    }
    h3 {
      font-size: 10.5pt;
      font-weight: 700;
      color: #1e293b;
      margin-top: 12px;
      margin-bottom: 5px;
    }
    p {
      margin: 0 0 8px 0;
      color: #334155;
    }
    .callout {
      background: #f8fafc;
      border-left: 4px solid #0284c7;
      padding: 9px 12px;
      margin: 12px 0;
      border-radius: 0 6px 6px 0;
      font-size: 9pt;
    }
    .callout-warning {
      background: #fffbeb;
      border-left: 4px solid #f59e0b;
      color: #92400e;
    }
    .callout-danger {
      background: #fef2f2;
      border-left: 4px solid #ef4444;
      color: #991b1b;
    }
    .callout-success {
      background: #f0fdf4;
      border-left: 4px solid #16a34a;
      color: #166534;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 10px 0 14px 0;
      font-size: 8.5pt;
    }
    th, td {
      border: 1px solid #cbd5e1;
      padding: 6px 8px;
      text-align: left;
    }
    th {
      background: #f1f5f9;
      color: #0f172a;
      font-weight: 700;
    }
    .highlight {
      font-weight: 700;
      color: #0369a1;
    }
    .role-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin: 12px 0;
    }
    .role-card {
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 10px;
      background: #ffffff;
    }
    .role-title {
      font-weight: 800;
      font-size: 10pt;
      color: #0f172a;
      margin-bottom: 2px;
    }
    .role-pin {
      display: inline-block;
      background: #fef3c7;
      color: #92400e;
      font-weight: 800;
      font-size: 7.5pt;
      padding: 2px 5px;
      border-radius: 4px;
      border: 1px solid #fde68a;
      margin-bottom: 6px;
    }
    .page-break {
      page-break-before: always;
    }
    .footer-note {
      font-size: 7.5pt;
      color: #94a3b8;
      text-align: center;
      margin-top: 24px;
      border-top: 1px solid #e2e8f0;
      padding-top: 8px;
    }
  </style>
</head>
<body>

  <!-- PAGE 1: TITLE & EXECUTIVE SUMMARY -->
  <div class="header">
    <div class="header-logo">💧 OBI TABLE WATER OS</div>
    <div class="header-meta">
      Dual-Line Production Edition (Sachets + Bottled Water + 19L Dispenser Jars)<br/>
      Certified: Bethelmind Digital Solutions (CAC: 9912717)
    </div>
  </div>

  <span class="badge">Official Factory Manual • November 2026 Edition</span>
  <h1>Complete Operational, Financial &amp; Anti-Theft Handbook</h1>
  <div class="subtitle">The Mobile-First Operating System for Nigerian Dual-Line Water Plants</div>

  <div class="callout callout-success">
    <strong>Executive Guarantee to Mr. Obi:</strong> Know your exact net cash profit from both your Sachet Line and Bottled Water Line before 8:00 PM every evening. Eliminate preform smuggling with digital scale audits, stop driver theft with physical pouches &amp; jar deposits, prevent fake bank transfers with POS RRN locks, and survive power outages with offline-first data caching.
  </div>

  <h2>1. Dual-Line Plant Economics &amp; Pricing Architecture</h2>
  <p>Nigerian water factories operating both sachet pure water and automated PET bottle blow-molding achieve 3.4x higher gross margins than sachet-only plants:</p>

  <table>
    <thead>
      <tr>
        <th>Production Line</th>
        <th>Product Unit</th>
        <th>Wholesale Price</th>
        <th>Unit Margin</th>
        <th>Primary Money Leak / Fraud Vulnerability</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Line 1: Sachet Pure Water</strong></td>
        <td>Bag of 20 Sachets</td>
        <td>₦350 wholesale</td>
        <td>₦25 – ₦40</td>
        <td>Drivers claiming road bursts without returning physical pouches; unrecorded machine rolls.</td>
      </tr>
      <tr>
        <td><strong>Line 2: 75cl Bottled Water</strong></td>
        <td>Pack of 12 Bottles</td>
        <td>₦1,200 wholesale</td>
        <td>₦220 – ₦320</td>
        <td>PET preforms reported as "blown rejects" and smuggled out for cosmetic packagers.</td>
      </tr>
      <tr>
        <td><strong>Line 2: 50cl Bottled Water</strong></td>
        <td>Pack of 20 Bottles</td>
        <td>₦1,100 wholesale</td>
        <td>₦200 – ₦280</td>
        <td>Blow molding heat rejects; unrecorded cashier gate sales pocketed as cash.</td>
      </tr>
      <tr>
        <td><strong>Line 2: 19L Dispenser Jars</strong></td>
        <td>19-Liter Refill</td>
        <td>₦900 refill</td>
        <td>₦450 – ₦600</td>
        <td><strong>Unreturned or battered empty jars!</strong> Jars cost ₦4,500 – ₦6,000. Driver brings back off-brand cracked jars.</td>
      </tr>
    </tbody>
  </table>

  <h2>2. Today's Dual-Line Daily Financial Audit (Sample Full Shift)</h2>
  <table>
    <thead>
      <tr>
        <th>Revenue Source</th>
        <th>Dispatched Volume</th>
        <th>Unit Price</th>
        <th>Gross Revenue</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Sachet Water Line</td>
        <td>4,200 Bags (14 Nylon Rolls used)</td>
        <td>₦350 / bag</td>
        <td>₦1,470,000</td>
      </tr>
      <tr>
        <td>75cl Bottled Water Line</td>
        <td>200 Shrink Packs (12s)</td>
        <td>₦1,200 / pack</td>
        <td>₦240,000</td>
      </tr>
      <tr>
        <td>50cl Bottled Water Line</td>
        <td>150 Shrink Packs (20s)</td>
        <td>₦1,100 / pack</td>
        <td>₦165,000</td>
      </tr>
      <tr>
        <td>19L Dispenser Jar Refills</td>
        <td>106 Jars Refilled</td>
        <td>₦900 / refill</td>
        <td>₦96,000</td>
      </tr>
      <tr style="background:#f1f5f9; font-weight:800;">
        <td colspan="3">TOTAL SHIFT GROSS FACTORY REVENUE</td>
        <td style="color:#0369a1;">₦1,971,000</td>
      </tr>
    </tbody>
  </table>

  <h3>Shift Direct OPEX Breakdown</h3>
  <ul>
    <li><strong>Generator Diesel Overhead:</strong> 32 Liters @ ₦1,350/L = <strong>₦43,200</strong> (Sachet energy overhead = ₦8.20/bag).</li>
    <li><strong>Sachet Nylon Film:</strong> 14 Rolls (280 kg LDPE) = <strong>₦280,000</strong>.</li>
    <li><strong>PET Preforms &amp; Caps:</strong> 5,400 units + 24 blow rejects = <strong>₦95,600</strong>.</li>
    <li><strong>Shrink Wrap Film &amp; Labels:</strong> 350 packs = <strong>₦28,000</strong>.</li>
    <li><strong>Factory Loaders &amp; Packers Wages:</strong> ₦50,000.</li>
    <li><strong>Driver Commissions &amp; Fuel Allowance:</strong> ₦50,000.</li>
  </ul>

  <div class="callout callout-success" style="font-size: 10.5pt; font-weight: 700;">
    💰 TODAY'S NET CASH PROFIT: ₦524,200  
    <div style="font-size: 8pt; font-weight: normal; color: #166534; margin-top: 2px;">
      Physical Cash in Blessing's Drawer: ₦385,000 • Verified Moniepoint Transfers (RRN Locked): ₦1,485,000 • Distributor Credit: ₦65,000.
    </div>
  </div>

  <div class="page-break"></div>

  <!-- PAGE 2: 4-ROLE ZERO-PASSWORD WORKFLOW & SECURITY ARCHITECTURE -->
  <div class="header">
    <div class="header-logo">💧 OBI TABLE WATER OS</div>
    <div class="header-meta">Dual-Line Production Edition • Security &amp; Anti-Theft Protocol</div>
  </div>

  <h2>3. The 4 Zero-Password Staff Roles</h2>
  <p>Factory staff do not use complex emails or passwords. They tap their picture card and enter their 4-digit PIN:</p>

  <div class="role-grid">
    <div class="role-card">
      <div class="role-title">👑 Mr. Obi (Managing Director &amp; Owner)</div>
      <span class="role-pin">PIN: 2026</span>
      <p style="font-size: 8pt;">Access from phone home screen. Audits net cash profit, driver short debits, diesel cost per bag, preform grammage scale audits, and 1-tap WhatsApp evening digest.</p>
    </div>

    <div class="role-card">
      <div class="role-title">📋 Kenneth (Dual-Line Supervisor)</div>
      <span class="role-pin">PIN: 1111</span>
      <p style="font-size: 8pt;">Taps "+1 Roll Used" for sachets, logs bottle preforms and blow rejects, verifies scrap scale weight, and dispatches WhatsApp shift close at 6:00 PM.</p>
    </div>

    <div class="role-card">
      <div class="role-title">💰 Blessing (Gate Cashier)</div>
      <span class="role-pin">PIN: 2222</span>
      <p style="font-size: 8pt;">Sells sachets, 75cl, 50cl packs, and 19L refills. Logs POS RRN last 4 digits to generate a 3-digit Gate Clearance Pass (GP-xxx) for gate security.</p>
    </div>

    <div class="role-card">
      <div class="role-title">🚚 Musa (Route Driver)</div>
      <span class="role-pin">PIN: 3333</span>
      <p style="font-size: 8pt;">Inspects loaded truck manifest, delivers to depots, returns burst plastic pouches, and collects ₦4,500 deposit for unreturned or battered 19L jars.</p>
    </div>
  </div>

  <h2>4. The 5 Hardened Security &amp; Anti-Theft Protocols</h2>

  <h3>1. Server-Side Constant-Time PIN Authentication</h3>
  <div class="callout callout-warning">
    <strong>Zero Client-Side PIN Inspection:</strong> PINs are no longer checked inside client browser JavaScript where tech-savvy workers could view devtools. PIN verification routes through <code>/api/factory/auth</code> using constant-time byte comparison and a 5-attempt brute-force rate limiter that locks the terminal for 15 minutes upon repeated failures.
  </div>

  <h3>2. Offline-First Persistence Ledger (Zero Data Loss)</h3>
  <p>In Nigeria, factory phones run out of battery, browsers are accidentally closed, and NEPA drops without notice. The <code>offlineLedger</code> automatically caches all rolls, bottle packs, dispenser jars, cashier cash counts, and driver manifests to device LocalStorage with every touch. Reloading restores the shift state instantly.</p>

  <h3>3. PET Preform Grammage Scrap Scale Verification</h3>
  <div class="callout callout-danger">
    <strong>Stopping Preform Smuggling:</strong> A standard 75cl PET preform weighs 18.0 grams. When operators claim 24 bottles were ruined during blow-molding, Kenneth must place the crushed plastic scrap on a physical digital scale:
    <div style="margin-top: 4px; font-weight: bold; color: #991b1b;">
      24 Rejects &times; 18.0g = 432 grams target scrap weight.
    </div>
    If the scale weighs 200g, 232g of preforms (13 preforms) were smuggled out to cosmetics or juice packagers. The system displays a red deficit alert until verified.
  </div>

  <h3>4. Moniepoint POS Transfer Reference (RRN) Lock &amp; Gate Pass</h3>
  <div class="callout callout-warning">
    <strong>Stopping Fake Bank Alerts:</strong> Cashiers can no longer mark an order as "Transfer" and pocket physical cash. For every bank transfer sale, Blessing must type the last 4 digits of the Moniepoint POS Terminal Reference (RRN). The software immediately prints a 3-digit Gate Clearance Pass (e.g. <code>GP-842</code>). Factory gate security will not open the exit boom gate without this code.
  </div>

  <h3>5. 19L Dispenser Jar Quality Inspection &amp; Battered Jar Liability</h3>
  <p>A new 19L polycarbonate dispenser jar costs ₦4,500 – ₦6,000. Drivers often deliver new Obi-branded jars and return cracked or off-brand competitor containers. Under the new protocol, gate loaders inspect returned empty jars:</p>
  <ul>
    <li>Clean Obi Branded Jars: Accepted and credited.</li>
    <li>Battered / Cracked / Third-Party Jars: Rejected at gate. <strong>₦4,500 replacement penalty</strong> is automatically debited from the driver's payout ledger.</li>
  </ul>

  <h2>5. NAFDAC Laboratory Quality Log (NIS 306:2008 Standard)</h2>
  <table>
    <thead>
      <tr>
        <th>Test Parameter</th>
        <th>NAFDAC Standard</th>
        <th>Obi Factory Safe Range</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Total Dissolved Solids (TDS)</strong></td>
        <td>&lt; 100 ppm</td>
        <td>15 – 45 ppm (Pure Permeate)</td>
        <td>✅ Pass (24 ppm)</td>
      </tr>
      <tr>
        <td><strong>Water pH Level</strong></td>
        <td>6.5 – 7.5</td>
        <td>6.8 – 7.4 (Neutral)</td>
        <td>✅ Pass (7.2 pH)</td>
      </tr>
      <tr>
        <td><strong>UV Sterilizer Lamp Hours</strong></td>
        <td>&lt; 8,000 hrs</td>
        <td>Active Lamp Lifetime</td>
        <td>✅ 2,140 hrs (Safe)</td>
      </tr>
      <tr>
        <td><strong>Physical Taste &amp; Clarity</strong></td>
        <td>Odorless, Crystal Clear</td>
        <td>100% Inspection</td>
        <td>✅ Verified Pure</td>
      </tr>
    </tbody>
  </table>

  <h2>6. Technical Support &amp; Factory Contact</h2>
  <div class="callout">
    <strong>Bethelmind Digital Solutions</strong> (CAC Certified Enterprise: Reg 9912717)<br/>
    • Admin &amp; Technical Desk Hotline: <strong>0802 279 1227</strong><br/>
    • WhatsApp Support: <strong>wa.me/2348022791227</strong><br/>
    • Corporate Bank Account: <strong>Moniepoint Microfinance Bank (6805375225)</strong>
  </div>

  <div class="footer-note">
    Obi Table Water OS &bull; Dual-Line Production System &bull; &copy; 2026 Bethelmind Digital Solutions
  </div>

</body>
</html>
  `;

  const projectRoot = path.join(__dirname, '..');
  const deliveryDir = path.join(projectRoot, 'factory_delivery_pack');
  const publicDownloadsDir = path.join(projectRoot, 'public', 'downloads');

  if (!fs.existsSync(deliveryDir)) fs.mkdirSync(deliveryDir, { recursive: true });
  if (!fs.existsSync(publicDownloadsDir)) fs.mkdirSync(publicDownloadsDir, { recursive: true });

  const destPdf1 = path.join(deliveryDir, 'OBI_TABLE_WATER_COMPLETE_OPERATING_MANUAL.pdf');
  const destPdf2 = path.join(publicDownloadsDir, 'obi_table_water_complete_handbook.pdf');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'networkidle' });

  await page.pdf({
    path: destPdf1,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '12mm',
      bottom: '12mm',
      left: '10mm',
      right: '10mm'
    }
  });

  // Also copy to public/downloads/
  fs.copyFileSync(destPdf1, destPdf2);

  await browser.close();

  const sizeKb = (fs.statSync(destPdf1).size / 1024).toFixed(1);
  console.log(`✅ Upgraded Dual-Line PDF Manual saved to: ${destPdf1} (${sizeKb} KB)`);
  console.log(`✅ Web copy saved to: ${destPdf2} (${sizeKb} KB)`);
}

generateHandbook().catch(err => {
  console.error('❌ PDF Generation Error:', err);
  process.exit(1);
});
