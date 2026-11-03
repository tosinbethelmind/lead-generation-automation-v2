const fs = require('fs');
const { chromium } = require('playwright');

async function inspectDraftTab() {
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
  await page.goto('https://jiji.ng/profile/adverts', { waitUntil: 'domcontentloaded', timeout: 25000 });
  await page.waitForTimeout(3000);

  const draftTab = await page.$('.qa-tab-draft');
  if (draftTab) {
    console.log('Clicking qa-tab-draft...');
    await draftTab.click();
    await page.waitForTimeout(3000);

    const drafts = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.b-my-advert, .b-user-adverts-item, [class*="advert-item"]')).map(el => ({
        text: el.innerText.trim(),
        editLink: el.querySelector('a[href*="/edit"]')?.href,
        links: Array.from(el.querySelectorAll('a')).map(a => ({ text: a.innerText.trim(), href: a.href }))
      }));
    });
    console.log('Drafts found:', JSON.stringify(drafts, null, 2));
    await page.screenshot({ path: 'local_db/jiji_drafts_view.png' });
  }

  await browser.close();
}

inspectDraftTab().catch(console.error);
