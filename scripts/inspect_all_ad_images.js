const fs = require('fs');
const { chromium } = require('playwright');

async function inspectAllAdImages() {
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
  await page.goto('https://jiji.ng/profile/adverts', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  // Read the API response of adverts list
  const data = await page.evaluate(async () => {
    const res = await fetch('https://jiji.ng/api_web/v1/item-create/my-adverts.json?status=active');
    return await res.json();
  });

  console.log('Active adverts count:', data?.adverts?.length);
  if (data?.adverts) {
    for (const ad of data.adverts) {
      console.log(`- Active #${ad.id}: ${ad.title} (image: ${ad.image_id})`);
    }
  }

  const drafts = await page.evaluate(async () => {
    const res = await fetch('https://jiji.ng/api_web/v1/item-create/my-adverts.json?status=draft');
    return await res.json();
  });
  console.log('Draft adverts count:', drafts?.adverts?.length);
  if (drafts?.adverts) {
    for (const ad of drafts.adverts) {
      console.log(`- Draft #${ad.id}: ${ad.title} (image: ${ad.image_id})`);
    }
  }

  await browser.close();
}

inspectAllAdImages().catch(console.error);
