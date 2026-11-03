const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

async function testUploadFirstThenDelete() {
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
    if (url.includes('image-delete') || url.includes('item/modify') || url.includes('image-upload')) {
      try {
        console.log(`[API RESPONSE ${res.status()}] ${url}:`, await res.text());
      } catch (e) {}
    }
  });

  console.log('Navigating to Ad 55796997...');
  await page.goto('https://jiji.ng/edit-free-ad-55796997.html', {
    referer: 'https://jiji.ng/profile/adverts',
    waitUntil: 'domcontentloaded'
  });
  await page.waitForTimeout(4000);

  // STEP 1: Upload the new unique banner FIRST
  const imgPath = path.resolve('public/jiji_ads/ad_9_unique.jpg');
  console.log('1. Uploading new unique banner first:', imgPath);
  const fileInput = await page.$('input[type="file"]');
  if (fileInput) {
    await fileInput.setInputFiles(imgPath);
    console.log('Waiting 6s for upload to finish...');
    await page.waitForTimeout(6000);
  }

  const imagesCount = await page.evaluate(() => document.querySelectorAll('.b-image-item').length);
  console.log(`Images count after upload: ${imagesCount} (should be 2)`);

  // STEP 2: Delete the FIRST image (the old rejected image 209653398)
  console.log('2. Deleting old first image...');
  await page.evaluate(() => {
    const btns = document.querySelectorAll('.b-image-item__close-btn');
    if (btns.length > 0) {
      btns[0].click(); // click first close button
    }
  });
  await page.waitForTimeout(3000);

  const checkAfter = await page.evaluate(() => {
    return {
      imagesCount: document.querySelectorAll('.b-image-item').length,
      hasMistake: document.body.innerText.includes('mistake in photos')
    };
  });
  console.log('Check after deleting old image:', checkAfter);

  // STEP 3: Click Next
  console.log('3. Clicking Next...');
  const nextBtn = await page.$('.b-create-ad-card__next-button, button:has-text("Next")');
  if (nextBtn) {
    await nextBtn.click();
    await page.waitForTimeout(3000);
  }

  // STEP 4: Set Price & Description
  console.log('4. Setting price and description...');
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
  await page.waitForTimeout(1500);

  // STEP 5: Submit
  console.log('5. Clicking Submit button...');
  const submitBtn = await page.$('#submit_button, button.qa-submit-button, button[type="submit"]');
  if (submitBtn) {
    console.log('Submit button enabled:', await submitBtn.isEnabled());
    await submitBtn.click();
    console.log('Clicked submit! Waiting 8s...');
    await page.waitForTimeout(8000);
    console.log('URL after submit:', page.url());
  }

  await page.screenshot({ path: 'local_db/after_submit_55796997.png' });
  await browser.close();
}

testUploadFirstThenDelete().catch(console.error);
