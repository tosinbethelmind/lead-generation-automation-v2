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
    await page.goto(url, { waitUntil: 'commit' });
    console.log('Committed. Waiting 5s...');
    await new Promise(r => setTimeout(r, 5000));
    
    // Extract listing items using route.ts logic
    const items = await page.$$eval('.b-list-advert-base', (els) => {
      return els.slice(0, 5).map(el => {
        const titleEl = el.querySelector('.b-advert-title-inner, .qa-advert-list-item-title, .qa-advert-title span');
        const priceEl = el.querySelector('.b-list-advert__price, .qa-advert-list-item-price, .b-list-advert-base__item-price');
        const areaEl = el.querySelector('.b-list-advert__region, .qa-advert-list-item-region, .b-list-advert-base__region');
        const href = el.getAttribute('href') || el.querySelector('a')?.getAttribute('href') || '';
        
        // Resolve absolute URL if relative
        let absoluteUrl = href;
        if (href && !href.startsWith('http')) {
          absoluteUrl = 'https://jiji.ng' + (href.startsWith('/') ? '' : '/') + href;
        }
        
        return {
          title: titleEl ? titleEl.textContent.trim() : '',
          price: priceEl ? priceEl.textContent.trim() : '',
          area: areaEl ? areaEl.textContent.trim().split(',')[0] : '',
          url: absoluteUrl
        };
      });
    });
    
    console.log('Extracted items:', JSON.stringify(items, null, 2));

  } catch (err) {
    console.error('Error during scrape:', err);
  } finally {
    await browser.close();
    console.log('Browser closed.');
  }
}

run();
