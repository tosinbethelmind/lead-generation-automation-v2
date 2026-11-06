const fs = require('fs');

if (fs.existsSync('local_db/crm_leads.json')) {
  try {
    const crm = JSON.parse(fs.readFileSync('local_db/crm_leads.json', 'utf8'));
    console.log('CRM Leads count:', crm.length);
    console.log('Recent 10 entries:\n', JSON.stringify(crm.slice(0, 10), null, 2));
  } catch (e) {
    console.error('Error reading crm_leads.json:', e.message);
  }
} else {
  console.log('crm_leads.json does not exist');
}
