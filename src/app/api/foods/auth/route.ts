import { NextRequest, NextResponse } from 'next/server';
import {
  createAdminSessionToken,
  FOODS_ADMIN_COOKIE,
  getExpectedAdminPassword,
  isFoodsAdminAuthenticated,
} from '@/lib/foods-auth';

export async function GET() {
  const authenticated = await isFoodsAdminAuthenticated();
  return NextResponse.json({ authenticated });
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { password?: string; action?: string };

    if (body.action === 'logout') {
      const res = NextResponse.json({ ok: true, authenticated: false });
      res.cookies.delete(FOODS_ADMIN_COOKIE);
      return res;
    }

    const submitted = (body.password || '').trim();
    const expected = getExpectedAdminPassword();

    if (!submitted || submitted !== expected) {
      return NextResponse.json(
        { error: 'Invalid admin password. Please try again.' },
        { status: 401 }
      );
    }

    const token = createAdminSessionToken();
    const res = NextResponse.json({ ok: true, authenticated: true });
    res.cookies.set(FOODS_ADMIN_COOKIE, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
