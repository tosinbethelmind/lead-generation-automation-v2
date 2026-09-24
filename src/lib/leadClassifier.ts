/**
 * @file src/lib/leadClassifier.ts
 * 
 * 🛡️ BULLETPROOF BUSINESS-NAME-FIRST SECTOR CLASSIFIER & HOOK GENERATOR
 * Bethelmind Analytics Lagos Desk · Commercial Growth Engine
 */

export interface SectorDefinition {
  id: string;
  name: string;
  regex: RegExp;
  smsHook: (name: string) => string;
  waPain: string;
  waFeature: string;
}

export const SECTOR_PATTERNS: SectorDefinition[] = [
  {
    id: 'solar',
    name: 'Solar & Renewable Energy',
    regex: /(solar|inverter|battery|batteries|renewable|photovoltaic|clean\s*energy|power\s*system)/i,
    smsHook: (name) => `Good day ${name} team. After-hours solar clients wait hours for quotes. We built a 24/7 WhatsApp BOQ quoter for your firm. May I send a quick demo?`,
    waPain: "Most solar clients message after work hours asking for system prices. Waiting hours to manually compute load sheets and BOQs costs you deals every week.",
    waFeature: "We built a 24/7 WhatsApp Solar BOQ & Load Sizing Engine for your firm that computes inverter and battery sizes and sends clients instant quotations."
  },
  {
    id: 'beauty',
    name: 'Beauty, Cosmetics & Spas',
    regex: /(beauty|cosmetic|cosmetics|hair|wig|wigs|salon|spa|spas|skincare|skin\s*care|makeup|make-up|lash|lashes|nail|nails|glam|barbing|barber)/i,
    smsHook: (name) => `Good day ${name} team. Late-night Instagram buyers ask for prices and wait. We built a 24/7 WhatsApp catalog closer for you. May I send a quick demo?`,
    waPain: "Instagram and TikTok clients ask 'How much is this?' at odd hours. Replying manually to dozens of DMs every day is exhausting and loses sales.",
    waFeature: "We built a 24/7 WhatsApp VIP Order & Catalog Assistant that shows available stock, prices, takes orders, and closes buyers automatically."
  },
  {
    id: 'restaurant',
    name: 'Restaurants, Eateries & Food',
    regex: /(restaurant|amala|bukka|kitchen|eatery|eateries|food|cafe|grill|bakery|cake|cakes|bistro|diner|catering|chops|fast\s*food|sharwama|lounge)/i,
    smsHook: (name) => `Good day ${name} team. Dinner & weekend clients asking for menu prices wait for replies. We built a 24/7 WhatsApp menu closer. May I send a quick demo?`,
    waPain: "Customers looking for menus, food platters, and table reservations message during rush hours and late evenings. Slow responses mean they order from another spot.",
    waFeature: "We built a 24/7 WhatsApp Instant Menu & Food Ordering Assistant that displays food photos, prices, delivery rates, and confirms orders in seconds."
  },
  {
    id: 'hotel',
    name: 'Hotels, Shortlets & Apartments',
    regex: /(hotel|hotels|shortlet|shortlets|apartment|apartments|suite|suites|resort|resorts|lodge|lodges|guest\s*house|inn|motel|hospitality)/i,
    smsHook: (name) => `Good day ${name} team. Guests checking rooms at night often book elsewhere. We built a 24/7 direct WhatsApp booking tool. May I share a quick demo?`,
    waPain: "Guests traveling late into Lagos message at 10 PM looking for available rooms. Slow replies mean they book elsewhere.",
    waFeature: "We built a 24/7 Direct WhatsApp Booking & Photo Showcase Assistant that shows room availability, room photos, and direct booking with ₦0 commission."
  },
  {
    id: 'real_estate',
    name: 'Real Estate & Properties',
    regex: /(real\s*estate|property|properties|realtor|realtors|realty|estate|estates|homes|housing|land|lands|surveyor|pwan|adron|duplex|terrace)/i,
    smsHook: (name) => `Good day ${name} team. Property buyers inquiring after hours wait hours for specs. We built a 24/7 WhatsApp property brochure bot. May I send a demo?`,
    waPain: "High-net-worth property buyers and diaspora investors message across different time zones. Waiting for agent callbacks causes buyer drop-off.",
    waFeature: "We built a 24/7 WhatsApp Property Inspection & Video Brochure Assistant that sends verified floor plans, video walk-throughs, and schedules site visits."
  },
  {
    id: 'clinic',
    name: 'Clinics & Healthcare',
    regex: /(clinic|clinics|hospital|hospitals|dental|dentist|dentists|doctor|doctors|medical|optician|opticians|pharmacy|pharmacies|maternity|diagnostic|pediatric|healthcare)/i,
    smsHook: (name) => `Good day ${name} team. Patients booking after clinic hours experience delays. We built a 24/7 WhatsApp patient booking tool. May I send a quick demo?`,
    waPain: "Patients looking for appointments or procedure fees after clinic hours often hesitate or call elsewhere when lines don't pick up.",
    waFeature: "We built a 24/7 WhatsApp Patient Booking & Fee Assistant for your clinic that schedules consultations and locks appointment slots automatically."
  },
  {
    id: 'school',
    name: 'Schools & Academies',
    regex: /(school|schools|academy|academies|college|colleges|creche|creches|nursery|kindergarten|grammar|high\s*school|institute|tutors|education)/i,
    smsHook: (name) => `Good day ${name} team. Parents inquiring for admissions need instant fee info. We built a 24/7 WhatsApp enquiry tool for you. May I send a demo?`,
    waPain: "Parents inquiring about admissions and school fees want quick clarity without having to visit the school premises during working hours.",
    waFeature: "We built a 24/7 WhatsApp Admissions & Term Fee Assistant that answers parents' questions, explains curriculum, and schedules school tours."
  },
  {
    id: 'auto',
    name: 'Automotive & Dealerships',
    regex: /(auto|autos|dealership|tokunbo|motor|motors|spare\s*parts?|mechanic|garage|tyre|tyres|vehicle|vehicles|automotive)/i,
    smsHook: (name) => `Good day ${name} team. Buyers inquiring for car pricing wait hours for details. We built a 24/7 WhatsApp auto quote tool. May I share a quick demo?`,
    waPain: "Car buyers comparing prices message late at night. If they don't get instant specs and pricing, they keep scrolling other dealers.",
    waFeature: "We built a 24/7 WhatsApp Car Catalog & Finance Quoter that shares specs, clear photos, inspection booking, and price estimates instantly."
  },
  {
    id: 'logistics',
    name: 'Logistics, Freight & Haulage',
    regex: /(logistics|freight|cargo|haulage|courier|couriers|waybill|dispatch|shipping|clearing|forwarding)/i,
    smsHook: (name) => `Good day ${name} team. Shippers inquiring after hours wait for freight rates. We built a 24/7 WhatsApp waybill calculator. May I send a quick demo?`,
    waPain: "Waybill and cargo clients demand instant delivery rates. Waiting for dispatchers to compute rates delays shipments.",
    waFeature: "We built a 24/7 Waybill Rate Calculator & Tracking Assistant that computes instant delivery costs and updates tracking automatically."
  },
  {
    id: 'fashion',
    name: 'Fashion, Apparel & Luxury',
    regex: /(fashion|boutique|boutiques|apparel|clothing|cloth|wears|wear|luxury|tailor|tailoring|couture|fabrics|textiles|shoes|footwear)/i,
    smsHook: (name) => `Good day ${name} team. Shoppers asking for outfit sizes and prices wait hours. We built a 24/7 WhatsApp fashion catalog closer. May I send a demo?`,
    waPain: "Fashion buyers messaging on WhatsApp or Instagram ask for size, color availability, and prices at night.",
    waFeature: "We built a 24/7 WhatsApp Fashion Showcase & Instant Order Closer that displays lookbooks, takes measurements, and confirms orders."
  },
  {
    id: 'legal',
    name: 'Legal & Law Chambers',
    regex: /(law\s*firm|law\s*chamber|chambers|solicitor|barrister|attorney|legal)/i,
    smsHook: (name) => `Good day ${name} team. Clients seeking legal consultations wait hours for response. We built a 24/7 WhatsApp intake assistant. May I send a demo?`,
    waPain: "Clients needing urgent legal consultation or corporate CAC setup wait hours to know consultation fees.",
    waFeature: "We built a 24/7 WhatsApp Client Intake & Consultation Scheduler that pre-qualifies inquiries and books attorney consultations."
  }
];

export const GENERAL_SME_FALLBACK: SectorDefinition = {
  id: 'general_sme',
  name: 'Commercial Enterprise',
  regex: /.*/,
  smsHook: (name: string) => `Good day ${name} team. After-hours clients asking for prices wait hours for replies. We built a 24/7 WhatsApp quoting bot for your firm. May I send a demo?`,
  waPain: "In Nigeria today, once it's past 6 PM or on weekends, customers message on WhatsApp asking for prices. When they wait more than 5 minutes without a response, they move to another competitor.",
  waFeature: "We built an instant 24/7 Automated Quoting & Sales Assistant customized with your business catalog and pricing so you never lose after-hours buyers."
};

export function cleanBusinessName(name?: string): string {
  if (!name) return 'Commercial Business';
  let cleaned = name.split('||')[0].split('|')[0].split('-')[0].trim();
  cleaned = cleaned.replace(/\(.*?\)/g, '').replace(/\[.*?\]/g, '').trim();
  return cleaned.trim() || 'Commercial Business';
}

export function getShortBrand(rawName?: string): string {
  const cleaned = cleanBusinessName(rawName);
  const words = cleaned.split(/\s+/);
  if (words.length <= 2) return cleaned.slice(0, 14);
  let candidate = words[0] + ' ' + words[1];
  if (candidate.length > 14) candidate = words[0];
  return candidate.slice(0, 14).trim();
}

export function classifyLeadSector(lead: { name?: string; business_name?: string; leadName?: string; category?: string; sector?: string; niche?: string }): SectorDefinition {
  const rawName = cleanBusinessName(lead.name || lead.business_name || lead.leadName || '');
  const rawCategory = (lead.category || lead.sector || lead.niche || '').toLowerCase();

  for (const sector of SECTOR_PATTERNS) {
    if (sector.regex.test(rawName)) {
      return sector;
    }
  }

  if (rawCategory && !/general|sme|commercial|business|other/i.test(rawCategory)) {
    for (const sector of SECTOR_PATTERNS) {
      if (sector.regex.test(rawCategory)) {
        return sector;
      }
    }
  }

  return GENERAL_SME_FALLBACK;
}

export function formatSmsGuaranteed(lead: any) {
  const rawName = cleanBusinessName(lead.name || lead.business_name || lead.leadName || 'Business');
  const shortBrand = getShortBrand(rawName);
  const sector = classifyLeadSector(lead);

  let prepSms = sector.smsHook(shortBrand);
  if (prepSms.length > 158) {
    prepSms = prepSms.slice(0, 158);
  }

  const nameSlug = rawName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 16);
  const slug = (lead.lead_id && !lead.lead_id.includes('_det_') && !lead.lead_id.includes('lead_1'))
    ? lead.lead_id.slice(0, 18)
    : (nameSlug || 'demo');
  const previewUrl = `https://www.bethelmindanalytics.com/preview/${slug}`;
  const prefill = encodeURIComponent(shortBrand);
  let linkSms = `Hello ${shortBrand}! Tap demo: ${previewUrl} (WhatsApp: wa.me/2348022791227?text=${prefill})`;
  if (linkSms.length > 158) {
    linkSms = linkSms.slice(0, 158);
  }

  return {
    prepSms,
    linkSms,
    sectorId: sector.id,
    sectorName: sector.name,
    shortBrand,
    previewUrl
  };
}
