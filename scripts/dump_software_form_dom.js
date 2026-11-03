const fs = require('fs');
const { chromium } = require('playwright');

async function dumpSoftwareFormDom() {
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

  // Switch to Software
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
        await page.waitForTimeout(2000);
      }
    }
  }

  // Get all form inputs and select elements
  const data = await page.evaluate(() => {
    const fields = Array.from(document.querySelectorAll('.fw-field, .b-create-ad-field'));
    return fields.map(f => {
      const label = f.querySelector('.fw-field__label, .fw-label, label')?.innerText?.trim() || f.innerText.split('\n')[0];
      const input = f.querySelector('input');
      const select = f.querySelector('.multiselect');
      return {
        label,
        inputName: input ? input.name : null,
        inputId: input ? input.id : null,
        inputType: input ? input.type : null,
        hasSelect: !!select,
        outerHTML: f.outerHTML.slice(0, 250)
      };
    });
  });

  console.log('Fields data:');
  console.log(JSON.stringify(data, null, 2));

  await browser.close();
}

dumpSoftwareFormDom().catch(console.error);
