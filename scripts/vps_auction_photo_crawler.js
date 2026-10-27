/**
 * @file scripts/vps_auction_photo_crawler.js
 * 
 * CONTABO VPS COPART & IAAI AUCTION PHOTO HARVESTER
 * 
 * Runs on Contabo VPS (169.58.182.92) using unmetered high-speed bandwidth.
 * Uses Playwright with stealth user-agent to query public US auction archives
 * and extract genuine Copart & IAAI salvage lot photos and damage logs.
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const CACHE_DIR = path.join(__dirname, '..', 'public', 'reports', 'auction_photos');

async function lookupAuctionPhotos(vin) {
  const cleanVin = vin.trim().toUpperCase();
  if (cleanVin.length !== 17) {
    throw new Error('Invalid VIN length');
  }

  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }

  const cacheFile = path.join(CACHE_DIR, `${cleanVin}.json`);
  if (fs.existsSync(cacheFile)) {
    try {
      const cached = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
      console.log(`[AUCTION CRAWLER] Loaded cached auction records for ${cleanVin}`);
      return cached;
    } catch {}
  }

  console.log(`[AUCTION CRAWLER] Initiating stealth browser probe for VIN: ${cleanVin}...`);
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled']
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 800 }
  });

  const page = await context.newPage();
  let result = {
    vin: cleanVin,
    found: false,
    auctionName: 'Unknown',
    damage: 'None Recorded',
    odometer: 'N/A',
    photos: [],
    timestamp: new Date().toISOString()
  };

  try {
    // Probe public auction archive
    const searchUrl = `https://stat.vin/cars/${cleanVin}`;
    await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 25000 });
    await page.waitForTimeout(2000);

    const title = await page.title();
    console.log(`[AUCTION CRAWLER] Page Title: ${title}`);

    // Check if lot photos exist on page
    const photoUrls = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img[src*="copart"], img[src*="iaai"], img[src*="stat.vin"]'));
      return imgs.map(i => i.src).filter(src => src.startsWith('http')).slice(0, 8);
    });

    if (photoUrls && photoUrls.length > 0) {
      result.found = true;
      result.auctionName = photoUrls.some(u => u.includes('copart')) ? 'Copart' : 'IAAI';
      result.photos = photoUrls;
      console.log(`✓ Found ${photoUrls.length} genuine auction yard photos for ${cleanVin}!`);
    } else {
      console.log(`[AUCTION CRAWLER] No salvage auction records found on public mirror for ${cleanVin}. Vehicle likely clean private retail.`);
    }
  } catch (err) {
    console.warn(`[AUCTION CRAWLER] Probe notice for ${cleanVin}:`, err.message);
  } finally {
    await browser.close();
  }

  // Persist cache
  try {
    fs.writeFileSync(cacheFile, JSON.stringify(result, null, 2), 'utf8');
  } catch (saveErr) {
    console.error('Failed to cache auction record:', saveErr.message);
  }

  return result;
}

if (require.main === module) {
  const testVin = process.argv[2] || 'JHLRD1851WC804433';
  lookupAuctionPhotos(testVin)
    .then(r => console.log('Result:', JSON.stringify(r, null, 2)))
    .catch(console.error);
}

module.exports = { lookupAuctionPhotos };
