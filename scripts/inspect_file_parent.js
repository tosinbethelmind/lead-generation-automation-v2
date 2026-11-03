const fs = require('fs');
const { chromium } = require('playwright');

async function inspectFileParent() {
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
  await page.goto('https://jiji.ng/edit-free-ad-55797060.html', { waitUntil: 'domcontentloaded', timeout: 25000 });
  await page.waitForTimeout(3000);

  const containerInfo = await page.evaluate(() => {
    const fi = document.querySelector('input[type="file"]');
    if (!fi) return 'No file input';
    const section = fi.closest('.b-create-ad-card__images-section, div[class*="images"], div[class*="photo"], .fw-field') || fi.parentElement.parentElement;
    return {
      sectionHtml: section.outerHTML.slice(0, 1500),
      buttons: Array.from(section.querySelectorAll('button, svg, [class*="remove"], [class*="delete"], [class*="close"]')).map(b => ({
        tag: b.tagName,
        className: b.className,
        text: b.innerText?.trim()
      }))
    };
  });

  console.log('Container Info:', JSON.stringify(containerInfo, null, 2));
  await browser.close();
}

inspectFileParent().catch(console.error);
