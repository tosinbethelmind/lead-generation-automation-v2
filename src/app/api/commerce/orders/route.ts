import { NextRequest, NextResponse } from 'next/server';
import { resolveAdminRequest } from '@/lib/commerce/adminAuth';
import { getLedgerSummary, getOrderByReference } from '@/lib/commerce/ledger';
import { approveManualTransferOrder } from '@/lib/commerce/paymentOrchestrator';

export async function GET(req: NextRequest) {
  const admin = await resolveAdminRequest(req);

  if (!admin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const ref = req.nextUrl.searchParams.get('ref');
  if (ref) {
    const order = await getOrderByReference(ref);
    if (!order) return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    return NextResponse.json({ success: true, order });
  }

  return NextResponse.json({ success: true, summary: getLedgerSummary() });
}

export async function POST(req: NextRequest) {
  try {
    const admin = await resolveAdminRequest(req);

    if (!admin || (!admin.permissions.includes('*') && !admin.permissions.includes('edit_settings'))) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Admin approval required' }, { status: 401 });
    }

    const body = await req.json();
    const { action, orderReference, verifiedAmountNgn, adminNote } = body;

    if (action === 'approve_manual_transfer') {
      if (!orderReference || typeof verifiedAmountNgn !== 'number') {
        return NextResponse.json(
          { success: false, error: 'orderReference and numeric verifiedAmountNgn are required' },
          { status: 400 }
        );
      }
      const result = await approveManualTransferOrder(orderReference, verifiedAmountNgn, adminNote);
      return NextResponse.json({ success: true, ...result });
    }

    return NextResponse.json({ success: false, error: 'Unsupported action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Order action failed' }, { status: 400 });
  }
}
