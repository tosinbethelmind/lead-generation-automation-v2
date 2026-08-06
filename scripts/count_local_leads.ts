import fs from 'fs';
import path from 'path';

function countLocalLeads() {
  const filePath = path.join(process.cwd(), 'local_db', 'leads_db.json');
  if (!fs.existsSync(filePath)) {
    console.log(JSON.stringify({ exists: false, total: 0 }));
    return;
  }

  const raw = fs.readFileSync(filePath, 'utf8');
  try {
    const data = JSON.parse(raw);
    const leads = Array.isArray(data) ? data : (data.leads ? data.leads : Object.values(data));
    let withEmail = 0;
    let withPhone = 0;
    let solarCount = 0;
    let regularCount = 0;

    for (const lead of leads as any[]) {
      if (lead.email || lead.clientEmail) withEmail++;
      if (lead.phone || lead.phone_e164 || lead.clientPhone) withPhone++;
      const str = JSON.stringify(lead).toLowerCase();
      if (str.includes('solar') || str.includes('inverter')) {
        solarCount++;
      } else {
        regularCount++;
      }
    }
    console.log(JSON.stringify({
      exists: true,
      total: leads.length,
      withEmail,
      withPhone,
      solarCount,
      regularCount
    }, null, 2));
  } catch (e: any) {
    console.log(JSON.stringify({ exists: true, error: e.message }));
  }
}

countLocalLeads();
