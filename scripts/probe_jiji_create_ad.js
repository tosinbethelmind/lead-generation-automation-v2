const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

async function testCreateAd() {
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
  console.log('Navigating to https://jiji.ng/create-ad.html ...');
  await page.goto('https://jiji.ng/create-ad.html', { waitUntil: 'networkidle', timeout: 35000 });
  await page.waitForTimeout(4000);

  console.log('Current URL:', page.url());
  const title = await page.title();
  console.log('Page Title:', title);

  // Check for inputs
  const inputs = await page.evaluate(() => {
    const res = [];
    document.querySelectorAll('input, select, textarea, button').forEach(el => {
      res.push({
        tag: el.tagName,
        type: el.type,
        name: el.name,
        placeholder: el.placeholder,
        text: el.innerText ? el.innerText.trim().slice(0, 30) : '',
        id: el.id,
        className: el.className
      });
    });
    return res.slice(0, 40);
  });

  console.log('Found Elements:', JSON.stringify(inputs, null, 2));
  await page.screenshot({ path: 'local_db/jiji_create_ad_probe.png' });
  console.log('Screenshot saved to local_db/jiji_create_ad_probe.png');

  await browser.close();
}

testCreateAd().catch(console.error);
