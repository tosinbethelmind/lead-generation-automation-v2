const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://nigeriapropertycentre.com/requests', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  // Extract real request titles and budgets
  const requests = await page.evaluate(() => {
    const items = [];
    const elements = document.querySelectorAll('div.wp-block-content, div.property-request, div.table-responsive tr, div.panel-body');
    elements.forEach(el => {
      const text = el.innerText;
      if (text && (text.includes('₦') || text.includes('Budget') || text.includes('bed') || text.includes('Lekki') || text.includes('Ikoyi') || text.includes('Lagos'))) {
        items.push(text.split('\n').filter(l => l.trim().length > 3).slice(0, 4).join(' | '));
      }
    });
    return items.slice(0, 8);
  });

  console.log('--- REAL-TIME LIVE PROPERTY REQUESTS ON NIGERIA PROPERTY CENTRE ---');
  requests.forEach((r, i) => console.log(`${i + 1}. ${r}`));
  await browser.close();
})();
