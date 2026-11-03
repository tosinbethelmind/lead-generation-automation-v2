const fs = require('fs');
const { chromium } = require('playwright');

async function findAttributesEndpoint() {
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
  page.on('response', async res => {
    const u = res.url();
    if (u.includes('api_web') && !u.includes('frame_left') && !u.includes('unread')) {
      console.log('API:', res.status(), u);
      if (u.includes('attr') || u.includes('category') || u.includes('312')) {
        try {
          const t = await res.text();
          console.log('   Response preview:\n', t.slice(0, 300));
        } catch (e) {}
      }
    }
  });

  await page.goto('https://jiji.ng/add-free-ad.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  // Click Category Box
  const catBox = await page.$('.b-category-section__category-select, .qa-choose-category');
  if (catBox) {
    await catBox.click();
    await page.waitForTimeout(1000);
    const elec = await page.$('.multiselect__option:has-text("Electronics"), span:has-text("Electronics")');
    if (elec) {
      await elec.click();
      await page.waitForTimeout(1000);
      const soft = await page.$('.multiselect__option:has-text("Software"), span:has-text("Software")');
      if (soft) {
        await soft.click();
        await page.waitForTimeout(3000);
      }
    }
  }

  await browser.close();
}

findAttributesEndpoint().catch(console.error);
