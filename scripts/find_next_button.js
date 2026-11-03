const fs = require('fs');
const { chromium } = require('playwright');

async function findButtons() {
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

  const btns = await page.evaluate(() => {
    const list = Array.from(document.querySelectorAll('button, a, div, span')).filter(el => {
      const txt = el.innerText?.trim();
      return txt === 'Next' || txt === 'Post ad' || txt === 'Save' || txt === 'Submit';
    });
    return list.map(el => ({
      tag: el.tagName,
      className: el.className,
      text: el.innerText.trim(),
      outerHTML: el.outerHTML.slice(0, 200)
    }));
  });

  console.log('Action buttons found:', JSON.stringify(btns, null, 2));

  await browser.close();
}

findButtons().catch(console.error);
