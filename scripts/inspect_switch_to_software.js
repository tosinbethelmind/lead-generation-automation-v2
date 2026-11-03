const fs = require('fs');
const { chromium } = require('playwright');

async function inspectSwitchToSoftware() {
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
  await page.goto('https://jiji.ng/edit-free-ad-55797060.html', {
    referer: 'https://jiji.ng/profile/adverts',
    waitUntil: 'domcontentloaded',
    timeout: 35000
  });
  await page.waitForTimeout(4000);

  const switchEl = await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('*')).find(e => e.innerText && e.innerText.trim() === 'Switch to Software');
    return el ? { tag: el.tagName, className: el.className, outerHTML: el.outerHTML } : 'not found';
  });

  console.log('Switch to Software element:', JSON.stringify(switchEl, null, 2));

  // Try clicking it!
  const btn = await page.$('text=Switch to Software');
  if (btn) {
    console.log('Clicking Switch to Software...');
    await btn.click();
    await page.waitForTimeout(2000);
    const catText = await page.$eval('.b-category-section__category-select, .qa-choose-category', e => e.innerText.trim()).catch(() => 'err');
    console.log('Category after clicking Switch to Software:', catText);
  }

  await browser.close();
}

inspectSwitchToSoftware().catch(console.error);
