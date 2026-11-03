const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

async function debugSoftwareCategory() {
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
    if (u.includes('api_web') && (u.includes('modify') || u.includes('image') || u.includes('error'))) {
      try {
        const t = await res.text();
        console.log(`[API ${res.status()}] ${u}\n${t.slice(0, 300)}`);
      } catch (e) {}
    }
  });

  await page.goto('https://jiji.ng/edit-free-ad-55777070.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);

  // 1. Switch category FIRST!
  console.log('1. Switching Category to Software...');
  const switchPrompt = await page.$('text="Switch to Software"');
  if (switchPrompt) {
    await switchPrompt.click();
    await page.waitForTimeout(3000);
  }

  // 2. Delete any old images
  console.log('2. Deleting old images...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button.b-image-item__close-btn'));
    btns.forEach(b => b.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true })));
  });
  await page.waitForTimeout(1500);

  // 3. Attach compliant banner AFTER category switch
  const imgPath = path.resolve('public/jiji_ads/ad_4_unique.jpg');
  console.log('3. Attaching unique banner:', imgPath);
  const fileInput = await page.$('input[type="file"]');
  if (fileInput) {
    await fileInput.setInputFiles(imgPath);
    console.log('Waiting 6s for upload API...');
    await page.waitForTimeout(6000);
  }

  // Check category text now
  const catText = await page.$eval('.b-category-section__category-select, .qa-choose-category', e => e.innerText.trim()).catch(() => 'err');
  console.log('Category now:', catText);

  // 4. Click Next
  console.log('4. Clicking Next...');
  const nextBtn = await page.$('.b-create-ad-card__next-button, button:has-text("Next")');
  if (nextBtn) {
    await nextBtn.click();
    await page.waitForTimeout(3000);
  }

  // Check what inputs are visible on Step 2
  const step2Inputs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('input, select, textarea, .multiselect')).map(el => {
      const parent = el.closest('div.b-form-field, div.b-create-ad-field, div[class*="field"], .b-control-wrapper');
      return {
        tag: el.tagName,
        name: el.name || el.id || el.className,
        label: parent ? parent.innerText.slice(0, 50).replace(/\n/g, ' ') : '',
        val: el.value || el.innerText?.slice(0, 30)
      };
    });
  });
  console.log('Step 2 Inputs:', JSON.stringify(step2Inputs, null, 2));

  // 5. Fill Price & Description
  const priceInput = await page.$('input.qa-enter-price, input[name="price"][type="text"]');
  if (priceInput) {
    await priceInput.fill('35000');
    console.log('Filled price 35000');
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
    console.log('Filled description.');
  }

  // 6. Submit
  const submitBtn = await page.$('#submit_button, button.qa-submit-button, button[type="submit"]');
  if (submitBtn) {
    console.log('Submit button enabled:', await submitBtn.isEnabled());
    await submitBtn.click();
    await page.waitForTimeout(6000);
    console.log('Post submit URL:', page.url());
  }

  await browser.close();
}

debugSoftwareCategory().catch(console.error);
