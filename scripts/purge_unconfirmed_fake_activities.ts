/**
 * @file scripts/purge_unconfirmed_fake_activities.ts
 * 
 * BETHELMIND ANALYTICS: SANITIZATION & FAKE DATA PURGE ENGINE
 * 
 * Responsibilities:
 * 1. Purges all unconfirmed/simulated SMS and Email activities from local_db/activities.json.
 * 2. Purges unconfirmed entries from local_db/sms_dispatches.json.
 * 3. Cleans unconfirmed outreach events from local_db/lead_journeys.json.
 * 4. Resets wa_outbound_dispatched and outreach_status flags in local_db/leads_db.json
 *    for leads where actual network delivery was not confirmed.
 */

import fs from 'fs';
import path from 'path';

const LOCAL_DB_DIR = path.join(process.cwd(), 'local_db');
const ACTIVITIES_PATH = path.join(LOCAL_DB_DIR, 'activities.json');
const SMS_DISPATCHES_PATH = path.join(LOCAL_DB_DIR, 'sms_dispatches.json');
const JOURNEYS_DB_PATH = path.join(LOCAL_DB_DIR, 'lead_journeys.json');
const LEADS_DB_PATH = path.join(LOCAL_DB_DIR, 'leads_db.json');
const WA_LOG_PATH = path.join(LOCAL_DB_DIR, 'whatsapp_daily_outreach_log.json');

function readJsonSafe(filePath: string, defaultVal: any): any {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
  } catch (e) {
    console.error(`Error reading ${filePath}:`, e);
  }
  return defaultVal;
}

function writeJsonAtomic(filePath: string, data: any) {
  try {
    const tmp = `${filePath}.tmp_${Date.now()}`;
    fs.writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf8');
    fs.renameSync(tmp, filePath);
  } catch (e) {
    console.error(`Error writing ${filePath}:`, e);
  }
}

async function purgeUnconfirmedData() {
  console.log('========================================================================');
  console.log('🧹 PURGING UNCONFIRMED SIMULATED DATA & RESETTING ACCURATE METRICS');
  console.log('========================================================================\n');

  // 1. Purge Activities (Keep only verified activities with genuine network status)
  let activities = readJsonSafe(ACTIVITIES_PATH, []);
  const initialActCount = Array.isArray(activities) ? activities.length : 0;
  
  // Filter out unconfirmed bulk simulated dispatches
  let cleanedActivities: any[] = [];
  if (Array.isArray(activities)) {
    cleanedActivities = activities.filter((act: any) => {
      // Keep real web visits, genuine callbacks, and verified transactions
      if (act.type === 'WEBSITE_VISIT' || act.type === 'PROTOTYPE_VIEW' || act.type === 'INBOUND_INQUIRY' || act.verified === true) {
        return true;
      }
      // Purge fake unconfirmed dispatches
      return false;
    });
  }

  console.log(`🧼 [Activities Log] Reduced from ${initialActCount} to ${cleanedActivities.length} verified events.`);
  writeJsonAtomic(ACTIVITIES_PATH, cleanedActivities);

  // 2. Purge SMS Dispatches (Filter out entries that lacked real network carrier confirmation)
  let smsDispatches = readJsonSafe(SMS_DISPATCHES_PATH, []);
  const initialSmsCount = Array.isArray(smsDispatches) ? smsDispatches.length : 0;
  
  let cleanedSms: any[] = [];
  if (Array.isArray(smsDispatches)) {
    cleanedSms = smsDispatches.filter((sms: any) => {
      return sms.status === 'CONFIRMED_DELIVERED' || sms.carrier_ack === true;
    });
  }

  console.log(`🧼 [SMS Dispatches] Reduced from ${initialSmsCount} to ${cleanedSms.length} network-confirmed dispatches.`);
  writeJsonAtomic(SMS_DISPATCHES_PATH, cleanedSms);

  // 3. Reset WhatsApp Log if it recorded unconfirmed standby dispatches
  let waLog = readJsonSafe(WA_LOG_PATH, { dates: {} });
  let waResetCount = 0;
  if (waLog.dates) {
    for (const dateKey of Object.keys(waLog.dates)) {
      const dayData = waLog.dates[dateKey];
      if (dayData && Array.isArray(dayData.dispatches)) {
        const initialCount = dayData.dispatches.length;
        dayData.dispatches = dayData.dispatches.filter((d: any) => d.success === true);
        const removed = initialCount - dayData.dispatches.length;
        waResetCount += removed;
        dayData.line1Count = dayData.dispatches.filter((d: any) => d.lineId === 1).length;
        dayData.line2Count = dayData.dispatches.filter((d: any) => d.lineId === 2).length;
      }
    }
  }
  console.log(`🧼 [WhatsApp Log] Removed ${waResetCount} failed/standby records from daily counts.`);
  writeJsonAtomic(WA_LOG_PATH, waLog);

  // 4. Sanitize Lead Journeys
  let journeys = readJsonSafe(JOURNEYS_DB_PATH, {});
  let journeysSanitized = 0;
  if (typeof journeys === 'object' && journeys !== null) {
    for (const leadId of Object.keys(journeys)) {
      const j = journeys[leadId];
      if (j && Array.isArray(j.timeline)) {
        const origTimeline = j.timeline.length;
        j.timeline = j.timeline.filter((ev: any) => ev.verified === true || ev.type === 'page_view');
        if (j.timeline.length !== origTimeline) journeysSanitized++;
      }
    }
  }
  console.log(`🧼 [Lead Journeys] Sanitized timeline records for ${journeysSanitized} leads.`);
  writeJsonAtomic(JOURNEYS_DB_PATH, journeys);

  // 5. Reset Lead Flags in leads_db.json
  let leads = readJsonSafe(LEADS_DB_PATH, []);
  let leadsResetCount = 0;
  if (Array.isArray(leads)) {
    leads.forEach((l: any) => {
      if (l.wa_outbound_dispatched && (!l.wa_delivered || l.wa_delivered === false)) {
        delete l.wa_outbound_dispatched;
        delete l.wa_outbound_dispatched_at;
        delete l.wa_outbound_line;
        leadsResetCount++;
      }
      if (l.outreach_status === 'DISPATCHED' && !l.last_contacted_at) {
        l.outreach_status = 'pending';
      }
    });
  }
  console.log(`🧼 [Leads Database] Reset unconfirmed dispatch status on ${leadsResetCount} leads.`);
  writeJsonAtomic(LEADS_DB_PATH, leads);

  console.log('\n========================================================================');
  console.log('✅ SANITIZATION COMPLETE: FAKE DATA PURGED, ACCURATE METRICS RESTORED');
  console.log('========================================================================\n');
}

if (require.main === module) {
  purgeUnconfirmedData().catch(console.error);
}

export { purgeUnconfirmedData };
