/**
 * @file scripts/run_6hour_rate_oracle_cron.ts
 * 
 * Runs the 6-hourly Live FX Rate Oracle Daemon.
 */

import { AutonomousLiveRateOracle } from '../src/lib/monetization/autonomousLiveRateOracle';

async function main() {
  console.log('========================================================================');
  console.log('📡 STARTING 24/7 6-HOURLY LIVE FX RATE ORACLE DAEMON');
  console.log('========================================================================\n');

  const oracle = new AutonomousLiveRateOracle();

  // Run immediate first sweep
  await oracle.run6HourlySweep(true);

  // Set 6-hour recurring interval (6 hours = 21,600,000 ms)
  const SIX_HOURS_MS = 6 * 60 * 60 * 1000;
  setInterval(async () => {
    console.log('\n⏰ [6-Hour Trigger]: Executing scheduled 6-hourly FX rate research sweep...');
    try {
      await oracle.run6HourlySweep(true);
    } catch (err: any) {
      console.error('Rate sweep error:', err.message);
    }
  }, SIX_HOURS_MS);

  console.log('🛡️ 6-Hourly Live Rate Oracle is actively running in background.');
}

main().catch(console.error);
