/**
 * @file scripts/run_autonomous_opensource_closer.ts
 * 24/7 Autonomous Open-Source Closer & Pipeline Daemon
 *
 * Runs Chatwoot, Twenty CRM, and Cal.com appointment automation continuously.
 */

import * as fs from 'fs';
import * as path from 'path';
import { autonomousOpenSourceCloserDaemon } from '../src/lib/monetization/autonomousOpenSourceCloserDaemon';

// 🛡️ SUPREME LAW OF DATA & BANDWIDTH CONSERVATION: Single-Instance Mutex Guard
const LOCK_FILE = path.join(process.cwd(), '.closer.pid');
function acquireSingletonLock() {
  try {
    if (fs.existsSync(LOCK_FILE)) {
      const existingPid = parseInt(fs.readFileSync(LOCK_FILE, 'utf8').trim(), 10);
      if (existingPid && existingPid !== process.pid) {
        try {
          process.kill(existingPid, 0);
          console.log(`🔒 [Singleton Guard] Closer Daemon already active (PID ${existingPid}). Exiting duplicate.`);
          process.exit(0);
        } catch (_) {}
      }
    }
    fs.writeFileSync(LOCK_FILE, String(process.pid), 'utf8');
    const cleanup = () => {
      try {
        if (fs.existsSync(LOCK_FILE)) {
          const recorded = parseInt(fs.readFileSync(LOCK_FILE, 'utf8').trim(), 10);
          if (recorded === process.pid) fs.unlinkSync(LOCK_FILE);
        }
      } catch (_) {}
    };
    process.on('exit', cleanup);
    process.on('SIGINT', () => { cleanup(); process.exit(0); });
    process.on('SIGTERM', () => { cleanup(); process.exit(0); });
  } catch (_) {}
}
acquireSingletonLock();

async function startCloserDaemon() {
  console.log('===============================================================');
  console.log('   BETHELMIND 24/7 AUTONOMOUS OPEN-SOURCE CLOSER & PIPELINE   ');
  console.log('   Stack: Cal.com Scheduling + Chatwoot Closer + Twenty CRM    ');
  console.log('   100% Free & Open-Source • Zero Third-Party SaaS Fees       ');
  console.log('===============================================================\n');

  const runLoop = async () => {
    try {
      const status = await autonomousOpenSourceCloserDaemon.executeCycle();
      console.log(`[${new Date().toLocaleTimeString('en-GB')}] [CloserDaemon] Cycle Complete.`);
      console.log(`   Deals Advanced: ${status.dealsAdvancedToday} | Appointments Checked: ${status.appointmentsProcessedToday}`);
      console.log(`   Chatwoot: ${status.chatwootMode.toUpperCase()} | Twenty CRM: ${status.twentyMode.toUpperCase()}`);
    } catch (err: any) {
      console.error('[CloserDaemon] Cycle error:', err.message);
    }
  };

  // Run initial cycle immediately
  await runLoop();

  // Run every 3 minutes (Strict Data-Saver: 180s)
  setInterval(runLoop, 180000);
}

startCloserDaemon().catch(console.error);
