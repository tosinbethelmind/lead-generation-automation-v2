const fs = require('fs');
const { chromium } = require('playwright');

async function finishAd14Simple() {
  const adId = '51159464';
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
    if (url.includes('item/modify') || url.includes('item-create')) {
      try {
        console.log(`[API RESPONSE ${res.status()}] ${url}:`, (await res.text()).slice(0, 300));
      } catch (e) {}
    }
  });

  console.log(`Navigating to Draft ${adId}...`);
  await page.goto(`https://jiji.ng/edit-free-ad-${adId}.html`, {
    referer: 'https://jiji.ng/profile/adverts',
    waitUntil: 'domcontentloaded'
  });
  await page.waitForTimeout(4000);

  // Update Title on Step 1
  const title = 'Convert Website to Android App • Installable APK in 24h';
  const titleInput = await page.$('input[name="title"]');
  if (titleInput) {
    await titleInput.fill(title);
    console.log('Title updated:', title);
  }

  // Click Next
  console.log('Clicking Next...');
  const nextBtn = await page.$('.b-create-ad-card__next-button, button:has-text("Next")');
  if (nextBtn) {
    await nextBtn.click();
    await page.waitForTimeout(3000);
  }

  // Price & Desc on Step 2
  const priceInput = await page.$('input.qa-enter-price, input[name="price"][type="text"]');
  if (priceInput) {
    await priceInput.fill('35000');
    console.log('Price set to 35000');
  }

  const desc = `Turn your business website into an installable Android Mobile App in 24 hours!

Did you know 82% of Nigerian customers prefer tapping an app icon on their phone rather than typing a URL in Chrome?

WHAT IS INCLUDED:
• Native Android App (.APK) compiled for all Android phones
• Direct WhatsApp chat & 1-tap call integration (No browser errors)
• Seamless OPay, Moniepoint & Paystack payment deep-linking
• Branded app icon, custom splash screen & offline fallback page
• Dedicated 1-tap download link for your Instagram bio & WhatsApp
• Zero Google Play $25 fee and zero 14-day 20-tester wait!

PRICE: ₦35,000 Setup (or ₦80,000 Annual Pass with 1 Year Free).

Bethelmind Digital Solutions (CAC Certified • Reg: 9912717)
Tap "Start Chat" on Jiji for your business app demo!`;

  const descInput = await page.$('textarea[name="description"]');
  if (descInput) {
    await descInput.fill(desc);
    console.log('Description filled');
  }

  await page.waitForTimeout(1500);

  // Submit
  const submitBtn = await page.$('#submit_button, button.qa-submit-button, button[type="submit"]');
  if (submitBtn) {
    const isEnabled = await submitBtn.isEnabled();
    console.log('Submit button enabled:', isEnabled);
    if (isEnabled) {
      await submitBtn.click();
      console.log('Clicked submit! Waiting 8s...');
      await page.waitForTimeout(8000);
      console.log('Post-submit URL:', page.url());
    }
  }

  await page.screenshot({ path: `local_db/post_submit_${adId}.png` });
  await browser.close();
}

finishAd14Simple().catch(console.error);
