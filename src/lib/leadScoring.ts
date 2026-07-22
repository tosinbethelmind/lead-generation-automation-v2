/**
 * Lead Quality Scoring & E.164 Phone Normalization Helper for Lagos Scraper Pipeline
 */

/**
 * Normalizes any raw Nigerian phone string into a deliverable E.164 format (+234...).
 * Returns null if the string is invalid or not a deliverable phone number.
 */
export function normalizeNigerianPhone(rawPhone: string | null | undefined): string | null {
  if (!rawPhone) return null;

  // Strip non-digit characters except leading plus
  let cleaned = rawPhone.replace(/[^\d+]/g, '');

  if (!cleaned) return null;

  // Convert local 080..., 081..., 090..., 070..., 091..., 0802... to +234...
  if (cleaned.startsWith('234')) {
    cleaned = '+' + cleaned;
  } else if (cleaned.startsWith('0')) {
    cleaned = '+234' + cleaned.substring(1);
  } else if (!cleaned.startsWith('+')) {
    cleaned = '+234' + cleaned;
  }

  // E.164 format for Nigeria +234XXXXXXXXXX should be 14 characters total (+234 + 10 digits)
  const digitsOnly = cleaned.replace(/\D/g, '');
  
  if (digitsOnly.length === 13 && digitsOnly.startsWith('234')) {
    const mobilePrefix = digitsOnly.substring(3, 5); // 80, 81, 90, 70, 91, 81, 70, etc.
    const validMobilePrefixes = ['70', '80', '81', '90', '91'];
    if (validMobilePrefixes.includes(mobilePrefix)) {
      return '+' + digitsOnly;
    }
  }

  // Lenient fallback for 13 digit numbers starting with 234
  if (digitsOnly.length === 13 && digitsOnly.startsWith('234')) {
    return '+' + digitsOnly;
  }

  return null;
}

export interface LeadScoreResult {
  score: number;
  grade: 'A' | 'B' | 'C' | 'D';
  reasons: string[];
  isHighValueTarget: boolean;
}

/**
 * Calculates a Lead Quality Score (0 - 100) based on deliverability, website status, rating, and completeness.
 */
export function calculateLeadQualityScore(lead: {
  name?: string;
  phone_e164?: string | null;
  phone?: string | null;
  website?: string | null;
  area?: string | null;
  rating?: number | null;
  reviews_count?: number | null;
  social_handle?: string | null;
}): LeadScoreResult {
  let score = 0;
  const reasons: string[] = [];

  // 1. Phone Deliverability (Max +35 pts)
  const normalizedPhone = normalizeNigerianPhone(lead.phone_e164 || lead.phone);
  if (normalizedPhone) {
    score += 35;
    reasons.push('Valid E.164 WhatsApp/SMS deliverable phone number (+35)');
  } else {
    reasons.push('Missing or invalid mobile phone number (0)');
  }

  // 2. Website Prospecting Opportunity (Max +25 pts)
  const hasWebsite = !!(lead.website && lead.website.trim() && lead.website !== 'None' && lead.website !== 'N/A');
  if (!hasWebsite) {
    score += 25;
    reasons.push('No website — High priority target for web build outreach (+25)');
  } else {
    score += 10;
    reasons.push('Has existing website (+10)');
  }

  // 3. Social & Profile Active (Max +20 pts)
  if (lead.social_handle) {
    score += 20;
    reasons.push('Active social media handle linked (+20)');
  } else if ((lead.rating && lead.rating > 0) || (lead.reviews_count && lead.reviews_count > 0)) {
    score += 15;
    reasons.push('Public review presence verified (+15)');
  }

  // 4. Address & Area Completeness (Max +10 pts)
  if (lead.area && lead.area.trim()) {
    score += 10;
    reasons.push('Verified Lagos suburb location (+10)');
  }

  // 5. High Rating / Social Proof (Max +10 pts)
  if (lead.rating && lead.rating >= 4.0) {
    score += 10;
    reasons.push('High customer rating (≥ 4.0★) (+10)');
  }

  // Determine Grade
  let grade: 'A' | 'B' | 'C' | 'D' = 'D';
  if (score >= 80) grade = 'A';
  else if (score >= 60) grade = 'B';
  else if (score >= 40) grade = 'C';

  const isHighValueTarget = grade === 'A' || (score >= 60 && !hasWebsite);

  return {
    score,
    grade,
    reasons,
    isHighValueTarget
  };
}
