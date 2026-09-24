/**
 * @file scripts/lib/identity_fingerprint.js
 * 
 * 🔍 Digital Identity & Corporate Footprint Discovery Engine
 * Inspired by Fingerprint.to OSINT lookup patterns:
 * - Extracts executive names and handles from corporate emails
 * - Generates targeted search vectors for LinkedIn, Instagram SME, CAC Registry, and Google Maps
 * - Enriches raw business leads with executive decision-maker footprints
 */

function extractExecutiveNameFromEmail(email) {
  if (!email || !email.includes('@')) return null;
  const localPart = email.split('@')[0].toLowerCase();
  
  // Filter out generic inboxes
  const generic = ['info', 'contact', 'admin', 'support', 'sales', 'hello', 'enquiries', 'office', 'help'];
  if (generic.includes(localPart)) return null;

  // Detect firstname.lastname or firstname_lastname
  const parts = localPart.split(/[._-]/).filter(p => p.length > 2 && !/\d/.test(p));
  if (parts.length > 0) {
    return parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
  }
  return null;
}

function generateEntitySearchVectors(businessName, email, area = 'Lagos') {
  const cleanName = (businessName || '').trim();
  const encodedName = encodeURIComponent(cleanName);
  const locationTag = encodeURIComponent(`${cleanName} ${area} Nigeria`);

  const executive = extractExecutiveNameFromEmail(email);

  return {
    businessName: cleanName,
    detectedExecutive: executive || 'Managing Director / Principal',
    corporateFootprint: {
      cacRegistryQuery: `https://search.cac.gov.ng/list?search=${encodedName}`,
      googleMapsQuery: `https://www.google.com/maps/search/?api=1&query=${locationTag}`,
      linkedInCompanySearch: `https://www.linkedin.com/search/results/companies/?keywords=${encodedName}`,
      instagramBusinessQuery: `https://www.google.com/search?q=site:instagram.com+${encodedName}+lagos`
    }
  };
}

module.exports = {
  extractExecutiveNameFromEmail,
  generateEntitySearchVectors
};
