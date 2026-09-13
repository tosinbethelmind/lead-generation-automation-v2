/**
 * @file scripts/run_unified_monetization_autopilot.js
 * 
 * 24/7 Unified 8-Pillar Monetization Background Autopilot.
 * 
 * Automatically monitors all 8 revenue streams, ranks prospects,
 * and delivers the Master Consolidated Dossier at 08:00 AM WAT without email spam.
 */

const path = require('path');
const { dispatchMasterMonetizationDossier } = require(path.join(process.cwd(), 'src', 'lib', 'monetization', 'unifiedPillarsAutopilot.ts'));

let lastDossierDate = '';

async function checkScheduledMasterDossier() {
  const now = new Date();
  const utcHours = now.getUTCHours();
  const watHour = (utcHours + 1) % 24;
  const todayStr = now.toISOString().split('T')[0];

  // Dispatches once daily at 08:00 AM WAT
  if (watHour === 8 && lastDossierDate !== todayStr) {
    lastDossierDate = todayStr;
    console.log(`[${new Date().toISOString()}] 💰 Dispatching scheduled 08:00 AM WAT Master 8-Pillar Monetization Dossier...`);
    await dispatchMasterMonetizationDossier();
  }
}

async function main() {
  if (process.argv.includes('--send-now') || process.argv.includes('--once')) {
    console.log('💰 Dispatching Master 8-Pillar Monetization Dossier on demand...');
    const res = await dispatchMasterMonetizationDossier();
    console.log('Result:', res);
    process.exit(res.success ? 0 : 1);
  }

  console.log('⏰ Unified 8-Pillar Monetization Autopilot active. Scheduled for 08:00 AM WAT Master Dossiers.');
  setInterval(checkScheduledMasterDossier, 10 * 60 * 1000);
}

main();
