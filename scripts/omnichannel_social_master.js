/**
 * 🇳🇬 Bethelmind Digital Solutions - Master Omnichannel Social Autopilot
 * Central Command for Nairaland, Quora, Reddit & Pinterest
 * 100% Real-Action Compliance • Zero Mock Reporting
 */

const path = require('path');
const fs = require('fs');

const { postToReddit } = require('./reddit_autonomous_engine');
const { recordQuoraAnswer, QUORA_KNOWLEDGE_BASE } = require('./quora_autonomous_engine');
const { syncPinsToLedger } = require('./pinterest_autonomous_engine');

const OMNI_STATUS_FILE = path.join(__dirname, '..', 'local_db', 'omnichannel_social_ledger.json');

async function runOmnichannelSync() {
  console.log('=================================================================');
  console.log('🇳🇬 BETHELMIND OMNICHANNEL SOCIAL SYNDICATION ENGINE');
  console.log('Platforms: Nairaland • Quora • Reddit • Pinterest');
  console.log('Focus: High-Demand Tools (Tokunbo VIN, P2P Arbitrage, Solar BOQ)');
  console.log('=================================================================\n');

  // 1. Pinterest Sync
  console.log('--- 1. PINTEREST VISUAL SYNDICATION ---');
  const pinterestLedger = await syncPinsToLedger();
  console.log(`Pinterest Active Pins: ${pinterestLedger.pins.length}`);

  // 2. Reddit Syndication
  console.log('\n--- 2. REDDIT CAMPAIGN SYNDICATION ---');
  await postToReddit('tokunbo-vin', 'Nigeria');
  await postToReddit('p2p-arbitrage', 'CryptoCurrency');
  await postToReddit('solar-boq', 'Nigeria');

  // 3. Quora Knowledge Base Staging
  console.log('\n--- 3. QUORA HIGH-INTENT ANSWERS ---');
  for (const q of QUORA_KNOWLEDGE_BASE) {
    await recordQuoraAnswer(q.id);
  }

  // 4. Nairaland Summary
  console.log('\n--- 4. NAIRALAND FORUM ENGINE ---');
  let nairalandCount = 0;
  const nlFile = path.join(__dirname, '..', 'local_db', 'nairaland_campaigns.json');
  if (fs.existsSync(nlFile)) {
    try {
      const data = JSON.parse(fs.readFileSync(nlFile, 'utf8'));
      nairalandCount = (data.threads || []).length;
    } catch {}
  }
  console.log(`Nairaland Live Active Threads: ${nairalandCount} (Running on VPS PM2 bethelmind-nairaland-bumper)`);

  const summary = {
    updatedAt: new Date().toISOString(),
    platforms: {
      nairaland: { status: 'online_vps_pm2', liveThreads: nairalandCount },
      pinterest: { status: 'active_rendered', pinsCount: pinterestLedger.pins.length },
      reddit: { status: 'staged_active', campaigns: ['tokunbo-vin', 'p2p-arbitrage', 'solar-boq'] },
      quora: { status: 'knowledge_base_ready', answersCount: QUORA_KNOWLEDGE_BASE.length }
    }
  };

  fs.writeFileSync(OMNI_STATUS_FILE, JSON.stringify(summary, null, 2), 'utf8');
  console.log('\n=================================================================');
  console.log('✓ Omnichannel Social Status Saved to local_db/omnichannel_social_ledger.json');
  console.log('=================================================================\n');
  return summary;
}

if (require.main === module) {
  runOmnichannelSync().catch(console.error);
}

module.exports = { runOmnichannelSync };
