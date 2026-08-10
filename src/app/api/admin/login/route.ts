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
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = req.nextUrl.clone();
    const token = url.searchParams.get('token');
    const redirectPath = url.searchParams.get('redirect') || '/admin';

    if (!token) {
      return NextResponse.redirect(getPublicUrl('/admin/login?error=Token required', req));
    }

    const adminUser = getAdminUser(token);
    if (!adminUser) {
      return NextResponse.redirect(getPublicUrl('/admin/login?error=Invalid token', req));
    }

    const sessionValue = await createSessionToken(token, adminUser.role, adminUser.name);
    const response = NextResponse.redirect(getPublicUrl(redirectPath, req));

    response.cookies.set('admin-token', sessionValue, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    return NextResponse.redirect(getPublicUrl('/admin/login?error=Authentication error', req));
  }
}
