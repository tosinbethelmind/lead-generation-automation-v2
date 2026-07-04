// src/app/api/config/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getRuntimeConfig, saveLocalConfig } from '@/lib/localConfig';
import { validateSecret, maskConfig, SECRET_KEYS, MASK_VALUE } from '@/lib/validation';

/**
 * GET returns the current runtime configuration (excluding sensitive fields).
 * POST expects a JSON body with any subset of RuntimeConfig fields to merge and persist.
 */
export async function GET(_req: NextRequest) {
  const config = getRuntimeConfig();
  const masked = maskConfig(config);
  return NextResponse.json(masked);
}

export async function POST(req: NextRequest) {
  try {
    const updates = await req.json();

    // Validate Antigravity API keys array (max 10)
    if (Array.isArray(updates.antigravityApiKeys)) {
      if (updates.antigravityApiKeys.length > 10) {
        return NextResponse.json({ error: 'Maximum of 10 Antigravity API keys allowed' }, { status: 400 });
      }
    }


    // Validate updates
    for (const [key, value] of Object.entries(updates)) {
      if (SECRET_KEYS.includes(key)) {
        // If the value is the mask value, retain the existing secret
        if (value === MASK_VALUE) {
          continue;
        }

        if (typeof value === 'string') {
          const validationError = validateSecret(key, value);
          if (validationError) {
            return NextResponse.json({ error: validationError }, { status: 400 });
          }
        }
      }
    }

    const newConfig = saveLocalConfig(updates);
    return NextResponse.json({ success: true, config: maskConfig(newConfig) });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
