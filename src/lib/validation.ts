import { type RuntimeConfig } from './localConfig';

/**
 * Input validation and sanitization utility for API keys and settings secrets.
 */

/**
 * Checks if a string contains potential XSS, script, or SQL injection signatures.
 */
export function hasInjection(val: string): boolean {
  const injectionPatterns = [
    /<script/i,
    /<\/script/i,
    /<html/i,
    /javascript:/i,
    /onload=/i,
    /onerror=/i,
    /onclick=/i,
    /UNION\s+SELECT/i,
    /SELECT\s+.*\s+FROM/i,
    /INSERT\s+INTO/i,
    /DROP\s+TABLE/i,
    /--/,
    /\/\*/
  ];
  return injectionPatterns.some(pattern => pattern.test(val));
}

/**
 * Validates a configuration/secret field value.
 * Returns a string with the error message if invalid, or null if valid.
 */
export function validateSecret(field: string, value: string): string | null {
  if (!value) return null; // Empty is allowed (signifies clearing/disabling the setting)

  // Trim whitespace
  const trimmed = value.trim();

  // Guard against injection attacks
  if (hasInjection(trimmed)) {
    return `Security Validation Failed: Potential injection pattern detected in ${field}.`;
  }

  // Key-specific length and pattern rules
  switch (field) {
    case 'googleClientSecret':
      if (trimmed.length < 10) {
        return 'Google Client Secret must be at least 10 characters long.';
      }
      break;
    case 'supabaseKey':
      if (trimmed.length < 40) {
        return 'Supabase Service Role Key must be at least 40 characters long.';
      }
      break;
    case 'resendApiKey': {
      const keys = trimmed.split(',').map(k => k.trim()).filter(Boolean);
      for (const k of keys) {
        if (k.length < 20) {
          return 'Each Resend API Key must be at least 20 characters long.';
        }
      }
      break;
    }
    case 'brevoApiKey': {
      const keys = trimmed.split(',').map(k => k.trim()).filter(Boolean);
      for (const k of keys) {
        if (k.length < 20) {
          return 'Each Brevo API Key must be at least 20 characters long.';
        }
      }
      break;
    }
    case 'sendgridApiKey': {
      const keys = trimmed.split(',').map(k => k.trim()).filter(Boolean);
      for (const k of keys) {
        if (k.length < 20) {
          return 'Each SendGrid API Key must be at least 20 characters long.';
        }
      }
      break;
    }
    case 'geminiApiKey': {
      const keys = trimmed.split(',').map(k => k.trim()).filter(Boolean);
      for (const k of keys) {
        if (k.length < 20) {
          return 'Each Gemini API Key must be at least 20 characters long.';
        }
      }
      break;
    }
    case 'googlePlacesApiKey':
      if (trimmed.length < 20) {
        return 'Google Places API Key must be at least 20 characters long.';
      }
      break;
    case 'jijiPassword':
      if (trimmed.length < 6) {
        return 'Jiji Password must be at least 6 characters long.';
      }
      break;
    case 'whatsappAccessToken':
    case 'evolutionApiKey':
    case 'whapiToken':
      if (trimmed.length < 10) {
        return `${field} must be at least 10 characters long.`;
      }
      break;
    case 'paystackSecretKey':
      if (trimmed.length < 20) {
        return 'Paystack Secret Key must be at least 20 characters long.';
      }
      break;
    case 'twilioAuthToken':
      if (trimmed.length < 20) {
        return 'Twilio Auth Token must be at least 20 characters long.';
      }
      break;
    case 'termiiApiKey':
      if (trimmed.length < 10) {
        return 'Termii API Key must be at least 10 characters long.';
      }
      break;
    case 'africastalkingApiKey':
      if (trimmed.length < 15) {
        return "Africa's Talking API Key must be at least 15 characters long.";
      }
      break;
    case 'proxyPool': {
      const proxies = trimmed.split(',').map(p => p.trim()).filter(Boolean);
      for (const p of proxies) {
        if (!p.startsWith('http://') && !p.startsWith('https://') && !p.startsWith('socks://') && !p.startsWith('socks5://')) {
          return 'Each proxy must start with a valid protocol (http://, https://, socks://, socks5://).';
        }
      }
      break;
    }
  }

  return null;
}

// Define the secret keys that should be masked/encrypted
export const SECRET_KEYS = [
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
  'twilioAuthToken',
  'geminiApiKeys',
  'claudeApiKey',
  'openaiApiKey',
  'antigravityApiKey',
  'interswitchAccount',
  'interswitchApiKey',
  'moniepointSecretKey',
  'opaySecretKey',
  'proxyPool'
];

export const MASK_VALUE = '••••••••';

/**
 * Mask secret values in config
 */
export function maskConfig(config: RuntimeConfig): any {
  const masked = { ...config } as any;
  for (const key of SECRET_KEYS) {
    if (masked[key]) {
      masked[key] = MASK_VALUE;
    }
  }
  return masked;
}
