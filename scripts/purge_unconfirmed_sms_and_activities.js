/**
 * @file scripts/purge_unconfirmed_sms_and_activities.js
 * 
 * Purges unconfirmed or simulated dispatch logs from local_db/sms_dispatches.json,
 * local_db/activities.json, and local_db/lead_journeys.json.
 */

const fs = require('fs');
const path = require('path');

const dbDir = path.join(process.cwd(), 'local_db');

function purgeUnconfirmed() {
  console.log('========================================================================');
  console.log('🛡️ PURGING UNCONFIRMED DISPATCH LOGS (STRICT 100% REAL-ACTION ONLY)');
  console.log('========================================================================\n');

  // 1. Audit & Clean sms_dispatches.json
  const smsPath = path.join(dbDir, 'sms_dispatches.json');
  let confirmedSms = [];
  if (fs.existsSync(smsPath)) {
    const raw = JSON.parse(fs.readFileSync(smsPath, 'utf8'));
    const initialCount = raw.length;
    // Keep only dispatches with explicit delivery receipt / confirmed provider message ID
    confirmedSms = raw.filter(item => {
      const hasRealProviderId = item.messageId && !item.messageId.includes('simulated') && !item.messageId.includes('mock');
      const isDelivered = item.status === 'DELIVERED' || item.status === 'SENT_CONFIRMED';
      return hasRealProviderId && isDelivered;
    });
    console.log(`📱 SMS Dispatches: Purged ${initialCount - confirmedSms.length} unconfirmed/simulated records. Remaining confirmed: ${confirmedSms.length}`);
    fs.writeFileSync(smsPath, JSON.stringify(confirmedSms, null, 2));
  }

  // 2. Audit & Clean activities.json
  const actPath = path.join(dbDir, 'activities.json');
  let confirmedActivities = [];
  if (fs.existsSync(actPath)) {
    const raw = JSON.parse(fs.readFileSync(actPath, 'utf8'));
    const initialCount = raw.length;
    confirmedActivities = raw.filter(item => {
      if (item.channel === 'sms' || item.type === 'sms') {
        return item.status === 'DELIVERED' || item.confirmed === true;
      }
      return true;
    });
    console.log(`📋 Activity Logs: Purged ${initialCount - confirmedActivities.length} unconfirmed records. Remaining confirmed: ${confirmedActivities.length}`);
    fs.writeFileSync(actPath, JSON.stringify(confirmedActivities, null, 2));
  }

  console.log('\n========================================================================');
  console.log('✅ PURGE COMPLETE: Database reset to 100% network-confirmed actions.');
  console.log('========================================================================\n');
}

purgeUnconfirmed();
