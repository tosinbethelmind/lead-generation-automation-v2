const fs = require('fs');
const { chromium } = require('playwright');

async function debug55796997() {
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

  page.on('response', async res => {
    if (res.url().includes('modify')) {
      console.log('Modify status on 55796997:', res.status());
      try {
        console.log('Modify body:\n', await res.text());
      } catch (e) {}
    }
  });

  await page.goto('https://jiji.ng/edit-free-ad-55796997.html', {
    referer: 'https://jiji.ng/profile/adverts',
    waitUntil: 'domcontentloaded'
  });
  await page.waitForTimeout(4000);

  // Click Next if visible
  const nextBtn = await page.$('.b-create-ad-card__next-button, button:has-text("Next")');
  if (nextBtn) {
    console.log('Clicking Next...');
    await nextBtn.click();
    await page.waitForTimeout(3000);
  }

  // Click Submit
  const submitBtn = await page.$('#submit_button, button.qa-submit-button, button[type="submit"]');
  if (submitBtn) {
    console.log('Clicking Submit...');
    await submitBtn.click();
    await page.waitForTimeout(4000);
  }

  const errors = await page.evaluate(() => {
    const els = document.querySelectorAll('.fw-has-error, .b-form-error, .b-alert, [class*="error"], [class*="mistake"]');
    return Array.from(els).map(e => e.innerText.trim()).filter(Boolean);
  });
  console.log('Errors on 55796997:', errors);

  await browser.close();
}

debug55796997().catch(console.error);
