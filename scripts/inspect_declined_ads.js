const fs = require('fs');
const { chromium } = require('playwright');

async function inspectDeclinedAds() {
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
  console.log('Navigating to https://jiji.ng/profile/adverts ...');
  await page.goto('https://jiji.ng/profile/adverts', { waitUntil: 'networkidle', timeout: 35000 });
  await page.waitForTimeout(4000);

  // Take screenshot of adverts page
  await page.screenshot({ path: 'local_db/jiji_profile_adverts_overview.png', fullPage: true });

  // Get tabs (Active, In Review, Declined, Closed, etc.)
  const tabs = await page.evaluate(() => {
    const tabEls = document.querySelectorAll('.b-user-adverts-tabs__item, [class*="tab"]');
    return Array.from(tabEls).map(t => ({
      text: t.innerText.trim(),
      className: t.className,
      href: t.querySelector('a')?.href || null
    }));
  });
  console.log('Ad Tabs:', JSON.stringify(tabs, null, 2));

  // Let's inspect all items visible or check each status tab
  const items = await page.evaluate(() => {
    const list = [];
    document.querySelectorAll('.b-user-adverts-item, div[class*="user-adverts-item"], .qa-user-advert-item').forEach(el => {
      const title = el.querySelector('a[href*="/advert/"], a[href*="/item/"], .b-user-adverts-item__title, a.qa-advert-title, a')?.innerText?.trim() || '';
      const editBtn = el.querySelector('a[href*="/edit"], button[class*="edit"]');
      const status = el.querySelector('.qa-user-advert-status, [class*="status"], .b-user-adverts-item__status, [class*="badge"]')?.innerText?.trim() || '';
      const reason = el.querySelector('[class*="reason"], [class*="reject"], [class*="decline"], [class*="alert"]')?.innerText?.trim() || '';
      const href = editBtn ? (editBtn.href || editBtn.getAttribute('href')) : null;
      list.push({ title, status, reason, href });
    });
    return list;
  });

  console.log('Visible Adverts:', JSON.stringify(items, null, 2));

  // Also look for any declined or closed tabs specifically
  const declinedTab = await page.$('a[href*="declined"], a:has-text("Declined"), .b-user-adverts-tabs__item:has-text("Declined"), button:has-text("Declined")');
  if (declinedTab) {
    console.log('Found Declined Tab, clicking it...');
    await declinedTab.click();
    await page.waitForTimeout(4000);
    await page.screenshot({ path: 'local_db/jiji_declined_tab.png', fullPage: true });

    const declinedItems = await page.evaluate(() => {
      const list = [];
      document.querySelectorAll('.b-user-adverts-item, div[class*="user-adverts-item"]').forEach(el => {
        const text = el.innerText.trim();
        const editLink = el.querySelector('a[href*="/edit"]')?.href;
        list.push({ text, editLink });
      });
      return list;
    });
    console.log('Declined items:', JSON.stringify(declinedItems, null, 2));
  }

  // Also look for "Closed" tab
  const closedTab = await page.$('a[href*="closed"], a:has-text("Closed"), .b-user-adverts-tabs__item:has-text("Closed")');
  if (closedTab) {
    console.log('Found Closed Tab, clicking it...');
    await closedTab.click();
    await page.waitForTimeout(4000);
    await page.screenshot({ path: 'local_db/jiji_closed_tab.png', fullPage: true });
    const closedItems = await page.evaluate(() => {
      const list = [];
      document.querySelectorAll('.b-user-adverts-item, div[class*="user-adverts-item"]').forEach(el => {
        const text = el.innerText.trim();
        const editLink = el.querySelector('a[href*="/edit"]')?.href;
        list.push({ text, editLink });
      });
      return list;
    });
    console.log('Closed items:', JSON.stringify(closedItems, null, 2));
  }

  await browser.close();
}

inspectDeclinedAds().catch(console.error);
