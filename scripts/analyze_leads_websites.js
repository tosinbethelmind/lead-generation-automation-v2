const fs = require('fs');
const path = require('path');

const leads = JSON.parse(fs.readFileSync(path.join(__dirname, '../local_db/leads_db.json'), 'utf8'));

console.log('Total leads:', leads.length);

const domains = {};
let directoryUrls = 0;
let validCompanyWebsites = 0;
let noWebsite = 0;
let invalidFormat = 0;

leads.forEach(l => {
  const w = (l.website || '').trim();
  if (!w) {
    noWebsite++;
    return;
  }
  if (!w.startsWith('http://') && !w.startsWith('https://')) {
    invalidFormat++;
    return;
  }
  try {
    const parsed = new URL(w);
    const host = parsed.hostname.toLowerCase();
    domains[host] = (domains[host] || 0) + 1;
    if (host.includes('jiji.ng') || host.includes('businesslist.com.ng') || host.includes('finelib.com') || host.includes('google.com') || host.includes('facebook.com') || host.includes('instagram.com') || host.includes('vconnect.com')) {
      directoryUrls++;
    } else {
      validCompanyWebsites++;
    }
  } catch (e) {
    invalidFormat++;
  }
});

console.log('No website:', noWebsite);
console.log('Invalid format:', invalidFormat);
console.log('Directory/Social URLs (Jiji, BusinessList, Facebook, etc.):', directoryUrls);
console.log('Independent company websites:', validCompanyWebsites);

const topDomains = Object.entries(domains).sort((a,b) => b[1] - a[1]).slice(0, 15);
console.log('\nTop 15 Hostnames in leads_db.json:', topDomains);
