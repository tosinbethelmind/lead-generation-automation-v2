const fs = require('fs');
const path = require('path');

const LOCAL_DB_DIR = path.join(process.cwd(), 'local_db');

function readJsonSafe(filename, defaultVal = null) {
  try {
    const fullPath = path.join(LOCAL_DB_DIR, filename);
    if (fs.existsSync(fullPath)) {
      return JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    }
  } catch (e) {
    console.error(`Error reading ${filename}:`, e.message);
  }
  return defaultVal;
}

function runDetailedAudit() {
  console.log('===========================================================');
  console.log('   DEEP METRICS AUDIT REPORT (LOCAL DB & ENGINE LOGS)');
  console.log('===========================================================\n');

  // 1. LEADS SCRAPED
  const leadsDb = readJsonSafe('leads_db.json', []);
  const scrapeJobs = readJsonSafe('scrape_jobs.json', []);
  const highVolumeStaged = readJsonSafe('high_volume_staged_leads.json', []);
  const crmLeads = readJsonSafe('crm_leads.json', []);
  
  const totalLeadsDb = Array.isArray(leadsDb) ? leadsDb.length : Object.keys(leadsDb).length;
  const totalScrapeJobs = Array.isArray(scrapeJobs) ? scrapeJobs.length : Object.keys(scrapeJobs).length;
  const totalStaged = Array.isArray(highVolumeStaged) ? highVolumeStaged.length : Object.keys(highVolumeStaged).length;
  const totalCrm = Array.isArray(crmLeads) ? crmLeads.length : Object.keys(crmLeads).length;

  console.log(`1. LEADS SCRAPED & HARVESTED STATS:`);
  console.log(`   - Master Enriched Leads Database (leads_db.json): ${totalLeadsDb}`);
  console.log(`   - Raw Scrape Jobs / Lead Harvests (scrape_jobs.json): ${totalScrapeJobs}`);
  console.log(`   - High-Volume Staged Lead Buffer (high_volume_staged_leads.json): ${totalStaged}`);
  console.log(`   - CRM Pipeline Leads (crm_leads.json): ${totalCrm}`);

  // Check scraped today
  const todayStr = new Date().toISOString().split('T')[0];
  let scrapedTodayCount = 0;
  if (Array.isArray(scrapeJobs)) {
    scrapeJobs.forEach(job => {
      const created = job.created_at || job.createdAt || job.date;
      if (created && created.includes(todayStr)) scrapedTodayCount++;
    });
  }
  console.log(`   - Scrape Jobs Triggered Today (${todayStr}): ${scrapedTodayCount}`);

  // 2. MESSAGED LEADS & CHANNEL BREAKDOWN
  const activities = readJsonSafe('activities.json', []);
  const smsDispatches = readJsonSafe('sms_dispatches.json', []);
  const whatsappDailyLog = readJsonSafe('whatsapp_daily_outreach_log.json', []);
  const logsDb = readJsonSafe('logs_db.json', []);

  console.log(`\n2. MESSAGED LEADS & CHANNEL DISPATCHES:`);

  const channelTotals = {
    whatsapp: 0,
    sms: 0,
    email: 0,
    manual: 0,
    system: 0,
    pipeline: 0,
    social_dm: 0
  };

  const channelToday = {
    whatsapp: 0,
    sms: 0,
    email: 0,
    manual: 0,
    system: 0,
    pipeline: 0,
    social_dm: 0
  };

  if (Array.isArray(activities)) {
    activities.forEach(a => {
      const ch = (a.channel || a.type || 'other').toLowerCase();
      if (channelTotals[ch] !== undefined) channelTotals[ch]++;
      else channelTotals[ch] = 1;

      const timestamp = a.timestamp || a.created_at || a.date;
      if (timestamp && timestamp.includes(todayStr)) {
        if (channelToday[ch] !== undefined) channelToday[ch]++;
        else channelToday[ch] = 1;
      }
    });
  }

  // Add WhatsApp Daily Log
  let whatsappDailyTotal = 0;
  let whatsappDailyTodayCount = 0;
  if (Array.isArray(whatsappDailyLog)) {
    whatsappDailyTotal = whatsappDailyLog.length;
    whatsappDailyLog.forEach(w => {
      const dateStr = w.date || w.sent_at || w.timestamp;
      if (dateStr && dateStr.includes(todayStr)) whatsappDailyTodayCount++;
    });
  } else if (typeof whatsappDailyLog === 'object' && whatsappDailyLog !== null) {
    const dates = Object.keys(whatsappDailyLog);
    whatsappDailyTotal = dates.reduce((acc, d) => acc + (whatsappDailyLog[d]?.count || 0), 0);
    if (whatsappDailyLog[todayStr]) {
      whatsappDailyTodayCount = whatsappDailyLog[todayStr].count || (Array.isArray(whatsappDailyLog[todayStr]) ? whatsappDailyLog[todayStr].length : 0);
    }
  }

  // Add SMS Dispatches
  let smsTotal = 0;
  let smsTodayCount = 0;
  if (Array.isArray(smsDispatches)) {
    smsTotal = smsDispatches.length;
    smsDispatches.forEach(s => {
      const t = s.timestamp || s.created_at || s.sent_at;
      if (t && t.includes(todayStr)) smsTodayCount++;
    });
  }

  console.log(`   - All-Time Dispatches by Channel (from activities.json & dispatches):`);
  console.log(`     * WhatsApp DMs: ${channelTotals.whatsapp || whatsappDailyTotal} (WhatsApp Daily Logs: ${whatsappDailyTotal})`);
  console.log(`     * Carrier GSM SMS: ${channelTotals.sms || smsTotal} (SMS Dispatches Log: ${smsTotal})`);
  console.log(`     * B2B Executive Email: ${channelTotals.email}`);
  console.log(`     * Manual / Direct Outbound: ${channelTotals.manual}`);
  console.log(`     * System / Automated Workflows: ${channelTotals.system}`);

  console.log(`   - Today's Dispatches (${todayStr}):`);
  console.log(`     * WhatsApp DMs Today: ${channelToday.whatsapp || whatsappDailyTodayCount}`);
  console.log(`     * Carrier GSM SMS Today: ${channelToday.sms || smsTodayCount}`);
  console.log(`     * B2B Executive Email Today: ${channelToday.email}`);

  // 3. CUSTOMER JOURNEY TRACKER & FUNNEL STAGES
  const journeys = readJsonSafe('lead_journeys.json', {});
  const retargetingDecisions = readJsonSafe('retargeting_decisions.json', {});

  const journeyList = typeof journeys === 'object' && !Array.isArray(journeys) ? Object.values(journeys) : journeys;
  const decisionsList = typeof retargetingDecisions === 'object' && !Array.isArray(retargetingDecisions) ? Object.values(retargetingDecisions) : retargetingDecisions;

  console.log(`\n3. CUSTOMER JOURNEY & INTENT TRACKING:`);
  console.log(`   - Total Tracked Active Lead Journeys: ${journeyList.length}`);

  const stages = {};
  const intentLevels = {};
  let totalPageViews = 0;
  let totalCalculatorUse = 0;
  let totalVideoWatch = 0;
  let totalCheckoutAttempts = 0;
  let hotLeadsCount = 0;
  let criticalLeadsCount = 0;

  journeyList.forEach(j => {
    const st = j.currentStage || 'OUTREACH_DISPATCHED';
    stages[st] = (stages[st] || 0) + 1;

    const intent = j.intentLevel || 'WARM';
    intentLevels[intent] = (intentLevels[intent] || 0) + 1;

    if (intent === 'HOT') hotLeadsCount++;
    if (intent === 'CRITICAL') criticalLeadsCount++;

    if (j.metrics) {
      totalPageViews += j.metrics.pageViews || 0;
      totalCalculatorUse += j.metrics.calculatorInteractions || 0;
      totalVideoWatch += j.metrics.videoWatchSec || 0;
      totalCheckoutAttempts += j.metrics.checkoutAttempts || 0;
    }
  });

  console.log(`   - Current Funnel Stages Breakdown:`);
  Object.keys(stages).forEach(st => {
    console.log(`     * ${st}: ${stages[st]} leads`);
  });

  console.log(`   - Intent Level Heat Scoring:`);
  console.log(`     * WARM: ${intentLevels.WARM || 0}`);
  console.log(`     * HOT (Score >= 70 / High Engagement): ${intentLevels.HOT || hotLeadsCount}`);
  console.log(`     * CRITICAL (Ready for Rate Lock / Checkout): ${intentLevels.CRITICAL || criticalLeadsCount}`);
  console.log(`     * COLD: ${intentLevels.COLD || 0}`);

  console.log(`   - Live Behavioral Telemetry Aggregates:`);
  console.log(`     * Prototype Landing Page Visits: ${totalPageViews}`);
  console.log(`     * Interactive Calculator Interactions: ${totalCalculatorUse}`);
  console.log(`     * Video Teaser Watch Time: ${totalVideoWatch} seconds`);
  console.log(`     * Checkout / Invoice Request Attempts: ${totalCheckoutAttempts}`);

  console.log(`\n4. RETARGETING ENGINE DECISIONS:`);
  console.log(`   - Total Algorithmic Retargeting Recommendations Generated: ${decisionsList.length}`);
  const pendingDecisions = decisionsList.filter(d => d.status === 'PENDING').length;
  const dispatchedDecisions = decisionsList.filter(d => d.status === 'DISPATCHED').length;
  console.log(`     * Pending Execution (Co-Pilot Gate): ${pendingDecisions}`);
  console.log(`     * Dispatched Retargeting Messages: ${dispatchedDecisions}`);
}

runDetailedAudit();
