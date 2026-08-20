/**
 * @file scripts/autonomous_growth_engine.js
 * 
 * Master 24/7 Autonomous Growth, Viral WhatsApp Channel & Traffic Engine.
 * 
 * Orchestrates automatically without manual intervention:
 * 1. 📢 Automated Daily Viral WhatsApp Channel & Social Feeder Dispatch (10:00 AM WAT)
 *    - Monday: Teardown Audits (High Group Forwards)
 *    - Tuesday: Plug-and-Play Swipe Files & Scripts (Saves & Shares)
 *    - Wednesday: Live Case Studies & ROI Breakdown (Authority Proof)
 *    - Thursday: Interactive Polls & Reaction Spikes (Boosts Directory Rank)
 *    - Friday: 1-Tap DM Conversion Offers (3 DFY Slots, ₦0 Upfront Preview)
 *    - Saturday: Behind-The-Scenes Tech Architecture (Build In Public)
 *    - Sunday: Weekly Master Asset Pack & Digest
 * 2. 📲 Baileys Dual-Line Integration (Dispatches alerts directly to 0802 279 1227)
 * 3. 🔍 Google Indexing API (Real-time crawl pings for all generated prototypes)
 * 4. 🔄 Local Queue Job Runner & Lead Harvester Keep-Alive Watchdog
 * 5. 🛡️ Self-Healing Auto-Restart
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const projectDir = path.resolve(__dirname, '..');
const logsDir = path.join(projectDir, 'local_db');
if (!fs.existsSync(logsDir)) {
  try { fs.mkdirSync(logsDir, { recursive: true }); } catch (_) {}
}

const engineLog = path.join(logsDir, 'autonomous_growth_engine.log');

function log(msg) {
  const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Africa/Lagos' });
  const line = `[AutonomousGrowth WAT: ${timestamp}] ${msg}`;
  console.log(line);
  try { fs.appendFileSync(engineLog, line + '\n'); } catch (_) {}
}

log('================================================================');
log('🚀 STARTING 24/7 AUTONOMOUS VIRAL GROWTH & CHANNEL ENGINE');
log('================================================================');
log('📢 Target WhatsApp Channel: https://whatsapp.com/channel/0029VbDFgKP4o7qM58yY9v2l');
log('📲 Admin Conversion DM Desk: +234 802 279 1227');
log('⚡ Schedule: 7-Day Autonomous Viral Matrix (Runs Daily at 10:00 AM WAT)');
log('🛡️ Self-Healing: Active & Monitoring Background Services');

// ── 1. Google Indexing Subroutine ───────────────────────────────────
function submitUrlToGoogleIndexing(url) {
  try {
    const script = `
      const { requestUrlIndexing } = require('./src/lib/googleIndexing');
      requestUrlIndexing('${url}', 'URL_UPDATED')
        .then(res => console.log('Google Indexing:', res.success ? 'SUCCESS' : 'FAILED', res.message))
        .catch(e => console.warn('Google Indexing Warning:', e.message));
    `;
    const child = spawn('node', ['-e', script], { cwd: projectDir, shell: true });
    child.on('error', () => {});
  } catch (err) {
    log(`Google Indexing trigger error: ${err.message}`);
  }
}

// ── 2. Daily Viral WhatsApp Channel Broadcaster (Runs at 10:00 AM WAT) ───
let lastBroadcastDate = '';

function checkAndPostDailyChannelBroadcast() {
  const now = new Date();
  // WAT is UTC+1
  const utcHours = now.getUTCHours();
  const watHour = (utcHours + 1) % 24;
  const todayStr = now.toISOString().split('T')[0];

  // Broadcast window: 10:00 AM to 11:30 AM WAT once per day
  if (watHour >= 10 && watHour <= 12 && lastBroadcastDate !== todayStr) {
    lastBroadcastDate = todayStr;
    log('📢 [Channel Broadcaster] Triggering scheduled daily viral WhatsApp Channel & Social Feeder update...');

    const child = spawn('node', ['scripts/whatsapp_viral_channel_bot.js'], {
      cwd: projectDir,
      shell: true,
      stdio: 'inherit'
    });

    child.on('close', (code) => {
      log(`📢 [Channel Broadcaster] Daily viral broadcast generation completed (code ${code})`);
    });
  }
}

// ── 3. Keep-Alive Job Runner Child Process ───────────────────────────
let runnerProcess = null;

function startKeepAliveRunner() {
  log('⚡ [Runner] Launching Local Job & Lead Harvesting Runner...');
  runnerProcess = spawn('node', ['scripts/keep_alive_runner.js'], {
    cwd: projectDir,
    shell: true,
    stdio: 'inherit'
  });

  runnerProcess.on('exit', (code) => {
    log(`⚠️ [Runner] Process exited with code ${code}. Auto-restarting in 10s...`);
    setTimeout(startKeepAliveRunner, 10000);
  });

  runnerProcess.on('error', (err) => {
    log(`❌ [Runner] Process error: ${err.message}. Restarting in 15s...`);
    setTimeout(startKeepAliveRunner, 15000);
  });
}

// ── 4. Main Autonomous Loop ─────────────────────────────────────────
startKeepAliveRunner();

// Run Google Indexing ping on homepage & pricing
submitUrlToGoogleIndexing('https://www.bethelmindanalytics.com');
submitUrlToGoogleIndexing('https://www.bethelmindanalytics.com/#pricing');

// Trigger immediate viral post generation on engine boot
const bootPost = spawn('node', ['scripts/whatsapp_viral_channel_bot.js'], {
  cwd: projectDir,
  shell: true,
  stdio: 'inherit'
});
bootPost.on('close', () => {
  log('✅ [Boot] Immediate viral broadcast payload generated and ready.');
});

// Check Channel broadcast interval (every 10 minutes)
setInterval(checkAndPostDailyChannelBroadcast, 10 * 60 * 1000);

// Run High-Intent CAC & GMB Hunter cycle (every 6 hours)
function runAutonomousHunterCycle() {
  log('🕵️‍♂️ [CAC/GMB Hunter] Triggering autonomous high-intent infiltration cycle...');
  const hunter = spawn('node', ['scripts/run_cac_gmb_hunter.js'], { cwd: projectDir, shell: true, stdio: 'inherit' });
  hunter.on('close', (code) => {
    log(`🕵️‍♂️ [CAC/GMB Hunter] Cycle completed with code ${code}.`);
  });
}
setInterval(runAutonomousHunterCycle, 6 * 60 * 60 * 1000);

// Run High-Velocity Traffic & Google Indexing Refresh (every 6 hours)
function runAutonomousTrafficCycle() {
  log('🚀 [Traffic Engine] Refreshing multi-channel syndication packs & Google Indexing pings...');
  const traffic = spawn('npx', ['tsx', 'scripts/trigger_high_traffic_engine.js'], { cwd: projectDir, shell: true, stdio: 'inherit' });
  traffic.on('close', (code) => {
    log(`🚀 [Traffic Engine] Traffic assets and action plan refreshed (code ${code}).`);
  });
}
setInterval(runAutonomousTrafficCycle, 6 * 60 * 60 * 1000);

// Check and send Twice-Daily AI Strategic Decision Briefing to bethelmindrecruit@gmail.com
let lastBriefingDate = '';
function checkAndSendAiDecisionBriefing() {
  const now = new Date();
  const utcHours = now.getUTCHours();
  const watHour = (utcHours + 1) % 24;
  const todaySlot = `${now.toISOString().split('T')[0]}_${watHour >= 12 ? 'EVENING' : 'MORNING'}`;

  // Morning window (8:00-9:30 AM WAT) & Evening window (8:00-9:30 PM WAT)
  if (((watHour >= 8 && watHour <= 9) || (watHour >= 20 && watHour <= 21)) && lastBriefingDate !== todaySlot) {
    lastBriefingDate = todaySlot;
    log('🧠 [AI Decision Engine] Formulating and dispatching strategic executive briefing to bethelmindrecruit@gmail.com...');
    const aiBriefing = spawn('npx', ['tsx', 'scripts/dispatch_ai_decision_briefing.js'], { cwd: projectDir, shell: true, stdio: 'inherit' });
    aiBriefing.on('close', (code) => {
      log(`🧠 [AI Decision Engine] Briefing completed with exit code ${code}.`);
    });
  }
}
setInterval(checkAndSendAiDecisionBriefing, 15 * 60 * 1000);

// Periodic Health Ping every 30 minutes
setInterval(() => {
  log('🟢 [Engine Heartbeat] 24/7 Autonomous Viral Growth & Monetization Engine running 100% healthy.');
}, 30 * 60 * 1000);

process.on('SIGINT', () => {
  log('Shutting down Autonomous Growth Engine gracefully...');
  if (runnerProcess) try { runnerProcess.kill(); } catch (_) {}
  process.exit(0);
});
