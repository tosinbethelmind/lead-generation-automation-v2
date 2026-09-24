const fs = require('fs');
const path = require('path');

console.log('======================================================');
console.log('🔍 DEEP AUDIT OF ALL SMS DISPATCHES ACROSS ENTIRE REPO');
console.log('======================================================\n');

// 1. Audit activities.json
const actPath = path.join(process.cwd(), 'local_db', 'activities.json');
let actSms = [];
if (fs.existsSync(actPath)) {
  const acts = JSON.parse(fs.readFileSync(actPath, 'utf8'));
  actSms = acts.filter(a => JSON.stringify(a).toLowerCase().includes('sms'));
  console.log(`📱 activities.json: Found ${actSms.length} SMS activity records out of ${acts.length} total activities`);
  if (actSms.length > 0) {
    console.log('   Sample activity:', JSON.stringify(actSms[0], null, 2));
  }
}

// 2. Audit sms_dispatches.json
const smsPath = path.join(process.cwd(), 'local_db', 'sms_dispatches.json');
let smsDispatches = [];
if (fs.existsSync(smsPath)) {
  smsDispatches = JSON.parse(fs.readFileSync(smsPath, 'utf8'));
  console.log(`\n📱 sms_dispatches.json: Found ${smsDispatches.length} records`);
  if (smsDispatches.length > 0) {
    console.log('   Sample sms_dispatch:', JSON.stringify(smsDispatches[0], null, 2));
  }
}

// 3. Audit root log files: local_runner.log, services_output.log, startup_log.txt
const logFiles = ['local_runner.log', 'services_output.log', 'startup_log.txt', 'local_db/extended_harvester.log', 'local_db/customer_friction_tracker.log', 'local_db/ibadan10k_runner.log'];
logFiles.forEach(lf => {
  const p = path.join(process.cwd(), lf);
  if (fs.existsSync(p)) {
    const text = fs.readFileSync(p, 'utf8');
    const lines = text.split('\n');
    const smsLines = lines.filter(l => l.toLowerCase().includes('sms'));
    console.log(`\n📜 ${lf}: ${smsLines.length} SMS log lines found (out of ${lines.length} total lines)`);
    if (smsLines.length > 0) {
      console.log('   Sample log lines (top 3):');
      smsLines.slice(0, 3).forEach(l => console.log('     >', l.trim()));
    }
  }
});

// 4. Audit temp database backups in local_db
const localDb = path.join(process.cwd(), 'local_db');
const tempFiles = fs.readdirSync(localDb).filter(f => f.includes('leads_db.json.tmp'));
console.log(`\n📦 Checking ${tempFiles.length} temporary database backup files in local_db...`);

let totalSmsAcrossTempFiles = 0;
tempFiles.forEach(tf => {
  const fp = path.join(localDb, tf);
  try {
    const content = fs.readFileSync(fp, 'utf8');
    if (content.includes('sms_status') || content.includes('smsSent') || content.includes('sms_dispatched')) {
      try {
        const data = JSON.parse(content);
        const leads = Array.isArray(data) ? data : (data.leads || Object.values(data));
        let count = 0;
        leads.forEach(l => {
          if (l.sms_status === 'SENT' || l.smsSent || l.sms_dispatched || l.sms_sent) count++;
        });
        if (count > 0) {
          console.log(`   ▸ Backup ${tf}: Found ${count} leads with SMS sent!`);
          totalSmsAcrossTempFiles += count;
        }
      } catch (e) {}
    }
  } catch (e) {}
});

// 5. Check precise_channel_segmentation_report.json
const segPath = path.join(localDb, 'precise_channel_segmentation_report.json');
if (fs.existsSync(segPath)) {
  console.log(`\n📊 precise_channel_segmentation_report.json:`);
  console.log(fs.readFileSync(segPath, 'utf8'));
}
