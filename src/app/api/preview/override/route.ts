import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const OVERRIDES_DIR = path.join(process.cwd(), 'src', 'data', 'overrides');

// Ensure directory exists
if (!fs.existsSync(OVERRIDES_DIR)) {
  fs.mkdirSync(OVERRIDES_DIR, { recursive: true });
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const leadId = searchParams.get('leadId');

    if (!leadId) {
      return NextResponse.json({ error: 'leadId is required' }, { status: 400 });
    }

    const filePath = path.join(OVERRIDES_DIR, `${leadId}.json`);
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return NextResponse.json(JSON.parse(data));
    }

    return NextResponse.json({});
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { leadId, overrides } = body;

    if (!leadId) {
      return NextResponse.json({ error: 'leadId is required' }, { status: 400 });
    }

    const filePath = path.join(OVERRIDES_DIR, `${leadId}.json`);
    fs.writeFileSync(filePath, JSON.stringify(overrides || {}, null, 2), 'utf8');

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
