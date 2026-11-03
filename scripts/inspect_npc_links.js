const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://nigeriapropertycentre.com/requests', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  const links = await page.evaluate(() => {
    const list = [];
    document.querySelectorAll('a').forEach(a => {
      if (a.href && a.href.includes('/requests/') && a.innerText.trim().length > 10) {
        list.push({ title: a.innerText.trim(), url: a.href });
      }
    });
    return list.slice(0, 8);
  });

  console.log(JSON.stringify(links, null, 2));
  await browser.close();
})();
