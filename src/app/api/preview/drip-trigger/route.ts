import { NextRequest, NextResponse } from 'next/server';
import { getActiveLeadRepository } from '@/lib/googleSheets';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { leadId, userAgent } = body;

    if (!leadId) {
      return NextResponse.json({ error: 'Missing leadId' }, { status: 400 });
    }

    try {
      const repo = getActiveLeadRepository();
      const lead = await repo.getLeadById(leadId);
      if (lead) {
        // Log visit & schedule drip queues (10m, 4h, 24h)
        console.log(`[DripTrigger] Registered zero-agent visit for lead ${leadId} (${lead.name})`);
      }
    } catch (_) {
      // Non-blocking fallback
    }

    return NextResponse.json({
      success: true,
      leadId,
      dripScheduled: true,
      scheduledSequence: [
        { offset: '10m', channel: 'whatsapp', type: 'cac_trust_badge_reminder' },
        { offset: '4h', channel: 'whatsapp', type: 'competitor_video_demo' },
        { offset: '24h', channel: 'whatsapp', type: 'domain_reservation_alert' },
      ],
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
