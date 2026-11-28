import { NextRequest, NextResponse } from 'next/server';
import { resolveAdminRequest } from '@/lib/commerce/adminAuth';
import {
  buildPaymentReminderMessage,
  convertQuotationToOrder,
  createQuotation,
  listQuotations,
} from '@/lib/commerce/quotations';
import { getLedgerSummary, type OrderRecord } from '@/lib/commerce/ledger';

export async function GET(request: NextRequest) {
  const admin = await resolveAdminRequest(request);
  if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const tenantId = request.nextUrl.searchParams.get('tenantId') || undefined;
  const quotes = listQuotations(tenantId);
  const ledger = getLedgerSummary();

  const outstandingBalances = ledger.recentOrders
    .filter((o: OrderRecord) => {
      const paid = Number(o.amountPaidNgn || 0);
      const total = Number(o.totalAmountNgn || 0);
      return paid < total && o.paymentStatus !== 'failed' && o.paymentStatus !== 'refunded';
    })
    .map((o: OrderRecord) => {
      const outstandingNgn = Math.max(0, o.totalAmountNgn - (o.amountPaidNgn || 0));
      return {
        orderId: o.id,
        orderReference: o.orderReference,
        packageName: o.packageName,
        totalAmountNgn: o.totalAmountNgn,
        amountPaidNgn: o.amountPaidNgn || 0,
        outstandingNgn,
        paymentStatus: o.paymentStatus,
        reminderMessage: buildPaymentReminderMessage({
          customerName: o.metadata?.customerName || 'Valued Client',
          orderReference: o.orderReference,
          outstandingNgn,
        }),
      };
    });

  return NextResponse.json({
    success: true,
    quotations: quotes,
    outstandingBalances,
  });
}

export async function POST(request: NextRequest) {
  const admin = await resolveAdminRequest(request);
  if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    if (body.action === 'convert_to_order' && body.quoteId) {
      const converted = await convertQuotationToOrder(String(body.quoteId), body.tenantId);
      if (!converted) {
        return NextResponse.json({ success: false, error: 'Quotation not found.' }, { status: 404 });
      }
      return NextResponse.json({ success: true, ...converted });
    }

    if (!body.customerName || !body.title || !Array.isArray(body.lineItems) || body.lineItems.length === 0) {
      return NextResponse.json(
        { success: false, error: 'customerName, title, and at least one lineItem are required.' },
        { status: 400 }
      );
    }

    const quote = createQuotation({
      tenantId: body.tenantId,
      customerName: String(body.customerName),
      customerEmail: body.customerEmail ? String(body.customerEmail) : undefined,
      customerWhatsapp: body.customerWhatsapp ? String(body.customerWhatsapp) : undefined,
      title: String(body.title),
      lineItems: body.lineItems,
      discountNgn: Number(body.discountNgn || 0),
      validDays: Number(body.validDays || 14),
      notes: body.notes ? String(body.notes) : undefined,
    });

    return NextResponse.json({ success: true, quotation: quote }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to process quotation.' },
      { status: 400 }
    );
  }
}
