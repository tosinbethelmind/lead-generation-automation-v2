const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

async function testCompleteAdFix() {
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
    if (res.url().includes('modify')) {
      console.log(`[MODIFY API STATUS] ${res.status()}`);
      try {
        const body = await res.text();
        console.log(`[MODIFY API BODY] ${body}`);
      } catch (e) {}
    }
  });

  const adId = '55797060';
  console.log(`\n==========================================`);
  console.log(`Fixing Declined Ad #${adId}...`);
  await page.goto(`https://jiji.ng/edit-free-ad-${adId}.html`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);

  // 1. Switch category to Electronics -> Software
  console.log('-> Selecting Electronics -> Software...');
  const catBox = await page.$('.b-category-section__category-select, .qa-choose-category');
  if (catBox) {
    await catBox.click();
    await page.waitForTimeout(1000);
    const elecOption = await page.$('.multiselect__option:has-text("Electronics"), span:has-text("Electronics")');
    if (elecOption) {
      await elecOption.click();
      await page.waitForTimeout(1500);
      const softOption = await page.$('.multiselect__option:has-text("Software"), span:has-text("Software")');
      if (softOption) {
        await softOption.click();
        await page.waitForTimeout(1500);
        console.log('   ✔ Switched to Software!');
      }
    }
  }

  // 2. Remove all old images
  console.log('-> Deleting old rejected images...');
  const closeBtns = await page.$$('.b-image-item__close-btn');
  console.log(`   Found ${closeBtns.length} old images to delete.`);
  for (const btn of closeBtns) {
    try {
      await btn.click();
      await page.waitForTimeout(800);
    } catch (e) {}
  }

  // 3. Upload new compliant banner
  const imagePath = path.resolve('public/jiji_ads/ad_10_construction_estimator_luxury.png');
  console.log(`-> Attaching new compliant banner: ${imagePath}`);
  const fileInput = await page.$('input[type="file"]');
  if (fileInput) {
    await fileInput.setInputFiles(imagePath);
    console.log('   ✔ File attached, waiting for upload to complete...');
    await page.waitForTimeout(5000);
  }

  // 4. Set Title
  const title = 'Building Material Estimator & BOQ Calculator • Cement Sizer';
  const titleInput = await page.$('input[name="title"]');
  if (titleInput) {
    await titleInput.fill(title);
    console.log(`   ✔ Title updated: "${title}"`);
  }

  // 5. Click Next
  console.log('-> Clicking Next button...');
  const nextBtn = await page.$('.b-create-ad-card__next-button, button:has-text("Next")');
  if (nextBtn) {
    await nextBtn.click();
    await page.waitForTimeout(3000);
  }

  // 6. Set Price & Description
  console.log('-> Setting Price and Description...');
  const priceInput = await page.$('input.qa-enter-price, input[name="price"][type="text"]');
  if (priceInput) {
    await priceInput.fill('35000');
    console.log('   ✔ Price set to ₦35,000');
  }

  const desc = `Stop losing money to contractor material inflation and site waste!

We deploy an automated Building Material & BOQ Estimation Software branded for your construction or contracting business.

WHAT IS INCLUDED:
• Precision Cement, Sand & Granite mix sizer for foundations, columns and decking
• Floor & Wall Tile square-meter calculator with 12% cut breakage buffer
• Paint wall coverage estimator (Emulsion & Gloss liters)
• Instant itemized BOQ PDF generator with Lagos current market rates

PRICE: ₦35,000 Setup (or ₦80,000 Annual Pass with 1 Year Free Maintenance).

Bethelmind Digital Solutions (CAC Certified • Reg: 9912717)
Tap "Start Chat" on Jiji or call us for a free live working demo on your phone!`;

  const descInput = await page.$('textarea[name="description"]');
  if (descInput) {
    await descInput.fill(desc);
    console.log(`   ✔ Description set (${desc.length} chars)`);
  }

  await page.waitForTimeout(2000);

  // 7. Click Submit
  console.log('-> Submitting ad update...');
  const submitBtn = await page.$('#submit_button, button.qa-submit-button, button[type="submit"]');
  if (submitBtn) {
    await submitBtn.click();
    await page.waitForTimeout(7000);
    console.log(`Post-submit URL: ${page.url()}`);
    await page.screenshot({ path: `local_db/reposted_ad_${adId}.png` });
  }

  await browser.close();
}

testCompleteAdFix().catch(console.error);
