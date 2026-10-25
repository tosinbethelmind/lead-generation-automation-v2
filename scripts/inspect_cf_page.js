const { chromium } = require('playwright');

async function inspectPage() {
  const SESSION_FILE = 'local_db/nairaland_session.json';
  const browser = await chromium.launch({
    headless: true,
    args: ['--disable-blink-features=AutomationControlled', '--no-sandbox']
  });

  const context = await browser.newContext({
    storageState: SESSION_FILE,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
  });

  const page = await context.newPage();
  await page.goto('https://www.nairaland.com/newtopic?board=15', { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
  
  console.log('Title:', await page.title());
  console.log('URL:', page.url());
  console.log('Frames count:', page.frames().length);
  for (const f of page.frames()) {
    console.log('Frame URL:', f.url());
  }
  
  const content = await page.content();
  console.log('Page content length:', content.length);
  console.log('Contains cf-turnstile?:', content.includes('turnstile'));
  console.log('Contains iframe?:', content.includes('<iframe'));
  
  // Find all elements on the page
  const elements = await page.$$eval('*', els => els.map(e => ({ tag: e.tagName, id: e.id, class: e.className })).filter(e => e.id || e.class));
  console.log('Elements with id or class:', JSON.stringify(elements.slice(0, 25), null, 2));

  await browser.close();
}

inspectPage().catch(console.error);
