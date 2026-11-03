const fs = require('fs');
const { chromium } = require('playwright');

async function debugSubmitFlow() {
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

  // Listen to network responses
  page.on('response', async res => {
    const url = res.url();
    if (url.includes('advert') || url.includes('ad') || url.includes('api')) {
      if (res.request().method() === 'POST' || res.request().method() === 'PUT') {
        console.log(`[NET] ${res.request().method()} ${url} -> status ${res.status()}`);
        try {
          const body = await res.text();
          console.log(`[RESP] ${body.slice(0, 300)}`);
        } catch (e) {}
      }
    }
  });

  await page.goto('https://jiji.ng/edit-free-ad-55797060.html', { waitUntil: 'domcontentloaded', timeout: 25000 });
  await page.waitForTimeout(3000);

  // Click Switch to Software
  const switchBtn = await page.$('.b-moderation-error, button:has-text("Switch to Software")');
  if (switchBtn) {
    console.log('Clicking Switch to Software...');
    await switchBtn.click();
    await page.waitForTimeout(2000);
  }

  // Next button
  const nextBtn = await page.$('.b-create-ad-card__next-button, button:has-text("Next")');
  if (nextBtn) {
    console.log('Clicking Next...');
    await nextBtn.click();
    await page.waitForTimeout(2000);
  }

  // Click Submit
  const submitBtn = await page.$('#submit_button, button.qa-submit-button, button[type="submit"]');
  if (submitBtn) {
    console.log('Clicking Submit button...');
    await submitBtn.click();
    await page.waitForTimeout(6000);

    const postSubmitAlerts = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.b-form-alert, [class*="alert"], [class*="error"], .notification, [class*="toast"], [class*="popup"], [class*="modal"]')).map(el => el.innerText.trim()).filter(Boolean);
    });
    console.log('Post Submit Alerts/Toasts:', JSON.stringify(postSubmitAlerts, null, 2));
    await page.screenshot({ path: 'local_db/debug_submit_result.png', fullPage: true });
  }

  await browser.close();
}

debugSubmitFlow().catch(console.error);
