/**
 * scripts/test_telegram_approval.js
 * 
 * Automated E2E Test Suite for Telegram Human-in-the-Loop AI Approval Engine
 * 1. Creates a pending approval decision ticket
 * 2. Simulates Telegram callback query (Approve/Reject)
 * 3. Simulates Telegram text message reply with custom prompt modification
 * 4. Verifies ticket status transition to APPROVED with prompt modifier
 */

const { createApprovalTicket, getApprovalTickets, approveTicket } = require('../src/lib/approvalQueueManager');
const { processTelegramWebhookUpdate } = require('../src/lib/telegramApprovalBot');

async function runTest(name, testFn) {
  process.stdout.write(`🧪 [TEST] ${name}... `);
  const start = Date.now();
  try {
    await testFn();
    console.log(`✅ PASSED (${Date.now() - start}ms)`);
    return true;
  } catch (err) {
    console.log(`❌ FAILED (${Date.now() - start}ms)\n   Error: ${err.message}`);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting Telegram Human Approval Engine Test Suite...\n');
  let passed = 0;
  let total = 0;

  // Test 1: Ticket Creation
  let testTicket;
  total++;
  if (await runTest('Create High-Stakes Decision Approval Ticket', async () => {
    testTicket = await createApprovalTicket({
      actionType: 'EXECUTE_REDESIGN',
      title: 'Major Site Layout Overhaul for SolarQuotePro',
      summary: 'AI proposed changing primary branding color to Dark Navy and adding interactive solar ROI calculator.',
      proposedData: { theme: 'dark_navy', widgets: ['solar_calculator'] }
    });
    if (!testTicket || testTicket.status !== 'PENDING_HUMAN_APPROVAL') {
      throw new Error('Failed to create pending ticket');
    }
  })) passed++;

  // Test 2: Telegram Callback Query Simulation
  total++;
  if (await runTest('Simulate Telegram Button Click Callback (Approve)', async () => {
    const simulatedUpdate = {
      callback_query: {
        id: 'cb_123456',
        data: `approve_${testTicket.id}`,
        message: { chat: { id: 987654 }, message_id: 111 }
      }
    };
    const res = await processTelegramWebhookUpdate(simulatedUpdate);
    if (!res.handled || res.action !== 'APPROVE') {
      throw new Error('Telegram callback was not handled properly');
    }
  })) passed++;

  // Test 3: Create Second Ticket & Reply with Custom Prompt
  let promptTicket;
  total++;
  if (await runTest('Simulate Telegram Text Reply with Custom Prompt Modifier', async () => {
    promptTicket = await createApprovalTicket({
      actionType: 'LAUNCH_CAMPAIGN',
      title: 'Bulk WhatsApp Outreach Dispatch (150 Leads)',
      summary: 'AI proposed sending high-value solar ROI proposal to 150 leads in Lagos region.',
      proposedData: { leadsCount: 150, channel: 'WHATSAPP' }
    });

    const simulatedReplyUpdate = {
      message: {
        chat: { id: 987654 },
        text: `Approve, but change daily cap to 50 leads and add signature "Best Regards, Solar Team"`,
        reply_to_message: {
          text: `🚨 HUMAN APPROVAL REQUIRED 🚨\nTicket ID: ${promptTicket.id}`
        }
      }
    };

    const res = await processTelegramWebhookUpdate(simulatedReplyUpdate);
    if (!res.handled || res.action !== 'APPROVE_WITH_PROMPT') {
      throw new Error('Telegram custom prompt reply was not handled properly');
    }

    const tickets = await getApprovalTickets();
    const updated = tickets.find(t => t.id === promptTicket.id);
    if (!updated || updated.status !== 'APPROVED' || !updated.adminPromptModifier) {
      throw new Error('Ticket was not updated with custom prompt modifier');
    }
  })) passed++;

  console.log(`\n🎉 [SUMMARY] Passed ${passed}/${total} Telegram Approval Engine tests.\n`);
  if (passed !== total) process.exit(1);
}

main().catch(err => {
  console.error('Fatal Test Error:', err);
  process.exit(1);
});
