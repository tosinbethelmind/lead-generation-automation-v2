const { chromium } = require('playwright');

async function run() {
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();
  
  const url = 'https://jiji.ng/lekki/cars/mercedes-benz-sl-class-sl550-2dr-convertible-4-7l-8cyl-turbo-7a-2014-CoWViG9WkbQymxzOn2Uom7Ax.html';
  console.log('Navigating to detail page:', url);
  try {
    await page.goto(url, { waitUntil: 'commit', timeout: 30000 });
    console.log('Committed. Waiting 5s...');
    await new Promise(r => setTimeout(r, 5000));
    
    const title = await page.title();
    console.log('Detail Page Title:', title);
    
    // Dump script contents or selectors
    const html = await page.content();
    console.log('Page HTML size:', html.length);
    
    // Let's run the exact same logic as in route.ts
    const extracted = await page.evaluate(() => {
      let phone = '';
      let sellerName = '';

      // 1. Scan script tags
      const scripts = Array.from(document.querySelectorAll('script'));
      const scriptTypesAndIds = [];
      for (const s of scripts) {
        const content = s.textContent || '';
        const id = s.id || '';
        const type = s.getAttribute('type') || '';
        scriptTypesAndIds.push({ id, type, length: content.length });
        
        if (
          id === '__NUXT_DATA__' ||
          type === 'application/json' ||
          content.includes('__NUXT__') ||
          content.includes('whatsapp_url') ||
          content.includes('wa.me/') ||
          content.includes('phone')
        ) {
          const waMatch = content.match(/wa\.me\/(\d+)/) || content.match(/wa\.me%2F(\d+)/);
          if (waMatch && waMatch[1]) {
            phone = waMatch[1];
            break;
          }
          const phoneMatch = content.match(/"phone"\s*:\s*"(\+?\d+)"/);
          if (phoneMatch && phoneMatch[1]) {
            phone = phoneMatch[1];
            break;
          }
          const waUrlMatch = content.match(/"whatsapp_url"\s*:\s*"([^"]+)"/);
          if (waUrlMatch && waUrlMatch[1]) {
            const decoded = decodeURIComponent(waUrlMatch[1]);
            const waMatch2 = decoded.match(/wa\.me\/(\d+)/);
            if (waMatch2 && waMatch2[1]) {
              phone = waMatch2[1];
              break;
            }
          }
        }
      }

      // 2. DOM element search
      const waEl = document.querySelector('a[href*="wa.me"], a[href*="whatsapp.com"]');
      const waHref = waEl ? waEl.getAttribute('href') : null;
      
      const telEl = document.querySelector('a[href^="tel:"]');
      const telHref = telEl ? telEl.getAttribute('href') : null;

      const sellerEl = document.querySelector('.b-seller-block__name, .qa-seller-name, [class*="seller-name"]');
      sellerName = sellerEl ? sellerEl.textContent.trim() : '';

      return { phone, sellerName, scriptTypesAndIds, waHref, telHref };
    });

    console.log('Extracted:', JSON.stringify(extracted, null, 2));

    // Try interactive reveal click
    const showContactBtn = await page.$('.qa-show-contact, [class*="phone"], [class*="show-contact"]');
    console.log('Found show contact button:', !!showContactBtn);
    if (showContactBtn) {
      const btnText = await showContactBtn.textContent();
      console.log('Button text:', btnText.trim());
      
      await showContactBtn.click({ force: true });
      console.log('Clicked. Waiting 2s...');
      await new Promise(r => setTimeout(r, 2000));
      
      const phoneText = await page.$eval('[class*="phone-number"], [href^="tel:"], .qa-phone-number', (el) => el.textContent.trim()).catch(() => 'NOT FOUND');
      console.log('Revealed Phone Text:', phoneText);
    }

  } catch (err) {
    console.error('Error during detail scrape:', err);
  } finally {
    await browser.close();
    console.log('Browser closed.');
  }
}

run();
