const fs = require('fs');
const { chromium } = require('playwright');

async function inspectSoftwareOptions() {
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
    const elecOption = await page.$('.multiselect__option:has-text("Electronics"), span:has-text("Electronics")');
    if (elecOption) {
      await elecOption.click();
      await page.waitForTimeout(1500);
      const softOption = await page.$('.multiselect__option:has-text("Software"), span:has-text("Software")');
      if (softOption) {
        await softOption.click();
        await page.waitForTimeout(2500);
      }
    }
  }

  // Click on software_type input to open dropdown
  const typeInput = await page.$('input[name="attr_5321_software_type"]');
  if (typeInput) {
    await typeInput.click();
    await page.waitForTimeout(1000);
    const typeOpts = await page.evaluate(() => {
      const parent = document.querySelector('input[name="attr_5321_software_type"]')?.closest('.multiselect');
      return Array.from(parent?.querySelectorAll('.multiselect__option') || []).map(o => o.innerText.trim());
    });
    console.log('Software Type Options:', typeOpts);
  }

  // Click on format input
  const formatInput = await page.$('input[name="attr_1373_format"]');
  if (formatInput) {
    await formatInput.click();
    await page.waitForTimeout(1000);
    const formatOpts = await page.evaluate(() => {
      const parent = document.querySelector('input[name="attr_1373_format"]')?.closest('.multiselect');
      return Array.from(parent?.querySelectorAll('.multiselect__option') || []).map(o => o.innerText.trim());
    });
    console.log('Format Options:', formatOpts);
  }

  await browser.close();
}

inspectSoftwareOptions().catch(console.error);
