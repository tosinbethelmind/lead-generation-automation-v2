const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

async function diagnoseSubmit() {
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
    const u = res.url();
    if (u.includes('api_web') || u.includes('advert') || u.includes('save') || u.includes('edit')) {
      try {
        const text = await res.text();
        if (text.length < 2000 && (res.status() !== 200 || text.includes('error') || text.includes('status') || text.includes('message'))) {
          console.log(`[API RESPONSE] ${res.status()} ${u}\n${text.slice(0, 300)}`);
        }
      } catch (e) {}
    }
  });

  await page.goto('https://jiji.ng/edit-free-ad-55774340.html', { waitUntil: 'domcontentloaded', timeout: 35000 });
  await page.waitForTimeout(3000);

  // Check current images on page
  const imgCount = await page.evaluate(() => document.querySelectorAll('.b-image-item__wrapper').length);
  console.log('Current images count on 55774340:', imgCount);

  // Delete all images
  let del = 0;
  while (del < 10) {
    const btn = await page.$('.b-image-item__close-btn');
    if (!btn) break;
    await btn.click({ force: true }).catch(() => {});
    await page.waitForTimeout(600);
    del++;
  }
  console.log(`Deleted ${del} images.`);

  // Upload image
  const imgPath = path.resolve('public/jiji_ads/ad_2_unique.jpg');
  const fileInput = await page.$('input[type="file"]');
  if (fileInput) {
    console.log('Uploading image...');
    await fileInput.setInputFiles(imgPath);
    await page.waitForTimeout(6000);
  }

  // Click Next
  const nextBtn = await page.$('.b-create-ad-card__next-button, button:has-text("Next")');
  if (nextBtn) {
    await nextBtn.click();
    await page.waitForTimeout(2000);
  }

  // Check form values
  const formCheck = await page.evaluate(() => {
    const p = document.querySelector('input.qa-enter-price, input[name="price"]')?.value;
    const d = document.querySelector('textarea[name="description"]')?.value;
    const t = document.querySelector('input[name="title"]')?.value;
    const errors = Array.from(document.querySelectorAll('.b-form-error, .fw-has-error, .b-alert, [class*="error"]')).map(e => e.innerText.trim()).filter(Boolean);
    return { title: t, price: p, descLen: d?.length, errors };
  });
  console.log('Form State before submit:', formCheck);

  // Click Submit
  const submitBtn = await page.$('#submit_button, button.qa-submit-button, button[type="submit"]');
  if (submitBtn) {
    console.log('Clicking Submit button...');
    await submitBtn.click();
    await page.waitForTimeout(6000);
  }

  // Check URL and page state after submit
  console.log('After submit URL:', page.url());
  const postErrors = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.b-form-error, .fw-has-error, .b-alert, .b-declined-notification, [class*="error"]')).map(e => e.innerText.trim()).filter(Boolean);
  });
  console.log('Post-submit errors on page:', postErrors);

  await browser.close();
}

diagnoseSubmit().catch(console.error);
