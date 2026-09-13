/**
 * @file src/lib/scraping/crossRepoTaxonomy.ts
 * 
 * 🇳🇬 CROSS-REPOSITORY NIGERIAN COMMERCIAL TAXONOMY MATRIX
 * Bethelmind Analytics Commercial Growth Engine
 * 
 * Harvests high-intent commercial sector queries and contractor categories inspired by:
 * 1. Solar ROI Proposal Builder (Solar Contractors, Generator vs Solar, Hospital & Hotel Power)
 * 2. servicehub-nigeria (Artisans, HVAC, Electrical, Plumbing, Mechanics across Lagos, Abuja, PH)
 * 3. logistic webapp (Apapa Port Freight Forwarders, Haulage, Customs Clearing)
 * 4. Nationwide 36 States + FCT Geo-Political Trade Corridors
 */

export interface UnifiedCommercialSector {
  key: string;
  category: string;
  businessListPath: string;
  finelibPath: string;
  keywords: string[];
  buyingPowerScore: number;
}

export const UNIFIED_COMMERCIAL_SECTORS: UnifiedCommercialSector[] = [
  // ── SOLAR & ENERGY (From Solar ROI Proposal Builder) ──
  {
    key: 'solar_inverter',
    category: 'Solar Energy & Inverter Systems',
    businessListPath: 'category/solar-energy',
    finelibPath: 'business/energy/alternative-energy/solar-energy',
    keywords: ['solar inverter', 'solar panel installation', 'hybrid inverter', 'lithium battery solar'],
    buyingPowerScore: 98
  },
  {
    key: 'generator_power',
    category: 'Heavy Generators & Industrial Power',
    businessListPath: 'category/generators',
    finelibPath: 'business/energy/generators',
    keywords: ['diesel generator Mikano', 'Perkins generator supplier', 'generator repair maintenance'],
    buyingPowerScore: 96
  },

  // ── HEALTHCARE & CLINICS ──
  {
    key: 'medical_clinics',
    category: 'Private Hospitals & Diagnostic Clinics',
    businessListPath: 'category/hospitals-and-clinics',
    finelibPath: 'business/health-and-medicine/hospitals-and-clinics',
    keywords: ['private hospital clinic', 'diagnostic laboratory medical', 'dental clinic care'],
    buyingPowerScore: 97
  },

  // ── REAL ESTATE & LUXURY SHORTLETS ──
  {
    key: 'real_estate',
    category: 'Real Estate Developers & Shortlet Apartments',
    businessListPath: 'category/real-estate',
    finelibPath: 'business/real-estate',
    keywords: ['real estate developer', 'luxury shortlet apartment', 'property management firm'],
    buyingPowerScore: 99
  },

  // ── LOGISTICS, HAULAGE & MARITIME (From logistic webapp) ──
  {
    key: 'freight_forwarding',
    category: 'Freight Forwarding & Customs Clearing',
    businessListPath: 'category/freight-forwarding',
    finelibPath: 'business/transportation/freight-forwarding',
    keywords: ['customs clearing forwarding', 'haulage logistics container', 'freight logistics Apapa'],
    buyingPowerScore: 97
  },

  // ── TECHNICAL SERVICES & ARTISANS (From servicehub-nigeria) ──
  {
    key: 'hvac_cooling',
    category: 'Commercial HVAC & Industrial Refrigeration',
    businessListPath: 'category/air-conditioning',
    finelibPath: 'business/building-and-construction/air-conditioning',
    keywords: ['air conditioning commercial HVAC', 'cold room installation refrigeration', 'chiller maintenance'],
    buyingPowerScore: 94
  },
  {
    key: 'auto_engineering',
    category: 'Auto Dealerships & Heavy Machinery Repair',
    businessListPath: 'category/car-dealers',
    finelibPath: 'business/automotive/car-dealers',
    keywords: ['auto spare parts ASPAMDA', 'heavy machinery equipment repair', 'car dealership auto sales'],
    buyingPowerScore: 95
  },
  {
    key: 'hospitality_hotels',
    category: 'Hospitality & Luxury Hotels',
    businessListPath: 'category/hotels',
    finelibPath: 'business/hotels-and-lodging',
    keywords: ['luxury hotel suites', 'boutique shortlet hotel', 'event center banquet hall'],
    buyingPowerScore: 93
  }
];

export const NIGERIA_PRIME_CITIES = [
  { name: 'Lagos', state: 'Lagos', finelibSlug: 'lagos', bizlistSlug: 'lagos' },
  { name: 'Abuja FCT', state: 'Abuja FCT', finelibSlug: 'abuja', bizlistSlug: 'abuja' },
  { name: 'Port Harcourt', state: 'Rivers', finelibSlug: 'port-harcourt', bizlistSlug: 'rivers' },
  { name: 'Ibadan', state: 'Oyo', finelibSlug: 'ibadan', bizlistSlug: 'oyo' },
  { name: 'Kano', state: 'Kano', finelibSlug: 'kano', bizlistSlug: 'kano' },
  { name: 'Enugu', state: 'Enugu', finelibSlug: 'enugu', bizlistSlug: 'enugu' },
  { name: 'Abeokuta', state: 'Ogun', finelibSlug: 'abeokuta', bizlistSlug: 'ogun' },
  { name: 'Benin City', state: 'Edo', finelibSlug: 'benin-city', bizlistSlug: 'edo' },
  { name: 'Onitsha', state: 'Anambra', finelibSlug: 'onitsha', bizlistSlug: 'anambra' },
  { name: 'Jos', state: 'Plateau', finelibSlug: 'jos', bizlistSlug: 'plateau' }
];
