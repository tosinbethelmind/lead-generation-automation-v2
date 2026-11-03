const fs = require('fs');
const { chromium } = require('playwright');

async function testHoverOrDispatch() {
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
  await page.goto('https://jiji.ng/edit-free-ad-55774340.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);

  const initialCount = await page.evaluate(() => document.querySelectorAll('button.b-image-item__close-btn').length);
  console.log('Initial close buttons:', initialCount);

  // Dispatch click on all close buttons
  const res = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button.b-image-item__close-btn'));
    btns.forEach(b => {
      b.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    });
    return btns.length;
  });
  console.log(`Dispatched click to ${res} buttons.`);
  await page.waitForTimeout(2000);

  const remaining = await page.evaluate(() => document.querySelectorAll('button.b-image-item__close-btn').length);
  console.log('Remaining close buttons after dispatch:', remaining);

  const bodyText = await page.evaluate(() => document.body.innerText);
  console.log('Has "mistake in photos":', bodyText.includes('mistake in photos'));

  await page.screenshot({ path: 'local_db/after_dispatch_delete.png' });
  await browser.close();
}

testHoverOrDispatch().catch(console.error);
