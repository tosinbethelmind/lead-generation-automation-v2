const path = require('path');
const fs = require('fs');

const leadsPath = path.join(__dirname, '..', 'local_db', 'leads_db.json');
if (fs.existsSync(leadsPath)) {
  const leads = JSON.parse(fs.readFileSync(leadsPath, 'utf8'));
  const approvedLeads = leads.filter(l => l.status === 'APPROVED' || l.approved === true || l.outreach_status === 'APPROVED');
  const contactedToday = leads.filter(l => l.last_contacted && l.last_contacted.startsWith('2026-11-03'));
  console.log('Total Leads in DB        :', leads.length);
  console.log('Approved Leads in DB     :', approvedLeads.length);
  console.log('Contacted Today in DB    :', contactedToday.length);
} else {
  console.log('leads_db.json does not exist');
}
