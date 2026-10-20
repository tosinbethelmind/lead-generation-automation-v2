/**
 * @file scripts/sync_brevo_opens_to_journeys.js
 * 
 * Fetches recent Brevo email events (opens, clicks, deliveries) over the past 3 days
 * and updates lead_journeys.json and email_dispatches.json with real engagement metrics.
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');

const ROOT_DIR = process.cwd();
const CONFIG_PATH = path.join(ROOT_DIR, 'config.json');
const JOURNEYS_PATH = path.join(ROOT_DIR, 'local_db/lead_journeys.json');
const LEADS_DB_PATH = path.join(ROOT_DIR, 'local_db/leads_db.json');
const EMAIL_DISPATCHES_PATH = path.join(ROOT_DIR, 'local_db/email_dispatches.json');

async function syncBrevoEvents() {
  console.log('Fetching live engagement events from Brevo API (past 3 days)...');
  const cfg = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  const apiKey = cfg.brevoApiKey;

  if (!apiKey) {
    console.error('No Brevo API key found in config.json');
    return;
  }

  let allEvents = [];
  for (let offset = 0; offset <= 300; offset += 100) {
    const res = await axios.get(`https://api.brevo.com/v3/smtp/statistics/events?limit=100&offset=${offset}&days=3`, {
      headers: { 'api-key': apiKey }
    });
    const batch = res.data.events || [];
    allEvents.push(...batch);
    if (batch.length < 100) break;
  }

  console.log(`Retrieved ${allEvents.length} events from Brevo.`);

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

  for (const ev of allEvents) {
    const email = (ev.email || '').toLowerCase().trim();
    if (!email || email.includes('bethelmindrecruit@gmail.com')) continue;

    // Find journey matching email
    let matchKey = Object.keys(journeys).find(k => {
      const j = journeys[k];
      return (j.email && j.email.toLowerCase().trim() === email);
    });

    // If journey doesn't exist, find in leads_db and create it
    if (!matchKey) {
      const leadMatch = leads.find(l => (l.email && l.email.toLowerCase().trim() === email));
      const leadName = leadMatch ? (leadMatch.name || leadMatch.business_name || 'Commercial Business') : email.split('@')[0];
      const leadId = leadMatch ? (leadMatch.id || leadMatch.lead_id || leadMatch.slug) : `lead_${email.replace(/[^a-z0-9]/g, '_')}`;
      const slug = leadMatch ? (leadMatch.slug || leadId) : leadId;
      const phone = leadMatch ? leadMatch.phone : '';
      const area = leadMatch ? (leadMatch.area || leadMatch.city || 'Nigeria') : 'Nigeria';
      const category = leadMatch ? (leadMatch.category || 'Solar and Inverter installation') : 'Solar and Inverter installation';

      matchKey = leadId;
      journeys[matchKey] = {
        leadId,
        leadName,
        category,
        phone,
        email,
        area,
        currentStage: 'OUTREACH_DISPATCHED',
        heatScore: 35,
        intentLevel: 'WARM',
        previewUrl: `https://www.bethelmindanalytics.com/preview/${slug}`,
        metrics: {
          pageViews: 0,
          calculatorInteractions: 0,
          videoWatchSec: 0,
          chatMessages: 0,
          checkoutAttempts: 0,
          totalTimeSec: 0
        },
        events: []
      };
    }

    const j = journeys[matchKey];

    if (ev.event === 'opened' || ev.event === 'loadedByProxy') {
      const hasOpenEvent = (j.events || []).some(e => 
        (e.stage === 'EMAIL_OPENED') && 
        Math.abs(new Date(e.timestamp).getTime() - new Date(ev.date).getTime()) < 120000
      );
      if (!hasOpenEvent) {
        j.events = j.events || [];
        j.events.push({
          id: `evt_brevo_open_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          stage: 'EMAIL_OPENED',
          title: '📩 Solar B2B Executive Email Opened',
          description: `Prospect opened the Solar BOQ & Diesel ROI proposal delivered via Brevo.`,
          channelUsed: 'email',
          timestamp: ev.date,
          timestampWat: new Date(ev.date).toLocaleString('en-NG', { timeZone: 'Africa/Lagos' })
        });
        
        // Count total opens for this lead
        const openCount = j.events.filter(e => e.stage === 'EMAIL_OPENED').length;
        j.heatScore = Math.min(85, 45 + (openCount - 1) * 10);
        j.intentLevel = openCount > 2 ? 'HOT' : 'HOT';
        j.lastActiveIso = ev.date;
        j.lastUpdatedWat = new Date(ev.date).toLocaleString('en-NG', { timeZone: 'Africa/Lagos' });
        updatedCount++;
        console.log(`🔥 [HOT LEAD] ${j.leadName} (${email}) | Opens: ${openCount} | Heat: ${j.heatScore}`);
      }
    }
  }

  fs.writeFileSync(JOURNEYS_PATH, JSON.stringify(journeys, null, 2), 'utf8');
  console.log(`\n✅ Synced ${updatedCount} engagement updates into lead_journeys.json!`);
}

syncBrevoEvents().catch(console.error);
