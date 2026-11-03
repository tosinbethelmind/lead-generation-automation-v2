const fs = require('fs');
const { chromium } = require('playwright');

async function inspectRejectedImages() {
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

  const imagesData = await page.evaluate(() => {
    const wrappers = document.querySelectorAll('.b-image-item__wrapper, [class*="image-item"]');
    return Array.from(wrappers).map((w, idx) => {
      const closeBtn = w.querySelector('button, [class*="close"], [class*="delete"]');
      const errorText = w.querySelector('[class*="error"], [class*="reason"], [class*="decline"]')?.innerText;
      return {
        idx,
        className: w.className,
        hasCloseBtn: !!closeBtn,
        closeBtnClass: closeBtn ? closeBtn.className : null,
        errorText,
        outerHTML: w.outerHTML.slice(0, 300)
      };
    });
  });

  console.log('Images on 55774340:');
  console.log(JSON.stringify(imagesData, null, 2));

  await browser.close();
}

inspectRejectedImages().catch(console.error);
