const { chromium } = require('playwright');
const path = require('path');

async function findBoards() {
  const sessionPath = path.join(__dirname, '..', 'local_db', 'nairaland_session.json');
  const browser = await chromium.launch({ headless: true, args: ['--disable-blink-features=AutomationControlled'] });
  const context = await browser.newContext({ storageState: sessionPath, locale: 'en-US' });
  const page = await context.newPage();

  // Test boards 1 to 40
  for (let b = 1; b <= 40; b++) {
    try {
      await page.goto(`https://www.nairaland.com/newtopic?board=${b}`, { waitUntil: 'domcontentloaded', timeout: 8000 });
      const title = await page.title();
      if (!title.includes('Just a moment')) {
        const hasTitle = Boolean(await page.$('input[name="title"]'));
        console.log(`Board #${b}: "${title}" | Eligible?: ${hasTitle}`);
      }
    } catch (e) {
      // timeout
    }
  }

  await browser.close();
}

findBoards().catch(console.error);
