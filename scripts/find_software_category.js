const fs = require('fs');
const { chromium } = require('playwright');

async function findSoftwareCategory() {
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
  await page.goto('https://jiji.ng/edit-free-ad-55797060.html', { waitUntil: 'domcontentloaded', timeout: 25000 });
  await page.waitForTimeout(3000);

  // Click on the Category box
  const catBox = await page.$('.b-category-section__category-select, .qa-choose-category');
  if (catBox) {
    await catBox.click();
    await page.waitForTimeout(2000);

    // Let's see what happens if we find "Services" and click it
    const servicesOpt = await page.$('.multiselect__option:has-text("Services"), span:has-text("Services")');
    console.log('Found Services option:', !!servicesOpt);
    if (servicesOpt) {
      await servicesOpt.click();
      await page.waitForTimeout(2000);
      const subCats = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.multiselect__option, [class*="option"]')).map(el => el.innerText.trim()).filter(Boolean);
      });
      console.log('Subcategories under Services:', JSON.stringify(subCats, null, 2));
      await page.screenshot({ path: 'local_db/jiji_services_subcats.png' });
    }
  }

  await browser.close();
}

findSoftwareCategory().catch(console.error);
