const fs = require('fs');
const { chromium } = require('playwright');

async function debugStep1() {
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

  const step1State = await page.evaluate(() => {
    const nextBtn = document.querySelector('.b-create-ad-card__next-button');
    const images = Array.from(document.querySelectorAll('.b-image-uploader__image, .qa-image-thumb, img')).map(img => img.src || img.className);
    const title = document.querySelector('input[name="title"]')?.value;
    const category = document.querySelector('input[name="parent_category"]')?.value || document.querySelector('.multiselect__single')?.innerText;

    return {
      title,
      category,
      imageCount: images.length,
      nextBtnClass: nextBtn ? nextBtn.className : null,
      nextBtnDisabled: nextBtn ? nextBtn.disabled : null,
      nextBtnVisible: nextBtn ? nextBtn.offsetParent !== null : false
    };
  });

  console.log('Step 1 initial state:', step1State);

  // Now change title
  await page.fill('input[name="title"]', 'Professional Business Website Design in 24 Hours • ₦40k Deposit');
  await page.dispatchEvent('input[name="title"]', 'input');
  await page.dispatchEvent('input[name="title"]', 'change');
  await page.waitForTimeout(1000);

  const afterTitle = await page.evaluate(() => {
    const nextBtn = document.querySelector('.b-create-ad-card__next-button');
    return {
      nextBtnClass: nextBtn ? nextBtn.className : null,
      nextBtnDisabled: nextBtn ? nextBtn.disabled : null
    };
  });
  console.log('After title change:', afterTitle);

  // What happens if we click nextBtn anyway?
  const nextBtn = await page.$('.b-create-ad-card__next-button');
  if (nextBtn) {
    console.log('Attempting to click next button directly...');
    await nextBtn.click({ force: true });
    await page.waitForTimeout(3000);
  }

  const afterClick = await page.evaluate(() => {
    const desc = document.querySelector('textarea[name="description"]');
    const price = document.querySelector('input.qa-enter-price');
    const submitBtn = document.querySelector('#submit_button');
    return {
      descVisible: desc ? desc.offsetParent !== null : false,
      priceVisible: price ? price.offsetParent !== null : false,
      submitBtnVisible: submitBtn ? submitBtn.offsetParent !== null : false
    };
  });
  console.log('After Next click force:', afterClick);

  await page.screenshot({ path: 'local_db/step1_debug_55774340.png' });
  await browser.close();
}

debugStep1().catch(console.error);
