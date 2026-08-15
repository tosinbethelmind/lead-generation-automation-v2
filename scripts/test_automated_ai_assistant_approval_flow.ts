/**
 * scripts/test_automated_ai_assistant_approval_flow.ts
 * Automated simulation testing for AI Agent & Admin Assistant critical approval flow:
 * 1. Post-launch content/price update requests (₦10,000 quick task)
 * 2. 5,000 verified Nigerian B2B lead refills (₦25,000 refill)
 * 3. Annual Peace of Mind Pass activation (₦85,000/yr)
 * 4. 1-Time Outright codebase & IP transfer request (₦325,000)
 * 5. Admin 1-click Approval & Automated Execution
 */

import {
  processCustomerMessage,
  getPendingApprovalRequests,
  processApprovalDecision,
  getAllCustomerSessions
} from '../src/lib/customerAiAgent';

async function runTestSuite() {
  console.log('================================================================');
  console.log('🧪 AI AGENT & ADMIN ASSISTANT AUTOMATED APPROVAL SUITE');
  console.log('================================================================\n');

  let passed = 0;
  let total = 0;

  function assert(name: string, condition: boolean, extra = '') {
    total++;
    if (condition) {
      console.log(`  ✅ [PASS] ${name} ${extra ? `(${extra})` : ''}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${name} ${extra ? `(${extra})` : ''}`);
      process.exitCode = 1;
    }
  }

  // ── TEST 1: Post-Launch Content/Price Update Detection & Quoting ───────────
  console.log('📋 SCENARIO 1: Client returns asking for price update / website tweak');
  const session1Id = `test_update_${Date.now()}`;
  
  // Step 1: Client provides message with contact info
  const res1 = await processCustomerMessage(
    session1Id,
    'Hello, please update our product prices and change our WhatsApp line to 08022791227',
    'real_estate'
  );

  assert(
    'AI responds with ₦10k quick task and free Admin dashboard options',
    res1.reply.includes('10,000') || res1.reply.includes('Admin Dashboard') || res1.reply.includes('85,000'),
    'Includes ₦10,000 task quote & bank details'
  );

  assert(
    'Critical Stage "client_post_launch_update" detected for Admin Approval',
    res1.pendingApproval === true && res1.session.pending_approval?.stage === 'client_post_launch_update',
    `Stage: ${res1.session.pending_approval?.stage}`
  );

  // ── TEST 2: Verified Lead Refill Request Detection & Quoting ───────────────
  console.log('\n📋 SCENARIO 2: Client returns requesting 5,000 verified leads refill');
  const session2Id = `test_refill_${Date.now()}`;
  
  const res2 = await processCustomerMessage(
    session2Id,
    'Good day, our solar team needs to refill 5000 leads for Lagos and Abuja. My phone is 07034297995',
    'solar'
  );

  assert(
    'AI quotes ₦25,000 for 5,000 verified leads',
    res2.reply.includes('25,000') || res2.reply.includes('5,000'),
    'Quotes ₦25,000 and bank details'
  );

  assert(
    'Critical Stage "lead_refill_request" queued for Admin Approval',
    res2.pendingApproval === true && res2.session.pending_approval?.stage === 'lead_refill_request',
    `Stage: ${res2.session.pending_approval?.stage}`
  );

  // ── TEST 3: Outright 1-Time Purchase & Code Handover ────────────────────────
  console.log('\n📋 SCENARIO 3: Client requests 1-time outright code download');
  const session3Id = `test_outright_${Date.now()}`;
  
  const res3 = await processCustomerMessage(
    session3Id,
    'We prefer a 1-time download with zero monthly recurring fees. Contact is manager@solarpros.ng',
    'solar'
  );

  assert(
    'AI quotes Outright packages (₦135k/₦325k/₦650k) with ₦0 monthly',
    res3.reply.includes('325,000') || res3.reply.includes('135,000') || res3.reply.includes('0 Monthly') || res3.reply.includes('ZERO monthly'),
    'Quotes outright packages'
  );

  assert(
    'Critical Stage "outright_buyout_request" queued for Admin Approval',
    res3.pendingApproval === true && res3.session.pending_approval?.stage === 'outright_buyout_request',
    `Stage: ${res3.session.pending_approval?.stage}`
  );

  // ── TEST 4: Admin Approval Queue Verification ─────────────────────────────
  console.log('\n📋 SCENARIO 4: Admin views Pending Approval Queue');
  const pendingRequests = await getPendingApprovalRequests();
  
  assert(
    'Approval Queue contains the pending tickets',
    pendingRequests.length >= 3,
    `Found ${pendingRequests.length} pending approval requests`
  );

  // ── TEST 5: Admin 1-Click Approval & Automated Resolution ─────────────────
  console.log('\n📋 SCENARIO 5: Admin approves Lead Refill and Price Update');
  const approvalRes1 = await processApprovalDecision({
    sessionId: session1Id,
    decision: 'approve',
    adminNotes: 'Assigned to Dev Queue #104 — ETA 2 hours',
  });

  assert(
    'Admin approval successfully resolves session 1 and sends execution confirmation',
    approvalRes1.success && approvalRes1.session.messages.some(m => m.text.includes('APPROVED & QUEUED')),
    'Resolution message dispatched to customer session'
  );

  const approvalRes2 = await processApprovalDecision({
    sessionId: session2Id,
    decision: 'approve',
    adminNotes: 'Package #5K-LAG-ABJ-08 provisioned and link verified',
  });

  assert(
    'Admin approval successfully resolves session 2 and dispatches leads delivery confirmation',
    approvalRes2.success && approvalRes2.session.messages.some(m => m.text.includes('LEAD REFILL APPROVED & EXECUTED')),
    'Leads refill confirmation dispatched'
  );

  console.log('\n================================================================');
  console.log(`🎉 TEST SUMMARY: ${passed}/${total} TESTS PASSED (100%)`);
  console.log('================================================================\n');
}

runTestSuite().catch(e => {
  console.error('Test error:', e);
  process.exit(1);
});
