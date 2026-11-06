const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

async function testSingleAdDetail() {
  const config = JSON.parse(fs.readFileSync('local_db/jiji_account_config.json', 'utf8'));
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--disable-blink-features=AutomationControlled', '--no-sandbox']
  });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 1000 }
  });
  await context.route('**/*', (route) => {
    const req = route.request();
    const type = req.resourceType();
    const url = req.url();
    if (['image', 'media', 'font'].includes(type) || url.includes('google-analytics') || url.includes('facebook') || url.includes('clarity') || url.includes('criteo')) {
      return route.abort();
    }
    return route.continue();
  });
  const validCookies = (config.cookiesJson || []).map(c => {
    const copy = { ...c };
    if (!['Strict', 'Lax', 'None'].includes(copy.sameSite)) delete copy.sameSite;
    return copy;
  });
  await context.addCookies(validCookies);

  const page = await context.newPage();
  console.log('Navigating to https://jiji.ng/edit-free-ad-55797060.html...');
  await page.goto('https://jiji.ng/edit-free-ad-55797060.html', { waitUntil: 'domcontentloaded', timeout: 35000 });
  await page.waitForTimeout(3000);

  console.log('Current page URL:', page.url());
  const initialTitle = await page.$eval('input[name="title"]', el => el.value).catch(() => 'NOT FOUND');
  console.log('Current title in input:', initialTitle);

  // Update Title
  const newTitle = 'Construction Contractor Website & Material BOQ Sizing Calculator';
  console.log('Filling new title:', newTitle);
  await page.fill('input[name="title"]', newTitle);
  await page.dispatchEvent('input[name="title"]', 'input');
  await page.dispatchEvent('input[name="title"]', 'change');
  await page.waitForTimeout(1000);

  // Click Next
  const nextBtn = await page.$('button.b-create-ad-card__next-button');
  if (nextBtn) {
    console.log('Clicking Next button...');
    await nextBtn.click({ force: true });
    await page.waitForTimeout(3000);
  }

  // Check form errors / fields visible on Step 2
  const step2Info = await page.evaluate(() => {
    const priceInput = document.querySelector('input.qa-enter-price, input[name="price"][type="text"]');
    const descInput = document.querySelector('textarea[name="description"]');
    const submitBtn = document.querySelector('button.b-create-ad-card__submit-button, button.qa-submit-button, #submit_button, #boost_premium_1_button');
    const errors = Array.from(document.querySelectorAll('.b-form-error, .is-invalid, .is-error')).map(e => e.innerText.trim());

    return {
      priceVisible: priceInput ? priceInput.offsetParent !== null : false,
      priceValue: priceInput ? priceInput.value : null,
      descVisible: descInput ? descInput.offsetParent !== null : false,
      submitBtnVisible: submitBtn ? submitBtn.offsetParent !== null : false,
      submitBtnText: submitBtn ? submitBtn.innerText.trim() : null,
      submitBtnClasses: submitBtn ? submitBtn.className : null,
      errors
    };
  });
  console.log('Step 2 info before edits:\n', JSON.stringify(step2Info, null, 2));

  // Fill price 40000
  const priceInput = await page.$('input.qa-enter-price, input[name="price"][type="text"]');
  if (priceInput) {
    await priceInput.fill('40000');
    await priceInput.dispatchEvent('input');
    await priceInput.dispatchEvent('change');
    console.log('Filled price 40000');
  }

  // Fill description
  const descInput = await page.$('textarea[name="description"]');
  if (descInput) {
    const desc = `Eliminate building material waste and contractor over-budgeting on your construction sites!

We deploy instant computerized construction quantity estimators for Nigerian builders, site engineers, interior designers, and property owners.

THE "SITE MATERIAL SHIELD" BUNDLE:
1. Precision Cement, Sand Tonnage & Granite Mix Calculator for Decking & Foundations [Value: ₦75,000]
2. Floor Tile Square-Meter, Adhesive & Grout Packaging Sizer with 12% Cut Buffer [Value: ₦45,000]
3. Emulsion & Gloss Paint Bucket Wall Coverage Calculator [Value: ₦35,000]
4. POP Ceiling Sheets, Drywall Screws & Perimeter Track Estimator [Value: ₦35,000]
5. Artisan Inflation Reality Check (Flags over-ordered materials instantly) [Value: ₦40,000]
6. FREE BONUS: 1-Tap Professional Itemized BOQ PDF Generator with current Lagos prices [Value: ₦30,000]

TOTAL VALUE: ₦260,000
PRICING & ACTIVATION PLANS:
👉 100% ONE-TIME INVESTMENT: ₦80,000 Flat (50% Milestone Deposit: ₦40,000) — ₦0 Monthly Subscriptions Forever (1 Full Year Free Domain & Cloud Hosting Included)
👉 PLAN C (Full Custom Suite): ₦75,000 deposit (₦150,000 total)

Protect your construction budget from contractor inflation and stolen site materials.

⚡ CALL / WHATSAPP: 0802 279 1227
Bethelmind Digital Solutions (CAC Certified Nigerian Enterprise • Reg: 9912717)
Tap "Start Chat" on Jiji or message us on WhatsApp to test the site material estimator now!

SEARCH TAGS: building contractor lagos, boq bill of quantities, dangote cement price today, floor tiles calculation, pop ceiling design, building material estimator, quantity surveying software.`;
    await descInput.fill(desc);
    await descInput.dispatchEvent('input');
    await descInput.dispatchEvent('change');
    console.log('Filled description');
  }
  await page.waitForTimeout(2000);

  // Check submit button again
  const submitInfo = await page.evaluate(() => {
    const btn = document.querySelector('button.b-create-ad-card__submit-button, button.qa-submit-button, #submit_button, #boost_premium_1_button');
    return {
      className: btn?.className,
      disabled: btn?.disabled,
      visible: btn?.offsetParent !== null
    };
  });
  console.log('Submit button info after fills:\n', JSON.stringify(submitInfo, null, 2));

  // Click Submit
  const submitBtn = await page.$('button.b-create-ad-card__submit-button, button.qa-submit-button, #submit_button, #boost_premium_1_button');
  if (submitBtn) {
    console.log('Clicking Submit button with force: true...');
    await submitBtn.click({ force: true });
    await page.waitForTimeout(6000);
    console.log('After submit URL:', page.url());
  }

  await page.screenshot({ path: 'local_db/detail_test_55797060.png' });
  await browser.close();
}

testSingleAdDetail().catch(console.error);
