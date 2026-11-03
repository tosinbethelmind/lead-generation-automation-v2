const fs = require('fs');
const { chromium } = require('playwright');

async function testClickCloseEvents() {
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

  page.on('console', msg => console.log('[BROWSER LOG]', msg.type(), msg.text()));
  page.on('request', req => {
    if (req.url().includes('api_web') || req.url().includes('image')) {
      console.log('[BROWSER REQ]', req.method(), req.url());
    }
  });

  await page.goto('https://jiji.ng/edit-free-ad-55796997.html', {
    referer: 'https://jiji.ng/profile/adverts',
    waitUntil: 'networkidle'
  });

  // What happens if we click via evaluate click(), dispatchEvent, or click on the svg?
  console.log('Testing native .click() in evaluate...');
  await page.evaluate(() => {
    const btn = document.querySelector('.b-image-item__close-btn');
    if (btn) btn.click();
  });
  await page.waitForTimeout(2000);

  const count1 = await page.evaluate(() => document.querySelectorAll('.b-image-item').length);
  console.log('Count after btn.click():', count1);

  console.log('Testing click on svg inside button...');
  await page.evaluate(() => {
    const svg = document.querySelector('.b-image-item__close-btn svg');
    if (svg) svg.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
  });
  await page.waitForTimeout(2000);

  const count2 = await page.evaluate(() => document.querySelectorAll('.b-image-item').length);
  console.log('Count after svg dispatch click:', count2);

  console.log('Testing mousedown + mouseup on button...');
  await page.evaluate(() => {
    const btn = document.querySelector('.b-image-item__close-btn');
    if (btn) {
      btn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
      btn.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
      btn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    }
  });
  await page.waitForTimeout(2000);

  const count3 = await page.evaluate(() => document.querySelectorAll('.b-image-item').length);
  console.log('Count after mousedown+mouseup+click:', count3);

  await browser.close();
}

testClickCloseEvents().catch(console.error);
