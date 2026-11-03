const fs = require('fs');
const { chromium } = require('playwright');

async function inspectModifyReq() {
  const config = JSON.parse(fs.readFileSync('local_db/jiji_account_config.json', 'utf8'));
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--disable-blink-features=AutomationControlled', '--no-sandbox']
  });
  const context = await browser.newContext();
  const validCookies = (config.cookiesJson || []).map(c => {
    const copy = { ...c };
    if (!['Strict', 'Lax', 'None'].includes(copy.sameSite)) delete copy.sameSite;
    return copy;
  });
  await context.addCookies(validCookies);

  const page = await context.newPage();

  page.on('request', req => {
    if (req.url().includes('modify') || req.url().includes('item')) {
      console.log('--- INTERCEPTED ITEM REQUEST ---');
      console.log('Method:', req.method());
      console.log('URL:', req.url());
      console.log('Headers:', JSON.stringify(req.headers(), null, 2));
      console.log('Post Data:\n', req.postData());
    }
  });

  await page.goto('https://jiji.ng/edit-free-ad-55774340.html', { referer: 'https://jiji.ng/profile/adverts', waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);

  const nextBtn = await page.$('.b-create-ad-card__next-button, button:has-text("Next")');
  if (nextBtn) {
    await nextBtn.click();
    await page.waitForTimeout(2000);
  }

  const submitBtn = await page.$('#submit_button, button.qa-submit-button, button[type="submit"]');
  if (submitBtn) {
    console.log('Clicking submit...');
    await submitBtn.click();
    await page.waitForTimeout(4000);
  }

  await browser.close();
}

inspectModifyReq().catch(console.error);
