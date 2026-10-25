const { chromium } = require('playwright');

async function testClickTurnstile() {
  const SESSION_FILE = 'local_db/nairaland_session.json';
  const browser = await chromium.launch({
    headless: true,
    args: ['--disable-blink-features=AutomationControlled', '--no-sandbox']
  });

  const context = await browser.newContext({
    storageState: SESSION_FILE,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
  });

  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });

  const page = await context.newPage();
  console.log('Navigating to https://www.nairaland.com/newtopic?board=15 ...');
  await page.goto('https://www.nairaland.com/newtopic?board=15', { waitUntil: 'domcontentloaded', timeout: 30000 });

  console.log('Waiting for Turnstile frame...');
  let turnstileFrame = null;
  for (let i = 0; i < 20; i++) {
    turnstileFrame = page.frames().find(f => f.url().includes('challenges.cloudflare.com'));
    if (turnstileFrame) {
      console.log('✓ Found Cloudflare Turnstile frame!');
      break;
    }
    await page.waitForTimeout(1000);
  }

  if (turnstileFrame) {
    console.log('Inspecting Turnstile frame content...');
    try {
      await turnstileFrame.waitForLoadState('domcontentloaded');
      const frameHtml = await turnstileFrame.content();
      console.log('Frame HTML snippet:', frameHtml.substring(0, 400));
      
      // Look for checkbox or clickable element in Turnstile frame
      const targetSelectors = ['input[type="checkbox"]', '#challenge-stage', '.ctp-checkbox-label', '#cf-stage', 'label.ctp-checkbox-label', 'body'];
      for (const sel of targetSelectors) {
        const el = await turnstileFrame.$(sel);
        if (el) {
          console.log(`Found selector: "${sel}". Attempting click...`);
          await el.click().catch(err => console.log('Click error:', err.message));
          break;
        }
      }
    } catch (e) {
      console.error('Frame error:', e.message);
    }
  }

  console.log('Waiting 10s for challenge verification...');
  for (let i = 0; i < 5; i++) {
    await page.waitForTimeout(2000);
    console.log(`[Wait ${i + 1}] Title: "${await page.title()}" | URL: ${page.url()}`);
    const hasTitle = await page.$('input[name="title"]');
    if (hasTitle) {
      console.log('🎉 SUCCESS! input[name="title"] is present on the page!');
      break;
    }
  }

  await browser.close();
}

testClickTurnstile().catch(console.error);
