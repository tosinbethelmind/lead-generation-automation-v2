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
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1400&q=80',
  ],
  realestate: [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1400&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1400&q=80',
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1400&q=80',
    'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1400&q=80',
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
  ],
  default: [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=80',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1400&q=80',
    'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1400&q=80',
  ]
};

const FONT_PAIRINGS = [
  { headingFont: 'Space Grotesk', bodyFont: 'Outfit' },
  { headingFont: 'Playfair Display', bodyFont: 'Plus Jakarta Sans' },
  { headingFont: 'Syne', bodyFont: 'Inter' },
  { headingFont: 'Outfit', bodyFont: 'Plus Jakarta Sans' },
  { headingFont: 'DM Serif Display', bodyFont: 'Cabin' },
  { headingFont: 'Plus Jakarta Sans', bodyFont: 'Inter' }
];

export function getDesignTheme(category: string, leadIdSeed?: string): DesignTheme {
  const cat = category.toLowerCase();
  const seed = hashString((leadIdSeed || '') + category);

  let categoryKey = 'default';
  if (/solar|inverter|energy|battery/.test(cat)) categoryKey = 'solar';
  else if (/estate|property|home|realty|housing/.test(cat)) categoryKey = 'realestate';
  else if (/car|auto|motor|vehicle|tokunbo/.test(cat)) categoryKey = 'automotive';
  else if (/medical|clinic|doctor|health/.test(cat)) categoryKey = 'medical';

  // Generate unique primary & accent hues per lead seed
  const primaryHue = (seed * 47) % 360;
  const accentHue = (primaryHue + 150 + (seed % 60)) % 360;

  const primaryColor = `hsl(${primaryHue}, 85%, 52%)`;
  const accentColor = `hsl(${accentHue}, 90%, 60%)`;
  const bgDarkColor = `hsl(${(primaryHue + 25) % 360}, 50%, 4%)`; // Deep obsidian space with subtle hue tint

  const gradientAngle = 110 + (seed % 60);
  const gradient = `linear-gradient(${gradientAngle}deg, ${primaryColor} 0%, hsl(${(primaryHue + 35) % 360}, 80%, 48%) 50%, ${accentColor} 100%)`;

  const imageBank = HERO_IMAGE_BANKS[categoryKey] || HERO_IMAGE_BANKS['default'];
  const heroImage = imageBank[seed % imageBank.length];

  const fontPairing = FONT_PAIRINGS[seed % FONT_PAIRINGS.length];

  return {
    primary: primaryColor,
    accent: accentColor,
    bg: bgDarkColor,
    text: '#ffffff',
    font: fontPairing.headingFont,
    headingFont: fontPairing.headingFont,
    bodyFont: fontPairing.bodyFont,
    heroImage,
    gradient,
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
1. Choose design tokens (primary color, accent color, background, text color, font, headingFont, bodyFont, CSS gradient) that match the mood and premium/luxurious vibe of this specific business. If the business has an existing website dominant color (and it's a valid hex code), prioritize using or adapting that color as the primary theme color.
2. Under "testimonials", use or adapt the real Google reviews provided in "Actual Google Reviews (JSON)" to populate the testimonials list (up to 3 items) instead of fabricating completely random names/reviews.
3. Under "services", incorporate the actual services from "Services Offered (JSON array)" if present, or expand upon them matching the category. Make sure there are exactly 3 services.
4. Try to select a "heroImage" URL from the "Business Photos (JSON array)" if there are any valid URLs. If none, do not specify it (it will default to a high-quality Unsplash category image).
5. CRITICAL UPGRADE & MODERNIZATION PIPELINE RULES:
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
      heroTitle: `${name} — 24/7 AI Solar Sizing & Instant Quotes`,
      heroSubtitle: `Generate 5kVA–20kVA Solar Hybrid BOQs, DisCo Band A Tariff ROI, and LiFePO4 battery sizing sent to your customer's WhatsApp in 2 minutes.`,
      services: [
        { title: '⚡ 24/7 WhatsApp AI Solar BOQ Engine', description: 'Sizes inverters, mono panels, and LiFePO4 batteries automatically based on customer appliance loads.', icon: '⚡' },
        { title: '📊 DisCo Band A vs. Solar ROI Calculator', description: 'Calculates grid tariff avoidance (₦209.50/kWh) and monthly generator diesel savings vs solar payback.', icon: '📊' },
        { title: '💳 Instant Branded PDF Proposal & Bank Gateway', description: 'Generates professional itemized BOQ quotes with instant OPay & Moniepoint transfer verification.', icon: '📄' }
      ],
      aboutText: `${name} is a premier solar EPC & inverter integration contractor in ${area}. We help residential and commercial clients eliminate diesel generator costs with high-yield hybrid solar systems.`,
      testimonials: [
        { name: 'Engr. Femi Adeleke', text: 'The instant solar sizing calculator saved our sales team hours of site assessments. Clients love the fast PDF proposals!', rating: 5 },
        { name: 'Dr. (Mrs) Alabi', text: 'Clean 10kVA hybrid setup. Responsive 24/7 WhatsApp support and transparent pricing.', rating: 5 }
      ],
      ctaText: hasWebsite ? 'Upgrade My Solar Quoting Engine' : 'Claim My Solar Lead & Quoting Website'
    };
  }

  // 2. REAL ESTATE & LUXURY HOMES
  if (/estate|property|home|realty|housing|developer|land/.test(cat)) {
    return {
      heroTitle: `${name} — Luxury Properties & Automated Investor Leads`,
      heroSubtitle: `Capture high-net-worth local & diaspora buyers with 1-click mortgage calculators, off-plan milestone escrow, and WhatsApp virtual inspections.`,
      services: [
        { title: '🏠 Mortgage & Off-Plan Installment Sizer', description: 'Calculates down-payments, survey/deed ancillary levies, and monthly building milestones automatically.', icon: '🏠' },
        { title: '🌍 Diaspora Forex & WebRTC Virtual Inspection', description: 'Computes parallel USD/GBP conversion rates and schedules live 1-click video property walk-throughs.', icon: '📹' },
        { title: '📋 Realtor Commission & 5% WHT Ledger', description: 'Routes verified buyer leads to sales agents and tracks deal closures with automated documentation.', icon: '🤝' }
      ],
      aboutText: `${name} delivers premier luxury homes, commercial developments, and vetted land banking opportunities across ${area}. Trusted for verified titles, Governor's Consent, and architectural excellence.`,
      testimonials: [
        { name: 'Chief Olumide B.', text: 'The virtual tour and installment schedule gave us complete peace of mind investing from the UK.', rating: 5 },
        { name: 'Barr. Folake T.', text: 'Transparent documentation and seamless buying experience. Excellent team in Lagos.', rating: 5 }
      ],
      ctaText: hasWebsite ? 'Upgrade My Real Estate Portal' : 'Claim My Luxury Property Portal'
    };
  }

  // 3. AUTOMOTIVE & TOKUNBO IMPORTERS
  if (/car|auto|motor|vehicle|tokunbo|dealership|mechanic/.test(cat)) {
    return {
      heroTitle: `${name} — Direct Tokunbo Imports & Instant Duty Quotes`,
      heroSubtitle: `Provide buyers instant customs duty assessments, trade-in valuations, and 24/7 WhatsApp vehicle inventory updates across Lagos.`,
      services: [
        { title: '🚗 Customs Duty Assessment (PAAR) Calculator', description: 'Estimates VIN duty, NAC levy, and port clearing fees accurately for prospective buyers.', icon: '🚗' },
        { title: '🔄 Car Swap & Trade-In Valuation Engine', description: 'Offers prospective clients instant asset appraisals to capture and close high-value upgrade leads.', icon: '🔄' },
        { title: '🤖 24/7 WhatsApp Stock & Test Drive Assistant', description: 'Sends live showroom photos, specs, and inspection bookings directly to customer phones.', icon: '📱' }
      ],
      aboutText: `${name} is a leading automotive dealership in ${area} providing thoroughly inspected Nigerian used and foreign used (Tokunbo) vehicles with genuine customs documentation.`,
      testimonials: [
        { name: 'Capt. Ibrahim M.', text: 'Fair trade-in valuation and transparent customs clearing breakdown. Got my SUV in 48 hours.', rating: 5 },
        { name: 'Segun Oladipo', text: 'Best dealership experience in Lagos. Verified VIN and clean engine.', rating: 5 }
      ],
      ctaText: hasWebsite ? 'Upgrade My Auto Sales Engine' : 'Claim My Auto Dealership Website'
    };
  }

  // 4. MEDICAL & HEALTHCARE CLINICS
  if (/medical|clinic|doctor|health|hospital|pharmacy|dental|lab/.test(cat)) {
    return {
      heroTitle: `${name} — 24/7 Patient Triage & HMO Telehealth Portal`,
      heroSubtitle: `Streamline patient appointments, HMO co-pay authorizations, and diagnostic lab package bookings with zero waiting room delays.`,
      services: [
        { title: '🩺 HMO Claims & Tariff Authorization Reconciler', description: 'Verifies Reliance, AXA Mansard, Hygeia, and Leadway HMO tariff copays in under 3 seconds.', icon: '🩺' },
        { title: '🏥 Surgery & Admission Deposit Estimator', description: 'Itemizes ward rates, theatre fees, and deposits with transparent printable estimates.', icon: '🏥' },
        { title: '📅 24/7 WhatsApp Patient Triage & Booking', description: 'Books doctor consultation slots and sends automated pre-visit fasting instructions.', icon: '📅' }
      ],
      aboutText: `${name} provides compassionate, world-class healthcare services in ${area}. Committed to clinical excellence, modern diagnostic technology, and rapid patient recovery.`,
      testimonials: [
        { name: 'Mrs. Kemi Johnson', text: 'Booking our family consultation via WhatsApp saved us hours at the reception. Superb doctors!', rating: 5 },
        { name: 'Pastor David E.', text: 'Clean facilities, prompt triage, and seamless HMO verification.', rating: 5 }
      ],
      ctaText: hasWebsite ? 'Upgrade My Clinic Portal' : 'Claim My Medical Clinic Website'
    };
  }

  // 5. SCHOOLS & ACADEMIES
  if (/school|academy|education|college|creche|tutor/.test(cat)) {
    return {
      heroTitle: `${name} — Excellence in Education & Smart Portal`,
      heroSubtitle: `Simplify termly tuition fee schedules, CBT exam scoring, and WhatsApp result checker PIN generation for modern parents.`,
      services: [
        { title: '🎓 Termly Tuition & Boarding Fee Estimator', description: 'Calculates tuition, uniforms, and books with flexible structured installment plans.', icon: '🎓' },
        { title: '📜 CBT Exam Scoring & Automated Broadsheet', description: 'Computes continuous assessments and generates printable termly performance reports.', icon: '📜' },
        { title: '🔑 WhatsApp Result PIN Dispenser', description: 'Dispenses scratch card result checker PINs automatically upon instant OPay transfer.', icon: '🔑' }
      ],
      aboutText: `${name} is an esteemed educational institution in ${area} nurturing academic excellence, moral leadership, and creative innovation in every student.`,
      testimonials: [
        { name: 'Dr. (Mrs) Okafor', text: 'The online fee breakdown and instant result PIN access make termly registration stress-free.', rating: 5 },
        { name: 'Engr. Taiwo B.', text: 'Outstanding academic standards and very responsive administration.', rating: 5 }
      ],
      ctaText: hasWebsite ? 'Upgrade My School Portal' : 'Claim My Academy Website'
    };
  }

  // 6. LAW FIRMS & LEGAL PRACTITIONERS
  if (/law|legal|attorney|solicitor|advocate|barrister|cac/.test(cat)) {
    return {
      heroTitle: `${name} — Premier Corporate & Commercial Legal Suite`,
      heroSubtitle: `Automate CAC compliance audits, SCUML anti-money laundering checks, and retainer debit note generation for corporate clients.`,
      services: [
        { title: '⚖️ CAC Filing, Stamp Duty & RC Number Calculator', description: 'Itemizes statutory government filing fees and stamp duties for business incorporations.', icon: '⚖️' },
        { title: '🛡️ SCUML Compliance & Corporate Shield', description: 'Audits company compliance status and generates statutory debit notes in minutes.', icon: '🛡️' },
        { title: '📄 1-Click Retainer & NDA Contract Generator', description: 'Generates branded legal retainers with digital signature and OPay escrow settlement.', icon: '📄' }
      ],
      aboutText: `${name} is a distinguished law practice in ${area} providing astute counsel in corporate law, real estate conveyancing, intellectual property, and commercial dispute resolution.`,
      testimonials: [
        { name: 'MD, Global Tech Ltd', text: 'Prompt CAC corporate filing and seamless retainer invoicing. Essential legal partners for our business.', rating: 5 },
        { name: 'Alhaji Sanusi K.', text: 'Thorough due diligence and contract negotiation. Highly recommended legal team.', rating: 5 }
      ],
      ctaText: hasWebsite ? 'Upgrade My Law Firm Portal' : 'Claim My Legal Practice Portal'
    };
  }

  // 7. HOTELS & SHORTLET APARTMENTS
  if (/hotel|shortlet|apartment|suite|hospitality|resort|lodge/.test(cat)) {
    return {
      heroTitle: `${name} — Luxury Stay & Direct Booking Engine`,
      heroSubtitle: `Bypass 20% OTA commissions with direct 24/7 WhatsApp bookings, caution deposit verification, and generator diesel power tracking.`,
      services: [
        { title: '🏨 24/7 Direct WhatsApp Booking Engine', description: 'Collects verified guest dates and deposits directly into your bank without intermediary fees.', icon: '🏨' },
        { title: '⚡ Power & Diesel Expense Reconciliation', description: 'Monitors daily kWh consumption and manages automatic caution deposit refund calculation.', icon: '⚡' },
        { title: '💳 Moniepoint & OPay Caution Deposit Gateway', description: 'Instant transfer verification and automated check-in digital key dispatch.', icon: '💳' }
      ],
      aboutText: `${name} offers serene, luxurious accommodations in ${area} featuring 24/7 uninterrupted power, high-speed fiber internet, and bespoke hospitality services.`,
      testimonials: [
        { name: 'Amaka Eze', text: 'Loved the fast WhatsApp booking and instant check-in. The apartment was immaculate with 24/7 power!', rating: 5 },
        { name: 'Tunde Bakare', text: 'Top tier shortlet in Lagos. Seamless caution deposit refund right after checkout.', rating: 5 }
      ],
      ctaText: hasWebsite ? 'Upgrade My Hotel Booking Engine' : 'Claim My Luxury Hospitality Website'
    };
  }

  // 8. LOGISTICS, HAULAGE & DISPATCH
  if (/logistics|haulage|courier|dispatch|delivery|freight|cargo|truck/.test(cat)) {
    return {
      heroTitle: `${name} — Smart Logistics & Instant Delivery Pricing`,
      heroSubtitle: `Compute intra-Lagos bike delivery fees, interstate 30-ton haulage diesel expenses, and POD rider cash remittances on autopilot.`,
      services: [
        { title: '📦 Intra-Lagos Delivery Fee Sizer (Ikeja to Lekki)', description: 'Calculates dynamic delivery rates based on distance, pickup zone, and package weight.', icon: '📦' },
        { title: '🚚 Interstate Haulage Diesel & Union Tax Estimator', description: 'Computes diesel litre allocations, highway taxes, and net profit per trip corridor.', icon: '🚚' },
        { title: '💵 POD Rider Cash Collection Reconciler', description: 'Tracks cash on delivery remittances and waybill confirmations in real time.', icon: '💵' }
      ],
      aboutText: `${name} provides dependable dispatch, haulage, and supply chain logistics across ${area} and nationwide, ensuring safe, punctual cargo delivery.`,
      testimonials: [
        { name: 'Boutique Owner, Lekki', text: 'Their automated delivery fee quote makes customer checkout effortless on our WhatsApp page.', rating: 5 },
        { name: 'Manager, FMCG Distributors', text: 'Reliable haulage dispatch and transparent diesel reconciliation for our interstate fleet.', rating: 5 }
      ],
      ctaText: hasWebsite ? 'Upgrade My Logistics Engine' : 'Claim My Logistics Website'
    };
  }

  // 9. EVENT CENTERS & BANQUET HALLS
  if (/event|hall|banquet|decor|cater|party|wedding/.test(cat)) {
    return {
      heroTitle: `${name} — Grand Events & Automated Date Reservations`,
      heroSubtitle: `Size banquet seating capacities, decor lighting packages, and overtime caution bonds with instant WhatsApp event quotes.`,
      services: [
        { title: '🎉 Guest Capacity & Banquet Decor Estimator', description: 'Sizes hall packages, lighting, and sound gear tailored to guest headcount.', icon: '🎉' },
        { title: '⏰ Overtime & Caution Bond Calculator', description: 'Computes hourly overtime rates and post-event sanitization bonds accurately.', icon: '⏰' },
        { title: '📅 24/7 WhatsApp Event Date Checker', description: 'Allows wedding and corporate planners to check date availability and lock reservation deposits.', icon: '📅' }
      ],
      aboutText: `${name} is an exquisite event center in ${area} featuring climate-controlled banquet halls, ample secure parking, and majestic aesthetics for memorable celebrations.`,
      testimonials: [
        { name: 'Mrs. Yetunde A.', text: 'Our wedding reception was spectacular! The decor pricing calculator gave us complete budget clarity.', rating: 5 },
        { name: 'Corporate Events Lead', text: 'Prime location, impeccable facilities, and easy date reservation system.', rating: 5 }
      ],
      ctaText: hasWebsite ? 'Upgrade My Event Hall Engine' : 'Claim My Event Center Website'
    };
  }

  // DEFAULT / GENERAL PROFESSIONAL SERVICES
  return {
    heroTitle: `${name} — 24/7 AI Sales & Automation Engine`,
    heroSubtitle: `Capture 3.5x more local clients in ${area} with automated WhatsApp auto-responders, instant quote generators, and direct bank payments.`,
    services: [
      { title: '🤖 24/7 WhatsApp AI Customer Concierge', description: 'Answers customer inquiries, voice notes, and price requests automatically within 3 seconds.', icon: '🤖' },
      { title: '⚡ 1-Click Instant Quote & Proposal Estimator', description: 'Generates branded PDF invoices and service quotes sent directly to customer phones.', icon: '⚡' },
      { title: '💳 Moniepoint & OPay Direct Transfer Gateway', description: 'Collects verified customer payments straight into your bank account with instant receipts.', icon: '💳' }
    ],
    aboutText: `${name} is a verified enterprise in ${area} dedicated to delivering top-tier services, responsive customer support, and measurable value to every client.`,
    testimonials: [
      { name: 'Chukwuemeka A.', text: 'The WhatsApp AI autoresponder responded to our late-night inquiry instantly. Exceptional setup!', rating: 5 },
      { name: 'Adaeze O.', text: 'Transparent quotes and very smooth payment process. Highly recommended business in Lagos.', rating: 5 }
    ],
    ctaText: hasWebsite ? 'Upgrade My Business System' : 'Claim My Business Website & AI Engine'
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

