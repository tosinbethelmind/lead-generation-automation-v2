/**
 * @file scripts/dispatch_ai_decision_briefing.js
 * 
 * Triggers the AI Executive Intelligence & Decision Engine to analyze all metrics
 * and send a strategic decision briefing to bethelmindrecruit@gmail.com.
 */

const path = require('path');
const { sendExecutiveAiBriefingEmail } = require(path.join(process.cwd(), 'src', 'lib', 'executiveAiDecisionEngine.ts'));

async function main() {
  console.log('========================================================================');
  console.log('🧠 BETHELMIND AI EXECUTIVE STRATEGIC DECISION ENGINE');
  console.log('========================================================================\n');

  console.log(`[${new Date().toISOString()}] Formulating strategic AI decisions and evaluating operational metrics...`);

  const result = await sendExecutiveAiBriefingEmail();

  if (result.success) {
    console.log(`✅ [Success]: Strategic AI Decision Briefing dispatched to bethelmindrecruit@gmail.com`);
    console.log(`📧 Message ID: ${result.messageId}\n`);
  } else {
    console.error(`❌ [Error]: Failed to dispatch AI decision briefing:`, result.error);
  }

  console.log('========================================================================');
  console.log('🎯 Executive AI Intelligence Dispatch Complete.');
  console.log('========================================================================\n');
  process.exit(result.success ? 0 : 1);
}

main().catch(err => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
