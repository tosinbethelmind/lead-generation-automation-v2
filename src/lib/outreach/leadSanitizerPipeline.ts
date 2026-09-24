/**
 * @file src/lib/outreach/leadSanitizerPipeline.ts
 * 
 * High-Performance Zero-Tolerance Lead Sanitizer & Pre-Flight Validator
 * Bethelmind Analytics Commercial Growth Engine
 * 
 * Enforces:
 * 1. 100% Genuine Nigerian Mobile Number Carrier Prefix Validation (MTN, Airtel, Glo, 9mobile).
 * 2. Strict rejection of sequential runs, repeating quad digits, and placeholder numbers.
 * 3. Zero Raw UUID or synthetic template name leaks.
 * 4. Email format & disposable/placeholder domain sanitization.
 * 5. Deterministic compliance scoring before lead staging or outreach dispatch.
 */

export interface SanitizedLead {
  rawId: string;
  leadId: string;
  businessName: string;
  cleanPhone: string;
  phoneE164: string;
  carrier: 'MTN' | 'AIRTEL' | 'GLO' | '9MOBILE' | 'UNKNOWN';
  email?: string;
  area: string;
  category: string;
  isValid: boolean;
  rejectReason?: string;
  confidenceScore: number;
}

export interface SanitizationBatchResult {
  totalProcessed: number;
  validCount: number;
  rejectedCount: number;
  carrierBreakdown: Record<string, number>;
  sanitizedLeads: SanitizedLead[];
  rejectionSummary: Record<string, number>;
}

// Genuine Nigerian Carrier Mobile Prefixes (11-digit local format without initial 0, or with 0)
const NIGERIAN_CARRIER_PREFIXES: Record<string, 'MTN' | 'AIRTEL' | 'GLO' | '9MOBILE'> = {
  // MTN Nigeria
  '0803': 'MTN', '0806': 'MTN', '0703': 'MTN', '0706': 'MTN',
  '0813': 'MTN', '0814': 'MTN', '0816': 'MTN', '0903': 'MTN',
  '0906': 'MTN', '0913': 'MTN', '0916': 'MTN', '07025': 'MTN',
  '07026': 'MTN', '0704': 'MTN',

  // Airtel Nigeria
  '0802': 'AIRTEL', '0808': 'AIRTEL', '0708': 'AIRTEL', '0812': 'AIRTEL',
  '0701': 'AIRTEL', '0902': 'AIRTEL', '0907': 'AIRTEL', '0901': 'AIRTEL',
  '0904': 'AIRTEL', '0912': 'AIRTEL',

  // Globacom (Glo)
  '0805': 'GLO', '0807': 'GLO', '0705': 'GLO', '0815': 'GLO',
  '0811': 'GLO', '0905': 'GLO', '0915': 'GLO',

  // 9mobile (formerly Etisalat)
  '0809': '9MOBILE', '0817': '9MOBILE', '0818': '9MOBILE',
  '0908': '9MOBILE', '0909': '9MOBILE'
};

const BANNED_EMAIL_DOMAINS = [
  'example.com', 'test.com', 'testlead.com', 'placeholder.com',
  'tempmail.com', 'mailinator.com', 'guerrillamail.com', 'yopmail.com',
  'premiumsalon.com', 'sample.com'
];

/**
 * Validates and formats Nigerian mobile numbers
 */
export function validateAndFormatNigerianPhone(phoneRaw: string | undefined | null): {
  isValid: boolean;
  cleanLocal?: string;
  phoneE164?: string;
  carrier?: 'MTN' | 'AIRTEL' | 'GLO' | '9MOBILE' | 'UNKNOWN';
  reason?: string;
} {
  if (!phoneRaw) {
    return { isValid: false, reason: 'Empty phone number' };
  }

  const digits = String(phoneRaw).replace(/\D/g, '');

  if (digits.length < 10 || digits.length > 14) {
    return { isValid: false, reason: `Invalid digit length (${digits.length})` };
  }

  // Reject sequential zeros / placeholder numbers
  if (digits.includes('0000') || digits.includes('0001') || digits.includes('0002') || digits.includes('00000')) {
    return { isValid: false, reason: 'Sequential zeros or placeholder number' };
  }

  // Reject repeating quad digits (e.g. 1111, 2222, 8888)
  if (/(\d)\1{3,}/.test(digits)) {
    return { isValid: false, reason: 'Repeating quad digit sequence' };
  }

  // Reject sequential run patterns
  if (/01234|12345|23456|34567|45678|56789|98765|87654|76543|65432|54321|43210/.test(digits)) {
    return { isValid: false, reason: 'Sequential number pattern' };
  }

  // Standardize to 11-digit local (e.g. 08022791227) & 13-digit E.164 (e.g. +2348022791227)
  let local11 = digits;
  if (digits.startsWith('234') && digits.length === 13) {
    local11 = '0' + digits.substring(3);
  } else if (digits.startsWith('234') && digits.length === 14) {
    local11 = '0' + digits.substring(3);
  } else if (!digits.startsWith('0') && digits.length === 10) {
    local11 = '0' + digits;
  }

  if (local11.length !== 11 || !local11.startsWith('0')) {
    return { isValid: false, reason: `Malformed Nigerian local format (${local11})` };
  }

  // Detect Carrier
  let carrier: 'MTN' | 'AIRTEL' | 'GLO' | '9MOBILE' | 'UNKNOWN' = 'UNKNOWN';
  const prefix5 = local11.substring(0, 5);
  const prefix4 = local11.substring(0, 4);

  if (NIGERIAN_CARRIER_PREFIXES[prefix5]) {
    carrier = NIGERIAN_CARRIER_PREFIXES[prefix5];
  } else if (NIGERIAN_CARRIER_PREFIXES[prefix4]) {
    carrier = NIGERIAN_CARRIER_PREFIXES[prefix4];
  } else {
    return { isValid: false, reason: `Unrecognized Nigerian mobile prefix (${prefix4})` };
  }

  const phoneE164 = `+234${local11.substring(1)}`;

  return {
    isValid: true,
    cleanLocal: local11,
    phoneE164,
    carrier
  };
}

/**
 * Sanitizes business name by removing raw UUIDs, template placeholders, and system labels
 */
export function sanitizeBusinessName(rawName: string | undefined | null, fallbackCategory = 'Commercial Enterprise'): {
  cleanName: string;
  isValid: boolean;
  reason?: string;
} {
  if (!rawName || typeof rawName !== 'string') {
    return { cleanName: fallbackCategory, isValid: false, reason: 'Empty business name' };
  }

  let name = rawName.trim();

  // Check for raw UUID leaks (e.g. 550e8400-e29b-41d4-a716-446655440000 or 32-hex)
  if (/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/.test(name)) {
    return { cleanName: fallbackCategory, isValid: false, reason: 'Raw UUID leaked into business name' };
  }

  if (/\b[0-9a-fA-F]{24,32}\b/.test(name)) {
    return { cleanName: fallbackCategory, isValid: false, reason: 'Hex hash string in business name' };
  }

  // Strip common synthetic template prefixes
  name = name
    .replace(/^RESERVED FOR\s+/i, '')
    .replace(/^PREVIEW FOR\s+/i, '')
    .replace(/^Lead\s+[0-9a-fA-F-]+/i, '')
    .replace(/^mock_/i, '')
    .replace(/^synthetic_/i, '')
    .trim();

  if (name.length < 2) {
    return { cleanName: fallbackCategory, isValid: false, reason: 'Business name too short after sanitization' };
  }

  return { cleanName: name, isValid: true };
}

/**
 * Sanitizes email address and rejects disposable/placeholder domains
 */
export function sanitizeBusinessEmail(emailRaw: string | undefined | null): {
  isValid: boolean;
  cleanEmail?: string;
  reason?: string;
} {
  if (!emailRaw) return { isValid: false, reason: 'No email provided' };

  const email = String(emailRaw).trim().toLowerCase();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(email)) {
    return { isValid: false, reason: 'Malformed email syntax' };
  }

  const domain = email.split('@')[1];
  if (BANNED_EMAIL_DOMAINS.some(b => domain === b || domain.endsWith(`.${b}`))) {
    return { isValid: false, reason: `Prohibited test/disposable domain (@${domain})` };
  }

  return { isValid: true, cleanEmail: email };
}

/**
 * Executes high-speed batch sanitization pipeline across a collection of leads
 */
export function sanitizeLeadBatch(leads: any[]): SanitizationBatchResult {
  const sanitizedLeads: SanitizedLead[] = [];
  const carrierBreakdown: Record<string, number> = { MTN: 0, AIRTEL: 0, GLO: 0, '9MOBILE': 0, UNKNOWN: 0 };
  const rejectionSummary: Record<string, number> = {};

  let validCount = 0;
  let rejectedCount = 0;

  for (const item of leads) {
    const rawId = item.id || item.lead_id || `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const phoneCheck = validateAndFormatNigerianPhone(item.phone || item.phone_e164 || item.phone_raw || item.telephone);
    const nameCheck = sanitizeBusinessName(item.name || item.business_name || item.title, item.category);
    const emailCheck = sanitizeBusinessEmail(item.email);

    if (!phoneCheck.isValid || !nameCheck.isValid) {
      const reason = phoneCheck.reason || nameCheck.reason || 'Validation failure';
      rejectionSummary[reason] = (rejectionSummary[reason] || 0) + 1;
      rejectedCount++;

      sanitizedLeads.push({
        rawId,
        leadId: rawId,
        businessName: nameCheck.cleanName,
        cleanPhone: phoneCheck.cleanLocal || '',
        phoneE164: phoneCheck.phoneE164 || '',
        carrier: phoneCheck.carrier || 'UNKNOWN',
        email: emailCheck.isValid ? emailCheck.cleanEmail : undefined,
        area: item.area || item.location || 'Lagos',
        category: item.category || 'Commercial',
        isValid: false,
        rejectReason: reason,
        confidenceScore: 0
      });
      continue;
    }

    const carrier = phoneCheck.carrier || 'UNKNOWN';
    carrierBreakdown[carrier] = (carrierBreakdown[carrier] || 0) + 1;
    validCount++;

    // Calculate quality confidence score
    let score = 70; // Base score for genuine Nigerian phone + valid business name
    if (emailCheck.isValid) score += 20; // Verified business email
    if (item.address || item.area) score += 10; // Verified commercial location

    sanitizedLeads.push({
      rawId,
      leadId: rawId,
      businessName: nameCheck.cleanName,
      cleanPhone: phoneCheck.cleanLocal!,
      phoneE164: phoneCheck.phoneE164!,
      carrier,
      email: emailCheck.isValid ? emailCheck.cleanEmail : undefined,
      area: item.area || item.location || 'Lagos',
      category: item.category || 'Commercial',
      isValid: true,
      confidenceScore: score
    });
  }

  return {
    totalProcessed: leads.length,
    validCount,
    rejectedCount,
    carrierBreakdown,
    sanitizedLeads,
    rejectionSummary
  };
}
