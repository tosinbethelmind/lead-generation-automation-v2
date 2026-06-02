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
