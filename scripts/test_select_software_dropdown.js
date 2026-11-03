const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

async function testSelectSoftwareDropdown() {
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
    const u = res.url();
    if (u.includes('api_web') && (u.includes('modify') || u.includes('error'))) {
      try {
        const t = await res.text();
        console.log(`[API ${res.status()}] ${u}\n${t.slice(0, 300)}`);
      } catch (e) {}
    }
  });

  page.on('request', req => {
    if (req.url().includes('modify')) {
      console.log('Modify Request POST data:\n', req.postData()?.slice(0, 300));
    }
  });

  await page.goto('https://jiji.ng/edit-free-ad-55777070.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);

  // 1. Open Category Dropdown
  console.log('1. Clicking category selector...');
  const catBox = await page.$('.b-category-section__category-select, .qa-choose-category');
  if (catBox) {
    await catBox.click();
    await page.waitForTimeout(1000);

    console.log('Clicking Electronics...');
    const elecOption = await page.$('.multiselect__option:has-text("Electronics"), span:has-text("Electronics")');
    if (elecOption) {
      await elecOption.click();
      await page.waitForTimeout(1500);

      console.log('Clicking Software...');
      const softOption = await page.$('.multiselect__option:has-text("Software"), span:has-text("Software")');
      if (softOption) {
        await softOption.click();
        await page.waitForTimeout(2000);
        console.log('Selected Software successfully!');
      }
    }
  }

  // 2. Delete old images
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button.b-image-item__close-btn'));
    btns.forEach(b => b.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true })));
  });
  await page.waitForTimeout(1500);

  // 3. Attach image
  const imgPath = path.resolve('public/jiji_ads/ad_4_unique.jpg');
  const fileInput = await page.$('input[type="file"]');
  if (fileInput) {
    await fileInput.setInputFiles(imgPath);
    await page.waitForTimeout(6000);
  }

  // 4. Click Next
  const nextBtn = await page.$('.b-create-ad-card__next-button, button:has-text("Next")');
  if (nextBtn) {
    await nextBtn.click();
    await page.waitForTimeout(3000);
  }

  // 5. Fill Price & Description
  const priceInput = await page.$('input.qa-enter-price, input[name="price"][type="text"]');
  if (priceInput) await priceInput.fill('35000');

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
  if (descInput) await descInput.fill(desc);

  // 6. Submit
  const submitBtn = await page.$('#submit_button, button.qa-submit-button, button[type="submit"]');
  if (submitBtn) {
    await submitBtn.click();
    await page.waitForTimeout(7000);
    console.log('Post-submit URL:', page.url());
  }

  await browser.close();
}

testSelectSoftwareDropdown().catch(console.error);
