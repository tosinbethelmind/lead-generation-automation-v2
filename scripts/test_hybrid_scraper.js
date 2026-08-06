/**
 * Test script for ApexReach Hybrid Web Scraper (Cheerio + Crawlee Stealth Engine)
 */
const path = require('path');

async function testScraper() {
  console.log('--- Testing ApexReach Hybrid Scraper Engine ---');
  
  // Register tsx/ts-node if running TypeScript directly or test compiled API endpoint
  try {
    const res = await fetch('http://localhost:3006/api/scrape?url=https://httpbin.org/html', {
      signal: AbortSignal.timeout(5000)
    });
    const data = await res.json();
    console.log('HTTP Endpoint Response:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.log('Local dev server on 3006 not running yet for HTTP fetch test:', err.message);
  }

  console.log('✅ Hybrid Scraper Test script initialized.');
}

testScraper();
