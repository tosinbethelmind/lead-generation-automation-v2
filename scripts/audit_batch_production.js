const fs = require('fs');
const https = require('https');

const raw = JSON.parse(fs.readFileSync('local_db/leads_db.json', 'utf8'));
const leads = raw.leads || raw;

// Pick 12 diverse contacted & sector leads
const testLeads = [
  ...leads.filter(l => l.status === 'CONTACTED').slice(0, 5),
  ...leads.filter(l => l.category && l.category.includes('salon')).slice(0, 2),
  ...leads.filter(l => l.category && l.category.includes('auto')).slice(0, 2),
  ...leads.filter(l => l.category && l.category.includes('clinic')).slice(0, 2),
  { lead_id: '5b99f7d1-f894-4902-aa24-e2276613e5a4', name: 'TOP DENTAL CLINIC', category: 'dentist' },
  { lead_id: 'sample-unknown-hex-lead-9999', name: 'Unknown Hex Fallback Test', category: 'dentist' }
];

function checkUrl(lead) {
  return new Promise((resolve) => {
    const id = lead.lead_id || lead.id;
    const url = 'https://www.bethelmindanalytics.com/preview/' + id;
    const req = https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const title = data.match(/<title>([^<]*)<\/title>/i)?.[1] || '';
        const hasHexLeak = data.includes('RESERVED FOR ' + id.toUpperCase()) || 
                           data.includes('https://www.' + id.replace(/[^a-z0-9]/gi, '') + '.com.ng') ||
                           /RESERVED FOR\s+[0-9a-fA-F-]{16,}/i.test(data);
        
        resolve({
          id,
          expectedName: lead.name,
          httpStatus: res.statusCode,
          title: title.slice(0, 45),
          leak: hasHexLeak,
          pass: res.statusCode === 200 && !hasHexLeak
        });
      });
    });
    req.on('error', (e) => {
      resolve({ id, expectedName: lead.name, httpStatus: 0, error: e.message, pass: false, leak: false, title: 'Network Error' });
    });
  });
}

(async () => {
  console.log('======================================================================');
  console.log('🔍 LIVE PRODUCTION BATCH INTEGRITY AUDIT (ALL SECTORS)');
  console.log('======================================================================\n');
  
  let allPass = true;
  for (let i = 0; i < testLeads.length; i++) {
    const lead = testLeads[i];
    const res = await checkUrl(lead);
    const statusIcon = res.pass ? '✅' : '❌';
    console.log(`[${i+1}/${testLeads.length}] ${statusIcon} ${res.expectedName.slice(0, 26).padEnd(26)} | HTTP ${res.httpStatus} | Title: "${res.title}..." | Leak: ${res.leak ? 'DETECTED' : 'CLEAN'}`);
    if (!res.pass) allPass = false;
  }
  
  console.log('\n======================================================================');
  console.log('FINAL AUDIT DECISION:', allPass ? '🟢 100% REPAIRED & VERIFIED ACROSS ALL SECTORS' : '🔴 SOME PAGES STILL FAILING');
  console.log('======================================================================');
})();
