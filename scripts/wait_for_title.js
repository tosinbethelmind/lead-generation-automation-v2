const fs = require('fs');
const { chromium } = require('playwright');

async function check() {
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
  console.log('Opening page...');
  await page.goto('https://jiji.ng/edit-free-ad-55774340.html');
  try {
    const el = await page.waitForSelector('input[name="title"]', { timeout: 15000 });
    console.log('Found title input, val:', await el.inputValue());
  } catch (e) {
    console.log('Timeout waiting for title:', e.message);
  }
  await browser.close();
}

check().catch(console.error);
