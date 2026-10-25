const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function testSolve() {
  const SESSION_FILE = 'local_db/nairaland_session.json';
  const browser = await chromium.launch({
    headless: true,
    args: [
      '--disable-blink-features=AutomationControlled',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-infobars',
    ]
  });

  const context = await browser.newContext({
    storageState: SESSION_FILE,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 800 },
    locale: 'en-US'
  });

  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });

  const page = await context.newPage();
  console.log('Navigating to https://www.nairaland.com/newtopic?board=15 ...');
  await page.goto('https://www.nairaland.com/newtopic?board=15', { waitUntil: 'domcontentloaded', timeout: 30000 });

  console.log('Initial Page Title:', await page.title());
  console.log('Initial URL:', page.url());

  for (let i = 0; i < 15; i++) {
    const titleInput = await page.$('input[name="title"]');
    if (titleInput) {
      console.log(`✓ input[name="title"] is present after ${i * 2}s!`);
      break;
    }
    const pageTitle = await page.title().catch(() => '');
    console.log(`[Wait loop ${i + 1}] Title: "${pageTitle}" | URL: ${page.url()}`);

    const frames = page.frames();
    for (const frame of frames) {
      if (frame.url().includes('cloudflare') || frame.url().includes('turnstile') || frame.url().includes('challenge')) {
        const box = await frame.$('input[type="checkbox"], .ctp-checkbox-label, #cf-stage, #challenge-stage').catch(() => null);
        if (box) {
          console.log('Clicking Turnstile box in frame:', frame.url().substring(0, 60));
          await box.click().catch(() => {});
        }
      }
    }
    await page.waitForTimeout(2000);
  }

  const finalTitle = await page.$('input[name="title"]');
  console.log('Final check: Has title input?', !!finalTitle);
  if (!finalTitle) {
    const body = await page.innerText('body').catch(() => '');
    console.log('Page body snippet:', body.replace(/\s+/g, ' ').substring(0, 300));
  }

  await browser.close();
}

testSolve().catch(console.error);
