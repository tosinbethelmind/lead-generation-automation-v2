import https from 'https';
import http from 'http';

const BASE_URL = process.env.TEST_URL || 'http://localhost:3008';

const ENDPOINTS_TO_TEST = [
  { name: 'Root Landing Page', path: '/', expectedStatus: [200, 307, 308] },
  { name: 'Digital Asset Store', path: '/store', expectedStatus: [200] },
  { name: 'Lagos Business Directory', path: '/directory', expectedStatus: [200] },
  { name: 'Inbound Domain Escrow Portal (Lagos Solar)', path: '/domains/lagos-solar-solutions.com.ng', expectedStatus: [200] },
  { name: 'Inbound Domain Escrow Portal (Lekki Dental)', path: '/domains/lekki-dental-aesthetics.com.ng', expectedStatus: [200] },
  { name: 'Smart AI Arbitrage Portal (Zero-Latency)', path: '/arbitrage/DEAL-OTC-ACTIVE', expectedStatus: [200] },
  { name: 'Programmatic Micro-SaaS Paywall API', path: '/api/tools/micro-paywall', method: 'POST', body: JSON.stringify({ toolType: 'SOLAR_BOQ' }), expectedStatus: [200, 400] },
  { name: 'Domain Reclaim Inbound API', path: '/api/domains/reclaim', method: 'POST', body: JSON.stringify({ domain: 'test.com.ng', requesterPhone: '08022791227' }), expectedStatus: [200] },
  { name: 'Selar Automated Webhook Receiver', path: '/api/webhooks/selar', method: 'GET', expectedStatus: [200, 405] },
  { name: 'Domain Purchase Auth Token Verifier', path: '/api/domains/authorize-buy?domain=test.com.ng&cost=1800&expiresAt=9999999999&sig=test', expectedStatus: [403, 400] }
];

function checkEndpoint(baseUrl: string, endpoint: any): Promise<{ name: string; url: string; status: number; ok: boolean; error?: string }> {
  return new Promise((resolve) => {
    const fullUrl = `${baseUrl}${endpoint.path}`;
    try {
      const urlObj = new URL(fullUrl);
      const client = urlObj.protocol === 'https:' ? https : http;

      const req = client.request(urlObj, {
        method: endpoint.method || 'GET',
        headers: {
          'User-Agent': 'Bethelmind-Link-Integrity-Tester/1.0',
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }, (res) => {
        const ok = endpoint.expectedStatus.includes(res.statusCode || 0);
        resolve({
          name: endpoint.name,
          url: fullUrl,
          status: res.statusCode || 0,
          ok
        });
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({
          name: endpoint.name,
          url: fullUrl,
          status: 0,
          ok: false,
          error: 'TIMEOUT (10s)'
        });
      });

      req.on('error', (err) => {
        resolve({
          name: endpoint.name,
          url: fullUrl,
          status: 0,
          ok: false,
          error: err.message
        });
      });

      if (endpoint.body) {
        req.write(endpoint.body);
      }
      req.end();
    } catch (e: any) {
      resolve({
        name: endpoint.name,
        url: fullUrl,
        status: 0,
        ok: false,
        error: e.message
      });
    }
  });
}

async function runLinkIntegritySuite() {
  console.log('========================================================================');
  console.log('🔍 BETHELMIND CODEBASE LINK & ENDPOINT INTEGRITY AUDITOR');
  console.log(`🌐 Target Base URL: ${BASE_URL}`);
  console.log('========================================================================\n');

  let passed = 0;
  let failed = 0;

  for (const ep of ENDPOINTS_TO_TEST) {
    process.stdout.write(`Testing [${ep.name}] (${ep.path})... `);
    const result = await checkEndpoint(BASE_URL, ep);

    if (result.ok) {
      passed++;
      console.log(`✅ [HTTP ${result.status}]`);
    } else {
      failed++;
      console.log(`❌ [HTTP ${result.status || 'ERROR'}]: ${result.error || 'Unexpected status'}`);
    }
  }

  console.log('\n========================================================================');
  console.log(`🎯 AUDIT SUMMARY: ${passed} PASSED | ${failed} FAILED (Total: ${ENDPOINTS_TO_TEST.length})`);
  console.log('========================================================================\n');
}

runLinkIntegritySuite();
