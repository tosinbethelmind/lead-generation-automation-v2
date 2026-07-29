import { NextRequest, NextResponse } from 'next/server';
import { generateVirtualAccountDva } from '@/lib/sectorModules';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { leadId, businessName, isDeposit } = body;

    const bName = businessName || 'Valued Business';
    const amountNgn = isDeposit ? 92500 : 185000;

    const dva = generateVirtualAccountDva(bName, amountNgn);

    const refId = `CLAIM-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 mins countdown

    return NextResponse.json({
      success: true,
      refId,
      amountNgn,
      isDeposit: !!isDeposit,
      expiresAt,
      dva: {
        bankName: 'Moniepoint Microfinance Bank',
        accountNumber: dva.accountNumber,
        accountName: `ApexReach / ${bName.substring(0, 15)}`,
        instructions: `Transfer ₦${amountNgn.toLocaleString()} to ${dva.accountNumber} (Moniepoint MFB). Payment auto-verifies in 10 seconds!`,
      },
    });
  } catch (error: any) {
    console.error('Error generating claim DVA:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate virtual account' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const refId = searchParams.get('refId');

  if (!refId) {
    return NextResponse.json({ error: 'Missing refId parameter' }, { status: 400 });
  }

  // Simulated status polling
  return NextResponse.json({
    refId,
    status: 'PENDING_TRANSFER',
    pollingMessage: 'Listening for incoming bank transfer on Moniepoint network...',
    checkTime: new Date().toISOString(),
  });
}
