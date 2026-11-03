const fs = require('fs');
const { chromium } = require('playwright');

async function inspectDeclinedTabDetails() {
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
  await page.goto('https://jiji.ng/profile/adverts', { waitUntil: 'networkidle', timeout: 35000 });
  await page.waitForTimeout(3000);

  console.log('Clicking qa-tab-declined...');
  await page.click('.qa-tab-declined');
  await page.waitForTimeout(4000);

  await page.screenshot({ path: 'local_db/jiji_declined_tab_view.png', fullPage: true });

  const declinedAds = await page.evaluate(() => {
    const cards = [];
    document.querySelectorAll('.b-my-advert, .b-user-adverts-item, [class*="advert-item"], [class*="my-advert"]').forEach(el => {
      const title = el.querySelector('a, [class*="title"]')?.innerText?.trim() || '';
      const text = el.innerText;
      const editBtn = el.querySelector('a[href*="/edit"], button[class*="edit"]');
      const href = editBtn ? (editBtn.href || editBtn.getAttribute('href')) : el.querySelector('a[href*="edit"]')?.href;
      cards.push({ title, text, href });
    });
    return cards;
  });

  console.log('Declined Ads Found:', JSON.stringify(declinedAds, null, 2));

  // Also extract all links containing edit
  const editLinks = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a[href*="edit"]')).map(a => ({
      text: a.innerText.trim(),
      href: a.href,
      parentText: a.parentElement?.parentElement?.innerText?.trim()?.slice(0, 150)
    }));
  });
  console.log('Edit Links on page:', JSON.stringify(editLinks, null, 2));

  await browser.close();
}

inspectDeclinedTabDetails().catch(console.error);
