const { chromium } = require('playwright');

async function run() {
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();
  
  const url = 'https://jiji.ng/lekki/cars/new-zeekr-9x-2025-black-dzvoCkSIxZjxdylmSMG6NLLH.html';
  console.log('Navigating to', url);
  try {
    await page.goto(url, { waitUntil: 'commit', timeout: 60000 });
    console.log('Committed. Waiting 5s...');
    await page.waitForTimeout(5000);
    
    const pageData = await page.evaluate(() => {
      const results = {};
      const nuxtDataScript = document.getElementById('__NUXT_DATA__');
      if (nuxtDataScript) {
        results.nuxtDataFound = true;
        const text = nuxtDataScript.textContent || '';
        results.nuxtDataLength = text.length;
        
        // Find phone numbers or whatsapp
        const waMatch = text.match(/wa\.me\/(\d+)/) || text.match(/wa\.me%2F(\d+)/);
        if (waMatch) results.waMatch = waMatch[0];
        
        const telMatch = text.match(/"phone"\s*:\s*"([^"]+)"|"\+?\d{10,14}"/g);
        if (telMatch) results.telMatch = telMatch;
        
        results.hasWaLinkInText = text.includes('wa.me') || text.includes('whatsapp');
      } else {
        results.nuxtDataFound = false;
      }
      
      const waEl = document.querySelector('a[href*="wa.me"], a[href*="whatsapp.com"]');
      if (waEl) {
        results.waLink = waEl.getAttribute('href');
      }

      const telEl = document.querySelector('a[href^="tel:"]');
      if (telEl) {
        results.telLink = telEl.getAttribute('href');
      }

      const showBtn = document.querySelector('.qa-show-contact, .js-show-contact, .b-show-contact');
      if (showBtn) {
        results.hasShowContactButton = true;
        results.showContactOuterHTML = showBtn.outerHTML;
      }

      return results;
    });

    console.log('Inspection Details:', JSON.stringify(pageData, null, 2));

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await browser.close();
    console.log('Browser closed.');
  }
}

run();
