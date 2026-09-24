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
let pauseCrypto = false;
try {
  const cfg = JSON.parse(fs.readFileSync(path.join(projectDir, 'config.json'), 'utf8'));
  pauseCrypto = cfg.pauseCryptoOutreach === true;
} catch (_) {}

// Worker A: Queue & Lead Harvesting Runner (Scrapes, cleans, deduplicates to Supabase)
launchProcess('Lead Harvester & Pipeline Runner', 'node', ['scripts/keep_alive_runner.js'], 8000);

// Worker A-10K: Heavy Nigeria-Wide 10,000 Leads/Day Multi-Strategy Cloud Harvester
launchProcess('Heavy Nigeria-Wide 10,000 Leads/Day Cloud Harvester', 'npx', ['tsx', 'scripts/run_heavy_10k_nigeria_scraper.ts', '--continuous'], 15000);

// Worker A-Email: 24/7 Continuous 300 Daily B2B Email Dispatch Daemon (Hostinger Port 465 SSL)
launchProcess('24/7 Continuous 300 Daily B2B Email Daemon', 'node', ['scripts/continuous_300_daily_email_daemon.js'], 20000);

// Worker A-Lagos: Extended Deep Lagos Corridor Harvester (Lekki, VI, Ikoyi, Ikeja, Alaba, Trade Fair, Apapa)
launchProcess('24/7 Deep Lagos Commercial Harvester', 'npx', ['tsx', 'scripts/extended_lagos_corridor_harvester.ts'], 12000);

// Worker B: Autonomous Traffic Generation & Google Indexing (Runs every 6 hours)
launchProcess('Autonomous Traffic & Google Indexing Engine', 'node', ['scripts/autonomous_traffic_daemon.js'], 15000);

// Worker C1: Dedicated 24/7 B2B Commercial Monetization Supervisor (7 Scaled Pillars with 3-Hour AI Action Briefings)
launchProcess('24/7 B2B Commercial Monetization Supervisor', 'npx', ['tsx', 'scripts/autonomous_b2b_monetization_daemon.ts'], 20000);

// Worker C1-B: Dedicated 24/7 5 Money Engine Supervisor (GMB, Solar Appointments, Domains 301, Selar Packs, Prototypes)
launchProcess('24/7 5 Money Engine Cloud Supervisor', 'npx', ['tsx', 'scripts/autonomous_five_money_daemon.ts'], 15000);

if (pauseCrypto) {
  console.log('------------------------------------------------------------------------');
  console.log('⏸️ [Supervisor] CRYPTO OUTREACH & ENGINES ARE ISOLATED & ON HOLD.');
  console.log('   Running 100% Standard B2B SME Outreach (Solar, Clinics, Real Estate, Salons, Legal).');
  console.log('------------------------------------------------------------------------\n');
} else {
  // Worker C2: Dedicated 24/7 Quantitative Crypto Revenue Supervisor (3-Hour AI Action Briefings)
  launchProcess('24/7 Quantitative Crypto Revenue Supervisor', 'npx', ['tsx', 'scripts/autonomous_golden_crypto_daemon.ts'], 20000);

  // Worker D: Autonomous Headless Sybil Testnet Cluster (10x Faucet Multiplier)
  launchProcess('Headless Colab Testnet Cluster', 'python', ['scripts/colab_testnet_sybil_cluster.py'], 60000);

  // Worker E: Autonomous Abandoned DEX Smart Contract Liquidity Sweeper
  launchProcess('Abandoned DEX Liquidity Sweeper', 'python', ['scripts/abandoned_dex_liquidity_sweeper.py'], 90000);

  // Worker F: 24/7 Crypto & Arbitrage Supervisor (Dispatches 3-Hour Executive Briefings)
  launchProcess('Crypto & Arbitrage 3-Hour Supervisor', 'npx', ['tsx', 'scripts/run_crypto_arbitrage_supervisor.ts'], 30000);

  // Worker G: Atomic Flash Loan Arbitrage Engine ($0-Capital Zero-Risk Harvest)
  launchProcess('Atomic Flash Loan Arbitrage', 'python', ['scripts/atomic_flash_loan_arbitrage_engine.py'], 120000);

  // Worker H: Jito-Solana & Base L2 High-Frequency Atomic Arbitrage (August 2026 Guru)
  launchProcess('Jito-Solana & Base L2 Arbitrage', 'python', ['scripts/jito_solana_atomic_arbitrage_engine.py'], 60000);

  // Worker I: Multi-Pool CEX-DEX Liquidity Backrun Flash Arbitrage (Sub-50ms WebSocket Ingestion)
  launchProcess('CEX-DEX Flash Backrun Engine', 'python', ['scripts/cex_dex_flash_backrun_engine.py'], 45000);

  // Worker J: Unclaimed Merkle Airdrop & Bounty Reclaimer (1,850+ Dormant Contracts)
  launchProcess('Merkle Airdrop & Bounty Reclaimer', 'python', ['scripts/merkle_airdrop_bounty_reclaimer.py'], 180000);

  // Worker K: DeFi Bad-Debt Liquidation Sniping (Aave V3 & Morpho Blue $1M Flash Loans)
  launchProcess('DeFi Bad-Debt Liquidation Sniper', 'python', ['scripts/defi_liquidation_bad_debt_sniper.py'], 120000);

  // Workers 12 to 31: Consolidated 20-Engine Quantitative Arbitrage Cluster (< 45MB RAM Micro-Process)
  launchProcess('Consolidated 20-Engine Arbitrage Suite', 'python', ['scripts/batch_quantitative_arbitrage_cluster_v20.py'], 180000);

  // Research-Backed Engine: High-Precision Base L2 & Dead LP Invariant Arbitrage (Sub-Cent Gas Advantage)
  launchProcess('High-Precision Base L2 & Invariant Sweeper', 'python', ['scripts/base_l2_high_precision_arbitrage_engine.py'], 60000);
}

// Worker L1: 24/7 Silent Web Contact Form Proposal & Voice Note Submitter
launchProcess('24/7 Silent Web Contact Form Engine', 'npx', ['tsx', 'scripts/continuous_tier5_harvester_and_web_outreach.ts'], 15000);

// Worker L2: 24/7 Silent Social Media & Jiji Inbox Dispatcher (2-Step Permission Loop)
launchProcess('24/7 Silent Social & Jiji Inbox Dispatcher', 'npx', ['tsx', 'scripts/automated_jiji_and_social_inbox_dispatcher.ts'], 15000);

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
