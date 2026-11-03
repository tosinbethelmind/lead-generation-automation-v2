const fs = require('fs');
const { chromium } = require('playwright');

async function inspectCategoryOptions() {
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
  await page.goto('https://jiji.ng/edit-free-ad-55797060.html', { waitUntil: 'networkidle', timeout: 35000 });
  await page.waitForTimeout(3000);

  const catSelect = await page.$('.b-category-section__category-select, .qa-choose-category');
  if (catSelect) {
    await catSelect.click();
    await page.waitForTimeout(2000);

    const options = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.multiselect__option, .b-category-select__item, [class*="option"], [class*="category-item"]')).map(el => el.innerText.trim()).filter(Boolean);
    });
    console.log('Category Options (First 50):', JSON.stringify(options.slice(0, 50), null, 2));
    await page.screenshot({ path: 'local_db/jiji_category_popup.png' });
  }

  await browser.close();
}

inspectCategoryOptions().catch(console.error);
