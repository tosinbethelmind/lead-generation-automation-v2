import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken } from './lib/session';

/**
 * Bethelmind Analytics & Strategy Unified Middleware
 *
 * Handles two responsibilities:
 * 1. Admin route authentication (merged from the old src/proxy.ts)
 * 2. Dynamic wildcard subdomain → /sites/[slug] rewriting for zero-build multi-tenancy
 *
 * DNS Setup required in production:
 *   CNAME *.apexreach.net → cname.vercel-dns.com
 *   (or A record to Vercel's IP for the root domain)
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

  // ── 1. Admin Route Protection ─────────────────────────────────────────────
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    console.log(`[Proxy Debug] Entering Admin protection for pathname: ${pathname}`);
    // Allow login paths to bypass authentication
    if (pathname === '/admin/login' || pathname === '/api/admin/login') {
      console.log(`[Proxy Debug] Bypassing admin authentication for login path: ${pathname}`);
      return NextResponse.next();
    }

    // Programmatic access with a valid administrative secret
    const adminPasswordHeader = req.headers.get('x-admin-password');
    const expectedPassword = process.env.ADMIN_PASSWORD || 'admin123';
    if (adminPasswordHeader && adminPasswordHeader === expectedPassword) {
      return NextResponse.next();
    }

    // Handle token query parameter for easy one-click login (e.g. /admin?token=xxx)
    // Delegate to the API route which runs in Node.js, so it can verify the token from config.json
    const tokenQuery = url.searchParams.get('token');
    if (tokenQuery) {
      const loginUrl = new URL('/api/admin/login', req.url);
      loginUrl.searchParams.set('token', tokenQuery);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Verify cookie token using async cryptographic verification
    const tokenCookie = req.cookies.get('admin-token')?.value || '';
    console.log(`[Proxy Debug] Found admin-token cookie payload: "${tokenCookie ? 'token-present' : 'token-missing'}"`);
    const session = await verifySessionToken(tokenCookie);
    console.log(`[Proxy Debug] verifySessionToken result is: ${session ? JSON.stringify(session) : 'null (invalid/expired)'}`);

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
