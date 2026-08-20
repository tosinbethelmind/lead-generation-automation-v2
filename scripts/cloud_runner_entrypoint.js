/**
 * @file scripts/cloud_runner_entrypoint.js
 * 
 * BETHELMIND ANALYTICS 100% AUTONOMOUS 24/7 CLOUD ORCHESTRATOR & SUPERVISOR.
 * 
 * Runs 100% autonomously without needing any manual button clicks:
 * 1. Health Server for Koyeb (Port 8080)
 * 2. Automated Lead Harvesting & Supabase Sync Daemon (24/7)
 * 3. Automated Organic Multi-Channel Traffic & Google Indexing (Every 6h)
 * 4. Automated Daily Viral WhatsApp Channel Broadcaster (10:00 AM WAT)
 * 5. Automated AI Executive Strategic Briefing & Urgent Alert Router (Twice daily)
 * 6. Automated Lead Staging & Quality Assurance Guardrails
 */

const http = require('http');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const PORT = parseInt(process.env.PORT || '8080', 10);
const projectDir = path.resolve(__dirname, '..');

console.log('========================================================================');
console.log('🚀 BETHELMIND ANALYTICS: 100% FULLY AUTONOMOUS 24/7 CLOUD ENGINE');
console.log('========================================================================\n');

// ── 1. Koyeb HTTP Health Check Server ───────────────────────────────────────
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    status: 'ONLINE',
    mode: 'FULLY_AUTONOMOUS_24_7',
    brand: 'Bethelmind Analytics B2B Engine',
    timestamp: new Date().toISOString(),
    watTime: new Date().toLocaleString('en-US', { timeZone: 'Africa/Lagos' }),
    closerDesk: '+234 802 279 1227',
    adminEmail: 'bethelmindrecruit@gmail.com'
  }));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[CloudOrchestrator] 🌐 24/7 HTTP Health server active on 0.0.0.0:${PORT}`);
});

// ── 2. Autonomous Supervisor Process Spawner ─────────────────────────────────
function launchProcess(name, cmd, args, restartDelayMs = 10000) {
  console.log(`[Supervisor] ⚡ Launching Autonomous Worker: ${name}...`);
  const child = spawn(cmd, args, {
    stdio: 'inherit',
    cwd: projectDir,
    shell: true,
  });

  child.on('close', (code) => {
    console.log(`⚠️ [Supervisor] ${name} completed/exited (code ${code}). Auto-restarting in ${restartDelayMs/1000}s...`);
    setTimeout(() => launchProcess(name, cmd, args, restartDelayMs), restartDelayMs);
  });

  child.on('error', (err) => {
    console.error(`❌ [Supervisor] Error in ${name}:`, err.message);
    setTimeout(() => launchProcess(name, cmd, args, restartDelayMs), restartDelayMs);
  });

  return child;
}

// ── 3. Start Autonomous 24/7 Subsystems ───────────────────────────────────────
// Worker A: Queue & Lead Harvesting Runner (Scrapes, cleans, deduplicates to Supabase)
launchProcess('Lead Harvester & Pipeline Runner', 'node', ['scripts/keep_alive_runner.js'], 8000);

// Worker B: Autonomous Traffic Generation & Google Indexing (Runs every 6 hours)
launchProcess('Autonomous Traffic & Google Indexing Engine', 'node', ['scripts/autonomous_traffic_daemon.js'], 15000);

// ── 4. Scheduled Strategic AI Decision Briefings (08:00 AM & 08:00 PM WAT) ──
let lastBriefingTime = '';
setInterval(() => {
  const now = new Date();
  const utcHours = now.getUTCHours();
  const watHour = (utcHours + 1) % 24;
  const currentKey = `${now.toISOString().split('T')[0]}_${watHour}`;

  // Fire Morning Briefing @ 08:00 AM WAT and Evening Digest @ 08:00 PM (20:00) WAT
  if ((watHour === 8 || watHour === 20) && lastBriefingTime !== currentKey) {
    lastBriefingTime = currentKey;
    console.log(`🧠 [Supervisor] Formulating and dispatching scheduled Executive AI Briefing (${watHour}:00 WAT)...`);
    spawn('npx', ['tsx', 'scripts/dispatch_ai_decision_briefing.js'], {
      cwd: projectDir,
      shell: true,
      stdio: 'inherit'
    });
  }
}, 5 * 60 * 1000);

// ── 5. Scheduled Daily WhatsApp Viral Broadcast (10:00 AM WAT) ─────────────
let lastBroadcastDate = '';
setInterval(() => {
  const now = new Date();
  const utcHours = now.getUTCHours();
  const watHour = (utcHours + 1) % 24;
  const today = now.toISOString().split('T')[0];

  if (watHour === 10 && lastBroadcastDate !== today) {
    lastBroadcastDate = today;
    console.log('📢 [Supervisor] Triggering Scheduled 10:00 AM WAT WhatsApp Channel Broadcast...');
    spawn('node', ['scripts/whatsapp_viral_channel_bot.js'], {
      cwd: projectDir,
      shell: true,
      stdio: 'inherit'
    });
  }
}, 10 * 60 * 1000);

console.log('✨ All 24/7 Autonomous Subsystems initiated. System runs hands-off without manual intervention.\n');
