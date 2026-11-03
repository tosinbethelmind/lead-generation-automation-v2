const fs = require('fs');
const { chromium } = require('playwright');

async function inspectSubcategory() {
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
  await page.goto('https://jiji.ng/edit-free-ad-55797060.html', { waitUntil: 'domcontentloaded', timeout: 25000 });
  await page.waitForTimeout(3000);

  // Click Switch to Software
  const switchBtn = await page.$('.b-moderation-error, button:has-text("Switch to Software")');
  if (switchBtn) {
    console.log('Clicking Switch to Software...');
    await switchBtn.click();
    await page.waitForTimeout(3000);
  }

  // Check all select or input fields
  const fields = await page.evaluate(() => {
    const res = [];
    document.querySelectorAll('.fw-field, .qa-fw-select, .b-category-section__category-select').forEach(el => {
      res.push({
        text: el.innerText.trim(),
        className: el.className
      });
    });
    return res;
  });

  console.log('Fields after Switch click:', JSON.stringify(fields, null, 2));

  // Check submit button
  const nextBtn = await page.$('.b-create-ad-card__next-button, button:has-text("Next")');
  console.log('Next button found:', !!nextBtn);
  if (nextBtn) {
    const isEnabled = await nextBtn.isEnabled();
    console.log('Next button enabled:', isEnabled);
  }

  await browser.close();
}

inspectSubcategory().catch(console.error);
