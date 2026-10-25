const { chromium } = require('playwright');
const path = require('path');

async function testBoards() {
  const sessionPath = path.join(__dirname, '..', 'local_db', 'nairaland_session.json');

  const browser = await chromium.launch({
    headless: true,
    args: ['--disable-blink-features=AutomationControlled']
  });

  const context = await browser.newContext({
    storageState: sessionPath,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    locale: 'en-US'
  });

  const page = await context.newPage();

  for (const b of [15, 78]) {
    console.log(`\nTesting Board #${b} on laptop residential IP...`);
    await page.goto(`https://www.nairaland.com/newtopic?board=${b}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    console.log('Page Title:', await page.title());
    console.log('Current URL:', page.url());
    const hasTitle = await page.$('input[name="title"]');
    console.log(`Has input[name="title"] on Board ${b}?:`, Boolean(hasTitle));
  }

  await browser.close();
}

testBoards().catch(console.error);
