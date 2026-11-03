const fs = require('fs');
const { chromium } = require('playwright');

async function inspectDraft14() {
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
  await page.goto('https://jiji.ng/edit-free-ad-51159464.html', {
    referer: 'https://jiji.ng/profile/adverts',
    waitUntil: 'domcontentloaded'
  });
  await page.waitForTimeout(4000);

  const info = await page.evaluate(() => {
    const title = document.querySelector('input[name="title"]')?.value;
    const cat = document.querySelector('.qa-choose-category')?.innerText?.trim();
    const price = document.querySelector('input.qa-enter-price, input[name="price"]')?.value;
    const imagesCount = document.querySelectorAll('.b-image-item__wrapper').length;
    return { title, cat, price, imagesCount };
  });

  console.log('Draft 51159464 info:');
  console.log(JSON.stringify(info, null, 2));

  await browser.close();
}

inspectDraft14().catch(console.error);
