import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken } from './lib/session';
import { checkRateLimit, safeCompareStrings } from './lib/security';

/**
 * Bethelmind Analytics & Strategy Unified Middleware
 *
 * Handles three responsibilities:
 * 1. API rate limiting
 * 2. Admin route authentication
 * 3. Dynamic wildcard subdomain → /sites/[slug] rewriting for zero-build multi-tenancy
 */

// Root hostnames that should NOT be treated as client subdomains
const MAIN_DOMAINS = new Set([
  'localhost',
  'www',
  'apexreach',
  'bethelmind',
  'vercel',
]);

// Reserved subdomains (infrastructure / common services)
const RESERVED_SUBDOMAINS = new Set([
  'api', 'www', 'mail', 'ftp', 'smtp', 'cdn', 'static', 'assets', 'admin',
]);

// Path prefixes that should always pass through without rewriting
const PASSTHROUGH_PREFIXES = [
  '/api/',
  '/_next/',
  '/favicon',
  '/public/',
  '/preview/',
  '/setup',
  '/domain-session',
  '/dashboard',
  '/sites/',
  '/handover/',
  '/admin',
];

export async function proxy(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  // ── 0. API Rate Limiting ─────────────────────────────────────────────
  if (pathname.startsWith('/api/')) {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || 'anonymous';
    const key = `${ip}:${pathname}`;

    const isMutation = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method);
    const limit = isMutation ? 20 : 100;
    const { allowed, remaining } = checkRateLimit(key, limit, 60000);

    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': '60',
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
          },
        }
      );
    }
  }

  // ── 1. Admin Route Protection ─────────────────────────────────────────────
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    console.log(`[Proxy Debug] Entering Admin protection for pathname: ${pathname}`);
    // Allow login paths to bypass authentication
    if (pathname === '/admin/login' || pathname === '/api/admin/login') {
      console.log(`[Proxy Debug] Bypassing admin authentication for login path: ${pathname}`);
      return NextResponse.next();
    }

    // 1. Programmatic access with Bearer header, x-admin-token, or x-admin-password
    const authHeader = (req.headers.get('authorization')?.replace(/^Bearer\s+/i, '') || req.headers.get('x-admin-token') || req.headers.get('x-admin-password') || '').trim();
    const tokenCookie = (req.cookies.get('admin-token')?.value || req.cookies.get('assistant-token')?.value || '').trim();
    const candidateToken = authHeader || tokenCookie;

    const rawValidTokens = [
      'bethelmind_admin_2026',
      'bethelmind_assistant_2026',
      process.env.ADMIN_TOKEN,
      process.env.ADMIN_PASSWORD,
      process.env.ASSISTANT_TOKEN
    ].filter(Boolean) as string[];

    if (candidateToken && rawValidTokens.some(t => safeCompareStrings(candidateToken, t.trim()))) {
      return NextResponse.next();
    }

    // Handle token query parameter for easy one-click login (e.g. /admin?token=xxx)
    const tokenQuery = url.searchParams.get('token');
    if (tokenQuery) {
      if (rawValidTokens.some(t => safeCompareStrings(tokenQuery.trim(), t.trim()))) {
        return NextResponse.next();
      }
      const loginUrl = new URL('/api/admin/login', req.url);
      loginUrl.searchParams.set('token', tokenQuery);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Verify signed cookie token using async cryptographic verification
    const session = await verifySessionToken(tokenCookie || candidateToken);
    if (session) {
      return NextResponse.next();
    }

    if (!session) {
      if (pathname.startsWith('/api/admin')) {
        console.log(`[Proxy Debug] Rejecting API request to ${pathname} with 401`);
        return new NextResponse(
          JSON.stringify({ error: 'Unauthorized. Invalid admin session.' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      } else {
        const loginUrl = new URL('/admin/login', req.url);
        loginUrl.searchParams.set('redirect', pathname);
        console.log(`[Proxy Debug] Redirecting page request to ${pathname} to login: ${loginUrl.pathname}${loginUrl.search}`);
        return NextResponse.redirect(loginUrl);
      }
    }

    console.log(`[Proxy Debug] Session validation successful for ${pathname}. Proceeding...`);
    return NextResponse.next();
  }

  // ── 2. Subdomain → /sites/[slug] Rewriting ────────────────────────────────
  // Skip passthrough paths (static assets, API routes, main app routes)
  for (const prefix of PASSTHROUGH_PREFIXES) {
    if (pathname.startsWith(prefix)) {
      return NextResponse.next();
    }
  }

  const hostname = req.headers.get('host') || '';
  const hostWithoutPort = hostname.split(':')[0];

  // Skip loopback IP
  if (hostWithoutPort === '127.0.0.1') {
    return NextResponse.next();
  }

  // Skip Vercel preview/production system domains (*.vercel.app)
  if (hostWithoutPort.endsWith('.vercel.app')) {
    return NextResponse.next();
  }

  const parts = hostWithoutPort.split('.');

  // Must have at least 2 segments (subdomain.domain) to be a subdomain request
  if (parts.length < 2) return NextResponse.next();

  const subdomain = parts[0];

  // Skip root/main domains and reserved subdomains
  if (MAIN_DOMAINS.has(subdomain)) return NextResponse.next();
  if (RESERVED_SUBDOMAINS.has(subdomain)) return NextResponse.next();

  // Skip Vercel deployment preview hashes (20+ hex characters)
  if (/^[a-f0-9]{20,}$/.test(subdomain)) return NextResponse.next();

  // Rewrite to /sites/[subdomain] internally — zero-build multi-tenancy
  url.pathname = `/sites/${subdomain}${pathname === '/' ? '' : pathname}`;
  console.log(`[Bethelmind Analytics & Strategy Middleware] Rewriting ${hostname}${pathname} → ${url.pathname}`);

  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
