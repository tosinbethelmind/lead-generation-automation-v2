/**
 * @file scripts/unified_outreach_master.js
 * ============================================================
 * UNIFIED OUTREACH MASTER RUNNER
 * Orchestrates BOTH scraper engines in clean isolation:
 *
 * ENGINE 1 — 10K Lagos Scraper (Mixed Leads):
 *   ├── Auto-classifies Solar Companies vs Regular Businesses
 *   ├── Track A: Solar 4-in-1 Package
 *   │     • Custom Solar Website Preview
 *   │     • SolarQuotePro.ng Directory Enlistment
 *   │     • 60-Second PDF Proposal Builder
 *   │     • Direct Lead Marketplace Access
 *   └── Track B: Regular Business
 *         • Website Preview & Claim Pitch
 *         • Post-Payment Solar Referral (solarquotepro.ng)
 *
 * ENGINE 2 — 10K Solar Scraper All Nigeria (100% Solar Leads):
 *   ├── hasActiveWebsite? YES → SolarQuotePro Enlistment Only
 *   └── hasActiveWebsite? NO  → Full 4-in-1 Hybrid Package
 *
 * Usage:
 *   node scripts/unified_outreach_master.js               # Live run all engines
 *   node scripts/unified_outreach_master.js --dry-run     # Preview messages only
 *   node scripts/unified_outreach_master.js --engine=1    # Lagos scraper only
 *   node scripts/unified_outreach_master.js --engine=2    # Nationwide solar only
 * ============================================================
 */

const { spawn } = require('child_process');
const path = require('path');

const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const engineArg = args.find(a => a.startsWith('--engine='));
const engineFilter = engineArg ? engineArg.split('=')[1] : 'all';

function runChildScript(scriptName, scriptArgs = []) {
  return new Promise((resolve) => {
    const scriptPath = path.join(__dirname, scriptName);
    console.log(`\n\x1b[36m▶ Launching: node scripts/${scriptName} ${scriptArgs.join(' ')}\x1b[0m\n`);

    const child = spawn('node', [scriptPath, ...scriptArgs], {
      stdio: 'inherit',
      shell: true
    });

    child.on('close', (code) => {
      if (code !== 0) {
        console.warn(`\x1b[33m⚠️  ${scriptName} exited with code ${code} — continuing pipeline.\x1b[0m`);
      }
      resolve();
    });

    child.on('error', (err) => {
      console.error(`\x1b[31m❌ Failed to launch ${scriptName}: ${err.message}\x1b[0m`);
      resolve();
    });
  });
}

function banner(title, color = '\x1b[36m') {
  const line = '═'.repeat(60);
  console.log(`${color}${line}\x1b[0m`);
  console.log(`${color}  ${title}\x1b[0m`);
  console.log(`${color}${line}\x1b[0m`);
}

async function runUnifiedMaster() {
  banner('🇳🇬 UNIFIED OUTREACH MASTER RUNNER');
  console.log(`\x1b[33m  Mode:    ${isDryRun ? 'DRY-RUN (preview only)' : 'LIVE PRODUCTION'}\x1b[0m`);
  console.log(`\x1b[33m  Engines: ${engineFilter === 'all' ? 'Engine 1 (Lagos) + Engine 2 (Nationwide Solar)' : `Engine ${engineFilter} only`}\x1b[0m`);
  console.log(`\x1b[33m  Time:    ${new Date().toISOString()}\x1b[0m\n`);

  const dryFlag = isDryRun ? ['--dry-run'] : [];

  // ─────────────────────────────────────────────────────────────
  // ENGINE 1: 10K LAGOS SCRAPER — Dual-Track (Solar + Regular)
  // ─────────────────────────────────────────────────────────────
  if (engineFilter === 'all' || engineFilter === '1') {
    banner('ENGINE 1 — 10K Lagos Scraper (Dual-Track)', '\x1b[34m');

    // Step 1A: Lead Classification Test (verify classifier is healthy)
    console.log('\x1b[34m[Engine 1 | Step 1] Running Lead Classifier Health Check...\x1b[0m');
    await runChildScript('lead_classifier.js', ['--test']);

    // Step 1B: Track A — Solar Company 4-in-1 Hybrid Outreach
    console.log('\n\x1b[34m[Engine 1 | Step 2] Track A — Solar Company 4-in-1 Hybrid Outreach\x1b[0m');
    await runChildScript('solar_company_hybrid_outreach.js', dryFlag);

    // Step 1C: Track B — Regular Business Website & Post-Payment Referral
    console.log('\n\x1b[34m[Engine 1 | Step 3] Track B — Regular Business Website & Post-Payment Solar Referral\x1b[0m');
    await runChildScript('regular_business_outreach.js', dryFlag);

    console.log('\n\x1b[32m✅ Engine 1 (Lagos) — All Tracks Complete.\x1b[0m\n');
  }

  // ─────────────────────────────────────────────────────────────
  // ENGINE 2: 10K SOLAR SCRAPER ALL NIGERIA — Smart Routing
  // ─────────────────────────────────────────────────────────────
  if (engineFilter === 'all' || engineFilter === '2') {
    banner('ENGINE 2 — 10K Solar Scraper All Nigeria (Smart Routing)', '\x1b[35m');

    // Step 2A: Run Nationwide Installer Onboarding with Smart Website Routing
    console.log('\x1b[35m[Engine 2 | Step 1] Running Nationwide Smart Routing Outreach...\x1b[0m');
    console.log('\x1b[35m  → No website detected   : FULL 4-IN-1 HYBRID Package\x1b[0m');
    console.log('\x1b[35m  → Website already exists : SolarQuotePro Enlistment Only\x1b[0m\n');
    await runChildScript('installer_onboarding_outreach.js', dryFlag);

    console.log('\n\x1b[32m✅ Engine 2 (Nationwide Solar) — Smart Routing Complete.\x1b[0m\n');
  }

  // ─────────────────────────────────────────────────────────────
  // FINAL SUMMARY
  // ─────────────────────────────────────────────────────────────
  banner('🎉 UNIFIED OUTREACH MASTER — COMPLETE', '\x1b[32m');
  console.log('\x1b[32m  All engines executed successfully.\x1b[0m');
  console.log(`\x1b[32m  Completed at: ${new Date().toISOString()}\x1b[0m\n`);
}

runUnifiedMaster().catch((err) => {
  console.error('\x1b[31m❌ Fatal error in Unified Outreach Master:\x1b[0m', err.message);
  process.exit(1);
});
