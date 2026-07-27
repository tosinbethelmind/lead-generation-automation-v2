import { NextRequest, NextResponse } from 'next/server';
import {
  createDeal,
  getDeals,
  getStagesForSector,
  getAllSectorOptions,
  getPipelineStats,
  convertLeadToDeal,
} from '@/lib/pipelineManager';

export const dynamic = 'force-dynamic';

/** GET /api/pipeline — List deals, stages, sectors, stats */
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const action = url.searchParams.get('action') || 'deals';
    const sector = url.searchParams.get('sector') || undefined;
    const stage_id = url.searchParams.get('stage_id') || undefined;
    const search = url.searchParams.get('search') || undefined;

    if (action === 'stages') {
      const stages = getStagesForSector(sector || 'general');
      return NextResponse.json({ success: true, stages });
    }

    if (action === 'sectors') {
      const sectors = getAllSectorOptions();
      return NextResponse.json({ success: true, sectors });
    }

    if (action === 'stats') {
      const stats = await getPipelineStats(sector);
      return NextResponse.json({ success: true, stats });
    }

    // Default: get deals
    const deals = await getDeals({ sector, stage_id, search });
    const stages = getStagesForSector(sector || 'general');
    return NextResponse.json({ success: true, deals, stages });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

/** POST /api/pipeline — Create deal or convert lead */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = body.action || 'create';

    if (action === 'convert_lead') {
      const { lead, estimatedValue } = body;
      if (!lead || !lead.lead_id || !lead.name) {
        return NextResponse.json({ success: false, error: 'Missing lead data (lead_id, name required)' }, { status: 400 });
      }
      const deal = await convertLeadToDeal(lead, estimatedValue);
      return NextResponse.json({ success: true, deal });
    }

    // Default: create deal
    if (!body.title) {
      return NextResponse.json({ success: false, error: 'title is required' }, { status: 400 });
    }

    const deal = await createDeal({
      lead_id: body.lead_id,
      title: body.title,
      stage_id: body.stage_id,
      sector: body.sector,
      value: body.value,
      currency: body.currency,
      contact_name: body.contact_name,
      contact_phone: body.contact_phone,
      contact_email: body.contact_email,
      category: body.category,
      area: body.area,
      city: body.city,
      assigned_to: body.assigned_to,
      notes: body.notes,
      probability: body.probability,
      expected_close_date: body.expected_close_date,
      tags: body.tags,
      custom_fields: body.custom_fields,
    });

    return NextResponse.json({ success: true, deal });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
