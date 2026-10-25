const { chromium } = require('playwright');
const path = require('path');

async function testClick() {
  const SESSION_FILE = 'local_db/nairaland_session.json';
  const browser = await chromium.launch({
    headless: true,
    args: ['--disable-blink-features=AutomationControlled', '--no-sandbox']
  });

  const context = await browser.newContext({
    storageState: SESSION_FILE,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 800 }
  });

  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });

  const page = await context.newPage();
  console.log('Navigating to https://www.nairaland.com/newtopic?board=15 ...');
  await page.goto('https://www.nairaland.com/newtopic?board=15', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(4000);

  // Find all iframes
  const iframes = await page.$$('iframe');
  console.log('Iframes count on page:', iframes.length);
  for (let i = 0; i < iframes.length; i++) {
    const box = await iframes[i].boundingBox();
    console.log(`Iframe ${i} bounding box:`, box);
    if (box && box.width > 50 && box.height > 20) {
      console.log(`Clicking Turnstile checkbox at (${box.x + 28}, ${box.y + box.height / 2})...`);
      // Move mouse naturally then click
      await page.mouse.move(box.x + 28, box.y + box.height / 2);
      await page.waitForTimeout(300);
      await page.mouse.click(box.x + 28, box.y + box.height / 2);
      console.log('Clicked!');
    }
  }

  // Also fallback: click direct coordinates (215, 420)
  if (iframes.length === 0) {
    console.log('No iframes found with selector, trying coordinates (215, 420)...');
    await page.mouse.move(215, 420);
    await page.waitForTimeout(300);
    await page.mouse.click(215, 420);
  }

  console.log('Waiting 8s to see result...');
  for (let s = 0; s < 4; s++) {
    await page.waitForTimeout(2000);
    const title = await page.title();
    const url = page.url();
    console.log(`[After Click ${s + 1}] Title: "${title}" | URL: ${url}`);
    const titleInput = await page.$('input[name="title"]');
    if (titleInput) {
      console.log('🎉🎉🎉 TURNSTILE BYPASSED! Found input[name="title"]!');
      break;
    }
  }

  await page.screenshot({ path: 'local_db/cf_after_click_test.png' });
  await browser.close();
}

testClick().catch(console.error);
