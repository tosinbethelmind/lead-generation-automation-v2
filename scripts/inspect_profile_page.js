const fs = require('fs');
const { chromium } = require('playwright');

async function inspectProfilePage() {
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

  const info = await page.evaluate(() => {
    const title = document.title;
    const bodyText = document.body.innerText.slice(0, 1500);
    const links = Array.from(document.querySelectorAll('a')).map(a => ({
      href: a.href,
      text: a.innerText.trim()
    })).filter(x => x.href.includes('advert') || x.href.includes('edit') || x.href.includes('item') || x.text.length > 5);

    return { title, bodyText, links: links.slice(0, 25) };
  });

  console.log('Profile page info:\n', JSON.stringify(info, null, 2));
  await browser.close();
}

inspectProfilePage().catch(console.error);
