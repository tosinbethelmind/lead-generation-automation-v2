const fs = require('fs');
const { chromium } = require('playwright');

async function inspect() {
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
  await page.goto('https://jiji.ng/edit-free-ad-55774340.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  const html = await page.evaluate(() => {
    const input = document.querySelector('input[type="file"]');
    if (!input) return 'no file input';
    let p = input;
    for (let i = 0; i < 6; i++) {
      if (p.parentElement) p = p.parentElement;
    }
    return p.outerHTML;
  });

  fs.writeFileSync('local_db/file_input_parent.html', html, 'utf8');
  console.log('Saved file_input_parent.html length:', html.length);
  await browser.close();
}

inspect().catch(console.error);
