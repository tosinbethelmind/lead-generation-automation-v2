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
    await page.goto(url, { waitUntil: 'commit' });
    console.log('Committed. Waiting 5s...');
    await page.waitForTimeout(5000);
    
    const pageData = await page.evaluate(() => {
      const results = {
        scripts: [],
        waLink: null,
        telLink: null,
        hasShowContactButton: false,
        showContactOuterHTML: null
      };

      // Get script contents
      const scripts = Array.from(document.querySelectorAll('script'));
      for (const s of scripts) {
        const text = s.textContent || '';
        if (text.includes('__NUXT__')) {
          results.scripts.push(text.substring(0, 1000) + '... [TRUNCATED] ...' + text.substring(text.length - 1000));
          // Search for phone numbers or whatsapp
          const matches = text.match(/"phone"\s*:\s*"([^"]+)"|wa\.me\/(\d+)|"user_phones"\s*:\s*([^,\]]+)/g);
          if (matches) {
            results.nuxtMatches = matches;
          }
        }
      }

      // Check for wa link
      const waEl = document.querySelector('a[href*="wa.me"], a[href*="whatsapp.com"]');
      if (waEl) {
        results.waLink = waEl.getAttribute('href');
      }

      // Check for tel link
      const telEl = document.querySelector('a[href^="tel:"]');
      if (telEl) {
        results.telLink = telEl.getAttribute('href');
      }

      // Check for show contact button
      const showBtn = document.querySelector('.qa-show-contact, .js-show-contact, .b-show-contact');
      if (showBtn) {
        results.hasShowContactButton = true;
        results.showContactOuterHTML = showBtn.outerHTML;
      }

      return results;
    });

    console.log('Page Inspection Details:', JSON.stringify(pageData, null, 2));

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await browser.close();
    console.log('Browser closed.');
  }
}

run();
