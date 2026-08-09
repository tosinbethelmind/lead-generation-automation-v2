import { safeCompareStrings } from './security';

export interface SessionUser {
  token: string;
  role: string;
  name: string;
}

function getMasterSecret(): string {
  return process.env.ADMIN_TOKEN || process.env.ADMIN_PASSWORD || '';
}

/**
 * Computes an HMAC SHA-256 signature for a message using the master admin token.
 */
async function computeSignature(message: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret || 'fallback_internal_secret_key');
  const messageData = encoder.encode(message);

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signatureBuffer = await crypto.subtle.sign(
    'HMAC',
    cryptoKey,
    messageData
  );

  return Array.from(new Uint8Array(signatureBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Creates a signed session cookie value.
 * Format: token.role.name.signature
 */
export async function createSessionToken(
  token: string,
  role: string,
  name: string
): Promise<string> {
  const masterSecret = getMasterSecret();
  const payload = [
    encodeURIComponent(token),
    encodeURIComponent(role),
    encodeURIComponent(name)
  ].join('.');

  const signature = await computeSignature(payload, masterSecret);
  return `${payload}.${signature}`;
}

/**
 * Verifies a session cookie value and extracts user session details.
 * Also handles fallback/direct match of the raw master ADMIN_TOKEN for backward compatibility.
 */
export async function verifySessionToken(
  cookieValue: string | undefined
): Promise<SessionUser | null> {
  if (!cookieValue) return null;

  const masterSecret = getMasterSecret();

  // 1. Direct/raw match for master admin token (only if master secret is defined)
  if (masterSecret && safeCompareStrings(cookieValue, masterSecret)) {
    return {
      token: masterSecret,
      role: 'super_admin',
      name: 'Master Admin'
    };
  }

  // 2. Parse signed session format
  const parts = cookieValue.split('.');
  if (parts.length !== 4) return null;

  const [tknRaw, roleRaw, nameRaw, signature] = parts;
  const payload = [tknRaw, roleRaw, nameRaw].join('.');

  // Compute expected signature
  const expectedSignature = await computeSignature(payload, masterSecret);
  if (!safeCompareStrings(signature, expectedSignature)) {
    return null; // Invalid signature
  }

  return {
    token: decodeURIComponent(tknRaw),
    role: decodeURIComponent(roleRaw),
    name: decodeURIComponent(nameRaw)
  };
}
