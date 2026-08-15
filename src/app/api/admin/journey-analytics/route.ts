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

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/journey-analytics
 * Returns real-time journey statistics, funnel analytics, hot leads, and retargeting decisions.
 */
export async function GET(req: NextRequest) {
  try {
    const allJourneys = Object.values(getAllLocalLeadJourneys());
    const funnelStats = getJourneyFunnelMetrics();
    const recentJourneys = getRecentLeadJourneys(30);

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
 * Handles manual triggers: audit, execute decision, dismiss decision.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, decisionId } = body;

    if (action === 'run_audit') {
      const newDecisions = await runRetargetingDecisionAudit();
      return NextResponse.json({
        success: true,
        message: `Decision engine completed audit. Generated ${newDecisions.length} new retargeting recommendations.`,
        newDecisions
      });
    }

    if (action === 'execute_decision') {
      if (!decisionId) return NextResponse.json({ error: 'decisionId is required' }, { status: 400 });
      const result = await executeRetargetingDecision(decisionId);
      return NextResponse.json(result);
    }

    if (action === 'dismiss_decision') {
      if (!decisionId) return NextResponse.json({ error: 'decisionId is required' }, { status: 400 });
      const dismissed = dismissRetargetingDecision(decisionId);
      return NextResponse.json({ success: dismissed });
    }

    return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
