const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

async function fixAd55774340() {
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
  console.log('Navigating to https://jiji.ng/edit-free-ad-55774340.html ...');
  await page.goto('https://jiji.ng/edit-free-ad-55774340.html', { waitUntil: 'domcontentloaded', timeout: 35000 });
  await page.waitForTimeout(3000);

  // 1. Delete all old photos
  console.log('Checking for old images to delete...');
  let delAttempts = 0;
  while (delAttempts < 10) {
    const closeBtn = await page.$('.b-image-item__close-btn');
    if (!closeBtn) break;
    console.log(`Deleting image ${delAttempts + 1}...`);
    await closeBtn.click({ force: true }).catch(() => {});
    await page.waitForTimeout(1000);
    delAttempts++;
  }
  console.log(`Deleted ${delAttempts} images.`);

  // 2. Attach ad_2_unique.jpg
  const imgPath = path.resolve('public/jiji_ads/ad_2_unique.jpg');
  console.log('Attaching new compliant banner:', imgPath);
  const fileInput = await page.$('input[type="file"]');
  if (fileInput) {
    await fileInput.setInputFiles(imgPath);
    console.log('Waiting 5s for upload...');
    await page.waitForTimeout(5000);
  }

  // 3. Update title
  const title = 'Website Design Lagos • 24h Express Delivery & WhatsApp Closer';
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

  // 5. Check Price and Description
  const priceInput = await page.$('input.qa-enter-price, input[name="price"][type="text"]');
  if (priceInput) {
    await priceInput.fill('35000');
    console.log('Price set to 35000');
  }

  const desc = `Stop losing paying customers when they search for your business on Google!

We build and launch your complete, ultra-fast mobile business website + 24/7 WhatsApp AI Closer in exactly 24 HOURS.

WHAT IS INCLUDED:
• Official Mobile Business Website (Fast-loading on all phones)
• 24/7 AI WhatsApp Sales Closer (Replies to customer inquiries in 3s)
• Google Maps & Business Search Profile SEO ranking setup
• Automated Moniepoint / OPay anti-fake alert transfer shield
• 36-State interstate park delivery fee sizer

PRICE: ₦35,000 Setup (or ₦80,000 Annual Pass with 1 Year Free Maintenance).

Bethelmind Digital Solutions (CAC Certified • Reg: 9912717)
Tap "Start Chat" on Jiji for your live business website demo!`;

  const descInput = await page.$('textarea[name="description"]');
  if (descInput) {
    await descInput.fill(desc);
    console.log('Description updated.');
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
      await page.screenshot({ path: 'local_db/fix_ad_55774340_result.png' });
    }
  }

  await browser.close();
}

fixAd55774340().catch(console.error);
