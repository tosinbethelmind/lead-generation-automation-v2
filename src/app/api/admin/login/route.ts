import { NextRequest, NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/auth';
import { createSessionToken } from '@/lib/session';

function getPublicUrl(targetPath: string, req: NextRequest): URL {
  const forwardedHost = req.headers.get('x-forwarded-host') || req.headers.get('host') || 'www.bethelmindanalytics.com';
  const proto = req.headers.get('x-forwarded-proto') || 'https';
  
  // Ignore internal docker container IP / host 0.0.0.0
  const isInternal = forwardedHost.includes('0.0.0.0') || forwardedHost.includes('127.0.0.1');
  const activeHost = isInternal ? 'www.bethelmindanalytics.com' : forwardedHost;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `${proto}://${activeHost}`;

  try {
    return new URL(targetPath, baseUrl);
  } catch (_) {
    return new URL(targetPath, req.url);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const token = body?.token;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Token is required' },
        { status: 400 }
      );
    }

    const adminUser = getAdminUser(token);
    if (!adminUser) {
      return NextResponse.json(
        { success: false, message: 'Invalid admin or team token' },
        { status: 401 }
      );
    }

    const sessionValue = await createSessionToken(token, adminUser.role, adminUser.name);
    const response = NextResponse.json({
      success: true,
      message: 'Authenticated successfully',
      user: {
        name: adminUser.name,
        role: adminUser.role,
        permissions: adminUser.permissions
      }
    });

    response.cookies.set('admin-token', sessionValue, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days (Persistent login)
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { success: false, message: 'GET token login is disabled for security. Use POST /api/admin/login.' },
    { status: 405 }
  );
}
