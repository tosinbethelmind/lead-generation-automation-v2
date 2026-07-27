import fs from 'fs';
import path from 'path';

function countLocalLeads() {
  const filePath = path.join(process.cwd(), 'local_db', 'leads.json');
  if (!fs.existsSync(filePath)) {
    console.log(JSON.stringify({ exists: false, total: 0 }));
    return;
  }

  const raw = fs.readFileSync(filePath, 'utf8');
  try {
    const data = JSON.parse(raw);
    const leads = Array.isArray(data) ? data : Object.values(data);
    const counts: Record<string, number> = {};
    for (const lead of leads as any[]) {
      const src = ((lead && lead.source) || 'UNKNOWN').toUpperCase();
      counts[src] = (counts[src] || 0) + 1;
    }
    console.log(JSON.stringify({ exists: true, total: leads.length, counts }, null, 2));
  } catch (e: any) {
    console.log(JSON.stringify({ exists: true, error: e.message }));
  }
}

countLocalLeads();
