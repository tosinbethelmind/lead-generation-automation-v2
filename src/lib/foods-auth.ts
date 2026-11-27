import crypto from 'crypto';
import { cookies } from 'next/headers';

export const FOODS_ADMIN_COOKIE = 'bm_foods_admin_session';

function getAdminSecret(): string {
  return (
    process.env.FOODS_ADMIN_SECRET ||
    process.env.ADMIN_SECRET ||
    'bethelmind-foods-session-secret-2026'
  );
}

export function getExpectedAdminPassword(): string {
  return process.env.FOODS_ADMIN_PASSWORD || 'BethelFoods2026!';
}

export function createAdminSessionToken(): string {
  const payload = JSON.stringify({
    role: 'foods_admin',
    iat: Date.now(),
    exp: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
  });
  const encoded = Buffer.from(payload).toString('base64url');
  const sig = crypto
    .createHmac('sha256', getAdminSecret())
    .update(encoded)
    .digest('base64url');
  return `${encoded}.${sig}`;
}

export function verifyAdminSessionToken(token: string | undefined): boolean {
  if (!token || !token.includes('.')) return false;
  const [encoded, sig] = token.split('.');
  if (!encoded || !sig) return false;

  const expectedSig = crypto
    .createHmac('sha256', getAdminSecret())
    .update(encoded)
    .digest('base64url');

  const sigBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expectedBuf.length) return false;
  if (!crypto.timingSafeEqual(sigBuf, expectedBuf)) return false;

  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf-8')) as {
      role?: string;
      exp?: number;
    };
    if (payload.role !== 'foods_admin') return false;
    if (!payload.exp || Date.now() > payload.exp) return false;
    return true;
  } catch {
    return false;
  }
}

export async function isFoodsAdminAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(FOODS_ADMIN_COOKIE)?.value;
    return verifyAdminSessionToken(token);
  } catch {
    return false;
  }
}
