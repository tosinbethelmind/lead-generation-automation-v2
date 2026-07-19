import { NextRequest, NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/auth';
import { createSessionToken } from '@/lib/session';

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
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
      return NextResponse.redirect(new URL('/admin/login?error=Token required', req.url));
    }

    const adminUser = getAdminUser(token);
    if (!adminUser) {
      return NextResponse.redirect(new URL('/admin/login?error=Invalid token', req.url));
    }

    const sessionValue = await createSessionToken(token, adminUser.role, adminUser.name);
    const response = NextResponse.redirect(new URL(redirectPath, req.url));

    response.cookies.set('admin-token', sessionValue, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    return NextResponse.redirect(new URL('/admin/login?error=Authentication error', req.url));
  }
}
