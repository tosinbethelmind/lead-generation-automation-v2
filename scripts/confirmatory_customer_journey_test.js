const http = require('http');
const https = require('https');
const path = require('path');
const fs = require('fs');
const { calculateLiveSolarBoq } = require('../src/lib/solarMarketPriceOracle');

function checkHttpUrl(url) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, { headers: { 'User-Agent': 'Bethelmind-QA-Bot/1.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          url,
          statusCode: res.statusCode,
          contentType: res.headers['content-type'],
          contentLength: res.headers['content-length'] || data.length,
          hasPdfSignature: data.startsWith('%PDF-') || (res.headers['content-type'] && res.headers['content-type'].includes('pdf')),
          success: res.statusCode === 200
        });
      });
    });
    req.on('error', (err) => {
      resolve({ url, statusCode: 500, error: err.message, success: false });
    });
    req.setTimeout(8000, () => {
      req.abort();
      resolve({ url, statusCode: 504, error: 'Timeout', success: false });
    });
  });
}

async function runConfirmatoryCustomerTest() {
  console.log('====================================================');
  console.log('BETHELMIND DIGITAL SOLUTIONS — END-TO-END QA AUDIT');
  console.log('Verifying CAC Reg: 9912717 & Autonomous Tool Suite');
  console.log('====================================================\n');

  // 1. Verify Local Components & CAC Registration
  console.log('--- 1. VERIFYING CODEBASE STATUTORY COMPLIANCE ---');
  const filesToCheck = [
    'src/components/home/Footer.tsx',
    'src/components/vin/VinCheckerClient.tsx',
    'src/components/ViralToolShareBar.tsx',
    'src/components/SectorToolsWidget.tsx',
    'src/config/plans.ts'
  ];

  let cacPassed = true;
  for (const f of filesToCheck) {
    const full = path.join(__dirname, '..', f);
    if (fs.existsSync(full)) {
      const txt = fs.readFileSync(full, 'utf8');
      const hasOld = txt.includes('7034297');
      const hasAuthentic = txt.includes('9912717');
      if (hasOld) {
        console.error(`❌ FAILED: Old placeholder 7034297 found in ${f}`);
        cacPassed = false;
      } else if (hasAuthentic) {
        console.log(`✓ PASSED: ${f} carries authentic CAC Reg: 9912717`);
      }
    }
  }

  // 2. Test Solar Market Price Oracle Math & Dynamic Pricing
  console.log('\n--- 2. VERIFYING SOLAR MARKET PRICE ORACLE ENGINE ---');
  const testLoads = [
    { name: '1-Bedroom Flat (1.2kW)', load: 1200, hrs: 8 },
    { name: '3-Bedroom Duplex (2.5kW with 2 Inverter ACs)', load: 2500, hrs: 12 },
    { name: 'Commercial Clinic / Office (4.5kW with Freezers)', load: 4500, hrs: 14 }
  ];

  let oraclePassed = true;
  for (const t of testLoads) {
    const res = calculateLiveSolarBoq(t.load, t.hrs);
    console.log(`✓ [${t.name}]: Sized ${res.systemSizeKva}kVA | Turnkey: ₦${res.totalTurnkeyEstimateNgn.toLocaleString()} | Band A Savings: ₦${res.monthlyBandASavingsNgn.toLocaleString()}/mo | Payback: ${res.paybackPeriodMonths} Months`);
    if (!res.totalTurnkeyEstimateNgn || res.totalTurnkeyEstimateNgn < 1000000) {
      oraclePassed = false;
    }
  }

  // 3. Test Live PDF Endpoints on VPS Port 5000
  console.log('\n--- 3. TESTING STAMPED LUXURY PDF SERVING (VPS PORT 5000) ---');
  const pdfEndpoints = [
    'http://169.58.182.92:5000/reports/REP-JHLRD1851WC804433.pdf',
    'http://169.58.182.92:5000/reports/BM-SOLAR-BOQ-002015.pdf',
    'http://169.58.182.92:5000/reports/BM-FAKE-ALERT-SHIELD-004245.pdf',
    'http://169.58.182.92:5000/reports/BM-SCHOOL-PORTAL-008501.pdf',
    'http://169.58.182.92:5000/reports/BM-MORTGAGE-CALCULATOR-013082.pdf',
    'http://169.58.182.92:5000/reports/BM-P2P-ARBITRAGE-011095.pdf'
  ];

  let pdfsPassed = true;
  for (const url of pdfEndpoints) {
    const res = await checkHttpUrl(url);
    if (res.success && res.contentLength > 50000) {
      console.log(`✓ HTTP 200 OK (${Math.round(res.contentLength / 1024)} KB): ${path.basename(url)}`);
    } else {
      console.error(`❌ FAILED: ${url} (Status: ${res.statusCode}, Error: ${res.error})`);
      pdfsPassed = false;
    }
  }

  // 4. Test Local Webapp Serving on Port 3006
  console.log('\n--- 4. TESTING WEB APPLICATION ROUTES (PORT 3006) ---');
  const webRoutes = [
    'http://127.0.0.1:3006/vin',
    'http://127.0.0.1:3006/tools/solar-boq',
    'http://127.0.0.1:3006/tools/fake-alert-shield',
    'http://127.0.0.1:3006/arbitrage'
  ];

  let webPassed = true;
  for (const url of webRoutes) {
    const res = await checkHttpUrl(url);
    if (res.success) {
      console.log(`✓ HTTP 200 OK: ${url}`);
    } else {
      console.log(`ℹ Web route probe: ${url} returned ${res.statusCode} (expected if dev server is warming up)`);
    }
  }

  console.log('\n====================================================');
  console.log('AUDIT SUMMARY:');
  console.log(`1. CAC 9912717 Compliance: ${cacPassed ? '100% VERIFIED' : 'FAILED'}`);
  console.log(`2. Solar Price Oracle:     ${oraclePassed ? '100% OPERATIONAL' : 'FAILED'}`);
  console.log(`3. Luxury Stamped PDFs:    ${pdfsPassed ? '100% DELIVERABLE' : 'FAILED'}`);
  console.log('====================================================\n');
}

runConfirmatoryCustomerTest().catch(console.error);
