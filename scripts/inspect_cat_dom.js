const fs = require('fs');
const { chromium } = require('playwright');

async function inspectCatDom() {
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
  await page.goto('https://jiji.ng/edit-free-ad-55797060.html', { waitUntil: 'domcontentloaded', timeout: 25000 });
  await page.waitForTimeout(3000);

  // Look at the moderation error element in detail
  const modErrorHtml = await page.evaluate(() => {
    const el = document.querySelector('.b-moderation-error, [class*="moderation-error"]');
    return el ? el.outerHTML : 'Not found';
  });
  console.log('Moderation Error HTML:', modErrorHtml);

  // Look at the input element for category
  const catInputHtml = await page.evaluate(() => {
    const el = document.querySelector('.b-category-section__category-select, .qa-choose-category');
    return el ? el.outerHTML : 'Not found';
  });
  console.log('Category Select HTML:', catInputHtml);

  await browser.close();
}

inspectCatDom().catch(console.error);
