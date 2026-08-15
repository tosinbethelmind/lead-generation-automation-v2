import { NextRequest, NextResponse } from 'next/server';
import { trackLeadJourneyEvent, JourneyStage } from '@/lib/leadJourneyTracker';
import { runRetargetingDecisionAudit } from '@/lib/retargetingDecisionEngine';

export const dynamic = 'force-dynamic';

/**
 * POST /api/tracking/journey-event
 * Ingests client-side behavioral interactions in real-time.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      leadId,
      leadName,
      category,
      phone,
      email,
      area,
      eventType,
      metadata = {},
    } = body;

    if (!leadId) {
      return NextResponse.json({ error: 'leadId is required.' }, { status: 400 });
    }

    let stage: JourneyStage = 'PREVIEW_VIEWED';
    let title = 'Visited Preview Page';
    let description = 'Prospect opened their personalized website preview.';

    switch (eventType) {
      case 'page_view':
        stage = 'PREVIEW_VIEWED';
        title = 'Opened Website Preview';
        description = `Visited path: ${metadata.path || '/'}`;
        break;

      case 'calculator_used':
        stage = 'CALCULATOR_USED';
        title = 'Interacted with Interactive Calculator';
        description = metadata.calculationSummary || 'Adjusted capacity / cost sizing calculator';
        break;

      case 'video_watched':
        stage = 'VIDEO_WATCHED';
        title = 'Watched Video Walkthrough';
        description = `Watched ${metadata.durationSec || 30}s of interactive walkthrough video`;
        break;

      case 'chat_opened':
        stage = 'CHAT_OPENED';
        title = 'Opened Simulated WhatsApp Chat';
        description = 'Interacted with the 24/7 AI chat agent simulator';
        break;

      case 'checkout_clicked':
        stage = 'CHECKOUT_CLICKED';
        title = 'Initiated Checkout / Claim Action';
        description = `Clicked ${metadata.planName || 'Claim Site'} (${metadata.gateway || 'OPay/Paystack'})`;
        break;

      case 'rage_click':
        stage = 'PREVIEW_VIEWED';
        title = 'High-Speed Click Cluster';
        description = `Rapidly clicked element: ${metadata.targetElement || 'UI'}`;
        break;

      default:
        stage = 'PREVIEW_VIEWED';
        title = `Action: ${eventType}`;
        description = JSON.stringify(metadata);
        break;
    }

    const event = await trackLeadJourneyEvent({
      leadId,
      leadName: leadName || `Lead ${leadId}`,
      category: category || 'General',
      phone: phone || '',
      email: email || '',
      area: area || 'Lagos',
      stage,
      title,
      description,
      channelUsed: 'Client Interactive Portal',
      metadata
    });

    // Run async retargeting audit check in the background
    runRetargetingDecisionAudit().catch((err) => console.warn('[JourneyAPI] Audit error:', err.message));

    return NextResponse.json({ success: true, event });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
