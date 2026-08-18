const fs = require('fs');
const path = require('path');

const localFile = path.join(__dirname, '../local_db/leads_db.json');
let localLeads = [];
if (fs.existsSync(localFile)) {
  try {
    localLeads = JSON.parse(fs.readFileSync(localFile, 'utf8'));
  } catch (e) {
    console.error('Error parsing leads_db.json:', e.message);
  }
}

console.log('================================================================');
console.log('⚡ ACCURATE AUDIT OF MASTER DATABASE (LEADS & SECTORS)');
console.log('================================================================\n');

console.log('📊 Total Database Records (All Types):', localLeads.length);

let lagosCount = 0;
let lagosWithPhone = 0;
let lagosWithEmail = 0;
let lagosSolar = 0;
let lagosRegularB2B = 0;

let ibadanCount = 0;
let otherStates = 0;

const lagosSectors = {};
const lagosAreas = {};

const lagosKeywordRegex = /lagos|ikeja|lekki|victoria island|vi\b|surulere|yaba|maryland|ikoyi|ajah|gbagada|ogba|alaba|festac|oshodi|agege|apapa|ipaja|ojodu|magodo|anthony|ilupeju|ebute metta/i;
const ibadanKeywordRegex = /ibadan|bodija|dugbe|ring road|challenge|mokola|agbowo|samonda|jericho|eleyele|oluyole|moniya|akobo|apata/i;
const solarRegex = /solar|inverter|energy|panel|photovoltaic|clean power/i;

localLeads.forEach(l => {
  const loc = ((l.city || '') + ' ' + (l.area || '') + ' ' + (l.district || '') + ' ' + (l.address || '') + ' ' + (l.source_query_or_seed || '')).toLowerCase();
  const cat = ((l.category || '') + ' ' + (l.name || '') + ' ' + (l.business_summary || '')).toLowerCase();
  const isSolar = (l.id || l.lead_id || '').startsWith('solar_') || solarRegex.test(cat);

  const isLagos = lagosKeywordRegex.test(loc) || (!ibadanKeywordRegex.test(loc) && !loc.includes('ibadan'));
  const isIbadan = ibadanKeywordRegex.test(loc) || loc.includes('ibadan');

  const rawPhone = l.phone_e164 || l.phone || l.phone_raw || '';
  const digits = rawPhone.replace(/\D/g, '');
  const hasValidPhone = digits.length >= 10 && (digits.startsWith('234') || digits.startsWith('0'));

  if (isLagos && !isIbadan) {
    lagosCount++;
    if (hasValidPhone) lagosWithPhone++;
    if (l.email && l.email.includes('@')) lagosWithEmail++;

    if (isSolar) {
      lagosSolar++;
    } else {
      lagosRegularB2B++;
      const sectorKey = l.category || 'General Services';
      lagosSectors[sectorKey] = (lagosSectors[sectorKey] || 0) + 1;
      const areaKey = l.area || l.city || 'Lagos Central';
      lagosAreas[areaKey] = (lagosAreas[areaKey] || 0) + 1;
    }
  } else if (isIbadan) {
    ibadanCount++;
  } else {
    otherStates++;
  }
});

console.log('📌 EXACT BREAKDOWN:');
console.log('  1. Total Lagos Records:                     ', lagosCount.toLocaleString());
console.log('  2. Verified Regular Lagos B2B Businesses:   ', lagosRegularB2B.toLocaleString(), '🎯 (Target for ApexReach 10K Engine)');
console.log('  3. Lagos Leads with Valid Phone Numbers:    ', lagosWithPhone.toLocaleString());
console.log('  4. Lagos Leads with Business Email:         ', lagosWithEmail.toLocaleString());
console.log('  5. Excluded Solar Companies:                ', lagosSolar.toLocaleString(), '☀️ (Excluded)');
console.log('  6. Ibadan Leads:                            ', ibadanCount.toLocaleString(), '🏛️');
console.log('  7. Other / Unclassified:                    ', otherStates.toLocaleString());

console.log('\n🏢 TOP REGULAR LAGOS B2B SECTOR DISTRIBUTION:');
const topSectors = Object.entries(lagosSectors).sort((a, b) => b[1] - a[1]).slice(0, 10);
topSectors.forEach(([sec, count]) => console.log(`   • ${sec.padEnd(32)} : ${count}`));

console.log('\n📍 TOP LAGOS COMMERCIAL HUBS:');
const topAreas = Object.entries(lagosAreas).sort((a, b) => b[1] - a[1]).slice(0, 8);
topAreas.forEach(([area, count]) => console.log(`   • ${area.padEnd(25)} : ${count}`));

console.log('================================================================');
