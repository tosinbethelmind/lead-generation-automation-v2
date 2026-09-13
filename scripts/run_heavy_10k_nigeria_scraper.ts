/**
 * @file scripts/run_heavy_10k_nigeria_scraper.ts
 * 
 * 🇳🇬 COMMAND RUNNER: Accelerated Nigeria-Wide 10,000 Leads/Day Multi-Strategy Scraper
 * Bethelmind Analytics Commercial Growth Engine
 * 
 * UPGRADES IMPLEMENTED:
 * - Full 36 States + FCT Geo-Political Regional Matrix (Southwest, North-Central, South-South, Southeast, Northwest, Northeast)
 * - 50+ Specialized Commercial Sectors (Solar, Real Estate, Clinics, Auto, Logistics, Hospitality, etc.)
 * - Multi-Channel Integration: Jiji REST + Directories + CAC + Social (IG/FB/LI/TikTok) + OSM Overpass Mirrors
 * - 100% Genuine Nigerian Carrier Validation (MTN, Airtel, Glo, 9mobile)
 * - Micro-Batch Upserts to Supabase Cloud Database & Local RAM Database
 * - Entity Resolution, Dual-Audience Routing & Buying Power Intent Scoring
 */

import { masterNigeria10kHarvester, NATIONWIDE_HARVEST_SHARDS } from '../src/lib/scraping/masterNigeria10kHarvester';

async function main() {
  const args = process.argv.slice(2);
  const targetArg = args.find(a => a.startsWith('--target='));
  const zoneArg = args.find(a => a.startsWith('--zone='));
  const sectorArg = args.find(a => a.startsWith('--sector='));
  const isContinuous = args.includes('--continuous');
  const targetCount = targetArg ? parseInt(targetArg.split('=')[1], 10) : 10000;
  const specificZone = zoneArg ? zoneArg.split('=')[1] : undefined;
  const specificSector = sectorArg ? sectorArg.split('=')[1] : undefined;

  console.log('\n========================================================================');
  console.log('⚡ LAUNCHING ACCELERATED NIGERIA-WIDE 10,000 LEADS/DAY HARVESTER');
  console.log('========================================================================');
  console.log(`📍 Regional Shards   : ${NATIONWIDE_HARVEST_SHARDS.length} Zones (ALL 36 States + FCT)`);
  console.log(`🏢 Commercial Sectors: 50+ Specialized Enterprise Categories`);
  console.log(`📡 Omnichannel Suite : Jiji REST + Directories + CAC + Social + OSM Overpass`);
  console.log(`🔒 Target Yield      : Up to ${targetCount.toLocaleString()} Verified Genuine Nigerian Leads`);
  if (specificZone) console.log(`🎯 Filtered Zone     : ${specificZone}`);
  if (specificSector) console.log(`💼 Filtered Sector   : ${specificSector}`);
  if (isContinuous) console.log(`🔄 Mode              : Continuous Autonomous Loop`);
  console.log('========================================================================\n');

  let cycle = 1;
  let totalHarvestedAllCycles = 0;
  let totalSyncedAllCycles = 0;

  do {
    console.log(`--- [CYCLE #${cycle}] Starting High-Speed Nationwide Harvest Pass ---`);
    const cycleStartTime = Date.now();
    try {
      const stats = await masterNigeria10kHarvester.executeAcceleratedHarvest({
        targetLeadCount: targetCount,
        specificZone,
        sector: specificSector,
        includeSocial: true,
        includeOverpass: true
      });

      totalHarvestedAllCycles += stats.harvestedCount;
      totalSyncedAllCycles += stats.syncedCount;

      const ratePerMinute = stats.durationSeconds > 0 
        ? Math.round((stats.harvestedCount / stats.durationSeconds) * 60) 
        : stats.harvestedCount;
      const projected24hYield = ratePerMinute * 60 * 24;

      console.log('========================================================================');
      console.log(`✅ HARVEST CYCLE #${cycle} COMPLETED`);
      console.log(`📊 Fresh Leads Harvested : ${stats.harvestedCount.toLocaleString()} (${ratePerMinute} leads/min)`);
      console.log(`☁️  Synced to Supabase    : ${stats.syncedCount.toLocaleString()} (Total Session Synced: ${totalSyncedAllCycles.toLocaleString()})`);
      console.log(`📱 MTN Network Leads     : ${stats.carrierBreakdown.MTN || 0}`);
      console.log(`📱 Airtel Network Leads  : ${stats.carrierBreakdown.Airtel || 0}`);
      console.log(`📱 Glo Network Leads     : ${stats.carrierBreakdown.Glo || 0}`);
      console.log(`📱 9mobile Network Leads : ${stats.carrierBreakdown['9mobile'] || 0}`);
      console.log(`🚀 Velocity Benchmark    : ${ratePerMinute} leads/min | Projected 24h: ~${projected24hYield.toLocaleString()} leads/day`);
      console.log(`⏱️  Cycle Duration        : ${stats.durationSeconds}s`);
      console.log('========================================================================\n');

      if (isContinuous) {
        cycle++;
        console.log('⏳ Resting 15 seconds before next high-speed nationwide sweep...\n');
        await new Promise(r => setTimeout(r, 15000));
      } else {
        break;
      }
    } catch (err: any) {
      console.error('❌ Harvester error:', err.message);
      if (!isContinuous) {
        process.exit(1);
      }
      await new Promise(r => setTimeout(r, 10000));
    }
  } while (isContinuous);

  process.exit(0);
}

main().catch(err => {
  console.error('Fatal error during execution:', err);
  process.exit(1);
});
