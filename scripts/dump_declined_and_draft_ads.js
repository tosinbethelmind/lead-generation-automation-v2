const fs = require('fs');
const { chromium } = require('playwright');

async function dumpDeclinedAndDrafts() {
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

  // Click on "Declined" tab
  console.log('Clicking Declined tab...');
  const declinedTab = await page.$('text=Declined');
  if (declinedTab) {
    await declinedTab.click();
    await page.waitForTimeout(3000);
  }

  const declinedAds = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.b-user-advert-card, .qa-user-advert-item, div[class*="adverts-item"], div[class*="advert-card"]'));
    return cards.map(c => {
      const titleEl = c.querySelector('a[href*="/edit"], a[href*="/advert/"], a[href*="/item/"], .b-user-advert-card__title, [class*="title"]');
      const editBtn = c.querySelector('a[href*="/edit-free-ad-"]');
      const reasonEl = c.querySelector('[class*="reason"], [class*="decline"], [class*="error"], [class*="warning"], [class*="message"]');
      const text = c.innerText;
      return {
        text: text.slice(0, 300),
        editHref: editBtn ? editBtn.getAttribute('href') : null,
        title: titleEl ? titleEl.innerText.trim() : null
      };
    });
  });

  console.log('Declined Ads found:', declinedAds.length);
  console.log(JSON.stringify(declinedAds, null, 2));

  // Click on "Draft" tab
  console.log('Clicking Draft tab...');
  const draftTab = await page.$('text=Draft');
  if (draftTab) {
    await draftTab.click();
    await page.waitForTimeout(3000);
  }

  const draftAds = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.b-user-advert-card, .qa-user-advert-item, div[class*="adverts-item"], div[class*="advert-card"]'));
    return cards.map(c => {
      const editBtn = c.querySelector('a[href*="/edit-free-ad-"]');
      return {
        text: c.innerText.slice(0, 300),
        editHref: editBtn ? editBtn.getAttribute('href') : null
      };
    });
  });

  console.log('Draft Ads found:', draftAds.length);
  console.log(JSON.stringify(draftAds, null, 2));

  await browser.close();
}

dumpDeclinedAndDrafts().catch(console.error);
