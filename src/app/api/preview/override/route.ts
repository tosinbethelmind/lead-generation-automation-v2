import { NextRequest, NextResponse } from 'next/server';
import { getActiveLeadRepository } from '@/lib/googleSheets';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const leadId = searchParams.get('leadId');

    if (!leadId) {
      return NextResponse.json({ error: 'leadId is required' }, { status: 400 });
    }

    const repo = getActiveLeadRepository();
    const lead = await repo.getLeadById(leadId);

    if (lead && lead.overrides) {
      // Ensure it is returned as parsed object
      const overrides = typeof lead.overrides === 'string' ? JSON.parse(lead.overrides) : lead.overrides;
      return NextResponse.json(overrides);
    }

    return NextResponse.json({});
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { leadId, overrides } = body;

    if (!leadId) {
      return NextResponse.json({ error: 'leadId is required' }, { status: 400 });
    }

    const repo = getActiveLeadRepository();
    const success = await repo.updateLeadFields(leadId, { overrides });

    return NextResponse.json({ success });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
