/**
 * @file scripts/solarquotepro_isolated_runner.js
 * Self-Contained Isolated Background Pipeline Runner for SolarQuotePro.ng
 * Operates in total isolation from existing job queues and main scrapers.
 */

const fs = require('fs');
const path = require('path');
const { runSolarQuoteProIsolatedHarvester } = require('./solarquotepro_isolated_harvester');
const { runMultiGroupHunter } = require('./social_multi_group_hunter');

const LOCAL_DB_DIR = path.join(__dirname, '..', 'local_db');
const PID_FILE = path.join(LOCAL_DB_DIR, 'solarquotepro_runner.pid');
const HEARTBEAT_FILE = path.join(LOCAL_DB_DIR, 'solarquotepro_heartbeat.json');
const LOG_FILE = path.join(LOCAL_DB_DIR, 'solarquotepro_runner.log');

function log(msg) {
  const timestamp = new Date().toISOString();
  const line = `[${timestamp}] [SolarQuotePro-Pipeline] ${msg}\n`;
  console.log(line.trim());
  try {
    fs.appendFileSync(LOG_FILE, line);
  } catch (_) {}
}

function updateHeartbeat(status = 'running', extra = {}) {
  try {
    if (!fs.existsSync(LOCAL_DB_DIR)) fs.mkdirSync(LOCAL_DB_DIR, { recursive: true });
    const payload = {
      pid: process.pid,
      status: status,
      lastHeartbeat: new Date().toISOString(),
      ...extra
    };
    fs.writeFileSync(HEARTBEAT_FILE, JSON.stringify(payload, null, 2));
  } catch (_) {}
}

function writePid() {
  try {
    if (!fs.existsSync(LOCAL_DB_DIR)) fs.mkdirSync(LOCAL_DB_DIR, { recursive: true });
    fs.writeFileSync(PID_FILE, String(process.pid));
  } catch (_) {}
}

function removePid() {
  try {
    if (fs.existsSync(PID_FILE)) fs.unlinkSync(PID_FILE);
  } catch (_) {}
}

async function executePipelineCycle(options = {}) {
  const isDryRun = !!options.dryRun;
  const count = options.count || 2500;

  log(`🚀 Starting Isolated Cycle (Count: ${count}, DryRun: ${isDryRun})...`);
  updateHeartbeat('running', { currentStep: 'harvesting' });

  // 1. Harvest zero-cost solar leads across 36 states + FCT
  log('Step 1: Harvesting 10K Zero-Cost Solar Leads...');
  await runSolarQuoteProIsolatedHarvester(count, isDryRun);

  // 2. Social Group Hunter across WhatsApp, Facebook, Telegram, Nairaland, LinkedIn
  log('Step 2: Hunting Multi-Platform Social Discussion Groups...');
  updateHeartbeat('running', { currentStep: 'group_hunter' });
  await runMultiGroupHunter();

  log('✅ Isolated Cycle Completed Successfully.');
  updateHeartbeat('idle', { lastCompletedAt: new Date().toISOString() });
}

async function mainLoop() {
  const args = process.argv.slice(2);
  const isOnce = args.includes('--once');
  const isDryRun = args.includes('--dry-run');

  log('===========================================================');
  log('🇳🇬 SOLARQUOTEPRO.NG DEDICATED ISOLATED PIPELINE RUNNER');
  log(`🆔 Process PID: ${process.pid}`);
  log(`⚡ Mode: ${isOnce ? 'SINGLE RUN (--once)' : 'CONTINUOUS DAEMON'}`);
  log('===========================================================');

  writePid();
  updateHeartbeat('started');

  process.on('SIGINT', () => {
    log('Received SIGINT. Cleaning up PID file and exiting cleanly...');
    removePid();
    updateHeartbeat('stopped');
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    log('Received SIGTERM. Cleaning up PID file and exiting cleanly...');
    removePid();
    updateHeartbeat('stopped');
    process.exit(0);
  });

  if (isOnce) {
    await executePipelineCycle({ dryRun: isDryRun, count: 50 });
    removePid();
    log('Single run complete. Exiting.');
    process.exit(0);
  }

  // Daemon loop every 4 hours
  while (true) {
    try {
      await executePipelineCycle({ dryRun: isDryRun, count: 2500 });
    } catch (err) {
      log(`❌ Cycle Error: ${err.message}`);
    }

    log('Sleeping for 4 hours before next harvest cycle...');
    await new Promise(r => setTimeout(r, 4 * 60 * 60 * 1000));
  }
}

mainLoop().catch((err) => {
  log(`Fatal crash in isolated runner: ${err.message}`);
  removePid();
  updateHeartbeat('crashed', { error: err.message });
  process.exit(1);
});
