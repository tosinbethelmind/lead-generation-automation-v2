/**
 * @file scripts/run_autonomous_pillar2_deal_discovery.js
 * 
 * 🏛️ CONTINUOUS & AUTONOMOUS LUXURY MANDATE DISCOVERY & QUEUE DISPATCH ENGINE
 * Bethelmind Digital Solutions (CAC Certified: Reg 9912717)
 * Settlement: Moniepoint Microfinance Bank (6805375225 — Bethelmind Digital Solutions)
 * 
 * Automatically executed:
 * 1. 24/7 in GitHub Actions Cloud via autonomous_247_cloud_engine.yml (every 30 mins)
 * 2. On Contabo VPS (169.58.182.92) via PM2 watchdog
 * 3. In Next.js Background Worker
 * 
 * Functions:
 * - Discovers fresh prime listings across Lagos luxury corridors (Ikoyi, Lekki, VI, Epe)
 * - Verifies Nigerian broker contact records & LASRERA 80/20 co-brokerage terms
 * - Automatically stages verified deals to Supabase Cloud
 * - Automatically drains & dispatches outbound queue across WhatsApp, GSM SMS, and Hostinger SMTP Email
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = process.cwd();
require('dotenv').config({ path: path.join(ROOT_DIR, '.env') });
require('dotenv').config({ path: path.join(ROOT_DIR, '.env.local') });

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function getSupabaseClient() {
  if (!SUPABASE_URL || !SUPABASE_KEY) return null;
  try {
    const { createClient } = require('@supabase/supabase-js');
    return createClient(SUPABASE_URL, SUPABASE_KEY);
  } catch (_) {
    return null;
  }
}

async function main() {
  console.log('====================================================================');
  console.log('🏛️ BETHELMIND 24/7 AUTONOMOUS LUXURY MANDATE DISCOVERY & QUEUE ENGINE');
  console.log('====================================================================');
  console.log(`📅 Timestamp: ${new Date().toISOString()} (WAT Lagos)`);
  console.log('🔒 Policy: 100% Zero-Crypto B2B Mandates | Moniepoint MFB 6805375225');

  const supabase = getSupabaseClient();
  if (supabase) {
    console.log('☁️ Supabase Cloud: Connected');
  } else {
    console.log('⚠️ Supabase Cloud credentials not present; operating in local mode.');
  }

  // 1. Load Pillar 2 engine dynamically
  try {
    const { 
      discoverFreshDeals, 
      processOutboundQueue, 
      getPillar2Telemetry 
    } = require('../src/lib/pillar2/pillar2Engine');

    // Step A: Autonomous Deal Discovery
    console.log('\n🔍 Step 1: Executing Continuous Luxury Mandate Discovery...');
    const discoveryResult = await discoverFreshDeals();
    console.log(`✅ Fresh Mandates Discovered & Staged: ${discoveryResult.stagedCount}`);
    if (discoveryResult.newlyStaged && discoveryResult.newlyStaged.length > 0) {
      discoveryResult.newlyStaged.forEach(t => {
        console.log(`   • [${t.ticketId}] ${t.title} | Listed: ${t.actionPayload?.listingPrice || '₦500M+'} | Target: ${t.targetBusinessName}`);
      });
    }

    // Step B: Autonomous Outbound Queue Processing (Tri-Channel Dispatch)
    console.log('\n⚡ Step 2: Processing Pending Outbound Queue Across All 3 Platforms...');
    const queueResult = await processOutboundQueue();
    console.log(`✅ ${queueResult.message}`);
    if (queueResult.stats) {
      console.log(`   📊 Summary: ${queueResult.stats.dispatchedCount} deals processed across channels.`);
    }

    // Step C: Telemetry Audit
    const telemetry = await getPillar2Telemetry();
    console.log('\n📊 Pillar 2 Pipeline Status:');
    console.log(`   • Staged / Pending Approvals : ${telemetry.stats.pendingCount}`);
    console.log(`   • Approved Mandates          : ${telemetry.stats.approvedCount}`);
    console.log(`   • In Outbound Queue          : ${telemetry.stats.queuedOutboundCount}`);
    console.log(`   • Confirmed Dispatched       : ${telemetry.stats.dispatchedCount}`);
    console.log(`   • Total Asset Value Pool     : ₦${(telemetry.stats.totalAssetPoolNGN || 0).toLocaleString()}`);
    console.log(`   • 20% Co-Brokerage Pool      : ₦${(telemetry.stats.totalOriginationPoolNGN || 0).toLocaleString()}`);
    console.log('\n🎯 Paced Outreach Engine (Max 15/Day · Well-Spaced 30m):');
    console.log(`   • Messages Sent Today        : ${telemetry.stats.dailyOutreachSent || 0} / ${telemetry.stats.dailyOutreachMax || 15}`);
    console.log(`   • Remaining Daily Allowance  : ${telemetry.stats.dailyOutreachRemaining || 0}`);
    console.log(`   • Pacing Status              : ${telemetry.stats.isPacingActive ? '⏳ WAITING (Paced)' : '✅ READY'}`);
    console.log(`   • Pacing Note                : ${telemetry.stats.pacingReason}`);
    console.log(`   • Lagos Time & Business Hours: ${telemetry.stats.currentWatTime} (${telemetry.stats.isBusinessHours ? 'Active' : 'Closed'})`);

    console.log('\n🎉 Autonomous discovery & dispatch cycle complete!');
  } catch (err) {
    console.error('❌ Autonomous Discovery Error:', err.message);
  }
}

if (require.main === module) {
  main().then(() => process.exit(0)).catch(e => {
    console.error(e);
    process.exit(1);
  });
}

module.exports = { main };
