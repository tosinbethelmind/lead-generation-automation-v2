const { chromium } = require('playwright');

async function run() {
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();
  
  const url = 'https://jiji.ng/lagos/cars';
  console.log('Navigating to', url);
  try {
    // Go to URL and wait only for the HTML commit
    await page.goto(url, { waitUntil: 'commit' });
    console.log('Navigation committed. Waiting 5 seconds for content...');
    await new Promise(r => setTimeout(r, 5000));
    
    // Check if we are blocked by Cloudflare
    const title = await page.title();
    console.log('Page Title:', title);
    if (title.includes('Cloudflare') || title.includes('Attention Required')) {
      console.log('Blocked by Cloudflare protection.');
    }

    const selectors = [
      'a',
      'a[href*=".html"]',
      '.b-list-advert-base',
      '.b-list-advert__item-wrapper',
      '.qa-advert-list-item',
      '.qa-advert-title span',
      '.b-advert-title-inner',
      '.qa-advert-list-item-title',
      'h4',
      '.b-list-advert__price',
      '.b-list-advert__region'
    ];
    
    for (const selector of selectors) {
      const count = await page.locator(selector).count();
      console.log(`Count for selector "${selector}":`, count);
    }

    // Dump sample listing elements
    const samples = await page.locator('a[href*=".html"]').evaluateAll(anchors => {
      return anchors.slice(0, 5).map(a => {
        return {
          href: a.getAttribute('href'),
          html: a.innerHTML.substring(0, 200)
        };
      });
    });
    console.log('Sample links:', JSON.stringify(samples, null, 2));

  } catch (err) {
    console.error('Error during scrape:', err);
  } finally {
    await browser.close();
    console.log('Browser closed.');
  }
}

run();
