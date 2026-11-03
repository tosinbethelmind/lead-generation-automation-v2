const fs = require('fs');
const { chromium } = require('playwright');

async function testClickClose() {
  const config = JSON.parse(fs.readFileSync('local_db/jiji_account_config.json', 'utf8'));
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--disable-blink-features=AutomationControlled', '--no-sandbox']
  });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 900 }
  });
  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });

  const validCookies = (config.cookiesJson || []).map(c => {
    const copy = { ...c };
    if (!['Strict', 'Lax', 'None'].includes(copy.sameSite)) delete copy.sameSite;
    return copy;
  });
  await context.addCookies(validCookies);

  const page = await context.newPage();
  await page.goto('https://jiji.ng/edit-free-ad-55774340.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);

  const initialBtns = await page.$$('button.b-image-item__close-btn');
  console.log('Close buttons before click:', initialBtns.length);

  for (let i = 0; i < initialBtns.length; i++) {
    // Re-query the first close button
    const btn = await page.$('button.b-image-item__close-btn');
    if (btn) {
      console.log(`Clicking close button ${i + 1}...`);
      await btn.click({ force: true });
      await page.waitForTimeout(1500);
      const remaining = await page.$$('button.b-image-item__close-btn');
      console.log(`Remaining close buttons: ${remaining.length}`);
    }
  }

  // Check if error warning "Please fix 1 mistake in photos:" is gone
  const bodyText = await page.evaluate(() => document.body.innerText);
  const hasMistake = bodyText.includes('mistake in photos');
  console.log('Has mistake in photos now:', hasMistake);

  await page.screenshot({ path: 'local_db/after_photos_deleted.png' });
  await browser.close();
}

testClickClose().catch(console.error);
