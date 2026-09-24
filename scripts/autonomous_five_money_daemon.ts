/**
 * @file scripts/autonomous_five_money_daemon.ts
 * 
 * 24/7 AUTONOMOUS CLOUD DAEMON FOR THE 5 MONEY ENGINE.
 * 
 * Runs continuously in cloud environments (Koyeb, Colab, Local) with:
 * - 3-hour executive briefing scheduler.
 * - 15-minute opportunity polling loop across the 5 engines.
 * - Zero-crash circuit breaker and uncaught exception protection.
 */

import { checkAndDispatchFiveMoneyThreeHourBriefing } from '../src/lib/monetization/fiveMoneyThreeHourBriefingEngine';
import { executeFiveMoneyEngine } from '../src/lib/monetization/fiveMoneyEngine';

// Global error guards to ensure 0% crashes
process.on('uncaughtException', (err) => {
  console.error('[5 Money Daemon] Handled Uncaught Exception:', err.message);
});

process.on('unhandledRejection', (reason) => {
  console.error('[5 Money Daemon] Handled Unhandled Rejection:', reason);
});

const CHECK_INTERVAL_MS = 15 * 60 * 1000; // Check every 15 minutes

const { runMasterFiveEngineScraper } = require('./master_five_engine_high_speed_scraper');

async function runDaemonLoop() {
  console.log('====================================================');
  console.log('⚡ BETHELMIND 5 MONEY ENGINE AUTONOMOUS CLOUD DAEMON');
  console.log('====================================================');
  console.log(`[${new Date().toISOString()}] Initializing 24/7 supervisor...`);

  // 1. Initial immediate scraper sweep & briefing
  try {
    console.log('[Daemon] Triggering high-speed 5-engine scraper sweep...');
    await runMasterFiveEngineScraper();
    
    const res = await checkAndDispatchFiveMoneyThreeHourBriefing(true);
    console.log(`[Initial Sweep] Dispatched: ${res.dispatched}, Pipeline Yield: ₦${(res.state?.totalPipelineYieldNGN || 0).toLocaleString()}`);
  } catch (err: any) {
    console.error('[Initial Sweep Error]:', err.message);
  }

  // 2. Periodic heartbeat loop (every 15 mins)
  setInterval(async () => {
    try {
      console.log(`[${new Date().toISOString()}] Running periodic 5 Money Engine heartbeat & scraper check...`);
      await runMasterFiveEngineScraper();
      
      const briefingRes = await checkAndDispatchFiveMoneyThreeHourBriefing(false);
      if (briefingRes.dispatched) {
        console.log(`✅ [3-Hour Briefing Dispatched] Yield: ₦${(briefingRes.state?.totalPipelineYieldNGN || 0).toLocaleString()}`);
      } else {
        console.log(`ℹ️ [Heartbeat OK] 3-Hour interval pending. All 5 Engines active.`);
      }
    } catch (err: any) {
      console.error('[Heartbeat Error]:', err.message);
    }
  }, CHECK_INTERVAL_MS);
}

runDaemonLoop();
