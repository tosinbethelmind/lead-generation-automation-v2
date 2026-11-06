const fs = require('fs');
const { chromium } = require('playwright');

async function dumpActiveAds() {
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
  await context.route('**/*', (route) => {
    const req = route.request();
    const type = req.resourceType();
    const url = req.url();
    if (['image', 'media', 'font'].includes(type) || url.includes('google-analytics') || url.includes('facebook') || url.includes('clarity') || url.includes('criteo')) {
      return route.abort();
    }
    return route.continue();
  });

  const validCookies = (config.cookiesJson || []).map(c => {
    const copy = { ...c };
    if (!['Strict', 'Lax', 'None'].includes(copy.sameSite)) delete copy.sameSite;
    return copy;
  });
  await context.addCookies(validCookies);

  const page = await context.newPage();
  console.log('Navigating to https://jiji.ng/profile/adverts...');
  await page.goto('https://jiji.ng/profile/adverts', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(4000);

  const ads = await page.evaluate(() => {
    const items = [];
    const rows = document.querySelectorAll('.b-user-adverts-item, .qa-user-advert-item, div[class*="user-adverts-item"]');
    rows.forEach((el, index) => {
      const title = el.querySelector('.b-user-adverts-item__title, a.qa-advert-title, a')?.innerText?.trim();
      const price = el.querySelector('.b-user-adverts-item__price, [class*="price"]')?.innerText?.trim();
      const status = el.querySelector('.b-user-adverts-item__status, [class*="status"]')?.innerText?.trim();
      const editLink = el.querySelector('a[href*="edit"]')?.getAttribute('href');
      const href = el.querySelector('a')?.getAttribute('href');
      items.push({ index: index + 1, title, price, status, editLink, href });
    });
    return items;
  });

  console.log('Found adverts on profile:\n', JSON.stringify(ads, null, 2));
  fs.writeFileSync('local_db/jiji_profile_live_dump.json', JSON.stringify(ads, null, 2), 'utf8');

  await page.screenshot({ path: 'local_db/profile_adverts_dump.png' });
  await browser.close();
}

dumpActiveAds().catch(console.error);
