export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getLocalConfig, saveLocalConfig, RuntimeConfig } from '@/lib/localConfig';
import { validateSecret } from '@/lib/validation';
import fs from 'fs';
import path from 'path';

// Define the secret keys that should be masked/encrypted
const SECRET_KEYS = [
  'googleClientSecret',
  'supabaseKey',
  'resendApiKey',
  'googlePlacesApiKey',
  'jijiPassword',
  'whatsappAccessToken',
  'evolutionApiKey',
  'whapiToken',
  'brevoApiKey',
  'smtpPass',
  'sendgridApiKey',
  'termiiApiKey',
  'africastalkingApiKey',
  'paystackSecretKey',
  'geminiApiKey',
  'twilioAuthToken'
];

const MASK_VALUE = '••••••••';

/**
 * Mask secret values in config
 */
function maskConfig(config: RuntimeConfig): any {
  const masked = { ...config } as any;
  for (const key of SECRET_KEYS) {
    if (masked[key]) {
      masked[key] = MASK_VALUE;
    }
  }
  return masked;
}

/**
 * Update the .env.local file on server if it exists
 */
function updateEnvLocal(updates: Record<string, string>) {
  try {
    const envPath = path.join(process.cwd(), '.env.local');
    if (!fs.existsSync(envPath)) return;

    let content = fs.readFileSync(envPath, 'utf-8');
    let updated = false;

    // Map configuration keys to environment variable names if different
    const keyMap: Record<string, string> = {
      supabaseKey: 'SUPABASE_SERVICE_ROLE_KEY',
      resendApiKey: 'RESEND_API_KEY',
      googlePlacesApiKey: 'GOOGLE_PLACES_API_KEY',
      jijiPassword: 'JIJI_PASSWORD',
      whatsappAccessToken: 'WHATSAPP_ACCESS_TOKEN',
      evolutionApiKey: 'EVOLUTION_API_KEY',
      whapiToken: 'WHAPI_TOKEN',
      googleClientSecret: 'GOOGLE_CLIENT_SECRET',
      paystackSecretKey: 'PAYSTACK_SECRET_KEY',
      twilioAuthToken: 'TWILIO_AUTH_TOKEN',
      termiiApiKey: 'TERMII_API_KEY',
      africastalkingApiKey: 'AFRICASTALKING_API_KEY',
      geminiApiKey: 'GEMINI_API_KEY'
    };

    for (const [key, value] of Object.entries(updates)) {
      const envKey = keyMap[key] || key.toUpperCase();
      const regex = new RegExp(`^${envKey}=.*$`, 'm');

      // Escaped value
      const escapedVal = value.replace(/"/g, '\\"');

      if (regex.test(content)) {
        content = content.replace(regex, `${envKey}="${escapedVal}"`);
        updated = true;
      } else {
        content += `\n${envKey}="${escapedVal}"`;
        updated = true;
      }
      
      // Also update process.env temporarily
      process.env[envKey] = value;
    }

    if (updated) {
      fs.writeFileSync(envPath, content, 'utf-8');
    }
  } catch (err) {
    console.error('Error writing to .env.local:', err);
  }
}

export async function GET() {
  try {
    const config = getLocalConfig();
    const masked = maskConfig(config);
    return NextResponse.json(masked);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const currentConfig = getLocalConfig();

    const updates: Partial<RuntimeConfig> = {};
    const envUpdates: Record<string, string> = {};

    // Validate and process each field in body
    for (const [key, value] of Object.entries(body)) {
      const isSecret = SECRET_KEYS.includes(key);

      if (isSecret) {
        // If the value is the mask value, retain the existing secret
        if (value === MASK_VALUE) {
          continue;
        }

        // If the value is string, validate it
        if (typeof value === 'string') {
          const validationError = validateSecret(key, value);
          if (validationError) {
            return NextResponse.json({ error: validationError }, { status: 400 });
          }

          // Store the validated value
          const trimmedVal = value.trim();
          (updates as any)[key] = trimmedVal;
          envUpdates[key] = trimmedVal;
        }
      } else {
        // Non-secret fields
        (updates as any)[key] = value;
      }
    }

    // Save configuration updates
    const updatedConfig = saveLocalConfig(updates);
    
    // Update .env.local if applicable
    if (Object.keys(envUpdates).length > 0) {
      updateEnvLocal(envUpdates);
    }

    // Return the updated config, masked
    const masked = maskConfig(updatedConfig);
    return NextResponse.json(masked);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
