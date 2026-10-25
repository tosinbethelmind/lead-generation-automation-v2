const { chromium } = require('playwright');
const path = require('path');

async function snap() {
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
  await page.goto('https://www.nairaland.com/newtopic?board=15', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(6000);

  // Take screenshot of main page
  await page.screenshot({ path: 'local_db/cf_challenge_snap.png' });
  console.log('Saved screenshot to local_db/cf_challenge_snap.png');

  // Let's find Turnstile frame position and click its center
  const turnstileFrame = page.frames().find(f => f.url().includes('challenges.cloudflare.com'));
  if (turnstileFrame) {
    console.log('Turnstile Frame URL:', turnstileFrame.url());
    // Get frame element bounding box in page
    const frameElement = await page.$('iframe[src*="challenges.cloudflare.com"]');
    if (frameElement) {
      const box = await frameElement.boundingBox();
      console.log('Frame bounding box:', box);
      if (box) {
        // The Turnstile checkbox is at approx x + 30, y + box.height / 2
        console.log(`Clicking page coordinates: (${box.x + 30}, ${box.y + box.height / 2})...`);
        await page.mouse.click(box.x + 30, box.y + box.height / 2);
        await page.waitForTimeout(6000);
        console.log('Title after mouse click:', await page.title());
        console.log('URL after mouse click:', page.url());
        await page.screenshot({ path: 'local_db/cf_after_click_snap.png' });
      }
    }
  }

  await browser.close();
}

snap().catch(console.error);
