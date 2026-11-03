const fs = require('fs');
const { chromium } = require('playwright');

async function testSingleAdFlow() {
  const config = JSON.parse(fs.readFileSync('local_db/jiji_account_config.json', 'utf8'));
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--disable-blink-features=AutomationControlled', '--no-sandbox']
  });
  const context = await browser.newContext();
  const validCookies = (config.cookiesJson || []).map(c => {
    const copy = { ...c };
    if (!['Strict', 'Lax', 'None'].includes(copy.sameSite)) delete copy.sameSite;
    return copy;
  });
  await context.addCookies(validCookies);

  const page = await context.newPage();
  console.log('Navigating to Ad 55777070...');
  await page.goto('https://jiji.ng/edit-free-ad-55777070.html', {
    referer: 'https://jiji.ng/profile/adverts',
    waitUntil: 'domcontentloaded',
    timeout: 35000
  });
  await page.waitForTimeout(4000);
  await page.screenshot({ path: 'local_db/step1_initial.png' });

  // 1. Check if category needs to be switched
  console.log('Switching category to Software...');
  const catBox = await page.$('.b-category-section__category-select, .qa-choose-category');
  if (catBox) {
    await catBox.click();
    await page.waitForTimeout(1000);
    const elecOption = await page.$('.multiselect__option:has-text("Electronics"), span:has-text("Electronics")');
    if (elecOption) {
      await elecOption.click();
      await page.waitForTimeout(1500);
      const softOption = await page.$('.multiselect__option:has-text("Software"), span:has-text("Software")');
      if (softOption) {
        await softOption.click();
        await page.waitForTimeout(2000);
        console.log('Category selected: Software!');
      }
    }
  }
  await page.screenshot({ path: 'local_db/step2_category_selected.png' });

  // 2. Attach compliant banner
  const imgPath = require('path').resolve('public/jiji_ads/ad_4_unique.jpg');
  console.log('Attaching image:', imgPath);
  const fileInput = await page.$('input[type="file"]');
  if (fileInput) {
    await fileInput.setInputFiles(imgPath);
    console.log('Waiting 5s for image upload...');
    await page.waitForTimeout(5000);
  }
  await page.screenshot({ path: 'local_db/step3_image_attached.png' });

  // 3. Click Next
  console.log('Clicking Next...');
  const nextBtn = await page.$('.b-create-ad-card__next-button, button:has-text("Next")');
  if (nextBtn) {
    await nextBtn.click();
    await page.waitForTimeout(3000);
  }
  await page.screenshot({ path: 'local_db/step4_after_next.png' });

  // 4. Fill price & description
  const priceInput = await page.$('input.qa-enter-price, input[name="price"][type="text"]');
  if (priceInput) {
    await priceInput.fill('35000');
    console.log('Price set to 35000');
  }

  const desc = `Stop photoshopped bank transfer screenshots and cashier theft deficits!

Instant bank credit verification and fraud prevention software for retail stores, supermarkets, and POS operators.

WHAT IS INCLUDED:
• Real-time Moniepoint & Paystack bank webhook credit verification
• Instant green security pass sent to cashier phone ONLY on genuine credit
• Cashier shift end-of-day bank credit vs cash reconciliation in 60s
• Digital receipt generator for genuine customer transactions

PRICE: ₦35,000 Setup (or ₦80,000 Annual Pass with 1 Year Free).

Bethelmind Digital Solutions (CAC Certified • Reg: 9912717)
Tap "Start Chat" on Jiji to test the anti-fraud shield now!`;

  const descInput = await page.$('textarea[name="description"]');
  if (descInput) {
    await descInput.fill(desc);
    console.log('Description filled.');
  }

  await page.screenshot({ path: 'local_db/step5_form_filled.png' });

  // 5. Submit
  const submitBtn = await page.$('#submit_button, button.qa-submit-button, button[type="submit"]');
  if (submitBtn) {
    const enabled = await submitBtn.isEnabled();
    console.log('Submit button enabled:', enabled);
    if (enabled) {
      await submitBtn.click();
      console.log('Submit clicked! Waiting 6s...');
      await page.waitForTimeout(6000);
      console.log('Final URL:', page.url());
      await page.screenshot({ path: 'local_db/step6_submitted.png' });
    }
  }

  await browser.close();
}

testSingleAdFlow().catch(console.error);
