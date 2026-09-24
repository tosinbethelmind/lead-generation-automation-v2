/**
 * @file scripts/sync_and_update_all_customer_journeys.ts
 * Comprehensive Customer Journey Synchronization & Standard Reporting Engine
 * 
 * Synchronizes all scraped, enriched, and outreach-staged Lagos leads
 * into the customer journey tracker (local_db/lead_journeys.json) and Supabase Cloud.
 */

import * as fs from 'fs';
import * as path from 'path';
import { calculateHeatScore, JourneyStage, LeadJourneyRecord, JourneyMetrics } from '../src/lib/leadJourneyTracker';
import { reconcileSmsDispatches, getUnifiedTelemetryReport } from '../src/lib/unifiedReportingEngine';

const LOCAL_DB = path.join(process.cwd(), 'local_db');
const leadsDbPath = path.join(LOCAL_DB, 'leads_db.json');
const journeysDbPath = path.join(LOCAL_DB, 'lead_journeys.json');

function getLagosWatTimestamp(date: Date = new Date()): string {
  return date.toLocaleTimeString('en-NG', { 
    timeZone: 'Africa/Lagos', 
    hour12: true, 
    hour: '2-digit', 
    minute: '2-digit' 
  }) + ' WAT (' + date.toLocaleDateString('en-NG', { timeZone: 'Africa/Lagos', month: 'short', day: 'numeric' }) + ')';
}

async function syncAllCustomerJourneys() {
  console.log('🔄 Starting Full Customer Journey Synchronization & Update...');

  // 1. First run SMS dispatch reconciliation across database sources
  const recon = reconcileSmsDispatches();
  console.log(`📱 SMS Dispatch Reconciliation: ${recon.updatedLeads} leads updated, ${recon.reconciledCount} journeys refreshed.`);

  if (!fs.existsSync(leadsDbPath)) {
    console.error('❌ leads_db.json not found!');
    return;
  }

  const rawLeads = JSON.parse(fs.readFileSync(leadsDbPath, 'utf8'));
  const leads: any[] = Array.isArray(rawLeads) ? rawLeads : (rawLeads.leads || Object.values(rawLeads));
  console.log(`📊 Loaded ${leads.length} leads from Master Database.`);

  let existingJourneys: Record<string, LeadJourneyRecord> = {};
  if (fs.existsSync(journeysDbPath)) {
    try {
      existingJourneys = JSON.parse(fs.readFileSync(journeysDbPath, 'utf8'));
      console.log(`📦 Loaded ${Object.keys(existingJourneys).length} existing journey records.`);
    } catch (e) {
      console.warn('⚠️ Could not parse existing journeys, initializing fresh structure.');
      existingJourneys = {};
    }
  }

  const now = new Date();
  const timestampIso = now.toISOString();
  const timestampWat = getLagosWatTimestamp(now);

  let newlyAdded = 0;
  let updatedExisting = 0;

  for (const lead of leads) {
    const leadId = lead.lead_id || lead.id || lead.slug || `lead_${Math.random().toString(36).substring(2, 9)}`;
    const leadName = lead.name || lead.business_name || 'Lagos Commercial Enterprise';
    const category = lead.category || lead.sector || lead.industry || 'Commercial Enterprise';
    const area = lead.area || lead.city || lead.location || 'Lagos';
    const phone = lead.phone_e164 || lead.phone || '';
    const email = lead.email || '';
    const previewUrl = lead.preview_url || `https://www.bethelmindanalytics.com/preview/${leadId}`;

    let currentStage: JourneyStage = 'ENRICHED';
    if (lead.sms_status === 'SENT' || lead.social_dm_dispatched || lead.outreach_dispatched || lead.webform_status === 'SENT') {
      currentStage = 'OUTREACH_DISPATCHED';
    } else if (lead.website || lead.phone || lead.hasWebsite) {
      currentStage = 'ENRICHED';
    } else {
      currentStage = 'SCRAPED';
    }

    if (!existingJourneys[leadId]) {
      const initialMetrics: JourneyMetrics = {
        pageViews: 0,
        calculatorInteractions: 0,
        videoWatchSec: 0,
        chatMessages: 0,
        checkoutAttempts: 0,
        totalTimeSec: 0,
        rageClicks: 0
      };

      const { heatScore, intentLevel } = calculateHeatScore(initialMetrics, currentStage, timestampIso);

      existingJourneys[leadId] = {
        leadId,
        leadName,
        category,
        phone,
        email,
        area,
        currentStage,
        score: lead.score || 75,
        heatScore,
        intentLevel,
        previewUrl,
        createdAt: timestampIso,
        lastActiveIso: timestampIso,
        lastUpdatedWat: timestampWat,
        metrics: initialMetrics,
        events: [
          {
            id: `evt_init_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            leadId,
            leadName,
            businessCategory: category,
            phone,
            email,
            stage: currentStage,
            title: currentStage === 'OUTREACH_DISPATCHED' ? 'Outreach Dispatched Across Channels' : 'Commercial Profile Verified & Enriched',
            description: `Lead profile verified in ${area}. Dedicated prototype and Ezinne voice note activated.`,
            channelUsed: currentStage === 'OUTREACH_DISPATCHED' ? 'Social & Direct Inbox' : 'Harvester & Verification Engine',
            timestamp: timestampIso,
            timestampWat,
            metadata: { previewUrl, area, category }
          }
        ]
      };
      newlyAdded++;
    } else {
      const record = existingJourneys[leadId];
      if (phone && !record.phone) record.phone = phone;
      if (email && !record.email) record.email = email;
      if (area && !record.area) record.area = area;
      if (previewUrl && !record.previewUrl) record.previewUrl = previewUrl;

      if (lead.sms_status === 'SENT' && record.currentStage === 'ENRICHED') {
        record.currentStage = 'OUTREACH_DISPATCHED';
      }

      if (!record.metrics) {
        record.metrics = {
          pageViews: 0,
          calculatorInteractions: 0,
          videoWatchSec: 0,
          chatMessages: 0,
          checkoutAttempts: 0,
          totalTimeSec: 0,
          rageClicks: 0
        };
      }

      const { heatScore, intentLevel } = calculateHeatScore(record.metrics, record.currentStage, record.lastActiveIso || timestampIso);
      record.heatScore = heatScore;
      record.intentLevel = intentLevel;
      record.lastUpdatedWat = timestampWat;

      updatedExisting++;
    }
  }

  fs.writeFileSync(journeysDbPath, JSON.stringify(existingJourneys, null, 2), 'utf8');
  console.log(`✅ Successfully synced and wrote ${Object.keys(existingJourneys).length} journeys to disk!`);

  // Print Unified Standard Telemetry Report
  const report = getUnifiedTelemetryReport();

  console.log('\n======================================================');
  console.log('📈 UNIFIED STANDARD CUSTOMER JOURNEY TELEMETRY REPORT');
  console.log('======================================================');
  console.log(`Timestamp:                  ${report.timestampWat}`);
  console.log(`Total Master Database Leads: ${report.totalMasterLeads.toLocaleString()}`);
  console.log(`Total Tracked Journeys:     ${report.totalTrackedJourneys.toLocaleString()}`);

  console.log('\n📡 OUTREACH CHANNEL DISPATCH BREAKDOWN:');
  console.log(`  - 📱 GSM Carrier SMS:       ${report.channels.sms_sent.toLocaleString()} Sent`);
  console.log(`  - 📩 Social Direct DMs:     ${report.channels.social_dm_sent.toLocaleString()} Sent`);
  console.log(`  - ✉️ B2B Executive Email:    ${report.channels.email_sent.toLocaleString()} Sent`);
  console.log(`  - 📝 Webform Submissions:   ${report.channels.webform_sent.toLocaleString()} Delivered`);
  console.log(`  - 💬 Inbound WhatsApp:      ${report.channels.whatsapp_inbound_connected.toLocaleString()} Connected`);
  console.log(`  - 🚀 Total Outbound Reach:  ${report.channels.total_outreach_dispatched.toLocaleString()} Leads`);

  console.log('\n🌐 WEBSITE & PROTOTYPE BEHAVIORAL ACTIONS:');
  console.log(`  - 👥 Leads Interacted:      ${report.website.totalUniqueLeadsInteracted.toLocaleString()} Unique Leads`);
  console.log(`  - 👁️ Total Page Views:       ${report.website.totalPageViews.toLocaleString()} Views`);
  console.log(`  - 🚀 Prototype Visits:      ${report.website.totalPrototypeVisits.toLocaleString()} Open Events`);
  console.log(`  - 🧮 Calculator Uses:       ${report.website.totalCalculatorConfigurations.toLocaleString()} Configurations`);
  console.log(`  - ⚡ Rage Clicks:            ${report.website.totalRageClicks}`);

  console.log('\n🔥 LEAD INTENT BREAKDOWN:');
  console.log(`  - 🔥 HOT  (Heat >= 70 / Calc): ${report.intent.hot}`);
  console.log(`  - ☀️ WARM (Outreach/Preview): ${report.intent.warm}`);
  console.log(`  - ❄️ COLD (Enriched Queue):  ${report.intent.cold}`);
  console.log('======================================================\n');
}

syncAllCustomerJourneys().catch(console.error);
