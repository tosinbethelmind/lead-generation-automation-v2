import { NextResponse } from 'next/server';
import { getPillar2Telemetry } from '@/lib/pillar2/pillar2Engine';

export const dynamic = 'force-dynamic';

let cachedTelemetry: any = null;
let lastCacheTimestamp = 0;
const CACHE_TTL_MS = 15000; // 15 seconds fast memory cache

export async function GET() {
  try {
    const now = Date.now();
    if (cachedTelemetry && now - lastCacheTimestamp < CACHE_TTL_MS) {
      return NextResponse.json(
        { success: true, pillar2: cachedTelemetry, cached: true },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=15, stale-while-revalidate=45',
            'X-Telemetry-Cache': 'HIT'
          }
        }
      );
    }

    const telemetry = await getPillar2Telemetry();
    cachedTelemetry = telemetry;
    lastCacheTimestamp = now;

    return NextResponse.json(
      { success: true, pillar2: telemetry, cached: false },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=15, stale-while-revalidate=45',
          'X-Telemetry-Cache': 'MISS'
        }
      }
    );
  } catch (error: any) {
    // If error occurs, serve stale cache if available
    if (cachedTelemetry) {
      return NextResponse.json(
        { success: true, pillar2: cachedTelemetry, stale: true },
        { headers: { 'X-Telemetry-Cache': 'STALE' } }
      );
    }
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to load telemetry' },
      { status: 500 }
    );
  }
}
