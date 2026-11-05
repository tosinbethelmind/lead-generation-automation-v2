import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { readServerConfig } from '../config/route';

/**
 * @file src/app/api/factory/auth/route.ts
 * 
 * 🔒 SECURE SERVER-SIDE FACTORY AUTHENTICATION API
 * 
 * Dynamically checks staff PINs against configured staff roster in factoryConfig
 * with fallback to standard environment/role defaults.
 * Uses constant-time byte comparisons and in-memory rate limiting.
 * 
 * Bethelmind Digital Solutions (CAC Certified: Reg 9912717)
 */

// Fallback hardcoded PINs
const DEFAULT_ROLE_PINS: Record<string, string> = {
  owner: process.env.FACTORY_OWNER_PIN || '2026',
  supervisor: process.env.FACTORY_SUPERVISOR_PIN || '1111',
  cashier: process.env.FACTORY_CASHIER_PIN || '2222',
  driver: process.env.FACTORY_DRIVER_PIN || '3333'
};

// In-memory rate limiting map: ip -> { attempts, lockedUntil }
const rateLimitMap = new Map<string, { attempts: number; lockedUntil: number }>();

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
    const { role, pin, staffId } = body;

    if ((!role && !staffId) || !pin || typeof pin !== 'string') {
      return NextResponse.json(
        { error: 'Staff role/ID and 4-digit numeric PIN are required.' },
        { status: 400 }
      );
    }

    // 1. Look up in dynamic server config
    const serverConfig = readServerConfig();
    const matchingStaff = serverConfig.staff.find(
      s => (staffId && s.id === staffId) || (role && s.role.toLowerCase() === role.toLowerCase())
    );

    let expectedPin = matchingStaff ? matchingStaff.pin : null;
    if (!expectedPin && role) {
      expectedPin = DEFAULT_ROLE_PINS[role.toLowerCase()] || null;
    }

    if (!expectedPin) {
      return NextResponse.json(
        { error: 'Staff member or factory role not found.' },
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
      const lockedUntil = attempts >= 5 ? now + 15 * 60 * 1000 : 0;
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
    const expiresAt = now + 12 * 60 * 60 * 1000;

    const response = NextResponse.json({
      authenticated: true,
      role: role ? role.toLowerCase() : matchingStaff?.role || 'staff',
      staffName: matchingStaff?.name || role,
      token: sessionToken,
      expiresAt,
      message: `Access granted to ${matchingStaff?.name || role} console.`
    });

    response.cookies.set('factory_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 12 * 60 * 60,
      path: '/'
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Authentication internal server error.' },
      { status: 500 }
    );
  }
}
