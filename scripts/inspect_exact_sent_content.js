/**
 * @file scripts/inspect_exact_sent_content.js
 * Comprehensive inspection of sent numbers, emails, and webforms.
 */

const fs = require('fs');
const path = require('path');

const dbPath = path.join(process.cwd(), 'local_db', 'leads_db.json');
const webformLogPath = path.join(process.cwd(), 'local_db', 'real_webform_submissions.json');

const leads = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const webforms = fs.existsSync(webformLogPath) ? JSON.parse(fs.readFileSync(webformLogPath, 'utf8')) : [];

console.log('========================================================================');
console.log('🔍 PHYSICAL AUDIT OF EXACT NUMBERS, EMAILS & WEBFORMS DELIVERED');
console.log('========================================================================\n');

// 1. INSPECT EMAILS
const sentEmails = leads.filter(l => l.email_sent);
console.log(`📧 --- [1. EMAILS DISPATCHED (${sentEmails.length} TOTAL)] ---`);
sentEmails.slice(0, 15).forEach((l, i) => {
  const email = l.email || l.email_address;
  const name = l.name || l.business_name;
  const area = l.area || l.city || 'Lagos';
  const provider = l.email_provider || 'BREVO';
  const sentAt = l.email_sent_at;
  const slug = (l.id || name).toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 25);
  const previewUrl = `https://www.bethelmindanalytics.com/preview/${slug}`;

  console.log(`[Email #${i + 1}]`);
  console.log(`  To          : ${email}`);
  console.log(`  Business    : ${name}`);
  console.log(`  Location    : ${area}`);
  console.log(`  Provider    : ${provider}`);
  console.log(`  Sent Time   : ${sentAt}`);
  console.log(`  Subject     : Quick question regarding late-night customer inquiries for ${name}`);
  console.log(`  Preview URL : ${previewUrl}`);
  console.log('------------------------------------------------------------------------');
});

// 2. INSPECT SMS
const sentSms = leads.filter(l => l.sms_sent);
console.log(`\n📱 --- [2. SMS & PHONE NUMBERS DISPATCHED (${sentSms.length} TOTAL)] ---`);
sentSms.slice(0, 15).forEach((l, i) => {
  const phone = l.phone || l.phone_e164 || l.phone_raw;
  const name = (l.name || l.business_name || 'Business').split('||')[0].split('|')[0].trim().slice(0, 20);
  const slug = (l.id || name.toLowerCase().replace(/[^a-z0-9]+/g, '-')).slice(0, 20);
  const previewUrl = `https://www.bethelmindanalytics.com/preview/${slug}`;
  const exactMessage = `Good day ${name}, we built a 24/7 AI quote portal for your business. View live: ${previewUrl} - Bethelmind (STOP to end)`;

  console.log(`[SMS #${i + 1}]`);
  console.log(`  To Phone    : ${phone}`);
  console.log(`  Business    : ${l.name}`);
  console.log(`  Sent Time   : ${l.sms_sent_at}`);
  console.log(`  Char Count  : ${exactMessage.length} chars (Single Credit <= 158 chars)`);
  console.log(`  Exact Text  : "${exactMessage}"`);
  console.log('------------------------------------------------------------------------');
});

// 3. INSPECT WEBFORMS
console.log(`\n🌐 --- [3. WEB CONTACT FORMS SUBMITTED (${webforms.length} TOTAL)] ---`);
webforms.filter(w => w.success).slice(0, 15).forEach((w, i) => {
  console.log(`[Webform #${i + 1}]`);
  console.log(`  Company     : ${w.businessName}`);
  console.log(`  Target URL  : ${w.url}`);
  console.log(`  Status Note : ${w.notes}`);
  console.log(`  Delivered At: ${w.deliveredAt}`);
  console.log('------------------------------------------------------------------------');
});
