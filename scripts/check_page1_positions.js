const { chromium } = require('playwright');
const path = require('path');
const sessionFile = path.join(__dirname, '..', 'local_db', 'nairaland_session.json');

(async () => {
  const browser = await chromium.launch({
    headless: false,
    args: ['--disable-blink-features=AutomationControlled', '--no-sandbox']
  });
  const context = await browser.newContext({ storageState: sessionFile });
  const page = await context.newPage();
  await page.addInitScript(() => { Object.defineProperty(navigator, 'webdriver', { get: () => undefined }); });

  // Check Properties board for Solar thread 8769845
  await page.goto('https://www.nairaland.com/properties', { waitUntil: 'domcontentloaded' });
  const onPage1Solar = await page.$('a[href*="8769845"]');
  console.log('Solar Thread on Properties Page 1:', !!onPage1Solar);

  // Check Car Talk / Autos for Lexus thread 8770162
  await page.goto('https://www.nairaland.com/autos', { waitUntil: 'domcontentloaded' });
  const onPage1Car = await page.$('a[href*="8770162"]');
  console.log('Car Talk Thread on Autos Page 1:', !!onPage1Car);

  // Check Entertainment / Jokes for Fake Alert thread 8770316
  await page.goto('https://www.nairaland.com/jokes-etc', { waitUntil: 'domcontentloaded' });
  const onPage1Fake = await page.$('a[href*="8770316"]');
  console.log('Fake Alert Thread on Jokes Page 1:', !!onPage1Fake);

  await browser.close();
})();
