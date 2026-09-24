/**
 * @file scripts/test_sector_tools_api_route.ts
 * Tests the /api/sector-tools Next.js route handler directly.
 */

import { POST, GET } from '../src/app/api/sector-tools/route';
import { NextRequest } from 'next/server';

async function testApiRoute() {
  console.log('================================================================');
  console.log('🌐 TESTING /api/sector-tools ROUTE HANDLER DIRECTLY');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, desc: string) {
    if (condition) {
      console.log(`✅ [PASS] ${desc}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${desc}`);
      failed++;
    }
  }

  // 1. Test GET catalog
  const getRes = await GET();
  const getJson = await getRes.json();
  assert(getJson.success === true && getJson.totalSectors >= 10, `GET /api/sector-tools catalog returns ${getJson.totalSectors} sectors`);

  // 2. Test POST solar_boq
  const solarReq = new NextRequest('http://localhost:3000/api/sector-tools', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'solar_boq', kva: 5, batteryType: 'lithium', backupHours: 12 }),
  });
  const solarRes = await POST(solarReq);
  const solarJson = await solarRes.json();
  assert(solarJson.success === true && solarJson.result.grandTotal > 0, `POST action: 'solar_boq' returns grandTotal ₦${solarJson.result?.grandTotal?.toLocaleString()}`);

  // 3. Test POST tokunbo_duty
  const dutyReq = new NextRequest('http://localhost:3000/api/sector-tools', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'tokunbo_duty', year: 2018, engineCc: 2500, cifNgn: 8500000 }),
  });
  const dutyRes = await POST(dutyReq);
  const dutyJson = await dutyRes.json();
  assert(dutyJson.success === true && dutyJson.result.totalCustomsDuty > 0, `POST action: 'tokunbo_duty' returns totalCustomsDuty ₦${dutyJson.result?.totalCustomsDuty?.toLocaleString()}`);

  // 4. Test POST diesel_roi
  const dieselReq = new NextRequest('http://localhost:3000/api/sector-tools', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'diesel_roi', monthlyDieselLiters: 200, pricePerLiter: 1350 }),
  });
  const dieselRes = await POST(dieselReq);
  const dieselJson = await dieselRes.json();
  assert(dieselJson.success === true && dieselJson.result.annualDieselCost === 3240000, `POST action: 'diesel_roi' returns annual cost ₦${dieselJson.result?.annualDieselCost?.toLocaleString()}`);

  console.log('\n================================================================');
  console.log(`🏁 API ROUTE HANDLER TESTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================================');

  if (failed > 0) process.exit(1);
}

testApiRoute();
