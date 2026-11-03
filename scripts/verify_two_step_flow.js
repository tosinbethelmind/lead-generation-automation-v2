const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

async function testTwoStepFlow() {
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
  
  const targetUrl = 'https://jiji.ng/edit-free-ad-55774340.html';
  console.log(`Navigating to ${targetUrl} ...`);
  await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 35000 });
  await page.waitForTimeout(4000);

  const newTitle = "Website Design Lagos • 24h Express Delivery & WhatsApp Closer";
  console.log('Step 1: Setting title...');
  await page.fill('input[name="title"]', newTitle);
  await page.waitForTimeout(1000);

  // Check Next button
  const nextBtn = await page.$('.b-create-ad-card__next-button, button:has-text("Next")');
  if (nextBtn) {
    const isEnabled = await nextBtn.isEnabled();
    console.log('Next button found, enabled:', isEnabled);
    if (isEnabled) {
      console.log('Clicking Next button...');
      await nextBtn.click();
      await page.waitForTimeout(3000);
    }
  }

  // Now check Step 2 inputs
  const step2Info = await page.evaluate(() => {
    const desc = document.querySelector('textarea[name="description"]');
    const priceText = document.querySelector('input.qa-enter-price, input[name="price"][type="text"]');
    const submit = document.querySelector('#submit_button, button.qa-submit-button');
    return {
      descVisible: desc ? desc.offsetParent !== null : false,
      priceVisible: priceText ? priceText.offsetParent !== null : false,
      submitVisible: submit ? submit.offsetParent !== null : false,
      submitEnabled: submit ? !submit.disabled : false
    };
  });

  console.log('Step 2 Form State:\n', JSON.stringify(step2Info, null, 2));

  await page.screenshot({ path: 'local_db/step2_form_state.png' });
  console.log('Saved screenshot to local_db/step2_form_state.png');

  await browser.close();
}

testTwoStepFlow().catch(console.error);
