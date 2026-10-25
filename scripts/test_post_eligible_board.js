const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function testPostOnEligibleBoard() {
  console.log('Testing automated topic creation on Board 15 (Computers / Tech)...');
  const sessionPath = path.join(__dirname, '..', 'local_db', 'nairaland_session.json');

  const browser = await chromium.launch({
    headless: true,
    args: ['--disable-blink-features=AutomationControlled']
  });

  const context = await browser.newContext({
    storageState: sessionPath,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
  });

  const page = await context.newPage();
  await page.goto('https://www.nairaland.com/newtopic?board=15', { waitUntil: 'domcontentloaded', timeout: 30000 });

  console.log('Page Title:', await page.title());
  console.log('Current URL:', page.url());

  const hasTitleInput = await page.$('input[name="title"]');
  const hasBodyInput = await page.$('textarea[name="body"]');
  const hasSubmit = await page.$('input[value="Submit"]');

  console.log('Form elements present:');
  console.log(' - Title input:', Boolean(hasTitleInput));
  console.log(' - Body textarea:', Boolean(hasBodyInput));
  console.log(' - Submit button:', Boolean(hasSubmit));

  await browser.close();
}

testPostOnEligibleBoard().catch(console.error);
