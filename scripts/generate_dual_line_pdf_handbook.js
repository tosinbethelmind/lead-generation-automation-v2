/**
 * @file scripts/generate_dual_line_pdf_handbook.js
 * 
 * 💧 OBI TABLE WATER OS — MASTER COMPREHENSIVE OPERATING MANUAL & UI NAVIGATION HANDBOOK
 * 
 * Exhaustive Master Manual Covering Every Aspect:
 * 1. Complete UI Navigation Guide (Every button, screen, tab, input, toggle, and error alert)
 * 2. 5 Staff & Owner Role Workflows (Mr. Obi, Kenneth, Blessing, Musa, Security)
 * 3. Dual-Line Manufacturing Engineering (Sachet Pure Water + PET Bottling + 19L Dispenser Jars)
 * 4. Water Treatment & NAFDAC Purity Standards (RO, Ozone, UV, TDS, pH)
 * 5. The 5 Anti-Fraud & Loss Control SOPs (Film yield, burst pouches, scrap scale, POS RRN lock, jar deposit)
 * 6. Generator Diesel & Energy Slicer Economics
 * 7. Troubleshooting, Machine Jams & Offline Disaster Recovery
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

async function generateMasterHandbook() {
  console.log('📄 Rendering Exhaustive Master Operating Manual & UI Navigation PDF...');

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Obi Table Water OS — Master Comprehensive Operating Manual & UI Navigation Guide</title>
  <style>
    @page {
      size: A4;
      margin: 16mm 14mm 16mm 14mm;
      @bottom-right {
        content: "Page " counter(page) " of " counter(pages);
        font-size: 8pt;
        color: #64748b;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      @bottom-left {
        content: "Obi Table Water OS • Master Operating Manual (Dual-Line Edition)";
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
      line-height: 1.45;
      font-size: 9.5pt;
      background: #ffffff;
      margin: 0;
      padding: 0;
    }
    .header {
      border-bottom: 2px solid #0284c7;
      padding-bottom: 8px;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .header-logo {
      font-size: 14pt;
      font-weight: 900;
      color: #0369a1;
      letter-spacing: -0.5px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .header-meta {
      font-size: 8pt;
      color: #64748b;
      text-align: right;
      line-height: 1.3;
    }
    h1 {
      font-size: 19pt;
      font-weight: 900;
      color: #0f172a;
      line-height: 1.2;
      margin: 0 0 6px 0;
      letter-spacing: -0.5px;
    }
    .subtitle {
      font-size: 11pt;
      color: #0369a1;
      font-weight: 700;
      margin-bottom: 14px;
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
      margin-bottom: 10px;
    }
    .badge-amber {
      background: #fef3c7;
      color: #92400e;
      border-color: #fde68a;
    }
    .badge-emerald {
      background: #dcfce7;
      color: #166534;
      border-color: #bbf7d0;
    }
    h2 {
      font-size: 12pt;
      font-weight: 800;
      color: #0f172a;
      border-bottom: 1.5px solid #e2e8f0;
      padding-bottom: 4px;
      margin-top: 18px;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    h3 {
      font-size: 10pt;
      font-weight: 700;
      color: #1e293b;
      margin-top: 12px;
      margin-bottom: 4px;
    }
    h4 {
      font-size: 9pt;
      font-weight: 700;
      color: #475569;
      margin-top: 8px;
      margin-bottom: 2px;
    }
    p {
      margin: 0 0 7px 0;
      color: #334155;
    }
    ul, ol {
      margin: 0 0 8px 0;
      padding-left: 18px;
      color: #334155;
    }
    li {
      margin-bottom: 3px;
    }
    .callout {
      background: #f8fafc;
      border-left: 4px solid #0284c7;
      padding: 8px 12px;
      margin: 10px 0;
      border-radius: 0 6px 6px 0;
      font-size: 8.5pt;
      line-height: 1.4;
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
      margin: 8px 0 12px 0;
      font-size: 8pt;
    }
    th, td {
      border: 1px solid #cbd5e1;
      padding: 5px 7px;
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
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin: 8px 0 12px 0;
    }
    .grid-3 {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 8px;
      margin: 8px 0 12px 0;
    }
    .grid-4 {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      gap: 6px;
      margin: 8px 0 12px 0;
    }
    .card {
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 8px 10px;
      background: #ffffff;
    }
    .card-title {
      font-weight: 800;
      font-size: 9.5pt;
      color: #0f172a;
      margin-bottom: 3px;
    }
    .card-sub {
      font-size: 7.5pt;
      color: #64748b;
      margin-bottom: 5px;
    }
    .ui-mockup {
      border: 1.5px solid #0284c7;
      border-radius: 8px;
      background: #0f172a;
      color: #ffffff;
      padding: 10px 12px;
      margin: 10px 0;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 8pt;
    }
    .ui-mockup .ui-header {
      border-bottom: 1px solid #334155;
      padding-bottom: 4px;
      margin-bottom: 6px;
      display: flex;
      justify-content: space-between;
      color: #38bdf8;
      font-weight: bold;
    }
    .ui-button {
      display: inline-block;
      background: #0284c7;
      color: #ffffff;
      padding: 3px 8px;
      border-radius: 4px;
      font-weight: bold;
      font-size: 7.5pt;
      margin: 2px 0;
    }
    .ui-button-green {
      background: #16a34a;
    }
    .ui-button-amber {
      background: #d97706;
    }
    .ui-button-rose {
      background: #e11d48;
    }
    .page-break {
      page-break-before: always;
    }
    .toc {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 10px 14px;
      margin: 12px 0;
      font-size: 8.5pt;
    }
    .toc-item {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px dotted #cbd5e1;
      padding: 3px 0;
    }
    .footer-note {
      font-size: 7.5pt;
      color: #94a3b8;
      text-align: center;
      margin-top: 20px;
      border-top: 1px solid #e2e8f0;
      padding-top: 6px;
    }
    .code-tag {
      background: #f1f5f9;
      color: #0f172a;
      padding: 1px 4px;
      border-radius: 3px;
      font-family: monospace;
      font-size: 8pt;
      border: 1px solid #e2e8f0;
    }
  </style>
</head>
<body>

  <!-- =====================================================================
       PAGE 1: TITLE & TABLE OF CONTENTS
  ====================================================================== -->
  <div class="header">
    <div class="header-logo">💧 OBI TABLE WATER OS</div>
    <div class="header-meta">
      Dual-Line Plant Edition • Master Operational Manual &amp; UI Guide<br/>
      Certified: Bethelmind Digital Solutions (CAC: Reg 9912717)
    </div>
  </div>

  <span class="badge">Master Operational Bible • Version 5.0 Production Edition</span>
  <h1>Complete Factory Operations, User Interface Navigation &amp; Loss Control Manual</h1>
  <div class="subtitle">The Exhaustive Guide for Factory Owners, Supervisors, Cashiers &amp; Drivers</div>

  <div class="callout callout-success">
    <strong>Executive Operational Mandate:</strong> This document serves as the complete, permanent training and operating bible for the Obi Table Water &amp; Bottling Plant. It covers every screen, every button, every financial calculation, and every anti-theft protocol enforced by the Obi Table Water Operating System.
  </div>

  <div class="toc">
    <strong style="color: #0369a1; display: block; margin-bottom: 6px; font-size: 9.5pt;">📖 TABLE OF CONTENTS</strong>
    <div class="toc-item"><span>Section 1: Executive Overview &amp; The Dual-Line Manufacturing Model</span><span>Page 2</span></div>
    <div class="toc-item"><span>Section 2: Complete User Interface &amp; Screen-by-Screen Navigation Guide</span><span>Page 3</span></div>
    <div class="toc-item"><span>&nbsp;&nbsp;&bull; Screen 1: Staff Visual Login &amp; PIN Authentication (/factory/login)</span><span>Page 3</span></div>
    <div class="toc-item"><span>&nbsp;&nbsp;&bull; Screen 2: Supervisor Console — Dual Production Lines (Kenneth)</span><span>Page 4</span></div>
    <div class="toc-item"><span>&nbsp;&nbsp;&bull; Screen 3: Gate Cashier POS &amp; Moniepoint RRN Lock (Blessing)</span><span>Page 5</span></div>
    <div class="toc-item"><span>&nbsp;&nbsp;&bull; Screen 4: Route Delivery Driver Manifest &amp; Jar Quality (Musa)</span><span>Page 6</span></div>
    <div class="toc-item"><span>&nbsp;&nbsp;&bull; Screen 5: Executive Owner Portal &amp; Financial P&amp;L (Mr. Obi)</span><span>Page 7</span></div>
    <div class="toc-item"><span>&nbsp;&nbsp;&bull; Screen 6: Interactive Video Training Center (/factory/walkthrough)</span><span>Page 8</span></div>
    <div class="toc-item"><span>Section 3: General Factory Operations Manual &amp; Water Treatment Protocol</span><span>Page 9</span></div>
    <div class="toc-item"><span>Section 4: The 5 Anti-Fraud Standard Operating Procedures (SOPs)</span><span>Page 10</span></div>
    <div class="toc-item"><span>Section 5: Daily Shift Timetable &amp; Machine Maintenance Protocols</span><span>Page 11</span></div>
    <div class="toc-item"><span>Section 6: Emergency Troubleshooting, Offline Recovery &amp; Factory Contact</span><span>Page 12</span></div>
  </div>

  <div class="card" style="margin-top: 10px; background: #f8fafc;">
    <strong style="font-size: 8.5pt; color: #0f172a;">Plant Identification &amp; Technical Support Registry:</strong>
    <div class="grid-2" style="font-size: 8pt; margin-top: 4px;">
      <div>
        &bull; <strong>Factory Name:</strong> Obi Table &amp; Bottled Water Plant<br/>
        &bull; <strong>Operating System:</strong> Obi Table Water OS (v5.0 Hardened)<br/>
        &bull; <strong>Production Lines:</strong> Sachet Water + Bottled (50cl/75cl) + 19L Jars<br/>
        &bull; <strong>Corporate Desk:</strong> Bethelmind Digital Solutions (CAC: 9912717)
      </div>
      <div>
        &bull; <strong>Owner Desk:</strong> wa.me/2348022791227 (Hotline: 0802 279 1227)<br/>
        &bull; <strong>Corporate Bank:</strong> Moniepoint Microfinance Bank<br/>
        &bull; <strong>Settlement Account:</strong> 6805375225 (Bethelmind Digital Solutions)<br/>
        &bull; <strong>Cloud Hosting:</strong> Vercel Production Edge &bull; Offline-Ready
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
        <td>Extremely Fast (4,200 bags/day)</td>
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
      <p style="font-size: 8pt; margin: 0;">
        &bull; Volume: 4,200 Bags (14 Nylon Rolls)<br/>
        &bull; Gross Sales: <strong>₦1,470,000</strong> (74.6% of Plant Revenue)<br/>
        &bull; Consumables: 280kg LDPE film (₦280,000)<br/>
        &bull; Net Cash Contribution: <strong>₦168,000</strong>
      </p>
    </div>
    <div class="card" style="border-left: 4px solid #16a34a;">
      <div class="card-title">🍾 Bottling &amp; Dispenser Line Contribution</div>
      <p style="font-size: 8pt; margin: 0;">
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
    $$\text{Today's Net Cash Profit} = \text{Total Gross Gate Sales} - (\text{Diesel Cost} + \text{Packaging Consumables} + \text{Labour Wages} + \text{Driver Shortage Debits})$$
    On this system, Mr. Obi never waits for monthly account reconciliation. At 8:00 PM every evening, his mobile screen reflects the confirmed Net Cash in hand: <strong>₦524,200</strong>.
  </div>

  <div class="page-break"></div>

  <!-- =====================================================================
       PAGE 3: SECTION 2: UI NAVIGATION — SCREEN 1: STAFF LOGIN
  ====================================================================== -->
  <div class="header">
    <div class="header-logo">💧 OBI TABLE WATER OS</div>
    <div class="header-meta">Section 2: UI Navigation Guide • Screen 1: Staff Visual Login</div>
  </div>

  <h2>2. Screen-by-Screen UI Navigation Guide</h2>

  <h3>Screen 1: Zero-Password Staff Visual Login</h3>
  <p><strong>URL:</strong> <span class="code-tag">https://www.bethelmindanalytics.com/factory/login</span> &bull; <strong>Access:</strong> All Factory Personnel &amp; Plant Owner</p>
  <p>Traditional email and password systems fail catastrophically in Nigerian manufacturing environments. Machine operators and drivers forget passwords, share credentials, or lock accounts. Obi Table Water OS replaces passwords with a high-contrast, visual role selector and 4-digit numeric PINs.</p>

  <div class="ui-mockup">
    <div class="ui-header">
      <span>💧 Obi Table &amp; Bottled Water OS</span>
      <span>🟢 Offline-Ready</span>
    </div>
    <div style="color: #94a3b8; font-size: 7.5pt; margin-bottom: 6px;">Who is logging in today? Tap your picture card below:</div>
    <div style="display: flex; gap: 6px; margin-bottom: 6px;">
      <div style="background: #1e293b; padding: 6px; border-radius: 4px; flex: 1;">👑 <strong>Mr. Obi</strong> (Owner) • PIN: 2026</div>
      <div style="background: #1e293b; padding: 6px; border-radius: 4px; flex: 1;">📋 <strong>Kenneth</strong> (Supervisor) • PIN: 1111</div>
    </div>
    <div style="display: flex; gap: 6px;">
      <div style="background: #1e293b; padding: 6px; border-radius: 4px; flex: 1;">💰 <strong>Blessing</strong> (Cashier) • PIN: 2222</div>
      <div style="background: #1e293b; padding: 6px; border-radius: 4px; flex: 1;">🚚 <strong>Musa</strong> (Driver) • PIN: 3333</div>
    </div>
  </div>

  <h4>Navigation &amp; Interaction Checklist:</h4>
  <ol>
    <li><strong>Selecting Your Role:</strong> Tap on the large rectangular card bearing your name and icon. The role selector smoothly slides into the 4-digit PIN pad.</li>
    <li><strong>Entering Your PIN:</strong> A 3&times;4 touch keypad is displayed with large numbered buttons (<span class="ui-button">1</span> to <span class="ui-button">9</span>, <span class="ui-button">0</span>, and <span class="ui-button ui-button-amber">Clear</span>). Tap your 4-digit PIN. As you tap each digit, the 4 PIN dots fill with blue illumination.</li>
    <li><strong>Server-Side Constant-Time Validation:</strong> Upon tapping the 4th digit, the system dispatches a background cryptographic request to <span class="code-tag">/api/factory/auth</span>. A blue status indicator states: <em>"Verifying PIN with Server Security..."</em>.</li>
    <li><strong>Incorrect PIN Handling:</strong> If the wrong PIN is entered, the 4 dots pulse red, the terminal vibrates, and a clear red error message appears: <em>"Incorrect PIN entered. 4 attempts remaining."</em> The keypad resets automatically after 1.2 seconds.</li>
    <li><strong>Brute-Force Rate Limiter:</strong> If an unauthorized person enters 5 incorrect PINs consecutively, the security engine blocks the IP for 15 minutes, preventing dictionary attacks.</li>
    <li><strong>Offline Fallback:</strong> If factory Wi-Fi or cellular broadband drops completely, the system seamlessly verifies the PIN against encrypted local storage so factory operations never freeze.</li>
    <li><strong>Switching Staff:</strong> To log out or hand over to another worker, tap the red <span class="ui-button ui-button-rose">Switch Staff</span> button in the top right corner.</li>
  </ol>

  <div class="callout callout-warning">
    <strong>Training Tip for New Staff:</strong> During onboarding, workers can tap the green text link at the bottom: <span style="color: #16a34a; font-weight: bold;">"Auto-Enter Demo PIN &rarr;"</span> to immediately understand how the console opens without typing.
  </div>

  <div class="page-break"></div>

  <!-- =====================================================================
       PAGE 4: SECTION 2: UI NAVIGATION — SCREEN 2: SUPERVISOR CONSOLE
  ====================================================================== -->
  <div class="header">
    <div class="header-logo">💧 OBI TABLE WATER OS</div>
    <div class="header-meta">Section 2: UI Navigation Guide • Screen 2: Supervisor Console (Kenneth)</div>
  </div>

  <h3>Screen 2: Shift Supervisor Dual-Line Console (Kenneth)</h3>
  <p><strong>Role:</strong> Kenneth (Plant Supervisor) &bull; <strong>PIN:</strong> <span class="code-tag">1111</span> &bull; <strong>Shift Time:</strong> 7:00 AM – 6:30 PM</p>
  <p>Kenneth is responsible for machine outputs, nylon consumption, preform blow-molding quality, generator fuel dips, and dispatching the official evening shift summary to Mr. Obi.</p>

  <div class="ui-mockup">
    <div class="ui-header">
      <span>Kenneth • Dual-Line Production Supervisor</span>
      <span>Batch A Live</span>
    </div>
    <div style="display: flex; gap: 4px; margin-bottom: 6px;">
      <span class="ui-button" style="background: #0284c7;">1. Sachet Water Line</span>
      <span class="ui-button" style="background: #334155;">2. Bottled Water &amp; Jars</span>
    </div>
    <div style="background: #1e293b; padding: 6px; border-radius: 4px; margin-bottom: 4px;">
      Sachet Nylon Rolls Used: <strong style="color: #4ade80;">14 rolls</strong> (= 4,200 bags packed • Value: ₦1,470,000)<br/>
      <span class="ui-button ui-button-green">+ Finished Another Roll (+1 Roll)</span>
      <span class="ui-button ui-button-rose">-1 Roll</span>
    </div>
    <div style="background: #1e293b; padding: 6px; border-radius: 4px; margin-bottom: 4px;">
      ⚖️ <strong>Preform Rejects &amp; Scrap Scale Audit:</strong> 24 pcs (= 432g target)<br/>
      Digital Scale Weight: <strong>432 grams</strong> <span style="color: #4ade80;">✓ Weight Verified</span>
    </div>
    <div style="background: #1e293b; padding: 6px; border-radius: 4px;">
      Generator Fuel Poured: [20L] [25L] <strong style="color: #fbbf24;">[30L]</strong> [40L]
    </div>
  </div>

  <h4>Navigation &amp; Operational Controls:</h4>
  <ol>
    <li><strong>Production Line Tabs:</strong> Tap <span class="ui-button">1. Sachet Water Line</span> to view and log pure water bags. Tap <span class="ui-button">2. Bottled Water &amp; Jars</span> to view 75cl, 50cl packs, 19L dispenser jars, and preform audits.</li>
    <li><strong>Logging Sachet Production (+1 Roll Used):</strong> Whenever a 20kg printed LDPE nylon roll finishes on the sealing machine, Kenneth taps the large green <span class="ui-button ui-button-green">+ Finished Another Roll (+1 Roll)</span> button. The system automatically increments the roll count, adds 300 bags to output, updates total value to ₦1,470,000, and auto-saves to local storage.</li>
    <li><strong>Correcting Sachet Errors (-1 Roll):</strong> If tapped by mistake, Kenneth taps the grey <span class="ui-button">-</span> button to decrement.</li>
    <li><strong>Logging Bottled Water Production:</strong> In Tab 2, Kenneth taps <span class="ui-button">+10 Packs</span> for 75cl bottles (₦1,200/pack), <span class="ui-button">+10 Packs</span> for 50cl bottles (₦1,100/pack), and <span class="ui-button">+5 Jars</span> for 19L dispenser refills (₦900/jar).</li>
    <li><strong>PET Preform Blow Rejects &amp; Digital Scrap Scale Audit:</strong>
      <ul>
        <li>Kenneth enters the number of claimed defective bottles in the <em>"Claimed Blow Rejects"</em> field (e.g. 24 pcs).</li>
        <li>The system calculates the theoretical weight: $24 \times 18.0\text{g} = 432\text{ grams}$.</li>
        <li>Kenneth crushes the plastic rejects, places them on the physical digital scale, and types the scale reading into <em>"Digital Scale Weight"</em>.</li>
        <li>If scale matches within &plusmn;15g: Green pill displays <span class="badge badge-emerald">✓ Weight Verified</span>.</li>
        <li>If scale is deficient (e.g. 200g): Red alert triggers: <em>"⚠️ Preform Smuggling Risk: Missing 232g of PET plastic!"</em></li>
      </ul>
    </li>
    <li><strong>Logging Generator Fuel Poured:</strong> Tap one of the 4 fuel buttons: <span class="ui-button">20L</span>, <span class="ui-button">25L</span>, <span class="ui-button">30L</span>, or <span class="ui-button">40L</span> based on liters poured from the drum.</li>
    <li><strong>Sending Evening Shift Report to Mr. Obi:</strong> At 6:00 PM, Kenneth taps the green WhatsApp bar: <span class="ui-button ui-button-green">📲 Send Dual-Line Shift Close to Mr. Obi on WhatsApp</span>. This compiles all sachet rolls, bottle packs, dispenser jars, preform scale balance, and diesel dips into a clean formatted text report and opens WhatsApp with Mr. Obi's direct line (<span class="code-tag">0802 279 1227</span>) pre-filled.</li>
  </ol>

  <div class="page-break"></div>

  <!-- =====================================================================
       PAGE 5: SECTION 2: UI NAVIGATION — SCREEN 3: CASHIER POS
  ====================================================================== -->
  <div class="header">
    <div class="header-logo">💧 OBI TABLE WATER OS</div>
    <div class="header-meta">Section 2: UI Navigation Guide • Screen 3: Gate Cashier POS (Blessing)</div>
  </div>

  <h3>Screen 3: Gate Cashier POS &amp; Moniepoint RRN Lock (Blessing)</h3>
  <p><strong>Role:</strong> Blessing (Gate Cashier) &bull; <strong>PIN:</strong> <span class="code-tag">2222</span> &bull; <strong>Location:</strong> Factory Gate Sales Kiosk</p>
  <p>Blessing is responsible for issuing receipts to walk-in distributors, verifying bank transfers, preventing fake alerts, and generating Gate Clearance Passes.</p>

  <div class="ui-mockup">
    <div class="ui-header">
      <span>Blessing • Gate Cashier POS</span>
      <span>Dual Line: Sachets &amp; Bottles</span>
    </div>
    <div style="display: flex; gap: 6px; margin-bottom: 6px;">
      <div style="background: #064e3b; padding: 6px; border-radius: 4px; flex: 1;">
        💵 Drawer Cash: <strong style="color: #4ade80;">₦145,000</strong>
      </div>
      <div style="background: #0c4a6e; padding: 6px; border-radius: 4px; flex: 1;">
        🏦 Moniepoint Transfers: <strong style="color: #38bdf8;">₦115,000</strong>
      </div>
    </div>
    <div style="background: #1e293b; padding: 6px; border-radius: 4px;">
      + Record Walk-in Customer Sale &amp; Issue Gate Pass<br/>
      Customer: [ Iya Moria Supermarket ]<br/>
      Product: [ 🍾 75cl Bottled Water (Pack of 12) — ₦1,200/pack ]<br/>
      Qty: [ 30 ] • Payment: [ 🏦 Moniepoint Transfer (RRN Required) ]<br/>
      Moniepoint POS RRN (Last 4 Digits) *: [ 8492 ]<br/>
      <span class="ui-button" style="background: #0284c7; width: 100%; text-align: center; display: block; margin-top: 4px;">
        + Issue Gate Clearance Pass (GP-842) &amp; Record ₦36,000
      </span>
    </div>
  </div>

  <h4>Navigation &amp; POS Transaction SOP:</h4>
  <ol>
    <li><strong>Drawer Cash vs. POS Transfer Reconciliation:</strong> Top cards display live totals for physical paper notes collected vs. confirmed electronic bank transfers. Physical drawer cash must balance to the exact Naira at shift closing.</li>
    <li><strong>Recording a Customer Sale:</strong>
      <ul>
        <li>Type customer/depot name in <em>"Customer / Depot Name"</em> (e.g., Madam Chichi Stores).</li>
        <li>Select product from the dropdown:
          <ul>
            <li>💧 Sachet Water (Bag of 20) — ₦350/bag</li>
            <li>🍾 75cl Bottled Water (Pack of 12) — ₦1,200/pack</li>
            <li>🍼 50cl Bottled Water (Pack of 20) — ₦1,100/pack</li>
            <li>🛢️ 19L Dispenser Jar Refill — ₦900/jar</li>
          </ul>
        </li>
        <li>Enter Quantity (e.g., 30 packs).</li>
        <li>Select Payment Method: <span class="code-tag">💵 Cash in Hand</span> or <span class="code-tag">🏦 Moniepoint Transfer (RRN Required)</span>.</li>
      </ul>
    </li>
    <li><strong>Moniepoint POS Transfer Reference (RRN) Lock:</strong>
      <ul>
        <li>If <em>Cash</em> is selected: Blessing collects paper notes and clicks <em>Record Sale</em> immediately.</li>
        <li>If <em>Moniepoint Transfer</em> is selected: The system reveals a mandatory security field: <em>"Moniepoint POS Terminal RRN (Last 4 Digits) *"</em>.</li>
        <li>Blessing MUST inspect the printed Moniepoint POS transaction slip and type the last 4 digits of the Retrieval Reference Number (e.g. <strong>8492</strong>).</li>
        <li>If left blank, the system displays an alert and blocks receipt generation.</li>
      </ul>
    </li>
    <li><strong>Gate Clearance Pass Code (GP-xxx):</strong> Upon successful recording, the software generates a 3-digit clearance code (e.g. <span class="badge badge-emerald">GP-842</span>). This code is logged in the register and quoted to gate security.</li>
    <li><strong>Gate Security Inspection:</strong> Factory security guards will <strong>NOT</strong> open the gate boom barrier for the distributor vehicle until the driver recites the matching Gate Pass code verified against Blessing's console.</li>
  </ol>

  <div class="page-break"></div>

  <!-- =====================================================================
       PAGE 6: SECTION 2: UI NAVIGATION — SCREEN 4: DRIVER MANIFEST
  ====================================================================== -->
  <div class="header">
    <div class="header-logo">💧 OBI TABLE WATER OS</div>
    <div class="header-meta">Section 2: UI Navigation Guide • Screen 4: Driver Manifest (Musa)</div>
  </div>

  <h3>Screen 4: Route Delivery Driver Manifest &amp; Jar Quality (Musa)</h3>
  <p><strong>Role:</strong> Musa (Truck 2 Driver) &bull; <strong>PIN:</strong> <span class="code-tag">3333</span> &bull; <strong>Route:</strong> Badore / Ajah Corridor</p>
  <p>Musa is responsible for delivering mixed loads, accounting for vehicle cash collections, returning empty plastic pouches for burst claims, and inspecting empty 19L jars.</p>

  <div class="ui-mockup">
    <div class="ui-header">
      <span>Musa (Truck 2) • Mixed Load Waybill</span>
      <span>Badore / Ajah Route</span>
    </div>
    <div style="background: #1e293b; padding: 6px; border-radius: 4px; margin-bottom: 4px;">
      <strong>Products Loaded On Truck 2:</strong><br/>
      &bull; 💧 Sachet Water: <strong>700 bags</strong> (₦245,000)<br/>
      &bull; 🍾 75cl Bottles: <strong>60 packs</strong> (₦72,000)<br/>
      &bull; 🛢️ 19L Dispenser Jars: <strong>15 jars</strong> (₦13,500)<br/>
      <div style="border-top: 1px solid #334155; padding-top: 3px; margin-top: 3px; color: #4ade80;">
        Total Cash to Remit: <strong>₦330,500</strong>
      </div>
    </div>
    <div style="background: #1e293b; padding: 6px; border-radius: 4px; margin-bottom: 4px;">
      🛢️ <strong>19L Empty Jar Quality Inspection:</strong><br/>
      Empty Jars Returned: [ 15 ] • Battered / Off-Brand Jars: [ 2 ]<br/>
      <span style="color: #f43f5e;">⚠️ Replacement Penalty (₦4,500/jar): <strong>₦9,000 debit</strong></span>
    </div>
    <div style="background: #4c0519; border: 1px solid #e11d48; padding: 6px; border-radius: 4px; font-size: 7.5pt;">
      🚨 <strong>Dual Return Rules Enforced:</strong><br/>
      1. Sachet Water: Must return physical burst pouches. 0 pouches = ₦350/bag debit.<br/>
      2. Dispenser Jars: Off-brand / battered jars rejected = ₦4,500 replacement debit.
    </div>
  </div>

  <h4>Navigation &amp; Driver Reconciliation Rules:</h4>
  <ol>
    <li><strong>Morning Dispatch Verification:</strong> Before leaving the loading bay, Musa opens his console and confirms the physical inventory loaded on Truck 2 matches the screen: 700 sachet bags, 60 bottle packs, and 15 dispenser jars. Total remittance expected: ₦330,500.</li>
    <li><strong>Evening Handover &amp; Settlement:</strong> Musa submits collected physical cash and Moniepoint POS customer receipts to Blessing at the cashier window.</li>
    <li><strong>The Burst Pouch Rule (Sachet Water):</strong>
      <ul>
        <li>If Musa claims 40 bags burst due to bad potholes along Badore road, he must deliver <strong>40 physical wet burst plastic pouches</strong> to Kenneth at the gate.</li>
        <li>Kenneth counts the empty pouches. If Musa delivers <strong>0 pouches</strong>, the claim is rejected as driver pocketing.</li>
        <li>The system automatically logs an auto-debit of $40 \times \text{₦350} = \mathbf{₦14,000}$ against Musa's account.</li>
      </ul>
    </li>
    <li><strong>19L Dispenser Jar Quality Inspection:</strong>
      <ul>
        <li>For the 15 refilled jars dispatched, Musa must return 15 usable empty jars.</li>
        <li>Gate loaders inspect the returned containers: clean Obi-branded jars are accepted.</li>
        <li>If Musa brings back cracked, battered, or generic third-party competitor jars (e.g. 2 battered jars), they are marked in the <em>"Battered / Off-Brand Jars"</em> field.</li>
        <li>The system immediately calculates a replacement debit: $2 \times \text{₦4,500} = \mathbf{₦9,000}$, debited from Musa's weekly commission.</li>
      </ul>
    </li>
  </ol>

  <div class="page-break"></div>

  <!-- =====================================================================
       PAGE 7: SECTION 2: UI NAVIGATION — SCREEN 5: OWNER PORTAL
  ====================================================================== -->
  <div class="header">
    <div class="header-logo">💧 OBI TABLE WATER OS</div>
    <div class="header-meta">Section 2: UI Navigation Guide • Screen 5: Executive Owner Portal (Mr. Obi)</div>
  </div>

  <h3>Screen 5: Executive Owner Portal &amp; Financial P&amp;L (Mr. Obi)</h3>
  <p><strong>Role:</strong> Mr. Obi (Managing Director &amp; Plant Owner) &bull; <strong>PIN:</strong> <span class="code-tag">2026</span> &bull; <strong>URL:</strong> <span class="code-tag">/factory/owner</span></p>
  <p>Mr. Obi's portal is the master executive control tower. Accessible directly from his smartphone home screen, it delivers real-time visibility into net cash profits, inventory security, fuel overhead, and fleet shortages.</p>

  <div class="ui-mockup">
    <div class="ui-header">
      <span>Mr. Obi's Owner Portal</span>
      <span>Live Shift Active</span>
    </div>
    <div style="font-size: 11pt; font-weight: bold; color: #4ade80;">
      ₦524,200 <span style="font-size: 7.5pt; color: #94a3b8;">Today's Net Plant Cash Profit (from ₦1,971,000 gross)</span>
    </div>
    <div style="display: flex; gap: 4px; margin: 4px 0;">
      <div style="background: #1e293b; padding: 4px; border-radius: 4px; flex: 1;">
        💧 Sachets: <strong>₦1,470,000</strong> (74.6%)
      </div>
      <div style="background: #1e293b; padding: 4px; border-radius: 4px; flex: 1;">
        🍾 Bottles: <strong>₦501,000</strong> (25.4%)
      </div>
    </div>
    <div style="display: flex; gap: 4px; margin-bottom: 4px; font-size: 7.5pt;">
      <div style="background: #0f172a; padding: 4px; border-radius: 4px; flex: 1;">Cash: ₦385,000</div>
      <div style="background: #0f172a; padding: 4px; border-radius: 4px; flex: 1;">Transfers: ₦1,485,000</div>
      <div style="background: #0f172a; padding: 4px; border-radius: 4px; flex: 1;">Debts: ₦65,000</div>
    </div>
    <div style="background: #1e293b; padding: 4px; border-radius: 4px; margin-bottom: 4px;">
      ⚖️ Preform Scrap Audit: 432g scrap weighed = 24 rejects (<span style="color: #4ade80;">Zero smuggling ✅</span>)<br/>
      🚚 Truck 2 Musa: <span style="color: #f43f5e;">-₦23,000 Total Debit (₦14k pouch burst + ₦9k battered jars)</span><br/>
      ⛽ Gen Diesel: 32L burned @ ₦1,350/L = ₦43,200 (<span style="color: #4ade80;">₦8.20/bag overhead ✅</span>)
    </div>
    <div style="display: flex; gap: 4px;">
      <span class="ui-button ui-button-green" style="flex: 1; text-align: center;">📲 WhatsApp Shift Sync</span>
      <span class="ui-button" style="background: #334155; flex: 1; text-align: center;">Copy Text Summary</span>
    </div>
  </div>

  <h4>Navigation &amp; Executive Oversight Checklist:</h4>
  <ol>
    <li><strong>4-Digit Owner Authentication:</strong> Visit <span class="code-tag">/factory/owner</span>. Enter PIN <span class="code-tag">2026</span>. The executive dashboard paints instantaneously.</li>
    <li><strong>Net Cash Profit Hero Card:</strong> The top banner displays the real-time net cash contribution: <strong>₦524,200</strong>. It details the revenue split: 74.6% Sachet Line (₦1,470,000) vs 25.4% Bottled Line (₦501,000).</li>
    <li><strong>Vault Breakdown:</strong> Displays physical paper cash in Blessing's drawer (₦385,000), confirmed Moniepoint POS transfers (₦1,485,000), and outstanding distributor debts (₦65,000).</li>
    <li><strong>Preform Grammage Audit Verification:</strong> Confirms that the physical scale weight of crushed reject plastic (432g) matches the theoretical weight of 24 reported blow rejects, ensuring zero preform theft.</li>
    <li><strong>Fleet Shortage &amp; Jar Liability Card:</strong>
      <ul>
        <li>Truck 1 (Emeka): Balanced (₦516,000 remitted ✅).</li>
        <li>Truck 2 (Musa): Flagged for <strong>-₦23,000 debit</strong> (₦14,000 for 40 missing sachets with 0 pouches returned + ₦9,000 for 2 battered dispenser jars).</li>
      </ul>
    </li>
    <li><strong>Generator Diesel Overhead Slicer:</strong> Monitors diesel consumption: 32 Liters burned over 4.0 hours @ ₦1,350/L = ₦43,200. Energy cost per sachet bag = <strong>₦8.20/unit</strong> (well below the ₦12.00/unit profitability threshold).</li>
    <li><strong>NAFDAC Quality Log:</strong> Permeate TDS: 24 ppm (&lt; 100 ppm PASS ✅), pH: 7.2 (Neutral PASS ✅).</li>
    <li><strong>1-Tap Phone Home Screen Access:</strong> Tap the browser menu and select <em>"Add to Home Screen"</em> to turn the portal into a standalone native mobile app with an Obi Table Water icon.</li>
  </ol>

  <div class="page-break"></div>

  <!-- =====================================================================
       PAGE 8: SECTION 2: UI NAVIGATION — SCREEN 6: VIDEO TRAINING CENTER
  ====================================================================== -->
  <div class="header">
    <div class="header-logo">💧 OBI TABLE WATER OS</div>
    <div class="header-meta">Section 2: UI Navigation Guide • Screen 6: Video Training Center</div>
  </div>

  <h3>Screen 6: Interactive Video Training Center &amp; Voiceover Player</h3>
  <p><strong>URL:</strong> <span class="code-tag">https://www.bethelmindanalytics.com/factory/walkthrough</span> &bull; <strong>Audience:</strong> Factory Owner, New Staff, Onboarding Trainees</p>
  <p>To eliminate staff confusion and training overhead, the system includes a complete multimedia training academy embedded directly in the web application.</p>

  <div class="ui-mockup">
    <div class="ui-header">
      <span>Obi Table Water Training Center</span>
      <span>Novice Audio Walkthrough</span>
    </div>
    <div style="background: #0284c7; padding: 6px; border-radius: 4px; text-align: center; margin-bottom: 6px;">
      🎬 <strong>HD Video Player: Obi Table Water OS Walkthrough (3 Mins)</strong><br/>
      <span style="font-size: 7.5pt; color: #bae6fd;">Recorded Live From Production • High Definition 1280x720</span>
    </div>
    <div style="background: #1e293b; padding: 6px; border-radius: 4px; margin-bottom: 6px; display: flex; justify-content: space-between; align-items: center;">
      <div>
        🔊 <strong>Nigerian Audio Voiceover (3 mins)</strong><br/>
        <span style="font-size: 7pt; color: #94a3b8;">Official Voice: Abeo (Lagos Business Narration)</span>
      </div>
      <span class="ui-button ui-button-green">Play Voiceover ▶</span>
    </div>
    <div style="background: #1e293b; padding: 4px; border-radius: 4px; font-size: 7.5pt;">
      <strong>7 Novice Step-by-Step Chapters:</strong><br/>
      1. Intro: Dual-Line Operations • 2. Zero-Password Staff Login • 3. Supervisor Production Console<br/>
      4. Gate POS &amp; RRN Lock • 5. Driver Shortages &amp; Jar Deposits • 6. Owner Net Profit • 7. WhatsApp Shift Close
    </div>
  </div>

  <h4>Navigation &amp; Features Guide:</h4>
  <ol>
    <li><strong>Embedded HD Video Player:</strong> Tap the video play button to watch a 3-minute, high-definition walkthrough captured directly from the live software. Demonstrates all role logins, button clicks, and audit reconciliations.</li>
    <li><strong>Synchronized Audio Voiceover:</strong> Tap the <span class="ui-button ui-button-green">Play Voiceover ▶</span> button on the top controller bar to listen to the crystal-clear Nigerian English business narration (recorded by Abeo in Lagos).</li>
    <li><strong>The 7 Novice Chapters:</strong> Beneath the video player, seven visual lesson cards break down each screen step-by-step. Each card includes:
      <ul>
        <li>Exact video timestamp range (e.g. 00:55 - 01:30).</li>
        <li>Staff role badge (Owner, Supervisor, Cashier, Driver).</li>
        <li>Clear, non-technical beginner explanation.</li>
        <li>Core Factory Rule (e.g., <em>"1kg of sachet nylon must yield 16 bags"</em>).</li>
        <li><strong>"Try Live" Action Button:</strong> Tapping this button jumps directly into that live screen in the factory OS so staff can practice immediately.</li>
      </ul>
    </li>
    <li><strong>Direct Asset Downloads:</strong>
      <ul>
        <li>Tap <span class="ui-button">🎬 Download Video (MP4 - 6.6 MB)</span> to save the full HD MP4 file directly to your smartphone for offline WhatsApp sharing or staff orientation.</li>
        <li>Tap <span class="ui-button ui-button-green">📄 Download Complete PDF Manual (431 KB)</span> to download this official printable manual.</li>
      </ul>
    </li>
  </ol>

  <div class="page-break"></div>

  <!-- =====================================================================
       PAGE 9: SECTION 3: GENERAL FACTORY OPERATIONS & WATER TREATMENT
  ====================================================================== -->
  <div class="header">
    <div class="header-logo">💧 OBI TABLE WATER OS</div>
    <div class="header-meta">Section 3: General Factory Operations &amp; Water Treatment Protocol</div>
  </div>

  <h2>3. General Factory Operations &amp; Water Treatment Protocol</h2>

  <p>The foundation of a reputable, high-margin water manufacturing business in Nigeria is consistent water purity compliant with <strong>NAFDAC Regulations &amp; NIS 306:2008 Standards</strong>.</p>

  <h3>3.1 The 6-Stage Industrial Water Treatment Train</h3>
  <div class="grid-2">
    <div class="card">
      <div class="card-title">Stage 1: Aeration &amp; Sediment Settling</div>
      <p style="font-size: 8pt; margin: 0;">Raw borehole water is aerated into raw water tanks to precipitate dissolved ferrous iron ($Fe^{2+}$) into ferric hydroxide ($Fe(OH)_3$). Minimum settling time: 4 hours.</p>
    </div>
    <div class="card">
      <div class="card-title">Stage 2: Manganese Greensand &amp; Media</div>
      <p style="font-size: 8pt; margin: 0;">Multi-media sand filter removes turbidity and suspended particulate matter (&gt; 20 microns). Backwashed every 48 operating hours.</p>
    </div>
    <div class="card">
      <div class="card-title">Stage 3: Activated Granular Carbon (GAC)</div>
      <p style="font-size: 8pt; margin: 0;">High-iodine activated carbon absorbs dissolved organic matter, eliminates swampy borehole odors, and ensures crystal clarity and sweet taste.</p>
    </div>
    <div class="card">
      <div class="card-title">Stage 4: Micro-Filtration Polishing (5μm / 1μm)</div>
      <p style="font-size: 8pt; margin: 0;">Dual polypropylene spun sediment cartridges trap micro-fines before water reaches high-pressure RO booster pumps. Cartridges replaced monthly.</p>
    </div>
    <div class="card">
      <div class="card-title">Stage 5: Industrial Reverse Osmosis (RO)</div>
      <p style="font-size: 8pt; margin: 0;">High-pressure polyamide membrane rejects 98.5% of dissolved minerals, heavy metals, nitrates, and salts. Permeate TDS maintained at <strong>15–45 ppm</strong>.</p>
    </div>
    <div class="card">
      <div class="card-title">Stage 6: Ozone Dosing &amp; UV Sterilization</div>
      <p style="font-size: 8pt; margin: 0;">Water passes through an ultraviolet germicidal chamber (254nm wavelength) and mild ozone injection to provide residual shelf-life disinfection in sealed bottles.</p>
    </div>
  </div>

  <h3>3.2 Daily Laboratory Purity Log Standards</h3>
  <table>
    <thead>
      <tr>
        <th>Laboratory Parameter</th>
        <th>NAFDAC Standard</th>
        <th>Obi Factory Safe Range</th>
        <th>Testing Frequency</th>
        <th>Corrective Action if Outside Range</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Total Dissolved Solids (TDS)</strong></td>
        <td>&lt; 100 ppm</td>
        <td><strong>15 – 45 ppm</strong></td>
        <td>Twice Daily (Morning &amp; Noon)</td>
        <td>Flush RO membrane with citric acid; check booster pump pressure.</td>
      </tr>
      <tr>
        <td><strong>Water pH (Acidity / Alkalinity)</strong></td>
        <td>6.5 – 8.5</td>
        <td><strong>6.8 – 7.4 (Neutral)</strong></td>
        <td>Twice Daily</td>
        <td>Calibrate calcite re-mineralizer cartridge or adjust aeration dosing.</td>
      </tr>
      <tr>
        <td><strong>Electrical Conductivity (EC)</strong></td>
        <td>&lt; 200 μS/cm</td>
        <td><strong>30 – 90 μS/cm</strong></td>
        <td>Daily</td>
        <td>Inspect RO permeate seal rings for salt slippage.</td>
      </tr>
      <tr>
        <td><strong>UV Germicidal Lamp Hours</strong></td>
        <td>&lt; 8,000 hrs</td>
        <td><strong>&lt; 7,500 hrs</strong></td>
        <td>Logged Weekly</td>
        <td>Replace UV quartz sleeve and lamp bulb upon reaching 7,500 hours.</td>
      </tr>
      <tr>
        <td><strong>Physical Taste &amp; Odor</strong></td>
        <td>Odorless, Clean</td>
        <td><strong>Sweet, 100% Pure</strong></td>
        <td>Every Batch Start</td>
        <td>Backwash activated carbon filter; replace carbon media if exhausted.</td>
      </tr>
    </tbody>
  </table>

  <div class="page-break"></div>

  <!-- =====================================================================
       PAGE 10: SECTION 4: THE 5 ANTI-FRAUD STANDARD OPERATING PROCEDURES
  ====================================================================== -->
  <div class="header">
    <div class="header-logo">💧 OBI TABLE WATER OS</div>
    <div class="header-meta">Section 4: The 5 Anti-Fraud Standard Operating Procedures (SOPs)</div>
  </div>

  <h2>4. The 5 Anti-Fraud Standard Operating Procedures (SOPs)</h2>

  <p>These 5 mandatory procedures protect Mr. Obi's plant from the most common money leaks in Nigerian FMCG water operations:</p>

  <h3>SOP-01: Ghost Shift Prevention via Nylon Film Yield Audit</h3>
  <div class="callout callout-warning">
    <strong>The Ghost Shift Money Leak:</strong> Night-shift operators run machines after hours, seal 1,000 bags of water using factory power and water, sell them directly to local kiosks at ₦250/bag, and pocket ₦250,000 cash while claiming the machines were idle.
  </div>
  <ul>
    <li><strong>The Enforcement:</strong> Every 20kg roll of printed LDPE film is serialized and weighed before issue. Standard roll yield is exactly <strong>300 to 320 bags</strong>.</li>
    <li>At the end of each shift, Kenneth must reconcile the total bags packed against the rolls consumed ($14 \text{ rolls} \times 300 = \mathbf{4,200\text{ bags}}$). Any discrepancy of more than 50 bags triggers an immediate investigation before staff depart.</li>
  </ul>

  <h3>SOP-02: Driver Shortage &amp; Physical Pouch Return Enforcement</h3>
  <div class="callout callout-danger">
    <strong>The Fake Pothole Burst Scam:</strong> Route drivers sell 40 bags of sachet water into neighborhood kiosks, pocket ₦14,000 cash, and tell the cashier at evening: <em>"Bags burst on road because Badore road has terrible potholes."</em>
  </div>
  <ul>
    <li><strong>The Enforcement:</strong> Zero empty pouches = Zero burst credit.</li>
    <li>If Musa claims 40 bags burst, he must hand over <strong>40 physical wet empty plastic pouches</strong>.</li>
    <li>If he returns 0 pouches, the software auto-debits the full wholesale value ($40 \times \text{₦350} = \mathbf{₦14,000}$) from his payout ledger.</li>
  </ul>

  <h3>SOP-03: PET Preform Blow Reject Scrap Scale Grammage Audit</h3>
  <div class="callout callout-warning">
    <strong>Preform Siphoning Fraud:</strong> Machine operators claim 50 bottles were ruined during blow-molding and smuggle 50 pristine, unblown PET preforms out of the factory to sell to cosmetic and chemical packagers for ₦40 each.
  </div>
  <ul>
    <li><strong>The Enforcement:</strong> 1 standard 75cl PET preform weighs exactly <strong>18.0 grams</strong>.</li>
    <li>Kenneth must collect all deformed, rejected blown bottles, crush them, and place them on a digital gram scale.</li>
    <li>$\text{Expected Scrap Weight} = \text{Claimed Rejects} \times 18.0\text{g}$. For 24 rejects, the scale MUST read <strong>432 grams</strong> (&plusmn;15g).</li>
    <li>If the scale reads only 200g, 232g of preforms (13 preforms) are missing. The system flags an alert and supervisor must account for the deficit.</li>
  </ul>

  <h3>SOP-04: Moniepoint POS Transfer Reference (RRN) Lock &amp; Gate Pass</h3>
  <div class="callout callout-danger">
    <strong>Cash Pocketing Collusion:</strong> A cashier records a ₦36,000 cash sale as "Bank Transfer", pockets the ₦36,000 cash, and tells the owner at evening: <em>"The customer transferred money, but bank network delayed the SMS alert."</em>
  </div>
  <ul>
    <li><strong>The Enforcement:</strong> The software locks the transfer button. Blessing CANNOT record a transfer sale without entering the <strong>last 4 digits of the POS slip RRN</strong>.</li>
    <li>Upon entry, the software prints a 3-digit <strong>Gate Clearance Pass (GP-xxx)</strong>. Gate security will not open the boom barrier without this code.</li>
  </ul>

  <h3>SOP-05: 19L Dispenser Jar Quality Inspection &amp; Battered Jar Liability</h3>
  <ul>
    <li>An empty 19L polycarbonate dispenser jar costs <strong>₦4,500 – ₦6,000</strong>. When drivers accept battered, cracked, or third-party generic jars from customers, the factory absorbs a massive capital loss.</li>
    <li>Gate loaders inspect all returned empty jars. Battered or off-brand competitor containers are rejected at the gate and an automatic <strong>₦4,500 replacement penalty</strong> per damaged jar is debited to the driver's payout.</li>
  </ul>

  <div class="page-break"></div>

  <!-- =====================================================================
       PAGE 11: SECTION 5: DAILY SHIFT TIMETABLE & MAINTENANCE
  ====================================================================== -->
  <div class="header">
    <div class="header-logo">💧 OBI TABLE WATER OS</div>
    <div class="header-meta">Section 5: Daily Shift Timetable &amp; Maintenance Protocols</div>
  </div>

  <h2>5. Daily Shift Timetable &amp; Machine Maintenance Protocols</h2>

  <h3>5.1 The Standard Factory Daily Routine (Morning to Night)</h3>
  <table>
    <thead>
      <tr>
        <th>Time</th>
        <th>Department / Role</th>
        <th>Operational Activity</th>
        <th>System Action on Obi OS</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>06:30 AM</strong></td>
        <td>Generator Operator</td>
        <td>Check generator oil, water levels; start generator; record diesel dip.</td>
        <td>Kenneth logs starting diesel dip.</td>
      </tr>
      <tr>
        <td><strong>07:00 AM</strong></td>
        <td>Supervisor (Kenneth)</td>
        <td>Open raw water supply; backwash sand &amp; carbon filters; test TDS and pH.</td>
        <td>Kenneth logs TDS (24 ppm) and pH (7.2).</td>
      </tr>
      <tr>
        <td><strong>07:30 AM</strong></td>
        <td>Packaging Staff</td>
        <td>Mount nylon rolls on sachet machines; load PET preforms into blow mold heater.</td>
        <td>Kenneth unlocks console (PIN 1111).</td>
      </tr>
      <tr>
        <td><strong>08:00 AM</strong></td>
        <td>Loading Bay &amp; Drivers</td>
        <td>Inspect delivery trucks; load mixed orders for morning route dispatch.</td>
        <td>Musa inspects loading manifest (PIN 3333).</td>
      </tr>
      <tr>
        <td><strong>08:30 AM</strong></td>
        <td>Gate Cashier (Blessing)</td>
        <td>Open sales kiosk; count starting drawer cash; test Moniepoint POS terminal.</td>
        <td>Blessing unlocks POS (PIN 2222).</td>
      </tr>
      <tr>
        <td><strong>12:30 PM</strong></td>
        <td>Midday Shift Audit</td>
        <td>Inspect blow-mold rejects; verify sachet machine counter against finished bags.</td>
        <td>Kenneth weighs crushed scrap plastic.</td>
      </tr>
      <tr>
        <td><strong>05:30 PM</strong></td>
        <td>Trucks Return</td>
        <td>Drivers return; gate loaders count empty sachets and 19L dispenser jars.</td>
        <td>Musa inputs returned jars &amp; burst pouches.</td>
      </tr>
      <tr>
        <td><strong>06:00 PM</strong></td>
        <td>Cashier Cashing Up</td>
        <td>Blessing balances drawer cash against sales register; settles Moniepoint receipts.</td>
        <td>Blessing confirms cash and transfer totals.</td>
      </tr>
      <tr>
        <td><strong>06:30 PM</strong></td>
        <td>Supervisor Shift Close</td>
        <td>Kenneth records final diesel dip; taps 1-Tap WhatsApp Closing Trigger.</td>
        <td>WhatsApp digest sent to Mr. Obi.</td>
      </tr>
      <tr>
        <td><strong>08:00 PM</strong></td>
        <td>Mr. Obi (Owner Audit)</td>
        <td>Mr. Obi opens owner portal on phone; audits net cash profit (₦524,200).</td>
        <td>Full plant reconciled &amp; closed.</td>
      </tr>
    </tbody>
  </table>

  <h3>5.2 Preventive Machine Maintenance Schedule</h3>
  <div class="grid-2">
    <div class="card">
      <div class="card-title">Daily Maintenance Checklist</div>
      <ul style="font-size: 8pt; margin: 0; padding-left: 14px;">
        <li>Clean vertical and horizontal heat-sealing jaws on sachet machines.</li>
        <li>Inspect Teflon sealing tape for burns or peeling; replace if torn.</li>
        <li>Blow mold air compressor: drain water condensation from receiver tank.</li>
        <li>Wipe down 19L jar sanitizing chamber and bottle conveyor tracks.</li>
      </ul>
    </div>
    <div class="card">
      <div class="card-title">Weekly &amp; Monthly Maintenance</div>
      <ul style="font-size: 8pt; margin: 0; padding-left: 14px;">
        <li>Backwash multi-media sand and activated carbon filters (every 48 hrs).</li>
        <li>Replace 5-micron and 1-micron spun sediment pre-filter cartridges (monthly).</li>
        <li>Clean RO membrane with food-grade citric acid wash if TDS rises &gt; 50 ppm.</li>
        <li>Service generator: oil change, fuel filter and air filter (every 250 hrs).</li>
      </ul>
    </div>
  </div>

  <div class="page-break"></div>

  <!-- =====================================================================
       PAGE 12: SECTION 6: EMERGENCY TROUBLESHOOTING & CONTACT REGISTRY
  ====================================================================== -->
  <div class="header">
    <div class="header-logo">💧 OBI TABLE WATER OS</div>
    <div class="header-meta">Section 6: Troubleshooting, Offline Disaster Recovery &amp; Support</div>
  </div>

  <h2>6. Emergency Troubleshooting, Offline Recovery &amp; Support</h2>

  <h3>6.1 Troubleshooting Common Factory Failures</h3>
  <table>
    <thead>
      <tr>
        <th>Failure Scenario</th>
        <th>Root Cause</th>
        <th>Immediate Physical Remedy</th>
        <th>System Action on Obi OS</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Sachet pouches leaking at bottom seal</strong></td>
        <td>Horizontal sealing jaw temperature too low or Teflon tape worn out.</td>
        <td>Increase temperature controller by 5&deg;C; replace burnt Teflon tape strip.</td>
        <td>Kenneth logs any burst pouches during test runs into machine waste.</td>
      </tr>
      <tr>
        <td><strong>Blown PET bottles warping or cracking</strong></td>
        <td>Infrared preform heating lamps uneven or air compressor pressure &lt; 25 bar.</td>
        <td>Adjust preform rotation speed in heating oven; verify high-pressure compressor.</td>
        <td>Kenneth enters damaged bottles into Preform Scrap Grammage Audit.</td>
      </tr>
      <tr>
        <td><strong>TDS meter reading rises above 70 ppm</strong></td>
        <td>Borehole salt surge or RO membrane scaling / fouling.</td>
        <td>Stop bottling line immediately; run chemical CIP membrane wash with citric acid.</td>
        <td>Log TDS in NAFDAC log; withhold production until TDS drops &lt; 45 ppm.</td>
      </tr>
      <tr>
        <td><strong>Phone battery dies mid-shift</strong></td>
        <td>Factory phone depleted during active production logging.</td>
        <td>Plug phone into generator charger. Open browser tab once powered.</td>
        <td><strong>Offline Ledger hydrates state instantly with zero data loss.</strong></td>
      </tr>
      <tr>
        <td><strong>Internet drops (MTN / Airtel offline)</strong></td>
        <td>Cellular mast downtime or data bundle exhausted.</td>
        <td>Continue operations normally. System functions 100% offline via LocalStorage.</td>
        <td>Data caches locally and syncs to cloud automatically upon reconnection.</td>
      </tr>
    </tbody>
  </table>

  <h3>6.2 Offline Disaster Recovery Protocol</h3>
  <div class="callout callout-success">
    <strong>Zero Data Loss Guarantee:</strong> The Obi Table Water OS is built with an <strong>Offline-First Persistence Ledger</strong> (<span class="code-tag">src/lib/factory/offlineLedger.ts</span>). Every button tap, sale entry, preform weight, and diesel volume is immediately committed to the phone's non-volatile local storage. Even if the phone shuts down, browser crashes, or the cellular data network fails for 6 hours, re-opening the application restores the active shift state to the exact second.
  </div>

  <h3>6.3 Technical Support &amp; Operational Hotline</h3>
  <div class="card" style="border: 2px solid #0284c7; background: #f0fdf4;">
    <strong style="color: #0369a1; font-size: 10pt; display: block; margin-bottom: 4px;">
      Bethelmind Digital Solutions (CAC Certified Enterprise: Reg 9912717)
    </strong>
    <p style="font-size: 8.5pt; margin-bottom: 6px;">
      For technical support, custom software modifications, training consultations, or emergency cloud server recovery:
    </p>
    <div class="grid-2" style="font-size: 8.5pt;">
      <div>
        &bull; <strong>Technical Desk Hotline:</strong> 0802 279 1227<br/>
        &bull; <strong>WhatsApp Executive Support:</strong> wa.me/2348022791227<br/>
        &bull; <strong>Email Support:</strong> bethelmindrecruit@gmail.com
      </div>
      <div>
        &bull; <strong>Corporate Bank:</strong> Moniepoint Microfinance Bank<br/>
        &bull; <strong>Settlement Account:</strong> 6805375225 (Bethelmind Digital Solutions)<br/>
        &bull; <strong>Live Portal URL:</strong> https://www.bethelmindanalytics.com/factory
      </div>
    </div>
  </div>

  <div class="footer-note">
    Obi Table Water OS &bull; Dual-Line Production System &bull; &copy; 2026 Bethelmind Digital Solutions &bull; CAC Certified Reg: 9912717
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

  console.log('Launching headless browser to compile 12-page Master Manual...');
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

  const stats = fs.statSync(destPdf1);
  const sizeKb = (stats.size / 1024).toFixed(1);
  console.log(`\n🎉 MASTER COMPREHENSIVE OPERATING MANUAL COMPILED SUCCESSFULLY!`);
  console.log(`📁 Delivery Pack: ${destPdf1} (${sizeKb} KB)`);
  console.log(`📁 Web Download:  ${destPdf2} (${sizeKb} KB)`);
}

generateMasterHandbook().catch(err => {
  console.error('❌ Master Manual PDF Generation Error:', err);
  process.exit(1);
});
