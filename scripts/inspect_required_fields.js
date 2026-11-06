const fs = require('fs');
const { chromium } = require('playwright');

async function inspectRequiredFields() {
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
  await page.goto('https://jiji.ng/edit-free-ad-55774340.html', { waitUntil: 'domcontentloaded', timeout: 35000 });
  await page.waitForTimeout(4000);

  // Check form values and validation state
  const formState = await page.evaluate(() => {
    const fields = Array.from(document.querySelectorAll('.b-create-ad-card__attribute, .b-create-ad-card__row, .b-create-ad-card__field')).map(el => ({
      label: el.querySelector('label, .b-create-ad-card__attribute-label')?.innerText?.trim(),
      inputName: el.querySelector('input, textarea, select')?.getAttribute('name'),
      inputValue: el.querySelector('input, textarea, select')?.value,
      isError: el.classList.contains('is-error') || !!el.querySelector('.b-form-error, .is-invalid'),
      errorText: el.querySelector('.b-form-error, .is-invalid')?.innerText?.trim()
    }));

    const submitBtn = document.querySelector('#submit_button');
    const submitBtnClasses = submitBtn ? submitBtn.className : null;

    return { fields, submitBtnClasses };
  });

  console.log('Form State:\n', JSON.stringify(formState, null, 2));

  await browser.close();
}

inspectRequiredFields().catch(console.error);
