/**
 * @file scripts/cloud_runner_entrypoint.js
 * 
 * BETHELMIND ANALYTICS 24/7 KOYEB / CLOUD SUPERVISOR ENGINE.
 * 
 * 1. Starts a reliable HTTP health check server for Koyeb / Fly.io / Render.
 * 2. Spawns and supervises:
 *    - Continuous Lead Harvester & Local Job Runner (scripts/keep_alive_runner.js)
 *    - Autonomous Multi-Channel Traffic Engine (scripts/autonomous_traffic_daemon.js)
 *    - Viral WhatsApp Channel Broadcaster (Daily 10:00 AM WAT)
 *    - Strategic AI Executive Decision Engine (Twice daily briefing + urgent alerts to bethelmindrecruit@gmail.com)
 * 3. Self-healing auto-restart mechanism on crash.
 */

const http = require('http');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const PORT = parseInt(process.env.PORT || '8080', 10);
const projectDir = path.resolve(__dirname, '..');

// ── 1. Minimal Health Check HTTP Server ──────────────────────────────────────
const server = http.createServer((req, res) => {
  const isHealthy = true;
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    status: 'ONLINE',
    brand: 'Bethelmind Analytics 24/7 Cloud Engine',
    port: PORT,
    timestamp: new Date().toISOString(),
    watTime: new Date().toLocaleString('en-US', { timeZone: 'Africa/Lagos' }),
    healthy: isHealthy
  }));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`=================================================================`);
  console.log(`🚀 [Bethelmind Cloud Supervisor] Health server listening on 0.0.0.0:${PORT}`);
  console.log(`=================================================================`);
});

// ── 2. Supervised Process Spawner ───────────────────────────────────────────
function launchProcess(name, cmd, args, restartDelayMs = 10000) {
  console.log(`[CloudSupervisor] Launching ${name}...`);
  const child = spawn(cmd, args, {
    stdio: 'inherit',
    cwd: projectDir,
    shell: true,
  });

  child.on('close', (code) => {
    console.log(`⚠️ [CloudSupervisor] ${name} exited with code ${code}. Auto-restarting in ${restartDelayMs/1000}s...`);
    setTimeout(() => launchProcess(name, cmd, args, restartDelayMs), restartDelayMs);
  });

  child.on('error', (err) => {
    console.error(`❌ [CloudSupervisor] Error in ${name}:`, err.message);
    setTimeout(() => launchProcess(name, cmd, args, restartDelayMs), restartDelayMs);
  });

  return child;
}

// ── 3. Launch Core Workers ──────────────────────────────────────────────────
// Worker A: Queue & Lead Harvest Pipeline
launchProcess('Queue & Job Pipeline', 'node', ['scripts/keep_alive_runner.js'], 8000);

// Worker B: Autonomous Traffic & Indexing Engine
launchProcess('Autonomous Traffic Engine', 'node', ['scripts/autonomous_traffic_daemon.js'], 15000);

// Worker C: Executive Strategic AI & Urgent Alert Watchdog
launchProcess('Executive AI Decision Watchdog', 'npx', ['tsx', 'scripts/dispatch_ai_decision_briefing.js'], 60000);

// ── 4. Scheduled Daily Broadcaster (10:00 AM WAT) ──────────────────────────
let lastBroadcast = '';
setInterval(() => {
  const now = new Date();
  const utcHours = now.getUTCHours();
  const watHour = (utcHours + 1) % 24;
  const today = now.toISOString().split('T')[0];

  if (watHour === 10 && lastBroadcast !== today) {
    lastBroadcast = today;
    console.log('📢 [CloudSupervisor] Triggering Scheduled 10:00 AM WAT WhatsApp Channel Broadcast...');
    spawn('node', ['scripts/whatsapp_viral_channel_bot.js'], {
      cwd: projectDir,
      shell: true,
      stdio: 'inherit'
    });
  }
}, 10 * 60 * 1000);
