import { NextResponse } from 'next/server';
import { getPillar2Telemetry } from '@/lib/pillar2/pillar2Engine';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const telemetry = await getPillar2Telemetry();
    return NextResponse.json(
      { success: true, pillar2: telemetry },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=15, stale-while-revalidate=45'
        }
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to load telemetry' },
      { status: 500 }
    );
  }
}
