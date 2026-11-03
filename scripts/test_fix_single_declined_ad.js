const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

async function testFixSingleDeclinedAd() {
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
  const adId = '55797060';
  console.log(`Navigating to https://jiji.ng/edit-free-ad-${adId}.html ...`);
  await page.goto(`https://jiji.ng/edit-free-ad-${adId}.html`, { waitUntil: 'domcontentloaded', timeout: 35000 });
  await page.waitForTimeout(3000);

  // 1. Check and click "Switch to Software" if present
  const switchBtn = await page.$('.b-moderation-error, button:has-text("Switch to Software"), [class*="moderation-error"]');
  if (switchBtn) {
    console.log('-> Clicking "Switch to Software"...');
    await switchBtn.click();
    await page.waitForTimeout(2000);
  }

  // 2. Remove old photos if there's a delete/trash icon on the photo
  console.log('-> Checking for old photo delete buttons...');
  const deletePhotoBtns = await page.$$('.b-file-uploader__delete, [class*="delete-photo"], [class*="remove-image"], button[class*="delete"]');
  console.log(`Found ${deletePhotoBtns.length} photo delete buttons.`);
  for (const delBtn of deletePhotoBtns) {
    try {
      await delBtn.click();
      await page.waitForTimeout(1000);
    } catch (e) {}
  }

  // 3. Attach fresh compliant photo
  const imagePath = path.resolve('public/jiji_ads/ad_10_construction_estimator_luxury.png');
  console.log(`-> Attaching compliant luxury banner: ${imagePath}`);
  const fileInput = await page.$('input[type="file"]');
  if (fileInput) {
    await fileInput.setInputFiles(imagePath);
    console.log('   ✔ New compliant image attached, waiting for upload...');
    await page.waitForTimeout(4000);
  }

  // 4. Update Title
  const title = 'Building Material Estimator & BOQ Calculator • Cement Sizer';
  const titleInput = await page.$('input[name="title"]');
  if (titleInput) {
    await titleInput.fill(title);
    console.log(`   ✔ Title set: "${title}" (${title.length} chars)`);
  }

  // 5. Click Next to go to Step 2
  console.log('-> Clicking Next button...');
  const nextBtn = await page.$('.b-create-ad-card__next-button, button:has-text("Next")');
  if (nextBtn) {
    await nextBtn.click();
    await page.waitForTimeout(3000);
  }

  // 6. Update Price
  const priceInput = await page.$('input.qa-enter-price, input[name="price"][type="text"]');
  if (priceInput) {
    await priceInput.fill('35000');
    console.log('   ✔ Price set: ₦35,000');
  }

  // 7. Update Description (Concise, < 700 chars)
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

  // 8. Submit
  const submitBtn = await page.$('#submit_button, button.qa-submit-button, button[type="submit"]');
  if (submitBtn) {
    const isEnabled = await submitBtn.isEnabled();
    console.log(`-> Submit button enabled: ${isEnabled}`);
    if (isEnabled) {
      console.log('-> Clicking submit...');
      await submitBtn.click();
      await page.waitForTimeout(6000);
      console.log(`Post-submit URL: ${page.url()}`);
      await page.screenshot({ path: `local_db/test_fixed_ad_${adId}.png` });
    }
  }

  await browser.close();
}

testFixSingleDeclinedAd().catch(console.error);
