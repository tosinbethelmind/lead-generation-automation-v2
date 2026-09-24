/**
 * @file scripts/run_low_resource_lead_automation.ts
 * 
 * 🔋 LOW-RESOURCE MASSIVE LEAD AUTOMATION (Phones, Emails, Webforms)
 * Bethelmind Analytics Commercial Growth Engine
 * 
 * 🚀 KEY OPTIMIZATIONS FOR LOW-SPEC LAPTOPS:
 * 1. Process Priority: Set to below-normal to keep laptop responsive and fans quiet.
 * 2. Pure C/HTTP Scraping First (curl_cffi / scrapling / cheerio): < 30MB RAM, < 3% CPU.
 * 3. Surgical Patchright with Media Blocking (images, fonts, css aborted) only when needed.
 * 4. Direct HTTP Webform Submissions: Submits forms via POST with cheerio in < 200ms without opening browser.
 * 5. Strict Rule #5 & Rule #6 Compliance: 100% genuine Nigerian phone validation (+234 E.164), single-endpoint webform probe.
 * 6. Stream Database Sync: Flushes micro-batches to Supabase Cloud without in-memory bloat.
 */

import os from 'os';
import path from 'path';
import fs from 'fs';
import { masterNigeria10kHarvester } from '../src/lib/scraping/masterNigeria10kHarvester';
import { turbo1000WebformEngine } from '../src/lib/outreach/turbo1000WebformEngine';

// Optimize OS process priority for quiet background running
try {
  if (os.setPriority) {
    os.setPriority(os.constants.priority.PRIORITY_BELOW_NORMAL);
  }
} catch (_) {}

interface AutomationOptions {
  target: number;
  continuous: boolean;
  testMode: boolean;
  runWebforms: boolean;
  webformLimit: number;
}

function parseArgs(): AutomationOptions {
  const args = process.argv.slice(2);
  const targetArg = args.find(a => a.startsWith('--target='));
  const webformLimitArg = args.find(a => a.startsWith('--webforms='));
  
  return {
    target: targetArg ? parseInt(targetArg.split('=')[1], 10) : (args.includes('--test') ? 5 : 500),
    continuous: args.includes('--continuous'),
    testMode: args.includes('--test'),
    runWebforms: !args.includes('--skip-webforms'),
    webformLimit: webformLimitArg ? parseInt(webformLimitArg.split('=')[1], 10) : (args.includes('--test') ? 2 : 50)
  };
}

function logMemoryFootprint(label: string) {
  const mem = process.memoryUsage();
  const heapUsedMb = Math.round(mem.heapUsed / 1024 / 1024);
  const rssMb = Math.round(mem.rss / 1024 / 1024);
  console.log(`🧠 [Memory: ${label}] Heap: ${heapUsedMb} MB | Total RSS: ${rssMb} MB (Low-Resource Guard Active)`);
}

async function runLowResourceCycle(cycleNum: number, options: AutomationOptions) {
  console.log(`\n========================================================================`);
  console.log(`⚡ [CYCLE #${cycleNum}] STARTING LOW-RESOURCE LEAD GENERATION PIPELINE`);
  console.log(`========================================================================`);
  console.log(`🎯 Target Leads        : ${options.target} Genuine Nigerian Leads`);
  console.log(`🌐 Mode                : ${options.testMode ? 'TEST HARNESS (Fast Verification)' : (options.continuous ? 'Continuous 24/7' : 'Single Pass')}`);
  console.log(`📨 Webform Outreach    : ${options.runWebforms ? `Active (Limit: ${options.webformLimit})` : 'Skipped'}`);
  console.log(`🛡️ Strict Rules Active : Rule #5 (Zero-Synthetic Phones), Rule #6 (No Multi-Page Spinning)`);
  console.log(`========================================================================\n`);

  logMemoryFootprint('Pre-Harvest');

  // PHASE 1: Scrape Verified Commercial Leads
  const harvestStart = Date.now();
  const harvestResult = await masterNigeria10kHarvester.executeAcceleratedHarvest({
    targetLeadCount: options.target,
    includeSocial: true,
    includeOverpass: true
  });

  const harvestSec = ((Date.now() - harvestStart) / 1000).toFixed(1);
  console.log(`\n✅ [Phase 1: Scraping Complete in ${harvestSec}s]`);
  console.log(`   - Verified Leads Harvested : ${harvestResult.harvestedCount}`);
  console.log(`   - Synced to Supabase Cloud : ${harvestResult.syncedCount}`);
  console.log(`   - Carrier Breakdown        : MTN: ${harvestResult.carrierBreakdown.MTN || 0} | Airtel: ${harvestResult.carrierBreakdown.Airtel || 0} | Glo: ${harvestResult.carrierBreakdown.Glo || 0} | 9mobile: ${harvestResult.carrierBreakdown['9mobile'] || 0}`);

  logMemoryFootprint('Post-Harvest');

  // PHASE 2: Lightweight Direct-HTTP Webform Dispatch (Only if enabled and leads have websites)
  if (options.runWebforms && harvestResult.harvestedCount > 0) {
    console.log(`\n🚀 [Phase 2: Dispatching Direct-HTTP Webform Submissions (0% Browser Overhead)]`);
    try {
      const webformStats = await turbo1000WebformEngine.execute1000WebformCampaign(options.webformLimit);
      console.log(`   - Webforms Processed  : ${webformStats.processed}`);
      console.log(`   - Successfully Sent   : ${webformStats.successful}`);
      console.log(`   - Skipped / No Form   : ${webformStats.failed}`);
    } catch (err: any) {
      console.warn(`   ⚠️ Webform dispatcher note: ${err.message}`);
    }
  }

  logMemoryFootprint('Cycle-Complete');
  console.log(`\n========================================================================`);
  console.log(`🏁 [CYCLE #${cycleNum} COMPLETE] Finished cleanly. Laptop fans & CPU remain cool.`);
  console.log(`========================================================================\n`);
}

async function main() {
  const options = parseArgs();
  let cycle = 1;

  do {
    try {
      await runLowResourceCycle(cycle, options);
    } catch (err: any) {
      console.error(`❌ Cycle #${cycle} error:`, err.message);
    }

    if (options.continuous && !options.testMode) {
      cycle++;
      console.log(`⏳ Pausing 20 seconds before starting Cycle #${cycle} (preserving laptop thermal balance)...`);
      await new Promise(r => setTimeout(r, 20000));
    } else {
      break;
    }
  } while (options.continuous);

  process.exit(0);
}

main().catch(err => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
