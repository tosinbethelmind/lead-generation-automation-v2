const fs = require('fs');

console.log('=== AUDITING REAL WEBSITE INTERACTIONS OF CONTACTED LEADS ===');

let journeys = {};
try {
  journeys = JSON.parse(fs.readFileSync('local_db/lead_journeys.json', 'utf8'));
} catch (e) {
  console.error('Failed to read lead_journeys.json:', e.message);
}

const allRecords = Object.values(journeys);
console.log('Total Leads Tracked in Journey Database:', allRecords.length);

// Leads contacted today via Email or SMS
const contactedLeads = allRecords.filter(r => {
  const hasOutreach = (r.events || []).some(e => e.stage === 'OUTREACH_DISPATCHED');
  return hasOutreach || r.currentStage === 'OUTREACH_DISPATCHED';
});
console.log('Total Contacted Leads (Outreach Dispatched):', contactedLeads.length);

// Interacted leads: any lead with pageViews > 0 or calculatorInteractions > 0 or events beyond OUTREACH_DISPATCHED
const interactedLeads = contactedLeads.filter(r => {
  const m = r.metrics || {};
  const hasMetricAction = (m.pageViews > 0) || (m.calculatorInteractions > 0) || (m.videoWatchSec > 0) || (m.chatMessages > 0) || (m.checkoutAttempts > 0);
  const hasAdvancedEvent = (r.events || []).some(e => ['PREVIEW_VIEWED', 'CALCULATOR_USED', 'VIDEO_WATCHED', 'CHAT_OPENED', 'INBOUND_REPLY', 'PILOT_ACTIVATED'].includes(e.stage));
  return hasMetricAction || hasAdvancedEvent;
});

console.log('\n--- INTERACTION METRICS ---');
console.log('Contacted Leads with Recorded Website Interactions:', interactedLeads.length);

if (interactedLeads.length > 0) {
  interactedLeads.forEach((lead, idx) => {
    console.log(`\n[${idx + 1}] Lead: ${lead.leadName} (${lead.phone || lead.email})`);
    console.log(`    Current Stage: ${lead.currentStage}`);
    console.log(`    Page Views: ${lead.metrics?.pageViews || 0}`);
    console.log(`    Calculator Runs: ${lead.metrics?.calculatorInteractions || 0}`);
    console.log(`    Audio/Video Watch Sec: ${lead.metrics?.videoWatchSec || 0}`);
    console.log(`    Chat Messages: ${lead.metrics?.chatMessages || 0}`);
    console.log(`    Last Active: ${lead.lastActiveIso || lead.lastUpdatedWat}`);
    console.log('    Events:', (lead.events || []).map(e => `${e.stage}: ${e.title}`).join(' -> '));
  });
} else {
  console.log('No website interactions recorded yet (0 page views, 0 calculator runs).');
}

// Also check activities.json for any recent telemetry pings
let activities = [];
try {
  activities = JSON.parse(fs.readFileSync('local_db/activities.json', 'utf8'));
} catch (_) {}

const recentViews = activities.filter(a => a.type === 'page_view' || a.action === 'preview_viewed' || a.type === 'calculator_interaction');
console.log('\nTotal Website Interaction Events in activities.json:', recentViews.length);
