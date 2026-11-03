const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://nigeriapropertycentre.com/requests', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  const text = await page.evaluate(() => document.body.innerText);
  console.log(text.slice(0, 1000));
  await browser.close();
})();
