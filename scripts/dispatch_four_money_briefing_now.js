/**
 * @file scripts/dispatch_four_money_briefing_now.js
 * 
 * Instant CLI dispatcher for the 4 Money Engine 3-hour briefing.
 */

const { checkAndDispatchFourMoneyThreeHourBriefing } = require('../src/lib/monetization/fourMoneyThreeHourBriefingEngine');

async function main() {
  console.log('⚡ Triggering Instant 4 Money Engine Executive Briefing...');
  try {
    const result = await checkAndDispatchFourMoneyThreeHourBriefing(true);
    console.log('✅ Result:', JSON.stringify(result, null, 2));
  } catch (err) {
    console.error('❌ Error:', err);
  }
}

main();
