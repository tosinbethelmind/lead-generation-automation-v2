/**
 * @file scripts/check_unsent_email_pool.ts
 */

import fs from 'fs';
import path from 'path';

const LEADS_DB_PATH = path.join(process.cwd(), 'local_db', 'leads_db.json');
const CRM_LEADS_PATH = path.join(process.cwd(), 'local_db', 'crm_leads.json');

const leads = fs.existsSync(LEADS_DB_PATH) ? JSON.parse(fs.readFileSync(LEADS_DB_PATH, 'utf8')) : [];
const crm = fs.existsSync(CRM_LEADS_PATH) ? JSON.parse(fs.readFileSync(CRM_LEADS_PATH, 'utf8')) : [];

const map = new Map();
leads.concat(crm).forEach((l: any) => {
  const email = (l.email || '').trim().toLowerCase();
  if (email && email.includes('@') && !email.includes('example.com') && !email.includes('test.com')) {
    map.set(email, l);
  }
});

const unsent = Array.from(map.values()).filter((l: any) => !l.email_sent);

console.log('Total leads with valid email:', map.size);
console.log('Unsent leads ready to be dispatched:', unsent.length);
console.log('Already sent:', map.size - unsent.length);
