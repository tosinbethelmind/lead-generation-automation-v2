const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

async function debugPostAd14() {
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
  console.log('Navigating to https://jiji.ng/add-free-ad.html ...');
  await page.goto('https://jiji.ng/add-free-ad.html', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);

  // 1. Fill Title
  const title = 'Convert Website to Android App • Installable APK in 24h';
  console.log('1. Setting title...');
  const titleInput = await page.$('input[name="title"]');
  if (titleInput) {
    await titleInput.fill(title);
    console.log('   ✔ Title set');
  }

  // 2. Category: Computer & IT Services -> Programming & Tech OR Electronics -> Software
  // Wait, let's see what happens if we select Services -> Computer & IT Services -> Web & App Development / Programming & Tech!
  console.log('2. Setting category...');
  const catBox = await page.$('.b-category-section__category-select, .qa-choose-category');
  if (catBox) {
    await catBox.click();
    await page.waitForTimeout(1000);

    // Let's check options
    const elecOption = await page.$('.multiselect__option:has-text("Electronics"), span:has-text("Electronics")');
    if (elecOption) {
      await elecOption.click();
      await page.waitForTimeout(1000);
      const softOption = await page.$('.multiselect__option:has-text("Software"), span:has-text("Software")');
      if (softOption) {
        await softOption.click();
        await page.waitForTimeout(1500);
        console.log('   ✔ Category selected: Software');
      }
    }
  }

  // 3. Location
  console.log('3. Checking Location...');
  const regBox = await page.$('.qa-choose-region');
  if (regBox) {
    const t = await regBox.innerText();
    console.log('   Current Region text:', t);
    if (!t || t.includes('Select Location') || t.includes('Region')) {
      await regBox.click();
      await page.waitForTimeout(1000);
      const lagos = await page.$('.multiselect__option:has-text("Lagos"), span:has-text("Lagos")');
      if (lagos) {
        await lagos.click();
        await page.waitForTimeout(1000);
        const ojodu = await page.$('.multiselect__option:has-text("Ojodu"), span:has-text("Ojodu"), .multiselect__option:has-text("Ikeja")');
        if (ojodu) {
          await ojodu.click();
          console.log('   ✔ Selected Ojodu, Lagos');
        }
      }
    }
  }

  // 4. Attach compliant image
  console.log('4. Attaching image...');
  const imgPath = path.resolve('public/jiji_ads/ad_14_website_to_android_app_luxury.png');
  const fileInput = await page.$('input[type="file"]');
  if (fileInput) {
    await fileInput.setInputFiles(imgPath);
    console.log('   ✔ File attached, waiting 5s...');
    await page.waitForTimeout(5000);
  }

  // Check all fields and errors on Step 1 before clicking Next
  const step1State = await page.evaluate(() => {
    const fields = [];
    document.querySelectorAll('.fw-field').forEach(f => {
      fields.push({
        text: f.innerText.trim(),
        hasError: f.className.includes('has-error'),
        className: f.className
      });
    });
    return fields;
  });
  console.log('Step 1 Fields State:', JSON.stringify(step1State, null, 2));

  await page.screenshot({ path: 'local_db/ad_14_step1_before_next.png' });

  // 5. Click Next
  const nextBtn = await page.$('.b-create-ad-card__next-button, button:has-text("Next")');
  console.log('Next button exists:', !!nextBtn);
  if (nextBtn) {
    const isEnabled = await nextBtn.isEnabled();
    console.log('Next button isEnabled:', isEnabled);
    if (isEnabled) {
      await nextBtn.click();
      await page.waitForTimeout(4000);
      console.log('Post-Next URL:', page.url());
      await page.screenshot({ path: 'local_db/ad_14_step2_after_next.png' });

      // Check if price field is present
      const priceInput = await page.$('input.qa-enter-price, input[name="price"]');
      console.log('Price input found on Step 2:', !!priceInput);

      if (priceInput) {
        await priceInput.fill('35000');
        console.log('Price filled: 35000');
      }

      const descInput = await page.$('textarea[name="description"]');
      console.log('Desc input found on Step 2:', !!descInput);
      if (descInput) {
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
        await descInput.fill(desc);
        console.log('Description filled');
      }

      const submitBtn = await page.$('#submit_button, button.qa-submit-button, button[type="submit"]');
      if (submitBtn) {
        const subEnabled = await submitBtn.isEnabled();
        console.log('Submit button isEnabled:', subEnabled);
        if (subEnabled) {
          await submitBtn.click();
          await page.waitForTimeout(6000);
          console.log('Final Post-Submit URL:', page.url());
          await page.screenshot({ path: 'local_db/ad_14_published_result.png' });
        }
      }
    }
  }

  await browser.close();
}

debugPostAd14().catch(console.error);
