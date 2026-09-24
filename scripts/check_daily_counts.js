const fs = require('fs');

let webforms = [];
if (fs.existsSync('local_db/real_webform_submissions.json')) {
  try {
    webforms = JSON.parse(fs.readFileSync('local_db/real_webform_submissions.json', 'utf8'));
  } catch (e) {
    console.error('Error reading webforms:', e.message);
  }
}

const today = '2026-09-11';
const yesterday = '2026-09-10';

let wfToday = 0;
let wfYesterday = 0;
const sampleEntries = [];

for (const w of webforms) {
  const time = w.submittedAt || w.timestamp || w.date || '';
  if (time.startsWith(today)) wfToday++;
  if (time.startsWith(yesterday)) wfYesterday++;
  if (sampleEntries.length < 3) sampleEntries.push(w);
}

console.log('--- WEBFORMS ---');
console.log('Total webforms recorded:', webforms.length);
console.log('Webforms today (' + today + '):', wfToday);
console.log('Webforms yesterday (' + yesterday + '):', wfYesterday);
console.log('Sample entries:', JSON.stringify(sampleEntries, null, 2));

console.log('--- EMAILS ---');
if (fs.existsSync('local_db/email_daemon_state.json')) {
  const emailState = JSON.parse(fs.readFileSync('local_db/email_daemon_state.json', 'utf8'));
  console.log('Email Daemon State:', JSON.stringify(emailState, null, 2));
}

// Also check leads_db or outreach logs
if (fs.existsSync('local_db/leads_db.json')) {
  try {
    const leads = JSON.parse(fs.readFileSync('local_db/leads_db.json', 'utf8'));
    let emailSent = 0;
    let webformSent = 0;
    let smsSent = 0;
    let waSent = 0;
    for (const l of leads) {
      if (l.email_sent || l.emailSent || (l.channels_dispatched && l.channels_dispatched.includes('email'))) emailSent++;
      if (l.webform_submitted || l.webformSubmitted || (l.channels_dispatched && l.channels_dispatched.includes('webform'))) webformSent++;
      if (l.sms_sent || l.smsSent || (l.channels_dispatched && l.channels_dispatched.includes('sms'))) smsSent++;
      if (l.whatsapp_sent || l.whatsappSent || (l.channels_dispatched && l.channels_dispatched.includes('whatsapp'))) waSent++;
    }
    console.log('--- LEADS DB CHANNEL TOTALS ---');
    console.log({ totalLeads: leads.length, emailSent, webformSent, smsSent, waSent });
  } catch (e) {
    console.error('Error leads_db:', e.message);
  }
}
