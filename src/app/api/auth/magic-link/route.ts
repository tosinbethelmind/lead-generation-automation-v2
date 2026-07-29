import { NextRequest, NextResponse } from 'next/server';

// Token store in-memory map for passwordless magic links
const magicTokens = new Map<string, { leadId: string; expiresAt: number }>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { leadId, phone } = body;

    if (!leadId) {
      return NextResponse.json({ error: 'Missing leadId' }, { status: 400 });
    }

    const token = `mag-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const expiresAt = Date.now() + 30 * 60 * 1000; // 30 mins valid

    magicTokens.set(token, { leadId, expiresAt });

    const origin = req.nextUrl?.origin || 'https://apexreach.site';
    const magicUrl = `${origin}/admin/magic?token=${token}&leadId=${encodeURIComponent(leadId)}`;

    return NextResponse.json({
      success: true,
      token,
      magicUrl,
      whatsappInstructionText: `🔑 *1-CLICK PASSWORDLESS ADMIN ACCESS*\nClick below to open your dashboard instantly without typing any password:\n\n${magicUrl}`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  if (!token || !magicTokens.has(token)) {
    return NextResponse.json({ error: 'Invalid or expired magic token' }, { status: 401 });
  }

  const record = magicTokens.get(token)!;
  if (Date.now() > record.expiresAt) {
    magicTokens.delete(token);
    return NextResponse.json({ error: 'Magic link expired' }, { status: 401 });
  }

  // Consume token (single use)
  magicTokens.delete(token);

  return NextResponse.json({
    success: true,
    leadId: record.leadId,
    authenticated: true,
    message: 'Welcome! You have been logged in passwordlessly.',
  });
}
