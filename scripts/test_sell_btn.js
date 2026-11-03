const fs = require('fs');
const { chromium } = require('playwright');

async function testSellClick() {
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
  await page.goto('https://jiji.ng/', { waitUntil: 'networkidle', timeout: 35000 });
  await page.waitForTimeout(3000);

  const sellBtn = await page.$('.qa-header-sell, button:has-text("SELL")');
  console.log('Found Sell button:', !!sellBtn);
  if (sellBtn) {
    await sellBtn.click();
    await page.waitForTimeout(5000);
    console.log('Post-Sell URL:', page.url());
    await page.screenshot({ path: 'local_db/jiji_after_sell_click.png' });
  }

  await browser.close();
}

testSellClick().catch(console.error);
