import { NextResponse } from 'next/server';
import { queryVinAuditHistory } from '@/lib/vin/vinAuditClient';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { vin } = body;

    if (!vin || vin.trim().length !== 17) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid 17-digit VIN.' },
        { status: 400 }
      );
    }

    const historyResult = await queryVinAuditHistory(vin);

    return NextResponse.json({
      success: true,
      data: historyResult,
      providerNotice: historyResult.source === 'VINAUDIT_NMVTIS_OFFICIAL'
        ? 'Official US Dept of Justice NMVTIS & Auction Data Verified'
        : 'Federal NHTSA Registry & WMI Build Profile Verified (Add VINAUDIT_API_KEY in .env for live NMVTIS real-time auction photos)'
    });
  } catch (error: any) {
    console.error('[RealVinHistory] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve vehicle history.' },
      { status: 500 }
    );
  }
}
