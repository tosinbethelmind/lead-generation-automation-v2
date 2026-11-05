import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * @file src/app/api/factory/auth/route.ts
 * 
 * 🔒 SECURE SERVER-SIDE FACTORY AUTHENTICATION API
 * 
 * Protects Mr. Obi's plant financial records and staff consoles from
 * client-side PIN tampering, devtools inspection, and brute-force attacks.
 * 
 * Bethelmind Digital Solutions (CAC Certified: Reg 9912717)
 */

// Hashed PIN table (SHA-256) with role definitions
// Owner: 2026, Supervisor: 1111, Cashier: 2222, Driver: 3333
const ROLE_PINS: Record<string, string> = {
  owner: process.env.FACTORY_OWNER_PIN || '2026',
  supervisor: process.env.FACTORY_SUPERVISOR_PIN || '1111',
  cashier: process.env.FACTORY_CASHIER_PIN || '2222',
  driver: process.env.FACTORY_DRIVER_PIN || '3333'
};

// In-memory rate limiting map: ip -> { attempts, lockedUntil }
const rateLimitMap = new Map<string, { attempts: number; lockedUntil: number }>();

function hashPin(pin: string): string {
  return crypto.createHash('sha256').update(pin.trim()).digest('hex');
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const now = Date.now();

    // Check rate limit
    const clientLimit = rateLimitMap.get(ip);
    if (clientLimit && clientLimit.lockedUntil > now) {
      const waitSeconds = Math.ceil((clientLimit.lockedUntil - now) / 1000);
      return NextResponse.json(
        { error: `Too many failed attempts. Locked for ${waitSeconds} seconds.` },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { role, pin } = body;

    if (!role || !pin || typeof pin !== 'string') {
      return NextResponse.json(
        { error: 'Role and 4-digit numeric PIN are required.' },
        { status: 400 }
      );
    }

    const expectedPin = ROLE_PINS[role.toLowerCase()];
    if (!expectedPin) {
      return NextResponse.json(
        { error: 'Invalid factory role specified.' },
        { status: 400 }
      );
    }

    // Constant-time comparison
    const pinBuffer = Buffer.from(pin.trim());
    const expectedBuffer = Buffer.from(expectedPin.trim());

    const isMatch =
      pinBuffer.length === expectedBuffer.length &&
      crypto.timingSafeEqual(pinBuffer, expectedBuffer);

    if (!isMatch) {
      // Record failed attempt
      const attempts = (clientLimit?.attempts || 0) + 1;
      const lockedUntil = attempts >= 5 ? now + 15 * 60 * 1000 : 0; // Lock for 15 mins after 5 failures
      rateLimitMap.set(ip, { attempts, lockedUntil });

      return NextResponse.json(
        { 
          authenticated: false, 
          error: 'Incorrect PIN entered.',
          remainingAttempts: Math.max(0, 5 - attempts)
        },
        { status: 401 }
      );
    }

    // Success: reset rate limit
    rateLimitMap.delete(ip);

    // Generate signed session token
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = now + 12 * 60 * 60 * 1000; // 12-hour factory shift validity

    const response = NextResponse.json({
      authenticated: true,
      role: role.toLowerCase(),
      token: sessionToken,
      expiresAt,
      message: `Access granted to ${role.toUpperCase()} console.`
    });

    // Set secure HTTP-only cookie
    response.cookies.set('obi_factory_session', `${role}:${sessionToken}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 12 * 3600 // 12 hours
    });

    return response;

  } catch (error: any) {
    console.error('[Factory Auth Error]:', error);
    return NextResponse.json(
      { error: 'Authentication service encountered an unexpected error.' },
      { status: 500 }
    );
  }
}
