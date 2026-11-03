const fs = require('fs');
const { chromium } = require('playwright');

async function inspectDropdownOptions() {
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
  await page.goto('https://jiji.ng/edit-free-ad-55777070.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);

  // Switch to Software
  const catBox = await page.$('.b-category-section__category-select, .qa-choose-category');
  if (catBox) {
    await catBox.click();
    await page.waitForTimeout(1000);
    const elec = await page.$('.multiselect__option:has-text("Electronics"), span:has-text("Electronics")');
    if (elec) {
      await elec.click();
      await page.waitForTimeout(1500);
      const soft = await page.$('.multiselect__option:has-text("Software"), span:has-text("Software")');
      if (soft) {
        await soft.click();
        await page.waitForTimeout(2000);
      }
    }
  }

  // Click submit to highlight all errors
  const submitBtn = await page.$('#submit_button, button.qa-submit-button, button[type="submit"]');
  if (submitBtn) {
    await submitBtn.click();
    await page.waitForTimeout(1000);
  }

  // Find all fw-selection elements
  const selections = await page.$$('.fw-selection, .multiselect');
  console.log('Selection elements found:', selections.length);

  for (let i = 0; i < selections.length; i++) {
    const s = selections[i];
    const text = await s.innerText();
    console.log(`\nSelection ${i + 1} text: "${text.replace(/\n/g, ' ')}"`);
    
    // Click it to open dropdown
    await s.click();
    await page.waitForTimeout(1000);
    
    const options = await page.evaluate(() => {
      const opts = document.querySelectorAll('.multiselect__option, .fw-select__option, li[role="option"]');
      return Array.from(opts).map(o => o.innerText.trim()).filter(Boolean);
    });
    console.log('Available options:', options.slice(0, 10));
    
    // Click outside or press Escape
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
  }

  await browser.close();
}

inspectDropdownOptions().catch(console.error);
