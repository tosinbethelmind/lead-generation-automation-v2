const fs = require('fs');
const { chromium } = require('playwright');

async function test() {
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
  await page.goto('https://jiji.ng/edit-free-ad-55777070.html', {
    referer: 'https://jiji.ng/profile/adverts',
    waitUntil: 'domcontentloaded'
  });
  await page.waitForTimeout(3000);

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

  const hasNext = await page.$('.b-create-ad-card__next-button, button:has-text("Next")');
  console.log('Next button exists:', !!hasNext);
  if (hasNext) {
    console.log('Next button is enabled:', await hasNext.isEnabled());
    await hasNext.click();
    await page.waitForTimeout(2500);

    const visibleNow = await page.evaluate(() => {
      const el = document.querySelector('input[name="attr_5354_software_name"]');
      const price = document.querySelector('input.qa-enter-price, input[name="price"][type="text"]');
      const submit = document.querySelector('#submit_button, button.qa-submit-button, button[type="submit"]');
      return {
        softwareNameVisible: el ? { offsetParent: !!el.offsetParent, w: el.offsetWidth, h: el.offsetHeight } : 'not found',
        priceVisible: price ? { offsetParent: !!price.offsetParent, val: price.value } : 'not found',
        submitVisible: submit ? { offsetParent: !!submit.offsetParent, enabled: !submit.disabled } : 'not found'
      };
    });
    console.log('Fields state after clicking Next:', JSON.stringify(visibleNow, null, 2));
  }

  await browser.close();
}

test().catch(console.error);
