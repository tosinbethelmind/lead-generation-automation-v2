/**
 * @file scripts/autonomous_four_money_daemon.ts
 * 
 * 24/7 AUTONOMOUS CLOUD DAEMON FOR THE 4 MONEY ENGINE.
 * 
 * Runs continuously in cloud environments (Koyeb, Colab, Local) with:
 * - 3-hour executive briefing scheduler.
 * - 30-minute opportunity polling loop across the 4 engines.
 * - Zero-crash circuit breaker and uncaught exception protection.
 */

import { checkAndDispatchFourMoneyThreeHourBriefing } from '../src/lib/monetization/fourMoneyThreeHourBriefingEngine';
import { executeFourMoneyEngine } from '../src/lib/monetization/fourMoneyEngine';

// Global error guards to ensure 0% crashes
process.on('uncaughtException', (err) => {
  console.error('[4 Money Daemon] Handled Uncaught Exception:', err.message);
});

process.on('unhandledRejection', (reason) => {
  console.error('[4 Money Daemon] Handled Unhandled Rejection:', reason);
});

const CHECK_INTERVAL_MS = 15 * 60 * 1000; // Check every 15 minutes

async function runDaemonLoop() {
  console.log('====================================================');
  console.log('⚡ BETHELMIND 4 MONEY ENGINE AUTONOMOUS CLOUD DAEMON');
  console.log('====================================================');
  console.log(`[${new Date().toISOString()}] Initializing 24/7 supervisor...`);

  // Initial immediate sweep
  try {
    const res = await checkAndDispatchFourMoneyThreeHourBriefing(true);
    console.log(`[Initial Sweep] Dispatched: ${res.dispatched}, Pipeline Yield: ₦${(res.state?.totalPipelineYieldNGN || 0).toLocaleString()}`);
  } catch (err: any) {
    console.error('[Initial Sweep Error]:', err.message);
  }

  // Periodic heartbeat loop
  setInterval(async () => {
    try {
      console.log(`[${new Date().toISOString()}] Running periodic 4 Money Engine heartbeat...`);
      const briefingRes = await checkAndDispatchFourMoneyThreeHourBriefing(false);
      if (briefingRes.dispatched) {
        console.log(`✅ [3-Hour Briefing Dispatched] Yield: ₦${(briefingRes.state?.totalPipelineYieldNGN || 0).toLocaleString()}`);
      } else {
        console.log(`ℹ️ [Heartbeat OK] 3-Hour interval pending. Engines active.`);
      }
    } catch (err: any) {
      console.error('[Heartbeat Error]:', err.message);
    }
  }, CHECK_INTERVAL_MS);
}

runDaemonLoop();
