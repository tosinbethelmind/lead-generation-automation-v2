const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

async function submitSoftwareFull() {
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
  console.log('Navigating to Ad 55777070...');
  await page.goto('https://jiji.ng/edit-free-ad-55777070.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);

  // 1. Change Category to Software
  console.log('1. Setting Category to Electronics -> Software...');
  const catBox = await page.$('.b-category-section__category-select, .qa-choose-category');
  if (catBox) {
    await catBox.click();
    await page.waitForTimeout(1000);
    const elec = await page.$('.multiselect__option:has-text("Electronics"), span:has-text("Electronics")');
    if (elec) {
      await elec.click();
      await page.waitForTimeout(1000);
      const soft = await page.$('.multiselect__option:has-text("Software"), span:has-text("Software")');
      if (soft) {
        await soft.click();
        await page.waitForTimeout(2000);
        console.log('   ✔ Switched to Software!');
      }
    }
  }

  // 2. Delete old images
  console.log('2. Deleting old images...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button.b-image-item__close-btn'));
    btns.forEach(b => b.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true })));
  });
  await page.waitForTimeout(1500);

  // 3. Attach compliant banner
  const imgPath = path.resolve('public/jiji_ads/ad_4_unique.jpg');
  console.log('3. Attaching unique banner:', imgPath);
  const fileInput = await page.$('input[type="file"]');
  if (fileInput) {
    await fileInput.setInputFiles(imgPath);
    console.log('   ✔ Waiting 5s for upload...');
    await page.waitForTimeout(5000);
  }

  // 4. Fill Software Name
  console.log('4. Filling Software Name...');
  const nameInput = await page.$('input[name="attr_5354_software_name"]');
  if (nameInput) {
    await nameInput.fill('Moniepoint POS Transfer Shield');
    console.log('   ✔ Software Name filled');
  }

  // 5. Select Type
  console.log('5. Selecting Type...');
  const typeField = await page.$('.fw-field:has-text("Type*") .fw-select, .fw-field:has-text("Type*") .multiselect');
  if (typeField) {
    await typeField.click();
    await page.waitForTimeout(800);
    const opt = await page.$('.multiselect__option:has-text("POS Software"), span:has-text("POS Software"), .multiselect__option:has-text("Other")');
    if (opt) {
      await opt.click();
      console.log('   ✔ Type selected: POS Software');
    }
    await page.waitForTimeout(500);
  }

  // 6. Select Platform
  console.log('6. Selecting Platform...');
  const platField = await page.$('.fw-field:has-text("Platform*") .fw-select, .fw-field:has-text("Platform*") .multiselect');
  if (platField) {
    await platField.click();
    await page.waitForTimeout(800);
    const opt = await page.$('.multiselect__option:has-text("Android"), span:has-text("Android")');
    if (opt) {
      await opt.click();
      console.log('   ✔ Platform selected: Android');
    }
    await page.waitForTimeout(500);
  }

  // 7. Select Format
  console.log('7. Selecting Format...');
  const formatField = await page.$('.fw-field:has-text("Format*") .fw-select, .fw-field:has-text("Format*") .multiselect');
  if (formatField) {
    await formatField.click();
    await page.waitForTimeout(800);
    const opt = await page.$('.multiselect__option:has-text("Digital Download"), span:has-text("Digital Download")');
    if (opt) {
      await opt.click();
      console.log('   ✔ Format selected: Digital Download');
    }
    await page.waitForTimeout(500);
  }

  // 8. Fill Description
  console.log('8. Filling Description...');
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
    console.log('   ✔ Description filled');
  }

  // 9. Fill Price
  console.log('9. Filling Price...');
  const priceInput = await page.$('input[name="price"][type="text"], input.qa-enter-price');
  if (priceInput) {
    await priceInput.fill('35000');
    console.log('   ✔ Price filled: 35000');
  }

  await page.waitForTimeout(2000);

  // 10. Submit
  console.log('10. Clicking Submit button...');
  const submitBtn = await page.$('#submit_button, button.qa-submit-button, button[type="submit"]');
  if (submitBtn) {
    const enabled = await submitBtn.isEnabled();
    console.log('Submit button enabled:', enabled);
    if (enabled) {
      await submitBtn.click();
      console.log('Submit clicked! Waiting 7s...');
      await page.waitForTimeout(7000);
      console.log('Post-submit URL:', page.url());
      await page.screenshot({ path: 'local_db/ad_55777070_final_submit.png' });
    }
  }

  await browser.close();
}

submitSoftwareFull().catch(console.error);
