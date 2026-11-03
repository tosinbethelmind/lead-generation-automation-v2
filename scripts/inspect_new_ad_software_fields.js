const fs = require('fs');
const { chromium } = require('playwright');

async function inspectNewAdSoftwareFields() {
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
  await page.goto('https://jiji.ng/add-free-ad.html', { waitUntil: 'domcontentloaded', timeout: 25000 });
  await page.waitForTimeout(3000);

  // Select Electronics -> Software
  const catBox = await page.$('.b-category-section__category-select, .qa-choose-category');
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
        await page.waitForTimeout(2000);
      }
    }
  }

  // Inspect all visible fields
  const fields = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.fw-field')).map(el => el.innerText.trim()).filter(Boolean);
  });
  console.log('Fields on Software New Ad Step 1:', JSON.stringify(fields, null, 2));

  await page.screenshot({ path: 'local_db/new_ad_software_step1.png' });
  await browser.close();
}

inspectNewAdSoftwareFields().catch(console.error);
