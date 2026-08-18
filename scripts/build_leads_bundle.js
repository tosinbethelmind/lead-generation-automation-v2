const fs = require('fs');
const path = require('path');

const localDbPath = path.join(__dirname, '../local_db/leads_db.json');
const crmPath = path.join(__dirname, '../local_db/crm_leads.json');
const outDir = path.join(__dirname, '../src/data');
const outPath = path.join(outDir, 'leads_bundle.json');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

let allLeads = [];

if (fs.existsSync(localDbPath)) {
  const content = fs.readFileSync(localDbPath, 'utf8');
  try {
    const parsed = JSON.parse(content);
    allLeads = parsed.leads || (Array.isArray(parsed) ? parsed : Object.values(parsed));
  } catch (e) {
    console.error('Error reading local_db/leads_db.json:', e.message);
  }
}

if (fs.existsSync(crmPath)) {
  try {
    const crm = JSON.parse(fs.readFileSync(crmPath, 'utf8'));
    if (Array.isArray(crm)) {
      crm.forEach(c => {
        const id = c.id || c.lead_id;
        if (id && !allLeads.find(l => (l.lead_id === id || l.id === id))) {
          allLeads.push({
            lead_id: id,
            name: c.name || 'Lagos Enterprise',
            category: c.sector || c.category || 'Professional Services',
            address: `${c.area || 'Lagos'}, Lagos`,
            area: c.area || 'Lagos',
            city: 'Lagos',
            phone_e164: c.phone || c.phone_e164 || '',
            phone_raw: c.phone || c.phone_raw || '',
            email: c.email || '',
            website: c.website || '',
            rating: 4.8,
            reviews_count: 24,
            status: c.status || 'NEW'
          });
        }
      });
    }
  } catch (_) {}
}

console.log(`Building bundled leads dictionary from ${allLeads.length} leads...`);

// Create indexed dictionary by lead_id, id, and normalized name/slug
const lookup = {};
allLeads.forEach(l => {
  const id = l.lead_id || l.id;
  if (!id) return;

  const entry = {
    lead_id: id,
    source: l.source || 'GOOGLE',
    name: l.name,
    category: l.category || 'Professional Services',
    address: l.address || `${l.area || 'Lagos'}, Nigeria`,
    area: l.area || 'Lagos',
    city: l.city || 'Lagos',
    phone_e164: l.phone_e164 || '',
    phone_raw: l.phone_raw || l.phone || '',
    email: l.email || '',
    website: l.website || '',
    rating: l.rating || 4.8,
    reviews_count: l.reviews_count || 15,
    business_summary: l.business_summary || `${l.name} — Lagos Commercial Enterprise`,
    status: l.status || 'NEW'
  };

  // Index by primary ID
  lookup[id] = entry;

  // Also index by clean slug if length >= 3
  if (l.name && typeof l.name === 'string') {
    const slug = l.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (slug.length >= 3 && !lookup[slug]) {
      lookup[slug] = entry;
    }
  }
});

fs.writeFileSync(outPath, JSON.stringify(lookup), 'utf8');
const stat = fs.statSync(outPath);
console.log(`✅ Generated src/data/leads_bundle.json (${(stat.size / 1024 / 1024).toFixed(2)} MB, ${Object.keys(lookup).length} indexed keys)`);
