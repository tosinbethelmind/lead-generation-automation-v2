import { NextRequest, NextResponse } from 'next/server';
import { verifyAndProcessPaystackTransaction } from '@/lib/commerce/paymentOrchestrator';
import { addLog } from '@/lib/googleSheets';

export async function GET(req: NextRequest) {
  try {
    const reference = req.nextUrl.searchParams.get('reference') || req.nextUrl.searchParams.get('trxref');
    if (!reference) {
      return NextResponse.json({ error: 'Missing reference parameter' }, { status: 400 });
    }

    const result = await verifyAndProcessPaystackTransaction({ reference });

    if (!result.verified) {
      return NextResponse.json(
        { success: false, verified: false, error: result.error || 'Verification failed' },
        { status: 400 }
      );
    }

    try {
      await addLog(
        'Paystack Verify',
        'SUCCESS',
        `Verified Paystack reference=${reference} order=${result.order?.orderReference}`
      );
    } catch {}

    return NextResponse.json({
      success: true,
      verified: true,
      alreadyProcessed: result.alreadyProcessed,
      order: result.order,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Paystack verification failed' },
      { status: 500 }
    );
  }
}
