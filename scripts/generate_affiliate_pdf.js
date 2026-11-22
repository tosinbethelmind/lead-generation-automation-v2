const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function generateAffiliatePdf() {
  const targetDir = path.join(__dirname, '../public/workspace/affiliate_campaigns');
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const pdfPath = path.join(targetDir, 'Selar_50Percent_Affiliate_Promotional_Swipe_Pack.pdf');

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Bethelmind Analytics — 50% Partner Promo Pack</title>
  <style>
    @page { margin: 20mm 15mm; size: A4; }
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      color: #1e293b;
      line-height: 1.5;
      font-size: 11pt;
      margin: 0;
      padding: 0;
    }
    .header {
      border-bottom: 3px solid #10b981;
      padding-bottom: 12px;
      margin-bottom: 20px;
    }
    .brand-title {
      font-size: 20pt;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.5px;
    }
    .badge {
      display: inline-block;
      background: #10b981;
      color: #ffffff;
      font-size: 9pt;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 4px;
      text-transform: uppercase;
      margin-top: 4px;
    }
    h2 {
      font-size: 14pt;
      color: #0f172a;
      border-left: 4px solid #10b981;
      padding-left: 8px;
      margin-top: 24px;
      margin-bottom: 8px;
    }
    p { margin: 6px 0; }
    .box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 12px 14px;
      margin: 10px 0;
    }
    .grid {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 10px;
    }
    .card {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 10px;
      width: 47%;
      box-sizing: border-box;
    }
    .card-title {
      font-weight: 700;
      font-size: 10pt;
      color: #0f172a;
    }
    .price-tag {
      font-size: 11pt;
      font-weight: 800;
      color: #059669;
      margin-top: 4px;
    }
    .swipe-box {
      background: #0f172a;
      color: #f8fafc;
      font-family: monospace;
      font-size: 9.5pt;
      padding: 12px;
      border-radius: 6px;
      white-space: pre-wrap;
      margin: 10px 0;
    }
    .step {
      font-weight: 700;
      color: #059669;
    }
    .footer {
      margin-top: 30px;
      border-top: 1px solid #e2e8f0;
      padding-top: 10px;
      font-size: 8.5pt;
      color: #64748b;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="brand-title">⚡ BETHELMIND ANALYTICS</div>
    <div class="badge">Official 50% Creator &amp; Affiliate Partner Pack</div>
    <p style="color: #64748b; font-size: 10pt; margin-top: 6px;">
      Direct Revenue-Share Network • Weekly Automated Friday Bank Payouts via Selar
    </p>
  </div>

  <h2>1. Quick Start Guide (Start Earning in 60 Seconds)</h2>
  <div class="box">
    <p><span class="step">Step 1:</span> Visit <strong>selar.com/m/oyelakintosin</strong> and click "Become an Affiliate".</p>
    <p><span class="step">Step 2:</span> Enter your preferred bank details (Any Nigerian bank: GTB, Access, Kuda, OPay, Zenith, Moniepoint).</p>
    <p><span class="step">Step 3:</span> Copy your custom affiliate link for any of the products listed below.</p>
    <p><span class="step">Step 4:</span> Copy the pre-tested promotional swipes below, paste into your WhatsApp Status or socials with your link.</p>
    <p><span class="step">Step 5:</span> Collect 50% on every checkout — paid directly to your bank every Friday.</p>
  </div>

  <h2>2. Flagship Products &amp; Your 50% Payout Matrix</h2>
  <div class="grid">
    <div class="card">
      <div class="card-title">Faceless TikTok &amp; YouTube Automation Suite</div>
      <p style="font-size: 8.5pt; color: #64748b;">10,000+ viral prompts, hooks &amp; AI video workflows</p>
      <div class="price-tag">Retail: ₦18,500 | Your Cut: ₦9,250</div>
    </div>
    <div class="card">
      <div class="card-title">1688 China Mini-Importation Masterclass</div>
      <p style="font-size: 8.5pt; color: #64748b;">Direct factory procurement playbook to Nigeria</p>
      <div class="price-tag">Retail: ₦15,000 | Your Cut: ₦7,500</div>
    </div>
    <div class="card">
      <div class="card-title">The Remote Dollar Blueprint</div>
      <p style="font-size: 8.5pt; color: #64748b;">Upwork scripts &amp; international escrow client contracts</p>
      <div class="price-tag">Retail: ₦18,500 | Your Cut: ₦9,250</div>
    </div>
    <div class="card">
      <div class="card-title">WhatsApp Income &amp; Status Monetization OS</div>
      <p style="font-size: 8.5pt; color: #64748b;">Converting smartphone status views into daily clients</p>
      <div class="price-tag">Retail: ₦12,000 | Your Cut: ₦6,000</div>
    </div>
    <div class="card">
      <div class="card-title">Clinical Somatic &amp; Vagus Nerve Focus Suite</div>
      <p style="font-size: 8.5pt; color: #64748b;">10-book clinical tension relief &amp; dopamine reset suite</p>
      <div class="price-tag">Retail: ₦35,000 | Your Cut: ₦17,500</div>
    </div>
    <div class="card">
      <div class="card-title">Commercial CleanTech &amp; Energy M&amp;A Vault</div>
      <p style="font-size: 8.5pt; color: #64748b;">50,000 corporate decision maker intelligence dataset</p>
      <div class="price-tag">Retail: ₦650,000 | Your Cut: ₦325,000</div>
    </div>
  </div>

  <h2>3. Turnkey Copy-Paste Swipe Kit</h2>
  <p><strong>Swipe A: WhatsApp Status Sequence (Post on Status)</strong></p>
  <div class="swipe-box">Slide 1: Most people think earning in foreign currency requires a visa or 5 years in coding. That changed completely in 2026. 💵

Slide 2: A verified tech lead in Lagos just published the complete step-by-step masterclass showing how ordinary Nigerians are landing remote contracts paying $20 - $65/hr without bidding wars on Upwork.

Slide 3: Check it out before the price increases: [YOUR_AFFILIATE_LINK] (Send me a DM if you need help getting started!)</div>

  <p><strong>Swipe B: TikTok / Reels Video Script</strong></p>
  <div class="swipe-box">Hook (0-3s): "Stop trying to build a business from scratch in Nigeria when you can plug into pre-built AI workflows that pay you cash."

Script: "Here is what top creators do: running faceless YouTube shorts and selling verified digital assets. I found a complete prompt and automation vault on Selar that gives you the exact scripts, hooks, and video templates. Tap the link in my bio to check it out before the discount ends!"</div>

  <p><strong>Swipe C: Twitter / X Thread Hook</strong></p>
  <div class="swipe-box">1/ If you have a smartphone, internet connection, and 2 hours daily, here is how you can build an automated digital income stream in 2026 🧵👇

2/ Pick a high-intent niche (Mini-importation from 1688 China, Faceless video creation, or Upwork ghostwriting).

3/ Use pre-tested system templates. The Bethelmind Analytics desk published their internal playbooks on Selar.

4/ Access the complete master package here: [YOUR_AFFILIATE_LINK]</div>

  <div class="footer">
    Bethelmind Digital Solutions (CAC Certified Nigerian Enterprise: Reg 9912717) • Support: bethelmindrecruit@gmail.com • WhatsApp Desk: +234 802 279 1227
  </div>
</body>
</html>
  `;

  console.log('Generating PDF via Playwright...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'networkidle' });
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '15mm', bottom: '15mm', left: '15mm', right: '15mm' }
  });
  await browser.close();

  console.log('✅ Generated PDF successfully at:', pdfPath);
}

generateAffiliatePdf().catch(console.error);
