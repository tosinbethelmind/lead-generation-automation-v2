const { chromium } = require('playwright');

function normalizePhone(phone, countryCode) {
  let cleaned = phone.replace(/\D/g, '');
  if (!cleaned) return '';
  if (countryCode === 'NG') {
    if (cleaned.startsWith('234')) {
      return '+' + cleaned;
    }
    if (cleaned.startsWith('0')) {
      return '+234' + cleaned.slice(1);
    }
    if (cleaned.length === 10) {
      return '+234' + cleaned;
    }
  }
  return '+' + cleaned;
}

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
    await page.goto(url, { waitUntil: 'commit', timeout: 30000 });
    await page.waitForTimeout(5000);
    
    // Extract listing items
    const items = await page.$$eval('.b-list-advert-base', (els) => {
      return els.slice(0, 2).map(el => {
        const href = el.getAttribute('href') || el.querySelector('a')?.getAttribute('href') || '';
        let absoluteUrl = href;
        if (href && !href.startsWith('http')) {
          absoluteUrl = 'https://jiji.ng' + (href.startsWith('/') ? '' : '/') + href;
        }
        return {
          title: el.textContent.trim().substring(0, 30),
          url: absoluteUrl
        };
      });
    });
    
    console.log('Found listings:', items);
    
    for (const item of items) {
      if (!item.url) continue;
      console.log(`\n--- Inspecting listing: "${item.title}" ---`);
      console.log(`URL: ${item.url}`);
      
      const detailPage = await context.newPage();
      try {
        await detailPage.goto(item.url, { waitUntil: 'commit', timeout: 30000 });
        console.log('[Step 1] Navigated to detail page. Waiting 5s...');
        await detailPage.waitForTimeout(5000);
        
        // 1. Scan script tags
        const scriptContent = await detailPage.evaluate(() => {
          const scripts = Array.from(document.querySelectorAll('script'));
          for (const s of scripts) {
            const content = s.textContent || '';
            const id = s.id || '';
            const type = s.getAttribute('type') || '';
            if (
              id === '__NUXT_DATA__' ||
              type === 'application/json' ||
              content.includes('__NUXT__') ||
              content.includes('whatsapp_url') ||
              content.includes('wa.me/') ||
              content.includes('phone')
            ) {
              return {
                id,
                type,
                length: content.length,
                hasWa: content.includes('wa.me/'),
                content: content.substring(0, 1000) // snippet
              };
            }
          }
          return null;
        });
        
        console.log('[Step 2] Script content matched:', scriptContent ? { id: scriptContent.id, type: scriptContent.type, length: scriptContent.length, hasWa: scriptContent.hasWa } : 'null');
        
        const extracted = await detailPage.evaluate(() => {
          let phone = '';
          let sellerName = '';
          
          const scripts = Array.from(document.querySelectorAll('script'));
          for (const s of scripts) {
            const content = s.textContent || '';
            const id = s.id || '';
            const type = s.getAttribute('type') || '';
            if (
              id === '__NUXT_DATA__' ||
              type === 'application/json' ||
              content.includes('__NUXT__') ||
              content.includes('whatsapp_url') ||
              content.includes('wa.me/') ||
              content.includes('phone')
            ) {
              // Extract from wa.me
              const waMatch = content.match(/wa\.me\/(\d+)/) || content.match(/wa\.me%2F(\d+)/);
              if (waMatch && waMatch[1]) {
                phone = waMatch[1];
                break;
              }
              // Extract from "phone":"..."
              const phoneMatch = content.match(/"phone"\s*:\s*"(\+?\d+)"/);
              if (phoneMatch && phoneMatch[1]) {
                phone = phoneMatch[1];
                break;
              }
            }
          }
          
          // Fallback to wa.me link in DOM
          if (!phone) {
            const waEl = document.querySelector('a[href*="wa.me"], a[href*="whatsapp.com"]');
            if (waEl) {
              const href = waEl.getAttribute('href') || '';
              const match = href.match(/phone=(\d+)|wa\.me\/(\d+)/);
              if (match) {
                phone = match[1] || match[2];
              }
            }
          }
          
          // Seller name
          const sellerEl = document.querySelector('.b-seller-block__name, .qa-seller-name, [class*="seller-name"]');
          if (sellerEl) {
            sellerName = sellerEl.textContent.trim();
          }
          
          return { phone, sellerName };
        });
        
        console.log('[Step 3] Initial evaluation result:', extracted);
        
        let phone = extracted.phone || '';
        let sellerName = extracted.sellerName || 'Unknown';
        
        if (!phone) {
          console.log('[Step 4] Phone is empty. Trying interactive click reveal...');
          try {
            const revealButton = await detailPage.$('.qa-show-contact, [class*="phone"], [class*="show-contact"]');
            if (revealButton) {
              console.log('Found reveal button. Clicking...');
              await revealButton.click({ force: true, timeout: 5000 });
              await detailPage.waitForTimeout(1000);
              phone = await detailPage.$eval('[class*="phone-number"], [href^="tel:"], .qa-phone-number', (el) => el.textContent.trim()).catch(() => '');
              console.log('Result after click:', phone);
            } else {
              console.log('No reveal button found.');
            }
          } catch (clickErr) {
            console.log('Click reveal error:', clickErr.message);
          }
        }
        
        console.log(`[Result] Seller: ${sellerName}, Phone (raw): ${phone}, Phone (normalized): ${normalizePhone(phone, 'NG')}`);
        
      } catch (err) {
        console.error(`Error processing details page:`, err);
      } finally {
        await detailPage.close();
      }
    }
    
  } catch (err) {
    console.error('Error in main block:', err);
  } finally {
    await browser.close();
    console.log('Browser closed.');
  }
}

run();
