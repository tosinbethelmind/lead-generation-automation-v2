/**
 * keep_alive_runner.js
 * 
 * Keeps local_job_runner.ts alive at all times while the laptop is awake.
 * - Auto-restarts the runner if it crashes or exits
 * - Detects laptop wake-from-sleep and gives the runner time to reconnect
 * - Prints a heartbeat every 5 minutes so you can confirm it's still running
 */

const { spawn } = require('child_process');
const path = require('path');

const projectDir = path.resolve(__dirname, '..');

let childProcess = null;
let restartCount = 0;
let lastRestartTime = Date.now();
let isIntentionallyStopped = false;

// ── Heartbeat: print status every 5 minutes ──────────────────────────────
const HEARTBEAT_INTERVAL_MS = 5 * 60 * 1000;
setInterval(() => {
  const uptimeMinutes = Math.round((Date.now() - lastRestartTime) / 60000);
  console.log(`[KeepAlive] ✅ Heartbeat — Runner active. Restarts: ${restartCount}. Current session uptime: ${uptimeMinutes}m`);
}, HEARTBEAT_INTERVAL_MS);

// ── Wake-from-sleep detection ─────────────────────────────────────────────
// If more than 3 minutes pass between heartbeat checks, the laptop was likely sleeping.
let lastWakeCheck = Date.now();
const SLEEP_DETECT_INTERVAL_MS = 30 * 1000; // check every 30s
const SLEEP_GAP_THRESHOLD_MS = 3 * 60 * 1000; // 3+ min gap = sleep detected

setInterval(() => {
  const now = Date.now();
  const gap = now - lastWakeCheck;
  lastWakeCheck = now;

  if (gap > SLEEP_GAP_THRESHOLD_MS) {
    const sleepMinutes = Math.round(gap / 60000);
    console.log(`\n[KeepAlive] 💤 Laptop wake-from-sleep detected (was asleep ~${sleepMinutes} minutes).`);
    console.log(`[KeepAlive] ⏳ Waiting 10s for network to reconnect before restarting runner...`);

    // Kill the current runner and let it restart fresh after the network comes up
    if (childProcess) {
      try {
        childProcess.kill();
      } catch (_) {}
    }

    // Delay restart by 10s to allow network/Supabase to reconnect
    setTimeout(() => {
      if (!isIntentionallyStopped) {
        console.log('[KeepAlive] 🔄 Post-sleep restart triggered.');
        startRunner();
      }
    }, 10000);
  }
}, SLEEP_DETECT_INTERVAL_MS);

// ── Graceful shutdown ─────────────────────────────────────────────────────
process.on('SIGINT', () => {
  isIntentionallyStopped = true;
  console.log('\n[KeepAlive] SIGINT received — shutting down gracefully...');
  if (childProcess) childProcess.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  isIntentionallyStopped = true;
  console.log('[KeepAlive] SIGTERM received — shutting down gracefully...');
  if (childProcess) childProcess.kill();
  process.exit(0);
});

// ── Global Error / Rejection Interceptors ─────────────────────────────────
process.on('uncaughtException', (err) => {
  console.error('[KeepAlive UncaughtException] Fatal error caught globally:', err.stack || err.message || err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[KeepAlive UnhandledRejection] Unhandled Promise rejection at:', promise, 'reason:', reason);
});

// ── Runner process management ─────────────────────────────────────────────
function startRunner() {
  if (isIntentionallyStopped) return;

  console.log(`\n[KeepAlive] 🚀 Starting local_job_runner.ts... (restart #${restartCount})`);
  lastRestartTime = Date.now();

  try {
    childProcess = spawn('npx', ['tsx', 'scripts/local_job_runner.ts'], {
      stdio: 'inherit',
      cwd: projectDir,
      shell: true
    });

    childProcess.on('close', (code) => {
      if (isIntentionallyStopped) return;
      restartCount++;
      const delay = Math.min(5000 * restartCount, 30000); // exponential up to 30s max
      console.log(`[KeepAlive] ⚠️ Runner exited with code ${code}. Restarting in ${delay / 1000}s...`);
      setTimeout(startRunner, delay);
    });

    childProcess.on('error', (err) => {
      if (isIntentionallyStopped) return;
      restartCount++;
      console.error(`[KeepAlive] ❌ Runner process error:`, err.message);
      const delay = Math.min(5000 * restartCount, 30000);
      console.log(`[KeepAlive] Retrying in ${delay / 1000}s...`);
      setTimeout(startRunner, delay);
    });
  } catch (err) {
    if (isIntentionallyStopped) return;
    restartCount++;
    console.error(`[KeepAlive] ❌ Direct spawn failed:`, err.message);
    const delay = Math.min(5000 * restartCount, 30000);
    setTimeout(startRunner, delay);
  }
}

console.log('====================================================');
console.log('🔁 ApexReach Keep-Alive Runner Starting');
console.log(`   Project: ${projectDir}`);
console.log('   Heartbeat: every 5 minutes');
console.log('   Sleep detection: active');
console.log('   Auto-restart: yes (exponential backoff to 30s max)');
console.log('====================================================');

startRunner();
