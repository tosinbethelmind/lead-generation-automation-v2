const fs = require('fs');
const { chromium } = require('playwright');

async function refreshCookies() {
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
  await page.goto('https://jiji.ng/profile/adverts', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  const freshCookies = await context.cookies();
  console.log('Got fresh cookies count:', freshCookies.length);
  config.cookiesJson = freshCookies;
  fs.writeFileSync('local_db/jiji_account_config.json', JSON.stringify(config, null, 2), 'utf8');
  console.log('Updated local_db/jiji_account_config.json with fresh session cookies!');

  await browser.close();
}

refreshCookies().catch(console.error);
