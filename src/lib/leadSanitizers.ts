/**
 * src/lib/leadSanitizers.ts
 * 
 * 100% Pure Client & Server Safe Utilities (NO fs or path dependencies)
 * Bethelmind Digital Solutions · CAC Certified Nigerian Enterprise
 */

const UPPERCASE_ACRONYMS = new Set([
  'LTD', 'PLC', 'LLC', 'CAC', 'NGN', 'USA', 'UK', 'VIP', 'BOQ', 'DVA',
  'CEO', 'MD', 'IT', 'AI', 'SMS', 'POS', 'ATM', 'HMO', 'ICU', 'POP',
  'CCTV', 'LED', 'FCT', 'VI', 'GRA', 'HQ', 'JD', 'DJ', 'BBQ', 'BMW', 'TV', 'ID'
]);

const LOWERCASE_WORDS = new Set([
  'and', 'or', 'of', 'for', 'in', 'on', 'at', 'to', 'by', 'with', '&'
]);

function titleCaseWord(word: string): string {
  if (!word) return '';
  const cleanWord = word.replace(/[^a-zA-Z0-9&'-]/g, '');
  const upper = cleanWord.toUpperCase();

  if (UPPERCASE_ACRONYMS.has(upper)) {
    return word.replace(cleanWord, upper);
  }

  // Handle words starting with numbers like 1st, 2nd, 3rd
  const matchNum = word.match(/^(\d+)([a-zA-Z]+)(.*)$/);
  if (matchNum) {
    const num = matchNum[1];
    const letters = matchNum[2];
    const rest = matchNum[3] || '';
    return num + letters.charAt(0).toUpperCase() + letters.slice(1).toLowerCase() + rest;
  }

  // Handle hyphenated sub-words (e.g. ID-Tech, High-Power, Afro-Beat)
  if (word.includes('-')) {
    return word.split('-').map(part => titleCaseWord(part)).join('-');
  }

  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

export function toTitleCase(str: string): string {
  if (!str) return '';
  const words = str.split(/\s+/);
  return words.map((w, index) => {
    const cleanWord = w.replace(/[^a-zA-Z0-9&'-]/g, '');
    const lower = cleanWord.toLowerCase();
    if (index > 0 && LOWERCASE_WORDS.has(lower)) {
      return w.replace(cleanWord, lower);
    }
    return titleCaseWord(w);
  }).join(' ');
}

export function stripTrailingDangling(str: string): string {
  if (!str) return '';
  let cleaned = str.trim();
  let prev = '';
  do {
    prev = cleaned;
    cleaned = cleaned
      .replace(/\s*([&+\-\/,|]|and|or|of|the|in|at|for|co|corp|limited|ltd|plc)\s*$/i, '')
      .trim();
  } while (cleaned !== prev && cleaned.length > 2);
  return cleaned;
}

export function sanitizeDisplayName(rawName: string, category: string = 'Commercial Enterprise'): string {
  if (!rawName || typeof rawName !== 'string') {
    return 'Premier Lagos Enterprise';
  }

  const trimmed = rawName.trim();
  const stripped = trimmed.replace(/[\s\-_]/g, '').toLowerCase();

  // Comprehensive UUID / Hex / ID pattern detection:
  const isPureNumber = /^\+?\d[\d\s-]{7,}\d$/.test(trimmed) || /^\d+$/.test(trimmed);
  const isStandardUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(trimmed);
  const isSpacedUuid = /^[0-9a-f]{8}\s+[0-9a-f]{4}\s+[0-9a-f]{4}\s+[0-9a-f]{4}\s+[0-9a-f]{12}$/i.test(trimmed);
  const isPureHex32 = /^[0-9a-f]{32}$/i.test(stripped);
  const isLongHex = /^[0-9a-f]{16,}$/i.test(stripped);
  const isPrefixId = /^(lagos_det_|solar_det_|ibadan_det_|abuja_det_|lead_|sim_test_|mock_|test|sample|unknown|lead-|preview)/i.test(trimmed);
  const isHexGroupTokens = trimmed.split(/[\s\-_]+/).filter(w => /^[0-9a-fA-F]{4,8}$/.test(w)).length >= 2;
  const isSlugWithHyphens = /^[a-z0-9]+(-[a-z0-9]+){3,}$/i.test(trimmed);
  const isGenericValued = /^(valued business|valued enterprise|client company|commercial business|sample business|client business)$/i.test(trimmed);
  const isSyntheticNumbered = /^(commercial\s*sme|premium\s*lead|hub\s*#|trade\s*fair\s*hub|alaba\s*hub).*\d+/i.test(trimmed);

  const isInvalidName = isPureNumber || isStandardUuid || isSpacedUuid || isPureHex32 || isLongHex || isPrefixId || isHexGroupTokens || isSlugWithHyphens || isGenericValued || isSyntheticNumbered;

  if (isInvalidName) {
    const combinedContext = `${category} ${trimmed}`.toLowerCase();
    if (/dental|dentist|teeth|orthodont/i.test(combinedContext)) return 'Top Dental Specialists & Clinic';
    if (/clinic|medical|health|doctor|hospital|eye|optician|pharmacy|surgery/i.test(combinedContext)) return 'Lagos Specialist Medical & Diagnostic Centre';
    if (/salon|beauty|spa|hair|barber|nail|skincare/i.test(combinedContext)) return 'Luxury Lagos Beauty & Wellness Studio';
    if (/estate|property|realty|housing|developer|land|homes/i.test(combinedContext)) return 'Lagos Luxury Properties & Real Estate';
    if (/auto|car|motor|vehicle|tokunbo|dealership|mechanic/i.test(combinedContext)) return 'Premier Lagos Automotive Hub';
    if (/restaurant|dining|cafe|lounge|bistro|bar|grill|cater/i.test(combinedContext)) return 'Exclusive Lagos Dining & Bistro';
    if (/solar|inverter|energy|battery|power|clean energy/i.test(combinedContext)) return 'Apex Solar & Renewable Energy';
    if (/school|academy|education|creche|college|institute/i.test(combinedContext)) return 'Premier Lagos Academy & Education Centre';
    if (/law|legal|attorney|barrister|solicitor|cac|chamber/i.test(combinedContext)) return 'Apex Legal Practitioners & Corporate Chambers';
    if (/logistics|haulage|courier|dispatch|delivery|freight/i.test(combinedContext)) return 'Lagos Prime Logistics & Freight Solutions';
    if (/event|hall|banquet|decor|marquee|party/i.test(combinedContext)) return 'Majestic Lagos Event Centre & Banquets';
    if (/boutique|fashion|style|cloth|tailor|apparel/i.test(combinedContext)) return 'Haute Couture & Luxury Fashion House';
    return 'Premier Lagos Commercial Enterprise';
  }

  let cleaned = trimmed;

  // 1. Delimiter splits
  if (cleaned.includes('||')) cleaned = cleaned.split('||')[0].trim();
  if (cleaned.includes(' | ')) cleaned = cleaned.split(' | ')[0].trim();

  // 2. Contact / Brand slash
  if (cleaned.includes('/')) {
    const parts = cleaned.split('/');
    const brand = parts[parts.length - 1].trim();
    if (brand.length >= 3) {
      cleaned = brand;
    } else {
      cleaned = parts[0].trim();
    }
  }

  // 3. Strip directory noise
  cleaned = cleaned
    .replace(/—\s*staff profile.*$/i, '')
    .replace(/-\s*staff profile.*$/i, '')
    .replace(/—\s*profile.*$/i, '')
    .replace(/\s*-\s*official\s*page.*$/i, '')
    .replace(/\s*-\s*lagos\s*nigeria.*$/i, '')
    .replace(/\s*-\s*scaling\s*&.*$/i, '');

  // 4. Strip parenthesized or bracketed descriptions
  cleaned = cleaned
    .replace(/\(.*?\)/g, '')
    .replace(/\[.*?\]/g, '')
    .replace(/\{.*?\}/g, '')
    .trim();

  // 5. Title Case if predominantly uppercase
  const letters = cleaned.replace(/[^a-zA-Z]/g, '');
  const upperCount = (letters.match(/[A-Z]/g) || []).length;
  if (letters.length > 3 && (upperCount / letters.length) > 0.55) {
    cleaned = toTitleCase(cleaned);
  }

  // 6. Fix common directory typos
  cleaned = cleaned.replace(/\bSp\b$/i, 'Spa');

  // 7. Strip listing fluff
  cleaned = cleaned.replace(/^(brand\s*new|clean\s*used|tokunbo|furnished|functional|standard)\s+/i, '');

  // 8. Strip personal salutations
  cleaned = cleaned.replace(/^(mr|mrs|miss|dr|engr|barrister|pastor|alhadji|alhaji)\.?\s+/i, '');

  // 9. Strip dangling trailing characters
  cleaned = stripTrailingDangling(cleaned);

  return cleaned || 'Premier Lagos Enterprise';
}

export function sanitizeCopyText(text: string, safeName: string): string {
  if (!text || typeof text !== 'string') return text || '';
  return text
    .replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, safeName)
    .replace(/[0-9a-fA-F]{8}\s+[0-9a-fA-F]{4}\s+[0-9a-fA-F]{4}\s+[0-9a-fA-F]{4}\s+[0-9a-fA-F]{12}/g, safeName)
    .replace(/[0-9a-fA-F]{16,}/g, safeName)
    .replace(/\bVALUED BUSINESS\b/gi, safeName)
    .replace(/\bCLIENT BUSINESS\b/gi, safeName)
    .replace(/\bVALUED ENTERPRISE\b/gi, safeName);
}

export function cleanWebsiteDomain(rawUrl: string): string {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  const trimmed = rawUrl.trim();
  if (/bing\.com\/ck\/|google\.com\/url|yahoo\.com\/|duckduckgo\.com\/|facebook\.com\/l\.php/i.test(trimmed)) {
    return '';
  }
  return trimmed
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .replace(/\/+$/, '')
    .split('/')[0]
    .split('?')[0];
}

export function formatStagingDomain(businessName: string): string {
  if (!businessName || typeof businessName !== 'string') {
    return 'https://www.lagosenterprise.com.ng';
  }
  const clean = businessName.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (clean.length < 3 || /^[0-9a-f]{16,}$/.test(clean)) {
    return 'https://www.lagosenterprise.com.ng';
  }
  return `https://www.${clean.slice(0, 30)}.com.ng`;
}
