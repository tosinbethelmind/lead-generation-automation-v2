const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

async function testSubmit() {
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
    if (url.includes('api_web') || url.includes('item-edit') || url.includes('item-create') || url.includes('edit-free-ad')) {
      try {
        const text = await res.text();
        if (text.length < 1500) {
          console.log(`[API RESPONSE ${res.status()}] ${url}:`, text);
        } else {
          console.log(`[API RESPONSE ${res.status()}] ${url} (length ${text.length})`);
        }
      } catch (e) {}
    }
  });

  console.log('Navigating to Ad 55796997...');
  await page.goto('https://jiji.ng/edit-free-ad-55796997.html', {
    referer: 'https://jiji.ng/profile/adverts',
    waitUntil: 'domcontentloaded'
  });
  await page.waitForTimeout(4000);

  // Check what category and fields exist
  const info = await page.evaluate(() => {
    return {
      title: document.querySelector('input[name="title"]')?.value,
      category: document.querySelector('.b-category-select__value, .qa-category-select')?.innerText?.trim(),
      breadcrumbs: Array.from(document.querySelectorAll('.b-form-category-breadcrumbs__item, .b-category-select__item')).map(e => e.innerText.trim()),
      imagesCount: document.querySelectorAll('.b-image-item').length,
      imageErrors: Array.from(document.querySelectorAll('.b-image-item__error, .b-form-warning')).map(e => e.innerText.trim()),
      formErrors: Array.from(document.querySelectorAll('.b-form-field-error, .qa-form-error, .b-notification')).map(e => e.innerText.trim())
    };
  });
  console.log('Current Ad Info:', JSON.stringify(info, null, 2));

  // Delete all old photos
  console.log('Deleting existing photos...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button.b-image-item__close-btn'));
    btns.forEach(b => b.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true })));
  });
  await page.waitForTimeout(2000);

  // Upload ad_9_unique.jpg
  const imgPath = path.resolve('public/jiji_ads/ad_9_unique.jpg');
  console.log('Uploading photo:', imgPath);
  const fileInput = await page.$('input[type="file"]');
  if (fileInput) {
    await fileInput.setInputFiles(imgPath);
    console.log('Waiting 6s for upload to complete...');
    await page.waitForTimeout(6000);
  }

  // Check images after upload
  const imgCountAfter = await page.evaluate(() => document.querySelectorAll('.b-image-item').length);
  console.log('Images count after upload:', imgCountAfter);

  // Let's check Specialization field if in Services
  const specSelected = await page.evaluate(() => {
    const spec = document.querySelector('input[name="attr_4288_logo_an_brand"]');
    return spec ? spec.value : 'no spec input found';
  });
  console.log('Specialization input:', specSelected);

  // Click Next button
  const nextBtn = await page.$('.b-create-ad-card__next-button, button:has-text("Next")');
  if (nextBtn) {
    console.log('Next button found. Is enabled:', await nextBtn.isEnabled());
    await nextBtn.click();
    console.log('Clicked Next, waiting 3s...');
    await page.waitForTimeout(3000);
  } else {
    console.log('No Next button found! Checking if single page form...');
  }

  // Check form state at Step 2
  const step2Info = await page.evaluate(() => {
    return {
      priceVisible: !!document.querySelector('input.qa-enter-price, input[name="price"][type="text"]'),
      priceVal: document.querySelector('input.qa-enter-price, input[name="price"][type="text"]')?.value,
      descVisible: !!document.querySelector('textarea[name="description"]'),
      submitBtnVisible: !!document.querySelector('#submit_button, button.qa-submit-button, button[type="submit"]'),
      submitBtnDisabled: document.querySelector('#submit_button, button.qa-submit-button, button[type="submit"]')?.disabled,
      anyErrors: Array.from(document.querySelectorAll('.b-form-field-error, .qa-form-error, .b-notification, .b-form-warning')).map(e => e.innerText.trim())
    };
  });
  console.log('Step 2 info:', JSON.stringify(step2Info, null, 2));

  // Fill price and description
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

  await page.waitForTimeout(2000);

  const submitBtn = await page.$('#submit_button, button.qa-submit-button, button[type="submit"]');
  if (submitBtn) {
    console.log('Final submit button disabled:', await submitBtn.isDisabled());
    await submitBtn.click();
    console.log('Clicked submit! Waiting 8s for API responses...');
    await page.waitForTimeout(8000);
    console.log('URL after submit:', page.url());
  }

  const finalCheck = await page.evaluate(() => {
    return {
      errors: Array.from(document.querySelectorAll('.b-form-field-error, .qa-form-error, .b-notification, .b-form-warning, .b-alert')).map(e => e.innerText.trim()),
      toast: document.querySelector('.b-toast, .b-popup')?.innerText?.trim()
    };
  });
  console.log('Final check:', JSON.stringify(finalCheck, null, 2));

  await browser.close();
}

testSubmit().catch(console.error);
