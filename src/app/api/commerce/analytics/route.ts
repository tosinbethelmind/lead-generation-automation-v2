import { NextRequest, NextResponse } from 'next/server';
import { resolveAdminRequest } from '@/lib/commerce/adminAuth';
import {
  recordAnalyticsEvent,
  getSalesDashboardMetrics,
  upsertAdSpend,
} from '@/lib/commerce/salesAnalytics';
import type { BusinessDivisionKey } from '@/lib/commerce/googleTracking';

export async function GET(req: NextRequest) {
  const admin = await resolveAdminRequest(req);
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const businessDivision = (req.nextUrl.searchParams.get('businessDivision') || 'all') as
    | BusinessDivisionKey
    | 'all';
  const utmCampaign = req.nextUrl.searchParams.get('utmCampaign') || 'all';

  const metrics = await getSalesDashboardMetrics({ businessDivision, utmCampaign });
  return NextResponse.json({ success: true, metrics });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));

  if (body.action === 'set_ad_spend') {
    const admin = await resolveAdminRequest(req);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const { businessDivision, utmCampaign, spendNgn } = body;
    if (!businessDivision || typeof spendNgn !== 'number' || spendNgn < 0) {
      return NextResponse.json({ success: false, error: 'Valid businessDivision and spendNgn required' }, { status: 400 });
    }
    const record = upsertAdSpend({ businessDivision, utmCampaign: utmCampaign || 'untagged', spendNgn });
    return NextResponse.json({ success: true, record });
  }

  // Public telemetry beacon (real events only)
  const { eventName, businessDivision, utmSource, utmCampaign, abVariant, valueNgn } = body;
  if (!eventName || !businessDivision) {
    return NextResponse.json({ success: false, error: 'Invalid telemetry payload' }, { status: 400 });
  }

  recordAnalyticsEvent({
    eventName: String(eventName),
    businessDivision,
    utmSource: String(utmSource || 'direct'),
    utmCampaign: String(utmCampaign || 'untagged'),
    abVariant: String(abVariant || 'control'),
    valueNgn: Number(valueNgn || 0),
  });

  return NextResponse.json({ success: true });
}
