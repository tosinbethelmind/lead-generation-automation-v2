/**
 * @file scripts/lookup_lead.ts
 * Instant Lead & Outreach Lookup Utility
 * 
 * Usage:
 *   npx tsx scripts/lookup_lead.ts <phone_or_name_or_id>
 * 
 * Examples:
 *   npx tsx scripts/lookup_lead.ts 08022791227
 *   npx tsx scripts/lookup_lead.ts "Gennex"
 *   npx tsx scripts/lookup_lead.ts "lagos_det_08c0f850e8a0d9"
 */

import * as fs from 'fs';
import * as path from 'path';

const query = process.argv[2];

if (!query) {
  console.log('\n❌ Usage: npx tsx scripts/lookup_lead.ts <phone_number_or_business_name>\n');
  console.log('Example:');
  console.log('  npx tsx scripts/lookup_lead.ts 08031234567\n');
  process.exit(1);
}

const cleanQuery = query.replace(/\D/g, '');
const textQuery = query.toLowerCase().trim();

const LEADS_DB_PATH = path.join(process.cwd(), 'local_db', 'leads_db.json');
const SMS_LOG_PATH = path.join(process.cwd(), 'local_db', 'sms_dispatches.json');
const JOURNEYS_PATH = path.join(process.cwd(), 'local_db', 'lead_journeys.json');

let leads: any[] = [];
if (fs.existsSync(LEADS_DB_PATH)) {
  try {
    leads = JSON.parse(fs.readFileSync(LEADS_DB_PATH, 'utf8'));
  } catch (_) {}
}

let smsLogs: any[] = [];
if (fs.existsSync(SMS_LOG_PATH)) {
  try {
    smsLogs = JSON.parse(fs.readFileSync(SMS_LOG_PATH, 'utf8'));
  } catch (_) {}
}

let journeys: Record<string, any> = {};
if (fs.existsSync(JOURNEYS_PATH)) {
  try {
    journeys = JSON.parse(fs.readFileSync(JOURNEYS_PATH, 'utf8'));
  } catch (_) {}
}

// Find matching lead
const matches = leads.filter(l => {
  const p = (l.phone_e164 || l.phone_raw || l.phone || '').replace(/\D/g, '');
  const n = (l.name || l.business_name || '').toLowerCase();
  const id = (l.lead_id || l.id || '').toLowerCase();

  if (cleanQuery.length >= 7 && p.includes(cleanQuery.slice(-10))) return true;
  if (textQuery.length >= 3 && (n.includes(textQuery) || id.includes(textQuery))) return true;
  return false;
});

if (matches.length === 0) {
  // Check SMS log directly
  const smsMatch = smsLogs.filter(s => {
    const p = (s.phone || '').replace(/\D/g, '');
    const n = (s.name || '').toLowerCase();
    if (cleanQuery.length >= 7 && p.includes(cleanQuery.slice(-10))) return true;
    if (textQuery.length >= 3 && n.includes(textQuery)) return true;
    return false;
  });

  if (smsMatch.length === 0) {
    console.log(`\n🔍 No records found for "${query}" in Database.\n`);
    process.exit(0);
  }

  console.log(`\nFound ${smsMatch.length} SMS Log record(s) for "${query}":`);
  smsMatch.forEach((s, idx) => {
    console.log(`\n----------------------------------------`);
    console.log(`[Record #${idx + 1}]`);
    console.log(`• Business Name: ${s.name || 'Unknown'}`);
    console.log(`• Phone:         ${s.phone}`);
    console.log(`• Status:        ${s.status} (${s.gateway || 'Android Gateway'})`);
    console.log(`• Time Sent:     ${s.timestamp}`);
    if (s.prep_message) console.log(`• Message 1:     ${s.prep_message}`);
    if (s.link_message) console.log(`• Message 2:     ${s.link_message}`);
    if (s.message)      console.log(`• Message Sent:  ${s.message}`);
  });
  console.log(`----------------------------------------\n`);
  process.exit(0);
}

console.log(`\n🎯 Found ${matches.length} matching lead(s):\n`);

matches.slice(0, 3).forEach((lead, idx) => {
  const leadId = lead.lead_id || lead.id || 'N/A';
  const journey = journeys[leadId] || {};
  const sentSms = smsLogs.filter(s => s.lead_id === leadId || (lead.phone && s.phone && s.phone.includes(lead.phone.slice(-10))));

  console.log(`=======================================================`);
  console.log(`🏢 [LEAD #${idx + 1}] ${lead.name || lead.business_name || 'Commercial Target'}`);
  console.log(`=======================================================`);
  console.log(`• Sector / Category:  ${lead.category || lead.sector || 'Commercial Enterprise'}`);
  console.log(`• Location / Area:    ${lead.area || lead.city || 'Lagos, Nigeria'}`);
  console.log(`• Phone Number:       ${lead.phone_e164 || lead.phone || 'N/A'}`);
  console.log(`• Email:              ${lead.email || 'N/A'}`);
  console.log(`• Existing Website:   ${lead.website || lead.hasWebsite ? 'YES (' + (lead.website || 'Live') + ')' : 'NO (Needs Full DFY Website ₦75k)'}`);
  console.log(`• Live Preview Link:  https://www.bethelmindanalytics.com/preview/${leadId}`);
  console.log(`• Journey Stage:      ${journey.currentStage || (lead.sms_status ? 'OUTREACH_DISPATCHED' : 'ENRICHED')}`);
  console.log(`• Heat Score:         ${journey.heatScore || 20}/100 (${journey.intentLevel || 'WARM'})`);
  
  if (sentSms.length > 0) {
    console.log(`\n📬 WHAT WAS SENT TO THIS CLIENT ON SMS:`);
    sentSms.forEach((s, sIdx) => {
      console.log(`   [SMS #${sIdx + 1} - ${s.timestamp}] Status: ${s.status}`);
      if (s.prep_message) console.log(`   ➔ Part 1: "${s.prep_message}"`);
      if (s.link_message) console.log(`   ➔ Part 2: "${s.link_message}"`);
      if (s.message)      console.log(`   ➔ Message: "${s.message}"`);
    });
  } else {
    console.log(`\n📬 SMS Status: Not dispatched yet (Queued in Database)`);
  }

  console.log(`\n💡 WHAT TO SAY ON THE PHONE / WHATSAPP:`);
  if (lead.website || lead.hasWebsite) {
    console.log(`   "Hello! We saw your website and configured a 1-line script upgrade that lets your clients get instant quotes & book appointments 24/7 on WhatsApp without touching your current hosting (₦35k setup)."`);
  } else {
    console.log(`   "Hello! We built a turnkey 24/7 online quoting and sales portal for your business with a .com.ng domain, Google Maps listing, and WhatsApp sales closer (₦75k deposit / ₦150k total)."`);
  }
  console.log(`=======================================================\n`);
});
