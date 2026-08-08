import { NextRequest, NextResponse } from 'next/server';
import { getActiveLeadRepository, getDNCList, addLog } from '@/lib/googleSheets';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { leadId, userAgent, eventType = 'page_view', details = {} } = body;

    if (!leadId) {
      return NextResponse.json({ error: 'Missing leadId' }, { status: 400 });
    }

    let isOptedOut = false;
    try {
      const dncList = await getDNCList();
      const repo = getActiveLeadRepository();
      const lead = (await repo.getLeadById(leadId)) as any;
      
      if (lead) {
        const leadPhone = (lead.phone_e164 || lead.phone_raw || '').replace(/\D/g, '');
        if (dncList.some((entry: any) => entry.phone && entry.phone.replace(/\D/g, '').includes(leadPhone))) {
          isOptedOut = true;
          console.log(`[DripTrigger] Lead ${leadId} is opted-out (DNC). Skipping retargeting queue.`);
        }
      }
    } catch (_) {
      // Fallback
    }

    if (isOptedOut) {
      return NextResponse.json({
        success: false,
        reason: 'Lead is opted out of marketing communications.',
        dripScheduled: false
      });
    }

    let sequence: any[] = [];
    if (eventType === 'account_copied' || eventType === 'modal_opened') {
      sequence = [
        { offset: '15m', channel: 'whatsapp', type: 'payment_assistance_nudge', message: 'Hi {{lead.name}}, did your bank transfer complete? Reply YES or upload receipt.' },
        { offset: '4h', channel: 'whatsapp', type: 'opay_transfer_reminder', message: 'Hi {{lead.name}}, your reserved ₦50,000 reservation is held for OPay transfer.' },
        { offset: '24h', channel: 'sms', type: 'final_reservation_expiry', message: 'Final Alert: Your website reservation for {{lead.company}} expires today.' }
      ];
    } else if (eventType === 'form_filled') {
      sequence = [
        { offset: '10m', channel: 'whatsapp', type: 'quote_followup', message: 'Hi {{lead.name}}, we received your quote calculation! Would you like to proceed with OPay transfer?' },
        { offset: '12h', channel: 'whatsapp', type: 'demo_video_case_study', message: 'See how automation grew Lagos businesses by 3x.' }
      ];
    } else {
      // Default page_view abandonment
      sequence = [
        { offset: '10m', channel: 'whatsapp', type: 'cac_trust_badge_reminder' },
        { offset: '4h', channel: 'whatsapp', type: 'competitor_video_demo' },
        { offset: '24h', channel: 'sms', type: 'domain_reservation_alert' }
      ];
    }

    await addLog(
      'Abandonment Retargeting',
      'EVENT_LOGGED',
      `Lead ${leadId} triggered ${eventType} abandonment event. Scheduled ${sequence.length} retargeting nudges.`
    );

    return NextResponse.json({
      success: true,
      leadId,
      eventType,
      dripScheduled: true,
      scheduledSequence: sequence,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
