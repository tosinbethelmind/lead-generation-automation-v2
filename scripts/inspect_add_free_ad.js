const fs = require('fs');
const { chromium } = require('playwright');

async function inspectAddFreeAd() {
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
  await page.goto('https://jiji.ng/add-free-ad.html', { waitUntil: 'networkidle', timeout: 35000 });
  await page.waitForTimeout(3000);

  const formFields = await page.evaluate(() => {
    const items = [];
    document.querySelectorAll('input, select, textarea, div.b-create-ad-card__category-select, div[class*="select"]').forEach(el => {
      items.push({
        tag: el.tagName,
        type: el.type,
        name: el.name,
        placeholder: el.placeholder,
        className: el.className,
        text: el.innerText ? el.innerText.trim().slice(0, 50) : ''
      });
    });
    return items;
  });

  console.log('Form Fields:', JSON.stringify(formFields, null, 2));
  await page.screenshot({ path: 'local_db/jiji_add_free_ad_fields.png' });
  await browser.close();
}

inspectAddFreeAd().catch(console.error);
