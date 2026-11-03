const fs = require('fs');
const { chromium } = require('playwright');

async function inspectSoftwareDropdowns() {
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
  await page.goto('https://jiji.ng/edit-free-ad-55797060.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);

  // Click "Switch to Software"
  const switchPrompt = await page.$('text="Switch to Software"');
  if (switchPrompt) {
    console.log('Clicking Switch to Software...');
    await switchPrompt.click();
    await page.waitForTimeout(3000);
  }

  // Find all multiselect dropdowns on page
  const dropdowns = await page.evaluate(() => {
    const list = Array.from(document.querySelectorAll('.fw-field, .b-create-ad-field'));
    return list.map(f => {
      const label = f.querySelector('label, .fw-field__label, .fw-label')?.innerText?.trim() || f.innerText.split('\n')[0];
      const input = f.querySelector('input');
      return {
        label,
        inputName: input ? input.name : null,
        inputId: input ? input.id : null,
        className: f.className
      };
    }).filter(f => f.label);
  });

  console.log('Form fields after switching to Software:');
  console.log(JSON.stringify(dropdowns, null, 2));

  await browser.close();
}

inspectSoftwareDropdowns().catch(console.error);
