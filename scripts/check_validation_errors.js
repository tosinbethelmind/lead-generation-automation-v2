const fs = require('fs');
const { chromium } = require('playwright');

async function checkValidationErrors() {
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
  await page.goto('https://jiji.ng/edit-free-ad-55777070.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);

  // Click Category Box
  const catBox = await page.$('.b-category-section__category-select, .qa-choose-category');
  if (catBox) {
    await catBox.click();
    await page.waitForTimeout(1000);
    const elec = await page.$('.multiselect__option:has-text("Electronics"), span:has-text("Electronics")');
    if (elec) {
      await elec.click();
      await page.waitForTimeout(1500);
      const soft = await page.$('.multiselect__option:has-text("Software"), span:has-text("Software")');
      if (soft) {
        await soft.click();
        await page.waitForTimeout(2000);
      }
    }
  }

  // Click Next
  const nextBtn = await page.$('.b-create-ad-card__next-button, button:has-text("Next")');
  if (nextBtn) {
    await nextBtn.click();
    await page.waitForTimeout(3000);
  }

  // Click Submit
  const submitBtn = await page.$('#submit_button, button.qa-submit-button, button[type="submit"]');
  if (submitBtn) {
    await submitBtn.click();
    await page.waitForTimeout(2000);
  }

  const errors = await page.evaluate(() => {
    const els = document.querySelectorAll('.fw-has-error, .b-form-error, [class*="error"], [class*="warning"], [class*="invalid"]');
    return Array.from(els).map(e => ({
      tag: e.tagName,
      className: e.className,
      text: e.innerText?.slice(0, 100)
    }));
  });

  console.log('Validation Errors found:');
  console.log(JSON.stringify(errors, null, 2));

  await browser.close();
}

checkValidationErrors().catch(console.error);
