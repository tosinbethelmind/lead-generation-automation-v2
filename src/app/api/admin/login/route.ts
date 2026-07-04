import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    const adminToken = process.env.ADMIN_TOKEN || 'admin_secret_token_123';

    if (token === adminToken) {
      const response = NextResponse.json({ success: true, message: 'Authenticated successfully' });
      response.cookies.set('admin-token', adminToken, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
      return response;
    }

    return NextResponse.json(
      { success: false, message: 'Invalid admin token' },
      { status: 401 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}
