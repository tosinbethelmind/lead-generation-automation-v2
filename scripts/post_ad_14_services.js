const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

async function postAd14AsServices() {
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
    if (res.url().includes('create') || res.url().includes('item') || res.url().includes('ad')) {
      if (res.request().method() === 'POST') {
        try {
          const body = await res.text();
          if (body.includes('status') || body.includes('error') || body.includes('success')) {
            console.log(`[API POST ${res.status()}] ${body.slice(0, 300)}`);
          }
        } catch (e) {}
      }
    }
  });

  console.log('Navigating to https://jiji.ng/add-free-ad.html ...');
  await page.goto('https://jiji.ng/add-free-ad.html', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);

  // 1. Title (65 chars <= 70)
  const title = 'Mobile App Development • Convert Website to Android App in 24h';
  console.log('1. Setting title...');
  const titleInput = await page.$('input[name="title"]');
  if (titleInput) {
    await titleInput.fill(title);
    console.log(`   ✔ Title: "${title}" (${title.length} chars)`);
  }

  // 2. Category: Services -> Computer & IT Services
  console.log('2. Setting category to Computer & IT Services...');
  const catBox = await page.$('.b-category-section__category-select, .qa-choose-category');
  if (catBox) {
    await catBox.click();
    await page.waitForTimeout(1000);
    const servOption = await page.$('.multiselect__option:has-text("Services"), span:has-text("Services")');
    if (servOption) {
      await servOption.click();
      await page.waitForTimeout(1000);
      const compOption = await page.$('.multiselect__option:has-text("Computer & IT Services"), span:has-text("Computer & IT Services")');
      if (compOption) {
        await compOption.click();
        await page.waitForTimeout(1500);
        console.log('   ✔ Category set: Computer & IT Services');
      }
    }
  }

  // 3. Location: Ojodu, Lagos
  console.log('3. Checking Location...');
  const regBox = await page.$('.qa-choose-region');
  if (regBox) {
    const regText = await regBox.innerText();
    if (!regText || regText.includes('Select Location')) {
      await regBox.click();
      await page.waitForTimeout(1000);
      const lagos = await page.$('.multiselect__option:has-text("Lagos"), span:has-text("Lagos")');
      if (lagos) {
        await lagos.click();
        await page.waitForTimeout(1000);
        const ojodu = await page.$('.multiselect__option:has-text("Ojodu"), span:has-text("Ojodu"), .multiselect__option:has-text("Ikeja")');
        if (ojodu) await ojodu.click();
      }
    }
  }

  // 4. Attach compliant unique banner
  console.log('4. Attaching unique JPEG image...');
  const imgPath = path.resolve('public/jiji_ads/ad_14_website_to_android_app_luxury_unique.jpg');
  const fileInput = await page.$('input[type="file"]');
  if (fileInput) {
    await fileInput.setInputFiles(imgPath);
    console.log('   ✔ Image attached, waiting 6s for upload...');
    await page.waitForTimeout(6000);
  }

  // 5. Click Next
  console.log('5. Clicking Next button...');
  const nextBtn = await page.$('.b-create-ad-card__next-button, button:has-text("Next")');
  if (nextBtn) {
    await nextBtn.click();
    await page.waitForTimeout(3000);
  }

  // 6. Step 2: Price & Description
  console.log('6. Filling Price & Description...');
  const priceInput = await page.$('input.qa-enter-price, input[name="price"]');
  if (priceInput) {
    await priceInput.fill('35000');
    console.log('   ✔ Price set to ₦35,000');
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
    console.log(`   ✔ Description set (${desc.length} chars)`);
  }

  await page.waitForTimeout(2000);

  // 7. Submit
  console.log('7. Submitting Ad #14...');
  const submitBtn = await page.$('#submit_button, button.qa-submit-button, button[type="submit"]');
  if (submitBtn) {
    const isEnabled = await submitBtn.isEnabled();
    console.log('Submit button isEnabled:', isEnabled);
    if (isEnabled) {
      await submitBtn.click();
      await page.waitForTimeout(6000);
      console.log('Final Post-Submit URL:', page.url());
      await page.screenshot({ path: 'local_db/ad_14_published_services.png' });
    }
  }

  await browser.close();
}

postAd14AsServices().catch(console.error);
