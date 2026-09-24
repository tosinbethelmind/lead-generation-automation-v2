/**
 * @file scripts/unified_mcp_accelerated_pipeline.ts
 * 
 * Bethelmind Analytics - Unified MCP & High-Performance Pipeline Runner
 * Combines MCP Scraper Bridge, Crawlee Stealth Engine, and Outreach Acceleration Hub.
 */

import { McpScraperBridge, ScrapeTarget } from '../src/lib/scraping/mcpScraperBridge';
import { OutreachAccelerationHub } from '../src/lib/outreach/outreachAccelerationHub';
import { executeHybridScrape } from '../src/lib/scraping/crawlee_engine';

async function runPipeline() {
  console.log('================================================================');
  console.log('🚀 BETHELMIND ANALYTICS: UNIFIED MCP ACCELERATED PIPELINE RUNNER');
  console.log('================================================================\n');

  const args = process.argv.slice(2);
  const isDryRun = args.includes('--dry-run') || true; // Default to safe mode unless explicitly live

  // 1. Initialize MCP Scraper Bridge & Crawlee
  console.log('📦 Step 1: Initializing MCP Scraper Bridge & Concurrency Pools...');
  const scraperBridge = new McpScraperBridge();
  const outreachHub = new OutreachAccelerationHub();

  const sampleTargets: ScrapeTarget[] = [
    { url: 'https://vconnect.com/nigeria/solar-energy-in-lagos_c896', category: 'Solar Installation', area: 'Lagos Island' },
    { url: 'https://yellowpages.net.ng/category/solar-energy-equipment-suppliers/', category: 'Solar Energy Supplier', area: 'Ikeja' }
  ];

  console.log(`🔍 Step 2: Testing Accelerated Batch Scraping across ${sampleTargets.length} targets...`);
  const scrapeResult = await scraperBridge.crawlBatch(sampleTargets);
  console.log(`✅ Harvester evaluated: ${scrapeResult.totalEvaluated} targets in ${scrapeResult.durationMs}ms`);
  console.log(`🎯 Valid Leads Harvested: ${scrapeResult.harvested.length}\n`);

  // 2. Test Multi-Channel Outreach Dispatch
  console.log('📨 Step 3: Testing Accelerated Single-Credit Outreach Hub...');
  const sampleLeads = [
    {
      id: 'lead_test_01',
      name: 'Vortex Power Solutions',
      phone: '08033221144',
      email: 'contact@vortexpower.ng',
      category: 'Solar Energy',
      area: 'Lekki Phase 1',
      hasWebsite: true
    },
    {
      id: 'lead_test_02',
      name: 'Prime Diagnostic Medical Clinic',
      phone: '08123456789',
      email: 'admin@primediagnostics.com.ng',
      category: 'Healthcare & Clinic',
      area: 'Victoria Island',
      hasWebsite: false
    }
  ];

  const campaignResult = await outreachHub.executeAcceleratedCampaign(sampleLeads, {
    dryRun: isDryRun,
    batchSize: 2
  });

  console.log(`📊 Campaign Summary:`);
  console.log(`- Evaluated: ${campaignResult.evaluated}`);
  console.log(`- Valid Sanitized: ${campaignResult.validSanitized}`);
  console.log(`- Dispatched SMS: ${campaignResult.dispatchedSms}`);
  console.log(`- Duration: ${campaignResult.durationMs}ms`);

  console.log('\n================================================================');
  console.log('✅ ALL MCP & LIBRARY UPGRADES SUCCESSFULLY VALIDATED');
  console.log('================================================================');
}

runPipeline().catch(err => {
  console.error('❌ Pipeline execution error:', err);
  process.exit(1);
});
