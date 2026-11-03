const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

async function testProperDelete() {
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
    if (url.includes('item/modify') || url.includes('item-edit')) {
      try {
        const text = await res.text();
        console.log(`[API RESPONSE ${res.status()}] ${url}:`, text);
      } catch (e) {}
    }
  });

  console.log('Navigating to Ad 55796997...');
  await page.goto('https://jiji.ng/edit-free-ad-55796997.html', {
    referer: 'https://jiji.ng/profile/adverts',
    waitUntil: 'domcontentloaded'
  });

  // Wait explicitly for image item to appear
  try {
    await page.waitForSelector('.b-image-item', { timeout: 10000 });
    console.log('Found .b-image-item!');
  } catch (e) {
    console.log('No .b-image-item appeared after 10s');
  }

  // Count existing images
  let existingBtns = await page.$$('button.b-image-item__close-btn');
  console.log('Close buttons found:', existingBtns.length);

  while (existingBtns.length > 0) {
    console.log(`Deleting image (buttons left: ${existingBtns.length})...`);
    await existingBtns[0].click({ force: true });
    await page.waitForTimeout(2000);
    existingBtns = await page.$$('button.b-image-item__close-btn');
  }
  console.log('All old images deleted! Close buttons remaining:', existingBtns.length);

  // Now upload ad_9_unique.jpg
  const imgPath = path.resolve('public/jiji_ads/ad_9_unique.jpg');
  console.log('Uploading photo:', imgPath);
  const fileInput = await page.$('input[type="file"]');
  if (fileInput) {
    await fileInput.setInputFiles(imgPath);
    console.log('Waiting 6s for upload to complete...');
    await page.waitForTimeout(6000);
  }

  const finalBtns = await page.$$('button.b-image-item__close-btn');
  console.log('Final close buttons (should be 1 for new image):', finalBtns.length);

  // Click Next
  const nextBtn = await page.$('.b-create-ad-card__next-button, button:has-text("Next")');
  if (nextBtn) {
    await nextBtn.click();
    await page.waitForTimeout(3000);
  }

  // Price & Desc
  const priceInput = await page.$('input.qa-enter-price, input[name="price"][type="text"]');
  if (priceInput) await priceInput.fill('35000');

  const descInput = await page.$('textarea[name="description"]');
  if (descInput) {
    const desc = `Stop employee stock shrinkage, unrecorded cash deficits, and driver fraud!

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
    await descInput.fill(desc);
  }

  await page.waitForTimeout(2000);
  const submitBtn = await page.$('#submit_button, button.qa-submit-button, button[type="submit"]');
  if (submitBtn) {
    console.log('Clicking submit...');
    await submitBtn.click();
    await page.waitForTimeout(8000);
    console.log('Post-submit URL:', page.url());
  }

  await browser.close();
}

testProperDelete().catch(console.error);
