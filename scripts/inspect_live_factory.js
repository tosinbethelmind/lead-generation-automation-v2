const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://www.bethelmindanalytics.com/factory', { waitUntil: 'load' });
  await page.waitForTimeout(2000);

  // Click Tab 5 (Plant Pricing & Setup)
  const deployTab = page.locator('button:has-text("5. Plant Pricing"), button:has-text("Plant Pricing")');
  await deployTab.click();
  await page.waitForTimeout(1000);

  const text = await page.locator('body').innerText();
  console.log('--- TAB 5 (PRICING & SETUP) TEXT PREVIEW ---');
  console.log(text.substring(0, 800));
  console.log('-------------------------------------------');
  console.log('Includes 280,000:', text.includes('280,000'));
  console.log('Includes 140,000:', text.includes('140,000'));
  console.log('Includes 35,000:', text.includes('35,000'));
  console.log('Includes 0802 279 1227:', text.includes('0802 279 1227'));
  console.log('Includes 6805375225:', text.includes('6805375225'));
  await browser.close();
})();
