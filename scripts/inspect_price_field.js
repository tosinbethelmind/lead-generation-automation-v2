const fs = require('fs');
const { chromium } = require('playwright');

async function inspectPrice() {
  const config = JSON.parse(fs.readFileSync('local_db/jiji_account_config.json', 'utf8'));
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--disable-blink-features=AutomationControlled', '--no-sandbox']
  });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36'
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
  await page.goto('https://jiji.ng/edit-free-ad-55774340.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  const priceDetails = await page.evaluate(() => {
    const priceRadios = Array.from(document.querySelectorAll('input[name="price"]')).map(r => ({
      type: r.type,
      value: r.value,
      checked: r.checked,
      id: r.id,
      className: r.className,
      outerHTML: r.outerHTML
    }));

    const textInput = document.querySelector('input.qa-enter-price, input[name="price"][type="text"]');
    return {
      priceRadios,
      textInput: textInput ? {
        type: textInput.type,
        value: textInput.value,
        offsetParent: textInput.offsetParent !== null,
        className: textInput.className
      } : null
    };
  });

  console.log('Price Field Details:\n', JSON.stringify(priceDetails, null, 2));
  await browser.close();
}

inspectPrice().catch(console.error);
