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
    { key: 'Solar BOQ (Properties)', url: 'https://www.nairaland.com/8769845/stop-overpaying-solar-installers-lagos' },
    { key: 'Tokunbo Duty (Car Talk)', url: 'https://www.nairaland.com/8770162/lexus-rx350-corolla-tin-customs' },
    { key: 'Retail Fake Alert (Retail/Tech)', url: 'https://www.nairaland.com/8770316/how-lagos-retailers-supermarkets-stop' },
    { key: 'Building Materials (Properties)', url: 'https://www.nairaland.com/8770719/2026-reality-building-lekki-ibeju' },
    { key: 'School Result Gating (Education)', url: 'https://www.nairaland.com/8770724/private-school-administrators-how-gate' },
    { key: 'Restaurant Menu (Food)', url: 'https://www.nairaland.com/8770726/how-lagos-restaurants-slashing-delivery' },
  ];

  const report = {};
  for (const t of threads) {
    try {
      await page.goto(t.url, { waitUntil: 'domcontentloaded', timeout: 25000 });
      await page.waitForTimeout(1500);
      const text = await page.innerText('body');
      const vMatch = text.match(/<b>(\d+)\s*Views<\/b>/i) || text.match(/(\d+)\s*Views/i);
      const lMatch = text.match(/(\d+)\s*Likes?/i);
      const posts = (text.match(/class="bold l"/g) || []).length;
      report[t.key] = {
        views: vMatch ? parseInt(vMatch[1], 10) : 'N/A',
        likes: lMatch ? parseInt(lMatch[1], 10) : 0,
        postsCount: posts
      };
    } catch (e) {
      report[t.key] = { error: e.message };
    }
  }

  console.log('ALL_6_THREADS_METRICS:' + JSON.stringify(report, null, 2));
  await browser.close();
})();
