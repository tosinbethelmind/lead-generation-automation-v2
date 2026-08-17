import { NextRequest, NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    const user = getAdminUser(token.trim());

    if (!user || (user.role !== 'admin_assistant' && user.role !== 'super_admin')) {
      return NextResponse.json({ error: 'Invalid assistant token. Access denied.' }, { status: 401 });
    }

    const response = NextResponse.json({ success: true, user });

    // Set a separate assistant-token cookie (30 days persistent login)
    response.cookies.set('assistant-token', token.trim(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/'
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Login failed' }, { status: 500 });
  }
}
