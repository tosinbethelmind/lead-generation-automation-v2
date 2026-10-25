const { chromium } = require('playwright');
const fs = require('fs');

async function testBoard() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    storageState: 'local_db/nairaland_session.json',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();

  const boards = [15, 78, 24, 14];
  for (const b of boards) {
    console.log(`\nTesting Board #${b}...`);
    await page.goto(`https://www.nairaland.com/newtopic?board=${b}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    console.log('Title:', await page.title());
    console.log('URL:', page.url());
    const titleInput = await page.$('input[name="title"]');
    const bodyInput = await page.$('textarea[name="body"]');
    console.log('Has Title Input?:', !!titleInput, '| Has Body Input?:', !!bodyInput);
    if (!titleInput) {
      const text = await page.innerText('body');
      console.log('Page message snippet:', text.replace(/\s+/g, ' ').substring(0, 300));
    }
  }

  await browser.close();
}

testBoard().catch(console.error);
