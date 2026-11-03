const fs = require('fs');
const { chromium } = require('playwright');

async function dumpActiveAds() {
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
  await page.waitForTimeout(4000);

  const data = await page.evaluate(() => {
    const items = [];
    // Let's query all elements that look like an advert row or card
    const adEls = document.querySelectorAll('div.b-user-adverts-item, div.qa-user-advert-item, div[class*="adverts-item"]');
    
    adEls.forEach((el, index) => {
      const titleEl = el.querySelector('a[href*="/advert/"], a[href*="/item/"], .b-user-adverts-item__title, a.qa-advert-title') || el.querySelector('a');
      const priceEl = el.querySelector('.qa-user-advert-price, [class*="price"]');
      const statusEl = el.querySelector('.qa-user-advert-status, [class*="status"]');
      const editBtn = el.querySelector('a[href*="/edit"], button[class*="edit"]');
      
      items.push({
        index: index + 1,
        title: titleEl ? titleEl.innerText.trim() : 'Unknown Title',
        url: titleEl ? titleEl.href : null,
        price: priceEl ? priceEl.innerText.trim() : null,
        status: statusEl ? statusEl.innerText.trim() : null,
        editHref: editBtn ? (editBtn.href || editBtn.getAttribute('href')) : null
      });
    });

    // Also get all links on page that have /edit/ or /advert/
    const allLinks = Array.from(document.querySelectorAll('a'))
      .map(a => ({ text: a.innerText.trim(), href: a.href }))
      .filter(a => a.href.includes('/edit') || a.href.includes('/manage') || (a.href.includes('/item') && a.text.length > 5));

    return { items, allLinks };
  });

  console.log('--- FOUND ADVERTS ---');
  console.log(JSON.stringify(data, null, 2));

  fs.writeFileSync('local_db/jiji_user_active_ads.json', JSON.stringify(data, null, 2), 'utf8');

  // Let's also grab the DOM structure around an advert item to understand the edit buttons
  const sampleItemHtml = await page.evaluate(() => {
    const item = document.querySelector('div.b-user-adverts-item, div.qa-user-advert-item, div[class*="adverts-item"]');
    return item ? item.outerHTML : 'No item found';
  });
  fs.writeFileSync('local_db/jiji_sample_advert_item.html', sampleItemHtml, 'utf8');

  await browser.close();
}

dumpActiveAds().catch(console.error);
