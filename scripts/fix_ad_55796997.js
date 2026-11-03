const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

async function fixAd55796997() {
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

  console.log('Navigating to Ad 55796997 with networkidle...');
  await page.goto('https://jiji.ng/edit-free-ad-55796997.html', {
    referer: 'https://jiji.ng/profile/adverts',
    waitUntil: 'networkidle'
  });
  await page.waitForTimeout(2000);

  // Inspect the close button tag and properties
  const closeBtnDetails = await page.evaluate(() => {
    const btn = document.querySelector('.b-image-item__close-btn');
    if (!btn) return null;
    return {
      tagName: btn.tagName,
      className: btn.className,
      outerHTML: btn.outerHTML,
      offsetParent: btn.offsetParent !== null,
      parentClass: btn.parentElement?.className
    };
  });
  console.log('Close button details:', closeBtnDetails);

  if (closeBtnDetails) {
    // Hover over the image wrapper first to make controls visible
    console.log('Hovering over .b-image-item__wrapper...');
    await page.hover('.b-image-item__wrapper');
    await page.waitForTimeout(500);

    console.log('Clicking .b-image-item__close-btn with force: true...');
    await page.click('.b-image-item__close-btn', { force: true });
    await page.waitForTimeout(2000);

    const checkAfter = await page.evaluate(() => {
      return {
        remainingImages: document.querySelectorAll('.b-image-item').length,
        hasMistakeNotice: document.body.innerText.includes('mistake in photos')
      };
    });
    console.log('After delete check:', checkAfter);
  }

  // Upload ad_9_unique.jpg
  const imgPath = path.resolve('public/jiji_ads/ad_9_unique.jpg');
  console.log('Attaching new banner:', imgPath);
  const fileInput = await page.$('input[type="file"]');
  if (fileInput) {
    await fileInput.setInputFiles(imgPath);
    console.log('Waiting 6s for upload to process...');
    await page.waitForTimeout(6000);
  }

  const checkUpload = await page.evaluate(() => {
    return {
      totalImages: document.querySelectorAll('.b-image-item').length,
      errors: Array.from(document.querySelectorAll('.b-image-item__error, .b-form-warning')).map(e => e.innerText.trim())
    };
  });
  console.log('After upload check:', checkUpload);

  // Specialization check
  const hasSpec = await page.evaluate(() => {
    const input = document.querySelector('input[name="attr_4288_logo_an_brand"]');
    return input ? input.value : null;
  });
  console.log('Specialization value:', hasSpec);

  // Click Next
  const nextBtn = await page.$('.b-create-ad-card__next-button, button:has-text("Next")');
  if (nextBtn) {
    console.log('Clicking Next...');
    await nextBtn.click();
    await page.waitForTimeout(3000);
  }

  // Price & Description
  const priceInput = await page.$('input.qa-enter-price, input[name="price"][type="text"]');
  if (priceInput) {
    await priceInput.fill('35000');
    console.log('Filled price 35000');
  }

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
    console.log('Filled description');
  }

  await page.waitForTimeout(1500);

  const submitBtn = await page.$('#submit_button, button.qa-submit-button, button[type="submit"]');
  if (submitBtn) {
    console.log('Clicking Submit button...');
    await submitBtn.click();
    console.log('Waiting 8s for submit response...');
    await page.waitForTimeout(8000);
    console.log('Post-submit URL:', page.url());
  }

  await page.screenshot({ path: 'local_db/post_submit_55796997.png' });
  await browser.close();
}

fixAd55796997().catch(console.error);
