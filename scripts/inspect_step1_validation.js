const fs = require('fs');
const { chromium } = require('playwright');

async function inspectStep1Validation() {
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
  await page.goto('https://jiji.ng/edit-free-ad-55797060.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);

  const checks = await page.evaluate(() => {
    const titleVal = document.querySelector('input[name="title"]')?.value;
    const catText = document.querySelector('.b-category-section__category-select, .qa-choose-category')?.innerText?.trim();
    const locText = document.querySelector('.qa-choose-region')?.innerText?.trim();
    const photosCount = document.querySelectorAll('.b-image-item__wrapper').length;
    const photoErrors = Array.from(document.querySelectorAll('.b-image-item__wrapper--declined, [class*="error"]')).map(e => e.innerText.trim()).filter(Boolean);
    const nextBtnDisabled = document.querySelector('.b-create-ad-card__next-button')?.classList.contains('fw-button--type-bloated-success-grey-disabled');

    return {
      titleVal,
      catText,
      locText,
      photosCount,
      photoErrors,
      nextBtnDisabled
    };
  });

  console.log('Step 1 status on 55797060:');
  console.log(JSON.stringify(checks, null, 2));

  await browser.close();
}

inspectStep1Validation().catch(console.error);
