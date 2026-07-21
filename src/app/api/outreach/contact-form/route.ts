import { NextRequest, NextResponse } from 'next/server';
import { getLeads } from '@/lib/googleSheets';
import { submitContactForm } from '@/lib/contactFormSubmitter';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { leadIds, signature } = body;
    if (!leadIds || !Array.isArray(leadIds)) {
      return NextResponse.json({ error: 'leadIds array is required' }, { status: 400 });
    }

    const origin = new URL(req.url).origin;
    const leads = await getLeads();
    const targetLeads = leads.filter(l => leadIds.includes(l.lead_id));

    if (targetLeads.length === 0) {
      return NextResponse.json({ success: true, processed: 0, results: [] });
    }

    const results = [];
    for (const lead of targetLeads) {
      const res = await submitContactForm(lead, origin, signature || '');
      results.push({
        leadId: lead.lead_id,
        name: lead.name,
        success: res.success,
        notes: res.notes,
        method: res.methodUsed
      });
    }

    return NextResponse.json({
      success: true,
      processed: results.length,
      results
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
