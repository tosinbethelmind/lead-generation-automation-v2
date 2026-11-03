const fs = require('fs');
const { chromium } = require('playwright');

const OTHER_ADS = ['55605082', '54990774', '52541101', '45140992', '51124478', '51159390', '50765741'];

async function checkOtherAds() {
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
  
  for (const id of OTHER_ADS) {
    try {
      await page.goto(`https://jiji.ng/edit-free-ad-${id}.html`, { waitUntil: 'networkidle', timeout: 25000 });
      await page.waitForTimeout(2000);
      const titleVal = await page.$eval('input[name="title"]', el => el.value).catch(() => 'No title input');
      console.log(`Ad #${id}: "${titleVal}" (URL: ${page.url()})`);
    } catch (e) {
      console.log(`Ad #${id}: Error ${e.message}`);
    }
  }

  await browser.close();
}

checkOtherAds().catch(console.error);
