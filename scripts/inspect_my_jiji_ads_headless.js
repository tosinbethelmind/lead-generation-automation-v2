const path = require('path');
const fs = require('fs');

async function main() {
  const { chromium } = require('playwright');
  const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../local_db/jiji_account_config.json'), 'utf8'));

  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });

  const context = await browser.newContext();

  if (config.cookiesJson && Array.isArray(config.cookiesJson)) {
    const validCookies = config.cookiesJson.map(c => {
      const copy = { ...c };
      if (!['Strict', 'Lax', 'None'].includes(copy.sameSite)) {
        delete copy.sameSite;
      }
      return copy;
    });
    await context.addCookies(validCookies);
    console.log(`Injected ${validCookies.length} sanitized cookies.`);
  }

  const page = await context.newPage();

  page.on('response', async res => {
    const url = res.url();
    if (url.includes('advert') || url.includes('user') || url.includes('profile')) {
      if (res.status() === 200 && (res.headers()['content-type'] || '').includes('json')) {
        try {
          const json = await res.json();
          const str = JSON.stringify(json);
          if (str.includes('advert') || str.includes('title')) {
            console.log('\n[API MATCH]', url);
            console.log(str.slice(0, 400));
          }
        } catch (_) {}
      }
    }
  });

  console.log('Navigating to https://jiji.ng/profile ...');
  await page.goto('https://jiji.ng/profile', { waitUntil: 'domcontentloaded', timeout: 35000 });
  await page.waitForTimeout(6000);

  console.log('Page URL:', page.url());
  console.log('Title:', await page.title());

  const adCards = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a'));
    return links.map(a => ({
      text: a.innerText.trim(),
      href: a.href
    })).filter(a => a.href.includes('/advert') || a.href.includes('/edit') || a.text.includes('Edit'));
  });

  console.log('\nVisible Ad links / Edit buttons:', adCards);

  // Take a clean screenshot
  await page.screenshot({ path: path.join(__dirname, '../local_db/jiji_profile_screenshot.png') });
  console.log('Saved screenshot to local_db/jiji_profile_screenshot.png');

  await browser.close();
}

main().catch(console.error);
