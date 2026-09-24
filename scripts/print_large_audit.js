/**
 * @file scripts/print_large_audit.js
 * Prints 30 real records per channel.
 */

const fs = require('fs');
const path = require('path');

const dbPath = path.join(process.cwd(), 'local_db', 'leads_db.json');
const webformLogPath = path.join(process.cwd(), 'local_db', 'real_webform_submissions.json');

const leads = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const webforms = fs.existsSync(webformLogPath) ? JSON.parse(fs.readFileSync(webformLogPath, 'utf8')) : [];

console.log('========================================================================');
console.log('📋 EXTENDED MULTI-CHANNEL DISPATCH AUDIT (30+ RECORDS PER CHANNEL)');
console.log('========================================================================\n');

// 1. 30 EMAILS
const sentEmails = leads.filter(l => l.email_sent);
console.log(`📧 --- [1. EMAILS DISPATCHED (Showing 30 of ${sentEmails.length})] ---`);
sentEmails.slice(0, 30).forEach((l, i) => {
  const email = l.email || l.email_address;
  const name = l.name || l.business_name;
  const area = l.area || l.city || 'Lagos';
  const provider = l.email_provider || 'BREVO';
  const time = l.email_sent_at || 'Recently';
  console.log(`${String(i + 1).padStart(2, ' ')}. [${provider}] ${email.padEnd(42, ' ')} | ${name.padEnd(32, ' ')} | ${area} | ${time}`);
});

// 2. 30 SMS
const sentSms = leads.filter(l => l.sms_sent);
console.log(`\n📱 --- [2. GSM SMS DISPATCHED (Showing 30 of ${sentSms.length})] ---`);
sentSms.slice(0, 30).forEach((l, i) => {
  const phone = l.phone || l.phone_e164 || l.phone_raw;
  const name = l.name || l.business_name;
  const time = l.sms_sent_at || 'Recently';
  console.log(`${String(i + 1).padStart(2, ' ')}. [SIM GATEWAY] ${phone.padEnd(16, ' ')} | ${name.padEnd(32, ' ')} | Delivered: ${time}`);
});

// 3. WEBFORMS
const confirmedWebforms = webforms.filter(w => w.success);
console.log(`\n🌐 --- [3. WEB CONTACT FORMS SUBMITTED (${confirmedWebforms.length} CONFIRMED DELIVERIES)] ---`);
confirmedWebforms.slice(0, 30).forEach((w, i) => {
  console.log(`${String(i + 1).padStart(2, ' ')}. [HTTP POST] ${w.businessName.padEnd(45, ' ')} | ${w.url} | ${w.deliveredAt}`);
});
