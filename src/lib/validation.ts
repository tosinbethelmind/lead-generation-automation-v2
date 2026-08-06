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
    case 'antigravityApiKey': {
      const keys = trimmed.split(',').map(k => k.trim()).filter(Boolean);
      for (const k of keys) {
        if (k.length < 20) {
          return 'Each Antigravity API Key must be at least 20 characters long.';
        }
      }
      break;
    }
    case 'antigravityApiKeys': {
      const keys = trimmed.split(',').map(k => k.trim()).filter(Boolean);
      for (const k of keys) {
        if (k.length < 20) {
          return 'Each Antigravity API Key in the array must be at least 20 characters long.';
        }
      }
      break;
    }
    case 'jijiCookies':
      if (trimmed.length < 10) {
        return 'Jiji Cookies must be a valid serialized JSON cookie string of at least 10 characters.';
      }
      break;
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
    case 'browserlessApiKey':
      if (trimmed.length < 5) {
        return 'Browserless API Key must be at least 5 characters long.';
      }
      break;
    case 'browserbaseApiKey':
      if (trimmed.length < 5) {
        return 'Browserbase API Key must be at least 5 characters long.';
      }
      break;
    case 'webshareProxy':
      if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('socks://') && !trimmed.startsWith('socks5://')) {
        return 'Each Webshare proxy must start with a valid protocol (http://, https://, socks://, socks5://).';
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

/**
 * Detects whether an error message is a Cloudflare 522 HTML page, network timeout, or connection failure.
 */
export function isHtmlOrTimeoutError(msg: any): boolean {
  if (!msg) return false;
  const str = typeof msg === 'string' ? msg : String(msg.message || msg);
  const lower = str.toLowerCase();

  // Detect HTML tags or HTML entity syntax
  const hasHtmlSyntax = (
    lower.includes('<!doctype') ||
    lower.includes('<html') ||
    lower.includes('<body') ||
    lower.includes('<div') ||
    lower.includes('<span') ||
    lower.includes('<p') ||
    lower.includes('<a ') ||
    lower.includes('class=') ||
    lower.includes('href=') ||
    lower.includes('&lt;') ||
    lower.includes('&gt;') ||
    lower.includes('bg-center') ||
    lower.includes('leading-1.3') ||
    lower.includes('font-light')
  );

  // Detect Cloudflare / Network timeout / DNS errors
  const hasNetworkError = (
    lower.includes('522') ||
    lower.includes('504') ||
    lower.includes('502') ||
    lower.includes('timed out') ||
    lower.includes('timeout') ||
    lower.includes('cloudflare') ||
    lower.includes('cf-') ||
    lower.includes('origin server') ||
    lower.includes('what happened?') ||
    lower.includes('what can i do?') ||
    lower.includes('connection error') ||
    lower.includes('fetch failed') ||
    lower.includes('econnreset') ||
    lower.includes('etimedout') ||
    lower.includes('enotfound') ||
    lower.includes('getaddrinfo') ||
    lower.includes('supabase.co')
  );

  return hasHtmlSyntax || hasNetworkError;
}

/**
 * Sanitizes raw HTML, Cloudflare 522 errors, or network timeouts into a clean, human-readable string.
 */
export function cleanErrorMessage(err: any): string {
  if (!err) return '';
  const str = typeof err === 'string' ? err : String(err.message || err);
  if (isHtmlOrTimeoutError(str)) {
    return 'Cloud database connection timed out (Cloudflare 522 / Unreachable). Self-healing Local JSON DB is active.';
  }
  const stripped = str
    .replace(/<!--[\s\S]*?-->/g, '')  // remove HTML comments
    .replace(/<[^>]+>/g, '')          // remove HTML tags
    .replace(/&lt;[^&]+&gt;/g, '')    // remove escaped HTML tags
    .replace(/&[a-z0-9#]+;/gi, ' ')   // remove HTML entities
    .replace(/\s+/g, ' ')             // collapse newlines & spaces
    .trim();

  if (stripped.length > 150 || stripped.includes('class=') || stripped.includes('http')) {
    return 'Cloud database connection issue detected. Self-healing Local JSON DB is active.';
  }

  return stripped;
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
  'antigravityApiKeys',
  'jijiCookies',
  'interswitchAccount',
  'interswitchApiKey',
  'moniepointSecretKey',
  'opaySecretKey',
  'proxyPool',
  'browserlessApiKey',
  'browserlessApiKeys',
  'browserbaseApiKey',
  'browserbaseApiKeys',
  'webshareProxies',
  'torProxyUrl',
  'torControlUrl'
];

export const MASK_VALUE = '••••••••';

/**
 * Mask secret values in config
 */
export function maskConfig(config: RuntimeConfig): any {
  const masked = { ...config } as any;
  for (const key of SECRET_KEYS) {
    if (masked[key]) {
      if (Array.isArray(masked[key])) {
        masked[key] = masked[key].map(() => MASK_VALUE);
      } else {
        masked[key] = MASK_VALUE;
      }
    }
  }
  return masked;
}

/**
 * Strips dangerous HTML tags and script injection from input strings.
 */
export function sanitizeInputString(input: any): string {
  if (input === null || input === undefined) return '';
  const str = String(input);
  return str
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .trim();
}

/**
 * Safely parses JSON string with fallback default value without throwing exceptions.
 */
export function safeJsonParse<T>(jsonStr: any, fallback: T): T {
  if (!jsonStr) return fallback;
  if (typeof jsonStr === 'object') return jsonStr as T;
  try {
    return JSON.parse(jsonStr) as T;
  } catch (_) {
    return fallback;
  }
}


