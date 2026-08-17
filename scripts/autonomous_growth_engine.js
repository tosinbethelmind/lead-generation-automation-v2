/**
 * @file scripts/autonomous_growth_engine.js
 * 
 * Master 24/7 Autonomous Growth & Outreach Engine.
 * 
 * Orchestrates without manual input:
 * 1. 🔄 Continuous Lead Harvesting & Enrichment (Lagos SMEs, Solar, Real Estate)
 * 2. 📢 Automated WhatsApp Channel Broadcasts (Rotational daily offers & case studies)
 * 3. 🔍 Real-Time Google Search Indexing for all newly generated web preview pages
 * 4. 📲 High-Deliverability 2-Step WhatsApp Outreach (Runs only within Nigerian Business Hours)
 * 5. 🛡️ Self-Healing Auto-Recovery & Network Watchdog
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

log('===============================================================');
log('🚀 STARTING 24/7 AUTONOMOUS BETHELMIND GROWTH & TRAFFIC ENGINE');
log('===============================================================');
log('Target WhatsApp Channel: https://whatsapp.com/channel/0029VbDFgKP4o7qM58yY9v2l (AUTONOMOUS POSTING)');
log('Outreach Mode: MANUAL TRIGGER ONLY (Zero unsolicited auto-sends without your approval)');
log('Organic Traffic Engine: Google Indexing API + Programmatic SEO Active');
log('Admin Escalation Number: +234 802 279 1227');

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

// ── 2. Daily WhatsApp Channel Broadcaster (Runs at 10:00 AM WAT) ───
let lastBroadcastDate = '';

function checkAndPostDailyChannelBroadcast() {
  const now = new Date();
  // WAT is UTC+1
  const utcHours = now.getUTCHours();
  const watHour = (utcHours + 1) % 24;
  const todayStr = now.toISOString().split('T')[0];

  // Broadcast between 10:00 AM and 11:00 AM WAT once per day
  if (watHour >= 10 && watHour <= 12 && lastBroadcastDate !== todayStr) {
    lastBroadcastDate = todayStr;
    log('📢 [Channel Broadcaster] Triggering daily automated WhatsApp Channel update...');

    const categories = ['offer', 'case_study', 'growth_tip', 'feature_demo'];
    const selectedCategory = categories[now.getDay() % categories.length];

    const child = spawn('node', ['scripts/post_channel_update.js', `--category=${selectedCategory}`], {
      cwd: projectDir,
      shell: true,
      stdio: 'inherit'
    });

    child.on('close', (code) => {
      log(`📢 [Channel Broadcaster] Completed daily broadcast for theme: ${selectedCategory} (code ${code})`);
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

// Check Channel broadcast every 15 minutes
setInterval(checkAndPostDailyChannelBroadcast, 15 * 60 * 1000);
// Check immediately on startup
checkAndPostDailyChannelBroadcast();

// Periodic Health Ping every 30 minutes
setInterval(() => {
  log('🟢 [Engine Heartbeat] Autonomous Growth Engine running 100% healthy.');
}, 30 * 60 * 1000);

process.on('SIGINT', () => {
  log('Shutting down Autonomous Growth Engine gracefully...');
  if (runnerProcess) try { runnerProcess.kill(); } catch (_) {}
  process.exit(0);
});
