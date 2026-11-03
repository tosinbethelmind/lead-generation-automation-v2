const fs = require('fs');
const { chromium } = require('playwright');

async function inspectPhotos55774340() {
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

  const images = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.b-image-item, [class*="image-item"]')).map(el => ({
      style: el.getAttribute('style'),
      html: el.outerHTML.slice(0, 200)
    }));
  });

  console.log('Images on #55774340:', JSON.stringify(images, null, 2));

  // Check the error banner
  const errText = await page.$eval('.b-add-image-section', el => el.innerText).catch(() => 'none');
  console.log('Image section text:\n', errText);

  await page.screenshot({ path: 'local_db/ad_55774340_photos.png' });
  await browser.close();
}

inspectPhotos55774340().catch(console.error);
