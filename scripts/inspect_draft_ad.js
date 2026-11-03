const fs = require('fs');
const { chromium } = require('playwright');

async function inspectDraftAd() {
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
  await page.goto('https://jiji.ng/edit-free-ad-51159464.html', { waitUntil: 'domcontentloaded', timeout: 25000 });
  await page.waitForTimeout(3000);

  const titleVal = await page.$eval('input[name="title"]', el => el.value).catch(() => 'No title');
  const catText = await page.$eval('.b-category-section__category-select, .qa-choose-category', el => el.innerText.trim()).catch(() => 'No category');

  console.log(`Draft 51159464 Title: "${titleVal}" | Category: "${catText}"`);
  await page.screenshot({ path: 'local_db/draft_51159464_inspect.png' });

  await browser.close();
}

inspectDraftAd().catch(console.error);
