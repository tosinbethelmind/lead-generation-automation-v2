const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

async function fixAd55797342() {
  const adId = '55797342';
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
    if (url.includes('item/modify') || url.includes('image-upload')) {
      try {
        console.log(`[API RESPONSE ${res.status()}] ${url}:`, (await res.text()).slice(0, 500));
      } catch (e) {}
    }
  });

  console.log(`Navigating to Ad ${adId}...`);
  await page.goto(`https://jiji.ng/edit-free-ad-${adId}.html`, {
    referer: 'https://jiji.ng/profile/adverts',
    waitUntil: 'domcontentloaded'
  });
  await page.waitForTimeout(4000);

  // Check what is on page
  const pageState = await page.evaluate(() => {
    return {
      title: document.querySelector('input[name="title"]')?.value,
      imagesCount: document.querySelectorAll('.b-image-item').length,
      hasPrice: !!document.querySelector('input.qa-enter-price, input[name="price"][type="text"]'),
      priceVal: document.querySelector('input.qa-enter-price, input[name="price"][type="text"]')?.value,
      hasDesc: !!document.querySelector('textarea[name="description"]'),
      descVal: document.querySelector('textarea[name="description"]')?.value?.slice(0, 100),
      hasNext: !!document.querySelector('.b-create-ad-card__next-button')
    };
  });
  console.log('Page state on load:', pageState);

  // If there are images, let's see them
  // Upload fresh ad_11_unique.jpg
  const imgPath = path.resolve('public/jiji_ads/ad_11_unique.jpg');
  console.log('Attaching:', imgPath);
  const fileInput = await page.$('input[type="file"]');
  if (fileInput) {
    await fileInput.setInputFiles(imgPath);
    console.log('Waiting 6s for upload...');
    await page.waitForTimeout(6000);
  }

  // Check if Next button exists
  const nextBtn = await page.$('.b-create-ad-card__next-button, button:has-text("Next")');
  if (nextBtn) {
    console.log('Clicking Next...');
    await nextBtn.click();
    await page.waitForTimeout(3000);
  }

  // Price & Desc
  const priceInput = await page.$('input.qa-enter-price, input[name="price"][type="text"]');
  if (priceInput) {
    await priceInput.fill('45000');
    console.log('Set price to 45000');
  }

  const desc = `Stop losing 18-20% Airbnb / Booking commissions and avoid utility disputes!

Direct shortlet booking & caution deposit escrow software for apartment hosts.

WHAT IS INCLUDED:
• Direct mobile guest booking calendar with instant Paystack/OPay lock
• Automated electricity prepaid meter quota vs caution refund sizer
• Digital check-in passport/ID verification and property agreement
• Instant WhatsApp gate pass code generator for estate security guards

PRICE: ₦45,000 Setup (or ₦95,000 Annual Pass with 1 Year Free).

Bethelmind Digital Solutions (CAC Certified • Reg: 9912717)
Tap "Start Chat" on Jiji for your free live booking demo!`;

  const descInput = await page.$('textarea[name="description"]');
  if (descInput) {
    await descInput.fill(desc);
    console.log('Set description (length:', desc.length, ')');
  }

  await page.waitForTimeout(1500);

  const submitBtn = await page.$('#submit_button, button.qa-submit-button, button[type="submit"]');
  if (submitBtn) {
    console.log('Submit button enabled:', await submitBtn.isEnabled());
    await submitBtn.click();
    console.log('Clicked submit! Waiting 8s...');
    await page.waitForTimeout(8000);
    console.log('Post-submit URL:', page.url());
  }

  await page.screenshot({ path: `local_db/post_submit_${adId}.png` });
  await browser.close();
}

fixAd55797342().catch(console.error);
