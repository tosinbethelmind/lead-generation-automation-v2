import { NextRequest, NextResponse } from 'next/server';
import { logActivity, getLeadActivities, getDealActivities, getRecentActivities, getActivityStats } from '@/lib/activityLogger';

export const dynamic = 'force-dynamic';

/** GET /api/activities — Fetch activity timeline (by lead, by deal, or recent feed) */
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const lead_id = url.searchParams.get('lead_id');
    const deal_id = url.searchParams.get('deal_id');
    const action = url.searchParams.get('action');
    const limit = parseInt(url.searchParams.get('limit') || '100', 10);

    if (action === 'stats') {
      const stats = await getActivityStats();
      return NextResponse.json({ success: true, stats });
    }

    if (lead_id) {
      const activities = await getLeadActivities(lead_id, limit);
      return NextResponse.json({ success: true, activities });
    }

    if (deal_id) {
      const activities = await getDealActivities(deal_id, limit);
      return NextResponse.json({ success: true, activities });
    }

    const activities = await getRecentActivities(limit);
    return NextResponse.json({ success: true, activities });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

/** POST /api/activities — Log manual activity or note */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.type || !body.description) {
      return NextResponse.json({ success: false, error: 'type and description are required' }, { status: 400 });
    }

    const activity = await logActivity({
      type: body.type,
      lead_id: body.lead_id,
      deal_id: body.deal_id,
      description: body.description,
      metadata: body.metadata,
      channel: body.channel,
      actor: body.actor || 'user',
    });

    return NextResponse.json({ success: true, activity });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
