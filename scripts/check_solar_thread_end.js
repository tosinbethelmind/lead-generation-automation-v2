const { chromium } = require('playwright');
const path = require('path');
const sessionFile = path.join(__dirname, '..', 'local_db', 'nairaland_session.json');

(async () => {
  const browser = await chromium.launch({ headless: false, args: ['--disable-blink-features=AutomationControlled', '--no-sandbox'] });
  const context = await browser.newContext({ storageState: sessionFile });
  const page = await context.newPage();
  await page.goto('https://www.nairaland.com/8769845/stop-overpaying-solar-installers-lagos', { waitUntil: 'domcontentloaded' });
  const text = await page.innerText('body');
  console.log('Thread text length:', text.length);
  console.log('Includes Bethelsolution:', text.includes('Bethelsolution'));
  console.log('Includes "Practical Sizing":', text.includes('Practical Sizing'));
  console.log('End of thread text snippet:\n', text.slice(-500));
  await browser.close();
})();
