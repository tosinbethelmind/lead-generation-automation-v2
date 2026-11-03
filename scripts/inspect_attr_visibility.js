const fs = require('fs');
const { chromium } = require('playwright');

async function inspectAttr() {
  const adId = '55777070';
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
  await page.goto(`https://jiji.ng/edit-free-ad-${adId}.html`, {
    referer: 'https://jiji.ng/profile/adverts',
    waitUntil: 'domcontentloaded'
  });
  await page.waitForTimeout(4000);

  // Switch to Software
  const catBox = await page.$('.b-category-section__category-select, .qa-choose-category, .b-category-select__value');
  if (catBox) {
    await catBox.click();
    await page.waitForTimeout(1000);
    const elec = await page.$('.multiselect__option:has-text("Electronics"), span:has-text("Electronics")');
    if (elec) {
      await elec.click();
      await page.waitForTimeout(1200);
      const soft = await page.$('.multiselect__option:has-text("Software"), span:has-text("Software")');
      if (soft) {
        await soft.click();
        await page.waitForTimeout(2000);
      }
    }
  }

  const details = await page.evaluate(() => {
    const el = document.querySelector('input[name="attr_5354_software_name"]');
    if (!el) return 'el not found';
    return {
      name: el.name,
      className: el.className,
      offsetParent: !!el.offsetParent,
      boundingBox: el.getBoundingClientRect().toJSON(),
      parentClass: el.parentElement?.className,
      grandParentClass: el.parentElement?.parentElement?.className,
      styleDisplay: window.getComputedStyle(el).display,
      styleVisibility: window.getComputedStyle(el).visibility,
      parentDisplay: el.parentElement ? window.getComputedStyle(el.parentElement).display : null,
      parentVisibility: el.parentElement ? window.getComputedStyle(el.parentElement).visibility : null
    };
  });

  console.log('attr_5354_software_name details:', details);
  await page.screenshot({ path: 'local_db/software_page_inspect.png', fullPage: true });
  await browser.close();
}

inspectAttr().catch(console.error);
