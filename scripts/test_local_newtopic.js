const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function testLocalNewTopic() {
  console.log('Testing local laptop connection to Nairaland /newtopic?board=24...');
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
  await page.goto('https://www.nairaland.com/newtopic?board=24', { waitUntil: 'domcontentloaded', timeout: 30000 });

  console.log('Page Title:', await page.title());
  console.log('Current URL:', page.url());

  const hasTitle = await page.$('input[name="title"]');
  console.log('Has input[name="title"]?:', Boolean(hasTitle));

  if (hasTitle) {
    console.log('🎉 SUCCESS: Laptop residential IP loaded /newtopic with input[name="title"] immediately!');
  } else {
    console.log('Challenge or redirect present on laptop.');
  }

  await browser.close();
}

testLocalNewTopic().catch(console.error);
