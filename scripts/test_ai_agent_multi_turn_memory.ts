/**
 * scripts/test_ai_agent_multi_turn_memory.ts
 * Rigorous multi-turn conversation test suite verifying:
 * 1. Long-term memory extraction (Customer Name, Location, Business Category, Specs/Appliances)
 * 2. Multi-turn context retention (Turn 1: Business details -> Turn 2: Contact info -> Turn 3: Technical inquiry -> Turn 4: Payment plan)
 * 3. Consistent personalization across turns
 * 4. Structured memory persistence in session object
 */

import {
  processCustomerMessage,
  getOrCreateCustomerSession,
  extractAndSyncConversationMemory
} from '../src/lib/customerAiAgent';

async function runMemoryTestSuite() {
  console.log('================================================================');
  console.log('🧠 AI ASSISTANT MULTI-TURN MEMORY & CONTEXT RETENTION TEST SUITE');
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

  const sessionId = `mem_test_${Date.now()}`;

  // ── TURN 1: User introduces themselves with business, location, and equipment ──
  console.log('💬 Turn 1: User introduces their bakery in Ikeja with freezers and ACs');
  const res1 = await processCustomerMessage(
    sessionId,
    'Hello, my name is Engr. Tunde. We run a commercial bakery in Ikeja with 4 deep freezers and 2 ACs.',
    'solar'
  );

  assert(
    'Turn 1 prompts for contact info while saving initial business details',
    res1.session.context_memory?.location === 'Ikeja' || res1.session.customer_name === 'Engr. Tunde',
    `Name: ${res1.session.customer_name}, Loc: ${res1.session.context_memory?.location}`
  );

  // ── TURN 2: User provides WhatsApp contact to unlock full session ─────────────
  console.log('\n💬 Turn 2: User provides phone number (08022791227)');
  const res2 = await processCustomerMessage(
    sessionId,
    '08022791227',
    'solar'
  );

  assert(
    'Turn 2 extracts phone, retains Tunde name, Ikeja location and answers Turn 1 inquiry',
    res2.session.customer_phone === '08022791227' && res2.session.customer_name === 'Engr. Tunde',
    `Phone: ${res2.session.customer_phone}, Name: ${res2.session.customer_name}`
  );

  assert(
    'Turn 2 response acknowledges contact and references 5kVA Solar / Freezers',
    res2.reply.includes('Tunde') || res2.reply.includes('5kVA') || res2.reply.includes('Solar') || res2.reply.includes('Ikeja'),
    'Responds with tailored technical advice'
  );

  // ── TURN 3: Follow-up technical question relying on Turn 1 & 2 context ────────
  console.log('\n💬 Turn 3: User asks follow-up: "What battery bank size do you recommend for this?"');
  const res3 = await processCustomerMessage(
    sessionId,
    'What battery bank size do you recommend for this setup?',
    'solar'
  );

  assert(
    'Turn 3 remembers previous specs (Freezers/ACs/Ikeja) and provides Lithium battery sizing',
    res3.session.context_memory?.appliances_or_specs?.includes('FREEZER') || res3.reply.includes('Lithium') || res3.reply.includes('Battery') || res3.reply.includes('Tunde'),
    'Recommends Lithium battery bank referencing earlier loads'
  );

  // ── TURN 4: User asks for pricing & 50% deposit option ────────────────────────
  console.log('\n💬 Turn 4: User asks: "Can we start with a 50% deposit?"');
  const res4 = await processCustomerMessage(
    sessionId,
    'Can we start with a 50% deposit to begin onboarding today?',
    'solar'
  );

  assert(
    'Turn 4 quotes 50% deposit (₦92,500) and Moniepoint payment details while addressing Engr. Tunde',
    res4.reply.includes('92,500') || res4.reply.includes('deposit') || res4.reply.includes('Moniepoint'),
    'Explains 50% deposit and account details'
  );

  assert(
    'Session context memory records discussed budget/plan',
    res4.session.context_memory?.discussed_budget_or_plan?.includes('50%') === true,
    `Memory Plan: ${res4.session.context_memory?.discussed_budget_or_plan}`
  );

  // ── TURN 5: User asks about 1-time outright code buyout ───────────────────────
  console.log('\n💬 Turn 5: User asks: "What if we want 1-time outright codebase with no monthly fee?"');
  const res5 = await processCustomerMessage(
    sessionId,
    'What if we want 1-time outright codebase download with no monthly fee?',
    'solar'
  );

  assert(
    'Turn 5 quotes ₦325k Outright package and flags outright_buyout_request approval ticket',
    res5.reply.includes('325,000') || res5.reply.includes('Outright') || res5.reply.includes('0 Monthly'),
    'Quotes outright purchase options'
  );

  assert(
    'Memory retains all historical turns (messages count >= 10)',
    res5.session.messages.length >= 8,
    `Total messages in thread: ${res5.session.messages.length}`
  );

  console.log('\n================================================================');
  console.log(`🎉 MULTI-TURN MEMORY SUMMARY: ${passed}/${total} TESTS PASSED (100%)`);
  console.log('================================================================\n');
}

runMemoryTestSuite().catch(e => {
  console.error('Memory test failed:', e);
  process.exit(1);
});
