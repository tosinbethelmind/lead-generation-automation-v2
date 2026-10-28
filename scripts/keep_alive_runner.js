/**
 * keep_alive_runner.js
 * 
 * Keeps local_job_runner.ts alive at all times while the laptop is awake.
 * - Auto-restarts the runner if it crashes or exits
 * - Detects laptop wake-from-sleep and safely terminates old process tree with taskkill
 * - Strictly prevents duplicate zombie processes from accumulating
 * - Prints a heartbeat every 5 minutes so you can confirm it's still running
 */

const { spawn, execSync } = require('child_process');
const path = require('path');

const projectDir = path.resolve(__dirname, '..');

let childProcess = null;
let restartCount = 0;
let lastRestartTime = Date.now();
let isIntentionallyStopped = false;

function killProcessTree(pid) {
  if (!pid) return;
  try {
    if (process.platform === 'win32') {
      execSync(`taskkill /F /T /PID ${pid}`, { stdio: 'ignore' });
    } else {
      process.kill(-pid, 'SIGKILL');
    }
  } catch (_) {}
}

function isRunnerAlreadyRunning() {
  try {
    if (process.platform === 'win32') {
      const out = execSync('wmic process where "name=\'node.exe\' and commandline like \'%local_job_runner.ts%\'" get processid', {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore']
      });
      const pids = out.split(/\r?\n/).map(s => s.trim()).filter(s => /^\d+$/.test(s));
      return pids.length > 0;
    }
  } catch (_) {}
  return false;
}

// ── Heartbeat: print status every 5 minutes ──────────────────────────────
const HEARTBEAT_INTERVAL_MS = 5 * 60 * 1000;
setInterval(() => {
  const uptimeMinutes = Math.round((Date.now() - lastRestartTime) / 60000);
  console.log(`[KeepAlive] ✅ Heartbeat — Runner active. Restarts: ${restartCount}. Current session uptime: ${uptimeMinutes}m`);
}, HEARTBEAT_INTERVAL_MS);

// ── Wake-from-sleep detection ─────────────────────────────────────────────
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

    if (childProcess && childProcess.pid) {
      killProcessTree(childProcess.pid);
      childProcess = null;
    }

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
  if (childProcess && childProcess.pid) killProcessTree(childProcess.pid);
  process.exit(0);
});

process.on('SIGTERM', () => {
  isIntentionallyStopped = true;
  console.log('[KeepAlive] SIGTERM received — shutting down gracefully...');
  if (childProcess && childProcess.pid) killProcessTree(childProcess.pid);
  process.exit(0);
});

process.on('uncaughtException', (err) => {
  console.error('[KeepAlive UncaughtException] Fatal error caught globally:', err.stack || err.message || err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[KeepAlive UnhandledRejection] Unhandled Promise rejection at:', promise, 'reason:', reason);
});

// ── Runner process management ─────────────────────────────────────────────
function startRunner() {
  if (isIntentionallyStopped) return;

  // Single-instance check: do not start duplicate if one is already alive
  if (isRunnerAlreadyRunning()) {
    console.log('[KeepAlive] 🔒 local_job_runner.ts is already running in background. Waiting 60s before re-checking...');
    setTimeout(startRunner, 60000);
    return;
  }

  console.log(`\n[KeepAlive] 🚀 Starting local_job_runner.ts... (restart #${restartCount})`);
  lastRestartTime = Date.now();

  try {
    childProcess = spawn('npx', ['tsx', 'scripts/local_job_runner.ts'], {
      stdio: 'inherit',
      cwd: projectDir,
      shell: true,
      windowsHide: true
    });

    childProcess.on('close', (code) => {
      childProcess = null;
      if (isIntentionallyStopped) return;
      restartCount++;
      const delay = code === 0 ? 300000 : Math.min(5000 * restartCount, 60000);
      console.log(`[KeepAlive] ⚠️ Runner exited with code ${code}. Resting ${delay / 1000}s before next check...`);
      setTimeout(startRunner, delay);
    });

    childProcess.on('error', (err) => {
      childProcess = null;
      if (isIntentionallyStopped) return;
      restartCount++;
      console.error(`[KeepAlive] ❌ Runner process error:`, err.message);
      const delay = Math.min(5000 * restartCount, 30000);
      console.log(`[KeepAlive] Retrying in ${delay / 1000}s...`);
      setTimeout(startRunner, delay);
    });
  } catch (err) {
    childProcess = null;
    if (isIntentionallyStopped) return;
    restartCount++;
    console.error(`[KeepAlive] ❌ Direct spawn failed:`, err.message);
    const delay = Math.min(5000 * restartCount, 30000);
    setTimeout(startRunner, delay);
  }
}

console.log('====================================================');
console.log('🔁 Bethelmind Digital Solutions Keep-Alive Runner Starting');
console.log(`   Project: ${projectDir}`);
console.log('   Heartbeat: every 5 minutes');
console.log('   Sleep detection: active (taskkill tree cleanup enabled)');
console.log('   Auto-restart: yes (single instance protected)');
console.log('====================================================');

startRunner();
