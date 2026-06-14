const { chromium } = require('playwright');

async function run() {
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();
  
  const url = 'https://jiji.ng/ikeja/cars/honda-ridgeline-rts-2008-black-zTx7xvbiRAL15rBTr5XYp0T5.html';
  console.log('Navigating to', url);
  try {
    await page.goto(url, { waitUntil: 'commit' });
    console.log('Committed. Waiting 5s...');
    await page.waitForTimeout(5000);
    
    const extracted = await page.evaluate(() => {
      const results = {};

      // 1. Try to find the phone number in window.__NUXT__ or JS variables
      try {
        const scripts = Array.from(document.querySelectorAll('script'));
        for (const s of scripts) {
          const content = s.textContent || '';
          if (content.includes('__NUXT__') || content.includes('whatsapp_url')) {
            results.nuxtFound = true;
            // Look for phone or whatsapp_url pattern
            const waMatch = content.match(/wa\.me\/(\d+)/);
            if (waMatch) {
              results.phoneFromNuxtWa = waMatch[1];
            }
            const phoneMatch = content.match(/"phone":"(\+?\d+)"/);
            if (phoneMatch) {
              results.phoneFromNuxtState = phoneMatch[1];
            }
          }
        }
      } catch (e) {
        results.nuxtError = e.message;
      }

      // 2. Try to find from DOM whatsapp elements
      try {
        const waEl = document.querySelector('a[href*="wa.me"], a[href*="whatsapp.com"]');
        if (waEl) {
          results.waHref = waEl.getAttribute('href');
          const match = results.waHref.match(/phone=(\d+)|wa\.me\/(\d+)|wa\.me\/(\+\d+)/);
          if (match) {
            results.phoneFromWaHref = match[1] || match[2] || match[3];
          }
        }
      } catch (e) {
        results.waError = e.message;
      }

      // 3. Try to get seller name
      try {
        const sellerEl = document.querySelector('.b-seller-block__name, .qa-seller-name, [class*="seller-name"]');
        results.sellerName = sellerEl ? sellerEl.textContent.trim() : null;
      } catch (e) {
        results.sellerNameError = e.message;
      }

      return results;
    });

    console.log('Extracted Details:', JSON.stringify(extracted, null, 2));

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await browser.close();
    console.log('Browser closed.');
  }
}

run();
