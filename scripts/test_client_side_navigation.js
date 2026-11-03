const fs = require('fs');
const { chromium } = require('playwright');

async function testClientSideNavigation() {
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
  console.log('Navigating to profile/adverts...');
  await page.goto('https://jiji.ng/profile/adverts', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  // Click Declined tab
  const tabs = await page.$$('.b-my-adverts-tab__text');
  for (const t of tabs) {
    if ((await t.innerText()).includes('Declined')) {
      console.log('Clicking Declined tab...');
      await t.click();
      await page.waitForTimeout(3000);
      break;
    }
  }

  // Find all cards with an edit button
  const editButtons = await page.$$('a[href*="/edit-free-ad-"]');
  console.log('Found edit links on Declined tab:', editButtons.length);

  if (editButtons.length > 0) {
    const firstEditHref = await editButtons[0].getAttribute('href');
    console.log('Clicking first edit link:', firstEditHref);
    await editButtons[0].click();
    console.log('Waiting 5s for Nuxt page transition...');
    await page.waitForTimeout(5000);

    console.log('Current URL after click:', page.url());
    const titleVal = await page.$eval('input[name="title"]', el => el.value).catch(() => 'no title input');
    console.log('Title on edit page:', titleVal);

    const priceVal = await page.$eval('input.qa-enter-price, input[name="price"]', el => el.value).catch(() => 'no price input');
    console.log('Price on edit page:', priceVal);

    const catText = await page.$eval('.b-category-section__category-select, .qa-choose-category', el => el.innerText.trim()).catch(() => 'no category');
    console.log('Category on edit page:', catText);

    await page.screenshot({ path: 'local_db/client_side_edit_success.png' });
  }

  await browser.close();
}

testClientSideNavigation().catch(console.error);
