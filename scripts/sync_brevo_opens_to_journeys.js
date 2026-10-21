/**
 * @file scripts/sync_brevo_opens_to_journeys.js
 * 
 * Fetches live engagement telemetry (opens, clicks, prototype visits, WhatsApp clicks)
 * across BOTH Brevo accounts over the past 3 days and updates:
 * 1. local_db/lead_journeys.json
 * 2. local_db/email_dispatches.json
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');

const ROOT_DIR = process.cwd();
const CONFIG_PATH = path.join(ROOT_DIR, 'config.json');
const JOURNEYS_PATH = path.join(ROOT_DIR, 'local_db/lead_journeys.json');
const LEADS_DB_PATH = path.join(ROOT_DIR, 'local_db/leads_db.json');
const EMAIL_DISPATCHES_PATH = path.join(ROOT_DIR, 'local_db/email_dispatches.json');

async function fetchAllEventsForAccount(apiKey, accLabel) {
  if (!apiKey) return [];
  const events = [];
  try {
    for (let offset = 0; offset <= 300; offset += 100) {
      const res = await axios.get(`https://api.brevo.com/v3/smtp/statistics/events?limit=100&offset=${offset}&days=3`, {
        headers: { 'api-key': apiKey },
        timeout: 10000
      });
      const batch = res.data.events || [];
      events.push(...batch);
      if (batch.length < 100) break;
    }
    console.log(`[${accLabel}] Retrieved ${events.length} total events.`);
  } catch (err) {
    console.error(`[${accLabel}] Error fetching events:`, err.response?.data || err.message);
  }
  return events;
}

async function syncAll() {
  console.log('========================================================================');
  console.log('🔄 SYNCING LIVE ENGAGEMENT (OPENS & CLICKS) ACROSS DUAL BREVO FLEET');
  console.log('========================================================================\n');

  const cfg = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  const key1 = cfg.brevoApiKeys ? cfg.brevoApiKeys[0] : cfg.brevoApiKey;
  const key2 = cfg.brevoApiKeys ? cfg.brevoApiKeys[1] : null;

  const events1 = await fetchAllEventsForAccount(key1, 'Brevo Account 1 (Primary)');
  const events2 = await fetchAllEventsForAccount(key2, 'Brevo Account 2 (Secondary)');

  const allEvents = [...events1, ...events2];
  console.log(`\nTotal Combined Events Retrieved: ${allEvents.length}`);

  let journeys = {};
  if (fs.existsSync(JOURNEYS_PATH)) {
    try {
      journeys = JSON.parse(fs.readFileSync(JOURNEYS_PATH, 'utf8'));
    } catch (_) {
      journeys = {};
    }
  }

  let leads = [];
  if (fs.existsSync(LEADS_DB_PATH)) {
    try {
      leads = JSON.parse(fs.readFileSync(LEADS_DB_PATH, 'utf8'));
    } catch (_) {}
  }

  let updatedCount = 0;
  const hotLeads = [];

  for (const ev of allEvents) {
    const email = (ev.email || '').toLowerCase().trim();
    if (!email || email.includes('bethelmindrecruit@gmail.com') || email.includes('kingdomenforcementnetwork')) continue;

    // Find journey matching email
    let matchKey = Object.keys(journeys).find(k => {
      const j = journeys[k];
      return (j.email && j.email.toLowerCase().trim() === email);
    });

    if (!matchKey) {
      const leadMatch = leads.find(l => (l.email && l.email.toLowerCase().trim() === email));
      const leadName = leadMatch ? (leadMatch.name || leadMatch.company_name || 'Commercial Business') : email.split('@')[0];
      const leadId = leadMatch ? (leadMatch.lead_id || leadMatch.slug) : `lead_${email.replace(/[^a-z0-9]/g, '_')}`;
      const slug = leadMatch ? (leadMatch.slug || leadId) : leadId;
      const phone = leadMatch ? leadMatch.phone : '';
      const area = leadMatch ? (leadMatch.area || leadMatch.city || 'Lagos') : 'Lagos';
      const category = leadMatch ? (leadMatch.category || 'Commercial Enterprise') : 'Commercial Enterprise';

      matchKey = slug;
      journeys[matchKey] = {
        leadId: slug,
        leadName,
        category,
        phone,
        email,
        area,
        currentStage: 'OUTREACH_DISPATCHED',
        score: 85,
        heatScore: 35,
        intentLevel: 'WARM',
        previewUrl: `https://www.bethelmindanalytics.com/preview/${slug}`,
        createdAt: ev.date || new Date().toISOString(),
        lastActiveIso: ev.date || new Date().toISOString(),
        lastUpdatedWat: new Date(ev.date || Date.now()).toLocaleTimeString('en-GB') + ' WAT',
        metrics: { pageViews: 0, calculatorInteractions: 0, videoWatchSec: 0, chatMessages: 0, checkoutAttempts: 0, totalTimeSec: 0 },
        events: []
      };
    }

    const journey = journeys[matchKey];
    journey.lastActiveIso = ev.date || new Date().toISOString();
    journey.lastUpdatedWat = new Date(ev.date || Date.now()).toLocaleTimeString('en-GB') + ' WAT';

    // Handle Open Event
    if (ev.event === 'opened' || ev.event === 'unique_opened') {
      const eventId = `evt_open_${new Date(ev.date).getTime()}_${matchKey.slice(0, 8)}`;
      if (!journey.events.some(e => e.id === eventId || (e.stage === 'EMAIL_OPENED' && Math.abs(new Date(e.timestamp) - new Date(ev.date)) < 5000))) {
        journey.heatScore = Math.min(95, (journey.heatScore || 35) + 15);
        journey.intentLevel = journey.heatScore >= 65 ? 'HOT' : 'WARM';
        if (journey.currentStage === 'OUTREACH_DISPATCHED') {
          journey.currentStage = 'EMAIL_OPENED';
        }

        journey.events.unshift({
          id: eventId,
          leadId: matchKey,
          leadName: journey.leadName,
          stage: 'EMAIL_OPENED',
          title: 'Proposal Email Opened',
          description: `Prospect opened executive email proposal via Brevo tracking (${ev.subject || 'B2B Proposal'})`,
          channelUsed: 'Email Telemetry',
          timestamp: ev.date,
          timestampWat: new Date(ev.date).toLocaleTimeString('en-GB') + ' WAT'
        });
        updatedCount++;
      }
    }

    // Handle Click Event
    if (ev.event === 'clicks') {
      const eventId = `evt_click_${new Date(ev.date).getTime()}_${matchKey.slice(0, 8)}`;
      if (!journey.events.some(e => e.id === eventId || (e.stage === 'ENGAGEMENT_CLICKED' && Math.abs(new Date(e.timestamp) - new Date(ev.date)) < 5000))) {
        const link = ev.link || '';
        const isWa = link.includes('wa.me');
        const isVoice = link.includes('.mp3');
        const isPreview = link.includes('/preview/');

        journey.heatScore = Math.min(95, (journey.heatScore || 45) + 25);
        journey.intentLevel = 'HOT';
        
        if (isWa) {
          journey.currentStage = 'WHATSAPP_CLOSER_ENGAGED';
        } else if (isPreview) {
          journey.currentStage = 'PREVIEW_VIEWED';
          journey.metrics.pageViews = (journey.metrics.pageViews || 0) + 1;
        }

        let clickType = 'Proposal Link Clicked';
        if (isWa) clickType = '💬 WhatsApp Closer Link Clicked (0802 279 1227)';
        else if (isVoice) clickType = '🎙️ 15s Executive Audio Briefing Played';
        else if (isPreview) clickType = '🖥️ Pre-Built Website Prototype Viewed';

        journey.events.unshift({
          id: eventId,
          leadId: matchKey,
          leadName: journey.leadName,
          stage: isWa ? 'WHATSAPP_CLOSER_ENGAGED' : 'ENGAGEMENT_CLICKED',
          title: clickType,
          description: `Prospect clicked: ${link}`,
          channelUsed: 'Client Action Telemetry',
          timestamp: ev.date,
          timestampWat: new Date(ev.date).toLocaleTimeString('en-GB') + ' WAT',
          metadata: { link }
        });
        updatedCount++;
      }
    }

    if (journey.intentLevel === 'HOT' && !hotLeads.some(h => h.email === journey.email)) {
      hotLeads.push({
        name: journey.leadName,
        email: journey.email,
        phone: journey.phone,
        category: journey.category,
        heatScore: journey.heatScore,
        currentStage: journey.currentStage,
        previewUrl: journey.previewUrl
      });
    }
  }

  // Save updated journeys
  fs.writeFileSync(JOURNEYS_PATH, JSON.stringify(journeys, null, 2));

  console.log(`\n✅ Synced ${updatedCount} engagement actions into lead_journeys.json!`);
  console.log(`🔥 Total High-Intent Hot Leads Identified: ${hotLeads.length}\n`);

  console.log('TOP HIGH-CONVERSION HOT LEADS:');
  hotLeads.sort((a,b) => b.heatScore - a.heatScore).slice(0, 15).forEach((h, idx) => {
    console.log(`${idx + 1}. [${h.heatScore}/100] ${h.name} (${h.category})`);
    console.log(`   Email: ${h.email} | Phone: ${h.phone || 'N/A'}`);
    console.log(`   Stage: ${h.currentStage}`);
    console.log(`   Preview: ${h.previewUrl}\n`);
  });
}

syncAll().catch(err => {
  console.error('Fatal sync error:', err);
  process.exit(1);
});
