import fs from 'fs';
import path from 'path';
import { isGenuineCommercialIdentity, isValidNigerianCommercialPhone } from '../src/lib/monetization/genuineLeadProvider';

function cleanLeadsDatabase() {
  const dbPath = path.join(process.cwd(), 'local_db', 'leads_db.json');
  if (!fs.existsSync(dbPath)) {
    console.log('No leads_db.json found.');
    return;
  }

  const leads: any[] = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  const initialCount = leads.length;

  const cleanLeads = leads.filter(l => {
    const phone = l.phone_e164 || l.phone_raw || '';
    return isGenuineCommercialIdentity(l) && isValidNigerianCommercialPhone(phone);
  });

  fs.writeFileSync(dbPath, JSON.stringify(cleanLeads, null, 2));

  const totalDispatched = cleanLeads.filter(l => l.social_dm_dispatched).length;
  const totalEmailSent = cleanLeads.filter(l => l.email_sent || l.outreach_dispatched).length;

  console.log('====================================================');
  console.log('🧹 DATABASE SANITATION & ZERO-SYNTHETIC SCRUB SUMMARY');
  console.log('====================================================');
  console.log(`• Initial Leads Scraped in DB: ${initialCount}`);
  console.log(`• Junk / Foreign UI Strings Purged: ${initialCount - cleanLeads.length}`);
  console.log(`• 100% Genuine Verified Commercial Leads Kept: ${cleanLeads.length}`);
  console.log(`• Genuine Social/Jiji DMs Dispatched: ${totalDispatched}`);
  console.log(`• Genuine Executive B2B Emails Sent: ${totalEmailSent}`);
  console.log('====================================================');
}

cleanLeadsDatabase();
