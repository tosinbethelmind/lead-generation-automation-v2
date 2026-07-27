import { NextRequest, NextResponse } from 'next/server';
import {
  createCampaign,
  createCampaignFromTemplate,
  getCampaigns,
  CAMPAIGN_TEMPLATES,
  enrollLeadInCampaign,
  getDueCampaignSteps,
} from '@/lib/dripCampaignEngine';

export const dynamic = 'force-dynamic';

/** GET /api/campaigns — List campaigns or templates */
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const action = url.searchParams.get('action');
    const sector = url.searchParams.get('sector') || undefined;
    const status = (url.searchParams.get('status') as any) || undefined;

    if (action === 'templates') {
      return NextResponse.json({ success: true, templates: CAMPAIGN_TEMPLATES });
    }

    if (action === 'due_steps') {
      const dueSteps = await getDueCampaignSteps();
      return NextResponse.json({ success: true, dueSteps });
    }

    const campaigns = await getCampaigns({ sector, status });
    return NextResponse.json({ success: true, campaigns });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

/** POST /api/campaigns — Create campaign or enroll lead */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = body.action || 'create';

    if (action === 'create_from_template') {
      if (!body.templateKey) {
        return NextResponse.json({ success: false, error: 'templateKey is required' }, { status: 400 });
      }
      const campaign = await createCampaignFromTemplate(body.templateKey, body.overrides);
      return NextResponse.json({ success: true, campaign });
    }

    if (action === 'enroll') {
      if (!body.campaignId || !body.lead || !body.lead.lead_id) {
        return NextResponse.json({ success: false, error: 'campaignId and lead (with lead_id) are required' }, { status: 400 });
      }
      const enrollment = await enrollLeadInCampaign(body.campaignId, body.lead);
      return NextResponse.json({ success: true, enrollment });
    }

    // Default: create campaign
    if (!body.name || !body.steps) {
      return NextResponse.json({ success: false, error: 'name and steps array are required' }, { status: 400 });
    }

    const campaign = await createCampaign({
      name: body.name,
      description: body.description,
      sector: body.sector,
      steps: body.steps,
      tags: body.tags,
    });

    return NextResponse.json({ success: true, campaign });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
