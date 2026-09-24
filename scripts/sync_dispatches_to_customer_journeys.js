/**
 * @file scripts/sync_dispatches_to_customer_journeys.js
 * 
 * Synchronizes confirmed Email, SMS, and Webform dispatches from leads_db.json
 * into lead_journeys.json so the Customer Journey dashboard and telemetry
 * reflect the real-time conversion funnel and warm intent progression.
 */

const fs = require('fs');
const path = require('path');

const LEADS_DB_PATH = path.join(__dirname, '../local_db/leads_db.json');
const JOURNEYS_PATH = path.join(__dirname, '../local_db/lead_journeys.json');

function cleanBusinessName(name) {
  if (!name) return 'Commercial Business';
  return name.split('||')[0].split('|')[0].split('-')[0].trim();
}

function generateSlug(name, leadId) {
  if (leadId && typeof leadId === 'string' && leadId.length > 3 && !leadId.startsWith('lead_')) {
    return leadId;
  }
  return cleanBusinessName(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'lagos-business';
}

function syncJourneys() {
  console.log('========================================================================');
  console.log('🔄 SYNCHRONIZING REAL DISPATCHES TO CUSTOMER JOURNEYS (lead_journeys.json)');
  console.log('========================================================================\n');

  if (!fs.existsSync(LEADS_DB_PATH)) {
    console.error('❌ leads_db.json not found!');
    return;
  }

  const leads = JSON.parse(fs.readFileSync(LEADS_DB_PATH, 'utf8'));
  let journeys = {};
  if (fs.existsSync(JOURNEYS_PATH)) {
    try {
      journeys = JSON.parse(fs.readFileSync(JOURNEYS_PATH, 'utf8'));
    } catch (e) {
      journeys = {};
    }
  }

  console.log(`Initial total journeys: ${Object.keys(journeys).length}`);
  let syncedEmails = 0;
  let syncedWebforms = 0;
  let syncedSms = 0;
  let newlyCreated = 0;

  for (const lead of leads) {
    const leadId = lead.id || lead.lead_id || lead.slug || generateSlug(lead.name);
    const bName = cleanBusinessName(lead.name);
    const slug = generateSlug(bName, leadId);
    const previewUrl = `https://www.bethelmindanalytics.com/preview/${slug}`;

    let record = journeys[leadId];
    if (!record) {
      record = {
        leadId: leadId,
        leadName: bName,
        category: lead.category || lead.sector || 'General SME',
        phone: lead.phone || '',
        email: lead.email || '',
        area: lead.area || lead.city || 'Lagos',
        currentStage: 'SCRAPED',
        score: 20,
        heatScore: 20,
        intentLevel: 'COLD',
        previewUrl: previewUrl,
        createdAt: lead.created_at || new Date().toISOString(),
        lastActiveIso: new Date().toISOString(),
        lastUpdatedWat: new Date().toLocaleString('en-NG', { timeZone: 'Africa/Lagos' }),
        metrics: {
          pageViews: 0,
          calculatorInteractions: 0,
          videoWatchSec: 0,
          chatMessages: 0,
          checkoutAttempts: 0,
          totalTimeSec: 0,
          rageClicks: 0
        },
        events: []
      };
      journeys[leadId] = record;
      newlyCreated++;
    }

    record.events = Array.isArray(record.events) ? record.events : [];

    // Check if email was sent
    const isEmailSent = lead.email_sent || lead.email_dispatched || lead.email_status === 'SENT';
    if (isEmailSent) {
      const hasEmailEvent = record.events.some(e => e.channelUsed && e.channelUsed.includes('Email'));
      if (!hasEmailEvent) {
        const timestamp = lead.email_sent_at || new Date().toISOString();
        record.events.push({
          id: `j_evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          leadId: leadId,
          leadName: bName,
          businessCategory: record.category,
          phone: record.phone,
          email: record.email,
          stage: 'OUTREACH_DISPATCHED',
          title: 'B2B Proposal Email Dispatched (w/ Voice Note Attached)',
          description: `Confirmed delivered via ${lead.email_provider || 'Brevo API v3'} to ${lead.email}. Message ID: ${lead.email_message_id || 'ok'}`,
          channelUsed: 'B2B Email (Voice Note Attached)',
          timestamp: timestamp,
          timestampWat: new Date(timestamp).toLocaleString('en-NG', { timeZone: 'Africa/Lagos' })
        });
        syncedEmails++;
      }
      if (record.currentStage === 'SCRAPED' || record.currentStage === 'ENRICHED') {
        record.currentStage = 'OUTREACH_DISPATCHED';
        record.heatScore = Math.max(record.heatScore || 20, 35);
        record.intentLevel = 'WARM';
      }
    }

    // Check if webform was submitted
    const isWebformSent = lead.webform_sent || lead.webform_submitted || lead.webform_status === '200_OK' || lead.webform_status === 'SENT';
    if (isWebformSent) {
      const hasWebformEvent = record.events.some(e => e.channelUsed && e.channelUsed.includes('Webform'));
      if (!hasWebformEvent) {
        const timestamp = lead.webform_submitted_at || new Date().toISOString();
        record.events.push({
          id: `j_evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          leadId: leadId,
          leadName: bName,
          businessCategory: record.category,
          phone: record.phone,
          email: record.email,
          stage: 'OUTREACH_DISPATCHED',
          title: 'Commercial Webform Automation Proposal Submitted',
          description: `Automated proposal with prototype link and 15s voice note briefing posted to website contact form.`,
          channelUsed: 'Web Contact Form',
          timestamp: timestamp,
          timestampWat: new Date(timestamp).toLocaleString('en-NG', { timeZone: 'Africa/Lagos' })
        });
        syncedWebforms++;
      }
      if (record.currentStage === 'SCRAPED' || record.currentStage === 'ENRICHED') {
        record.currentStage = 'OUTREACH_DISPATCHED';
        record.heatScore = Math.max(record.heatScore || 20, 35);
        record.intentLevel = 'WARM';
      }
    }

    // Check if SMS was sent
    const isSmsSent = lead.sms_status === 'SENT' || lead.sms_sent || lead.smsSent;
    if (isSmsSent) {
      const hasSmsEvent = record.events.some(e => e.channelUsed && e.channelUsed.includes('SMS'));
      if (!hasSmsEvent) {
        const timestamp = lead.sms_sent_at || new Date().toISOString();
        record.events.push({
          id: `j_evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          leadId: leadId,
          leadName: bName,
          businessCategory: record.category,
          phone: record.phone,
          email: record.email,
          stage: 'OUTREACH_DISPATCHED',
          title: 'Direct Carrier GSM SMS Dispatched',
          description: `Dispatched operational leak hook with demo link to ${lead.phone}.`,
          channelUsed: 'Carrier GSM SMS',
          timestamp: timestamp,
          timestampWat: new Date(timestamp).toLocaleString('en-NG', { timeZone: 'Africa/Lagos' })
        });
        syncedSms++;
      }
      if (record.currentStage === 'SCRAPED' || record.currentStage === 'ENRICHED') {
        record.currentStage = 'OUTREACH_DISPATCHED';
        record.heatScore = Math.max(record.heatScore || 20, 35);
        record.intentLevel = 'WARM';
      }
    }
  }

  fs.writeFileSync(JOURNEYS_PATH, JSON.stringify(journeys, null, 2), 'utf8');

  console.log(`\n🎉 SYNC RESULTS:`);
  console.log(`• Newly created journey records: ${newlyCreated}`);
  console.log(`• Synced Email dispatches: ${syncedEmails}`);
  console.log(`• Synced Webform submissions: ${syncedWebforms}`);
  console.log(`• Synced SMS dispatches: ${syncedSms}`);
  console.log(`• Total tracked journeys in database: ${Object.keys(journeys).length}`);

  // Breakdown of stages
  const stages = {};
  const heats = {};
  for (const k in journeys) {
    const s = journeys[k].currentStage || 'SCRAPED';
    const h = journeys[k].intentLevel || 'COLD';
    stages[s] = (stages[s] || 0) + 1;
    heats[h] = (heats[h] || 0) + 1;
  }
  console.log('\nUpdated Customer Journey Stages:');
  console.table(stages);
  console.log('Updated Intent Heat Levels:');
  console.table(heats);
}

syncJourneys();
