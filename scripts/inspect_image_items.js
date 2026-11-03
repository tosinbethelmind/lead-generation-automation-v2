const fs = require('fs');
const { chromium } = require('playwright');

async function inspectItems() {
  const config = JSON.parse(fs.readFileSync('local_db/jiji_account_config.json', 'utf8'));
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--disable-blink-features=AutomationControlled', '--no-sandbox']
  });
  const context = await browser.newContext();
  const validCookies = (config.cookiesJson || []).map(c => {
    const copy = { ...c };
    if (!['Strict', 'Lax', 'None'].includes(copy.sameSite)) delete copy.sameSite;
    return copy;
  });
  await context.addCookies(validCookies);

  const page = await context.newPage();
  await page.goto('https://jiji.ng/edit-free-ad-55774340.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  const data = await page.evaluate(() => {
    const items = document.querySelectorAll('.b-image-item, [class*="image-item"]');
    return Array.from(items).map(i => ({
      className: i.className,
      outerHtml: i.outerHTML
    }));
  });

  console.log('Found items count:', data.length);
  if (data.length > 0) {
    fs.writeFileSync('local_db/image_item_sample.html', data[0].outerHtml, 'utf8');
    console.log('Saved local_db/image_item_sample.html');
  }

  await browser.close();
}

inspectItems().catch(console.error);
