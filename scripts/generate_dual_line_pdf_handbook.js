/**
 * @file scripts/generate_dual_line_pdf_handbook.js
 * 
 * Generates the official Dual-Line (Sachet & Bottled Water / Dispenser Jars)
 * PDF Operating Manual for Mr. Obi and saves it in:
 * 1. factory_delivery_pack/OBI_TABLE_WATER_COMPLETE_OPERATING_MANUAL.pdf
 * 2. public/downloads/obi_table_water_complete_handbook.pdf
 */

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

async function generateHandbook() {
  console.log('📄 Rendering Dual-Line Operating Manual PDF...');

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Obi Table Water OS — Dual-Line Operating Manual</title>
  <style>
    @page {
      size: A4;
      margin: 20mm 15mm 20mm 15mm;
      @bottom-right {
        content: counter(page);
        font-size: 9pt;
        color: #64748b;
      }
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      line-height: 1.5;
      font-size: 10.5pt;
      background: #ffffff;
      margin: 0;
      padding: 0;
    }
    .header {
      border-bottom: 2px solid #0284c7;
      padding-bottom: 12px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .header-logo {
      font-size: 16pt;
      font-weight: 900;
      color: #0369a1;
      letter-spacing: -0.5px;
    }
    .header-meta {
      font-size: 8.5pt;
      color: #64748b;
      text-align: right;
    }
    h1 {
      font-size: 20pt;
      font-weight: 900;
      color: #0f172a;
      line-height: 1.2;
      margin: 0 0 8px 0;
    }
    .subtitle {
      font-size: 12pt;
      color: #0369a1;
      font-weight: 700;
      margin-bottom: 20px;
    }
    .badge {
      display: inline-block;
      background: #e0f2fe;
      color: #0369a1;
      font-size: 8pt;
      font-weight: 800;
      padding: 3px 8px;
      border-radius: 4px;
      border: 1px solid #bae6fd;
      text-transform: uppercase;
      margin-bottom: 15px;
    }
    h2 {
      font-size: 13pt;
      font-weight: 800;
      color: #0f172a;
      border-bottom: 1.5px solid #e2e8f0;
      padding-bottom: 5px;
      margin-top: 24px;
      margin-bottom: 10px;
    }
    h3 {
      font-size: 11pt;
      font-weight: 700;
      color: #1e293b;
      margin-top: 14px;
      margin-bottom: 6px;
    }
    p {
      margin: 0 0 10px 0;
      color: #334155;
    }
    .callout {
      background: #f8fafc;
      border-left: 4px solid #0284c7;
      padding: 10px 14px;
      margin: 14px 0;
      border-radius: 0 6px 6px 0;
      font-size: 9.5pt;
    }
    .callout-warning {
      background: #fffbeb;
      border-left: 4px solid #f59e0b;
      color: #92400e;
    }
    .callout-success {
      background: #f0fdf4;
      border-left: 4px solid #16a34a;
      color: #166534;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 12px 0 16px 0;
      font-size: 9pt;
    }
    th, td {
      border: 1px solid #cbd5e1;
      padding: 7px 10px;
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
      gap: 12px;
      margin: 14px 0;
    }
    .role-card {
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px;
      background: #ffffff;
    }
    .role-title {
      font-weight: 800;
      font-size: 10.5pt;
      color: #0f172a;
      margin-bottom: 4px;
    }
    .role-pin {
      display: inline-block;
      background: #fef3c7;
      color: #92400e;
      font-weight: 800;
      font-size: 8pt;
      padding: 2px 6px;
      border-radius: 4px;
      border: 1px solid #fde68a;
      margin-bottom: 8px;
    }
    .page-break {
      page-break-before: always;
    }
    .footer-note {
      font-size: 8pt;
      color: #94a3b8;
      text-align: center;
      margin-top: 30px;
      border-top: 1px solid #e2e8f0;
      padding-top: 10px;
    }
  </style>
</head>
<body>

  <!-- PAGE 1: TITLE & EXECUTIVE SUMMARY -->
  <div class="header">
    <div class="header-logo">💧 OBI TABLE WATER OS</div>
    <div class="header-meta">
      Dual-Line Production Edition (Sachet + Bottled Water &amp; 19L Jars)<br/>
      Certified: Bethelmind Digital Solutions (CAC: 9912717)
    </div>
  </div>

  <span class="badge">Official Factory Manual • November 2026</span>
  <h1>Complete Operational &amp; Financial Handbook</h1>
  <div class="subtitle">The Mobile-First Operating System for Nigerian Dual-Line Water Plants</div>

  <div class="callout callout-success">
    <strong>Core Promise to Mr. Obi:</strong> Know your exact net cash profit from both your Sachet Line and Bottled Water Line before 8:00 PM every evening. Stop driver theft with physical evidence, eliminate ghost shifts, and monitor diesel consumption down to the kobo.
  </div>

  <h2>1. Dual-Line Plant Economics: Sachet vs. Bottled Water</h2>
  <p>Nigerian water factories cannot rely on sachet water alone. Running a dual-line plant changes your factory revenue model completely:</p>

  <table>
    <thead>
      <tr>
        <th>Production Line</th>
        <th>Product Unit</th>
        <th>Selling Price</th>
        <th>Profit Margin / Unit</th>
        <th>Primary Money Leak / Fraud Risk</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Line 1: Sachet Pure Water</strong></td>
        <td>Bag of 20 Sachets</td>
        <td>₦350 wholesale</td>
        <td>₦25 – ₦40 per bag</td>
        <td>Drivers claiming road bursts without returning physical pouches; unrecorded machine rolls.</td>
      </tr>
      <tr>
        <td><strong>Line 2: 75cl Bottled Water</strong></td>
        <td>Pack of 12 Bottles</td>
        <td>₦1,200 wholesale</td>
        <td>₦220 – ₦320 per pack</td>
        <td>PET preform blow rejects stolen or sold; stolen 28mm caps and labels.</td>
      </tr>
      <tr>
        <td><strong>Line 2: 50cl Bottled Water</strong></td>
        <td>Pack of 20 Bottles</td>
        <td>₦1,100 wholesale</td>
        <td>₦200 – ₦280 per pack</td>
        <td>Blow molding heat defects; unrecorded gate sales by cashiers.</td>
      </tr>
      <tr>
        <td><strong>Line 2: 19L Dispenser Jars</strong></td>
        <td>19-Liter Refill</td>
        <td>₦900 refill</td>
        <td>₦450 – ₦600 per refill</td>
        <td><strong>Unreturned empty jars!</strong> Jars cost ₦4,500 each. Unreturned jars destroy 5 trips of profit.</td>
      </tr>
    </tbody>
  </table>

  <h2>2. Today's Dual-Line Daily Financial Audit (Sample Full Shift)</h2>
  <p>Below is the mathematical breakdown of a standard full-capacity day in Mr. Obi's plant:</p>

  <table>
    <thead>
      <tr>
        <th>Revenue Source</th>
        <th>Units Produced &amp; Dispatched</th>
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
        <td>106 Jars (Dispenser line)</td>
        <td>₦900 / refill</td>
        <td>₦96,000</td>
      </tr>
      <tr style="background:#f1f5f9; font-weight:800;">
        <td colspan="3">TOTAL TODAY'S GROSS FACTORY REVENUE</td>
        <td style="color:#0369a1;">₦1,971,000</td>
      </tr>
    </tbody>
  </table>

  <h3>Direct Production &amp; Operating Expenses</h3>
  <ul>
    <li><strong>Generator Diesel Overhead:</strong> 32 Liters @ ₦1,350/L = <strong>₦43,200</strong> (Sachet energy overhead = ₦8.20/bag).</li>
    <li><strong>Sachet Nylon Film:</strong> 14 Rolls (280 kg LDPE) = <strong>₦280,000</strong>.</li>
    <li><strong>PET Preforms &amp; Caps:</strong> 5,400 units + 24 blow rejects = <strong>₦95,600</strong>.</li>
    <li><strong>Shrink Wrap Film &amp; Labels:</strong> 350 packs = <strong>₦28,000</strong>.</li>
    <li><strong>Factory Loaders &amp; Packers Wages:</strong> ₦50,000.</li>
    <li><strong>Driver Commissions &amp; Fuel Allowance:</strong> ₦50,000.</li>
  </ul>

  <div class="callout callout-success" style="font-size: 11pt; font-weight: 700;">
    💰 TODAY'S NET CASH PROFIT: ₦524,200  
    <div style="font-size: 8.5pt; font-weight: normal; color: #166534; margin-top: 3px;">
      Physical Cash in Blessing's Drawer: ₦420,000 • Moniepoint POS Verified Transfers: ₦1,551,000.
    </div>
  </div>

  <div class="page-break"></div>

  <!-- PAGE 2: 4-ROLE ZERO-PASSWORD WORKFLOW -->
  <div class="header">
    <div class="header-logo">💧 OBI TABLE WATER OS</div>
    <div class="header-meta">Dual-Line Production Edition • PIN Login System</div>
  </div>

  <h2>3. The 4 Zero-Password Staff Roles</h2>
  <p>Factory workers do not use emails or passwords. They tap their picture card and enter a 4-digit PIN:</p>

  <div class="role-grid">
    <div class="role-card">
      <div class="role-title">👑 Mr. Obi (Owner / MD)</div>
      <span class="role-pin">PIN: 2026</span>
      <p style="font-size: 8.5pt;">Access from phone home screen. See net cash profit, driver short debits, diesel cost per bag, and 1-tap WhatsApp evening digest.</p>
    </div>

    <div class="role-card">
      <div class="role-title">📋 Kenneth (Supervisor)</div>
      <span class="role-pin">PIN: 1111</span>
      <p style="font-size: 8.5pt;">Taps "+1 Roll Used" for sachets, logs bottle preforms and blow rejects, tracks diesel dips, and dispatches WhatsApp shift close.</p>
    </div>

    <div class="role-card">
      <div class="role-title">💰 Blessing (Gate Cashier)</div>
      <span class="role-pin">PIN: 2222</span>
      <p style="font-size: 8.5pt;">Selects product (Sachets, 75cl, 50cl, Jars) and tags Cash vs. Bank Transfer. Verifies Moniepoint POS credit before unlocking gate.</p>
    </div>

    <div class="role-card">
      <div class="role-title">🚚 Musa (Route Driver)</div>
      <span class="role-pin">PIN: 3333</span>
      <p style="font-size: 8.5pt;">Inspects loaded truck manifest, delivers to depots, returns burst plastic pouches, and collects ₦4,500 deposit for unreturned 19L jars.</p>
    </div>
  </div>

  <h2>4. The Two Fraud Prevention Rules That Protect Your Capital</h2>

  <h3>Rule 1: The Sachet Burst Pouch Rule (Stopping Driver Theft)</h3>
  <div class="callout callout-warning">
    <strong>The Law of Physical Pouches:</strong> If a driver claims 40 bags burst on road potholes, he must return <strong>40 physical burst pouches</strong> to Kenneth at the gate. If he returns 0 pouches, the system auto-debits the full ₦14,000 from his pay.
  </div>
  <p>Drivers can no longer sell 40 bags into roadside kiosks, pocket ₦14,000, and claim "water burst on Badore bridge". Zero pouches = 100% driver debt.</p>

  <h3>Rule 2: The ₦4,500 Dispenser Jar Deposit Rule</h3>
  <div class="callout callout-warning">
    <strong>Protecting 19L Dispenser Jars:</strong> An empty 19L jar costs ₦4,500 – ₦6,000. If Musa delivers 15 dispenser refills to a corporate client, he must collect <strong>15 empty jars</strong>. If the client retains the empty jars, Musa must collect a <strong>₦4,500 deposit per jar</strong>.
  </div>
  <p>If Musa leaves 5 jars without collecting empty containers or deposits, his account is flagged for ₦22,500 jar liability. This prevents the quiet loss of ₦100,000+ in jars every month.</p>

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
      top: '15mm',
      bottom: '15mm',
      left: '12mm',
      right: '12mm'
    }
  });

  // Also copy to public/downloads/
  fs.copyFileSync(destPdf1, destPdf2);

  await browser.close();

  const sizeKb = (fs.statSync(destPdf1).size / 1024).toFixed(1);
  console.log(`✅ Dual-Line PDF Manual saved to: ${destPdf1} (${sizeKb} KB)`);
  console.log(`✅ Web copy saved to: ${destPdf2} (${sizeKb} KB)`);
}

generateHandbook().catch(err => {
  console.error('❌ PDF Generation Error:', err);
  process.exit(1);
});
