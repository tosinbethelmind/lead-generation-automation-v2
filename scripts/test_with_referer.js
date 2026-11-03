const fs = require('fs');
const { chromium } = require('playwright');

async function testWithReferer() {
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
  console.log('Navigating with referer...');
  await page.goto('https://jiji.ng/edit-free-ad-55797060.html', {
    referer: 'https://jiji.ng/profile/adverts',
    waitUntil: 'domcontentloaded',
    timeout: 35000
  });
  await page.waitForTimeout(5000);

  const titleVal = await page.$eval('input[name="title"]', el => el.value).catch(() => 'no title input');
  console.log('Title found:', titleVal);

  const text = await page.evaluate(() => document.body.innerText);
  console.log('Page text snippet:\n', text.slice(0, 300));

  await browser.close();
}

testWithReferer().catch(console.error);
