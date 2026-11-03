const fs = require('fs');
const { chromium } = require('playwright');

async function testSelectElectronicsSoftware() {
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

  // Click on the Category box
  const catBox = await page.$('.b-category-section__category-select, .qa-choose-category');
  if (catBox) {
    console.log('Clicking Category box...');
    await catBox.click();
    await page.waitForTimeout(1000);

    // Click Electronics
    console.log('Clicking Electronics...');
    const elecOption = await page.$('.multiselect__option:has-text("Electronics"), span:has-text("Electronics")');
    if (elecOption) {
      await elecOption.click();
      await page.waitForTimeout(1500);

      // Click Software
      console.log('Clicking Software...');
      const softOption = await page.$('.multiselect__option:has-text("Software"), span:has-text("Software")');
      if (softOption) {
        await softOption.click();
        await page.waitForTimeout(2000);
        console.log('Selected Software!');
      } else {
        console.log('Software option not found');
      }
    } else {
      console.log('Electronics option not found');
    }
  }

  // Check what category text is shown now
  const catText = await page.$eval('.b-category-section__category-select, .qa-choose-category', el => el.innerText.trim()).catch(() => 'err');
  console.log('Category after selection:', catText);

  // Check if error is gone
  const hasError = await page.$('.fw-has-error');
  console.log('Has error now:', !!hasError);

  await page.screenshot({ path: 'local_db/jiji_selected_software.png' });
  await browser.close();
}

testSelectElectronicsSoftware().catch(console.error);
