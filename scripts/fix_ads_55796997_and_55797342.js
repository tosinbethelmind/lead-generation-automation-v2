const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

async function fixTwoAds() {
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

  // ==========================================
  // AD 1: 55796997 (Multi-Store Inventory)
  // ==========================================
  console.log('\n==========================================');
  console.log('Fixing Ad 55796997 (Multi-Store Inventory)...');
  console.log('==========================================');
  await page.goto('https://jiji.ng/edit-free-ad-55796997.html', {
    referer: 'https://jiji.ng/profile/adverts',
    waitUntil: 'domcontentloaded'
  });
  await page.waitForTimeout(4000);

  // Delete all old photos
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button.b-image-item__close-btn'));
    btns.forEach(b => b.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true })));
  });
  await page.waitForTimeout(1500);

  // Upload ad_9_unique.jpg
  const imgPath9 = path.resolve('public/jiji_ads/ad_9_unique.jpg');
  console.log('Attaching:', imgPath9);
  const fileInput9 = await page.$('input[type="file"]');
  if (fileInput9) {
    await fileInput9.setInputFiles(imgPath9);
    console.log('Waiting 5s for upload...');
    await page.waitForTimeout(5000);
  }

  // Update title
  const title9 = 'Multi-Store Retail Inventory & Pure Water Factory Stock App';
  const titleInput9 = await page.$('input[name="title"]');
  if (titleInput9) await titleInput9.fill(title9);

  // Click Next
  const nextBtn9 = await page.$('.b-create-ad-card__next-button, button:has-text("Next")');
  if (nextBtn9) {
    await nextBtn9.click();
    await page.waitForTimeout(3000);
  }

  // Set Price & Description
  const priceInput9 = await page.$('input.qa-enter-price, input[name="price"][type="text"]');
  if (priceInput9) await priceInput9.fill('35000');

  const desc9 = `Stop employee stock shrinkage, unrecorded cash deficits, and driver fraud!

We deploy multi-branch inventory control software for retail shops, supermarkets, and pure water factories.

WHAT IS INCLUDED:
• Multi-Branch real-time stock sync across shops and central warehouse
• Pure Water route reconciler (Bags loaded vs cash vs burst allowance)
• Inter-branch transfer digital gate pass with dual sign-off
• Staff permission gating (attendants cannot edit prices or delete sales)
• Instant low-stock & theft alerts sent to your phone

PRICE: ₦35,000 Setup (or ₦80,000 Annual Pass with 1 Year Free).

Bethelmind Digital Solutions (CAC Certified • Reg: 9912717)
Tap "Start Chat" on Jiji to test the live inventory demo!`;

  const descInput9 = await page.$('textarea[name="description"]');
  if (descInput9) await descInput9.fill(desc9);

  await page.waitForTimeout(1500);

  // Submit
  const submitBtn9 = await page.$('#submit_button, button.qa-submit-button, button[type="submit"]');
  if (submitBtn9) {
    console.log('Submit button enabled:', await submitBtn9.isEnabled());
    await submitBtn9.click();
    console.log('Clicked submit! Waiting 7s...');
    await page.waitForTimeout(7000);
    console.log('Ad 55796997 Post-submit URL:', page.url());
  }

  // ==========================================
  // AD 2: 55797342 (Shortlet Apartment Booking)
  // ==========================================
  console.log('\n==========================================');
  console.log('Fixing Ad 55797342 (Shortlet Apartment)...');
  console.log('==========================================');
  await page.goto('https://jiji.ng/edit-free-ad-55797342.html', {
    referer: 'https://jiji.ng/profile/adverts',
    waitUntil: 'domcontentloaded'
  });
  await page.waitForTimeout(4000);

  // Delete all old photos
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button.b-image-item__close-btn'));
    btns.forEach(b => b.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true })));
  });
  await page.waitForTimeout(1500);

  // Upload ad_11_unique.jpg
  const imgPath11 = path.resolve('public/jiji_ads/ad_11_unique.jpg');
  console.log('Attaching:', imgPath11);
  const fileInput11 = await page.$('input[type="file"]');
  if (fileInput11) {
    await fileInput11.setInputFiles(imgPath11);
    console.log('Waiting 5s for upload...');
    await page.waitForTimeout(5000);
  }

  // Update title
  const title11 = 'Shortlet Apartment Direct Booking Engine & Caution Fee Escrow';
  const titleInput11 = await page.$('input[name="title"]');
  if (titleInput11) await titleInput11.fill(title11);

  // Click Next
  const nextBtn11 = await page.$('.b-create-ad-card__next-button, button:has-text("Next")');
  if (nextBtn11) {
    await nextBtn11.click();
    await page.waitForTimeout(3000);
  }

  // Set Price & Description
  const priceInput11 = await page.$('input.qa-enter-price, input[name="price"][type="text"]');
  if (priceInput11) await priceInput11.fill('45000');

  const desc11 = `Stop losing 18-20% Airbnb / Booking commissions and avoid utility disputes!

Direct shortlet booking & caution deposit escrow software for apartment hosts.

WHAT IS INCLUDED:
• Direct mobile guest booking calendar with instant Paystack/OPay lock
• Automated electricity prepaid meter quota vs caution refund sizer
• Digital check-in passport/ID verification and property agreement
• Instant WhatsApp gate pass code generator for estate security guards

PRICE: ₦45,000 Setup (or ₦95,000 Annual Pass with 1 Year Free).

Bethelmind Digital Solutions (CAC Certified • Reg: 9912717)
Tap "Start Chat" on Jiji for your free live booking demo!`;

  const descInput11 = await page.$('textarea[name="description"]');
  if (descInput11) await descInput11.fill(desc11);

  await page.waitForTimeout(1500);

  // Submit
  const submitBtn11 = await page.$('#submit_button, button.qa-submit-button, button[type="submit"]');
  if (submitBtn11) {
    console.log('Submit button enabled:', await submitBtn11.isEnabled());
    await submitBtn11.click();
    console.log('Clicked submit! Waiting 7s...');
    await page.waitForTimeout(7000);
    console.log('Ad 55797342 Post-submit URL:', page.url());
  }

  await browser.close();
}

fixTwoAds().catch(console.error);
