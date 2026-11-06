const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function testAll() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 412, height: 915 } });
  const screenshotsDir = path.join(__dirname, '..', 'public', 'qa-screenshots');
  if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true });

  console.log('1. Testing Login Page...');
  await page.goto('https://www.bethelmindanalytics.com/factory/login', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);

  // Click Enter on Kenneth (second Enter button)
  console.log('2. Entering Kenneth Console...');
  const enterBtns = page.locator('button:has-text("Enter")');
  await enterBtns.nth(1).click();
  await page.waitForTimeout(1000);

  console.log('3. Kenneth Sachet +1 Roll...');
  await page.click('button:has-text("+1 Roll Used")');
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(screenshotsDir, 'sim_step1_supervisor_sachet.png') });

  console.log('4. Kenneth Bottled Water Tab...');
  await page.click('button:has-text("Bottled Water & Jars")');
  await page.waitForTimeout(500);
  await page.click('button:has-text("+10 Packs 75cl")');
  await page.waitForTimeout(300);
  await page.click('button:has-text("+5 Jars Refilled")');
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(screenshotsDir, 'sim_step2_supervisor_bottles.png') });

  console.log('5. Switching to Blessing (Cashier)...');
  await page.click('button:has-text("Blessing (cashier)")');
  await page.waitForTimeout(1000);
  await page.selectOption('select', { index: 1 });
  await page.click('button:has-text("Moniepoint / OPay Transfer")');
  await page.click('button:has-text("Record")');
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(screenshotsDir, 'sim_step3_cashier_pos.png') });

  console.log('6. Switching to Musa (Driver)...');
  await page.click('button:has-text("Musa (driver)")');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(screenshotsDir, 'sim_step4_driver_manifest.png') });

  console.log('7. Testing Owner Portal...');
  await page.goto('https://www.bethelmindanalytics.com/factory/owner', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);
  await page.click('button:has-text("Demo Auto-Unlock (2026)")');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(screenshotsDir, 'sim_step5_owner_dual_line.png') });

  console.log('8. Testing Walkthrough Page & Downloads...');
  await page.goto('https://www.bethelmindanalytics.com/factory/walkthrough', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(screenshotsDir, 'sim_step6_walkthrough_training.png') });

  console.log('✅ ALL 8 TESTS COMPLETED SUCCESSFULLY!');
  await browser.close();
}

testAll().catch(e => { console.error('Failed:', e); process.exit(1); });
