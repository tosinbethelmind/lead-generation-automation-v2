const fs = require('fs');
const { chromium } = require('playwright');

async function inspectInputs() {
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
  await page.goto('https://jiji.ng/edit-free-ad-55774340.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  const inputs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('input, select, textarea')).map(el => {
      return {
        name: el.name,
        id: el.id,
        type: el.type,
        value: el.value ? el.value.slice(0, 50) : ''
      };
    }).filter(i => i.name.toLowerCase().includes('image') || i.value.includes('209301937') || i.value.includes('209653305'));
  });

  console.log('Image related inputs:', JSON.stringify(inputs, null, 2));

  // Also check window.__NUXT__ or window.__INITIAL_STATE__ or Vue root
  const vueData = await page.evaluate(() => {
    if (window.__NUXT__) return 'Has __NUXT__';
    const app = document.querySelector('#__layout, #app, #main');
    return app ? 'Has root app' : 'No root app';
  });
  console.log('Vue info:', vueData);

  await browser.close();
}

inspectInputs().catch(console.error);
