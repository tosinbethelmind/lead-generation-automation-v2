import { NextRequest, NextResponse } from 'next/server';
import { initializeCheckout } from '@/lib/commerce/paymentOrchestrator';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      productId,
      customerName,
      customerEmail,
      customerWhatsapp,
      companyName,
      leadId,
      paymentStage,
      paymentProvider,
      selectedAddOnIds,
      affiliateCode,
      publicKey,
      metadata,
    } = body;

    if (!productId || !customerName || !customerEmail) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: productId, customerName, customerEmail' },
        { status: 400 }
      );
    }

    const origin = new URL(req.url).origin;
    const result = await initializeCheckout({
      productId,
      customerName,
      customerEmail,
      customerWhatsapp,
      companyName,
      leadId,
      paymentStage,
      paymentProvider,
      selectedAddOnIds: Array.isArray(selectedAddOnIds) ? selectedAddOnIds : undefined,
      affiliateCode,
      callbackOrigin: origin,
      publicKey,
      metadata,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Checkout initialization failed' },
      { status: 400 }
    );
  }
}
