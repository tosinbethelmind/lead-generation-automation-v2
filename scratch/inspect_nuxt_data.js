const { chromium } = require('playwright');
const fs = require('fs');

async function run() {
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();
  
  const url = 'https://jiji.ng/lekki/cars/toyota-camry-le-4dr-sedan-2-5l-4cyl-6am-2010-silver-iMorBCgdatRvtuFnjFh7Hw4o.html';
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
        if (telMatch) results.telMatch = telMatch.slice(0, 10);
        
        // Let's get a few pieces of text
        results.snippet = text.substring(0, 2000);
      } else {
        results.nuxtDataFound = false;
      }
      
      // Dump all scripts types
      results.scripts = Array.from(document.querySelectorAll('script')).map(s => ({
        id: s.id,
        type: s.type,
        src: s.src,
        length: (s.textContent || '').length
      }));
      
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
