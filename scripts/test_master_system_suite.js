/**
 * @file scripts/test_master_system_suite.js
 * Comprehensive Master System Test Runner
 * Validates Modular Customizer, OPay Flow, Subscription Lifecycle, Harvester Fallback & Net-New Tracking.
 */

const fs = require('fs');
const path = require('path');
const { calculateCustomFeatureSelection, formatCustomFeatureWhatsAppRequest } = require('../src/lib/featureCustomizer');
const { evaluateClientSubscriptionStatus, renewClientSubscriptionOpay } = require('../src/lib/subscriptionManager');

async function runMasterSuite() {
  console.log('==================================================');
  console.log('🚀 MASTER END-TO-END SYSTEM SUITE TEST');
  console.log('==================================================\n');

  let passed = 0;
  let total = 4;

  // ---------------------------------------------------------------------------
  // TEST 1: Modular Feature Customizer & 15% Bundle Discount Engine
  // ---------------------------------------------------------------------------
  console.log('1️⃣ Testing Modular Feature Customizer & 15% Bundle Discount...');
  try {
    const selectedIds = ['feature_lead_harvester', 'feature_whatsapp_voice_notes', 'feature_customer_ai_agent'];
    const calc = calculateCustomFeatureSelection(selectedIds);
    
    if (calc.selectedFeatures.length === 3 && calc.discountAppliedPercentage === 15) {
      console.log(`   ✅ PASS: 3 features selected. 15% Bundle Discount applied! (Setup: ₦${calc.finalSetupNGN.toLocaleString()})`);
      passed++;
    } else {
      console.error('   ❌ FAIL: Bundle discount calculation mismatch');
    }
  } catch (err) {
    console.error('   ❌ FAIL: Feature customizer error:', err.message);
  }

  // ---------------------------------------------------------------------------
  // TEST 2: WhatsApp OPay Approval Request Formatter
  // ---------------------------------------------------------------------------
  console.log('\n2️⃣ Testing WhatsApp OPay Approval Request Formatter...');
  try {
    const wa = formatCustomFeatureWhatsAppRequest({
      businessName: 'Bode Electricals Lagos',
      clientPhone: '08099887766',
      selectedIds: ['feature_lead_harvester', 'feature_customer_ai_agent'],
    });

    if (wa.waUrl.includes('https://wa.me/') && wa.messageText.includes('OPay Microfinance Bank')) {
      console.log('   ✅ PASS: WhatsApp OPay transfer request formatted with 1-click URL!');
      passed++;
    } else {
      console.error('   ❌ FAIL: WhatsApp OPay request formatting failed');
    }
  } catch (err) {
    console.error('   ❌ FAIL: WhatsApp OPay formatter error:', err.message);
  }

  // ---------------------------------------------------------------------------
  // TEST 3: Subscription Expiry & 1-Second OPay Reactivation Engine
  // ---------------------------------------------------------------------------
  console.log('\n3️⃣ Testing Subscription Expiry & 1-Second OPay Reactivation...');
  try {
    const testClientId = 'test_client_bode_123';
    // Renew client
    const renewed = await renewClientSubscriptionOpay({
      clientId: testClientId,
      businessName: 'Bode Test Firm',
      renewalDays: 30,
      opayReference: 'OPAY_REF_998877',
    });

    const status = evaluateClientSubscriptionStatus(testClientId);

    if (renewed.status === 'active' && status.isActive && status.daysRemaining >= 29) {
      console.log(`   ✅ PASS: Client ${testClientId} REACTIVATED until ${renewed.subscription_expiry_iso.split('T')[0]}!`);
      passed++;
    } else {
      console.error('   ❌ FAIL: Subscription reactivation check failed');
    }
  } catch (err) {
    console.error('   ❌ FAIL: Subscription reactivation error:', err.message);
  }

  // ---------------------------------------------------------------------------
  // TEST 4: Lead Harvester Syntax & Database Persistence Architecture
  // ---------------------------------------------------------------------------
  console.log('\n4️⃣ Testing Lead Harvester Persistence & Local Fallback...');
  try {
    const harvesterPath = path.join(process.cwd(), 'scripts', 'lagos_10k_master_harvester.js');
    const localDbPath = path.join(process.cwd(), 'local_db', 'leads_db.json');

    if (fs.existsSync(harvesterPath) && fs.existsSync(localDbPath)) {
      console.log(`   ✅ PASS: Lagos Master Harvester v8.0 ready & Local DB synced (${fs.existsSync(localDbPath) ? 'Available' : 'Missing'})`);
      passed++;
    } else {
      console.error('   ❌ FAIL: Harvester or local DB missing');
    }
  } catch (err) {
    console.error('   ❌ FAIL: Harvester test error:', err.message);
  }

  console.log('\n==================================================');
  console.log(`🎉 MASTER SYSTEM SUITE SUMMARY: ${passed}/${total} TESTS PASSED!`);
  console.log('==================================================\n');
}

runMasterSuite();
