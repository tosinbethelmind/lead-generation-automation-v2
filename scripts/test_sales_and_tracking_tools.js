/**
 * Comprehensive Automated Verification Script for New Sales & Tracking Tools Suite
 * Tests Meta CAPI, Customer Journey logging, Facebook Ad Insights, Email Drip Engine, and Pricing calculations.
 */

const http = require('http');

const PORT = 3006; // Next.js dev server port

function makePostRequest(path, payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const req = http.request(
      {
        hostname: 'localhost',
        port: PORT,
        path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data),
        },
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(body) });
          } catch (e) {
            resolve({ status: res.statusCode, body });
          }
        });
      }
    );
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function makeGetRequest(path) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: 'localhost',
        port: PORT,
        path,
        method: 'GET',
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(body) });
          } catch (e) {
            resolve({ status: res.statusCode, body });
          }
        });
      }
    );
    req.on('error', reject);
    req.end();
  });
}

async function runAllToolTests() {
  console.log('====================================================');
  console.log('🚀 STARTING AUTOMATED TEST VERIFICATION OF TOOL SUITE');
  console.log('====================================================\n');

  let passedCount = 0;
  let failedCount = 0;

  // Test 1: Pricing Engine Verification
  try {
    console.log('[Test 1] Verifying Pricing Calculation Logic with New Tool Add-Ons...');
    const { calculateLeadClaimFee } = require('../src/lib/pricing');
    const mockLead = { upgrade_strategy: 'basic_presence', plugin_suggestions: JSON.stringify(['meta_capi', 'email_drip', 'whatsapp_bot']) };
    const mockConfig = { claimFeeNGN: 185000 };
    const calculatedFee = calculateLeadClaimFee(mockLead, mockConfig);
    const expectedFee = 185000 + 45000 + 75000 + 95000; // 400,000

    if (calculatedFee === expectedFee) {
      console.log(`✅ [Test 1 PASSED] Pricing calculated fee ₦${calculatedFee.toLocaleString()} matches expected ₦${expectedFee.toLocaleString()}`);
      passedCount++;
    } else {
      console.error(`❌ [Test 1 FAILED] Calculated ₦${calculatedFee} vs expected ₦${expectedFee}`);
      failedCount++;
    }
  } catch (err) {
    console.error('❌ [Test 1 EXCEPTION]', err.message);
    failedCount++;
  }

  // Test 2: Meta CAPI Server Proxy API
  try {
    console.log('\n[Test 2] Testing Meta Conversions API (CAPI) Proxy (/api/tracking/meta-capi)...');
    const capiRes = await makePostRequest('/api/tracking/meta-capi', {
      eventName: 'Lead',
      eventId: `test_lead_${Date.now()}`,
      eventSourceUrl: 'http://localhost:3006/preview/test_lead',
      userData: {
        email: 'testbuyer@example.com',
        phone: '+2348012345678',
        firstName: 'Tosin',
        lastName: 'Bethel'
      },
      customData: { value: 185000, currency: 'NGN' }
    });

    if (capiRes.status === 200 && capiRes.body.success) {
      console.log(`✅ [Test 2 PASSED] Meta CAPI responded: ${JSON.stringify(capiRes.body.payloadSummary)}`);
      passedCount++;
    } else {
      console.error(`❌ [Test 2 FAILED] Status: ${capiRes.status}`, capiRes.body);
      failedCount++;
    }
  } catch (err) {
    console.error('❌ [Test 2 EXCEPTION]', err.message);
    failedCount++;
  }

  // Test 3: Customer Journey Event Logger
  try {
    console.log('\n[Test 3] Testing Customer Journey Event Logger (/api/tracking/journey-event)...');
    const journeyRes = await makePostRequest('/api/tracking/journey-event', {
      leadId: 'test_lead_99',
      eventType: 'scroll_depth',
      path: '/preview/test_lead',
      scrollPercentage: 75,
      timeOnPageSec: 35
    });

    if (journeyRes.status === 200 && journeyRes.body.success) {
      console.log(`✅ [Test 3 PASSED] Customer Journey logged: ${journeyRes.body.event.eventType} at ${journeyRes.body.event.scrollPercentage}%`);
      passedCount++;
    } else {
      console.error(`❌ [Test 3 FAILED] Status: ${journeyRes.status}`, journeyRes.body);
      failedCount++;
    }
  } catch (err) {
    console.error('❌ [Test 3 EXCEPTION]', err.message);
    failedCount++;
  }

  // Test 4: Facebook Ad Analytics API
  try {
    console.log('\n[Test 4] Testing Facebook Ad Analytics Insights (/api/analytics/facebook-ads)...');
    const adRes = await makeGetRequest('/api/analytics/facebook-ads');

    if (adRes.status === 200 && adRes.body.success && adRes.body.data.roasRatio > 0) {
      console.log(`✅ [Test 4 PASSED] Ad Analytics fetched: ROAS ${adRes.body.data.roasRatio}x | Spend: ₦${adRes.body.data.totalSpend.toLocaleString()}`);
      passedCount++;
    } else {
      console.error(`❌ [Test 4 FAILED] Status: ${adRes.status}`, adRes.body);
      failedCount++;
    }
  } catch (err) {
    console.error('❌ [Test 4 EXCEPTION]', err.message);
    failedCount++;
  }

  // Test 5: Automated Email Drip Trigger API
  try {
    console.log('\n[Test 5] Testing Email Drip Trigger Endpoint (/api/email/trigger-drip)...');
    const dripRes = await makePostRequest('/api/email/trigger-drip', {
      leadId: 'test_lead_99',
      clientName: 'Test Business Owner',
      clientEmail: 'businessowner@example.com',
      stepIndex: 1
    });

    if (dripRes.status === 200 && dripRes.body.success) {
      console.log(`✅ [Test 5 PASSED] Drip email step triggered: '${dripRes.body.dripDetails.step.subject}' sent to ${dripRes.body.dripDetails.sentTo}`);
      passedCount++;
    } else {
      console.error(`❌ [Test 5 FAILED] Status: ${dripRes.status}`, dripRes.body);
      failedCount++;
    }
  } catch (err) {
    console.error('❌ [Test 5 EXCEPTION]', err.message);
    failedCount++;
  }

  console.log('\n====================================================');
  console.log(`📊 TEST SUMMARY: ${passedCount} PASSED / ${failedCount} FAILED`);
  console.log('====================================================\n');

  if (failedCount > 0) {
    process.exit(1);
  }
}

runAllToolTests();
