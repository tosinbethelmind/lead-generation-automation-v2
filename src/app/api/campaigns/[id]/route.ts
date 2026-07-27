import { NextRequest, NextResponse } from 'next/server';
import { getCampaign, updateCampaign, deleteCampaign, recordStepExecution } from '@/lib/dripCampaignEngine';

export const dynamic = 'force-dynamic';

/** GET /api/campaigns/[id] — Fetch single campaign */
export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await props.params;
    const campaign = await getCampaign(id);
    if (!campaign) {
      return NextResponse.json({ success: false, error: 'Campaign not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, campaign });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

/** PATCH /api/campaigns/[id] — Update campaign status or record step result */
export async function PATCH(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await props.params;
    const body = await req.json();

    if (body.action === 'record_step') {
      const { leadId, stepResult } = body;
      await recordStepExecution(id, leadId, stepResult);
      return NextResponse.json({ success: true });
    }

    const campaign = await updateCampaign(id, body);
    return NextResponse.json({ success: true, campaign });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

/** DELETE /api/campaigns/[id] — Delete campaign */
export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await props.params;
    await deleteCampaign(id);
    return NextResponse.json({ success: true, message: 'Campaign deleted successfully' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
