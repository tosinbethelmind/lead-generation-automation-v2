/**
 * @file scripts/lib/nameSanitizer.js
 * 
 * 🛡️ PRODUCTION NIGERIAN BUSINESS NAME SANITIZER & TITLE-CASER
 * Bethelmind Digital Solutions · CAC Certified Nigerian Enterprise
 * 
 * Solves:
 * 1. Directory garbage (Staff Profile, slashes, parenthesized locations).
 * 2. Hyphen preservation (E-Commerce, Afro-Beat, ID-Tech, High-Power).
 * 3. ALL-CAPS normalization into clean natural Title Case.
 * 4. Word-boundary truncation (NEVER chop words mid-spelling).
 * 5. Trailing dangling conjunctions (&, and, of, the, in, at, co).
 * 6. Scraper ID / UUID / Phone number detection -> fallback to natural brand.
 */

// Acronyms to keep uppercase in Nigerian business names
const UPPERCASE_ACRONYMS = new Set([
  'LTD', 'PLC', 'LLC', 'CAC', 'NGN', 'USA', 'UK', 'VIP', 'BOQ', 'DVA',
  'CEO', 'MD', 'IT', 'AI', 'SMS', 'POS', 'ATM', 'HMO', 'ICU', 'POP',
  'CCTV', 'LED', 'FCT', 'VI', 'GRA', 'HQ', 'JD', 'DJ', 'BBQ', 'BMW', 'TV', 'ID'
]);

// Small words to keep lowercase unless at start of name
const LOWERCASE_WORDS = new Set([
  'and', 'or', 'of', 'for', 'in', 'on', 'at', 'to', 'by', 'with', '&'
]);

/**
 * Checks if a string is a phone number, scraper ID, UUID, or synthetic junk
 */
function isGarbageOrId(name) {
  if (!name || typeof name !== 'string') return true;
  const s = name.trim();
  if (s.length < 2) return true;

  // Pure numbers or phone numbers (e.g. 08022791227, 2348022791227, 2489771085)
  if (/^\+?\d[\d\s-]{7,}\d$/.test(s)) return true;
  if (/^\d+$/.test(s)) return true;

  // UUIDs or long hex strings
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s)) return true;
  if (/^[0-9a-f]{16,}$/i.test(s.replace(/[\s-_]/g, ''))) return true;

  // Technical scraper prefix IDs
  if (/^(lagos_det_|solar_det_|ibadan_det_|abuja_det_|lead_|sim_test_|mock_|test_|sample_|preview_|hub_#)/i.test(s)) return true;

  // Generic dummy text
  if (/^(valued business|valued enterprise|client company|commercial business|sample business|test lead|unknown)/i.test(s)) return true;

  return false;
}

/**
 * Converts a word to Title Case
 */
function titleCaseWord(word) {
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

/**
 * Converts a string to Title Case while respecting acronyms and minor words
 */
function toTitleCase(str) {
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

/**
 * Strips dangling trailing characters (&, and, of, in, -, etc.)
 */
function stripTrailingDangling(str) {
  if (!str) return '';
  let cleaned = str.trim();
  let prev;
  do {
    prev = cleaned;
    cleaned = cleaned
      .replace(/\s*([&+\-\/,|]|and|or|of|the|in|at|for|co|corp|limited|ltd|plc)\s*$/i, '')
      .trim();
  } while (cleaned !== prev && cleaned.length > 2);
  return cleaned;
}

/**
 * Clean and normalize full business name
 */
function cleanBusinessName(rawName, fallback = 'Commercial Business') {
  if (isGarbageOrId(rawName)) return fallback;

  let cleaned = String(rawName).trim();

  // 1. Remove delimiter splits: take primary brand
  if (cleaned.includes('||')) cleaned = cleaned.split('||')[0].trim();
  if (cleaned.includes(' | ')) cleaned = cleaned.split(' | ')[0].trim();
  if (cleaned.includes(' :: ')) cleaned = cleaned.split(' :: ')[0].trim();

  // 2. Personal contact slash brand e.g. "LAWAL DEBORAH / 1STLADY SKINCARE & SP"
  if (cleaned.includes('/')) {
    const parts = cleaned.split('/');
    const brand = parts[parts.length - 1].trim();
    if (brand.length >= 3 && !isGarbageOrId(brand)) {
      cleaned = brand;
    } else {
      cleaned = parts[0].trim();
    }
  }

  // 3. Strip directory noise & academic staff profile markers
  cleaned = cleaned
    .replace(/—\s*staff profile.*$/i, '')
    .replace(/-\s*staff profile.*$/i, '')
    .replace(/—\s*profile.*$/i, '')
    .replace(/\s*-\s*official\s*page.*$/i, '')
    .replace(/\s*-\s*lagos\s*nigeria.*$/i, '')
    .replace(/\s*-\s*scaling\s*&.*$/i, '');

  // 4. Strip parenthesized or bracketed descriptions e.g. "(Lekki Branch)", "[Best in Lagos]"
  cleaned = cleaned
    .replace(/\(.*?\)/g, '')
    .replace(/\[.*?\]/g, '')
    .replace(/\{.*?\}/g, '')
    .trim();

  // 5. Detect if predominantly uppercase (more than 50% uppercase letters)
  const letters = cleaned.replace(/[^a-zA-Z]/g, '');
  const upperCount = (letters.match(/[A-Z]/g) || []).length;
  const isPredominantlyUpper = letters.length > 3 && (upperCount / letters.length) > 0.55;

  if (isPredominantlyUpper) {
    cleaned = toTitleCase(cleaned);
  }

  // 6. Fix common directory typos (e.g. "Sp" at the end of "Skincare & Sp" -> "Spa")
  cleaned = cleaned.replace(/\bSp\b$/i, 'Spa');

  // 7. Strip common scraper listing fluff prefixes
  cleaned = cleaned.replace(/^(brand\s*new|clean\s*used|tokunbo|furnished|functional|standard)\s+/i, '');

  // 8. Strip personal salutations if followed by name
  cleaned = cleaned.replace(/^(mr|mrs|miss|dr|engr|barrister|pastor|alhadji|alhaji)\.?\s+/i, '');

  // 9. Strip dangling trailing characters
  cleaned = stripTrailingDangling(cleaned);

  // 10. Fallback check
  if (!cleaned || cleaned.length < 2 || isGarbageOrId(cleaned)) {
    return fallback;
  }

  return cleaned;
}

/**
 * Gets a clean, punchy brand name for SMS (<= 18 chars)
 * CRITICAL RULE: NEVER chop words mid-spelling! Cut only at word boundaries!
 * Preserves sector nouns (Hotels, Solar, Salon, Auto, Clinic, etc.)
 */
function getShortBrand(rawName, maxLen = 18) {
  const full = cleanBusinessName(rawName, 'Your Team');
  if (full.length <= maxLen) return full;

  const words = full.split(/\s+/);
  if (words.length === 1) {
    return full.slice(0, maxLen).trim();
  }

  let candidate = words[0];
  for (let i = 1; i < words.length; i++) {
    const next = candidate + ' ' + words[i];
    if (next.length <= maxLen) {
      candidate = next;
    } else {
      break;
    }
  }

  candidate = stripTrailingDangling(candidate);
  return candidate || words[0].slice(0, maxLen).trim();
}

module.exports = {
  isGarbageOrId,
  toTitleCase,
  stripTrailingDangling,
  cleanBusinessName,
  getShortBrand
};
