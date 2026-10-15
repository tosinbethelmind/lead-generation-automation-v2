export interface DesignTheme {
  primary: string;
  accent: string;
  bg: string;
  text: string;
  font: string;
  headingFont?: string;
  bodyFont?: string;
  heroImage: string;
  gradient: string;
}

export function sanitizeGeneratedContent(str: string | undefined): string {
  if (!str) return '';
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
    .replace(/javascript:/gi, '');
}

export function hashString(str: string): number {
  let hash = 0;
  if (!str || str.length === 0) return hash;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

const HERO_IMAGE_BANKS: Record<string, string[]> = {
  solar: [
    'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=1400&q=80',
    'https://images.unsplash.com/photo-1508873696983-2df515122519?w=1400&q=80',
    'https://images.unsplash.com/photo-1548337138-e87d889cc369?w=1400&q=80',
    'https://images.unsplash.com/photo-1545208942-e1c9c916524b?w=1400&q=80',
  ],
  realestate: [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1400&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1400&q=80',
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1400&q=80',
  ],
  automotive: [
    'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1400&q=80',
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1400&q=80',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1400&q=80',
    'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=1400&q=80',
  ],
  medical: [
    'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1400&q=80',
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1400&q=80',
    'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=1400&q=80',
    'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=1400&q=80',
  ],
  hospitality: [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1400&q=80',
    'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1400&q=80',
    'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1400&q=80',
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1400&q=80',
  ],
  education: [
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1400&q=80',
    'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=1400&q=80',
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1400&q=80',
  ],
  legal: [
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1400&q=80',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1400&q=80',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=80',
  ],
  boutique: [
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1400&q=80',
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&q=80',
    'https://images.unsplash.com/photo-1470309864661-68328b2cd0a5?w=1400&q=80',
  ],
  logistics: [
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1400&q=80',
    'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=1400&q=80',
    'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1400&q=80',
  ],
  events: [
    'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1400&q=80',
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1400&q=80',
    'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1400&q=80',
  ],
  default: [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=80',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1400&q=80',
    'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1400&q=80',
  ]
};

const SECTOR_THEME_PROFILES: Record<string, {
  primary: string;
  accent: string;
  bg: string;
  headingFont: string;
  bodyFont: string;
  gradient: string;
  imageKey: string;
}> = {
  solar: {
    primary: 'hsl(158, 85%, 46%)',
    accent: 'hsl(45, 95%, 52%)',
    bg: 'hsl(160, 50%, 3%)',
    headingFont: 'Space Grotesk',
    bodyFont: 'Outfit',
    gradient: 'linear-gradient(135deg, hsl(158, 85%, 46%) 0%, hsl(180, 90%, 42%) 50%, hsl(45, 95%, 52%) 100%)',
    imageKey: 'solar'
  },
  hospitality: {
    primary: 'hsl(43, 90%, 54%)',
    accent: 'hsl(198, 95%, 60%)',
    bg: 'hsl(225, 45%, 4%)',
    headingFont: 'Playfair Display',
    bodyFont: 'Plus Jakarta Sans',
    gradient: 'linear-gradient(135deg, hsl(43, 90%, 54%) 0%, hsl(35, 95%, 55%) 50%, hsl(265, 85%, 60%) 100%)',
    imageKey: 'hospitality'
  },
  realestate: {
    primary: 'hsl(38, 92%, 50%)',
    accent: 'hsl(348, 85%, 60%)',
    bg: 'hsl(30, 35%, 4%)',
    headingFont: 'Cormorant Garamond',
    bodyFont: 'Plus Jakarta Sans',
    gradient: 'linear-gradient(135deg, hsl(38, 92%, 50%) 0%, hsl(25, 95%, 52%) 50%, hsl(348, 85%, 60%) 100%)',
    imageKey: 'realestate'
  },
  medical: {
    primary: 'hsl(188, 95%, 44%)',
    accent: 'hsl(158, 75%, 50%)',
    bg: 'hsl(205, 55%, 4%)',
    headingFont: 'Outfit',
    bodyFont: 'Inter',
    gradient: 'linear-gradient(135deg, hsl(188, 95%, 44%) 0%, hsl(215, 90%, 58%) 50%, hsl(158, 75%, 50%) 100%)',
    imageKey: 'medical'
  },
  automotive: {
    primary: 'hsl(350, 90%, 56%)',
    accent: 'hsl(32, 95%, 54%)',
    bg: 'hsl(240, 20%, 4%)',
    headingFont: 'Syne',
    bodyFont: 'Inter',
    gradient: 'linear-gradient(135deg, hsl(350, 90%, 56%) 0%, hsl(15, 95%, 55%) 50%, hsl(32, 95%, 54%) 100%)',
    imageKey: 'automotive'
  },
  education: {
    primary: 'hsl(220, 95%, 58%)',
    accent: 'hsl(45, 95%, 54%)',
    bg: 'hsl(225, 60%, 4%)',
    headingFont: 'DM Serif Display',
    bodyFont: 'Plus Jakarta Sans',
    gradient: 'linear-gradient(135deg, hsl(220, 95%, 58%) 0%, hsl(255, 90%, 65%) 50%, hsl(45, 95%, 54%) 100%)',
    imageKey: 'education'
  },
  legal: {
    primary: 'hsl(215, 80%, 54%)',
    accent: 'hsl(38, 90%, 55%)',
    bg: 'hsl(220, 35%, 5%)',
    headingFont: 'Cinzel',
    bodyFont: 'Inter',
    gradient: 'linear-gradient(135deg, hsl(215, 80%, 54%) 0%, hsl(240, 75%, 60%) 50%, hsl(38, 90%, 55%) 100%)',
    imageKey: 'legal'
  },
  boutique: {
    primary: 'hsl(330, 85%, 58%)',
    accent: 'hsl(45, 95%, 55%)',
    bg: 'hsl(315, 45%, 4%)',
    headingFont: 'Playfair Display',
    bodyFont: 'Outfit',
    gradient: 'linear-gradient(135deg, hsl(330, 85%, 58%) 0%, hsl(350, 90%, 62%) 50%, hsl(45, 95%, 55%) 100%)',
    imageKey: 'boutique'
  },
  logistics: {
    primary: 'hsl(35, 95%, 52%)',
    accent: 'hsl(198, 95%, 54%)',
    bg: 'hsl(220, 40%, 4%)',
    headingFont: 'Space Grotesk',
    bodyFont: 'Inter',
    gradient: 'linear-gradient(135deg, hsl(35, 95%, 52%) 0%, hsl(15, 90%, 54%) 50%, hsl(198, 95%, 54%) 100%)',
    imageKey: 'logistics'
  },
  events: {
    primary: 'hsl(275, 85%, 60%)',
    accent: 'hsl(45, 95%, 55%)',
    bg: 'hsl(280, 45%, 4%)',
    headingFont: 'Playfair Display',
    bodyFont: 'Plus Jakarta Sans',
    gradient: 'linear-gradient(135deg, hsl(275, 85%, 60%) 0%, hsl(320, 85%, 58%) 50%, hsl(45, 95%, 55%) 100%)',
    imageKey: 'events'
  }
};

const LUXURY_STYLE_MATRICES: Array<{
  primary: string;
  accent: string;
  bg: string;
  headingFont: string;
  bodyFont: string;
  gradient: string;
}> = [
  {
    primary: 'hsl(43, 92%, 54%)',
    accent: 'hsl(198, 95%, 60%)',
    bg: 'hsl(225, 45%, 4%)',
    headingFont: 'Playfair Display',
    bodyFont: 'Plus Jakarta Sans',
    gradient: 'linear-gradient(135deg, hsl(43, 92%, 54%) 0%, hsl(35, 95%, 55%) 50%, hsl(265, 85%, 60%) 100%)'
  },
  {
    primary: 'hsl(158, 85%, 46%)',
    accent: 'hsl(45, 95%, 52%)',
    bg: 'hsl(160, 50%, 3%)',
    headingFont: 'Cormorant Garamond',
    bodyFont: 'Plus Jakarta Sans',
    gradient: 'linear-gradient(135deg, hsl(158, 85%, 46%) 0%, hsl(180, 90%, 42%) 50%, hsl(45, 95%, 52%) 100%)'
  },
  {
    primary: 'hsl(188, 95%, 44%)',
    accent: 'hsl(158, 75%, 50%)',
    bg: 'hsl(205, 55%, 4%)',
    headingFont: 'Outfit',
    bodyFont: 'Inter',
    gradient: 'linear-gradient(135deg, hsl(188, 95%, 44%) 0%, hsl(215, 90%, 58%) 50%, hsl(158, 75%, 50%) 100%)'
  },
  {
    primary: 'hsl(330, 85%, 58%)',
    accent: 'hsl(45, 95%, 55%)',
    bg: 'hsl(315, 45%, 4%)',
    headingFont: 'Playfair Display',
    bodyFont: 'Outfit',
    gradient: 'linear-gradient(135deg, hsl(330, 85%, 58%) 0%, hsl(350, 90%, 62%) 50%, hsl(45, 95%, 55%) 100%)'
  },
  {
    primary: 'hsl(350, 90%, 56%)',
    accent: 'hsl(32, 95%, 54%)',
    bg: 'hsl(240, 20%, 4%)',
    headingFont: 'Syne',
    bodyFont: 'Inter',
    gradient: 'linear-gradient(135deg, hsl(350, 90%, 56%) 0%, hsl(15, 95%, 55%) 50%, hsl(32, 95%, 54%) 100%)'
  },
  {
    primary: 'hsl(215, 80%, 54%)',
    accent: 'hsl(38, 90%, 55%)',
    bg: 'hsl(220, 35%, 5%)',
    headingFont: 'Cinzel',
    bodyFont: 'Inter',
    gradient: 'linear-gradient(135deg, hsl(215, 80%, 54%) 0%, hsl(240, 75%, 60%) 50%, hsl(38, 90%, 55%) 100%)'
  },
  {
    primary: 'hsl(38, 92%, 50%)',
    accent: 'hsl(348, 85%, 60%)',
    bg: 'hsl(30, 35%, 4%)',
    headingFont: 'DM Serif Display',
    bodyFont: 'Plus Jakarta Sans',
    gradient: 'linear-gradient(135deg, hsl(38, 92%, 50%) 0%, hsl(25, 95%, 52%) 50%, hsl(348, 85%, 60%) 100%)'
  },
  {
    primary: 'hsl(275, 85%, 60%)',
    accent: 'hsl(45, 95%, 55%)',
    bg: 'hsl(280, 45%, 4%)',
    headingFont: 'Space Grotesk',
    bodyFont: 'Plus Jakarta Sans',
    gradient: 'linear-gradient(135deg, hsl(275, 85%, 60%) 0%, hsl(320, 85%, 58%) 50%, hsl(45, 95%, 55%) 100%)'
  }
];

export function getDesignTheme(category: string, leadIdSeed?: string): DesignTheme {
  const cat = category.toLowerCase();
  const seed = hashString((leadIdSeed || '') + category);

  let sectorKey = 'hospitality';
  if (/hotel|shortlet|apartment|suite|hospitality|resort|lodge|dining|lounge|restaurant/.test(cat)) sectorKey = 'hospitality';
  else if (/estate|property|home|realty|housing|developer|land/.test(cat)) sectorKey = 'realestate';
  else if (/medical|clinic|doctor|health|hospital|pharmacy|dental|lab/.test(cat)) sectorKey = 'medical';
  else if (/car|auto|motor|vehicle|tokunbo|dealership|mechanic/.test(cat)) sectorKey = 'automotive';
  else if (/school|academy|education|college|creche|tutor/.test(cat)) sectorKey = 'education';
  else if (/law|legal|attorney|solicitor|advocate|barrister|cac/.test(cat)) sectorKey = 'legal';
  else if (/boutique|fashion|style|beauty|salon|spa|hair|cloth/.test(cat)) sectorKey = 'boutique';
  else if (/logistics|haulage|courier|dispatch|delivery|freight|cargo|truck/.test(cat)) sectorKey = 'logistics';
  else if (/event|hall|banquet|decor|cater|party|wedding/.test(cat)) sectorKey = 'events';
  else if (/solar|inverter|energy|battery|power|lifepo4/.test(cat)) sectorKey = 'solar';

  // Base profile for sector
  const baseProfile = SECTOR_THEME_PROFILES[sectorKey] || SECTOR_THEME_PROFILES.hospitality;
  
  // Pick luxury style variant deterministically seeded by lead ID
  const variantIndex = seed % LUXURY_STYLE_MATRICES.length;
  const styleVariant = LUXURY_STYLE_MATRICES[variantIndex];

  // Pick sector-relevant photography from image bank
  const imageBank = HERO_IMAGE_BANKS[baseProfile.imageKey] || HERO_IMAGE_BANKS.default;
  const heroImage = imageBank[seed % imageBank.length];

  return {
    primary: styleVariant.primary,
    accent: styleVariant.accent,
    bg: styleVariant.bg,
    text: '#ffffff',
    font: styleVariant.headingFont,
    headingFont: styleVariant.headingFont,
    bodyFont: styleVariant.bodyFont,
    heroImage,
    gradient: styleVariant.gradient,
  };
}

export interface GeneratedCopy {
  heroTitle: string;
  heroSubtitle: string;
  services: { title: string; description: string; icon: string }[];
  aboutText: string;
  testimonials: { name: string; text: string; rating: number }[];
  ctaText: string;
}

export interface GeneratedSiteResponse {
  copy: GeneratedCopy;
  theme?: {
    primary: string;
    accent: string;
    bg: string;
    text: string;
    font: string;
    headingFont?: string;
    bodyFont?: string;
    gradient: string;
    heroImage?: string;
  };
}

export function buildGenerationPrompt(lead: any): string {
  return `You are a professional web copywriter and UX designer. Generate compelling marketing copy and a highly tailored visual design theme specifically matching this business's name, specialty, location, and description.

Business Details:
- Name: ${lead.name}
- Industry/Category: ${lead.category}
- Location: ${lead.area}, ${lead.city}, Nigeria
- Google Rating: ${lead.rating} stars out of 5
- Number of Google Reviews: ${lead.reviews_count}
- Brief: ${lead.business_summary}
- Operating Hours: ${lead.business_hours || 'Not Available'}
- Actual Google Reviews (JSON): ${lead.reviews_data || '[]'}
- Business Photos (JSON array): ${lead.photos_data || '[]'}
- Social Media Links (JSON object): ${lead.social_links || '{}'}
- Services Offered (JSON array): ${lead.services_data || '[]'}
- Existing Website URL: ${lead.website || 'None'}
- Existing Website Title: ${lead.websiteTitle || 'None'}
- Existing Website Meta Description: ${lead.websiteMeta || 'None'}
- Existing Website Dominant Color: ${lead.websiteColor || 'None'}
- Detected Website Platform/CMS: ${lead.cmsPlatform || 'Unknown'}
- Platform Detection Confidence: ${lead.cmsConfidence || 'low'}
- Recommended Upgrade Strategy: ${lead.upgradeStrategy || 'script_embed'}
- Available Upgrade Tools/Plugins: ${Array.isArray(lead.pluginSuggestions) ? lead.pluginSuggestions.join(', ') : (lead.pluginSuggestions || 'JS Widget Embeds')}
- Upgrade Method Note: ${lead.embedNote || ''}

Guidelines:
1. STRICT NIGERIAN SME & SEO ACCESSIBILITY RULE:
   Use COMMON, SEARCH-ENGINE-OPTIMIZED, HIGH-CONVERTING BUSINESS WORDS that any Nigerian shop owner, contractor, or customer will instantly relate with.
   - DO NOT USE COMPLEX TECH JARGON like: 'DisCo Band A Tariff ROI', 'LiFePO4 sizing matrix', 'WebRTC virtual inspection', '5% WHT Ledger', 'HMO Tariff authorization reconciler', 'multi-tenancy', 'SSR edge cache', or 'broadsheet automation'.
   - USE COMMON RELATABLE WORDS like: 'Solar & Inverter Price List', 'Cut NEPA Blackout Stress', 'Save ₦80k+ on Generator Fuel Monthly', 'Verified Houses & Land for Sale in ${lead.area}', '1-Tap WhatsApp Inspection Booking', 'Book Doctor Consultation in ${lead.area}', 'Clean Tokunbo Cars with Verified Customs Duty', 'Check Term Fees Online', 'Instant Bank Transfer Receipt (Moniepoint/OPay)'.
2. Choose design tokens (primary color, accent color, background, text color, font, headingFont, bodyFont, CSS gradient) that match the mood and premium/luxurious vibe of this specific business. If the business has an existing website dominant color (and it's a valid hex code), prioritize using or adapting that color as the primary theme color.
3. Under "testimonials", use or adapt the real Google reviews provided in "Actual Google Reviews (JSON)" to populate the testimonials list (up to 3 items) instead of fabricating completely random names/reviews.
4. Under "services", incorporate the actual services from "Services Offered (JSON array)" if present, or expand upon them matching the category. Make sure there are exactly 3 services.
5. Try to select a "heroImage" URL from the "Business Photos (JSON array)" if there are any valid URLs. If none, do not specify it (it will default to a high-quality Unsplash category image).
6. CRITICAL UPGRADE & MODERNIZATION PIPELINE RULES:
   If the business has an existing website (i.e. Existing Website URL is not 'None' and is not empty), you MUST generate copy specifically pitching a "website upgrade" and "automation modernization" rather than pitching a "new website" or "getting online". Use the platform-specific context below:
   
   UPGRADE STRATEGY = "${lead.upgradeStrategy || 'script_embed'}" — adapt your pitch accordingly:
    - If strategy is "plugin": mention that features will be added by installing plugins directly onto their existing ${lead.cmsPlatform || 'website'} — no migration or redesign needed.
    - If strategy is "script_embed": mention that features are added via a simple embed code on their existing site — zero rebuild required.
    - If strategy is "basic_presence": pitch a fast, modern landing page to establish an online presence, get found on Google, and start collecting bookings.
    - If strategy is "full_rebuild": acknowledge that their current platform (${lead.cmsPlatform || 'website'}) limits what is possible, and pitch a full modernization/migration to an upgraded platform with all features built in.

    - The heroTitle MUST be a high-conversion modernization/upgrade headline referencing their platform or setup (e.g. "Power Up Your ${lead.cmsPlatform || 'Website'} with Automated Bookings & Paystack Payments" or "Claim Your Custom Lead Generation Website").
    - The heroSubtitle MUST refer to upgrading their existing website at ${lead.website || ''} (if they have one) or getting a new fast presence.
    - The services MUST list the specific tools from Available Upgrade Tools: ${Array.isArray(lead.pluginSuggestions) ? lead.pluginSuggestions.slice(0, 3).join(', ') : 'automation integrations'}.
    - The aboutText should reference their operations, reputation, and local presence in ${lead.area}.
    - The ctaText MUST use upgrade/claim-focused language matching the strategy (e.g., "Install My Upgrade Plugins", "Add My Automation Widgets", "Deploy My Website", or "Claim My Rebuilt Platform").

Font options should be premium pairings:
- Elegant/Luxury: headingFont='Playfair Display' + bodyFont='Plus Jakarta Sans' (or Inter)
- Technical/Modern: headingFont='Space Grotesk' + bodyFont='Inter'
- Warm Hospitality: headingFont='DM Serif Display' + bodyFont='Cabin' (or Inter)
- Wellness/Corporate: headingFont='Outfit' + bodyFont='Inter'

Generate a JSON object with exactly this structure (respond ONLY with valid JSON, no markdown):
{
  "copy": {
    "heroTitle": "A powerful 6-10 word tagline for the business",
    "heroSubtitle": "A compelling 1-2 sentence value proposition that mentions their location and specialty",
    "services": [
      {"title": "Service Name", "description": "2-3 sentence description of this service", "icon": "🔧"},
      {"title": "Service Name", "description": "2-3 sentence description of this service", "icon": "⭐"},
      {"title": "Service Name", "description": "2-3 sentence description of this service", "icon": "🎯"}
    ],
    "aboutText": "3-4 sentence paragraph about the business, mentioning their excellent Google reputation and local presence in ${lead.area}",
    "testimonials": [
      {"name": "Customer Name", "text": "A realistic positive review of 2-3 sentences", "rating": 5},
      {"name": "Customer Name", "text": "A realistic positive review of 2-3 sentences", "rating": 5}
    ],
    "ctaText": "A strong 3-6 word call-to-action button text (e.g. 'Book a Free Consultation')"
  },
  "theme": {
    "primary": "#hex_primary_color",
    "accent": "#hex_accent_color",
    "bg": "#hex_page_bg_color (should be soft or dark matching the vibe)",
    "text": "#hex_body_text_color (must have high contrast with bg)",
    "font": "Font Name (main/default font)",
    "headingFont": "Heading Font Name (selected from options above)",
    "bodyFont": "Body Font Name (selected from options above)",
    "gradient": "linear-gradient(135deg, primary_color 0%, accent_color 100%)",
    "heroImage": "URL from Business Photos if available, otherwise omit this field"
  }
}`;
}

export function buildFallbackCopy(lead: any): GeneratedCopy {
  const cat = (lead.category || '').toLowerCase();
  const name = lead.name || 'Valued Business';
  const area = lead.area || lead.city || 'Lagos';
  const hasWebsite = !!(lead.website && lead.website.trim() && lead.website.toLowerCase() !== 'none');

  // 1. SOLAR & RENEWABLE ENERGY
  if (/solar|inverter|energy|battery|power|lifepo4/.test(cat)) {
    return {
      heroTitle: `${name} — Affordable Solar & Inverter Systems in ${area}`,
      heroSubtitle: `Cut NEPA blackout stress, save ₦80k+ on fuel monthly, and get instant solar pricing and battery load sizing directly on WhatsApp.`,
      services: [
        { title: '☀️ Instant WhatsApp Solar Price & Load Sizer', description: 'Select your home or shop appliances (fridge, AC, TV, lights) and get the exact inverter and battery system size with price in 2 minutes.', icon: '⚡' },
        { title: '⛽ Generator Fuel Savings Calculator', description: 'See exactly how much money you save on petrol and diesel every month when you switch to solar power.', icon: '📊' },
        { title: '🛡️ Genuine Warranty & Direct Bank Payment', description: 'Verified solar installations with full warranty and instant Moniepoint or OPay bank transfer receipts.', icon: '📄' }
      ],
      aboutText: `${name} is a trusted solar energy and inverter installation company in ${area}. We help homes, shops, and offices enjoy 24/7 power and cut generator fuel costs with quality solar setups.`,
      testimonials: [
        { name: 'Engr. Femi Adeleke', text: 'The instant solar price calculator gave us an accurate budget on WhatsApp before the engineer visited. Clean installation!', rating: 5 },
        { name: 'Dr. (Mrs) Alabi', text: 'Super fast response on WhatsApp. We cut our diesel bill by 80% with their 5kVA hybrid setup in Lagos.', rating: 5 }
      ],
      ctaText: hasWebsite ? 'Get 1-Line WhatsApp Embed (₦35,000)' : 'Claim Official Website (₦35k Deposit)'
    };
  }

  // 2. REAL ESTATE & LUXURY HOMES
  if (/estate|property|home|realty|housing|developer|land/.test(cat)) {
    return {
      heroTitle: `${name} — Verified Properties, Houses & Land for Sale in ${area}`,
      heroSubtitle: `Explore verified lands, luxury duplexes, and commercial properties with 1-tap WhatsApp inspection bookings and flexible installment payment plans.`,
      services: [
        { title: '🏡 Verified Land & House Listings', description: 'Browse genuine properties with clean C of O and Governor\'s Consent with clear photos, video tours, and prices.', icon: '🏠' },
        { title: '📅 1-Tap WhatsApp Inspection Booking', description: 'Book physical site visits or live video walk-throughs in 5 seconds directly on WhatsApp.', icon: '📹' },
        { title: '💰 Flexible Installment & Payment Calculator', description: 'Calculate down payments and monthly installment breakdown without back-and-forth phone calls.', icon: '🤝' }
      ],
      aboutText: `${name} is a premier real estate development and property marketing firm in ${area}. We connect home buyers and diaspora investors with verified titles, secure land banking, and luxury homes.`,
      testimonials: [
        { name: 'Chief Olumide B.', text: 'The video walk-through and installment plan gave us complete peace of mind buying land from the UK.', rating: 5 },
        { name: 'Barr. Folake T.', text: 'Verified Governor\'s Consent and transparent documentation. Highly dependable real estate team.', rating: 5 }
      ],
      ctaText: hasWebsite ? 'Get 1-Line WhatsApp Embed (₦35,000)' : 'Claim Official Website (₦35k Deposit)'
    };
  }

  // 3. MEDICAL & HEALTHCARE CLINICS (Evaluated before auto to avoid 'healthcare' matching 'care')
  if (/medical|clinic|doctor|health|hospital|pharmacy|dental|dentist|optician|eye|lab|surgery/.test(cat)) {
    return {
      heroTitle: `${name} — Quality Healthcare & Fast Clinic Booking in ${area}`,
      heroSubtitle: `Book doctor consultations, view medical checkup packages, and schedule appointments on WhatsApp with zero waiting room delays.`,
      services: [
        { title: '🩺 1-Tap Doctor Consultation Booking', description: 'Book your preferred doctor or specialist with instant WhatsApp confirmation and clinic directions.', icon: '🩺' },
        { title: '🧪 Medical Lab Tests & Checkup Packages', description: 'View comprehensive health screening packages, blood tests, and transparent prices upfront.', icon: '🏥' },
        { title: '💳 HMO Coverage & Safe Cashless Payments', description: 'Check HMO approval or pay consultation deposits directly via secure Moniepoint or OPay transfer.', icon: '📅' }
      ],
      aboutText: `${name} provides compassionate, world-class healthcare services in ${area}. Committed to clinical excellence, modern diagnostic equipment, and rapid patient recovery.`,
      testimonials: [
        { name: 'Mrs. Kemi Johnson', text: 'Booking our family consultation via WhatsApp saved us hours at the reception. Superb doctors!', rating: 5 },
        { name: 'Pastor David E.', text: 'Clean hospital facilities, prompt attention, and seamless HMO verification.', rating: 5 }
      ],
      ctaText: hasWebsite ? 'Get 1-Line WhatsApp Embed (₦35,000)' : 'Claim Official Website (₦35k Deposit)'
    };
  }

  // 4. AUTOMOTIVE & TOKUNBO IMPORTERS
  if (/(\bcar\b|\bcars\b|auto|motor|vehicle|tokunbo|dealership|mechanic|garage)/.test(cat)) {
    return {
      heroTitle: `${name} — Clean Tokunbo & Nigerian Used Cars for Sale in ${area}`,
      heroSubtitle: `Browse inspected vehicles with verified customs duty papers, check transparent car prices, and book test drives directly on WhatsApp.`,
      services: [
        { title: '🚗 Clean Showroom Inventory & Prices', description: 'Browse Toyota, Lexus, Mercedes and more with high-resolution photos, mileage, and clear prices.', icon: '🚗' },
        { title: '📄 Verified Customs Papers & VIN Check', description: 'Buy with peace of mind with original Nigerian customs clearing papers and vehicle inspection reports.', icon: '🔄' },
        { title: '🔄 Car Swap & Easy Test Drive Booking', description: 'Value your current car for a trade-in upgrade and book your physical test drive on WhatsApp.', icon: '📱' }
      ],
      aboutText: `${name} is a leading automotive dealership in ${area} providing thoroughly inspected Nigerian used and foreign used (Tokunbo) vehicles with genuine customs documentation.`,
      testimonials: [
        { name: 'Capt. Ibrahim M.', text: 'Fair trade-in valuation and transparent customs clearing papers. Got my SUV in 48 hours without stress.', rating: 5 },
        { name: 'Segun Oladipo', text: 'Best car dealership experience in Lagos. Clean engine, verified VIN, and swift delivery.', rating: 5 }
      ],
      ctaText: hasWebsite ? 'Get 1-Line WhatsApp Embed (₦35,000)' : 'Claim Official Website (₦35k Deposit)'
    };
  }

  // 5. SCHOOLS & ACADEMIES
  if (/school|academy|education|college|creche|tutor/.test(cat)) {
    return {
      heroTitle: `${name} — Academic Excellence & Smart School Portal in ${area}`,
      heroSubtitle: `Check school fees breakdown, apply for admission online, and access student termly report sheets easily on your mobile phone.`,
      services: [
        { title: '🎓 School Fees Payment & Installment Breakdown', description: 'View transparent termly tuition fees for Creche, Primary, and Secondary with easy bank transfers.', icon: '🎓' },
        { title: '📝 Online Admission & Entrance Form', description: 'Enroll new students easily from home without queuing at the school admin office.', icon: '📜' },
        { title: '📱 Termly Result Checker on WhatsApp', description: 'Parents can check their child\'s report sheet and term performance directly on their phone.', icon: '🔑' }
      ],
      aboutText: `${name} is an esteemed educational institution in ${area} nurturing academic excellence, moral discipline, and leadership skills in every pupil and student.`,
      testimonials: [
        { name: 'Dr. (Mrs) Okafor', text: 'The online fee breakdown and instant result checker on mobile make termly registration stress-free.', rating: 5 },
        { name: 'Engr. Taiwo B.', text: 'Outstanding academic standards, dedicated teachers, and very responsive school management.', rating: 5 }
      ],
      ctaText: hasWebsite ? 'Get 1-Line WhatsApp Embed (₦35,000)' : 'Claim Official Website (₦35k Deposit)'
    };
  }

  // 6. LAW FIRMS & LEGAL PRACTITIONERS
  if (/law|legal|attorney|solicitor|advocate|barrister|cac/.test(cat)) {
    return {
      heroTitle: `${name} — Trusted Legal Counsel & Corporate Law Practice in ${area}`,
      heroSubtitle: `Get expert legal advice on CAC business registration, property title verification, contracts, and court representation without delay.`,
      services: [
        { title: '⚖️ Business CAC Registration & Corporate Filing', description: 'Register your Business Name, Limited Liability Company (Ltd), or NGO with zero hassle.', icon: '⚖️' },
        { title: '📜 Property Title & Land Due Diligence', description: 'Verify Governor\'s Consent, Gazette, and Deed of Assignment before buying land in Nigeria.', icon: '🛡️' },
        { title: '💼 1-Tap Legal Consultation Booking', description: 'Schedule a confidential consultation with experienced legal counsel directly on WhatsApp.', icon: '📄' }
      ],
      aboutText: `${name} is a distinguished law firm in ${area} providing astute counsel in corporate law, real estate conveyancing, intellectual property, and commercial dispute resolution.`,
      testimonials: [
        { name: 'MD, Global Tech Ltd', text: 'Prompt CAC company registration and solid contract drafting. Essential legal partners for our business.', rating: 5 },
        { name: 'Alhaji Sanusi K.', text: 'Thorough due diligence on our land acquisition in Lagos. Highly dependable legal team.', rating: 5 }
      ],
      ctaText: hasWebsite ? 'Get 1-Line WhatsApp Embed (₦35,000)' : 'Claim Official Website (₦35k Deposit)'
    };
  }

  // 7. HOTELS & SHORTLET APARTMENTS
  if (/hotel|shortlet|apartment|suite|hospitality|resort|lodge|dining|lounge|restaurant/.test(cat)) {
    return {
      heroTitle: `${name} — Luxury Rooms & Serviced Shortlet Apartments in ${area}`,
      heroSubtitle: `Enjoy 24/7 electricity, high-speed WiFi, clean suites, and secure parking. Book directly on WhatsApp and save agency commissions.`,
      services: [
        { title: '🏨 24/7 Direct Room & Suite Booking', description: 'Check available dates, room rates, and book instantly on WhatsApp without extra middleman fees.', icon: '🏨' },
        { title: '⚡ 24/7 Uninterrupted Light & High-Speed WiFi', description: 'Rest easy with uninterrupted generator backup power, smart TVs, and premium amenities.', icon: '⚡' },
        { title: '💳 Instant Caution Deposit & Check-In Key', description: 'Safe bank transfer verification with fast, seamless check-in and checkout.', icon: '💳' }
      ],
      aboutText: `${name} offers serene, luxurious accommodations in ${area} featuring 24/7 uninterrupted power, high-speed fiber internet, and bespoke hospitality services.`,
      testimonials: [
        { name: 'Amaka Eze', text: 'Loved the fast WhatsApp booking and instant check-in. The apartment was immaculate with 24/7 power!', rating: 5 },
        { name: 'Tunde Bakare', text: 'Top tier shortlet in Lagos. Seamless caution deposit refund right after checkout.', rating: 5 }
      ],
      ctaText: hasWebsite ? 'Get 1-Line WhatsApp Embed (₦35,000)' : 'Claim Official Website (₦35k Deposit)'
    };
  }

  // 8. BOUTIQUES, HAUTE COUTURE & BEAUTY SPAS
  if (/boutique|fashion|style|beauty|salon|spa|hair|cloth|tailor|apparel/.test(cat)) {
    return {
      heroTitle: `${name} — Trendy Fashion Boutique & Beauty Studio in ${area}`,
      heroSubtitle: `Browse our latest designer clothing, shoes, bags, and luxury hair collections. Order your size on WhatsApp with fast same-day dispatch.`,
      services: [
        { title: '👗 New Arrivals & Lookbook Catalog', description: 'Browse stylish ready-to-wear, fabrics, and beauty products with clear prices and size guides.', icon: '👗' },
        { title: '🛍️ 1-Tap WhatsApp Order Desk', description: 'Tap to order your size and color without typing or back-and-forth "how much" questions in DM.', icon: '💎' },
        { title: '🚚 Fast Nationwide Delivery & Waybill', description: 'Swift same-day delivery within Lagos and reliable dispatch waybill tracking across Nigeria.', icon: '💳' }
      ],
      aboutText: `${name} is an elite fashion house and beauty sanctuary in ${area} crafting bespoke luxury apparel and delivering transformative styling experiences.`,
      testimonials: [
        { name: 'Stephanie Okonkwo', text: 'The WhatsApp catalog made ordering my wedding guest outfit so effortless. Perfect fit and prompt delivery!', rating: 5 },
        { name: 'Folake Adeyemi', text: 'Flawless tailoring, exquisite fabrics, and same-day delivery in Lekki. Truly 5-star service.', rating: 5 }
      ],
      ctaText: hasWebsite ? 'Get 1-Line WhatsApp Embed (₦35,000)' : 'Claim Official Website (₦35k Deposit)'
    };
  }

  // 9. LOGISTICS, HAULAGE & DISPATCH
  if (/logistics|haulage|courier|dispatch|delivery|freight|cargo|truck/.test(cat)) {
    return {
      heroTitle: `${name} — Fast & Reliable Dispatch Delivery in ${area}`,
      heroSubtitle: `Same-day parcel delivery across Lagos and nationwide interstate haulage. Transparent delivery fees and real-time package updates on WhatsApp.`,
      services: [
        { title: '📦 Fast Same-Day Pickup & Delivery', description: 'Swift bike and van dispatch for documents, food, retail orders, and parcels across the city.', icon: '📦' },
        { title: '🚚 Interstate Cargo & Haulage Services', description: 'Safe interstate truck delivery for commercial goods and raw materials with waybill tracking.', icon: '🚚' },
        { title: '💵 Instant Delivery Price Quote on WhatsApp', description: 'Get your exact delivery rate in 3 seconds based on pickup and drop-off locations.', icon: '💵' }
      ],
      aboutText: `${name} provides dependable dispatch, haulage, and supply chain logistics across ${area} and nationwide, ensuring safe, punctual cargo delivery.`,
      testimonials: [
        { name: 'Boutique Owner, Lekki', text: 'Their automated delivery fee quote makes customer checkout effortless on our WhatsApp page.', rating: 5 },
        { name: 'Manager, FMCG Distributors', text: 'Reliable haulage dispatch and transparent diesel reconciliation for our interstate fleet.', rating: 5 }
      ],
      ctaText: hasWebsite ? 'Get 1-Line WhatsApp Embed (₦35,000)' : 'Claim Official Website (₦35k Deposit)'
    };
  }

  // 10. EVENT CENTERS & BANQUET HALLS
  if (/event|hall|banquet|decor|cater|party|wedding/.test(cat)) {
    return {
      heroTitle: `${name} — Elegant Event Center & Party Hall in ${area}`,
      heroSubtitle: `Host your wedding reception, birthday party, and corporate conference in a spacious, fully air-conditioned hall with ample parking.`,
      services: [
        { title: '🎉 Spacious Air-Conditioned Hall & Seating', description: 'Accommodates 200 to 1,500 guests with elegant banquet or conference seating arrangement.', icon: '🎉' },
        { title: '⚡ 24/7 Heavy-Duty Power & Secure Parking', description: 'Uninterrupted generator power supply, clean luxury restrooms, and 24/7 armed security.', icon: '⏰' },
        { title: '📅 Check Hall Availability on WhatsApp', description: 'Check open event dates and lock your booking deposit with instant WhatsApp confirmation.', icon: '📅' }
      ],
      aboutText: `${name} is an exquisite event center in ${area} featuring climate-controlled banquet halls, ample secure parking, and majestic aesthetics for memorable celebrations.`,
      testimonials: [
        { name: 'Mrs. Yetunde A.', text: 'Our wedding reception was spectacular! The hall was cool, spacious, and the lighting was breathtaking.', rating: 5 },
        { name: 'Corporate Events Lead', text: 'Prime location, impeccable facilities, uninterrupted generator light, and easy booking system.', rating: 5 }
      ],
      ctaText: hasWebsite ? 'Get 1-Line WhatsApp Embed (₦35,000)' : 'Claim Official Website (₦35k Deposit)'
    };
  }

  // DEFAULT / GENERAL PROFESSIONAL SERVICES
  return {
    heroTitle: `${name} — Official Online Storefront & WhatsApp Order Desk in ${area}`,
    heroSubtitle: `Get discovered on Google search, showcase your products and services with clear prices, and close more sales 24/7 on WhatsApp.`,
    services: [
      { title: '🚀 Get Found on Google Search', description: 'Stop losing local customers to competitors when people search Google for services in your area.', icon: '🚀' },
      { title: '📱 24/7 WhatsApp Price List & Order Desk', description: 'No more typing prices one by one in DM. Customers view your catalog and place orders directly on WhatsApp.', icon: '📱' },
      { title: '💳 Moniepoint & OPay Verified Bank Transfer', description: 'Collect customer payments safely with instant confirmation and zero fear of fake bank alerts.', icon: '💳' }
    ],
    aboutText: `${name} is a verified commercial enterprise in ${area} dedicated to delivering top-tier services, responsive customer support, and measurable value to every client.`,
    testimonials: [
      { name: 'Chukwuemeka A.', text: 'The WhatsApp autoresponder answered our late-night inquiry instantly. Very professional service!', rating: 5 },
      { name: 'Adaeze O.', text: 'Clear prices, quick response, and smooth payment confirmation. Highly recommended business in Lagos.', rating: 5 }
    ],
    ctaText: hasWebsite ? 'Get 1-Line WhatsApp Embed (₦35,000)' : 'Claim Official Website (₦35k Deposit)'
  };
}

export async function generateCopyWithVertexAI(
  lead: any,
  accessToken: string,
  projectId: string
): Promise<GeneratedSiteResponse> {
  const prompt = buildGenerationPrompt(lead);

  const endpoint = `https://us-central1-aiplatform.googleapis.com/v1/projects/${projectId}/locations/us-central1/publishers/google/models/gemini-1.5-flash:generateContent`;

  const resp = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    }),
  });

  if (!resp.ok) {
    const err = await resp.json();
    throw new Error(`Vertex AI error: ${err.error?.message || resp.statusText}`);
  }

  const data = await resp.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

  // Parse JSON from response
  try {
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON found in Vertex AI response');
    return JSON.parse(jsonMatch[0]) as GeneratedSiteResponse;
  } catch {
    return { copy: buildFallbackCopy(lead) };
  }
}

export async function generateCopyWithGeminiApiKey(
  lead: any,
  apiKey: string
): Promise<GeneratedSiteResponse> {
  const prompt = buildGenerationPrompt(lead);

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const resp = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 4096,
        responseMimeType: 'application/json',
      },
    }),
  });

  if (!resp.ok) {
    const err = await resp.json();
    throw new Error(`Gemini AI Studio error: ${err.error?.message || resp.statusText}`);
  }

  const data = await resp.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

  // Parse JSON from response
  try {
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON found in Gemini AI Studio response');
    return JSON.parse(jsonMatch[0]) as GeneratedSiteResponse;
  } catch (err: any) {
    console.error('Failed to parse Gemini response:', err.message, 'Raw text:', rawText);
    return { copy: buildFallbackCopy(lead) };
  }
}

import {
  renderRelumeNavbar,
  renderRelumeHero,
  renderRelumeFeatureGrid,
  renderRelumeStats,
  renderRelumeCTA,
  renderRelumeFooter
} from './relumeComponents';

/**
 * Generates a full, responsive Relume UI Page HTML for any lead (existing or generated)
 */
export function renderFullRelumeSitePage(lead: any): string {
  const params = {
    businessName: lead.business_name || lead.name || 'Business',
    category: lead.category,
    tagline: lead.business_summary || lead.notes,
    phone: lead.phone || lead.rawPhone || '2348022791227',
    email: lead.email,
    address: lead.address,
    heroImageUrl: lead.photos_data?.heroImageUrl || lead.maps_images?.[0],
    logoUrl: lead.photos_data?.logoUrl,
    speedScore: lead.photos_data?.pageSpeed?.score
  };

  const nav = renderRelumeNavbar(params);
  const hero = renderRelumeHero(params);
  const features = renderRelumeFeatureGrid(params);
  const stats = renderRelumeStats();
  const cta = renderRelumeCTA(params);
  const footer = renderRelumeFooter(params);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${params.businessName} — Modern Digital Experience</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background-color: #0f172a; font-family: 'Segoe UI', Roboto, sans-serif; color: #f8fafc; line-height: 1.5; }
  </style>
</head>
<body>
  ${nav}
  ${hero}
  ${features}
  ${stats}
  ${cta}
  ${footer}
</body>
</html>`;
}

