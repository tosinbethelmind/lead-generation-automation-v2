const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://www.bethelmindanalytics.com/deal/demo', { waitUntil: 'networkidle' });

  // Get canvas element
  const canvas = await page.$('canvas');
  console.log('Canvas found:', !!canvas);

  // Get the submit button text
  const submitBtn = await page.$('button[type="submit"]');
  const btnText = submitBtn ? await submitBtn.textContent() : 'NOT_FOUND';
  console.log('Button text:', btnText.trim());

  // Check the legal agreement checkbox
  const checkbox = await page.$('input[type="checkbox"]');
  console.log('Checkbox found:', !!checkbox);

  // Take screenshot of the signature pad for visual verification
  const formElement = await page.$('form');
  if (formElement) {
    await formElement.screenshot({ path: 'scripts/signature_pad_preview.png' });
    console.log('Screenshot saved to scripts/signature_pad_preview.png');
  }

  await browser.close();
})();
