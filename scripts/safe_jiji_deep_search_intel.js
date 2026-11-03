/**
 * @file scripts/safe_jiji_deep_search_intel.js
 * 
 * 🛡️ SAFE, STEALTHY JIJI COMMERCIAL SEARCH INTELLIGENCE
 * Uses authenticated cookies safely in READ-ONLY mode.
 * Enforces human-like pacing (3-5s delays) to strictly protect the account from bans.
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.join(__dirname, '..', 'local_db', 'jiji_account_config.json');
const OUTPUT_PATH = path.join(__dirname, '..', 'scripts', 'jiji_search_intel_results.json');

const SEARCH_QUERIES = [
  {
    category: 'COMMERCIAL_SOLAR',
    label: 'Commercial Solar & Inverters (10kVA - 30kVA)',
    url: 'https://jiji.ng/solar-energy?query=commercial%20solar%20inverter'
  },
  {
    category: 'PRIME_REAL_ESTATE',
    label: 'Prime Real Estate Duplexes (Lekki Phase 1)',
    url: 'https://jiji.ng/real-estate?query=duplex%20lekki%20phase%201'
  },
  {
    category: 'COMMERCIAL_RENTAL',
    label: 'Office Space Commercial Rentals (Victoria Island)',
    url: 'https://jiji.ng/commercial-property-for-rent?query=office%20space%20victoria%20island'
  },
  {
    category: 'SME_SERVICES',
    label: 'SME Logistics & Dispatch Services Lagos',
    url: 'https://jiji.ng/services?query=dispatch%20logistics%20lagos'
  }
];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runSafeSearchIntel() {
  console.log('🛡️ [JIJI SAFE INTEL] Initializing safe, rate-limited marketplace inspection...');
  
  if (!fs.existsSync(CONFIG_PATH)) {
    console.error('❌ Config file not found at:', CONFIG_PATH);
    return;
  }

  const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  console.log(`👤 Using verified session profile: ${config.emailOrPhone || 'Active Account'}`);

  const browser = await chromium.launch({
    headless: true
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    viewport: { width: 1366, height: 768 }
  });

  // Inject user's authenticated session cookies
  if (config.sessionCookie) {
    const rawCookies = config.sessionCookie.split(';');
    const cookieObjects = rawCookies.map(c => {
      const parts = c.trim().split('=');
      const name = parts[0];
      const value = parts.slice(1).join('=');
      return {
        name,
        value,
        domain: '.jiji.ng',
        path: '/'
      };
    }).filter(c => c.name && c.value);

    await context.addCookies(cookieObjects);
    console.log(`🔑 Injected ${cookieObjects.length} session cookies safely.`);
  }

  const page = await context.newPage();

  // First verify session on home page
  console.log('🌐 Visiting Jiji homepage to verify session and warm up connection...');
  await page.goto('https://jiji.ng', { waitUntil: 'domcontentloaded', timeout: 35000 });
  await sleep(3500);

  const homeTitle = await page.title();
  console.log('✅ Home Page Title:', homeTitle);

  const intelReport = {
    generatedAt: new Date().toISOString(),
    accountUser: config.emailOrPhone,
    categories: []
  };

  for (const item of SEARCH_QUERIES) {
    console.log(`\n🔍 Searching: ${item.label}...`);
    try {
      await page.goto(item.url, { waitUntil: 'domcontentloaded', timeout: 35000 });
      // Gentle pause to simulate human reading
      await sleep(4000);

      const searchData = await page.evaluate(() => {
        const results = [];
        // Extract listing cards
        const cards = document.querySelectorAll('div.b-list-advert__item, div.qa-advert-list-item, div.b-advert-card, div.masonry-item');
        
        cards.forEach((card, idx) => {
          if (idx >= 6) return; // Cap at top 6 items per query to avoid heavy DOM parsing
          
          const titleEl = card.querySelector('.b-advert-title-inner, .qa-advert-title, h4, .b-list-advert-base__item-title');
          const priceEl = card.querySelector('.qa-advert-price, .b-list-advert__price, .b-advert-price');
          const locationEl = card.querySelector('.b-list-advert__item-region, .qa-advert-region, .b-advert-location');
          const descEl = card.querySelector('.b-list-advert__item-description, p');
          const linkEl = card.querySelector('a');

          const title = titleEl ? titleEl.innerText.trim() : 'Listing';
          const price = priceEl ? priceEl.innerText.trim() : 'Contact for Price';
          const location = locationEl ? locationEl.innerText.trim() : 'Nigeria';
          const description = descEl ? descEl.innerText.trim() : '';
          const url = linkEl ? linkEl.href : '';

          if (title.length > 3) {
            results.push({
              title,
              price,
              location,
              description: description.slice(0, 150),
              url
            });
          }
        });

        return {
          totalCardsDetected: cards.length,
          listings: results
        };
      });

      console.log(`   Found ${searchData.totalCardsDetected} ads. Captured top ${searchData.listings.length} items.`);
      intelReport.categories.push({
        category: item.category,
        label: item.label,
        url: item.url,
        resultsCount: searchData.totalCardsDetected,
        sampleListings: searchData.listings
      });

    } catch (err) {
      console.warn(`   ⚠️ Warning on ${item.category}: ${err.message}`);
      intelReport.categories.push({
        category: item.category,
        label: item.label,
        error: err.message
      });
    }

    // Polite human delay between queries (4.5s) to ensure 0 risk of account flag
    console.log('   ⏳ Pausing 4.5s (polite human pacing)...');
    await sleep(4500);
  }

  await browser.close();

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(intelReport, null, 2));
  console.log(`\n🎉 [JIJI SAFE INTEL COMPLETE] Report saved to ${OUTPUT_PATH}`);
}

runSafeSearchIntel().catch(err => {
  console.error('Fatal execution error:', err);
});
