const fs = require('fs');
const { chromium } = require('playwright');

async function inspectFullPage() {
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
  await page.goto('https://jiji.ng/edit-free-ad-55774340.html', { waitUntil: 'networkidle', timeout: 35000 });
  await page.waitForTimeout(4000);

  await page.screenshot({ path: 'local_db/inspect_55774340_full.png', fullPage: true });

  const summary = await page.evaluate(() => {
    const text = document.body.innerText;
    const allButtons = Array.from(document.querySelectorAll('button')).map(b => ({ text: b.innerText.trim(), class: b.className }));
    const allInputs = Array.from(document.querySelectorAll('input, textarea')).map(i => ({ name: i.name, type: i.type, value: i.value }));
    const allImgs = Array.from(document.querySelectorAll('img')).map(i => ({ src: i.src, class: i.className }));
    const closeBtns = Array.from(document.querySelectorAll('[class*="close"], [class*="remove"], [class*="delete"]')).map(el => ({ tag: el.tagName, class: el.className, text: el.innerText }));

    return { text: text.slice(0, 1000), allButtons, allInputs, allImgs: allImgs.slice(0, 10), closeBtns };
  });

  console.log(JSON.stringify(summary, null, 2));
  await browser.close();
}

inspectFullPage().catch(console.error);
