const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3005;
const BASE_URL = `http://127.0.0.1:${PORT}`;
let spawnedProcess = null;

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Helper to probe if an HTTP server is listening on a given URL
async function probeServer(url) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      resolve(true);
    });
    req.on('error', () => {
      resolve(false);
    });
    req.setTimeout(1500, () => {
      req.destroy();
      resolve(false);
    });
    req.end();
  });
}

async function runTestRequest(endpoint, body) {
  const url = `${BASE_URL}${endpoint}`;
  console.log(`\n--------------------------------------------------`);
  console.log(`Sending POST to ${url}`);
  console.log(`Payload:`, JSON.stringify(body, null, 2));

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  console.log(`Status: ${response.status} ${response.statusText}`);
  const data = await response.json();
  console.log(`Response Data:`, JSON.stringify(data, null, 2));
  
  if (response.status !== 200) {
    throw new Error(`Request to ${endpoint} failed with status ${response.status}`);
  }
  return data;
}

async function main() {
  console.log('=== RUNNING FREE SCRAPER & OUTREACH INTEGRATION TESTS ===');

  // 0. Clean up local test DB for test isolation
  const dbPath = path.join(process.cwd(), 'local_db', 'leads_db.json');
  if (fs.existsSync(dbPath)) {
    console.log('Cleaning up existing local test database for isolation...');
    try {
      fs.unlinkSync(dbPath);
      console.log('Cleaned up leads_db.json.');
    } catch (err) {
      console.warn('Could not delete leads_db.json:', err.message);
    }
  }
  
  console.log(`Spawning Next.js dev server on port ${PORT}...`);
  spawnedProcess = spawn('npx', ['next', 'dev', '-p', String(PORT)], {
    shell: true,
    stdio: 'inherit'
  });

  // Ensure spawned process gets cleaned up if test crashes
  const cleanup = () => {
    if (spawnedProcess) {
      console.log('Shutting down spawned Next.js server...');
      spawnedProcess.kill('SIGINT');
      spawnedProcess = null;
    }
  };
  process.on('exit', cleanup);
  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);

  try {
    // Wait for server to boot
    console.log('Waiting for server to start responding...');
    const start = Date.now();
    let isUp = false;
    while (Date.now() - start < 40000) {
      isUp = await probeServer(`${BASE_URL}/`);
      if (isUp) break;
      await wait(1000);
    }

    if (!isUp) {
      throw new Error(`Failed to spin up dev server on port ${PORT}`);
    }
    console.log(`Spawned server is up on port ${PORT}!`);

    // TEST 1: Google Maps Free Scraper (Sandbox Mode)
    console.log('\n[TEST 1] Testing Google Maps Free Web Scraper (Playwright-based)...');
    const mapsFreeResult = await runTestRequest('/api/scrape/maps-free', {
      query: 'Dentists Surulere (mock)',
      limit: 2
    });
    if (!mapsFreeResult.success || mapsFreeResult.mode !== 'sandbox') {
      throw new Error('TEST 1 FAILED: Expected success: true and mode: sandbox');
    }
    console.log('✅ TEST 1 PASSED: Google Maps Free Sandbox scraping succeeded.');

    // TEST 2: DuckDuckGo Scraper (Sandbox Mode)
    console.log('\n[TEST 2] Testing DuckDuckGo Search Scraper (HTML Crawler-based)...');
    const ddgResult = await runTestRequest('/api/scrape/duckduckgo', {
      query: 'Car Dealers Lagos (mock)',
      limit: 2
    });
    if (!ddgResult.success || ddgResult.mode !== 'sandbox') {
      throw new Error('TEST 2 FAILED: Expected success: true and mode: sandbox');
    }
    console.log('✅ TEST 2 PASSED: DuckDuckGo Sandbox scraping succeeded.');

    // TEST 3: Jiji Scraper (Sandbox Mode)
    console.log('\n[TEST 3] Testing Jiji.ng Crawler Scraper...');
    const jijiScrapeResult = await runTestRequest('/api/scrape/jiji', {
      url: 'https://jiji.ng/lagos/cars-mock',
      limit: 2
    });
    if (!jijiScrapeResult.success || !jijiScrapeResult.leads || jijiScrapeResult.leads.length === 0) {
      throw new Error('TEST 3 FAILED: Expected success: true and non-empty leads array');
    }
    console.log('✅ TEST 3 PASSED: Jiji Sandbox scraping succeeded.');

    // Extract a lead ID generated in Jiji scrape
    const targetLeadId = jijiScrapeResult.leads[0].lead_id;
    console.log(`Extracted Jiji Lead ID for outreach test: ${targetLeadId}`);

    // TEST 4: Jiji Bulk messaging outreach (Simulation Mode)
    console.log('\n[TEST 4] Testing Jiji Messaging Outreach (Simulation Mode)...');
    const outreachResult = await runTestRequest('/api/jiji', {
      leadIds: [targetLeadId],
      dryRun: true
    });
    if (!outreachResult.success || outreachResult.mode !== 'simulation') {
      throw new Error('TEST 4 FAILED: Expected success: true and mode: simulation');
    }
    console.log('✅ TEST 4 PASSED: Jiji message dispatch simulation succeeded.');

    // TEST 5: Social Media Scrapers (Instagram, Facebook, TikTok Sandbox Mode)
    console.log('\n[TEST 5] Testing Social Media Scrapers (Instagram, Facebook, TikTok)...');
    
    const instagramResult = await runTestRequest('/api/scrape/social', {
      platform: 'instagram',
      query: 'boutique store (mock)',
      limit: 1
    });
    if (!instagramResult.success || instagramResult.leads.length === 0) {
      throw new Error('TEST 5 FAILED: Expected Instagram scraping success and leads returned');
    }
    console.log('✅ Instagram Scraper Sandbox completed successfully.');

    const facebookResult = await runTestRequest('/api/scrape/social', {
      platform: 'facebook',
      query: 'bakery shop (mock)',
      limit: 1
    });
    if (!facebookResult.success || facebookResult.leads.length === 0) {
      throw new Error('TEST 5 FAILED: Expected Facebook scraping success and leads returned');
    }
    console.log('✅ Facebook Scraper Sandbox completed successfully.');

    const tiktokResult = await runTestRequest('/api/scrape/social', {
      platform: 'tiktok',
      query: 'electronics gadget (mock)',
      limit: 1
    });
    if (!tiktokResult.success || tiktokResult.leads.length === 0) {
      throw new Error('TEST 5 FAILED: Expected TikTok scraping success and leads returned');
    }
    console.log('✅ TikTok Scraper Sandbox completed successfully.');
    console.log('✅ TEST 5 PASSED: All social media scraper sandboxes succeeded.');

    // Extract social lead IDs
    const socialLeadIds = [
      instagramResult.leads[0].lead_id,
      facebookResult.leads[0].lead_id,
      tiktokResult.leads[0].lead_id
    ];
    console.log(`Extracted Social Lead IDs for outreach test:`, socialLeadIds);

    // TEST 6: Social Outreach Bulk Messaging Campaign (Simulation Mode)
    console.log('\n[TEST 6] Testing Social Media Outreach Campaign (Simulation Mode)...');
    const socialOutreachResult = await runTestRequest('/api/social-outreach', {
      leadIds: socialLeadIds,
      dryRun: true
    });
    if (!socialOutreachResult.success || socialOutreachResult.mode !== 'simulation' || socialOutreachResult.results.length < 3) {
      throw new Error('TEST 6 FAILED: Expected success: true, mode: simulation, and 3 processed social leads');
    }
    console.log('✅ TEST 6 PASSED: Social outreach messaging campaign simulation succeeded.');

    console.log('\n==================================================');
    console.log('🎉 ALL FREE OPTIONS, JIJI, AND SOCIAL MEDIA PIPELINE TESTS PASSED SUCCESSFULLY!');
    console.log('==================================================');

  } catch (err) {
    console.error('\n❌ TEST SUITE FAILED:', err);
    process.exitCode = 1;
  } finally {
    cleanup();
    console.log('Done.');
    process.exit(process.exitCode || 0);
  }
}

main();
