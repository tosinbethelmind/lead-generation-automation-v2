const fs = require('fs');
const { chromium } = require('playwright');

async function finishAd14() {
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

  // Check title
  const titleInput = await page.$('input[name="title"]');
  if (titleInput) {
    await titleInput.fill('Convert Website to Android App • Installable APK in 24h');
    console.log('Title updated');
  }

  // Click Next
  const nextBtn = await page.$('.b-create-ad-card__next-button, button:has-text("Next")');
  if (nextBtn) {
    console.log('Clicking Next...');
    await nextBtn.click();
    await page.waitForTimeout(3000);
  }

  // Check what fields are on Step 2
  const step2Fields = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('input, select, textarea')).map(el => ({
      name: el.name,
      type: el.type,
      offsetParent: !!el.offsetParent,
      val: el.value
    })).filter(f => f.offsetParent && f.name);
  });
  console.log('Step 2 visible fields:', JSON.stringify(step2Fields, null, 2));

  // Fill price: 35000
  const priceInput = await page.$('input.qa-enter-price, input[name="price"][type="text"]');
  if (priceInput) {
    await priceInput.fill('35000');
    console.log('Filled price 35000');
  }

  // Fill description
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
    console.log('Filled description');
  }

  await page.waitForTimeout(2000);

  // Check Specialization or any other required field
  const specialInput = await page.$('input[name*="specialization"], input[name*="brand"]');
  if (specialInput) {
    const parentSelect = await specialInput.evaluateHandle(el => el.closest('.multiselect'));
    if (parentSelect) {
      await parentSelect.click();
      await page.waitForTimeout(600);
      const firstOpt = await page.$('.multiselect__option:not(.multiselect__option--disabled)');
      if (firstOpt) {
        await firstOpt.click();
        console.log('Selected specialization');
      }
    }
  }

  // Submit
  const submitBtn = await page.$('#submit_button, button.qa-submit-button, button[type="submit"]');
  if (submitBtn) {
    console.log('Submit button enabled:', await submitBtn.isEnabled());
    if (await submitBtn.isEnabled()) {
      await submitBtn.click();
      console.log('Clicked submit! Waiting 8s...');
      await page.waitForTimeout(8000);
      console.log('Post-submit URL:', page.url());
    }
  }

  await browser.close();
}

finishAd14().catch(console.error);
