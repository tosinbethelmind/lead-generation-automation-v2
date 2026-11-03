const { chromium } = require('playwright');

async function checkApp() {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

  page.on('pageerror', err => {
    console.error('PAGE ERROR OCCURRED:');
    console.error(err.message);
    console.error(err.stack);
  });

  await page.context().addCookies([{
    name: 'admin-token',
    value: 'bethelmind_admin_2026',
    domain: 'www.bethelmindanalytics.com',
    path: '/'
  }]);

  console.log('Navigating with cache-busting query parameter...');
  const url = `https://www.bethelmindanalytics.com/admin/mobile?pillar=pillar2&_t=${Date.now()}`;
  await page.goto(url, { waitUntil: 'load', timeout: 35000 });
  await page.waitForTimeout(5000);

  const btns = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button')).map(b => b.innerText.trim().slice(0, 30));
  });

  console.log('Total Buttons:', btns.length);
  console.log('Buttons:', btns);

  await browser.close();
}

checkApp().catch(console.error);
