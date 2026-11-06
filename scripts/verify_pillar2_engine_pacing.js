const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function verifyEngine() {
  const { getPillar2Telemetry, processOutboundQueue } = require('../src/lib/pillar2/pillar2Engine');

  console.log('🏛️ Testing Pillar 2 Engine Telemetry with Pacer...');
  const telemetry = await getPillar2Telemetry();
  console.log('📊 Telemetry Stats:');
  console.log('   Daily Sent / Max     :', telemetry.stats.dailyOutreachSent, '/', telemetry.stats.dailyOutreachMax);
  console.log('   Remaining Today      :', telemetry.stats.dailyOutreachRemaining);
  console.log('   Is Pacing Active     :', telemetry.stats.isPacingActive);
  console.log('   Pacing Reason        :', telemetry.stats.pacingReason);
  console.log('   Next Eligible At     :', telemetry.stats.nextEligibleAt);
  console.log('   Lagos WAT Time       :', telemetry.stats.currentWatTime);
  console.log('   Business Hours Active:', telemetry.stats.isBusinessHours);

  console.log('\n⚡ Testing processOutboundQueue with Pacer Guard...');
  const queueRes = await processOutboundQueue();
  console.log('   Queue Processing Result:', queueRes.message);
  console.log('   Paced Status           :', queueRes.paced ? 'YES (Pacing Enforced)' : 'DISPATCHED');
}

verifyEngine().catch(console.error);
