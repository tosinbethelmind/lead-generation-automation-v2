import { NextResponse } from 'next/server';
import { getLogs } from '@/lib/googleSheets';

export async function GET() {
  try {
    const logs = await getLogs();
    return NextResponse.json(logs);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
