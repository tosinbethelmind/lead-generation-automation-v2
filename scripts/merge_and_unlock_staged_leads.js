/**
 * @file scripts/merge_and_unlock_staged_leads.js
 * 
 * Safely merges all orphaned atomic write files (leads_db.json.tmp.*) 
 * into the canonical local_db/leads_db.json, deduplicating by phone and email,
 * and filtering out any synthetic/mock entries.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = process.cwd();
const LOCAL_DB = path.join(ROOT_DIR, 'local_db');
const MAIN_DB_PATH = path.join(LOCAL_DB, 'leads_db.json');

function isGenuineLead(l) {
  if (!l) return false;
  const name = (l.name || l.business_name || '').trim();
  if (!name || name.length < 3) return false;
  if (name.includes('#100') || name.includes('Enterprise #') || name.startsWith('mock_') || name.startsWith('synthetic_')) return false;

  // Phone validation
  if (l.phone) {
    const p = l.phone.replace(/\s+/g, '');
    if (p.includes('0000') || p.includes('1111') || p.includes('123456') || p.includes('0000001')) return false;
  }

  // Email validation
  if (l.email) {
    const em = l.email.toLowerCase().trim();
    if (em.includes('example.com') || em.includes('test.com') || em.includes('testlead.com') || em.includes('+234')) return false;
  }

  return true;
}

function runMerge() {
  console.log('========================================================================');
  console.log('🔄 MERGING & UNLOCKING ALL STAGED LEADS INTO MAIN DATABASE');
  console.log('========================================================================\n');

  const files = fs.readdirSync(LOCAL_DB).filter(f => f.startsWith('leads_db.json'));
  console.log('Found database files to merge:', files);

  let allRecords = [];
  for (const f of files) {
    const filePath = path.join(LOCAL_DB, f);
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      if (Array.isArray(data)) {
        console.log(`- Read ${data.length} records from ${f}`);
        allRecords.push(...data);
      }
    } catch (err) {
      console.warn(`- Could not parse ${f}: ${err.message}`);
    }
  }

  console.log(`\nTotal raw records collected: ${allRecords.length}`);

  const genuineRecords = allRecords.filter(isGenuineLead);
  console.log(`Genuine records after synthetic filter: ${genuineRecords.length}`);

  // Deduplicate by normalized key (email or phone or slug)
  const uniqueMap = new Map();
  for (const r of genuineRecords) {
    const emailKey = r.email ? `em:${r.email.toLowerCase().trim()}` : null;
    const phoneKey = r.phone ? `ph:${r.phone.replace(/\D/g, '')}` : null;
    const nameKey = `nm:${(r.name || r.business_name || '').toLowerCase().trim()}`;

    const key = emailKey || phoneKey || nameKey;
    if (!uniqueMap.has(key)) {
      uniqueMap.set(key, r);
    } else {
      // Merge properties if existing has missing phone or email
      const existing = uniqueMap.get(key);
      if (!existing.email && r.email) existing.email = r.email;
      if (!existing.phone && r.phone) existing.phone = r.phone;
      if (!existing.category && r.category) existing.category = r.category;
    }
  }

  const cleanMergedLeads = Array.from(uniqueMap.values());
  console.log(`✅ Final unique deduplicated genuine leads: ${cleanMergedLeads.length}\n`);

  // Write safely to temporary file then atomic rename
  const tempPath = MAIN_DB_PATH + '.new';
  fs.writeFileSync(tempPath, JSON.stringify(cleanMergedLeads, null, 2), 'utf8');
  fs.renameSync(tempPath, MAIN_DB_PATH);

  console.log(`💾 Successfully saved ${cleanMergedLeads.length} leads to ${MAIN_DB_PATH}!`);

  // Analyze solar leads inside merged DB
  const solarKeywords = ['solar', 'inverter', 'renewable', 'energy', 'power', 'battery'];
  const exclude = ['game', 'roblox', 'hotel', 'cinema', 'school', 'bakery', 'suits', 'court', 'church', 'lounge', 'restaurant', 'nail', 'beauty', 'dent', 'eye', 'solicitor', 'jiji', 'spa', 'foods', 'mall', 'supermarket', 'city', 'apartment'];

  const solarLeads = cleanMergedLeads.filter(l => {
    const name = (l.name || l.business_name || '').toLowerCase();
    const cat = (l.category || '').toLowerCase();
    return solarKeywords.some(k => name.includes(k) || cat.includes(k)) && !exclude.some(k => name.includes(k));
  });

  const solarWithEmail = solarLeads.filter(l => l.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(l.email));
  const solarWithPhone = solarLeads.filter(l => l.phone && l.phone.length >= 10);

  console.log('\n========================================================================');
  console.log('☀️ SOLAR SECTOR INVENTORY IN MERGED DATABASE:');
  console.log(`• Total Solar Leads: ${solarLeads.length}`);
  console.log(`• Solar Leads with Verified Business Email: ${solarWithEmail.length}`);
  console.log(`• Solar Leads with Verified Mobile Phone: ${solarWithPhone.length}`);
  console.log('========================================================================\n');
}

runMerge();
