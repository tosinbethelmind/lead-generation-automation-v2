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

  await page.goto('https://www.nairaland.com/8769845/stop-overpaying-solar-installers-lagos', { waitUntil: 'domcontentloaded' });
  const hasTextarea = await page.$('textarea[name="body"]');
  const links = await page.$$eval('a', as => as.filter(a => a.innerText.toLowerCase().includes('reply')).map(a => a.href));
  console.log('Has textarea on page:', !!hasTextarea);
  console.log('Reply links:', links);
  await browser.close();
})();
