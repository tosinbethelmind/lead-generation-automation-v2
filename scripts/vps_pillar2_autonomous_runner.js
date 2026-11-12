/**
 * @file scripts/vps_pillar2_autonomous_runner.js
 * 
 * 🏛️ CONTABO VPS & CLOUD AUTONOMOUS PILLAR 2 RUNNER (100% OFFLOAD)
 * Bethelmind Digital Solutions (CAC Certified: Reg 9912717)
 * Settlement: Moniepoint Microfinance Bank (6805375225)
 * Contabo VPS: 169.58.182.92 (24/7 PM2 Watchdog)
 * 
 * Execution Cycle:
 * 1. Executes Dynamic Asset Harvester (Harvests luxury listings across Ikoyi, Lekki 1, Banana Island, Epe).
 * 2. Runs Section 84 Evidence Act hash generation on all new assets.
 * 3. Checks Lagos business hours & Pacer rules (Max 15 messages/day, 30m spacing).
 * 4. Drains approved queue via Evolution API on VPS (port 8080/8085).
 * 5. Syncs pipeline state to Supabase Cloud logs.
 */

const { execSync } = require('child_process');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

async function runAutonomousCycle() {
  console.log('====================================================================');
  console.log('🏛️ BETHELMIND PILLAR 2 VPS & CLOUD AUTONOMOUS DEAL RUNNER');
  console.log('====================================================================');
  console.log(`📅 Timestamp: ${new Date().toISOString()} (WAT Lagos)`);
  console.log('🔒 Policy: 100% Zero-Crypto B2B Mandates | Moniepoint MFB 6805375225');
  console.log('🖥️ Target Host: Contabo VPS (169.58.182.92) & GitHub Actions Cloud\n');

  try {
    // 1. Run Dynamic Harvester
    console.log('🚀 Phase 1: Executing Dynamic Luxury Asset Harvester...');
    execSync('node scripts/dynamic_luxury_asset_harvester.js', {
      cwd: ROOT_DIR,
      stdio: 'inherit',
      timeout: 30000
    });

    // 2. Run Autonomous Discovery & Outbound Dispatch via npx tsx
    console.log('\n🚀 Phase 2: Executing Autonomous Deal Discovery & Paced Outbound Queue...');
    execSync('npx tsx scripts/run_autonomous_pillar2_deal_discovery.js', {
      cwd: ROOT_DIR,
      stdio: 'inherit',
      timeout: 45000
    });

    console.log('\n✅ 24/7 Pillar 2 autonomous cycle completed with zero laptop drain.');
  } catch (err) {
    console.error('❌ VPS Runner Execution Error:', err.message);
    process.exit(1);
  }
}

runAutonomousCycle();
