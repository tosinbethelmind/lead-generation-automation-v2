import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

import { getUnifiedTelemetryReport } from '../src/lib/unifiedReportingEngine';
import { getJourneyFunnelMetrics, getAllLocalLeadJourneys } from '../src/lib/leadJourneyTracker';
import { getAllRetargetingDecisions } from '../src/lib/retargetingDecisionEngine';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

async function runFullAudit() {
  console.log('=== UNIFIED TELEMETRY & LEAD METRICS AUDIT ===');
  
  const todayStr = '2026-08-26';
  
  // 1. SUPABASE LEADS STATS
  const { count: totalLeads } = await supabase.from('leads').select('*', { count: 'exact', head: true });
  
  const { count: scrapedToday } = await supabase.from('leads')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', `${todayStr}T00:00:00.000Z`);

  // 2. OUTREACH LOGS TODAY & ALL TIME
  const { data: outreachLogsToday } = await supabase.from('outreach_logs')
    .select('*')
    .gte('created_at', `${todayStr}T00:00:00.000Z`);

  const { data: allOutreachLogs } = await supabase.from('outreach_logs')
    .select('*');

  // 3. UNIFIED TELEMETRY REPORT
  let unifiedReport: any = null;
  try {
    unifiedReport = getUnifiedTelemetryReport();
  } catch (e: any) {
    console.error('Unified report error:', e.message);
  }

  // 4. JOURNEY FUNNEL METRICS
  let funnelMetrics: any = null;
  let allJourneys: Record<string, any> = {};
  try {
    funnelMetrics = getJourneyFunnelMetrics();
    allJourneys = getAllLocalLeadJourneys();
  } catch (e: any) {
    console.error('Journey metrics error:', e.message);
  }

  // 5. RETARGETING DECISIONS
  let retargetingDecisions: any[] = [];
  try {
    const decMap = getAllRetargetingDecisions();
    retargetingDecisions = Object.values(decMap);
  } catch (e: any) {}

  console.log('\n--- SUPABASE LEADS STATS ---');
  console.log('Total Scraped Leads in DB:', totalLeads);
  console.log('Leads Scraped Today (2026-08-26):', scrapedToday);
  console.log('Outreach Logs Today Count:', outreachLogsToday?.length || 0);
  console.log('Total Outreach Logs All-Time:', allOutreachLogs?.length || 0);

  if (outreachLogsToday && outreachLogsToday.length > 0) {
    const channelMap: Record<string, number> = {};
    outreachLogsToday.forEach(l => {
      const ch = l.channel || l.type || 'unknown';
      channelMap[ch] = (channelMap[ch] || 0) + 1;
    });
    console.log('Today Channel Breakdown (Supabase):', channelMap);
  }

  if (allOutreachLogs && allOutreachLogs.length > 0) {
    const allChannelMap: Record<string, number> = {};
    allOutreachLogs.forEach(l => {
      const ch = l.channel || l.type || 'unknown';
      allChannelMap[ch] = (allChannelMap[ch] || 0) + 1;
    });
    console.log('All-Time Channel Breakdown (Supabase):', allChannelMap);
  }

  console.log('\n--- TELEMETRY ENGINE REPORT ---');
  console.log(JSON.stringify(unifiedReport, null, 2));

  console.log('\n--- FUNNEL METRICS ---');
  console.log(JSON.stringify(funnelMetrics, null, 2));

  const journeyList = Object.values(allJourneys);
  console.log('\n--- CUSTOMER JOURNEY TRACKER ---');
  console.log('Total Tracked Journeys:', journeyList.length);
  if (journeyList.length > 0) {
    const stages: Record<string, number> = {};
    const intentLevels: Record<string, number> = {};
    journeyList.forEach((j: any) => {
      stages[j.currentStage || 'UNKNOWN'] = (stages[j.currentStage || 'UNKNOWN'] || 0) + 1;
      intentLevels[j.intentLevel || 'UNKNOWN'] = (intentLevels[j.intentLevel || 'UNKNOWN'] || 0) + 1;
    });
    console.log('Stages Breakdown:', stages);
    console.log('Intent Levels Breakdown:', intentLevels);
  }

  console.log('\n--- RETARGETING DECISIONS ---');
  console.log('Pending Decisions:', retargetingDecisions.filter((d: any) => d.status === 'PENDING').length);
  console.log('Dispatched Decisions:', retargetingDecisions.filter((d: any) => d.status === 'DISPATCHED').length);
}

runFullAudit().catch(err => {
  console.error('Fatal error in script:', err);
});
