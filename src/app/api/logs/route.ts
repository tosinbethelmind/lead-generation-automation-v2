export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getLogs } from '@/lib/googleSheets';

export async function GET() {
  try {
    const logs = await getLogs();
    return NextResponse.json(logs, {
      headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0' }
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
