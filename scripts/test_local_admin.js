const { chromium } = require('playwright');

async function testLocal() {
  console.log('Testing http://localhost:3006/admin/mobile?pillar=pillar2 ...');
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];

  page.on('pageerror', err => errors.push(err.message));
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  await page.context().addCookies([{
    name: 'admin-token',
    value: 'bethelmind_admin_2026',
    domain: 'localhost',
    path: '/'
  }]);

  await page.goto('http://localhost:3006/admin/mobile?pillar=pillar2', {
    waitUntil: 'domcontentloaded',
    timeout: 25000
  });

  await page.waitForTimeout(4000);

  const btns = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button')).map(b => b.innerText.trim().slice(0, 30));
  });

  const links = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a')).map(a => ({
      text: a.innerText.trim().slice(0, 30),
      href: a.getAttribute('href')
    }));
  });

  console.log('Page URL:', page.url());
  console.log('Errors:', errors);
  console.log(`Total Buttons: ${btns.length}`);
  console.log('Sample Buttons:', btns.slice(0, 15));
  console.log(`Total Links: ${links.length}`);
  console.log('Sample Links:', links.slice(0, 10));

  await browser.close();
}

testLocal().catch(console.error);
