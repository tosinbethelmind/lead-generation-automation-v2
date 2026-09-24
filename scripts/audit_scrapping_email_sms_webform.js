const dns = require('dns');
try { dns.setDefaultResultOrder('ipv4first'); } catch (_) {}

const fs = require('fs');
const path = require('path');

const LOCAL_DB = path.join(process.cwd(), 'local_db');

function readJsonSafe(filename, fallback = []) {
  try {
    const p = path.join(LOCAL_DB, filename);
    if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (e) {
    console.error(`Error reading ${filename}:`, e.message);
  }
  return fallback;
}

console.log('========================================================================');
console.log('🔬 DEEP AUTOMATION AUDIT: SCRAPING, EMAIL, SMS & WEBFORM PIPELINES');
console.log('========================================================================\n');

// 1. WEBFORMS AUDIT
const webforms = readJsonSafe('real_webform_submissions.json', []);
console.log('1. WEBFORM ENGINE STATUS:');
console.log(`   - Total Webform Attempts Recorded: ${webforms.length}`);
let webformSuccess = 0;
let webformFail = 0;
const webformReasons = {};
const webformSampleSuccess = [];
const webformSampleFail = [];

webforms.forEach(w => {
  if (w.success) {
    webformSuccess++;
    if (webformSampleSuccess.length < 3) webformSampleSuccess.push(w);
  } else {
    webformFail++;
    const note = (w.notes || 'Unknown').split(':')[0].trim();
    webformReasons[note] = (webformReasons[note] || 0) + 1;
    if (webformSampleFail.length < 3) webformSampleFail.push(w);
  }
});

console.log(`   - Successful Submissions: ${webformSuccess}`);
console.log(`   - Failed / Skipped: ${webformFail}`);
console.log(`   - Skip/Fail Reasons Breakdown:`, JSON.stringify(webformReasons, null, 2));

// 2. SMS AUDIT
const smsList = readJsonSafe('sms_dispatches.json', []);
console.log('\n2. CARRIER GSM SMS STATUS:');
console.log(`   - Total SMS Logged: ${smsList.length}`);
let smsSuccess = 0;
let smsFail = 0;
const smsGateways = {};
smsList.forEach(s => {
  if (s.success || s.status === 'DELIVERED' || s.status === 'SENT' || s.gateway) {
    smsSuccess++;
    const gw = s.gateway || s.provider || 'Android Gateway';
    smsGateways[gw] = (smsGateways[gw] || 0) + 1;
  } else {
    smsFail++;
  }
});
console.log(`   - Delivered / Sent: ${smsSuccess}`);
console.log(`   - Failed / Buffered: ${smsFail}`);
console.log(`   - Gateway Breakdown:`, JSON.stringify(smsGateways, null, 2));
if (smsList.length > 0) {
  const latestSms = smsList.slice(-2);
  console.log(`   - Latest SMS sample:`, JSON.stringify(latestSms, null, 2));
}

// 3. LEADS & SCRAPING QUALITY AUDIT
const leads = readJsonSafe('leads_db.json', []);
console.log('\n3. LEADS & SCRAPING ENGINE QUALITY AUDIT:');
console.log(`   - Total Leads in leads_db.json: ${leads.length}`);

let withEmail = 0;
let withWebsite = 0;
let withPhone = 0;
let validNigerianPhone = 0;
let foreignOrSuspicious = 0;
const categories = {};
const statesOrAreas = {};

leads.forEach(l => {
  const email = (l.email || l.email_address || '').trim();
  const phone = (l.phone || l.phone_e164 || l.phone_raw || '').replace(/\D/g, '');
  const website = (l.website || '').trim();
  const cat = l.category || 'Uncategorized';
  const area = l.area || l.city || 'Unknown';

  if (email && email.includes('@')) withEmail++;
  if (website && website.startsWith('http')) withWebsite++;
  if (phone) {
    withPhone++;
    const is234 = phone.startsWith('234') && phone.length === 13;
    const is0 = phone.startsWith('0') && phone.length === 11;
    if (is234 || is0) {
      validNigerianPhone++;
    } else {
      foreignOrSuspicious++;
    }
  }

  categories[cat] = (categories[cat] || 0) + 1;
  statesOrAreas[area] = (statesOrAreas[area] || 0) + 1;
});

console.log(`   - Leads with Valid Email: ${withEmail}`);
console.log(`   - Leads with Website: ${withWebsite}`);
console.log(`   - Leads with Phone Number: ${withPhone}`);
console.log(`   - Confirmed Nigerian Phone Numbers (+234 / 0...): ${validNigerianPhone}`);
console.log(`   - Non-Nigerian or Non-standard Phones: ${foreignOrSuspicious}`);

const topCats = Object.entries(categories).sort((a,b) => b[1] - a[1]).slice(0, 10);
console.log(`   - Top 10 Categories in Pool:`, JSON.stringify(topCats, null, 2));

// 4. SCRAPE JOBS STATUS
const scrapeJobs = readJsonSafe('scrape_jobs.json', []);
console.log('\n4. SCRAPE JOBS REPOSITORY:');
console.log(`   - Total Scrape Jobs in scrape_jobs.json: ${scrapeJobs.length}`);
const jobSources = {};
scrapeJobs.forEach(j => {
  const src = j.source || j.type || j.provider || 'unknown';
  jobSources[src] = (jobSources[src] || 0) + 1;
});
console.log(`   - Scrape Job Sources:`, JSON.stringify(jobSources, null, 2));

console.log('\n========================================================================');
console.log('AUDIT COMPLETE');
console.log('========================================================================');
