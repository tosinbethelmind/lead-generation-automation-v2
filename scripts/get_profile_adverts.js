const fs = require('fs');
const { chromium } = require('playwright');

async function getProfileAdverts() {
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

  page.on('response', async res => {
    const url = res.url();
    if (url.includes('api_web') && (url.includes('advert') || url.includes('my') || url.includes('items'))) {
      try {
        console.log(`[API] ${url}`);
      } catch (e) {}
    }
  });

  await page.goto('https://jiji.ng/profile/adverts', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);

  // Read cards from the DOM
  const cards = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.qa-my-advert-item, .b-my-advert-item, .b-advert-item')).map(el => {
      const title = el.querySelector('.qa-advert-title, .b-advert-title, a[href*=".html"]')?.innerText?.trim();
      const img = el.querySelector('img')?.src;
      const status = el.querySelector('.b-my-advert-item__status, .qa-advert-status')?.innerText?.trim();
      return { title, img, status };
    });
  });

  console.log('Cards found:', JSON.stringify(cards, null, 2));
  await browser.close();
}

getProfileAdverts().catch(console.error);
