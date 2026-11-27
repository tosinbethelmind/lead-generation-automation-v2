import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    {
      success: false,
      frozen: true,
      error: 'OPay verification is frozen. Use Paystack or verified Moniepoint corporate bank transfer.',
    },
    { status: 503 }
  );
}
