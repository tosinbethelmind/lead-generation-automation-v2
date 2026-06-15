import { NextRequest, NextResponse } from 'next/server';
import { getLeads, saveLeads, getSyncStats } from '@/lib/googleSheets';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const statsOnly = searchParams.get('stats') === 'true';
    
    if (statsOnly) {
      const stats = await getSyncStats();
      return NextResponse.json(stats);
    }
    
    const leads = await getLeads();
    return NextResponse.json(leads);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const leadsToSave = Array.isArray(body) ? body : [body];
    
    const result = await saveLeads(leadsToSave);
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

import { updateLeadStatus } from '@/lib/googleSheets';

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { lead_id, status, notes, last_contacted_at } = body;
    
    if (!lead_id) {
      return NextResponse.json({ error: 'lead_id is required' }, { status: 400 });
    }
    
    const success = await updateLeadStatus(lead_id, status, notes, last_contacted_at);
    return NextResponse.json({ success });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

