const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    args: ['--disable-blink-features=AutomationControlled', '--no-sandbox']
  });
  const context = await browser.newContext({
    storageState: 'local_db/nairaland_session.json',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();
  
  // Test boards 1 to 50
  for (let b = 1; b <= 30; b++) {
    try {
      await page.goto(`https://www.nairaland.com/newtopic?board=${b}`, { waitUntil: 'domcontentloaded', timeout: 10000 });
      const title = await page.title();
      const body = await page.innerText('body');
      const breadcrumbMatch = body.match(/Nairaland Forum\s*›\s*([^\n›]+)\s*›\s*([^\n›]+)\s*›\s*New Topic/i);
      const section = breadcrumbMatch ? `${breadcrumbMatch[1]} > ${breadcrumbMatch[2]}` : title;
      console.log(`Board #${b}: ${section.trim()}`);
    } catch (e) {
      // ignore
    }
  }
  await browser.close();
})();
