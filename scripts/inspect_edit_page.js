const fs = require('fs');
const { chromium } = require('playwright');

async function inspectEditPage() {
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
  console.log('Navigating to https://jiji.ng/edit-free-ad-55797060.html ...');
  await page.goto('https://jiji.ng/edit-free-ad-55797060.html', { waitUntil: 'networkidle', timeout: 35000 });
  await page.waitForTimeout(3000);

  await page.screenshot({ path: 'local_db/jiji_edit_decline_inspect.png', fullPage: true });

  const warnings = await page.evaluate(() => {
    const alerts = [];
    document.querySelectorAll('.b-form-alert, [class*="alert"], [class*="warning"], [class*="error"], [class*="reject"], .b-create-ad-card__category-select').forEach(el => {
      alerts.push({
        text: el.innerText.trim(),
        className: el.className
      });
    });
    return alerts;
  });

  console.log('Page Warnings/Alerts:', JSON.stringify(warnings, null, 2));

  // Let's also check category options
  const catInput = await page.$('.b-category-section__category-select, .qa-choose-category');
  if (catInput) {
    console.log('Category element text:', await catInput.innerText());
  }

  await browser.close();
}

inspectEditPage().catch(console.error);
