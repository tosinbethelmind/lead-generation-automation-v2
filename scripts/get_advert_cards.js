const fs = require('fs');
const { chromium } = require('playwright');

async function getFullAdvertDetails() {
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
  await context.route('**/*', (route) => {
    const req = route.request();
    const type = req.resourceType();
    const url = req.url();
    if (['image', 'media', 'font'].includes(type) || url.includes('google-analytics') || url.includes('facebook') || url.includes('clarity') || url.includes('criteo')) {
      return route.abort();
    }
    return route.continue();
  });
  const validCookies = (config.cookiesJson || []).map(c => {
    const copy = { ...c };
    if (!['Strict', 'Lax', 'None'].includes(copy.sameSite)) delete copy.sameSite;
    return copy;
  });
  await context.addCookies(validCookies);

  const page = await context.newPage();
  await page.goto('https://jiji.ng/profile/adverts', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(4000);

  const advertCards = await page.evaluate(() => {
    const editLinks = Array.from(document.querySelectorAll('a[href*="edit-free-ad-"]'));
    return editLinks.map(a => {
      // Find the card container
      let parent = a.parentElement;
      for (let i = 0; i < 5; i++) {
        if (parent && (parent.innerText.includes('₦') || parent.innerText.includes('Active') || parent.innerText.includes('Review'))) {
          break;
        }
        if (parent) parent = parent.parentElement;
      }
      return {
        editUrl: a.href,
        adId: a.href.match(/edit-free-ad-(\d+)/)?.[1],
        cardText: parent ? parent.innerText.replace(/\n+/g, ' | ') : 'No parent'
      };
    });
  });

  console.log('Advert cards found:\n', JSON.stringify(advertCards, null, 2));
  fs.writeFileSync('local_db/jiji_profile_cards.json', JSON.stringify(advertCards, null, 2), 'utf8');

  await browser.close();
}

getFullAdvertDetails().catch(console.error);
