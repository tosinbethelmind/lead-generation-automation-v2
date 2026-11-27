import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      frozen: true,
      error: 'OPay checkout is frozen. Use Paystack or verified Moniepoint corporate bank transfer.',
    },
    { status: 503 }
  );
}
