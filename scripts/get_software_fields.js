const fs = require('fs');
const { chromium } = require('playwright');

async function getSoftwareFields() {
  const config = JSON.parse(fs.readFileSync('local_db/jiji_account_config.json', 'utf8'));
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--disable-blink-features=AutomationControlled', '--no-sandbox']
  });
  const context = await browser.newContext();
  const validCookies = (config.cookiesJson || []).map(c => {
    const copy = { ...c };
    if (!['Strict', 'Lax', 'None'].includes(copy.sameSite)) delete copy.sameSite;
    return copy;
  });
  await context.addCookies(validCookies);

  const page = await context.newPage();
  let fieldsData = null;
  page.on('response', async res => {
    if (res.url().includes('form_fields.json') && res.url().includes('category_id=312')) {
      try {
        fieldsData = await res.json();
      } catch (e) {}
    }
  });

  await page.goto('https://jiji.ng/add-free-ad.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  // Click Category Box
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
        await page.waitForTimeout(4000);
      }
    }
  }

  if (fieldsData) {
    fs.writeFileSync('local_db/software_form_fields.json', JSON.stringify(fieldsData, null, 2));
    console.log('Saved local_db/software_form_fields.json successfully!');
  } else {
    console.log('Fields data was not captured');
  }

  await browser.close();
}

getSoftwareFields().catch(console.error);
