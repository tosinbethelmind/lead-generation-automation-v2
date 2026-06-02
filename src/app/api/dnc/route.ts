import { NextRequest, NextResponse } from 'next/server';
import { getDNCList, addDNCEntry } from '@/lib/googleSheets';

export async function GET() {
  try {
    const list = await getDNCList();
    return NextResponse.json(list);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone } = body;
    if (!phone) {
      return NextResponse.json({ error: "Missing phone number" }, { status: 400 });
    }
    const result = await addDNCEntry(phone);
    return NextResponse.json({ success: result });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
