const fs = require('fs');
const { chromium } = require('playwright');

async function inspectVueImage() {
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
  await page.goto('https://jiji.ng/edit-free-ad-55796997.html', {
    referer: 'https://jiji.ng/profile/adverts',
    waitUntil: 'networkidle'
  });

  const vueInfo = await page.evaluate(() => {
    const itemEl = document.querySelector('.b-image-item');
    const closeEl = document.querySelector('.b-image-item__close-btn');
    const sectionEl = document.querySelector('.b-add-image-section');

    const getItemVue = (el) => {
      if (!el) return null;
      let curr = el;
      while (curr && !curr.__vue__) {
        curr = curr.parentElement;
      }
      if (!curr) return null;
      const v = curr.__vue__;
      return {
        componentName: v.$options?.name || v.$options?._componentTag,
        dataKeys: Object.keys(v.$data || {}),
        methods: Object.keys(v.$options?.methods || {}),
        props: Object.keys(v.$props || {})
      };
    };

    return {
      itemVue: getItemVue(itemEl),
      closeVue: getItemVue(closeEl),
      sectionVue: getItemVue(sectionEl)
    };
  });

  console.log('Vue Component Info:', JSON.stringify(vueInfo, null, 2));
  await browser.close();
}

inspectVueImage().catch(console.error);
