const fs = require('fs');
const { chromium } = require('playwright');

async function verifyNewCookies() {
  const config = JSON.parse(fs.readFileSync('local_db/jiji_account_config.json', 'utf8'));
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--disable-blink-features=AutomationControlled', '--no-sandbox']
  });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36'
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
  console.log('Testing authenticated session with newly saved cookies...');
  await page.goto('https://jiji.ng/profile/adverts', { waitUntil: 'networkidle', timeout: 35000 });
  await page.waitForTimeout(3000);

  const snippet = await page.evaluate(() => {
    return document.body.innerText.slice(0, 300).replace(/\n+/g, ' ');
  });

  console.log('✔ Authenticated Session Active:');
  console.log(snippet);

  await browser.close();
}

verifyNewCookies().catch(console.error);
