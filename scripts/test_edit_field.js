const fs = require('fs');
const { chromium } = require('playwright');

async function testEditField() {
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
  console.log('Navigating to ad 55774340...');
  await page.goto('https://jiji.ng/edit-free-ad-55774340.html', { waitUntil: 'domcontentloaded', timeout: 35000 });
  await page.waitForTimeout(3000);

  // Fill title
  console.log('Filling title...');
  await page.click('input[name="title"]');
  await page.fill('input[name="title"]', 'Professional Business Website Design in 24 Hours • ₦40k Deposit');
  await page.dispatchEvent('input[name="title"]', 'input');
  await page.dispatchEvent('input[name="title"]', 'change');
  await page.waitForTimeout(1000);

  // Fill price
  console.log('Filling price...');
  const priceInput = await page.$('input.qa-enter-price, input[name="price"][type="text"]');
  if (priceInput) {
    await priceInput.click();
    await priceInput.fill('40000');
    await priceInput.dispatchEvent('input');
    await priceInput.dispatchEvent('change');
  }
  await page.waitForTimeout(1000);

  // Fill description
  console.log('Filling description...');
  const descInput = await page.$('textarea[name="description"]');
  if (descInput) {
    await descInput.click();
    await descInput.fill('Stop losing paying customers when they search for your business on Google! Bethelmind Digital Solutions builds your official mobile website in 24 hours. Contact: 0802 279 1227');
    await descInput.dispatchEvent('input');
    await descInput.dispatchEvent('change');
  }
  await page.waitForTimeout(2000);

  const status = await page.evaluate(() => {
    const submitBtn = document.querySelector('#submit_button');
    return {
      className: submitBtn ? submitBtn.className : null,
      disabled: submitBtn ? submitBtn.disabled : null,
      visible: submitBtn ? submitBtn.offsetParent !== null : false
    };
  });

  console.log('Submit button status after edits:', status);

  await page.screenshot({ path: 'local_db/test_after_edits_55774340.png' });
  await browser.close();
}

testEditField().catch(console.error);
