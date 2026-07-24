import { GET as solarGET, POST as solarPOST } from '../src/app/api/solarquotepro-pipeline/route';
import { GET as lagosGET, POST as lagosPOST } from '../src/app/api/outreach/lagos10k/route';
import { POST as osmPOST } from '../src/app/api/scrape/osm/route';
import { NextRequest } from 'next/server';

async function runTests() {
  console.log('====================================================');
  console.log('🧪 Starting ApexReach Engine Verification Test Suite');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  // 1. SolarQuotePro Pipeline GET
  try {
    console.log('[Test 1/6] Testing SolarQuotePro GET (Status Check)...');
    const res = await solarGET();
    const json = await res.json();
    console.log('  Status Code:', res.status);
    console.log('  Success:', json.success);
    console.log('  Is Running:', json.isRunning);
    console.log('  Scraped Installers Count:', json.stats?.totalScrapedInstallers);
    if (res.status === 200 && json.success) {
      console.log('  ✅ Test 1 Passed!\n');
      passed++;
    } else {
      console.log('  ❌ Test 1 Failed!\n');
      failed++;
    }
  } catch (err: any) {
    console.error('  ❌ Test 1 Error:', err.message, '\n');
    failed++;
  }

  // 2. SolarQuotePro Pipeline POST
  try {
    console.log('[Test 2/6] Testing SolarQuotePro POST (Live Execution)...');
    const req = new NextRequest('http://localhost:3000/api/solarquotepro-pipeline', {
      method: 'POST',
      body: JSON.stringify({ once: true, dryRun: false }),
    });
    const res = await solarPOST(req);
    const json = await res.json();
    console.log('  Status Code:', res.status);
    console.log('  Success:', json.success);
    console.log('  Message:', json.message);
    if (res.status === 200 && json.success) {
      console.log('  ✅ Test 2 Passed!\n');
      passed++;
    } else {
      console.log('  ❌ Test 2 Failed!\n');
      failed++;
    }
  } catch (err: any) {
    console.error('  ❌ Test 2 Error:', err.message, '\n');
    failed++;
  }

  // 3. Lagos 10K B2B GET
  try {
    console.log('[Test 3/6] Testing Lagos 10K B2B GET (Status Check)...');
    const res = await lagosGET();
    const json = await res.json();
    console.log('  Status Code:', res.status);
    console.log('  Success:', json.success);
    console.log('  Is Running:', json.isRunning);
    console.log('  Total Lagos Leads:', json.stats?.totalLagosLeads);
    if (res.status === 200 && json.success) {
      console.log('  ✅ Test 3 Passed!\n');
      passed++;
    } else {
      console.log('  ❌ Test 3 Failed!\n');
      failed++;
    }
  } catch (err: any) {
    console.error('  ❌ Test 3 Error:', err.message, '\n');
    failed++;
  }

  // 4. Lagos 10K B2B POST
  try {
    console.log('[Test 4/6] Testing Lagos 10K B2B POST (Live Execution)...');
    const req = new NextRequest('http://localhost:3000/api/outreach/lagos10k', {
      method: 'POST',
      body: JSON.stringify({ dryRun: false }),
    });
    const res = await lagosPOST(req);
    const json = await res.json();
    console.log('  Status Code:', res.status);
    console.log('  Success:', json.success);
    console.log('  Message:', json.message);
    if (res.status === 200 && json.success) {
      console.log('  ✅ Test 4 Passed!\n');
      passed++;
    } else {
      console.log('  ❌ Test 4 Failed!\n');
      failed++;
    }
  } catch (err: any) {
    console.error('  ❌ Test 4 Error:', err.message, '\n');
    failed++;
  }

  // 5. OSM Scraper Sandbox Query
  try {
    console.log('[Test 5/6] Testing OSM Scraper Sandbox Query...');
    const req = new NextRequest('http://localhost:3000/api/scrape/osm', {
      method: 'POST',
      body: JSON.stringify({ query: 'Dentist Ikeja sandbox', limit: 2, bypassQueue: true }),
    });
    const res = await osmPOST(req);
    const json = await res.json();
    console.log('  Status Code:', res.status);
    console.log('  Success:', json.success);
    console.log('  Mode:', json.mode);
    console.log('  Leads Count:', json.leads?.length);
    if (res.status === 200 && json.success && json.leads?.length > 0) {
      console.log('  ✅ Test 5 Passed!\n');
      passed++;
    } else {
      console.log('  ❌ Test 5 Failed!\n');
      failed++;
    }
  } catch (err: any) {
    console.error('  ❌ Test 5 Error:', err.message, '\n');
    failed++;
  }

  // 6. Live Solar Lead Harvester Function
  try {
    console.log('[Test 6/6] Testing Direct Overpass Live Lead Harvester...');
    const { harvestLiveSolarLeads } = await import('../src/lib/liveLeadHarvester');
    const result = await harvestLiveSolarLeads();
    console.log('  Harvested Added:', result.added);
    console.log('  Total Solar Count:', result.totalSolar);
    console.log('  ✅ Test 6 Passed!\n');
    passed++;
  } catch (err: any) {
    console.error('  ❌ Test 6 Error:', err.message, '\n');
    failed++;
  }

  console.log('====================================================');
  console.log(`📊 TEST SUITE SUMMARY: ${passed}/${passed + failed} PASSED`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
