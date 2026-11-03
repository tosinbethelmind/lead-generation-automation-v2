const fs = require('fs');
const { chromium } = require('playwright');

async function testDeleteButton() {
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
  await page.goto('https://jiji.ng/edit-free-ad-55774340.html', { waitUntil: 'networkidle', timeout: 35000 });
  await page.waitForTimeout(3000);

  let initialCount = await page.evaluate(() => document.querySelectorAll('button.qa-b-image-item__close-btn').length);
  console.log('Initial close buttons count:', initialCount);

  // Click the first close button using evaluate click
  const clickRes = await page.evaluate(() => {
    const btn = document.querySelector('button.qa-b-image-item__close-btn');
    if (btn) {
      btn.click();
      return 'clicked via dom';
    }
    return 'not found';
  });
  console.log('Evaluate click result:', clickRes);
  await page.waitForTimeout(2000);

  let countAfter = await page.evaluate(() => document.querySelectorAll('button.qa-b-image-item__close-btn').length);
  console.log('Close buttons count after 1st click:', countAfter);

  if (countAfter === initialCount) {
    // If count didn't change, try dispatching MouseEvent or Playwright click
    console.log('Trying Playwright click...');
    const btn = await page.$('button.qa-b-image-item__close-btn');
    if (btn) {
      await btn.click();
      await page.waitForTimeout(2000);
      countAfter = await page.evaluate(() => document.querySelectorAll('button.qa-b-image-item__close-btn').length);
      console.log('Close buttons count after Playwright click:', countAfter);
    }
  }

  await browser.close();
}

testDeleteButton().catch(console.error);
