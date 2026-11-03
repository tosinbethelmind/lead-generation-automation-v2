const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

async function fixAd55797060() {
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
  console.log('Navigating to Ad 55797060...');
  await page.goto('https://jiji.ng/edit-free-ad-55797060.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);

  // 1. Delete all old photos via dispatch
  console.log('Dispatching click to old photo close buttons...');
  const delCount = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button.b-image-item__close-btn'));
    btns.forEach(b => b.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true })));
    return btns.length;
  });
  console.log(`Deleted ${delCount} old images.`);
  await page.waitForTimeout(2000);

  // 2. Attach compliant banner
  const imgPath = path.resolve('public/jiji_ads/ad_10_unique.jpg');
  console.log('Attaching new banner:', imgPath);
  const fileInput = await page.$('input[type="file"]');
  if (fileInput) {
    await fileInput.setInputFiles(imgPath);
    console.log('Waiting 5s for upload...');
    await page.waitForTimeout(5000);
  }

  // 3. Update title
  const title = 'Building Material Estimator & BOQ Cost Calculator for Sites';
  const titleInput = await page.$('input[name="title"]');
  if (titleInput) {
    await titleInput.fill(title);
    console.log('Title updated:', title);
  }

  // 4. Click Next
  console.log('Clicking Next...');
  const nextBtn = await page.$('.b-create-ad-card__next-button, button:has-text("Next")');
  if (nextBtn) {
    await nextBtn.click();
    await page.waitForTimeout(3000);
  }

  // 5. Fill Price & Description
  const priceInput = await page.$('input.qa-enter-price, input[name="price"][type="text"]');
  if (priceInput) {
    await priceInput.fill('35000');
    console.log('Price set to 35000');
  }

  const desc = `Stop losing money to contractor material inflation and site waste!

We deploy an automated Building Material & BOQ Estimation Software branded for your construction business.

WHAT IS INCLUDED:
• Precision Cement, Sand & Granite mix sizer for foundations, columns and decking
• Floor & Wall Tile square-meter calculator with 12% cut breakage buffer
• Paint wall coverage estimator (Emulsion & Gloss liters)
• Instant itemized BOQ PDF generator with Lagos current market rates

PRICE: ₦35,000 Setup (or ₦80,000 Annual Pass with 1 Year Free Maintenance).

Bethelmind Digital Solutions (CAC Certified • Reg: 9912717)
Tap "Start Chat" on Jiji for a free live working demo on your phone!`;

  const descInput = await page.$('textarea[name="description"]');
  if (descInput) {
    await descInput.fill(desc);
    console.log('Description filled.');
  }

  await page.waitForTimeout(2000);

  // 6. Submit
  const submitBtn = await page.$('#submit_button, button.qa-submit-button, button[type="submit"]');
  if (submitBtn) {
    const enabled = await submitBtn.isEnabled();
    console.log('Submit button enabled:', enabled);
    if (enabled) {
      await submitBtn.click();
      console.log('Clicked submit! Waiting 7s...');
      await page.waitForTimeout(7000);
      console.log('Post submit URL:', page.url());
      await page.screenshot({ path: 'local_db/ad_55797060_resubmitted.png' });
    }
  }

  await browser.close();
}

fixAd55797060().catch(console.error);
