const fs = require('fs');
const { chromium } = require('playwright');

async function testClickEdit() {
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
  await page.goto('https://jiji.ng/profile/adverts', { waitUntil: 'domcontentloaded', timeout: 35000 });
  await page.waitForTimeout(4000);

  // Click Declined tab
  const tabs = await page.$$('.b-my-adverts-tab__text');
  for (const tab of tabs) {
    const txt = await tab.innerText();
    if (txt.includes('Declined')) {
      console.log('Clicking tab:', txt);
      await tab.click();
      await page.waitForTimeout(3000);
      break;
    }
  }

  // Find edit link for 55797060
  const editLink = await page.$('a[href*="55797060"]');
  if (editLink) {
    console.log('Found edit link for 55797060, clicking it...');
    await editLink.click();
    await page.waitForTimeout(5000);
    console.log('Current URL after click:', page.url());
    const text = await page.evaluate(() => document.body.innerText);
    console.log('Page text after click:\n', text.slice(0, 500));
  } else {
    console.log('Edit link not found on page');
  }

  await browser.close();
}

testClickEdit().catch(console.error);
