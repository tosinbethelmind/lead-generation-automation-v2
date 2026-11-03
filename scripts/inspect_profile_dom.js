const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

async function inspectProfileDom() {
  const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../local_db/jiji_account_config.json'), 'utf8'));

  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const context = await browser.newContext();

  const validCookies = config.cookiesJson.map(c => {
    const copy = { ...c };
    if (!['Strict', 'Lax', 'None'].includes(copy.sameSite)) delete copy.sameSite;
    return copy;
  });
  await context.addCookies(validCookies);

  const page = await context.newPage();
  await page.goto('https://jiji.ng/profile', { waitUntil: 'networkidle', timeout: 35000 });
  await page.waitForTimeout(4000);

  const domSummary = await page.evaluate(() => {
    return {
      allLinks: Array.from(document.querySelectorAll('a')).map(a => ({ text: a.innerText.trim(), href: a.href })),
      buttons: Array.from(document.querySelectorAll('button')).map(b => b.innerText.trim()),
      bodyTextSnippet: document.body.innerText.slice(0, 1500)
    };
  });

  console.log('Dom Summary:');
  console.log('Body Text Snippet:\n', domSummary.bodyTextSnippet);
  console.log('\nAll Links:', domSummary.allLinks);
  console.log('\nButtons:', domSummary.buttons);

  await browser.close();
}

inspectProfileDom().catch(console.error);
