import { NextRequest, NextResponse } from 'next/server';
import {
  getRecentLeadJourneys,
  getJourneyFunnelMetrics,
  getAllLocalLeadJourneys
} from '@/lib/leadJourneyTracker';
import {
  getAllRetargetingDecisions,
  runRetargetingDecisionAudit,
  executeRetargetingDecision,
  dismissRetargetingDecision
} from '@/lib/retargetingDecisionEngine';
import { getUnifiedTelemetryReport } from '@/lib/unifiedReportingEngine';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/journey-analytics
 * Returns real-time journey statistics, funnel analytics, hot leads, unified channel dispatches, and retargeting decisions.
 */
export async function GET(req: NextRequest) {
  try {
    const allJourneys = Object.values(getAllLocalLeadJourneys());
    const funnelStats = getJourneyFunnelMetrics();
    const recentJourneys = getRecentLeadJourneys(30);

    // Unified Standard Telemetry Report (SMS, DMs, Email, Website Actions)
    const unifiedReport = getUnifiedTelemetryReport();

    // Sort hot leads by Heat Score descending
    const hotLeads = [...allJourneys]
      .filter(j => (j.heatScore || 0) >= 30)
      .sort((a, b) => (b.heatScore || 0) - (a.heatScore || 0))
      .slice(0, 25);

    // Get retargeting decisions
    const decisionsMap = getAllRetargetingDecisions();
    const retargetingDecisions = Object.values(decisionsMap).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Flatten recent events for the Live Stream Ticker
    const liveFeed = recentJourneys
      .flatMap(j => (j.events || []).map(e => ({
        ...e,
        leadName: j.leadName,
        category: j.category,
        heatScore: j.heatScore,
        intentLevel: j.intentLevel,
        area: j.area || 'Lagos'
      })))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 40);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      unifiedReport,
      funnelStats,
      hotLeads,
      retargetingDecisions,
      liveFeed
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * POST /api/admin/journey-analytics
 * Actions: 'audit', 'execute-retarget', 'dismiss-retarget'
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, leadId, decisionId } = body;

    if (action === 'audit') {
      const newDecisions = await runRetargetingDecisionAudit();
      return NextResponse.json({ success: true, newDecisionsCount: newDecisions.length });
    }

    if (action === 'execute-retarget' && decisionId) {
      const result = await executeRetargetingDecision(decisionId);
      return NextResponse.json({ success: true, result });
    }

    if (action === 'dismiss-retarget' && decisionId) {
      const dismissed = dismissRetargetingDecision(decisionId);
      return NextResponse.json({ success: true, dismissed });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
