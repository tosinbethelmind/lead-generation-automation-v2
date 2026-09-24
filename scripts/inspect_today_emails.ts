/**
 * @file scripts/inspect_today_emails.ts
 * Checks exact emails dispatched today (2026-09-04) across all ledgers.
 */

import fs from 'fs';
import path from 'path';

function inspectEmails() {
  const todayStr = '2026-09-04';
  console.log(`Checking email dispatch records for: ${todayStr}\n`);

  // 1. email_daemon_state.json
  const daemonStatePath = path.join(process.cwd(), 'local_db', 'email_daemon_state.json');
  if (fs.existsSync(daemonStatePath)) {
    try {
      const daemonState = JSON.parse(fs.readFileSync(daemonStatePath, 'utf8'));
      console.log('--- email_daemon_state.json ---');
      console.log(JSON.stringify(daemonState, null, 2));
    } catch (e: any) {
      console.log('Error reading daemon state:', e.message);
    }
  }

  // 2. lead_journeys.json
  const journeysPath = path.join(process.cwd(), 'local_db', 'lead_journeys.json');
  let journeyEmailCountToday = 0;
  let journeyEmails: any[] = [];
  if (fs.existsSync(journeysPath)) {
    try {
      const journeys = JSON.parse(fs.readFileSync(journeysPath, 'utf8'));
      const records = Object.values(journeys) as any[];
      for (const rec of records) {
        if (rec.events && Array.isArray(rec.events)) {
          for (const ev of rec.events) {
            const isEmail = (ev.channelUsed && ev.channelUsed.toLowerCase().includes('email')) ||
                            (ev.eventType && ev.eventType.toLowerCase().includes('email')) ||
                            (ev.stage && ev.stage.toLowerCase().includes('email'));
            const isToday = ev.timestamp && ev.timestamp.startsWith(todayStr);
            if (isEmail && isToday) {
              journeyEmailCountToday++;
              journeyEmails.push({
                leadId: rec.leadId || rec.id,
                businessName: rec.leadName || rec.businessName,
                email: rec.email || ev.email,
                timestamp: ev.timestamp,
                channel: ev.channelUsed,
                title: ev.title
              });
            }
          }
        }
      }
      console.log(`\n--- lead_journeys.json ---`);
      console.log(`Total Email Events Today (${todayStr}): ${journeyEmailCountToday}`);
      if (journeyEmails.length > 0) {
        console.log('Sample sent emails:');
        console.log(journeyEmails.slice(0, 5));
      }
    } catch (e: any) {
      console.log('Error reading journeys:', e.message);
    }
  }

  // 3. activities.json
  const activitiesPath = path.join(process.cwd(), 'local_db', 'activities.json');
  if (fs.existsSync(activitiesPath)) {
    try {
      const activities = JSON.parse(fs.readFileSync(activitiesPath, 'utf8'));
      const emailActivitiesToday = (Array.isArray(activities) ? activities : []).filter((a: any) => {
        const isEmail = a.channel === 'EMAIL' || (a.action && a.action.toLowerCase().includes('email')) || (a.details && a.details.toLowerCase().includes('email'));
        const isToday = a.timestamp && a.timestamp.startsWith(todayStr);
        return isEmail && isToday;
      });
      console.log(`\n--- activities.json ---`);
      console.log(`Total Email Activities Today (${todayStr}): ${emailActivitiesToday.length}`);
    } catch (e: any) {
      console.log('Error reading activities:', e.message);
    }
  }
}

inspectEmails();
