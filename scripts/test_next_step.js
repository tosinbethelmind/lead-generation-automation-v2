const fs = require('fs');
const { chromium } = require('playwright');

async function testNextStep() {
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
  await page.goto('https://jiji.ng/edit-free-ad-55797060.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);

  const nextBtn = await page.$('.b-create-ad-card__next-button, button:has-text("Next")');
  console.log('Next button found:', !!nextBtn);
  if (nextBtn) {
    console.log('Next button enabled:', await nextBtn.isEnabled());
    await nextBtn.click();
    await page.waitForTimeout(3000);

    const priceVisible = await page.$('input.qa-enter-price, input[name="price"]');
    console.log('Price input visible after Next:', !!priceVisible);

    const descVisible = await page.$('textarea[name="description"]');
    console.log('Description textarea visible after Next:', !!descVisible);

    const submitBtn = await page.$('#submit_button, button.qa-submit-button, button[type="submit"]');
    console.log('Submit button visible after Next:', !!submitBtn);

    if (submitBtn) {
      console.log('Submit button enabled:', await submitBtn.isEnabled());
      await submitBtn.click();
      console.log('Clicked submit! Waiting 7s...');
      await page.waitForTimeout(7000);
      console.log('Post submit URL:', page.url());
    }
  }

  await browser.close();
}

testNextStep().catch(console.error);
