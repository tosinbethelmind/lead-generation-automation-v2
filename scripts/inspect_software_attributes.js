const fs = require('fs');
const { chromium } = require('playwright');

async function inspectSoftwareAttributes() {
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
  await page.goto('https://jiji.ng/edit-free-ad-55797060.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);

  // 1. Change Category to Software
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
        console.log('Category changed to Software!');
      }
    }
  }

  // Find all fw-field elements on page
  const fields = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.fw-field')).map(f => {
      const label = f.querySelector('.fw-field__label, .fw-label, label')?.innerText?.trim() || f.innerText.split('\n')[0];
      const selectBox = f.querySelector('.multiselect, .fw-selection');
      return {
        label,
        hasSelect: !!selectBox,
        class: f.className
      };
    });
  });

  console.log('Fields in Software category:', JSON.stringify(fields, null, 2));

  // Let's click on each select to see its options
  for (const name of ['Type', 'Platform', 'Format']) {
    console.log(`\nInspecting options for ${name}...`);
    const field = await page.$(`.fw-field:has-text("${name}")`);
    if (field) {
      await field.click();
      await page.waitForTimeout(1000);
      const opts = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.multiselect__option, .fw-select__option, li')).map(o => o.innerText.trim()).filter(Boolean);
      });
      console.log(`Options for ${name}:`, opts.slice(0, 15));
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);
    }
  }

  await browser.close();
}

inspectSoftwareAttributes().catch(console.error);
