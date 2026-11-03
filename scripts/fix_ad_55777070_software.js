const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

async function renderBanner(browser, data, outPath) {
  const page = await browser.newPage();
  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        body {
          width: 1080px;
          height: 1080px;
          background: linear-gradient(135deg, #090e1a 0%, #0d1527 50%, #050811 100%);
          color: #ffffff;
          padding: 60px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
        }
        .glow {
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.15;
          pointer-events: none;
        }
        .glow-1 { top: -100px; right: -100px; background: ${data.accentColor}; }
        .glow-2 { bottom: -100px; left: -100px; background: #d4af37; }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          z-index: 2;
        }
        .brand {
          font-size: 26px;
          font-weight: 800;
          color: #f8fafc;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .brand-dot {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #d4af37;
        }
        .badge {
          background: rgba(212, 175, 55, 0.15);
          border: 1px solid rgba(212, 175, 55, 0.4);
          color: #d4af37;
          padding: 8px 20px;
          border-radius: 30px;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 1px;
        }
        .content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .tagline {
          color: ${data.accentColor};
          font-size: 18px;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
        }
        .title {
          font-size: 44px;
          font-weight: 900;
          line-height: 1.15;
          color: #ffffff;
        }
        .title span {
          color: #d4af37;
        }
        .features {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-top: 10px;
        }
        .feature-item {
          display: flex;
          align-items: center;
          gap: 16px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 16px 22px;
          border-radius: 14px;
          font-size: 18px;
          font-weight: 600;
          color: #e2e8f0;
        }
        .check {
          color: #10b981;
          font-size: 20px;
          font-weight: bold;
        }
        .footer {
          position: relative;
          z-index: 2;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 24px;
        }
        .sla {
          font-size: 16px;
          font-weight: 700;
          color: #94a3b8;
        }
        .cta-btn {
          background: linear-gradient(135deg, #d4af37 0%, #aa8620 100%);
          color: #070b14;
          font-size: 18px;
          font-weight: 900;
          padding: 14px 32px;
          border-radius: 12px;
        }
      </style>
    </head>
    <body>
      <div class="glow glow-1"></div>
      <div class="glow glow-2"></div>
      <div class="header">
        <div class="brand"><div class="brand-dot"></div> Bethelmind Digital Solutions</div>
        <div class="badge">CAC REG: 9912717</div>
      </div>
      <div class="content">
        <div class="tagline">${data.tagline}</div>
        <div class="title">${data.title} <span>${data.highlight}</span></div>
        <div class="features">
          ${data.features.map(f => `<div class="feature-item"><span class="check">✔</span> ${f}</div>`).join('')}
        </div>
      </div>
      <div class="footer">
        <div class="sla">⚡ 24-HOUR EXPRESS SETUP • ZERO HIDDEN CHARGES</div>
        <div class="cta-btn">TEST LIVE DEMO</div>
      </div>
    </body>
    </html>
  `);
  await page.screenshot({ path: outPath, clip: { x: 0, y: 0, width: 1080, height: 1080 } });
  await page.close();
  console.log('Rendered luxury banner:', outPath);
}

async function fixAd55777070() {
  const adId = '55777070';
  const config = JSON.parse(fs.readFileSync('local_db/jiji_account_config.json', 'utf8'));
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--disable-blink-features=AutomationControlled', '--no-sandbox']
  });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 900 }
  });
  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });

  const validCookies = (config.cookiesJson || []).map(c => {
    const copy = { ...c };
    if (!['Strict', 'Lax', 'None'].includes(copy.sameSite)) delete copy.sameSite;
    return copy;
  });
  await context.addCookies(validCookies);

  // 1. Render fresh luxury banner
  const bannerPath = path.resolve(`public/jiji_ads/fresh_shield_${Date.now()}.png`);
  await renderBanner(browser, {
    accentColor: '#10b981',
    tagline: 'FINTECH SECURITY & STORE FRAUD PREVENTION',
    title: 'STOP FAKE BANK ALERTS &',
    highlight: 'CASHIER THEFT SHIELD',
    features: [
      'Instant Moniepoint & Paystack bank webhook credit verification',
      'Green security pass sent to cashier phone ONLY on real bank credit',
      'End-of-day shift reconciliation: bank total vs cash drawer in 60s',
      'Digital verified payment receipt sent directly to buyer on WhatsApp'
    ]
  }, bannerPath);

  const page = await context.newPage();

  page.on('response', async res => {
    const url = res.url();
    if (url.includes('image-upload') || url.includes('image-delete') || url.includes('item/modify')) {
      try {
        console.log(`[API RESPONSE ${res.status()}] ${url}:`, (await res.text()).slice(0, 300));
      } catch (e) {}
    }
  });

  console.log(`Navigating to Ad ${adId}...`);
  await page.goto(`https://jiji.ng/edit-free-ad-${adId}.html`, {
    referer: 'https://jiji.ng/profile/adverts',
    waitUntil: 'domcontentloaded'
  });
  await page.waitForTimeout(4000);

  // 2. Change Category to Software
  console.log('Changing category to Electronics -> Software...');
  const catBox = await page.$('.b-category-section__category-select, .qa-choose-category, .b-category-select__value');
  if (catBox) {
    await catBox.click();
    await page.waitForTimeout(1000);
    const elec = await page.$('.multiselect__option:has-text("Electronics"), span:has-text("Electronics")');
    if (elec) {
      await elec.click();
      await page.waitForTimeout(1200);
      const soft = await page.$('.multiselect__option:has-text("Software"), span:has-text("Software")');
      if (soft) {
        await soft.click();
        await page.waitForTimeout(2000);
        console.log('Category switched to Software!');
      }
    }
  }

  // 3. Upload fresh banner
  console.log('Uploading fresh luxury banner...');
  const fileInput = await page.$('input[type="file"]');
  if (fileInput) {
    await fileInput.setInputFiles(bannerPath);
    console.log('Waiting 6s for upload to complete...');
    await page.waitForTimeout(6000);
  }

  // 4. Delete old image if multiple exist
  const imgCount = await page.evaluate(() => document.querySelectorAll('.b-image-item').length);
  console.log('Images on page:', imgCount);
  if (imgCount > 1) {
    console.log('Deleting old image...');
    await page.evaluate(() => {
      const btns = document.querySelectorAll('.b-image-item__close-btn');
      if (btns.length > 0) btns[0].click();
    });
    await page.waitForTimeout(3000);
  }

  // 5. Click Next to go to Step 2
  console.log('Clicking Next to advance to Step 2...');
  const nextBtn = await page.$('.b-create-ad-card__next-button, button:has-text("Next")');
  if (nextBtn) {
    await nextBtn.click();
    await page.waitForTimeout(2500);
  }

  // 6. Fill Software fields on Step 2
  console.log('Filling Software attributes on Step 2...');
  const nameInput = await page.$('input[name="attr_5354_software_name"]');
  if (nameInput) {
    await nameInput.fill('Moniepoint POS Transfer Shield');
    console.log('Filled software name');
  }

  // Type: POS Software or Other
  const typeField = await page.$('.fw-field:has-text("Type") .multiselect, .fw-field:has-text("Type") .fw-select');
  if (typeField) {
    await typeField.click();
    await page.waitForTimeout(600);
    const opt = await page.$('.multiselect__option:has-text("POS Software"), span:has-text("POS Software"), .multiselect__option:has-text("Other")');
    if (opt) await opt.click();
    await page.waitForTimeout(500);
  }

  // Platform: Android
  const platField = await page.$('.fw-field:has-text("Platform") .multiselect, .fw-field:has-text("Platform") .fw-select');
  if (platField) {
    await platField.click();
    await page.waitForTimeout(600);
    const opt = await page.$('.multiselect__option:has-text("Android"), span:has-text("Android")');
    if (opt) await opt.click();
    await page.waitForTimeout(500);
  }

  // Format: Digital Download
  const formatField = await page.$('.fw-field:has-text("Format") .multiselect, .fw-field:has-text("Format") .fw-select');
  if (formatField) {
    await formatField.click();
    await page.waitForTimeout(600);
    const opt = await page.$('.multiselect__option:has-text("Digital Download"), span:has-text("Digital Download")');
    if (opt) await opt.click();
    await page.waitForTimeout(500);
  }

  // 7. Price & Description
  const priceInput = await page.$('input[name="price"][type="text"], input.qa-enter-price');
  if (priceInput) await priceInput.fill('35000');

  const desc = `Stop photoshopped bank transfer screenshots and cashier theft deficits!

Instant bank credit verification and fraud prevention software for retail stores, supermarkets, and POS operators.

WHAT IS INCLUDED:
• Real-time Moniepoint & Paystack bank webhook credit verification
• Instant green security pass sent to cashier phone ONLY on genuine credit
• Cashier shift end-of-day bank credit vs cash reconciliation in 60s
• Digital receipt generator for genuine customer transactions

PRICE: ₦35,000 Setup (or ₦80,000 Annual Pass with 1 Year Free).

Bethelmind Digital Solutions (CAC Certified • Reg: 9912717)
Tap "Start Chat" on Jiji to test the anti-fraud shield now!`;

  const descInput = await page.$('textarea[name="description"]');
  if (descInput) await descInput.fill(desc);

  await page.waitForTimeout(1500);

  // 8. Submit
  const submitBtn = await page.$('#submit_button, button.qa-submit-button, button[type="submit"]');
  if (submitBtn) {
    console.log('Submit button enabled:', await submitBtn.isEnabled());
    await submitBtn.click();
    console.log('Clicked submit! Waiting 8s...');
    await page.waitForTimeout(8000);
    console.log('Post-submit URL:', page.url());
  }

  await page.screenshot({ path: `local_db/post_submit_${adId}.png` });
  await browser.close();
}

fixAd55777070().catch(console.error);
