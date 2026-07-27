import { NextRequest, NextResponse } from 'next/server';
import { getDeal, updateDeal, moveDealToStage, deleteDeal } from '@/lib/pipelineManager';

export const dynamic = 'force-dynamic';

/** GET /api/pipeline/[id] — Fetch single deal */
export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await props.params;
    const deal = await getDeal(id);
    if (!deal) {
      return NextResponse.json({ success: false, error: 'Deal not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, deal });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

/** PATCH /api/pipeline/[id] — Update deal fields or move stage */
export async function PATCH(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await props.params;
    const body = await req.json();

    if (body.stage_id) {
      const deal = await moveDealToStage(id, body.stage_id, body.notes || body.lost_reason);
      return NextResponse.json({ success: true, deal });
    }

    const deal = await updateDeal(id, body);
    return NextResponse.json({ success: true, deal });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

/** DELETE /api/pipeline/[id] — Delete deal */
export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await props.params;
    await deleteDeal(id);
    return NextResponse.json({ success: true, message: 'Deal deleted successfully' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
