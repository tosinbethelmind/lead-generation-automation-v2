/**
 * @file scripts/run_crawlee_harvester.ts
 * 
 * 🚀 RUNNER: Crawlee + Katana + Metascraper Autonomous Scraper
 * Bethelmind Analytics Lagos Desk
 */

import { crawleeGoogleMapsHarvester } from '../src/lib/scraping/crawleeGoogleMapsHarvester';

async function main() {
  const args = process.argv.slice(2);
  const targetArg = args.find(a => a.startsWith('--target='));
  const isContinuous = args.includes('--continuous');
  const targetCount = targetArg ? parseInt(targetArg.split('=')[1], 10) : 50;

  console.log('Starting Crawlee + Katana + Metascraper Harvester...');
  let cycle = 1;

  do {
    console.log(`\n--- [CRAWLEE CYCLE #${cycle}] Target: ${targetCount} leads ---`);
    try {
      await crawleeGoogleMapsHarvester.runHarvest({ targetCount });
    } catch (err: any) {
      console.error('Harvester cycle error:', err.message);
    }

    if (isContinuous) {
      cycle++;
      console.log('⏳ Resting 30 seconds before next high-yield sweep...');
      await new Promise(r => setTimeout(r, 30000));
    } else {
      break;
    }
  } while (isContinuous);

  process.exit(0);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
