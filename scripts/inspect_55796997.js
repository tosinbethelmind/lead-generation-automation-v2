const fs = require('fs');
const { chromium } = require('playwright');

async function inspectAd() {
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
  await page.goto('https://jiji.ng/edit-free-ad-55796997.html', {
    referer: 'https://jiji.ng/profile/adverts',
    waitUntil: 'networkidle'
  });
  await page.screenshot({ path: 'local_db/inspect_55796997.png', fullPage: true });

  const html = await page.evaluate(() => {
    return {
      title: document.title,
      h1: document.querySelector('h1')?.innerText,
      bodyPreview: document.body.innerText.slice(0, 1000),
      allInputs: Array.from(document.querySelectorAll('input')).map(i => ({ name: i.name, type: i.type, value: i.value, class: i.className })),
      allImages: Array.from(document.querySelectorAll('img')).map(img => img.src).filter(s => !s.includes('data:image')),
      allClasses: Array.from(document.querySelectorAll('[class*="image"], [class*="photo"], [class*="picture"], [class*="upload"]')).map(el => el.className)
    };
  });
  console.log('HTML Dump:', JSON.stringify(html, null, 2));
  await browser.close();
}

inspectAd().catch(console.error);
