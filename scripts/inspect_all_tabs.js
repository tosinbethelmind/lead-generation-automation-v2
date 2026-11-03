const fs = require('fs');
const { chromium } = require('playwright');

async function inspectAllTabs() {
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
  await page.goto('https://jiji.ng/profile/adverts', { waitUntil: 'domcontentloaded', timeout: 25000 });
  await page.waitForTimeout(3000);

  // 1. Reviewing Tab
  const reviewTab = await page.$('.qa-tab-reviewing, a:has-text("Reviewing"), .b-my-adverts-tab:has-text("Reviewing")');
  if (reviewTab) {
    await reviewTab.click();
    await page.waitForTimeout(2000);
    const reviewingAds = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.b-my-advert, .b-user-adverts-item, [class*="advert-item"]')).map(el => el.innerText.trim()).filter(Boolean);
    });
    console.log('--- REVIEWING ADS ---');
    console.log(reviewingAds.map(t => t.split('\n')[2] || t.split('\n')[0]));
  }

  // 2. Active Tab
  const activeTab = await page.$('.qa-tab-active, a:has-text("Active"), .b-my-adverts-tab:has-text("Active")');
  if (activeTab) {
    await activeTab.click();
    await page.waitForTimeout(2000);
    const activeAds = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.b-my-advert, .b-user-adverts-item, [class*="advert-item"]')).map(el => el.innerText.trim()).filter(Boolean);
    });
    console.log('\n--- ACTIVE ADS ---');
    console.log(activeAds.map(t => t.split('\n')[2] || t.split('\n')[0]));
  }

  // 3. Declined Tab
  const declinedTab = await page.$('.qa-tab-declined, a:has-text("Declined"), .b-my-adverts-tab:has-text("Declined")');
  if (declinedTab) {
    await declinedTab.click();
    await page.waitForTimeout(2000);
    const declinedAds = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.b-my-advert, .b-user-adverts-item, [class*="advert-item"]')).map(el => {
        const lines = el.innerText.trim().split('\n');
        return {
          title: lines[2] || lines[0],
          reason: lines.find(l => l.includes('mistake') || l.includes('Software') || l.includes('photo') || l.includes('Description')) || 'Unknown',
          editLink: el.querySelector('a[href*="/edit"]')?.href
        };
      }).filter(a => a.editLink);
    });
    console.log('\n--- DECLINED ADS REMAINING ---');
    console.log(JSON.stringify(declinedAds, null, 2));
  }

  await browser.close();
}

inspectAllTabs().catch(console.error);
