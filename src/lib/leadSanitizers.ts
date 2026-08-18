/**
 * src/lib/leadSanitizers.ts
 * 
 * 100% Pure Client & Server Safe Utilities (NO fs or path dependencies)
 */

export function sanitizeDisplayName(rawName: string, category: string = 'Commercial Enterprise'): string {
  if (!rawName || typeof rawName !== 'string') {
    return 'Premier Lagos Enterprise';
  }

  const trimmed = rawName.trim();
  const stripped = trimmed.replace(/[\s\-_]/g, '').toLowerCase();

  // Comprehensive UUID / Hex / ID pattern detection:
  // - Standard UUID (8-4-4-4-12 hex format, regardless of hyphens or spaces)
  // - 16+ character continuous hex string
  // - Multiple hex groups (e.g. 5B99F7D1 F894 4902 AA24 E2276613E5A4)
  // - Technical prefix IDs (lagos_det_, solar_det_, ibadan_det_, lead_, sim_test_, mock_)
  const isStandardUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(trimmed);
  const isSpacedUuid = /^[0-9a-f]{8}\s+[0-9a-f]{4}\s+[0-9a-f]{4}\s+[0-9a-f]{4}\s+[0-9a-f]{12}$/i.test(trimmed);
  const isPureHex32 = /^[0-9a-f]{32}$/i.test(stripped);
  const isLongHex = /^[0-9a-f]{16,}$/i.test(stripped);
  const isPrefixId = /^(lagos_det_|solar_det_|ibadan_det_|lead_|sim_test_|mock_|test|sample|unknown|lead-|preview)/i.test(trimmed);
  const isHexGroupTokens = trimmed.split(/[\s\-_]+/).filter(w => /^[0-9a-fA-F]{4,8}$/.test(w)).length >= 2;
  const isSlugWithHyphens = /^[a-z0-9]+(-[a-z0-9]+){3,}$/i.test(trimmed);
  const isGenericValued = /^(valued business|valued enterprise|client company|commercial business|sample business|client business)$/i.test(trimmed);

  const isInvalidName = isStandardUuid || isSpacedUuid || isPureHex32 || isLongHex || isPrefixId || isHexGroupTokens || isSlugWithHyphens || isGenericValued;


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

  // Remove any remaining trailing technical noise
  return trimmed
    .replace(/\s*\|\|\s*dental clinic in.*/i, '')
    .replace(/\s*\|\s*dental clinic in.*/i, '')
    .replace(/\s*-\s*scaling\s*&.*/i, '')
    .trim();
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
