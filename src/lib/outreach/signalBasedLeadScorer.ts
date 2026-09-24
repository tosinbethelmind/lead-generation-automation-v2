/**
 * @file src/lib/outreach/signalBasedLeadScorer.ts
 * 
 * 2026 SIGNAL-BASED INTENT CLASSIFIER & PRODUCT MATCHER
 * 
 * Ranks prospects by real commercial triggers and pairs them with all tools, digital products,
 * paywalls, and DFY features for sale.
 * 
 * NOTE: Crypto & FX Arbitrage is strictly maintained in its own dedicated standalone engine
 * (cryptoThreeHourBriefingEngine.ts / zeroMarginRiskGuard.ts).
 */

export interface LeadProspect {
  leadId: string;
  name: string;
  category: string;
  area?: string;
  city?: string;
  phone?: string;
  email?: string;
  rating?: number;
  reviewCount?: number;
  hasWebsite?: boolean;
  isGmbUnclaimed?: boolean;
  domainExpired?: boolean;
  monthlyTraffic?: number;
}

export interface MatchedCommercialOffer {
  leadId: string;
  businessName: string;
  intentSignal: string;
  score: number;
  recommendedProduct: string;
  productCategory: string;
  priceNGN: number;
  actionUrl: string;
  personalizedHook: string;
}

export const COMMERCIAL_PRODUCTS_CATALOG = {
  // A. Digital Products & Lead Packs (Selar ₦25,000 – ₦85,000)
  selarLeadBundles: [
    { title: 'Real Estate & Shortlet Commercial Lead Pack', category: 'Real Estate', priceNGN: 35000, selarUrl: 'https://selar.com/showlove/bethelmind?item=bundle-real-estate' },
    { title: 'Healthcare & Dental Clinics Contact Bundle', category: 'Healthcare', priceNGN: 35000, selarUrl: 'https://selar.com/showlove/bethelmind?item=bundle-dental-clinics' },
    { title: 'Solar Energy Installers & Engineers Database', category: 'Solar', priceNGN: 35000, selarUrl: 'https://selar.com/showlove/bethelmind?item=bundle-solar-installers' },
    { title: 'Logistics, Freight & Haulage Operators Pack', category: 'Logistics', priceNGN: 25000, selarUrl: 'https://selar.com/showlove/bethelmind?item=bundle-logistics-haulage' },
    { title: 'Salons, Spas & Wellness Centers Bundle', category: 'Wellness', priceNGN: 25000, selarUrl: 'https://selar.com/showlove/bethelmind?item=bundle-salons-spas' },
  ],

  // B. Sector Audit Kits & Tools (₦15,000 – ₦35,000)
  microSaasTools: [
    { title: 'Bankable Solar Sizer & ROI Calculator Kit', path: '/tools/solar-calculator', priceNGN: 15000 },
    { title: 'Lagos Land Cadastral & Coordinate Dossier', path: '/tools/land-survey-verifier', priceNGN: 35000 },
    { title: 'SCUML & CAC Compliance Readiness Audit', path: '/tools/scuml-readiness', priceNGN: 15000 },
    { title: 'High-Converting B2B WhatsApp Script Generator', path: '/tools/b2b-script-gen', priceNGN: 15000 }
  ],

  // C. Web & Digital Infrastructure Services
  infrastructureServices: [
    { title: '100% Turnkey DFY Online Deployment', priceNGN: 75000, fullPriceNGN: 150000, type: 'TURNKEY_SITE' },
    { title: '1-Line Embed / WordPress Plugin Upgrade', priceNGN: 45000, fullPriceNGN: 65000, type: 'PLUGIN_EMBED' },
    { title: 'Unclaimed GMB Security Rescue', priceNGN: 45000, type: 'GMB_RESCUE' },
    { title: 'Expired .com.ng Domain Buyback & 301 Parking', priceNGN: 150000, type: 'DOMAIN_SNIPE' },
    { title: 'Shadow B2B Pay-Per-Appointment Router', priceNGN: 45000, type: 'APPOINTMENT_LEAD' },
    { title: 'Diaspora 4K Milestone Construction Escrow', feePercent: 3.5, type: 'DIASPORA_ESCROW' },
    { title: 'White-Label Agency Licensing MRR', priceNGN: 150000, recurringNGN: 35000, type: 'WHITE_LABEL' }
  ]
};

/**
 * Evaluates prospect intent signals and pairs them with the optimal commercial offer for sale.
 */
export function classifyLeadAndMatchOffer(lead: LeadProspect): MatchedCommercialOffer {
  const name = lead.name || 'Commercial Enterprise';
  const area = lead.area || lead.city || 'Lagos';
  const category = (lead.category || '').toLowerCase();
  const slug = lead.leadId || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const previewUrl = `https://www.bethelmindanalytics.com/preview/${slug}`;

  // Signal 1: Unclaimed High-Rated GMB Profile
  if (lead.isGmbUnclaimed && (lead.rating || 0) >= 4.0) {
    const waPitch = encodeURIComponent(`Hello Management at ${name}. Our local SEO audit detected that your Google Maps profile (${lead.rating}★, ${lead.reviewCount || 12} reviews in ${area}) is UNCLAIMED and exposed to hijacking. We can claim and lock it today.`);
    return {
      leadId: lead.leadId,
      businessName: name,
      intentSignal: 'UNCLAIMED_GMB_HIGH_RATING',
      score: 95,
      recommendedProduct: 'Unclaimed GMB Security Rescue',
      productCategory: 'GMB Listing Security',
      priceNGN: 45000,
      actionUrl: `https://wa.me/2348022791227?text=${waPitch}`,
      personalizedHook: `Good day! 👋 Is this the executive team at *${name}* in ${area}? Our audit detected your 4.5★ Google Maps profile is currently UNCLAIMED. May we share your profile rescue report?`
    };
  }

  // Signal 2: Expired Commercial Domain with Historic Traffic
  if (lead.domainExpired) {
    return {
      leadId: lead.leadId,
      businessName: name,
      intentSignal: 'EXPIRED_DOMAIN_TRAFFIC',
      score: 92,
      recommendedProduct: 'Expired .com.ng Domain Buyback & 301 Parking',
      productCategory: 'Domain Sniping & Traffic Siphon',
      priceNGN: 150000,
      actionUrl: `https://www.bethelmindanalytics.com/domains/${slug}`,
      personalizedHook: `Good day! 👋 Your domain \`${slug}.ng\` expired recently, exposing monthly visitors. Should we send your 301 traffic recovery options?`
    };
  }

  // Signal 3: Existing Website Owner -> 1-Line Embed Upgrade
  if (lead.hasWebsite) {
    const waPitch = encodeURIComponent(`Hello ${name}! We noticed your active website. We have a 10-minute 1-Line WhatsApp Closer Script upgrade (₦35,000) that adds 24/7 automated booking without touching your hosting.`);
    return {
      leadId: lead.leadId,
      businessName: name,
      intentSignal: 'EXISTING_WEBSITE_UPGRADE',
      score: 88,
      recommendedProduct: '1-Line Embed / WordPress Plugin Upgrade',
      productCategory: 'Plugin Upgrade',
      priceNGN: 35000,
      actionUrl: `https://wa.me/2348022791227?text=${waPitch}`,
      personalizedHook: `Good day! 👋 Is this the management team at *${name}*? We built a 1-Line WhatsApp Closer plugin upgrade for your website. May we send the 10-minute integration preview?`
    };
  }

  // Signal 4: Solar / Healthcare / Logistics -> High-Ticket Appointment Lead or Lead Pack
  if (category.includes('solar') || category.includes('energy')) {
    return {
      leadId: lead.leadId,
      businessName: name,
      intentSignal: 'HIGH_TICKET_SOLAR_APPOINTMENTS',
      score: 90,
      recommendedProduct: 'B2B Pay-Per-Appointment Lead Router & Solar Sizer Tool',
      productCategory: 'Appointment Arbitrage',
      priceNGN: 45000,
      actionUrl: `https://www.bethelmindanalytics.com/tools/solar-calculator`,
      personalizedHook: `Good day! 👋 Is this the engineering team at *${name}* in ${area}? We have pre-audited commercial solar quote leads ready for distribution. Should we send lead details?`
    };
  }

  // Default Fallback Signal: No-Website Owner -> 100% Turnkey DFY Online Deployment
  const waPitch = encodeURIComponent(`Hello ${name}! I am reviewing your live prototype link (${previewUrl}). We want to claim our 48-hour staging for ₦75,000 50% deposit.`);
  return {
    leadId: lead.leadId,
    businessName: name,
    intentSignal: 'NO_WEBSITE_TURNKEY_NEED',
    score: 85,
    recommendedProduct: '100% Turnkey DFY Online Deployment',
    productCategory: 'DFY Web & AI Closer',
    priceNGN: 75000,
    actionUrl: `https://wa.me/2348022791227?text=${waPitch}`,
    personalizedHook: `Good day! 👋 Is this the executive management at *${name}* in ${area}? We built a custom interactive website prototype + 24/7 AI WhatsApp closer tailored for ${name}. May we share your private link?`
  };
}
