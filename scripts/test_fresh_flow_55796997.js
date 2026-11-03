const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { chromium } = require('playwright');

function generateFreshImage(srcFilename, outFilename) {
  const pyScript = path.resolve('scripts/make_fresh_banner.py');
  execSync(`python "${pyScript}" "${srcFilename}" "${outFilename}"`, { stdio: 'inherit' });
}

async function runFreshFlow() {
  const adId = '55796997';
  const srcPng = path.resolve('public/jiji_ads/ad_9_stock_theft_ledger_luxury.png');
  const freshJpg = path.resolve(`public/jiji_ads/ad_9_fresh_${Date.now()}.jpg`);

  console.log('Generating brand-new unique image...');
  generateFreshImage(srcPng, freshJpg);

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
        console.log(`[API RESPONSE ${res.status()}] ${url}:`, await res.text());
      } catch (e) {}
    }
  });

  console.log(`Navigating to Ad ${adId}...`);
  await page.goto(`https://jiji.ng/edit-free-ad-${adId}.html`, {
    referer: 'https://jiji.ng/profile/adverts',
    waitUntil: 'domcontentloaded'
  });
  await page.waitForTimeout(4000);

  // 1. Upload fresh image FIRST
  console.log('1. Uploading fresh unique banner first...');
  const fileInput = await page.$('input[type="file"]');
  if (fileInput) {
    await fileInput.setInputFiles(freshJpg);
    console.log('Waiting 6s for upload...');
    await page.waitForTimeout(6000);
  }

  const countAfterUpload = await page.evaluate(() => document.querySelectorAll('.b-image-item').length);
  console.log(`Images count after upload: ${countAfterUpload}`);

  // 2. Delete old image (first button)
  if (countAfterUpload > 1) {
    console.log('2. Deleting old image...');
    await page.evaluate(() => {
      const btns = document.querySelectorAll('.b-image-item__close-btn');
      if (btns.length > 0) btns[0].click();
    });
    await page.waitForTimeout(3000);
  }

  const countAfterDelete = await page.evaluate(() => document.querySelectorAll('.b-image-item').length);
  console.log(`Images count after delete: ${countAfterDelete}`);

  // 3. Update Title
  const title = 'Multi-Store Retail Inventory & Pure Water Factory Stock App';
  const titleInput = await page.$('input[name="title"]');
  if (titleInput) await titleInput.fill(title);

  // 4. Click Next
  console.log('3. Clicking Next...');
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

  const descInput = await page.$('textarea[name="description"]');
  if (descInput) {
    await descInput.fill(desc);
    console.log('Description filled');
  }

  await page.waitForTimeout(2000);

  // 6. Submit
  const submitBtn = await page.$('#submit_button, button.qa-submit-button, button[type="submit"]');
  if (submitBtn) {
    const enabled = await submitBtn.isEnabled();
    console.log('Submit button enabled:', enabled);
    if (enabled) {
      await submitBtn.click();
      console.log('Clicked submit! Waiting 8s...');
      await page.waitForTimeout(8000);
      console.log('Post-submit URL:', page.url());
    }
  }

  await page.screenshot({ path: `local_db/post_submit_${adId}.png` });
  await browser.close();
}

runFreshFlow().catch(console.error);
