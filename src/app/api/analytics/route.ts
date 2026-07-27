import { NextRequest, NextResponse } from 'next/server';
import { generateRevenueAttributionReport } from '@/lib/revenueAttribution';
import { calculateAdvancedLeadScore } from '@/lib/advancedLeadScoring';

export const dynamic = 'force-dynamic';

/** GET /api/analytics — Fetch revenue attribution report */
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const opex = parseInt(url.searchParams.get('opex') || '75000', 10);

    const report = await generateRevenueAttributionReport(opex);
    return NextResponse.json({ success: true, report });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

/** POST /api/analytics — Score a lead with 50+ signals */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { lead, activityCount } = body;

    if (!lead) {
      return NextResponse.json({ success: false, error: 'lead object is required' }, { status: 400 });
    }

    const scoreResult = calculateAdvancedLeadScore(lead, activityCount || 0);
    return NextResponse.json({ success: true, scoreResult });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
