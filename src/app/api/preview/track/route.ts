/**
 * @file src/app/api/preview/track/route.ts
 * 
 * 📡 PROSPECT PREVIEW CLICK TRACKING BEACON API
 * Handles 0-latency tracking for Dub.co click attribution
 */

import { NextRequest, NextResponse } from 'next/server';
import { recordLeadClick } from '@/lib/tracking/dubAttributionEngine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userAgent = req.headers.get('user-agent') || 'Unknown';
    const forwardedFor = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'Unknown';
    const referer = req.headers.get('referer') || 'Direct';

    const result = await recordLeadClick({
      leadId: body.leadId || 'unknown',
      businessName: body.businessName,
      category: body.category,
      area: body.area,
      phone: body.phone,
      userAgent,
      ip: forwardedFor.split(',')[0].trim(),
      referrer: referer
    });

    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
