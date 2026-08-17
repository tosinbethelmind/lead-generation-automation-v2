/**
 * scripts/test_ai_copilot_intelligence.js
 * End-to-end automated test suite for AI Copilot executing complex English instructions.
 */

const BASE_URL = process.env.TEST_URL || 'http://localhost:3006';
const TOKEN = 'bethelmind_admin_2026';

const COMPLEX_TEST_PROMPTS = [
  {
    name: '1. Fact Learning & Memory Retention',
    command: 'Remember that our target sector today is luxury beauty salons in Lekki with minimum rating 4.0'
  },
  {
    name: '2. Sprint Progress & Diagnostic Health Check',
    command: 'Show sprint progress and check SMS gateway health'
  },
  {
    name: '3. Memory Recall Verification',
    command: 'What do you remember in your memory bank?'
  },
  {
    name: '4. Targeted Lead Harvesting Instruction',
    command: 'Scrape 5 luxury salon leads in Lekki Lagos'
  },
  {
    name: '5. Intelligent Personal Test Outreach Dispatch',
    command: 'Send test SMS with prototype link to my remembered phone number'
  },
  {
    name: '6. Filter & Pipeline Query',
    command: 'Show uncontacted salon leads in Lekki'
  }
];

async function runTests() {
  console.log('================================================================');
  console.log('🤖 TESTING AI ADMIN COPILOT INTELLIGENCE (Complex Instructions)');
  console.log(`🌐 Target Endpoint: ${BASE_URL}/api/admin/command-copilot`);
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  for (const test of COMPLEX_TEST_PROMPTS) {
    console.log(`\n------------------------------------------------------------`);
    console.log(`▶ TEST CASE: ${test.name}`);
    console.log(`💬 User Instruction: "${test.command}"`);

    try {
      const startTime = Date.now();
      const res = await fetch(`${BASE_URL}/api/admin/command-copilot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${TOKEN}`
        },
        body: JSON.stringify({
          command: test.command,
          token: TOKEN
        })
      });

      const latency = Date.now() - startTime;
      const data = await res.json();

      if (res.ok && data.success) {
        console.log(`✅ Result (${latency}ms): Action [${data.action_executed}]`);
        console.log(`📝 AI Summary: ${data.summary}`);
        console.log(`📄 AI Output Preview:\n${data.output.slice(0, 300)}...\n`);
        passed++;
      } else {
        console.error(`❌ Failed:`, data.error || data);
        failed++;
      }
    } catch (err) {
      console.error(`❌ Execution Exception:`, err.message);
      failed++;
    }
  }

  console.log('\n================================================================');
  console.log(`🎯 TEST SUMMARY: ${passed} PASSED | ${failed} FAILED (Total: ${COMPLEX_TEST_PROMPTS.length})`);
  console.log('================================================================\n');
}

runTests();
