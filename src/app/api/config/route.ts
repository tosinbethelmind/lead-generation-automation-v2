import { NextRequest, NextResponse } from 'next/server';
import { getLocalConfig, saveLocalConfig } from '@/lib/localConfig';

export async function GET() {
  try {
    const config = getLocalConfig();
    return NextResponse.json(config);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const updated = saveLocalConfig(body);
    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
