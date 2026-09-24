const fs = require('fs');
const path = require('path');

function checkFile(rel) {
  const p = path.join(process.cwd(), rel);
  if (!fs.existsSync(p)) return 0;
  try {
    const raw = fs.readFileSync(p, 'utf8');
    const matches = raw.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
    const valid = matches.filter(e => !e.includes('example.com') && !e.includes('test.com') && !e.includes('.png') && !e.includes('.jpg') && !e.includes('wixpress') && !e.includes('sentry.io'));
    const unique = Array.from(new Set(valid.map(x => x.toLowerCase())));
    console.log(`${rel}: ${unique.length} unique emails found.`);
    return unique;
  } catch (e) {
    console.log(`${rel}: Error:`, e.message);
    return [];
  }
}

const f1 = checkFile('local_db/solar_leads_temp.json');
const f2 = checkFile('local_db/high_volume_staged_leads.json');
const f3 = checkFile('src/data/leads_bundle.json');
const f4 = checkFile('src/lib/preScrapedLeads.ts');
