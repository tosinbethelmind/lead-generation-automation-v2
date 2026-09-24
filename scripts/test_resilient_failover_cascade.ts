/**
 * @file scripts/test_resilient_failover_cascade.ts
 * 
 * 🧪 MULTI-TIER FAILOVER & CASCADE INTEGRATION TEST
 * Bethelmind Analytics Lagos Desk
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

import { verifyEmailMxRecord, dispatchResilientEmail, dispatchResilientSms, dispatchOmnichannelLead } from '../src/lib/outreach/resilientCascadeDispatcher';

async function testCascade() {
  console.log('========================================================================');
  console.log('🛡️ BETHELMIND ANALYTICS: RESILIENT MULTI-TIER FAILOVER CASCADE TEST');
  console.log('========================================================================\n');

  // Test 1: DNS MX Preflight Guard
  console.log('--- TEST 1: DNS MX RECORD PREFLIGHT GUARD ---');
  const testMx1 = await verifyEmailMxRecord('dentistplaceowerri@gmail.com');
  const testMx2 = await verifyEmailMxRecord('contact@nonexistentdomain123456789.com');
  console.log(`✅ Real Gmail Domain MX Check (dentistplaceowerri@gmail.com): ${testMx1 ? 'PASS (Active MX)' : 'FAIL'}`);
  console.log(`🛡️ Fake Inactive Domain MX Check (nonexistentdomain.com): ${testMx2 ? 'FAIL (Allowed dead domain)' : 'PASS (Blocked safely)'}`);

  // Test 2: Resilient Email Dispatch
  console.log('\n--- TEST 2: RESILIENT EMAIL MULTI-TIER CASCADE ---');
  const emailRes = await dispatchResilientEmail({
    toEmail: 'bethelmindrecruit@gmail.com',
    toName: 'Bethelmind Admin Desk',
    subject: '🛡️ Multi-Tier Resilient Email Delivery Verification',
    textContent: 'This confirms that the multi-tier failover email engine is active with automated cascading fallback.',
    htmlContent: '<div style="font-family:sans-serif; padding:20px; background:#0f172a; color:#fff;"><h2>⚡ Multi-Tier Failover Active</h2><p>Brevo API v3 &rarr; Hostinger 587 STARTTLS &rarr; Hostinger 465 SSL &rarr; Cloud Relay.</p></div>'
  });
  console.log('Email Dispatch Result:', emailRes);

  // Test 3: Resilient SMS Dispatch (Fallback to Termii/Gateway)
  console.log('\n--- TEST 3: RESILIENT SMS MULTI-TIER CASCADE ---');
  const smsRes = await dispatchResilientSms({
    phone: '08022791227',
    messageText: 'Bethelmind Lagos: Multi-tier SMS fallback test active. View: https://www.bethelmindanalytics.com/preview/demo STOP to end',
    leadName: 'Admin Desk'
  });
  console.log('SMS Dispatch Result:', smsRes);

  console.log('\n========================================================================');
  console.log('🎉 RESILIENT MULTI-TIER CASCADE TEST COMPLETE');
  console.log('========================================================================');
}

testCascade().catch(console.error);
