/**
 * @file scripts/run_heavy_b2b_email_harvester.ts
 * Standalone direct runner for heavy nationwide B2B email and webform scraping
 */

import { heavyNationwideB2BEmailHarvester } from '../src/lib/scraping/heavyNationwideB2BEmailHarvester';

async function main() {
  console.log('🚀 Running Heavy Nationwide B2B Email & Webform Sweep...');
  const stats = await heavyNationwideB2BEmailHarvester.executeHeavySweep(10000);
  console.log('✅ Harvest Execution Results:', stats);
  process.exit(0);
}

main().catch(err => {
  console.error('Fatal harvest error:', err);
  process.exit(1);
});
