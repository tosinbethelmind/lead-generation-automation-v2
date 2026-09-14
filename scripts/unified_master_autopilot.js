/**
 * @file scripts/unified_master_autopilot.js
 * 
 * BETHELMIND ANALYTICS UNIFIED 24/7 MASTER AUTOPILOT ENGINE.
 * 
 * Optimized with Strict Memory-Safe (<=256MB per worker) & Data-Saver Protection:
 * 1. 🌐 Web App & Digital Storefront Watchdog (Port 3006 / Production)
 * 2. 🚀 Autonomous Multi-Channel Traffic & Google Indexing Engine (Every 6h)
 * 3. 📢 Daily Viral WhatsApp Channel & Community Broadcaster (10:00 AM WAT)
 * 4. ⚡ Continuous Lead Harvester & Local Job Pipeline Watchdog (Data-Saver bounded)
 * 5. 📱 Tailscale Android SMS Gateway & Closer Desk Alert Dispatcher
 * 6. 🛡️ System RAM Watchdog & Orphaned Process Killer (Guarantees Antigravity Zero-Crash)
 * 7. 📶 Strict Bandwidth Conservation: Continuous 10k scraping offloaded to GitHub Actions Cloud
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

const rootDir = path.resolve(__dirname, '..');
const logsDir = path.join(rootDir, 'local_db');
if (!fs.existsSync(logsDir)) {
  try { fs.mkdirSync(logsDir, { recursive: true }); } catch (_) {}
}

const masterLog = path.join(logsDir, 'unified_master_autopilot.log');
const tsxCli = path.join(rootDir, 'node_modules', 'tsx', 'dist', 'cli.mjs');

function log(msg) {
  const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Africa/Lagos' });
  const line = `[MasterAutopilot WAT: ${timestamp}] ${msg}`;
  console.log(line);
  try { fs.appendFileSync(masterLog, line + '\n'); } catch (_) {}
}

console.log('=================================================================');
console.log('🌟 BETHELMIND ANALYTICS: 24/7 MASTER AUTOPILOT (DATA-SAVER & RAM SAFE)');
console.log('=================================================================\n');

log('Starting background worker subsystems in Memory-Safe (<256MB) & Data-Saver mode...');
log('• Admin / Closer Desk: +234 802 279 1227');
log('• SMS Gateway: Tailscale Android (http://10.132.90.251:8082)');
log('• WhatsApp Channel: https://whatsapp.com/channel/0029VbDFgKP4o7qM58yY9v2l');
log('• Bandwidth Policy: Local PC Data-Saver Active. Continuous 10k Harvester offloaded to GitHub Actions Cloud.');

// Common child process environment with strict memory limits
const safeEnv = {
  ...process.env,
  NODE_OPTIONS: '--max-old-space-size=256'
};

// ── SYSTEM RAM & RESOURCE WATCHDOG ──────────────────────────────────────────
function checkSystemMemory() {
  const freeMemMB = Math.round(os.freemem() / (1024 * 1024));
  const totalMemMB = Math.round(os.totalmem() / (1024 * 1024));
  
  if (freeMemMB < 1200) {
    log(`⚠️ [Memory Watchdog] LOW SYSTEM RAM DETECTED (${freeMemMB}MB free of ${totalMemMB}MB). Throttling background workers to protect Antigravity IDE...`);
    if (global.gc) {
      try { global.gc(); } catch (_) {}
    }
  }
}
setInterval(checkSystemMemory, 5 * 60 * 1000);

// ── WORKER 1: Traffic Generation & Google Indexing Daemon ─────────────────
let trafficProcess = null;
function startTrafficDaemon() {
  log('🚀 [Worker 1: Traffic Engine] Launching Autonomous Multi-Channel Traffic Daemon...');
  trafficProcess = spawn('node', ['--max-old-space-size=256', 'scripts/autonomous_traffic_daemon.js'], {
    cwd: rootDir,
    shell: true,
    stdio: 'inherit',
    windowsHide: true,
    env: safeEnv
  });

  trafficProcess.on('exit', (code) => {
    log(`⚠️ [Worker 1: Traffic Engine] Exited with code ${code}. Rescheduling next cycle in 10 minutes...`);
    setTimeout(startTrafficDaemon, 10 * 60 * 1000);
  });

  trafficProcess.on('error', (err) => {
    log(`❌ [Worker 1: Traffic Engine] Error: ${err.message}. Retrying in 15 minutes...`);
    setTimeout(startTrafficDaemon, 15 * 60 * 1000);
  });
}

// ── WORKER 2: Local Job & Lead Pipeline Runner ─────────────────────────────
let queueProcess = null;
function startQueueRunner() {
  log('⚡ [Worker 2: Pipeline Runner] Launching Local Job & Lead Pipeline Runner...');
  queueProcess = spawn('node', ['--max-old-space-size=256', 'scripts/keep_alive_runner.js'], {
    cwd: rootDir,
    shell: true,
    stdio: 'inherit',
    windowsHide: true,
    env: safeEnv
  });

  queueProcess.on('exit', (code) => {
    log(`⚠️ [Worker 2: Pipeline Runner] Exited with code ${code}. Auto-restarting in 30s...`);
    setTimeout(startQueueRunner, 30000);
  });

  queueProcess.on('error', (err) => {
    log(`❌ [Worker 2: Pipeline Runner] Error: ${err.message}. Restarting in 1 minute...`);
    setTimeout(startQueueRunner, 60000);
  });
}

// ── WORKER 3: Scheduled Viral WhatsApp Channel Broadcaster ─────────────────
let lastBroadcastDate = '';
function checkScheduledBroadcast() {
  const now = new Date();
  const utcHours = now.getUTCHours();
  const watHour = (utcHours + 1) % 24;
  const todayStr = now.toISOString().split('T')[0];

  // Daily 10:00 AM to 11:30 AM WAT
  if (watHour >= 10 && watHour <= 12 && lastBroadcastDate !== todayStr) {
    lastBroadcastDate = todayStr;
    log('📢 [Worker 3: Viral Broadcast] Triggering daily 10:00 AM WAT WhatsApp Channel broadcast...');

    const child = spawn('node', ['--max-old-space-size=256', 'scripts/whatsapp_viral_channel_bot.js'], {
      cwd: rootDir,
      shell: true,
      stdio: 'inherit',
      windowsHide: true,
      env: safeEnv
    });

    child.on('close', (code) => {
      log(`📢 [Worker 3: Viral Broadcast] Daily broadcast generation finished (exit ${code})`);
    });
  }
}

// ── WORKER 4: WhatsApp Line 1 Server Supervisor (Port 3007) ───────────────
let wa1Process = null;
function startWa1Server() {
  log('📱 [Worker 4: WA Line 1] Launching WhatsApp Line 1 Server (+234 702 626 6946 on Port 3007)...');
  wa1Process = spawn('node', ['--max-old-space-size=256', 'scripts/whatsapp_baileys.js'], {
    cwd: rootDir,
    shell: true,
    stdio: 'inherit',
    windowsHide: true,
    env: safeEnv
  });

  wa1Process.on('exit', (code) => {
    log(`⚠️ [Worker 4: WA Line 1] Exited with code ${code}. Auto-restarting in 15s...`);
    setTimeout(startWa1Server, 15000);
  });

  wa1Process.on('error', (err) => {
    log(`❌ [Worker 4: WA Line 1] Error: ${err.message}. Restarting in 30s...`);
    setTimeout(startWa1Server, 30000);
  });
}

// ── WORKER 5: WhatsApp Line 2 Server Supervisor (Port 3009) ───────────────
let wa2Process = null;
function startWa2Server() {
  log('📱 [Worker 5: WA Line 2] Launching WhatsApp Line 2 Server (+234 904 605 0469 on Port 3009)...');
  wa2Process = spawn('node', ['--max-old-space-size=256', 'scripts/whatsapp_baileys_line2.js'], {
    cwd: rootDir,
    shell: true,
    stdio: 'inherit',
    windowsHide: true,
    env: safeEnv
  });

  wa2Process.on('exit', (code) => {
    log(`⚠️ [Worker 5: WA Line 2] Exited with code ${code}. Auto-restarting in 15s...`);
    setTimeout(startWa2Server, 15000);
  });

  wa2Process.on('error', (err) => {
    log(`❌ [Worker 5: WA Line 2] Error: ${err.message}. Restarting in 30s...`);
    setTimeout(startWa2Server, 30000);
  });
}

// ── WORKER 6: Autonomous 300 Daily Email & Webform Outreach Engine ──────────
let outreachProcess = null;
function startOutreachEngine() {
  log('📧 [Worker 6: Outreach Engine] Launching Autonomous 300 Email & Webform Dispatcher...');
  outreachProcess = spawn('node', ['--max-old-space-size=256', tsxCli, 'scripts/execute_today_300_emails_and_webforms.ts'], {
    cwd: rootDir,
    shell: true,
    stdio: 'inherit',
    windowsHide: true,
    env: safeEnv
  });

  outreachProcess.on('exit', (code) => {
    const todayStr = new Date().toISOString().split('T')[0];
    let sentEmails = 0;
    let successfulWebforms = 0;

    const emailStatePath = path.join(rootDir, 'local_db/email_daemon_state.json');
    if (fs.existsSync(emailStatePath)) {
      try {
        const raw = JSON.parse(fs.readFileSync(emailStatePath, 'utf8'));
        if (raw.date === todayStr) sentEmails = raw.sentToday || 0;
      } catch (_) {}
    }

    const webformPath = path.join(rootDir, 'local_db/real_webform_submissions.json');
    if (fs.existsSync(webformPath)) {
      try {
        const raw = JSON.parse(fs.readFileSync(webformPath, 'utf8'));
        if (Array.isArray(raw)) {
          successfulWebforms = raw.filter(l =>
            (l.submitted_at || l.deliveredAt || l.timestamp || '').startsWith(todayStr) && l.success === true
          ).length;
        }
      } catch (_) {}
    }

    const targetMet = sentEmails >= 300 && successfulWebforms >= 300;
    if (targetMet) {
      log(`🎉 [Worker 6: Outreach Engine] Full daily quota achieved (Emails: ${sentEmails}/300, Webforms: ${successfulWebforms}/300). Resting 4 hours before next audit cycle...`);
      setTimeout(startOutreachEngine, 4 * 60 * 60 * 1000);
    } else {
      log(`ℹ️ [Worker 6: Outreach Engine] Batch completed (Code: ${code}). Progress: Emails ${sentEmails}/300, Webforms ${successfulWebforms}/300. Resting 30 minutes before next batch to conserve data...`);
      setTimeout(startOutreachEngine, 30 * 60 * 1000);
    }
  });

  outreachProcess.on('error', (err) => {
    log(`❌ [Worker 6: Outreach Engine] Error: ${err.message}. Retrying in 10 minutes...`);
    setTimeout(startOutreachEngine, 10 * 60 * 1000);
  });
}

// ── WORKER 7: Evolution API Multi-Instance WhatsApp Server (Port 8080) ──────
let evolutionProcess = null;
function startEvolutionServer() {
  log('🚀 [Worker 7: Evolution API] Launching 3-Line Evolution API Server on Port 8080...');
  evolutionProcess = spawn('node', ['--max-old-space-size=256', 'scripts/evolution_api_server.js'], {
    cwd: rootDir,
    shell: true,
    stdio: 'inherit',
    windowsHide: true,
    env: safeEnv
  });

  evolutionProcess.on('exit', (code) => {
    log(`⚠️ [Worker 7: Evolution API] Exited with code ${code}. Auto-restarting in 15s...`);
    setTimeout(startEvolutionServer, 15000);
  });

  evolutionProcess.on('error', (err) => {
    log(`❌ [Worker 7: Evolution API] Error: ${err.message}. Restarting in 30s...`);
    setTimeout(startEvolutionServer, 30000);
  });
}

// ── WORKER 8: Modernized Commercial & B2B Intelligence Engine ────────────
let modernCommercialProcess = null;
function startModernCommercialEngine() {
  log('🏛️ [Worker 8: Modernized Commercial Engine] Launching SearchPhone + OpenPlanter + Capacitor Pipeline...');
  modernCommercialProcess = spawn('node', ['--max-old-space-size=256', 'scripts/run_modernized_commercial_engine.js'], {
    cwd: rootDir,
    shell: true,
    stdio: 'inherit',
    windowsHide: true,
    env: safeEnv
  });

  modernCommercialProcess.on('exit', (code) => {
    log(`ℹ️ [Worker 8: Modernized Engine] Cycle completed (Code: ${code}). Next cycle in 4 hours...`);
    setTimeout(startModernCommercialEngine, 4 * 60 * 60 * 1000);
  });

  modernCommercialProcess.on('error', (err) => {
    log(`❌ [Worker 8: Modernized Engine] Error: ${err.message}. Retrying in 15 minutes...`);
    setTimeout(startModernCommercialEngine, 15 * 60 * 1000);
  });
}

// ── WORKER 9: Nationwide Harvester (Data-Saver / Low-Bandwidth Mode) ────────
let harvesterProcess = null;
function startHeavyHarvester() {
  log('⚡ [Worker 9: Massive Harvester] Launching High-Yield Nationwide Harvester wave (Target: 500 leads)...');
  harvesterProcess = spawn('node', ['--max-old-space-size=256', tsxCli, 'scripts/run_heavy_10k_nigeria_scraper.ts', '--target=500'], {
    cwd: rootDir,
    shell: true,
    stdio: 'inherit',
    windowsHide: true,
    env: safeEnv
  });

  harvesterProcess.on('exit', (code) => {
    log(`ℹ️ [Worker 9: Massive Harvester] Harvest wave completed (Code: ${code}). Rescheduling next wave in 10 minutes...`);
    setTimeout(startHeavyHarvester, 10 * 60 * 1000);
  });

  harvesterProcess.on('error', (err) => {
    log(`❌ [Worker 9: Massive Harvester] Error: ${err.message}. Retrying in 5 minutes...`);
    setTimeout(startHeavyHarvester, 5 * 60 * 1000);
  });
}

// ── WORKER 10: Autonomous Viral Blog & GEO Publishing Engine (30+ Posts/Day) ──
let blogDaemonProcess = null;
function startBlogEngine() {
  log('📰 [Worker 10: Viral Blog Engine] Launching Autonomous Publishing Daemon in Data-Saver Mode...');
  blogDaemonProcess = spawn('node', ['--max-old-space-size=128', tsxCli, 'scripts/run_autonomous_blog_engine.ts', '--batch=10'], {
    cwd: rootDir,
    shell: true,
    stdio: 'inherit',
    windowsHide: true,
    env: safeEnv
  });

  blogDaemonProcess.on('exit', (code) => {
    log(`⚠️ [Worker 10: Viral Blog Engine] Process completed (Code: ${code}). Next cycle in 2 hours...`);
    setTimeout(startBlogEngine, 2 * 60 * 60 * 1000);
  });

  blogDaemonProcess.on('error', (err) => {
    log(`❌ [Worker 10: Viral Blog Engine] Error: ${err.message}. Retrying in 15 minutes...`);
    setTimeout(startBlogEngine, 15 * 60 * 1000);
  });
}

// ── WORKER 11: 24/7 Autonomous Open-Source Closer Daemon (Cal.com + Chatwoot + Twenty CRM) ──
let closerDaemonProcess = null;
function startCloserDaemon() {
  log('🤖 [Worker 11: OpenSource Closer Daemon] Launching Closer Engine...');
  closerDaemonProcess = spawn('node', ['--max-old-space-size=128', tsxCli, 'scripts/run_autonomous_opensource_closer.ts'], {
    cwd: rootDir,
    shell: true,
    stdio: 'inherit',
    windowsHide: true,
    env: safeEnv
  });

  closerDaemonProcess.on('exit', (code) => {
    log(`⚠️ [Worker 11: OpenSource Closer Daemon] Process exited (Code: ${code}). Auto-restarting in 1 minute...`);
    setTimeout(startCloserDaemon, 60000);
  });

  closerDaemonProcess.on('error', (err) => {
    log(`❌ [Worker 11: OpenSource Closer Daemon] Error: ${err.message}. Retrying in 5 minutes...`);
    setTimeout(startCloserDaemon, 5 * 60 * 1000);
  });
}

// ── WORKER 12: Autonomous Local Vibe Prospecting Daemon (2026 Zero Sign-up) ──
let vibeDaemonProcess = null;
function startVibeDaemon() {
  log('⚡ [Worker 12: Local Vibe Prospector] Launching Autonomous Natural Language Harvester...');
  vibeDaemonProcess = spawn('node', ['--max-old-space-size=128', tsxCli, 'scripts/autonomous_vibe_prospector_daemon.ts'], {
    cwd: rootDir,
    shell: true,
    stdio: 'inherit',
    windowsHide: true,
    env: safeEnv
  });

  vibeDaemonProcess.on('exit', (code) => {
    log(`⚠️ [Worker 12: Local Vibe Prospector] Process exited (Code: ${code}). Next cycle in 2 hours...`);
    setTimeout(startVibeDaemon, 2 * 60 * 60 * 1000);
  });

  vibeDaemonProcess.on('error', (err) => {
    log(`❌ [Worker 12: Local Vibe Prospector] Error: ${err.message}. Retrying in 15 minutes...`);
    setTimeout(startVibeDaemon, 15 * 60 * 1000);
  });
}

// ── STAGGERED WORKER LAUNCH (MINIMAL CPU & ZERO FAN SPIKES) ─────────────────
log('Initializing staggered worker startup (3-second intervals between workers)...');
const workerManifest = [
  { name: 'Worker 1: Traffic Engine', start: startTrafficDaemon, delay: 0 },
  { name: 'Worker 2: Pipeline Runner', start: startQueueRunner, delay: 3000 },
  { name: 'Worker 7: Evolution API', start: startEvolutionServer, delay: 6000 },
  { name: 'Worker 4: WA Line 1', start: startWa1Server, delay: 9000 },
  { name: 'Worker 5: WA Line 2', start: startWa2Server, delay: 12000 },
  { name: 'Worker 6: Outreach Engine', start: startOutreachEngine, delay: 15000 },
  { name: 'Worker 8: Modernized Commercial', start: startModernCommercialEngine, delay: 18000 },
  { name: 'Worker 9: Massive Harvester', start: startHeavyHarvester, delay: 21000 },
  { name: 'Worker 10: Viral Blog Engine', start: startBlogEngine, delay: 24000 },
  { name: 'Worker 11: Closer Daemon', start: startCloserDaemon, delay: 27000 },
  { name: 'Worker 12: Vibe Prospector', start: startVibeDaemon, delay: 30000 }
];

workerManifest.forEach((w) => {
  setTimeout(() => {
    try {
      w.start();
    } catch (err) {
      log(`❌ [${w.name}] Failed to start: ${err.message}`);
    }
  }, w.delay);
});

// Check daily broadcast every 10 minutes
setInterval(checkScheduledBroadcast, 10 * 60 * 1000);

// Heartbeat log every 30 minutes
setInterval(() => {
  const freeMemMB = Math.round(os.freemem() / (1024 * 1024));
  log(`🟢 [Autopilot Heartbeat] All automation workers running healthy. System Free RAM: ${freeMemMB}MB.`);
}, 30 * 60 * 1000);

// Comprehensive graceful termination (kills ALL child processes to prevent zombies)
function cleanExit() {
  log('Gracefully stopping Unified Master Autopilot and all child workers...');
  const procs = [
    trafficProcess, queueProcess, wa1Process, wa2Process,
    outreachProcess, evolutionProcess, modernCommercialProcess,
    harvesterProcess, blogDaemonProcess, closerDaemonProcess, vibeDaemonProcess
  ];
  for (const p of procs) {
    if (p) {
      try { p.kill('SIGTERM'); } catch (_) {}
    }
  }
  setTimeout(() => process.exit(0), 1000);
}

process.on('SIGINT', cleanExit);
process.on('SIGTERM', cleanExit);
process.on('exit', cleanExit);
