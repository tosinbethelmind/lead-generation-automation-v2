const fs = require('fs');
const { chromium } = require('playwright');

async function debugNuxt() {
  const config = JSON.parse(fs.readFileSync('local_db/jiji_account_config.json', 'utf8'));
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--disable-blink-features=AutomationControlled', '--no-sandbox']
  });
  const context = await browser.newContext();
  const validCookies = (config.cookiesJson || []).map(c => {
    const copy = { ...c };
    if (!['Strict', 'Lax', 'None'].includes(copy.sameSite)) delete copy.sameSite;
    return copy;
  });
  await context.addCookies(validCookies);

  const page = await context.newPage();
  page.on('response', async res => {
    const u = res.url();
    if (u.includes('api_web') || u.includes('item') || u.includes('advert')) {
      console.log(`[HTTP ${res.status()}] ${u}`);
      if (u.includes('item') || u.includes('advert') || res.status() >= 400) {
        try {
          const t = await res.text();
          console.log('   Response preview:', t.slice(0, 200));
        } catch (e) {}
      }
    }
  });

  await page.goto('https://jiji.ng/edit-free-ad-55777070.html', { waitUntil: 'load' });
  await page.waitForTimeout(6000);

  const titleVal = await page.$eval('input[name="title"]', el => el.value).catch(() => 'no title input');
  console.log('Title found:', titleVal);

  await browser.close();
}

debugNuxt().catch(console.error);
