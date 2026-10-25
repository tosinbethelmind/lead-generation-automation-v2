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

  const threads = [
    { key: 'Solar BOQ', url: 'https://www.nairaland.com/8769845/stop-overpaying-solar-installers-lagos' },
    { key: 'Tokunbo Duty', url: 'https://www.nairaland.com/8770162/lexus-rx350-corolla-tin-customs' },
    { key: 'Retail Fake Alert', url: 'https://www.nairaland.com/8770316/how-lagos-retailers-supermarkets-stop' }
  ];

  const report = {};
  for (const t of threads) {
    try {
      await page.goto(t.url, { waitUntil: 'domcontentloaded', timeout: 25000 });
      await page.waitForTimeout(2000);
      const body = await page.innerText('body');
      const vMatch = body.match(/<b>(\d+)\s*Views<\/b>/i) || body.match(/(\d+)\s*Views/i);
      const lMatch = body.match(/(\d+)\s*Likes?/i);
      report[t.key] = {
        views: vMatch ? parseInt(vMatch[1], 10) : 'N/A',
        likes: lMatch ? parseInt(lMatch[1], 10) : 0
      };
    } catch (e) {
      report[t.key] = { error: e.message };
    }
  }

  console.log('LIVE_FORUM_METRICS:' + JSON.stringify(report, null, 2));
  await browser.close();
})();
