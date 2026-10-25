const { chromium } = require('playwright');
const path = require('path');
const sessionFile = path.join(__dirname, '..', 'local_db', 'nairaland_session_4thmainland.json');

(async () => {
  const browser = await chromium.launch({
    headless: false,
    args: ['--disable-blink-features=AutomationControlled', '--no-sandbox']
  });
  const context = await browser.newContext({ storageState: sessionFile });
  const page = await context.newPage();
  await page.addInitScript(() => { Object.defineProperty(navigator, 'webdriver', { get: () => undefined }); });

  const boards = [
    { id: 14, name: 'Properties' },
    { id: 78, name: 'Car Talk' },
    { id: 19, name: 'Education' },
    { id: 37, name: 'Fashion & Beauty' },
    { id: 38, name: 'Food' },
    { id: 15, name: 'Computers' },
    { id: 16, name: 'Phones' },
  ];

  for (const b of boards) {
    try {
      await page.goto('https://www.nairaland.com/newtopic?board=' + b.id, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.waitForTimeout(1500);
      const title = await page.title();
      const isBlocked = title.includes('Sorry');
      console.log('Board ' + b.id + ' (' + b.name + '): ' + (isBlocked ? '❌ Gated' : '✅ OPEN'));
    } catch (err) {
      console.log('Board ' + b.id + ' error: ' + err.message);
    }
  }

  await browser.close();
})();
