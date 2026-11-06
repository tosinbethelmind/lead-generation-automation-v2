const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function run() {
  const { 
    checkPillar2PacingEligibility, 
    recordPillar2Dispatch, 
    loadPacerState,
    getWatDateString,
    getWatTimeString,
    checkLagosBusinessHours,
    persistPacerState
  } = require('../src/lib/pillar2/pillar2Pacer');

  console.log('🏛️ Testing Pillar 2 Outreach Pacer...');
  console.log(`Current WAT Date: ${getWatDateString()}`);
  console.log(`Current WAT Time: ${getWatTimeString()}`);
  console.log('Lagos Business Hours Check:', checkLagosBusinessHours());

  // 1. Initial State
  const state = await loadPacerState();
  console.log('\n📊 Initial Pacer State:', JSON.stringify(state, null, 2));

  // 2. Initial eligibility
  const elig1 = await checkPillar2PacingEligibility();
  console.log('\n🎯 Initial Eligibility:', elig1);

  // 3. Simulate 1 dispatch
  console.log('\n⚡ Simulating 1st Mandate Outreach Dispatch...');
  await recordPillar2Dispatch({
    ticketId: 'DEAL-IKOYI-TEST',
    recipient: 'info@oraegbunike.com',
    channel: 'Hostinger Direct SMTP'
  });

  // 4. Check eligibility immediately after dispatch (should block with ~30 mins countdown)
  const elig2 = await checkPillar2PacingEligibility();
  console.log('\n🛑 Eligibility Immediately After Dispatch (Pacing Guard):', elig2);

  // 5. Clean up test record so we don't skew real counts
  state.sentTodayCount = 0;
  state.lastDispatchedAt = null;
  state.nextEligibleAt = null;
  state.dispatchLogToday = [];
  await persistPacerState(state);
  console.log('\n🧹 Cleaned up test record. Reset to fresh 0/15.');
}

run().catch(console.error);
