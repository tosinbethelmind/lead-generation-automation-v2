const fs = require('fs');
const { chromium } = require('playwright');

async function traceCloseButton() {
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

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('request', req => {
    if (req.url().includes('api_web')) {
      console.log('REQ:', req.method(), req.url());
    }
  });
  page.on('response', async res => {
    if (res.url().includes('api_web')) {
      try {
        const text = await res.text();
        console.log('RES:', res.status(), res.url(), text.slice(0, 200));
      } catch (e) {}
    }
  });

  console.log('Navigating to Ad 55797060...');
  await page.goto('https://jiji.ng/edit-free-ad-55797060.html', { waitUntil: 'networkidle', timeout: 35000 });
  await page.waitForTimeout(3000);

  // Check how many image cards are rendered
  const wrappers = await page.$$('.b-image-item__wrapper, .b-image-item');
  console.log('Image wrappers found:', wrappers.length);

  for (let i = 0; i < wrappers.length; i++) {
    const w = wrappers[i];
    const isDeclined = await w.evaluate(el => el.classList.contains('b-image-item__wrapper--declined'));
    console.log(`Wrapper ${i} isDeclined: ${isDeclined}`);
  }

  // Click the first close button
  const closeBtn = await page.$('.b-image-item__close-btn');
  if (closeBtn) {
    console.log('Clicking close button...');
    await closeBtn.click();
    await page.waitForTimeout(3000);
    const wrappersAfter = await page.$$('.b-image-item__wrapper, .b-image-item');
    console.log('Wrappers after click:', wrappersAfter.length);
  } else {
    console.log('No close button found!');
  }

  await browser.close();
}

traceCloseButton().catch(console.error);
