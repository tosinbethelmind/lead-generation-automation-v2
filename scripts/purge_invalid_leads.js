/**
 * purge_invalid_leads.js
 * 
 * Filters out invalid, junk, dummy, and incomplete leads from local_db/leads_db.json.
 * Preserves all genuine business leads with valid names, URLs, phone numbers, or addresses.
 */

const fs = require('fs');
const path = require('path');

const INVALID_NAMES = new Set([
  'test', 'demo', 'sample', 'undefined', 'null', 'none', 'n/a', 'unknown',
  'fake lead', 'test business', 'a', 'b', 'c', 'x', 'y', 'z', '?'
]);

const DUMMY_DOMAINS = new Set([
  'example.com', 'test.com', 'domain.com', 'none.com', 'tempmail.com',
  'mailinator.com', 'yopmail.com', 'dispostable.com', 'wixpress.com'
]);

function isDummyPhone(phone) {
  if (!phone) return false;
  const digits = String(phone).replace(/\D/g, '');
  if (/^(\d)\1{7,}$/.test(digits)) return true; // e.g. 0000000000, 1111111111
  if (digits === '1234567890' || digits === '0123456789' || digits === '9876543210') return true;
  return false;
}

function isValidLead(lead) {
  if (!lead || typeof lead !== 'object') return false;

  const name = (lead.name || lead.title || lead.business_name || '').trim();
  const lowerName = name.toLowerCase();

  // 1. Filter out invalid names
  if (!name || name.length < 2 || INVALID_NAMES.has(lowerName)) {
    return false;
  }

  // 2. Filter out dummy phones
  const phone = lead.phone || lead.phone_e164 || lead.phone_raw;
  if (isDummyPhone(phone)) {
    return false;
  }

  // 3. Filter out dummy email domains
  if (lead.email && typeof lead.email === 'string') {
    const domain = lead.email.split('@')[1]?.toLowerCase().trim();
    if (domain && DUMMY_DOMAINS.has(domain)) {
      lead.email = ''; // clear dummy email but keep lead if name/location is valid
    }
  }

  // 4. Require at least one valid identity attribute (Website, Location/Address, Phone, or Email)
  const hasWebsite = lead.website || lead.url || lead.link;
  const hasAddress = lead.address || lead.location || lead.city;
  const hasPhone = phone && phone.length >= 7 && !isDummyPhone(phone);
  const hasEmail = lead.email && lead.email.includes('@');

  if (!hasWebsite && !hasAddress && !hasPhone && !hasEmail) {
    return false; // completely blank contact info
  }

  return true;
}

function runPurge() {
  console.log('====================================================');
  console.log('🧹 PURGING INVALID LEADS FROM MASTER DATABASE');
  console.log('====================================================\n');

  const filePath = path.join(process.cwd(), 'local_db', 'leads_db.json');
  if (!fs.existsSync(filePath)) {
    console.error('❌ local_db/leads_db.json not found!');
    return;
  }

  const raw = fs.readFileSync(filePath, 'utf8');
  let leads = [];
  try {
    const parsed = JSON.parse(raw);
    leads = Array.isArray(parsed) ? parsed : Object.values(parsed);
  } catch (err) {
    console.error('❌ Error parsing leads_db.json:', err.message);
    return;
  }

  const initialCount = leads.length;
  console.log(`📊 Initial Master Lead Count: ${initialCount}`);

  const validLeads = [];
  let purgedDummyNames = 0;
  let purgedDummyPhones = 0;
  let purgedEmptyInfo = 0;

  for (const lead of leads) {
    const name = (lead.name || lead.title || lead.business_name || '').trim();
    const phone = lead.phone || lead.phone_e164 || lead.phone_raw;
    const hasWebsite = lead.website || lead.url || lead.link;
    const hasAddress = lead.address || lead.location || lead.city;

    if (!name || name.length < 2 || INVALID_NAMES.has(name.toLowerCase())) {
      purgedDummyNames++;
      continue;
    }

    if (isDummyPhone(phone)) {
      purgedDummyPhones++;
      continue;
    }

    if (!hasWebsite && !hasAddress && !phone && !lead.email) {
      purgedEmptyInfo++;
      continue;
    }

    // Clean up fields
    lead.name = name;
    lead.phone = phone || '';
    validLeads.push(lead);
  }

  const purgedCount = initialCount - validLeads.length;

  console.log(`\n====================================================`);
  console.log(`✨ PURGE COMPLETE REPORT:`);
  console.log(`----------------------------------------------------`);
  console.log(`❌ Purged Invalid / Dummy Business Names:  ${purgedDummyNames}`);
  console.log(`❌ Purged Fake / Sequence Phone Numbers:  ${purgedDummyPhones}`);
  console.log(`❌ Purged Completely Blank Contact Info:  ${purgedEmptyInfo}`);
  console.log(`----------------------------------------------------`);
  console.log(`🗑️ Total Invalid Leads Purged:            ${purgedCount}`);
  console.log(`⭐ Total 100% Valid Business Leads Kept:  ${validLeads.length}`);
  console.log(`====================================================\n`);

  // Write cleaned database
  fs.writeFileSync(filePath, JSON.stringify(validLeads, null, 2), 'utf8');
  console.log(`💾 Saved cleaned master database: ${filePath} (${(fs.statSync(filePath).size / (1024 * 1024)).toFixed(2)} MB)`);
}

runPurge();
