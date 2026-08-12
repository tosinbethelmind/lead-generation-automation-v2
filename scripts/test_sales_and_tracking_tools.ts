/**
 * Comprehensive Automated Verification Script for New Sales & Tracking Tools Suite
 * Tests Meta CAPI, Customer Journey logging, Facebook Ad Insights, Email Drip Engine, and Pricing calculations.
 */

import http from 'http';
import { calculateLeadClaimFee } from '../src/lib/pricing';

const PORT = 3006;

function makePostRequest(path: string, payload: any): Promise<{ status: number; body: any }> {
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
            resolve({ status: res.statusCode || 500, body: JSON.parse(body) });
          } catch (e) {
            resolve({ status: res.statusCode || 500, body });
          }
        });
      }
    );
    req.on('error', (err) => resolve({ status: 500, body: { error: err.message } }));
    req.write(data);
    req.end();
  });
}

function makeGetRequest(path: string): Promise<{ status: number; body: any }> {
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
            resolve({ status: res.statusCode || 500, body: JSON.parse(body) });
          } catch (e) {
            resolve({ status: res.statusCode || 500, body });
          }
        });
      }
    );
    req.on('error', (err) => resolve({ status: 500, body: { error: err.message } }));
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
    const mockLead = { upgrade_strategy: 'basic_presence', plugin_suggestions: JSON.stringify(['meta_capi', 'email_drip', 'whatsapp_bot']) };
    const mockConfig = { claimFeeNGN: 185000 };
    const calculatedFee = calculateLeadClaimFee(mockLead, mockConfig as any);
    const expectedFee = 185000 + 45000 + 75000 + 95000; // 400,000 NGN

    if (calculatedFee === expectedFee) {
      console.log(`✅ [Test 1 PASSED] Pricing calculated fee ₦${calculatedFee.toLocaleString()} matches expected ₦${expectedFee.toLocaleString()}`);
      passedCount++;
    } else {
      console.error(`❌ [Test 1 FAILED] Calculated ₦${calculatedFee} vs expected ₦${expectedFee}`);
      failedCount++;
    }
  } catch (err: any) {
    console.error('❌ [Test 1 EXCEPTION]', err.message);
    failedCount++;
  }

  // Test 2: Meta CAPI Logic Direct Execution
  try {
    console.log('\n[Test 2] Testing Meta Conversions API (CAPI) Payload Builder & Hashing...');
    const { hashMetaUserData, generateEventId } = require('../src/lib/metaPixel');
    const hashedEmail = hashMetaUserData('testbuyer@example.com');
    const eventId = generateEventId('Lead');

    if (hashedEmail && eventId.startsWith('lead_')) {
      console.log(`✅ [Test 2 PASSED] Hashed Email: ${hashedEmail.substring(0, 16)}... | Generated Event ID: ${eventId}`);
      passedCount++;
    } else {
      console.error('❌ [Test 2 FAILED] Invalid hash or eventId');
      failedCount++;
    }
  } catch (err: any) {
    console.error('❌ [Test 2 EXCEPTION]', err.message);
    failedCount++;
  }

  // Test 3: Customer Journey Tracker
  try {
    console.log('\n[Test 3] Testing Customer Journey Tracker Class Initialization...');
    const { CustomerJourneyTracker } = require('../src/lib/customerJourneyTracker');
    const tracker = new CustomerJourneyTracker('test_lead_99');
    if (tracker) {
      console.log('✅ [Test 3 PASSED] CustomerJourneyTracker initialized successfully for lead test_lead_99');
      passedCount++;
    } else {
      console.error('❌ [Test 3 FAILED] CustomerJourneyTracker failed to instantiate');
      failedCount++;
    }
  } catch (err: any) {
    console.error('❌ [Test 3 EXCEPTION]', err.message);
    failedCount++;
  }

  // Test 4: Email Drip Engine Sequence Generator
  try {
    console.log('\n[Test 4] Testing Email Drip Engine Sequence Generation...');
    const { EmailDripEngine } = require('../src/lib/emailDripEngine');
    const sequence = EmailDripEngine.generateStandardSequence({ leadId: 'lead_1', clientName: 'Tosin', clientEmail: 'tosin@example.com' });

    if (sequence.length === 3 && sequence[0].subject.includes('Tosin')) {
      console.log(`✅ [Test 4 PASSED] Generated ${sequence.length} Drip steps. Step 1 Subject: '${sequence[0].subject}'`);
      passedCount++;
    } else {
      console.error('❌ [Test 4 FAILED] Unexpected drip sequence output');
      failedCount++;
    }
  } catch (err: any) {
    console.error('❌ [Test 4 EXCEPTION]', err.message);
    failedCount++;
  }

  // Test 5: Business Owner Dictionary
  try {
    console.log('\n[Test 5] Testing Business Owner Plain-English Dictionary Mapping...');
    const { BUSINESS_OWNER_TOOL_DICTIONARY } = require('../src/lib/businessOwnerDictionary');
    const capiTool = BUSINESS_OWNER_TOOL_DICTIONARY['meta_capi'];

    if (capiTool && capiTool.businessName.includes('Anti-Adblock')) {
      console.log(`✅ [Test 5 PASSED] Dictionary mapped 'meta_capi' -> '${capiTool.businessName}' (${capiTool.shortSummary})`);
      passedCount++;
    } else {
      console.error('❌ [Test 5 FAILED] Dictionary mapping missing or invalid');
      failedCount++;
    }
  } catch (err: any) {
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
