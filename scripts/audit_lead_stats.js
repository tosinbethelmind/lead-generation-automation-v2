const fs = require('fs');
const path = require('path');

function getCount(filePath) {
  if (!fs.existsSync(filePath)) return 'File not found';
  try {
    const stat = fs.statSync(filePath);
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    const count = Array.isArray(data) ? data.length : (data.leads ? data.leads.length : Object.keys(data).length);
    return `${count} items (${(stat.size / 1024 / 1024).toFixed(2)} MB, modified: ${stat.mtime.toISOString()})`;
  } catch (e) {
    return `Error reading/parsing: ${e.message}`;
  }
}

const files = [
  'local_db/leads_db.json',
  'data/leads_db.json',
  'local_db/crm_leads.json',
  'local_db/high_volume_staged_leads.json',
  'local_db/leads.json',
  'local_db/solar_leads_temp.json',
  'leads_colab_backup.json'
];

console.log('=== LEAD DATABASE AUDIT ===');
for (const f of files) {
  console.log(`${f.padEnd(42)}: ${getCount(f)}`);
}

// Check recent entries in leads_db.json
try {
  const leadsDb = JSON.parse(fs.readFileSync('local_db/leads_db.json', 'utf8'));
  const leads = Array.isArray(leadsDb) ? leadsDb : (leadsDb.leads || []);
  console.log(`\nTotal verified leads in local_db/leads_db.json: ${leads.length}`);
  const withEmail = leads.filter(l => l.email && l.email.trim().length > 0 && !l.email.includes('example.com'));
  const withPhone = leads.filter(l => l.phone && l.phone.trim().length > 0);
  const withWebsite = leads.filter(l => l.website && l.website.trim().length > 0);
  console.log(`- With valid email: ${withEmail.length}`);
  console.log(`- With phone number: ${withPhone.length}`);
  console.log(`- With website: ${withWebsite.length}`);
  
  if (leads.length > 0) {
    const latest = leads.slice(-3);
    console.log('\nLatest 3 leads harvested:');
    latest.forEach((l, idx) => {
      console.log(`  [${idx + 1}] ${l.name || l.business_name || l.company} | Sector: ${l.sector || l.category} | State: ${l.state || l.city || 'Lagos'} | Contact: ${l.phone || l.email || l.website}`);
    });
  }
} catch (e) {
  console.log('Could not inspect leads_db.json details:', e.message);
}
