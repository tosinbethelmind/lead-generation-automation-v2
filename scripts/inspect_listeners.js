const fs = require('fs');
const { chromium } = require('playwright');

async function inspectListeners() {
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
  const client = await page.context().newCDPSession(page);

  await page.goto('https://jiji.ng/edit-free-ad-55796997.html', {
    referer: 'https://jiji.ng/profile/adverts',
    waitUntil: 'networkidle'
  });

  // Hover over the wrapper to show controls
  const box = await page.locator('.b-image-item__wrapper').boundingBox();
  if (box) {
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.waitForTimeout(1000);
  }

  // Get event listeners via CDP
  const btnHandle = await page.$('.b-image-item__close-btn');
  if (btnHandle) {
    const { objectId } = await client.send('DOMDebugger.getEventListeners', {
      objectId: (await btnHandle.asElement())._remoteObject.objectId
    }).catch(e => ({ objectId: null, error: e.message }));
  }

  // Let's also check if there are dialogs or popups or if clicking triggers any API or DOM change
  page.on('dialog', async d => {
    console.log('Dialog popped up:', d.type(), d.message());
    await d.accept();
  });

  console.log('Now clicking close button directly with Playwright locator click...');
  await page.locator('.b-image-item__close-btn').click();
  await page.waitForTimeout(2000);

  const afterLocatorClick = await page.evaluate(() => {
    return {
      images: document.querySelectorAll('.b-image-item').length,
      popups: Array.from(document.querySelectorAll('.b-modal, .b-popup, .b-dialog, .b-confirm')).map(p => p.innerText.trim())
    };
  });
  console.log('After locator click:', JSON.stringify(afterLocatorClick, null, 2));

  await browser.close();
}

inspectListeners().catch(console.error);
