const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ADS = [
  {
    adId: '55776882',
    name: 'Solar Inverter Load Calculator',
    title: 'Solar Inverter Load Calculator & 5kVA Instant WhatsApp Quoter',
    softwareName: 'Solar Inverter BOQ Load Calculator',
    accentColor: '#f59e0b',
    tagline: 'RENEWABLE ENERGY & SOLAR ENGINEERING',
    bannerTitle: 'SOLAR INVERTER BOQ LOAD SIZER &',
    highlight: 'INSTANT QUOTATION TOOL',
    features: [
      'Interactive appliance load picker (ACs, freezers, pumps)',
      'Instant WhatsApp BOQ proposal generated in 60 seconds',
      'Motor inrush surge protection calculator (No blown inverters)',
      'NEPA Band A tariff vs generator fuel ROI payback clock'
    ],
    price: '35000',
    desc: `Stop wasting hours on manual load calculations for clients who ghost you!

Automated solar sizing & instant quotation engine branded with your company name, logo, and phone.

WHAT IS INCLUDED:
• Interactive appliance load calculator (ACs, pumps, freezers, lighting)
• Instant WhatsApp BOQ proposal generated and sent to client in 60s
• Motor inrush surge protection sizer (Prevents inverters tripping)
• NEPA Band A tariff (₦209/kWh) vs generator fuel ROI payback clock
• 1-Tap itemized engineering proposal PDF generator

PRICE: ₦35,000 Setup (or ₦80,000 Annual Pass with 1 Year Free).

Bethelmind Digital Solutions (CAC Certified • Reg: 9912717)
Tap "Start Chat" on Jiji to test the solar calculator demo!`
  },
  {
    adId: '55777491',
    name: 'Salon & Clinic Appointment Booking',
    title: 'Salon & Clinic Appointment Booking App with Deposit Lock • 24/7',
    softwareName: 'Salon & Clinic Appointment Booking App',
    accentColor: '#ec4899',
    tagline: 'BEAUTY, AESTHETICS & CLINIC AUTOMATION',
    bannerTitle: '24/7 APPOINTMENT BOOKING WITH',
    highlight: 'UPFRONT DEPOSIT LOCK',
    features: [
      '24/7 Mobile self-service booking calendar on WhatsApp',
      'Mandatory reservation deposit lock via Moniepoint',
      'Automated WhatsApp appointment reminders (Cuts no-shows 90%)',
      'Stylist & practitioner commission split daily revenue ledger'
    ],
    price: '35000',
    desc: `Eliminate empty salon chairs and costly no-show appointments!

Automated 24/7 appointment scheduling app for hair salons, aesthetic clinics, spas, and dental practices.

WHAT IS INCLUDED:
• 24/7 Mobile self-service booking calendar on your website & WhatsApp
• Upfront reservation deposit lock via Moniepoint (Eliminates no-shows)
• Automated WhatsApp appointment reminders sent 24h & 2h before session
• Stylist & practitioner commission split daily revenue ledger

PRICE: ₦35,000 Setup (or ₦80,000 Annual Pass with 1 Year Free Maintenance).

Bethelmind Digital Solutions (CAC Certified • Reg: 9912717)
Tap "Start Chat" on Jiji for your free live booking demo!`
  },
  {
    adId: '55797060',
    name: 'Building Material Estimator',
    title: 'Building Material Estimator & BOQ Calculator • Cement Sizer',
    softwareName: 'Building Material & BOQ Estimator',
    accentColor: '#38bdf8',
    tagline: 'CONSTRUCTION, ARCHITECTURE & CIVIL ENGINEERING',
    bannerTitle: 'BUILDING MATERIAL ESTIMATOR &',
    highlight: 'BOQ MIX CALCULATOR',
    features: [
      'Precision cement, sand & granite sizer for decking and foundations',
      'Floor & wall tile area calculator with 12% cut breakage buffer',
      'Paint wall coverage estimator (Emulsion & Gloss liters)',
      'Instant itemized BOQ PDF generator with Lagos current market rates'
    ],
    price: '35000',
    desc: `Stop losing money to contractor material inflation and site waste!

We deploy an automated Building Material & BOQ Estimation Software branded for your construction business.

WHAT IS INCLUDED:
• Precision Cement, Sand & Granite mix sizer for foundations, columns and decking
• Floor & Wall Tile square-meter calculator with 12% cut breakage buffer
• Paint wall coverage estimator (Emulsion & Gloss liters)
• Instant itemized BOQ PDF generator with Lagos current market rates

PRICE: ₦35,000 Setup (or ₦80,000 Annual Pass with 1 Year Free Maintenance).

Bethelmind Digital Solutions (CAC Certified • Reg: 9912717)
Tap "Start Chat" on Jiji for a free live working demo on your phone!`
  },
  {
    adId: '55796997',
    name: 'Multi-Store Retail Inventory',
    title: 'Multi-Store Retail Inventory & Pure Water Factory Stock App',
    softwareName: 'Multi-Branch Inventory & Factory Stock App',
    accentColor: '#8b5cf6',
    tagline: 'RETAIL, SUPERMARKETS & PURE WATER FACTORIES',
    bannerTitle: 'MULTI-STORE RETAIL INVENTORY &',
    highlight: 'THEFT PREVENTION LEDGER',
    features: [
      'Multi-branch real-time stock sync across shops and central store',
      'Pure Water route reconciler (Bags loaded vs cash vs burst)',
      'Inter-branch transfer digital gate pass with dual sign-off',
      'Staff permission gating: attendants cannot edit prices or delete sales'
    ],
    price: '35000',
    desc: `Stop employee stock shrinkage, unrecorded cash deficits, and driver fraud!

We deploy multi-branch inventory control software for retail shops, supermarkets, and pure water factories.

WHAT IS INCLUDED:
• Multi-Branch real-time stock sync across shops and central warehouse
• Pure Water route reconciler (Bags loaded vs cash vs burst allowance)
• Inter-branch transfer digital gate pass with dual sign-off
• Staff permission gating (attendants cannot edit prices or delete sales)
• Instant low-stock & theft alerts sent to your phone

PRICE: ₦35,000 Setup (or ₦80,000 Annual Pass with 1 Year Free).

Bethelmind Digital Solutions (CAC Certified • Reg: 9912717)
Tap "Start Chat" on Jiji to test the live inventory demo!`
  },
  {
    adId: '51159464', // Recycling draft 51159464 as Ad #14
    name: 'Ad #14: Convert Website to Android App',
    title: 'Convert Website to Android App • Installable APK in 24h',
    softwareName: 'Website to Android App Converter',
    accentColor: '#22c55e',
    tagline: 'MOBILE APPLICATION DEVELOPMENT & CONVERSION',
    bannerTitle: 'CONVERT ANY WEBSITE TO NATIVE',
    highlight: 'ANDROID MOBILE APP (.APK)',
    features: [
      'Installable Android App (.APK) compiled in 24 hours',
      'Direct WhatsApp chat & 1-tap call integration (Zero browser errors)',
      'Seamless OPay, Moniepoint & Paystack payment deep-linking',
      'Branded app icon, custom splash screen & offline fallback screen'
    ],
    price: '35000',
    desc: `Turn your business website into an installable Android Mobile App in 24 hours!

Did you know 82% of Nigerian customers prefer tapping an app icon on their phone rather than typing a URL in Chrome?

WHAT IS INCLUDED:
• Native Android App (.APK) compiled for all Android phones
• Direct WhatsApp chat & 1-tap call integration (No browser errors)
• Seamless OPay, Moniepoint & Paystack payment deep-linking
• Branded app icon, custom splash screen & offline fallback page
• Dedicated 1-tap download link for your Instagram bio & WhatsApp
• Zero Google Play $25 fee and zero 14-day 20-tester wait!

PRICE: ₦35,000 Setup (or ₦80,000 Annual Pass with 1 Year Free).

Bethelmind Digital Solutions (CAC Certified • Reg: 9912717)
Tap "Start Chat" on Jiji for your business app demo!`
  }
];

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
        <div class="title">${data.bannerTitle} <span>${data.highlight}</span></div>
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
}

async function runDeployAll() {
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

  const page = await context.newPage();

  page.on('response', async res => {
    const url = res.url();
    if (url.includes('image-upload') || url.includes('image-delete') || url.includes('item/modify')) {
      try {
        console.log(`[API RESPONSE ${res.status()}] ${url}:`, (await res.text()).slice(0, 300));
      } catch (e) {}
    }
  });

  for (const ad of ADS) {
    console.log(`\n======================================================`);
    console.log(`Processing ${ad.name} (Ad #${ad.adId})...`);
    console.log(`======================================================`);

    try {
      // 1. Render fresh luxury banner
      const bannerPath = path.resolve(`public/jiji_ads/banner_${ad.adId}_${Date.now()}.png`);
      await renderBanner(browser, ad, bannerPath);
      console.log('✔ Rendered banner:', bannerPath);

      // 2. Navigate to edit page
      console.log(`Navigating to https://jiji.ng/edit-free-ad-${ad.adId}.html...`);
      await page.goto(`https://jiji.ng/edit-free-ad-${ad.adId}.html`, {
        referer: 'https://jiji.ng/profile/adverts',
        waitUntil: 'domcontentloaded'
      });
      await page.waitForTimeout(4000);

      // 3. Switch Category to Electronics -> Software
      console.log('Checking category...');
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
            console.log('✔ Category switched to Electronics -> Software!');
          }
        }
      }

      // Update title on Step 1
      const titleInput = await page.$('input[name="title"]');
      if (titleInput) {
        await titleInput.fill(ad.title);
        console.log('✔ Title updated:', ad.title);
      }

      // 4. Upload fresh luxury banner
      console.log('Uploading fresh luxury banner...');
      const fileInput = await page.$('input[type="file"]');
      if (fileInput) {
        await fileInput.setInputFiles(bannerPath);
        console.log('Waiting 6s for upload to complete...');
        await page.waitForTimeout(6000);
      }

      // 5. Delete old image if multiple exist
      const imgCount = await page.evaluate(() => document.querySelectorAll('.b-image-item').length);
      console.log(`Images on page: ${imgCount}`);
      if (imgCount > 1) {
        console.log('Deleting old image(s)...');
        await page.evaluate(() => {
          const btns = document.querySelectorAll('.b-image-item__close-btn');
          if (btns.length > 0) btns[0].click();
        });
        await page.waitForTimeout(3000);
      }

      // 6. Click Next to advance to Step 2
      console.log('Clicking Next to advance to Step 2...');
      const nextBtn = await page.$('.b-create-ad-card__next-button, button:has-text("Next")');
      if (nextBtn) {
        await nextBtn.click();
        await page.waitForTimeout(2500);
      }

      // 7. Fill Software attributes on Step 2
      console.log('Filling Software attributes on Step 2...');
      const nameInput = await page.$('input[name="attr_5354_software_name"]');
      if (nameInput) {
        await nameInput.fill(ad.softwareName);
        console.log('✔ Software Name filled:', ad.softwareName);
      }

      // Type
      const typeField = await page.$('.fw-field:has-text("Type") .multiselect, .fw-field:has-text("Type") .fw-select');
      if (typeField) {
        await typeField.click();
        await page.waitForTimeout(600);
        const opt = await page.$('.multiselect__option:has-text("Accounting"), span:has-text("Accounting"), .multiselect__option:has-text("POS Software"), span:has-text("POS Software"), .multiselect__option:has-text("Other"), span:has-text("Other")');
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

      // 8. Price & Description
      const priceInput = await page.$('input[name="price"][type="text"], input.qa-enter-price');
      if (priceInput) {
        await priceInput.fill(ad.price);
        console.log('✔ Price set to ₦', ad.price);
      }

      const descInput = await page.$('textarea[name="description"]');
      if (descInput) {
        await descInput.fill(ad.desc);
        console.log('✔ Description filled');
      }

      await page.waitForTimeout(2000);

      // 9. Submit
      const submitBtn = await page.$('#submit_button, button.qa-submit-button, button[type="submit"]');
      if (submitBtn) {
        const isEnabled = await submitBtn.isEnabled();
        console.log('Submit button enabled:', isEnabled);
        if (isEnabled) {
          await submitBtn.click();
          console.log('Clicked submit! Waiting 8s...');
          await page.waitForTimeout(8000);
          console.log(`✔ Ad #${ad.adId} Post-submit URL: ${page.url()}`);
        }
      }

    } catch (err) {
      console.error(`❌ Error on Ad #${ad.adId}:`, err.message);
    }

    console.log('Cooldown 5s before next advert...');
    await page.waitForTimeout(5000);
  }

  await browser.close();
  console.log('\n======================================================');
  console.log('ALL ADVERTS PROCESSED!');
  console.log('======================================================');
}

runDeployAll().catch(console.error);
