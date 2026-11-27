const { chromium } = require('playwright');
const fs = require('fs');

async function scrapeJijiCompetitors() {
  const queries = [
    'website design',
    'mobile app development',
    'pos software inventory',
    'solar inverter load',
    'school management software'
  ];

  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--disable-blink-features=AutomationControlled', '--no-sandbox']
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 900 }
  });

  // Bandwidth protection: abort fonts, media, tracking scripts
  await context.route('**/*', (route) => {
    const type = route.request().resourceType();
    const url = route.request().url();
    if (['font', 'media'].includes(type) || url.includes('google-analytics') || url.includes('facebook') || url.includes('criteo') || url.includes('clarity')) {
      return route.abort();
    }
    return route.continue();
  });

  const page = await context.newPage();
  const allResults = {};

  for (const q of queries) {
    const searchUrl = `https://jiji.ng/search?query=${encodeURIComponent(q)}`;
    console.log(`\n--- Searching Jiji for: "${q}" ---`);
    try {
      await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 35000 });
      await page.waitForTimeout(3000);

      const items = await page.evaluate(() => {
        const cards = [];
        // Look for ad cards
        document.querySelectorAll('.b-list-advert__item, .qa-advert-list-item, div.b-list-advert-base').forEach(el => {
          const title = el.querySelector('.b-advert-title-inner, .qa-advert-title, .b-list-advert-base__item-title')?.innerText?.trim();
          const price = el.querySelector('.qa-advert-price, .b-list-advert-base__item-price')?.innerText?.trim();
          const location = el.querySelector('.b-list-advert-base__item-region, .qa-advert-region')?.innerText?.trim();
          const desc = el.querySelector('.b-list-advert-base__description-text')?.innerText?.trim();
          const isTop = el.innerText.includes('TOP') || el.innerText.includes('BOOST') || el.innerText.includes('VIP');
          const isVerified = el.innerText.includes('VERIFIED');
          const badge = isTop ? 'TOP/BOOST' : (isVerified ? 'VERIFIED' : 'ORGANIC');
          
          if (title) {
            cards.push({ title, price, location, desc, badge });
          }
        });
        return cards.slice(0, 8);
      });

      console.log(`Found ${items.length} top listings for "${q}":`);
      items.forEach((it, idx) => {
        console.log(`[${idx+1}] [${it.badge}] ${it.title} | ${it.price} | ${it.location}`);
      });
      allResults[q] = items;
    } catch (err) {
      console.error(`Error searching "${q}":`, err.message);
    }
    await page.waitForTimeout(2000);
  }

  await browser.close();
  fs.writeFileSync('local_db/jiji_competitor_research.json', JSON.stringify(allResults, null, 2), 'utf8');
  console.log('\nResults saved to local_db/jiji_competitor_research.json');
}

scrapeJijiCompetitors().catch(console.error);
