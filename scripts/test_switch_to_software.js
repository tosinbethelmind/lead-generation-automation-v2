const fs = require('fs');
const { chromium } = require('playwright');

async function testSwitch() {
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

  // Check current category
  const currCat = await page.evaluate(() => {
    const el = document.querySelector('.b-category-select__value, .qa-category-select, .b-category-section__category-select');
    return el ? el.innerText.trim() : 'not found';
  });
  console.log('Current category text:', currCat);

  // Click category selector
  console.log('Clicking category selector...');
  const catBox = await page.$('.b-category-section__category-select, .qa-choose-category, .b-category-select__value');
  if (catBox) {
    await catBox.click();
    await page.waitForTimeout(1000);

    // Look for Electronics
    const elecOption = await page.$('.multiselect__option:has-text("Electronics"), span:has-text("Electronics")');
    if (elecOption) {
      console.log('Clicking Electronics...');
      await elecOption.click();
      await page.waitForTimeout(1500);

      const softOption = await page.$('.multiselect__option:has-text("Software"), span:has-text("Software")');
      if (softOption) {
        console.log('Clicking Software...');
        await softOption.click();
        await page.waitForTimeout(2500);
      }
    }
  }

  // Check fields rendered now
  const newFields = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('input, select, textarea')).map(el => ({
      tag: el.tagName,
      name: el.name,
      type: el.type,
      placeholder: el.placeholder
    })).filter(f => f.name && !f.name.startsWith('exp') && !f.name.startsWith('cud') && !f.name.startsWith('ud'));
  });
  console.log('Fields after switching to Software:', JSON.stringify(newFields, null, 2));

  await browser.close();
}

testSwitch().catch(console.error);
