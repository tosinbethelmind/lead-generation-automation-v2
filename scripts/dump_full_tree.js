const fs = require('fs');
const { chromium } = require('playwright');

async function dumpFullTree() {
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
  await page.goto('https://jiji.ng/edit-free-ad-55797060.html', { waitUntil: 'networkidle', timeout: 35000 });
  await page.waitForTimeout(3000);

  const tree = await page.evaluate(() => {
    const main = document.querySelector('main, .b-main-page, #main, body');
    return main ? main.innerText : '';
  });

  console.log('--- PAGE TEXT ON 55797060 ---');
  console.log(tree);

  await browser.close();
}

dumpFullTree().catch(console.error);
