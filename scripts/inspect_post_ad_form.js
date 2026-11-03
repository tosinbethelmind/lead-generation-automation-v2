const { chromium } = require('playwright');

async function inspectForm() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 800 }
  });

  const page = await context.newPage();
  console.log('Navigating to https://jiji.ng/add-free-ad.html ...');
  await page.goto('https://jiji.ng/add-free-ad.html', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(4000);

  const elements = await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll('input, button, select, div[class*="select"], div[class*="category"], div[class*="region"], div[class*="location"]')).map(el => {
      return {
        tag: el.tagName,
        className: el.className,
        placeholder: el.getAttribute('placeholder'),
        name: el.getAttribute('name'),
        type: el.getAttribute('type'),
        text: (el.innerText || '').slice(0, 50),
        qa: el.getAttribute('data-qa')
      };
    });
    return inputs;
  });

  console.log('Found elements:', JSON.stringify(elements, null, 2));
  await browser.close();
}

inspectForm().catch(console.error);
