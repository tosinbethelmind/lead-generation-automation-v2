const fs = require('fs');
const { chromium } = require('playwright');

async function inspectMistakesOnDeclined() {
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
  const testIds = ['55774340', '55776882'];

  for (const id of testIds) {
    console.log(`\n--- Inspecting mistakes on Ad #${id} ---`);
    await page.goto(`https://jiji.ng/edit-free-ad-${id}.html`, { waitUntil: 'domcontentloaded', timeout: 25000 });
    await page.waitForTimeout(3000);

    const errors = await page.evaluate(() => {
      const list = [];
      document.querySelectorAll('.b-moderation-error, .fw-has-error, [class*="moderation-error"], .b-form-alert').forEach(el => {
        list.push({ text: el.innerText.trim(), className: el.className });
      });
      return list;
    });
    console.log(`Errors on #${id}:`, JSON.stringify(errors, null, 2));
  }

  await browser.close();
}

inspectMistakesOnDeclined().catch(console.error);
