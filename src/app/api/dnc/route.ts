export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getDNCList, addDNCEntry, getActiveLeadRepository, addLog } from '@/lib/googleSheets';

export async function GET() {
  try {
    const list = await getDNCList();
    return NextResponse.json(list);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let { phone, leadId } = body;

    if (!phone && leadId) {
      try {
        const repo = getActiveLeadRepository();
        const lead = (await repo.getLeadById(leadId)) as any;
        if (lead) {
          phone = lead.phone_e164 || lead.phone_raw || lead.phone;
        }
      } catch (_) {}
    }

    if (!phone) {
      return NextResponse.json({ error: "Missing phone number or valid leadId" }, { status: 400 });
    }

    const result = await addDNCEntry(phone);

    await addLog(
      'DNC Opt Out',
      'OPT_OUT',
      `Lead/Phone ${phone} (Lead ID: ${leadId || 'N/A'}) requested opt-out. Added to DNC list and cancelled retargeting.`
    );

    return NextResponse.json({
      success: true,
      message: 'You have been successfully unsubscribed. You will receive no further messages.',
      result
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
