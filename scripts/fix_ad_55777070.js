const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

async function fixAd55777070() {
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

  // 1. Delete all old photos via dispatch
  console.log('Dispatching click to all old image close buttons...');
  const delCount = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button.b-image-item__close-btn'));
    btns.forEach(b => b.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true })));
    return btns.length;
  });
  console.log(`Deleted ${delCount} old images.`);
  await page.waitForTimeout(1500);

  // 2. Switch Category to Software if prompted
  console.log('Checking category switch to Software...');
  const switchPrompt = await page.$('text="Switch to Software"');
  if (switchPrompt) {
    console.log('Found "Switch to Software" button, clicking...');
    await switchPrompt.click();
    await page.waitForTimeout(2000);
  } else {
    // Open category dropdown
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
          await page.waitForTimeout(1500);
          console.log('Switched to Software via dropdown!');
        }
      }
    }
  }

  // 3. Attach compliant banner
  const imgPath = path.resolve('public/jiji_ads/ad_4_unique.jpg');
  console.log('Attaching new compliant banner:', imgPath);
  const fileInput = await page.$('input[type="file"]');
  if (fileInput) {
    await fileInput.setInputFiles(imgPath);
    console.log('Waiting 5s for image upload...');
    await page.waitForTimeout(5000);
  }

  // 4. Update Title
  const title = 'Stop Fake Bank Alert & Cashier Theft • Moniepoint POS Shield';
  const titleInput = await page.$('input[name="title"]');
  if (titleInput) {
    await titleInput.fill(title);
    console.log('Title updated:', title);
  }

  // 5. Click Next
  console.log('Clicking Next...');
  const nextBtn = await page.$('.b-create-ad-card__next-button, button:has-text("Next")');
  if (nextBtn) {
    await nextBtn.click();
    await page.waitForTimeout(3000);
  }

  // 6. Fill Price & Description
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

  await page.waitForTimeout(2000);

  // 7. Submit
  const submitBtn = await page.$('#submit_button, button.qa-submit-button, button[type="submit"]');
  if (submitBtn) {
    const enabled = await submitBtn.isEnabled();
    console.log('Submit button enabled:', enabled);
    if (enabled) {
      await submitBtn.click();
      console.log('Clicked submit! Waiting 7s...');
      await page.waitForTimeout(7000);
      console.log('Post submit URL:', page.url());
      await page.screenshot({ path: 'local_db/ad_55777070_resubmitted.png' });
    }
  }

  await browser.close();
}

fixAd55777070().catch(console.error);
