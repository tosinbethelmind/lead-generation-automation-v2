import fs from 'fs';
import path from 'path';
import { isGenuineCommercialIdentity } from '../src/lib/monetization/genuineLeadProvider';

function cleanJourneysDatabase() {
  const journeysPath = path.join(process.cwd(), 'local_db', 'lead_journeys.json');
  if (!fs.existsSync(journeysPath)) {
    console.log('No lead_journeys.json found.');
    return;
  }

  const journeys: Record<string, any> = JSON.parse(fs.readFileSync(journeysPath, 'utf8'));
  const initialCount = Object.keys(journeys).length;

  const cleanJourneys: Record<string, any> = {};
  for (const [leadId, j] of Object.entries(journeys)) {
    const rawName = j.leadName || j.name || '';
    if (isGenuineCommercialIdentity({ name: rawName, lead_id: leadId })) {
      cleanJourneys[leadId] = j;
    }
  }

  fs.writeFileSync(journeysPath, JSON.stringify(cleanJourneys, null, 2));

  const stages: Record<string, number> = {};
  Object.values(cleanJourneys).forEach(j => {
    const st = j.currentStage || 'OUTREACH_DISPATCHED';
    stages[st] = (stages[st] || 0) + 1;
  });

  console.log('====================================================');
  console.log('🗺️ CUSTOMER JOURNEYS SANITATION & TRACKING SUMMARY');
  console.log('====================================================');
  console.log(`• Initial Journeys Tracked: ${initialCount}`);
  console.log(`• Junk / Concatenated Titles Purged: ${initialCount - Object.keys(cleanJourneys).length}`);
  console.log(`• 100% Genuine Commercial Journeys Kept: ${Object.keys(cleanJourneys).length}`);
  console.log(`• Current Stage Breakdown:`, JSON.stringify(stages));
  console.log('====================================================');
}

cleanJourneysDatabase();
