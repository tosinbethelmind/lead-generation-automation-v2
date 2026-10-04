/**
 * @file scripts/run_breakthrough_trio_scraper.ts
 * 
 * 🇳🇬 COMMAND RUNNER: Targeted Breakthrough Trio Lead Scraper
 * Bethelmind Analytics Lagos Desk · Commercial B2B Revenue Growth Engine
 * 
 * Exclusively Harvests:
 * 1. ⚡ Commercial Solar & Inverter Showrooms / Contractors
 * 2. 🏢 Boutique Real Estate Brokerages & Off-Plan Teams
 * 3. 🏖️ High-Yield Serviced Apartments & Shortlet Portfolios
 * 
 * Usage:
 *   npx tsx scripts/run_breakthrough_trio_scraper.ts --target=50
 *   npx tsx scripts/run_breakthrough_trio_scraper.ts --target=100 --sync-cloud
 */

import { breakthroughTrioHarvester } from '../src/lib/scraping/breakthroughTrioHarvester';

async function main() {
  const args = process.argv.slice(2);
  const targetArg = args.find(a => a.startsWith('--target='));
  const syncCloud = args.includes('--sync-cloud');
  const targetCount = targetArg ? parseInt(targetArg.split('=')[1], 10) : 50;

  console.log('\n========================================================================');
  console.log('🇳🇬 LAUNCHING BREAKTHROUGH TRIO COMMERCIAL HARVESTER');
  console.log('========================================================================');
  console.log(`🎯 Target Yield : Up to ${targetCount} Fresh Verified Nigerian Leads`);
  console.log(`⚡ Sectors Focus: Solar Inverters, Boutique Real Estate, Shortlets`);
  console.log(`📍 Cities Focus : Lagos, Abuja FCT, Port Harcourt, Ibadan`);
  console.log(`☁️ Cloud Sync   : ${syncCloud ? 'ENABLED (Supabase Cloud)' : 'OFFLINE LOCAL FIRST'}`);
  console.log('========================================================================\n');

  const startTime = Date.now();
  try {
    const stats = await breakthroughTrioHarvester.executeTrioHarvest({
      targetLeads: targetCount,
      syncCloud
    });

    const durationSec = Math.round((Date.now() - startTime) / 1000);
    console.log('\n========================================================================');
    console.log('✅ BREAKTHROUGH TRIO HARVEST COMPLETED');
    console.log('========================================================================');
    console.log(`📊 Fresh Harvested Total   : ${stats.harvestedTotal}`);
    console.log(`⚡ Solar Energy Leads      : ${stats.solarCount}`);
    console.log(`🏢 Real Estate Leads       : ${stats.realEstateCount}`);
    console.log(`🏖️ Shortlet & Hotel Leads  : ${stats.shortletCount}`);
    console.log(`💾 Persisted to Local DB   : +${stats.persistedToLocal}`);
    console.log(`☁️ Synced to Supabase Cloud: ${stats.syncedToCloud}`);
    console.log(`⏱️ Duration                : ${durationSec}s`);
    console.log('========================================================================\n');

    process.exit(0);
  } catch (err: any) {
    console.error('❌ Harvester Pass Error:', err.message);
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Fatal Runner Error:', err);
  process.exit(1);
});
