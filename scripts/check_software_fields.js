const fs = require('fs');
const { chromium } = require('playwright');

async function checkSoftwareFields() {
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
  await page.goto('https://jiji.ng/edit-free-ad-55777070.html', {
    referer: 'https://jiji.ng/profile/adverts',
    waitUntil: 'domcontentloaded',
    timeout: 35000
  });
  await page.waitForTimeout(4000);

  // Switch to software
  const catBox = await page.$('.b-category-section__category-select, .qa-choose-category');
  if (catBox) {
    console.log('Opening Category...');
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
        console.log('Category selected: Software!');
      }
    }
  }

  // Click Next
  const nextBtn = await page.$('.b-create-ad-card__next-button, button:has-text("Next")');
  if (nextBtn) {
    await nextBtn.click();
    await page.waitForTimeout(2000);
  }

  // Check all form fields on page now
  const fields = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('input, select, textarea, .multiselect')).map(el => {
      const label = el.closest('div')?.innerText?.split('\n')[0] || '';
      return {
        tag: el.tagName,
        name: el.name || el.id || el.className,
        label: label.slice(0, 40),
        val: el.value || el.innerText?.slice(0, 40)
      };
    });
  });

  console.log('Form fields in Software category:');
  console.log(JSON.stringify(fields.slice(0, 15), null, 2));

  await browser.close();
}

checkSoftwareFields().catch(console.error);
