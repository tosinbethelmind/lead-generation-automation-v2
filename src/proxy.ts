import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  // Only run proxy on /admin and /api/admin routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const adminToken = process.env.ADMIN_TOKEN || 'admin_secret_token_123';

    // 1. Allow login paths to bypass authentication
    if (pathname === '/admin/login' || pathname === '/api/admin/login') {
      return NextResponse.next();
    }

    // 2. Handle token query parameter for easy one-click login (e.g. /admin?token=xxx)
    const tokenQuery = url.searchParams.get('token');
    if (tokenQuery === adminToken) {
      const response = NextResponse.redirect(new URL(pathname, req.url));
      // Set cookie for 7 days
      response.cookies.set('admin-token', adminToken, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
      });
      return response;
    }

    // 3. Verify cookie token
    const tokenCookie = req.cookies.get('admin-token')?.value || '';
    if (tokenCookie !== adminToken) {
      if (pathname.startsWith('/api/admin')) {
        return new NextResponse(
          JSON.stringify({ error: 'Unauthorized. Invalid admin token.' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      } else {
        // Redirect pages to login
        const loginUrl = new URL('/admin/login', req.url);
        // Save the original path they wanted to visit
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
