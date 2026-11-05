/**
 * @file scripts/build_visual_handbook_pdf.js
 * 
 * 💧 OBI TABLE WATER OS — VISUAL OPERATING MANUAL & UI NAVIGATION GUIDE
 * Generates an executive, highly illustrated 12-page PDF handbook
 * containing real high-definition screenshots of every single screen,
 * data entry point, and administrative variable control.
 * 
 * Saves to:
 * - factory_delivery_pack/OBI_TABLE_WATER_COMPLETE_OPERATING_MANUAL.pdf
 * - public/downloads/obi_table_water_complete_handbook.pdf
 * 
 * Certified by Bethelmind Digital Solutions (CAC Certified: Reg 9912717)
 */

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

async function buildVisualHandbook() {
  console.log('📄 Starting compilation of Visual Master Handbook with Real UI Screenshots...');

  const scenesDir = path.join(__dirname, '..', 'public', 'walkthrough-scenes');

  function getImgB64(fileName) {
    const fullPath = path.join(scenesDir, fileName);
    if (fs.existsSync(fullPath)) {
      return `data:image/png;base64,${fs.readFileSync(fullPath).toString('base64')}`;
    }
    console.warn(`Warning: Image ${fileName} not found at ${fullPath}`);
    return '';
  }

  // Load all 10 crisp UI screenshots
  const imgStaffLogin = getImgB64('scene_05_staff_login_cards.png');
  const imgOwnerPin = getImgB64('scene_01_owner_pin_empty.png');
  const imgKennethSachet = getImgB64('scene_06_kenneth_sachet_console.png');
  const imgKennethBottles = getImgB64('scene_07_kenneth_bottles_console.png');
  const imgBlessingPOS = getImgB64('scene_08_blessing_gate_pos.png');
  const imgMusaManifest = getImgB64('scene_09_musa_driver_manifest.png');
  const imgMusaRules = getImgB64('scene_10_musa_pouch_and_jar_rules.png');
  const imgOwnerDashboard = getImgB64('scene_02_owner_dashboard_top.png');
  const imgOwnerDriverAudit = getImgB64('scene_04_owner_driver_shortage.png');
  const imgWhatsAppSync = getImgB64('scene_11_whatsapp_evening_sync.png');
  const imgNafdacCompliance = getImgB64('scene_12_nafdac_compliance_log.png');
  const imgAdminVariables = getImgB64('scene_13_admin_variables_manager.png');

  const destPdf1 = path.join(__dirname, '..', 'factory_delivery_pack', 'OBI_TABLE_WATER_COMPLETE_OPERATING_MANUAL.pdf');
  const destPdf2 = path.join(__dirname, '..', 'public', 'downloads', 'obi_table_water_complete_handbook.pdf');

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Obi Table Water OS — Master Illustrated Operating Manual & UI Navigation Guide</title>
  <style>
    @page {
      size: A4;
      margin: 12mm 12mm 12mm 12mm;
      @bottom-right {
        content: "Page " counter(page) " of " counter(pages);
        font-size: 8pt;
        color: #64748b;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      @bottom-left {
        content: "Obi Table Water OS • Master Operating Manual (Illustrated Edition)";
        font-size: 8pt;
        color: #94a3b8;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
    }
    * {
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      line-height: 1.4;
      font-size: 9pt;
      background: #ffffff;
      margin: 0;
      padding: 0;
    }
    .header {
      border-bottom: 2px solid #0284c7;
      padding-bottom: 6px;
      margin-bottom: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .header-logo {
      font-size: 13pt;
      font-weight: 900;
      color: #0369a1;
      letter-spacing: -0.5px;
    }
    .header-meta {
      font-size: 7.5pt;
      color: #64748b;
      text-align: right;
      line-height: 1.3;
    }
    h1 {
      font-size: 18pt;
      font-weight: 900;
      color: #0f172a;
      line-height: 1.15;
      margin: 0 0 6px 0;
      letter-spacing: -0.5px;
    }
    .subtitle {
      font-size: 10pt;
      color: #0369a1;
      font-weight: 700;
      margin-bottom: 10px;
    }
    h2 {
      font-size: 13pt;
      font-weight: 900;
      color: #0f172a;
      border-bottom: 1.5px solid #e2e8f0;
      padding-bottom: 4px;
      margin: 10px 0 8px 0;
    }
    h3 {
      font-size: 10.5pt;
      font-weight: 800;
      color: #0369a1;
      margin: 8px 0 4px 0;
    }
    h4 {
      font-size: 9pt;
      font-weight: 800;
      color: #334155;
      margin: 6px 0 3px 0;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
    p {
      margin: 0 0 6px 0;
      font-size: 8.5pt;
      color: #334155;
      line-height: 1.4;
    }
    ul, ol {
      margin: 0 0 8px 0;
      padding-left: 18px;
      font-size: 8.5pt;
      color: #334155;
    }
    li {
      margin-bottom: 3px;
      line-height: 1.35;
    }
    .badge {
      display: inline-block;
      padding: 2px 7px;
      border-radius: 4px;
      font-size: 7.5pt;
      font-weight: 800;
      text-transform: uppercase;
      background: #e0f2fe;
      color: #0369a1;
      margin-bottom: 6px;
    }
    .badge-emerald {
      background: #dcfce7;
      color: #15803d;
    }
    .badge-amber {
      background: #fef3c7;
      color: #b45309;
    }
    .badge-rose {
      background: #ffe4e6;
      color: #be123c;
    }
    .callout {
      border-left: 3.5px solid #0284c7;
      background: #f0f9ff;
      padding: 6px 10px;
      border-radius: 4px;
      margin: 6px 0 8px 0;
      font-size: 8pt;
      line-height: 1.35;
    }
    .callout-success {
      border-left-color: #16a34a;
      background: #f0fdf4;
    }
    .callout-warning {
      border-left-color: #d97706;
      background: #fffbeb;
    }
    .callout-danger {
      border-left-color: #e11d48;
      background: #fff1f2;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 6px 0 10px 0;
      font-size: 7.5pt;
    }
    th, td {
      border: 1px solid #cbd5e1;
      padding: 5px 6px;
      text-align: left;
    }
    th {
      background: #f1f5f9;
      font-weight: 800;
      color: #1e293b;
    }
    .code-tag {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      background: #e2e8f0;
      padding: 1px 4px;
      border-radius: 3px;
      font-size: 7.5pt;
      color: #0f172a;
      font-weight: 600;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin: 6px 0 8px 0;
    }
    .card {
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 6px 8px;
      background: #ffffff;
    }
    .card-title {
      font-weight: 800;
      font-size: 8.5pt;
      color: #0f172a;
      margin-bottom: 2px;
    }
    .page-break {
      page-break-before: always;
    }
    .toc {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 8px 12px;
      margin: 8px 0;
      font-size: 8pt;
    }
    .toc-item {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px dotted #cbd5e1;
      padding: 2.5px 0;
    }

    /* 📸 HIGH-DEFINITION UI SCREENSHOT STYLES */
    .ui-screenshot-card {
      margin: 8px 0 10px 0;
      border-radius: 6px;
      overflow: hidden;
      border: 1.5px solid #cbd5e1;
      background: #0f172a;
      page-break-inside: avoid;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
    }
    .ui-screenshot-header {
      background: #0f172a;
      color: #38bdf8;
      font-size: 7.5pt;
      font-weight: 700;
      padding: 4px 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #1e293b;
    }
    .ui-screenshot-header span.title {
      display: flex;
      align-items: center;
      gap: 4px;
      font-weight: 800;
    }
    .ui-screenshot-img {
      width: 100%;
      max-height: 200px;
      object-fit: cover;
      object-position: top;
      display: block;
      border-bottom: 1px solid #1e293b;
    }
    .ui-screenshot-caption {
      background: #f8fafc;
      padding: 5px 8px;
      font-size: 7.5pt;
      color: #334155;
      line-height: 1.35;
      border-top: 1px solid #e2e8f0;
    }
    .ui-screenshot-caption strong {
      color: #0369a1;
    }
    .arrow-pointer {
      display: inline-block;
      background: #0284c7;
      color: #ffffff;
      padding: 1px 4px;
      border-radius: 3px;
      font-size: 7pt;
      font-weight: bold;
      margin: 0 2px;
    }
  </style>
</head>
<body>

  <!-- =====================================================================
       PAGE 1: COVER, EXECUTIVE SUMMARY & TECHNICAL SUPPORT REGISTRY
  ====================================================================== -->
  <div class="header">
    <div class="header-logo">💧 OBI TABLE WATER OS</div>
    <div class="header-meta">
      Dual-Line Plant Edition • Illustrated Master Operating Manual<br/>
      Certified: Bethelmind Digital Solutions (CAC: Reg 9912717)
    </div>
  </div>

  <span class="badge">Master Operational Bible • Version 5.2 Visual Edition</span>
  <h1>Complete Factory Operations, Daily Data Entry &amp; Loss Control Manual</h1>
  <div class="subtitle">The Step-by-Step Illustrated Guide with Real UI Screenshots for Owners, Supervisors, Cashiers &amp; Drivers</div>

  <div class="callout callout-success">
    <strong>Executive Operational Mandate:</strong> This visual document is the official, complete operational guide for the Obi Table &amp; Bottled Water Plant. Every screen, numeric keypad, button, reconciliation formula, and anti-theft checkpoint is accompanied by high-definition screenshots of the live system to guarantee zero confusion for new staff.
  </div>

  <div class="toc">
    <strong style="color: #0369a1; display: block; margin-bottom: 4px; font-size: 9pt;">📖 TABLE OF CONTENTS</strong>
    <div class="toc-item"><span>Section 1: Executive Overview &amp; The Dual-Line Manufacturing Model</span><span>Page 2</span></div>
    <div class="toc-item"><span>Section 2: Step-by-Step Illustrated UI Navigation &amp; Daily Data Entry Guide</span><span>Pages 3–8</span></div>
    <div class="toc-item"><span>&nbsp;&nbsp;&bull; Screen 1: Zero-Password Staff Visual Login &amp; 4-Digit PIN (/factory/login)</span><span>Page 3</span></div>
    <div class="toc-item"><span>&nbsp;&nbsp;&bull; Screen 2: Supervisor Dual-Line Console &amp; PET Scrap Scale (Kenneth)</span><span>Page 4</span></div>
    <div class="toc-item"><span>&nbsp;&nbsp;&bull; Screen 3: Gate Cashier POS &amp; Moniepoint RRN Lock (Blessing)</span><span>Page 5</span></div>
    <div class="toc-item"><span>&nbsp;&nbsp;&bull; Screen 4: Route Delivery Driver Manifest &amp; 19L Jar Quality (Musa)</span><span>Page 6</span></div>
    <div class="toc-item"><span>&nbsp;&nbsp;&bull; Screen 5: Executive Owner Portal &amp; 8:00 PM WhatsApp Digest (Mr. Obi)</span><span>Page 7</span></div>
    <div class="toc-item"><span>&nbsp;&nbsp;&bull; Screen 6: Executive Plant Admin &amp; Variables Manager (/factory/admin)</span><span>Page 8</span></div>
    <div class="toc-item"><span>Section 3: Interactive Video Training Center &amp; Audio Voiceover Guide</span><span>Page 9</span></div>
    <div class="toc-item"><span>Section 4: General Factory Operations &amp; 6-Stage Water Treatment Protocol</span><span>Page 10</span></div>
    <div class="toc-item"><span>Section 5: The 5 Anti-Fraud Standard Operating Procedures (SOPs)</span><span>Page 11</span></div>
    <div class="toc-item"><span>Section 6: Daily Shift Timetable, Generator Economics &amp; Emergency Recovery</span><span>Page 12</span></div>
  </div>

  <div class="card" style="margin-top: 8px; background: #f8fafc;">
    <strong style="font-size: 8pt; color: #0f172a;">Plant Identification &amp; Technical Support Registry:</strong>
    <div class="grid-2" style="font-size: 7.5pt; margin-top: 3px;">
      <div>
        &bull; <strong>Factory Name:</strong> Obi Table &amp; Bottled Water Plant<br/>
        &bull; <strong>Operating System:</strong> Obi Table Water OS (v5.2 Illustrated)<br/>
        &bull; <strong>Production Lines:</strong> Sachet Water + Bottled (50cl/75cl) + 19L Dispenser Jars<br/>
        &bull; <strong>Corporate Desk:</strong> Bethelmind Digital Solutions (CAC: 9912717)
      </div>
      <div>
        &bull; <strong>Direct WhatsApp Hotline:</strong> wa.me/2348022791227 (0802 279 1227)<br/>
        &bull; <strong>Corporate Settlement Bank:</strong> Moniepoint Microfinance Bank<br/>
        &bull; <strong>Account Number:</strong> 6805375225 (Bethelmind Digital Solutions)<br/>
        &bull; <strong>Deployment:</strong> Edge Production &bull; 100% Offline Persistence
      </div>
    </div>
  </div>

  <div class="page-break"></div>

  <!-- =====================================================================
       PAGE 2: SECTION 1: EXECUTIVE OVERVIEW & DUAL-LINE ECONOMICS
  ====================================================================== -->
  <div class="header">
    <div class="header-logo">💧 OBI TABLE WATER OS</div>
    <div class="header-meta">Section 1: Executive Overview &amp; Dual-Line Economics</div>
  </div>

  <h2>1. Executive Overview &amp; The Dual-Line Manufacturing Model</h2>

  <p>In the Nigerian commercial water industry, factories that rely exclusively on sachet water ("pure water") operate on razor-thin margins of ₦25 to ₦40 per bag. A single generator breakdown, an unrecorded driver shortage, or a sudden spike in diesel prices immediately wipes out weekly profits.</p>

  <p>Mr. Obi's plant operates on a <strong>Dual-Line Hybrid Model</strong> that pairs the high turnover of sachet water with the high contribution margins of PET bottled water and 19-Liter dispenser jar refills:</p>

  <table>
    <thead>
      <tr>
        <th>Line &amp; Product</th>
        <th>Packaging Spec</th>
        <th>Wholesale Price</th>
        <th>Unit Direct Cost</th>
        <th>Net Unit Margin</th>
        <th>Turnover Speed</th>
        <th>Primary Vulnerability</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Line 1: Sachet Pure Water</strong></td>
        <td>Bag of 20 sachets (500ml)</td>
        <td>₦350 / bag</td>
        <td>₦310 / bag</td>
        <td><strong>₦40 / bag (11.4%)</strong></td>
        <td>Fast (4,200 bags/day)</td>
        <td>Driver road burst claims; unrecorded ghost shifts.</td>
      </tr>
      <tr>
        <td><strong>Line 2: 75cl Bottled Water</strong></td>
        <td>Shrink pack of 12 bottles</td>
        <td>₦1,200 / pack</td>
        <td>₦920 / pack</td>
        <td><strong>₦280 / pack (23.3%)</strong></td>
        <td>Fast (250 packs/day)</td>
        <td>Preform theft masked as "blow-mold rejects".</td>
      </tr>
      <tr>
        <td><strong>Line 2: 50cl Bottled Water</strong></td>
        <td>Shrink pack of 20 bottles</td>
        <td>₦1,100 / pack</td>
        <td>₦850 / pack</td>
        <td><strong>₦250 / pack (22.7%)</strong></td>
        <td>Fast (150 packs/day)</td>
        <td>Cashier unrecorded sales; label shrinkage.</td>
      </tr>
      <tr>
        <td><strong>Line 2: 19L Dispenser Jars</strong></td>
        <td>19-Liter Refill (Polycarbonate)</td>
        <td>₦900 / refill</td>
        <td>₦320 / refill</td>
        <td><strong>₦580 / jar (64.4%)</strong></td>
        <td>Moderate (40–100 jars/day)</td>
        <td><strong>Unreturned or battered empty jars (₦4,500 ea).</strong></td>
      </tr>
    </tbody>
  </table>

  <h3>1.2 Daily Revenue &amp; Contribution Split (Standard 1-Shift Day)</h3>
  <div class="grid-2">
    <div class="card" style="border-left: 4px solid #0284c7;">
      <div class="card-title">💧 Sachet Line Contribution</div>
      <p style="font-size: 7.5pt; margin: 0;">
        &bull; Volume: 4,200 Bags (14 Nylon Rolls)<br/>
        &bull; Gross Sales: <strong>₦1,470,000</strong> (74.6% of Plant Revenue)<br/>
        &bull; Consumables: 280kg LDPE film (₦280,000)<br/>
        &bull; Net Cash Contribution: <strong>₦168,000</strong>
      </p>
    </div>
    <div class="card" style="border-left: 4px solid #16a34a;">
      <div class="card-title">🍾 Bottling &amp; Dispenser Line Contribution</div>
      <p style="font-size: 7.5pt; margin: 0;">
        &bull; Volume: 400 packs + 40 dispenser jars<br/>
        &bull; Gross Sales: <strong>₦501,000</strong> (25.4% of Plant Revenue)<br/>
        &bull; Consumables: 3,000 preforms, caps, shrink film (₦123,600)<br/>
        &bull; Net Cash Contribution: <strong>₦130,700</strong>
      </p>
    </div>
  </div>

  <h3>1.3 The Core Operational Formula</h3>
  <div class="callout callout-warning">
    <strong>Daily Plant Health Equation:</strong>  
    $$\\text{Today's Net Cash Profit} = \\text{Total Gross Gate Sales} - (\\text{Diesel Cost} + \\text{Packaging Consumables} + \\text{Labour Wages} + \\text{Driver Shortage Debits})$$
    On this system, Mr. Obi never waits for monthly account reconciliation. At 8:00 PM every evening, his mobile screen reflects the confirmed Net Cash in hand: <strong>₦524,200</strong>.
  </div>

  <div class="page-break"></div>

  <!-- =====================================================================
       PAGE 3: SECTION 2: UI NAVIGATION — SCREEN 1: STAFF LOGIN
  ====================================================================== -->
  <div class="header">
    <div class="header-logo">💧 OBI TABLE WATER OS</div>
    <div class="header-meta">Section 2: Illustrated UI Guide • Screen 1: Staff Visual Login</div>
  </div>

  <h2>2. Illustrated Screen-by-Screen UI Navigation Guide</h2>

  <h3>Screen 1: Zero-Password Staff Visual Login</h3>
  <p><strong>URL:</strong> <span class="code-tag">https://www.bethelmindanalytics.com/factory/login</span> &bull; <strong>Access:</strong> All Plant Personnel</p>
  <p>Traditional password logins fail in Nigerian factories because staff forget passwords. Obi Table Water OS provides large visual cards for every staff member and a 4-digit PIN pad that works completely offline.</p>

  <!-- SCREENSHOT 1: STAFF LOGIN ROSTER -->
  <div class="ui-screenshot-card">
    <div class="ui-screenshot-header">
      <span class="title">📸 SCREENSHOT 1: Staff Role Selector &amp; Visual Cards (/factory/login)</span>
      <span class="badge badge-emerald">Live UI</span>
    </div>
    <img src="${imgStaffLogin}" class="ui-screenshot-img" alt="Staff Visual Login Screen" />
    <div class="ui-screenshot-caption">
      <strong>How to enter data:</strong> Staff members tap their name card (👑 Mr. Obi, 📋 Kenneth, 💰 Blessing, or 🚚 Musa). The screen slides into the touch PIN pad. Tapping <span class="arrow-pointer">Enter &rarr;</span> opens their console immediately.
    </div>
  </div>

  <h4>Navigation &amp; Interaction Checklist:</h4>
  <ol>
    <li><strong>Selecting Your Role:</strong> Tap on your picture card. The terminal displays the 4-digit touch PIN pad.</li>
    <li><strong>Entering Your PIN:</strong> Tap your 4-digit PIN on the large numeric pad. As each digit is entered, the 4 dots illuminate blue.
      <ul>
        <li>👑 <strong>Mr. Obi (Owner):</strong> PIN <span class="code-tag">2026</span></li>
        <li>📋 <strong>Kenneth (Supervisor):</strong> PIN <span class="code-tag">1111</span></li>
        <li>💰 <strong>Blessing (Cashier):</strong> PIN <span class="code-tag">2222</span></li>
        <li>🚚 <strong>Musa (Driver):</strong> PIN <span class="code-tag">3333</span></li>
      </ul>
    </li>
    <li><strong>Server-Side Constant-Time Validation:</strong> Upon tapping the 4th digit, the system validates the PIN server-side via <span class="code-tag">/api/factory/auth</span>. If offline, it verifies against local storage so work never stops.</li>
    <li><strong>Switching Staff:</strong> Tap the top-right <span class="arrow-pointer">Switch Staff</span> button anytime to switch back to the main role menu.</li>
  </ol>

  <div class="page-break"></div>

  <!-- =====================================================================
       PAGE 4: SECTION 2: UI NAVIGATION — SCREEN 2: SUPERVISOR CONSOLE
  ====================================================================== -->
  <div class="header">
    <div class="header-logo">💧 OBI TABLE WATER OS</div>
    <div class="header-meta">Section 2: Illustrated UI Guide • Screen 2: Supervisor Console (Kenneth)</div>
  </div>

  <h3>Screen 2: Shift Supervisor Dual-Line Console (Kenneth • PIN 1111)</h3>
  <p><strong>Role:</strong> Kenneth (Plant Supervisor) &bull; <strong>Shift Time:</strong> 7:00 AM – 6:30 PM &bull; <strong>Consoles:</strong> Sachet &amp; Bottling</p>
  <p>Kenneth is responsible for machine outputs, nylon rolls, PET preform scrap audits, and dispatching the 8:00 PM shift report to Mr. Obi.</p>

  <!-- SCREENSHOT 2A: SACHET ROLL LOGGER -->
  <div class="ui-screenshot-card">
    <div class="ui-screenshot-header">
      <span class="title">📸 SCREENSHOT 2A: Sachet Water Roll Logger &amp; Yield Counter</span>
      <span class="badge badge-emerald">Line 1: Sachets</span>
    </div>
    <img src="${imgKennethSachet}" class="ui-screenshot-img" alt="Supervisor Sachet Console" />
    <div class="ui-screenshot-caption">
      <strong>Where to enter data:</strong> Every time an operator mounts and finishes a 20kg roll on the Dingli sealing machine, tap <span class="arrow-pointer">+ Finished Another Roll (+1 Roll)</span>. The system automatically computes bags output ($14 \\times 300 = \\mathbf{4,200\\text{ bags}}$) and total naira value (₦1,470,000).
    </div>
  </div>

  <!-- SCREENSHOT 2B: BOTTLING & SCRAP SCALE AUDIT -->
  <div class="ui-screenshot-card">
    <div class="ui-screenshot-header">
      <span class="title">📸 SCREENSHOT 2B: Bottling Console &amp; PET Preform Scrap Scale Audit</span>
      <span class="badge badge-amber">Line 2: Bottles &amp; 19L</span>
    </div>
    <img src="${imgKennethBottles}" class="ui-screenshot-img" alt="Supervisor Bottling Console" />
    <div class="ui-screenshot-caption">
      <strong>Where to enter data:</strong> Tap the <em>Bottle Line</em> tab. Tap <span class="arrow-pointer">+10 Packs</span> for 75cl/50cl bottles and <span class="arrow-pointer">+5 Jars</span> for 19L refills. Under the <em>Preform Scale Audit</em> card, enter claimed blow rejects (24 pcs) and type the digital scale weight (432g). If verified, badge turns green: <span class="badge badge-emerald">✓ Weight Verified</span>.
    </div>
  </div>

  <div class="callout callout-warning">
    <strong>Evening WhatsApp Shift Close:</strong> At 6:00 PM, Kenneth taps <span class="arrow-pointer">📲 Send Dual-Line Shift Close to Mr. Obi on WhatsApp</span>. This compiles all sachet rolls, bottle packs, dispenser jars, preform scale audit, and diesel dips into a clean formatted text report and opens WhatsApp with Mr. Obi's direct line (<span class="code-tag">0802 279 1227</span>) pre-filled.
  </div>

  <div class="page-break"></div>

  <!-- =====================================================================
       PAGE 5: SECTION 2: UI NAVIGATION — SCREEN 3: CASHIER POS
  ====================================================================== -->
  <div class="header">
    <div class="header-logo">💧 OBI TABLE WATER OS</div>
    <div class="header-meta">Section 2: Illustrated UI Guide • Screen 3: Gate Cashier POS (Blessing)</div>
  </div>

  <h3>Screen 3: Gate Cashier POS &amp; Moniepoint RRN Lock (Blessing • PIN 2222)</h3>
  <p><strong>Role:</strong> Blessing (Gate Cashier) &bull; <strong>Location:</strong> Factory Gate Sales Kiosk &bull; <strong>Function:</strong> Invoicing &amp; Bank Transfer Fraud Prevention</p>
  <p>Blessing registers walk-in depot sales, verifies Moniepoint POS bank transfers, and issues tamper-proof Gate Clearance Passes.</p>

  <!-- SCREENSHOT 3: GATE CASHIER POS -->
  <div class="ui-screenshot-card">
    <div class="ui-screenshot-header">
      <span class="title">📸 SCREENSHOT 3: Gate Cashier POS &amp; Moniepoint RRN Security Lock</span>
      <span class="badge badge-emerald">Gate Sales Register</span>
    </div>
    <img src="${imgBlessingPOS}" class="ui-screenshot-img" alt="Cashier POS Console" />
    <div class="ui-screenshot-caption">
      <strong>Where to enter data:</strong> Type customer name &rarr; select product &rarr; enter quantity &rarr; select payment type. If bank transfer is selected, type the last 4 digits of the Moniepoint POS terminal RRN (e.g. <strong>8492</strong>) &rarr; tap <span class="arrow-pointer">+ Issue Gate Clearance Pass (GP-842)</span>.
    </div>
  </div>

  <h4>Navigation &amp; POS Transaction SOP:</h4>
  <ol>
    <li><strong>Drawer Cash vs. POS Transfer Reconciliation:</strong> The top 2 cards track live physical paper notes in drawer (₦145,000) vs confirmed Moniepoint transfers (₦115,000). Both must balance at the end of the day.</li>
    <li><strong>Recording a Sale:</strong>
      <ul>
        <li>Type customer/depot name in <em>"Customer / Depot Name"</em> (e.g., Mama Chichi Supermarket).</li>
        <li>Select product: Sachet bag (₦350), 75cl pack (₦1,200), 50cl pack (₦1,100), or 19L refill (₦900).</li>
        <li>Enter Quantity (e.g., 30 packs).</li>
        <li>Select Payment Method: <span class="code-tag">💵 Cash in Hand</span> or <span class="code-tag">🏦 Moniepoint Transfer (RRN Required)</span>.</li>
      </ul>
    </li>
    <li><strong>The Moniepoint POS RRN Lock:</strong> If <em>Moniepoint Transfer</em> is chosen, the security engine displays a mandatory field: <em>"Moniepoint POS Terminal RRN (Last 4 Digits) *"</em>. Blessing MUST inspect the printed terminal slip and enter the RRN (e.g. <strong>8492</strong>). Screenshots or fake SMS alerts are strictly rejected.</li>
    <li><strong>Gate Clearance Pass Code (GP-xxx):</strong> Upon recording, the system generates a 3-digit pass code (e.g. <span class="badge badge-emerald">GP-842</span>). Gate security guards will <strong>NOT</strong> open the gate boom barrier until the driver recites the matching code.</li>
  </ol>

  <div class="page-break"></div>

  <!-- =====================================================================
       PAGE 6: SECTION 2: UI NAVIGATION — SCREEN 4: DRIVER MANIFEST
  ====================================================================== -->
  <div class="header">
    <div class="header-logo">💧 OBI TABLE WATER OS</div>
    <div class="header-meta">Section 2: Illustrated UI Guide • Screen 4: Driver Manifest (Musa)</div>
  </div>

  <h3>Screen 4: Route Delivery Driver Manifest &amp; Jar Quality (Musa • PIN 3333)</h3>
  <p><strong>Role:</strong> Musa (Truck 2 Driver) &bull; <strong>Route:</strong> Badore / Ajah Corridor &bull; <strong>Truck Spec:</strong> Mixed Load Fleet</p>
  <p>Musa is responsible for delivering mixed loads, accounting for vehicle cash collections, returning empty plastic pouches for burst claims, and inspecting empty 19L jars.</p>

  <!-- SCREENSHOT 4A: DRIVER MANIFEST -->
  <div class="ui-screenshot-card">
    <div class="ui-screenshot-header">
      <span class="title">📸 SCREENSHOT 4A: Mixed Truckload Loading Manifest &amp; Cash Remittance</span>
      <span class="badge badge-emerald">Truck 2 Manifest</span>
    </div>
    <img src="${imgMusaManifest}" class="ui-screenshot-img" alt="Driver Truck Manifest" />
    <div class="ui-screenshot-caption">
      <strong>Where to enter data:</strong> In the morning, review loaded products: 700 sachet bags, 60 bottle packs, 15 dispenser jars. The screen displays the exact total remittance expected: <span class="arrow-pointer">Total Cash to Remit: ₦330,500</span>.
    </div>
  </div>

  <!-- SCREENSHOT 4B: POUCH RULES & JAR INSPECTION -->
  <div class="ui-screenshot-card">
    <div class="ui-screenshot-header">
      <span class="title">📸 SCREENSHOT 4B: 19L Dispenser Jar Return &amp; Battered Jar Liability Check</span>
      <span class="badge badge-rose">Loss Control</span>
    </div>
    <img src="${imgMusaRules}" class="ui-screenshot-img" alt="Driver Jar Quality Inspection" />
    <div class="ui-screenshot-caption">
      <strong>Where to enter data:</strong> Under <em>19L Jar Quality Inspection</em>, type empty jars returned (15) and battered/off-brand jars (2). The system automatically calculates the ₦4,500 replacement penalty: <span class="arrow-pointer">₦9,000 debit</span>.
    </div>
  </div>

  <div class="callout callout-danger">
    <strong>The Physical Pouch Return Rule:</strong> If Musa claims 40 sachet bags burst along Badore road, he must return <strong>40 physical wet burst plastic pouches</strong>. If 0 pouches are returned, the system auto-debits $40 \\times \\text{₦350} = \\mathbf{₦14,000}$ from his settlement.
  </div>

  <div class="page-break"></div>

  <!-- =====================================================================
       PAGE 7: SECTION 2: UI NAVIGATION — SCREEN 5: OWNER PORTAL
  ====================================================================== -->
  <div class="header">
    <div class="header-logo">💧 OBI TABLE WATER OS</div>
    <div class="header-meta">Section 2: Illustrated UI Guide • Screen 5: Executive Owner Portal (Mr. Obi)</div>
  </div>

  <h3>Screen 5: Executive Owner Portal &amp; Financial P&amp;L (Mr. Obi • PIN 2026)</h3>
  <p><strong>Role:</strong> Mr. Obi (Managing Director &amp; Plant Owner) &bull; <strong>PIN:</strong> <span class="code-tag">2026</span> &bull; <strong>URL:</strong> <span class="code-tag">/factory/owner</span></p>
  <p>Mr. Obi's portal is the master executive control tower. Accessible directly from his smartphone home screen, it delivers real-time visibility into net cash profits, inventory security, fuel overhead, and fleet shortages.</p>

  <!-- SCREENSHOT 5A: OWNER AUDITED PROFIT -->
  <div class="ui-screenshot-card">
    <div class="ui-screenshot-header">
      <span class="title">📸 SCREENSHOT 5A: Executive Owner Dashboard &amp; Audited Net Profit</span>
      <span class="badge badge-emerald">Audited Net Profit</span>
    </div>
    <img src="${imgOwnerDashboard}" class="ui-screenshot-img" alt="Owner Dashboard Top" />
    <div class="ui-screenshot-caption">
      <strong>Executive Oversight:</strong> Displays real-time audited net cash profit: <span class="arrow-pointer">₦524,200</span> (from ₦1,971,000 gross). Shows exact revenue split: 74.6% Sachet Line (₦1,470,000) vs 25.4% Bottled Line (₦501,000).
    </div>
  </div>

  <!-- SCREENSHOT 5B: WHATSAPP SHIFT DIGEST -->
  <div class="ui-screenshot-card">
    <div class="ui-screenshot-header">
      <span class="title">📸 SCREENSHOT 5B: 8:00 PM WhatsApp Shift Closing Digest</span>
      <span class="badge badge-emerald">WhatsApp Auto-Sync</span>
    </div>
    <img src="${imgWhatsAppSync}" class="ui-screenshot-img" alt="WhatsApp Shift Report" />
    <div class="ui-screenshot-caption">
      <strong>Nightly Routine:</strong> At 8:00 PM, Kenneth sends the tamper-proof shift digest directly to Mr. Obi's personal WhatsApp (<span class="code-tag">0802 279 1227</span>) detailing production outputs, preform scrap balance, diesel overhead, and driver debits.
    </div>
  </div>

  <div class="page-break"></div>

  <!-- =====================================================================
       PAGE 8: SECTION 2: UI NAVIGATION — SCREEN 6: PLANT ADMIN
  ====================================================================== -->
  <div class="header">
    <div class="header-logo">💧 OBI TABLE WATER OS</div>
    <div class="header-meta">Section 2: Illustrated UI Guide • Screen 6: Plant Admin &amp; Variables Manager</div>
  </div>

  <h3>Screen 6: Executive Plant Admin &amp; Variables Manager (/factory/admin)</h3>
  <p><strong>Access:</strong> Managing Director Only &bull; <strong>Security PIN:</strong> <span class="code-tag">2026</span> &bull; <strong>URL:</strong> <span class="code-tag">/factory/admin</span></p>
  <p>Whenever you hire new staff, change wholesale prices, or adjust shift hours, you do NOT need a software developer. Mr. Obi can adjust all variables directly from this single control tower.</p>

  <!-- SCREENSHOT 6: ADMIN VARIABLES MANAGER -->
  <div class="ui-screenshot-card">
    <div class="ui-screenshot-header">
      <span class="title">📸 SCREENSHOT 6: Plant Admin Variables &amp; Staff Roster Manager (/factory/admin)</span>
      <span class="badge badge-amber">Admin Control Tower</span>
    </div>
    <img src="${imgAdminVariables}" class="ui-screenshot-img" alt="Plant Admin Variables Manager" />
    <div class="ui-screenshot-caption">
      <strong>Where to enter data:</strong> Switch between the 4 tabs: <em>Staff Roster &amp; PINs</em>, <em>Shift Timetable</em>, <em>Product Pricing &amp; Metrics</em>, and <em>Plant &amp; Bank Details</em>. Click <span class="arrow-pointer">Save &amp; Sync Across All Devices</span> to update all factory phones instantly.
    </div>
  </div>

  <h4>What Mr. Obi Can Adjust in Real-Time:</h4>
  <ol>
    <li><strong>Staff Roster &amp; PIN Manager:</strong>
      <ul>
        <li>Click <span class="arrow-pointer">+ Add New Staff Member</span> to register a new driver, supervisor, or cashier.</li>
        <li>Assign delivery routes (e.g. <em>Ibrahim – Truck 3 (Epe Route)</em>) and set custom 4-digit PINs.</li>
        <li>Newly added staff appear immediately on the Staff Login screen with their chosen avatar color.</li>
      </ul>
    </li>
    <li><strong>Shift Timetable &amp; WhatsApp Schedules:</strong>
      <ul>
        <li>Adjust morning opening time (default <span class="code-tag">07:00</span>) and closing time (default <span class="code-tag">18:00</span>).</li>
        <li>Set the automated WhatsApp digest trigger time (default <span class="code-tag">20:00</span> / 8:00 PM).</li>
        <li>Toggle 24-hour night shift on/off for peak hot dry season demand.</li>
      </ul>
    </li>
    <li><strong>Wholesale Pricing &amp; Anti-Theft Metrics:</strong>
      <ul>
        <li>Change sachet wholesale price (e.g. from ₦350 to ₦400/bag).</li>
        <li>Change 75cl pack price (₦1,200), 50cl pack price (₦1,100), and 19L jar refill price (₦900).</li>
        <li>Adjust the <strong>Battered Jar Replacement Penalty</strong> (default ₦4,500/jar).</li>
        <li>Calibrate the PET Preform Gram Weight (18.0g) and generator diesel price (₦1,350/L).</li>
      </ul>
    </li>
    <li><strong>Plant Details &amp; Moniepoint Bank Account:</strong>
      <ul>
        <li>Update official plant address, desk hotline (<span class="code-tag">0802 279 1227</span>), and corporate account: <strong>Moniepoint Microfinance Bank (6805375225 — Bethelmind Digital Solutions)</strong>.</li>
      </ul>
    </li>
  </ol>

  <div class="page-break"></div>

  <!-- =====================================================================
       PAGE 9: SECTION 3: VIDEO TRAINING CENTER
  ====================================================================== -->
  <div class="header">
    <div class="header-logo">💧 OBI TABLE WATER OS</div>
    <div class="header-meta">Section 3: Interactive Video Training Center &amp; Audio Voiceover Guide</div>
  </div>

  <h2>3. Interactive Video Training Center &amp; Audio Player</h2>
  <p><strong>URL:</strong> <span class="code-tag">https://www.bethelmindanalytics.com/factory/walkthrough</span> &bull; <strong>Audience:</strong> Factory Owner, Staff &amp; New Trainees</p>
  <p>To ensure any new worker can operate the software within 15 minutes, the system includes an embedded video training academy with synchronized Nigerian audio narration.</p>

  <div class="card" style="background: #0f172a; color: #ffffff; padding: 12px; margin-bottom: 12px;">
    <div style="font-size: 11pt; font-weight: bold; color: #38bdf8; margin-bottom: 4px;">
      🎬 1280x720 High-Definition Walkthrough Video (194s • 6.73 MB)
    </div>
    <p style="color: #cbd5e1; font-size: 8pt; margin: 0 0 8px 0;">
      Contains all 13 production scenes: Owner PIN, Net Profit, Bottling &amp; Preforms, Driver Manifests, Sachet Roll Logger, Moniepoint RRN Gate POS, 19L Jar Quality Inspection, WhatsApp Digest, and the new Plant Admin &amp; Variables Manager.
    </p>
    <div style="display: flex; gap: 8px;">
      <span class="badge badge-emerald">✓ Faststart Mobile Streaming</span>
      <span class="badge">Abeo Lagos Voiceover (24kHz Mono)</span>
      <span class="badge badge-amber">100% Offline Compatible</span>
    </div>
  </div>

  <h4>The 7 Step-by-Step Training Chapters:</h4>
  <div class="grid-2">
    <div class="card">
      <div class="card-title">Chapter 1: Zero-Password Staff Login (00:00 - 00:35)</div>
      <p style="font-size: 7.5pt; margin: 0;">How staff select their visual card, enter their 4-digit PIN, and access their dedicated consoles without typing passwords.</p>
    </div>
    <div class="card">
      <div class="card-title">Chapter 2: Supervisor Sachet Logger (00:35 - 01:10)</div>
      <p style="font-size: 7.5pt; margin: 0;">Tapping <em>+Finished Another Roll (+1 Roll)</em> as 20kg rolls finish on the sealing machine. Real-time bag output and value calculation.</p>
    </div>
    <div class="card">
      <div class="card-title">Chapter 3: Bottling &amp; Preform Scrap Scale (01:10 - 01:45)</div>
      <p style="font-size: 7.5pt; margin: 0;">Logging 75cl/50cl packs and 19L jar refills. Weighing crushed blow rejects on the digital scale ($18.0\\text{g}/\\text{pc}$) to verify claimed defects.</p>
    </div>
    <div class="card">
      <div class="card-title">Chapter 4: Gate Cashier POS &amp; RRN Lock (01:45 - 02:15)</div>
      <p style="font-size: 7.5pt; margin: 0;">Entering customer sales, typing the Moniepoint POS terminal RRN, and issuing tamper-proof Gate Clearance Passes (<span class="code-tag">GP-842</span>).</p>
    </div>
    <div class="card">
      <div class="card-title">Chapter 5: Driver Manifest &amp; 19L Jars (02:15 - 02:40)</div>
      <p style="font-size: 7.5pt; margin: 0;">Confirming loaded mixed truckloads, physical burst pouch return verification, and the ₦4,500 damaged dispenser jar penalty.</p>
    </div>
    <div class="card">
      <div class="card-title">Chapter 6: Executive Owner Profit &amp; WhatsApp (02:40 - 03:00)</div>
      <p style="font-size: 7.5pt; margin: 0;">Audited Net Cash Profit card (₦524,200), generator diesel overhead slicer, and the automated 8:00 PM WhatsApp Shift Summary.</p>
    </div>
  </div>

  <div class="page-break"></div>

  <!-- =====================================================================
       PAGE 10: SECTION 4: GENERAL FACTORY OPERATIONS & WATER TREATMENT
  ====================================================================== -->
  <div class="header">
    <div class="header-logo">💧 OBI TABLE WATER OS</div>
    <div class="header-meta">Section 4: General Factory Operations &amp; 6-Stage Water Treatment</div>
  </div>

  <h2>4. General Factory Operations &amp; Water Treatment Protocol</h2>

  <p>The foundation of a reputable, high-margin water manufacturing business in Nigeria is consistent water purity compliant with <strong>NAFDAC Regulations &amp; NIS 306:2008 Standards</strong>.</p>

  <h3>4.1 The 6-Stage Industrial Water Treatment Train</h3>
  <div class="grid-2">
    <div class="card">
      <div class="card-title">Stage 1: Aeration &amp; Sediment Settling</div>
      <p style="font-size: 7.5pt; margin: 0;">Raw borehole water is aerated into raw water tanks to precipitate dissolved ferrous iron ($Fe^{2+}$) into ferric hydroxide ($Fe(OH)_3$). Minimum settling time: 4 hours.</p>
    </div>
    <div class="card">
      <div class="card-title">Stage 2: Manganese Greensand &amp; Media</div>
      <p style="font-size: 7.5pt; margin: 0;">Multi-media sand filter removes turbidity and suspended particulate matter (&gt; 20 microns). Backwashed every 48 operating hours.</p>
    </div>
    <div class="card">
      <div class="card-title">Stage 3: Activated Granular Carbon (GAC)</div>
      <p style="font-size: 7.5pt; margin: 0;">High-iodine activated carbon absorbs dissolved organic matter, eliminates swampy borehole odors, and ensures crystal clarity and sweet taste.</p>
    </div>
    <div class="card">
      <div class="card-title">Stage 4: Micro-Filtration Polishing (5μm / 1μm)</div>
      <p style="font-size: 7.5pt; margin: 0;">Dual polypropylene spun sediment cartridges trap micro-fines before water reaches high-pressure RO booster pumps. Cartridges replaced monthly.</p>
    </div>
    <div class="card">
      <div class="card-title">Stage 5: Industrial Reverse Osmosis (RO)</div>
      <p style="font-size: 7.5pt; margin: 0;">High-pressure polyamide membrane rejects 98.5% of dissolved minerals, heavy metals, nitrates, and salts. Permeate TDS maintained at <strong>15–45 ppm</strong>.</p>
    </div>
    <div class="card">
      <div class="card-title">Stage 6: Ozone Dosing &amp; UV Sterilization</div>
      <p style="font-size: 7.5pt; margin: 0;">Water passes through an ultraviolet germicidal chamber (254nm wavelength) and mild ozone injection to provide residual shelf-life disinfection in sealed bottles.</p>
    </div>
  </div>

  <h3>4.2 Daily NAFDAC Water Quality Thresholds</h3>
  <table>
    <thead>
      <tr>
        <th>Quality Parameter</th>
        <th>Target Range (Obi Table Water)</th>
        <th>NAFDAC Max Allowable</th>
        <th>Testing Frequency</th>
        <th>Corrective Action If Out of Spec</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Total Dissolved Solids (TDS)</strong></td>
        <td><strong>15 – 45 ppm</strong></td>
        <td>&le; 100 ppm</td>
        <td>Every 2 hours during shift</td>
        <td>Flush RO membrane; check permeate blend valve.</td>
      </tr>
      <tr>
        <td><strong>pH Level</strong></td>
        <td><strong>6.8 – 7.4 (Neutral)</strong></td>
        <td>6.5 – 8.5</td>
        <td>Start &amp; midday of shift</td>
        <td>Calibrate remineralization calcite cartridge.</td>
      </tr>
      <tr>
        <td><strong>Turbidity (NTU)</strong></td>
        <td><strong>&lt; 0.5 NTU (Clear)</strong></td>
        <td>&le; 5.0 NTU</td>
        <td>Daily visual &amp; meter</td>
        <td>Backwash media sand and GAC carbon filters.</td>
      </tr>
      <tr>
        <td><strong>UV Lamp Intensity</strong></td>
        <td><strong>&ge; 30 mJ/cm&sup2;</strong></td>
        <td>&ge; 25 mJ/cm&sup2;</td>
        <td>Weekly hour counter check</td>
        <td>Replace quartz sleeve or UV bulb (&gt; 9,000 hrs).</td>
      </tr>
    </tbody>
  </table>

  <div class="page-break"></div>

  <!-- =====================================================================
       PAGE 11: SECTION 5: THE 5 ANTI-FRAUD STANDARD OPERATING PROCEDURES
  ====================================================================== -->
  <div class="header">
    <div class="header-logo">💧 OBI TABLE WATER OS</div>
    <div class="header-meta">Section 5: The 5 Anti-Fraud Standard Operating Procedures (SOPs)</div>
  </div>

  <h2>5. The 5 Anti-Fraud Standard Operating Procedures (SOPs)</h2>

  <div class="callout callout-danger">
    <strong>Loss Prevention Doctrine:</strong> Nigerian water factories do not fail due to lack of customer demand; they fail due to unrecorded packaging leaks, fake POS transfer alerts, unreturned empty bottles, and fabricated driver pothole burst claims. These 5 SOPs eliminate 100% of these leaks.
  </div>

  <div class="card" style="margin-bottom: 8px;">
    <div class="card-title">SOP 1: Sachet LDPE Film Yield Formula (16 Bags per Kg)</div>
    <p style="font-size: 7.5pt; margin: 0;">
      A standard 20kg printed roll of 320mm / 45-micron LDPE nylon film must produce exactly 300 to 320 bags of sachet water (15–16 bags per kilogram).<br/>
      &bull; <strong>Formula:</strong> $\\text{Expected Bags} = \\text{Rolls Used} \\times 300\\text{ bags}$.<br/>
      &bull; <strong>Allowance:</strong> A maximum burst/defect allowance of 1% (3 bags per roll) is permitted for sealing bar startup.<br/>
      &bull; <strong>Audit:</strong> If 14 rolls are loaded (4,200 expected bags) but only 3,600 bags enter the store, the system flags a <strong>600-bag deficit (₦210,000)</strong> as an unrecorded ghost shift.
    </p>
  </div>

  <div class="card" style="margin-bottom: 8px;">
    <div class="card-title">SOP 2: The Physical Burst Pouch Counting Rule (Sachet Water)</div>
    <p style="font-size: 7.5pt; margin: 0;">
      Drivers frequently claim bags burst on bad roads to pocket cash collections.<br/>
      &bull; <strong>The Rule:</strong> Drivers must surrender the exact physical wet, printed burst pouches to gate security.<br/>
      &bull; <strong>Enforcement:</strong> If Musa claims 40 bags burst but returns 0 empty pouches, the claim is automatically rejected.<br/>
      &bull; <strong>Auto-Debit:</strong> The system automatically logs a debit of $40 \\times \\text{₦350} = \\mathbf{₦14,000}$ directly against Musa's account.
    </p>
  </div>

  <div class="card" style="margin-bottom: 8px;">
    <div class="card-title">SOP 3: PET Preform Scrap Scale Grammage Audit (Bottled Water)</div>
    <p style="font-size: 7.5pt; margin: 0;">
      Workers smuggle virgin 18.0g PET preforms off-site by falsely recording them as "blow-mold rejects".<br/>
      &bull; <strong>The Rule:</strong> For every bottle claimed defective, the crushed plastic scrap must be weighed on a physical digital scale.<br/>
      &bull; <strong>Formula:</strong> $\\text{Theoretical Weight} = \\text{Claimed Blow Rejects} \\times 18.0\\text{ grams}$.<br/>
      &bull; <strong>Tolerance:</strong> Weight must match within &plusmn;15 grams. If 24 rejects are claimed (432g target) but scale reads only 200g, the system triggers: <em>"⚠️ Preform Smuggling Risk: Missing 232g of PET plastic!"</em>
    </p>
  </div>

  <div class="card" style="margin-bottom: 8px;">
    <div class="card-title">SOP 4: Moniepoint POS Terminal RRN Verification &amp; Gate Clearance Pass</div>
    <p style="font-size: 7.5pt; margin: 0;">
      Eliminates fake bank alerts generated via SMS spoofing or fake banking apps.<br/>
      &bull; <strong>The Rule:</strong> Blessing cannot generate a receipt for bank transfers without entering the last 4 digits of the printed POS slip's Retrieval Reference Number (RRN).<br/>
      &bull; <strong>Gate Clearance:</strong> Generates a 3-digit gate code (<span class="badge badge-emerald">GP-842</span>). Gate guards will NOT open the gate barrier until the driver recites the matching code.
    </p>
  </div>

  <div class="card">
    <div class="card-title">SOP 5: 19L Dispenser Jar Quality Inspection &amp; Replacement Debit</div>
    <p style="font-size: 7.5pt; margin: 0;">
      Polycarbonate 19L dispenser jars cost ₦4,500 each. Unreturned or damaged containers destroy profits.<br/>
      &bull; <strong>The Rule:</strong> Every dispatched jar must be replaced with an Obi-branded clean reusable empty jar.<br/>
      &bull; <strong>Penalty:</strong> Battered, cracked, or third-party competitor jars are rejected at the gate. The system debits <strong>₦4,500 per lost/damaged container</strong> from the driver's weekly remittance.
    </p>
  </div>

  <div class="page-break"></div>

  <!-- =====================================================================
       PAGE 12: SECTION 6: SHIFT TIMETABLE, GENERATOR ECONOMICS & CONTACT
  ====================================================================== -->
  <div class="header">
    <div class="header-logo">💧 OBI TABLE WATER OS</div>
    <div class="header-meta">Section 6: Shift Timetable, Generator Economics &amp; Emergency Recovery</div>
  </div>

  <h2>6. Daily Shift Timetable, Generator Economics &amp; Support</h2>

  <h3>6.1 Daily Operational Timetable (Standard Batch A)</h3>
  <table>
    <thead>
      <tr>
        <th>Time</th>
        <th>Activity</th>
        <th>Responsible Staff</th>
        <th>Verification Checkpoint</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>07:00 AM</strong></td>
        <td>Plant Opening, Power Check &amp; RO Warmup</td>
        <td>Kenneth (Supervisor)</td>
        <td>Check raw water tank level, diesel drum &amp; UV lamp.</td>
      </tr>
      <tr>
        <td><strong>07:30 AM</strong></td>
        <td>Water Purity Baseline Calibration</td>
        <td>Kenneth (Supervisor)</td>
        <td>Measure TDS (&lt; 45 ppm) and pH (6.8–7.4). Log in system.</td>
      </tr>
      <tr>
        <td><strong>08:00 AM</strong></td>
        <td>Fleet Dispatch Loading (Truck 1 &amp; Truck 2)</td>
        <td>Musa / Emeka (Drivers)</td>
        <td>Confirm loaded bags, bottles &amp; jars match manifest.</td>
      </tr>
      <tr>
        <td><strong>08:30 AM</strong></td>
        <td>Gate Sales Kiosk Opens</td>
        <td>Blessing (Cashier)</td>
        <td>Confirm starting physical cash drawer is ₦0.00.</td>
      </tr>
      <tr>
        <td><strong>01:00 PM</strong></td>
        <td>Midday Output &amp; Nylon Roll Audit</td>
        <td>Kenneth (Supervisor)</td>
        <td>Verify rolls consumed vs bags sealed on form-fill-seal machines.</td>
      </tr>
      <tr>
        <td><strong>05:30 PM</strong></td>
        <td>Fleet Returns &amp; Empty Jar Quality Inspection</td>
        <td>Musa / Gate Security</td>
        <td>Count physical burst pouches; inspect 19L dispenser jars.</td>
      </tr>
      <tr>
        <td><strong>06:00 PM</strong></td>
        <td>Cashier Drawer Count &amp; Moniepoint Slip Audit</td>
        <td>Blessing &amp; Kenneth</td>
        <td>Match physical paper notes to POS transfer ledger.</td>
      </tr>
      <tr>
        <td><strong>08:00 PM</strong></td>
        <td>Automated WhatsApp Evening Shift Digest</td>
        <td>Kenneth &rarr; Mr. Obi</td>
        <td>WhatsApp digest delivered to Mr. Obi (<span class="code-tag">0802 279 1227</span>).</td>
      </tr>
    </tbody>
  </table>

  <h3>6.2 Generator Diesel &amp; Energy Overhead Slicer</h3>
  <div class="callout callout-warning">
    <strong>Generator Profitability Guard:</strong>  
    $$\\text{Energy Cost per Sachet Bag} = \\frac{\\text{Diesel Liters Burned} \\times \\text{Price per Liter}}{\\text{Total Sachet Bags Produced}}$$
    &bull; Standard Benchmark: 32 Liters @ ₦1,350/L = ₦43,200. Output: 4,200 bags = <strong>₦10.28 per bag</strong>.<br/>
    &bull; Alert Threshold: If diesel cost exceeds <strong>₦12.00 per bag</strong>, the system triggers a red warning: generator is idling unnecessarily or unmetered power theft is occurring.
  </div>

  <h3>6.3 Offline Disaster Recovery (Zero-Downtime Guarantee)</h3>
  <p>If internet connection (MTN/Airtel/Glo) drops completely during the shift:</p>
  <ol>
    <li>The software continues operating without any interruption using browser local storage.</li>
    <li>Staff can log rolls, record sales, verify preform weights, and calculate driver shortages offline.</li>
    <li>When network restores, the system synchronizes all stored transactions to the central cloud ledger automatically.</li>
  </ol>

  <div class="card" style="margin-top: 10px; background: #f0fdf4; border: 1.5px solid #16a34a; text-align: center; padding: 10px;">
    <strong style="color: #15803d; font-size: 9pt; display: block; margin-bottom: 3px;">
      ✅ CERTIFIED FACTORY OPERATING SYSTEM &bull; READY FOR LIVE PRODUCTION
    </strong>
    <p style="font-size: 7.5pt; color: #166534; margin: 0;">
      Developed &amp; Maintained by <strong>Bethelmind Digital Solutions</strong> (CAC Reg: 9912717)<br/>
      Corporate Hotline: <strong>0802 279 1227</strong> &bull; Direct WhatsApp: <strong>wa.me/2348022791227</strong><br/>
      Corporate Settlements: <strong>Moniepoint Microfinance Bank (6805375225 — Bethelmind Digital Solutions)</strong>
    </p>
  </div>

</body>
</html>
  `;

  console.log('Launching headless Chromium to render 12-page Illustrated PDF...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'networkidle' });

  await page.pdf({
    path: destPdf1,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '10mm',
      bottom: '10mm',
      left: '10mm',
      right: '10mm'
    }
  });

  // Also copy to public/downloads/ for fast web downloads
  fs.copyFileSync(destPdf1, destPdf2);

  await browser.close();

  const stats = fs.statSync(destPdf1);
  const sizeMb = (stats.size / 1024 / 1024).toFixed(2);
  console.log(`\n🎉 VISUAL MASTER OPERATING MANUAL COMPILED SUCCESSFULLY!`);
  console.log(`📁 Delivery Pack: ${destPdf1} (${sizeMb} MB)`);
  console.log(`📁 Web Download:  ${destPdf2} (${sizeMb} MB)`);
}

buildVisualHandbook().catch(err => {
  console.error('❌ Visual Manual PDF Generation Error:', err);
  process.exit(1);
});
