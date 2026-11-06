const fs = require('fs');
const { chromium } = require('playwright');

async function inspectAd55777070() {
  const config = JSON.parse(fs.readFileSync('local_db/jiji_account_config.json', 'utf8'));
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--disable-blink-features=AutomationControlled', '--no-sandbox']
  });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 1000 }
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
  console.log('Navigating to https://jiji.ng/edit-free-ad-55777070.html...');
  await page.goto('https://jiji.ng/edit-free-ad-55777070.html', { waitUntil: 'domcontentloaded', timeout: 35000 });
  await page.waitForTimeout(4000);

  const state = await page.evaluate(() => {
    const titleInput = document.querySelector('input[name="title"]');
    const allInputs = Array.from(document.querySelectorAll('input, textarea, button')).map(e => ({
      tag: e.tagName,
      name: e.getAttribute('name'),
      type: e.getAttribute('type'),
      className: e.className,
      value: e.value?.slice(0, 30),
      visible: e.offsetParent !== null,
      disabled: e.disabled
    }));

    return {
      titleExists: !!titleInput,
      titleVisible: titleInput ? titleInput.offsetParent !== null : false,
      titleVal: titleInput ? titleInput.value : null,
      visibleInputs: allInputs.filter(x => x.visible)
    };
  });

  console.log('Page 55777070 state:\n', JSON.stringify(state, null, 2));

  await page.screenshot({ path: 'local_db/inspect_ad_55777070.png' });
  await browser.close();
}

inspectAd55777070().catch(console.error);
