const fs = require('fs');
const { chromium } = require('playwright');

async function inspectDeclined() {
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

  const testIds = ['55797060', '55774340', '55777070'];
  for (const id of testIds) {
    console.log(`\n--- Inspecting Ad ${id} ---`);
    await page.goto(`https://jiji.ng/edit-free-ad-${id}.html`, { waitUntil: 'networkidle', timeout: 35000 });
    await page.waitForTimeout(3000);

    const info = await page.evaluate(() => {
      const banner = document.querySelector('.b-declined-notification, .b-alert, [class*="decline"], [class*="alert"]');
      const catText = document.querySelector('.qa-choose-category, .b-category-section__category-select')?.innerText;
      const titleVal = document.querySelector('input[name="title"]')?.value;
      const imagesCount = document.querySelectorAll('.b-image-item__wrapper').length;
      const declinedImages = document.querySelectorAll('.b-image-item__wrapper--declined').length;
      const imageSources = Array.from(document.querySelectorAll('img')).map(i => i.src).filter(s => s.includes('jiji') || s.includes('blob'));
      const bodyText = document.body.innerText;
      
      const lines = bodyText.split('\n').map(l => l.trim()).filter(Boolean);
      const declineReasons = lines.filter(l => l.toLowerCase().includes('reason') || l.toLowerCase().includes('declined') || l.toLowerCase().includes('reject'));

      return {
        catText,
        titleVal,
        imagesCount,
        declinedImages,
        imageSources: imageSources.slice(0, 3),
        declineReasons,
        bannerText: banner ? banner.innerText.trim() : null
      };
    });

    console.log(`Ad ${id} Info:`, JSON.stringify(info, null, 2));
    await page.screenshot({ path: `local_db/inspect_declined_${id}.png` });
  }

  await browser.close();
}

inspectDeclined().catch(console.error);
