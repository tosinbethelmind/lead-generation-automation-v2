const fs = require('fs');
const { chromium } = require('playwright');

async function testDeleteDeclinedPhoto() {
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
  await page.goto('https://jiji.ng/edit-free-ad-55774340.html', { waitUntil: 'domcontentloaded', timeout: 25000 });
  await page.waitForTimeout(3000);

  const declinedWrapper = await page.$('.b-image-item__wrapper--declined');
  console.log('Found declined image wrapper:', !!declinedWrapper);

  if (declinedWrapper) {
    const closeBtn = await declinedWrapper.$('.b-image-item__close-btn, button[class*="close"]');
    console.log('Found close button in declined wrapper:', !!closeBtn);
    if (closeBtn) {
      await closeBtn.click();
      await page.waitForTimeout(2000);
      const remaining = await page.$$('.b-image-item__wrapper');
      console.log('Remaining image wrappers:', remaining.length);
    }
  }

  await browser.close();
}

testDeleteDeclinedPhoto().catch(console.error);
