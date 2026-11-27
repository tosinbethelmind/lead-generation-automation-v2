import { NextRequest } from 'next/server';
import { getAdminUser, type AdminUser } from '@/lib/auth';
import { verifySessionToken } from '@/lib/session';

export async function resolveAdminRequest(req: NextRequest): Promise<AdminUser | null> {
  const bearer = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '').trim();
  const headerToken = (req.headers.get('x-admin-token') || '').trim();
  const rawToken = bearer || headerToken;

  if (rawToken) {
    const direct = getAdminUser(rawToken);
    if (direct) return direct;
  }

  const cookieVal = req.cookies.get('admin-token')?.value;
  if (cookieVal) {
    const session = await verifySessionToken(cookieVal);
    if (session) {
      return {
        id: 'session-admin',
        name: session.name,
        email: 'admin@bethelmindanalytics.com',
        role: session.role as any,
        permissions: ['*'],
      };
    }
  }

  return null;
}
