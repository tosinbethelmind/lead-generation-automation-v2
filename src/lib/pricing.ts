import { RuntimeConfig } from './localConfig';

export interface MarketPackageTier {
  id: 'starter' | 'pro' | 'vip' | 'luxury';
  name: string;
  badge: string;
  priceNGN: number;
  originalPriceNGN: number;
  monthlyRenewalNGN: number;
  popular?: boolean;
  simplicityHighlights: string[];
  features: string[];
  recommendedFor: string;
}

export const NIGERIAN_MARKET_TIERS: MarketPackageTier[] = [
  {
    id: 'starter',
    name: 'Express WhatsApp Catalog & Autoresponder',
    badge: 'Starter Tier',
    priceNGN: 75000,
    originalPriceNGN: 150000,
    monthlyRenewalNGN: 15000,
    simplicityHighlights: [
      '⚡ 0 Setup Complexity (Instant Launch)',
      '📲 Orders & inquiries drop straight to your personal WhatsApp',
      '🎯 500 Verified Lagos B2B Small Business Contacts Included',
      '⚡ Multi-Channel Autoresponder Engine (Instant Welcome & Keyword Replies)',
      '🌐 Free Subdomain (yourname.apexreach.site)',
    ],
    features: [
      'Interactive Product / Service Catalog',
      '1-Tap WhatsApp Checkout & Inquiry Builder',
      '500 Verified Lagos B2B Small Business Contacts Export',
      'Multi-Channel Autoresponders (WhatsApp, Email, Web Chat)',
      'Express Customer AI Assistant Widget',
      'Basic Admin Control Panel',
      'Monthly Renewal: ₦15,000/mo (Hosting + WhatsApp Maintenance)',
    ],
    recommendedFor: 'Small Instagram vendors, artisans, single technicians, local shops',
  },
  {
    id: 'pro',
    name: 'Business Growth, AI Agent & Lead Harvester',
    badge: 'Most Popular (70% Choice)',
    priceNGN: 185000,
    originalPriceNGN: 370000,
    monthlyRenewalNGN: 35000,
    popular: true,
    simplicityHighlights: [
      '🎯 10K Lagos B2B Lead Harvester & Verified WhatsApp Exporter (27 Districts)',
      '🤖 24/7 Customer AI Agent with WhatsApp Human Critical Approval',
      '🎙️ Nigerian Accent WhatsApp Voice Note Autoresponder (en-NG)',
      '⚙️ Admin Control Panel (Live Sandbox, Persona Customizer & Approvals Center)',
      '🏦 Moniepoint Dedicated Virtual Account Transfer Box',
      '🌐 Custom .com.ng Domain Name Included (Year 1)',
    ],
    features: [
      'Everything in Express Starter Tier',
      '10K Lagos B2B Master Lead Harvester Engine (27 Lagos Districts)',
      'Intelligent Customer AI Agent (Human-level intelligence & product knowledge)',
      'Nigerian Accent WhatsApp Voice Note Generator (en-NG Abeo / Ezinne)',
      'WhatsApp Critical Stage Human Approval System (Sends alerts to Admin phone)',
      'Dedicated Admin Control Panel (Persona Prompt Customizer, Live Sandbox & Transcripts)',
      'Multi-Channel Autoresponders with Keyword Triggers & Custom Templates',
      'Sector Calculator Engine (Solar BOQ, Tokunbo Duty, CAC Fees, Patient Intake)',
      'Moniepoint Dedicated Virtual Account Transfer Box',
      'Customer Guarantee & Trust Shield Badge',
      'Custom .com.ng Domain + Free SSL',
      'Monthly Renewal: ₦35,000/mo (Lead Harvester Sync + AI Engine + Hosting)',
    ],
    recommendedFor: 'Solar installers, car dealers, law firms, clinics, boutique stores, realtors',
  },
  {
    id: 'vip',
    name: 'VIP Intelligent AI Sales & Voice Caller Suite',
    badge: '100% Hands-Free AI',
    priceNGN: 480000,
    originalPriceNGN: 950000,
    monthlyRenewalNGN: 75000,
    simplicityHighlights: [
      '🎯 Unlimited Lagos B2B Lead Harvester & Automated Pipeline Sync',
      '🤖 24/7 Intelligent Customer AI Agent with WhatsApp Critical Sign-Off',
      '🎙️ WhatsApp AI Voice Notes + Interactive Button Flow Generator',
      '📞 150 Mins Voice AI Phone Call Qualifier (Vapi / Retell AI)',
      '⚙️ Enterprise Admin Control Center (Live Sandbox, Persona Prompts & Approval Center)',
      '🌐 Custom .com Domain Name Included (Year 1)',
    ],
    features: [
      'Everything in Business Pro Tier',
      'Unlimited Lagos B2B Master Lead Harvester (All 27 Districts & 60+ Categories)',
      '24/7 Intelligent Customer AI Agent (Trained on full webapp process knowledge graph)',
      '⚡ 24-Hour Instant AI Recruitment Engine (WhatsApp Voice Note Transcriber, AI CV Grader & Talent Pool Bank)',
      'WhatsApp Critical Stage Approval Protocol for quotes, payment links, and contracts',
      'Full Admin Control Center (Live Sandbox, System Prompt Trainer & WhatsApp Approvals)',
      'Multi-Channel Autoresponders Engine (WhatsApp + SMS + Email + Web Chat)',
      'Conversational Voice AI Phone Calling Agent (150 Mins/mo Included)',
      'Google Review 5-Star Tap Card Auto-Requester',
      'Custom Domain (yourbusiness.com) + Enterprise Hosting',
      'Monthly Renewal: ₦75,000/mo (Unlimited Lead Sync + AI Voice Calling + Cloud Server)',
    ],
    recommendedFor: 'High-ticket B2B contractors, commercial solar installers, multi-branch clinics, property developers',
  },
  {
    id: 'luxury',
    name: 'Apex Luxury Executive Suite (Done-For-You)',
    badge: '👑 Top 1% High-Ticket Enterprise',
    priceNGN: 850000,
    originalPriceNGN: 1800000,
    monthlyRenewalNGN: 120000,
    simplicityHighlights: [
      '👑 100% White-Glove VIP Setup & Dedicated Account Director',
      '⚡ 24-Hour Instant AI Recruitment & Vetted Talent Hiring Engine Included',
      '🤖 Enterprise Customer AI Agent (Trained on ERP, CRM & Product Schemas)',
      '⚙️ Dedicated Admin Control Panels with Role-Based Access Controls',
      '⚡ Done-For-You Multi-Channel Autoresponder Rules & Drip Schedules',
      '📞 300 Mins Voice AI Phone Calling Agent (Formal & Pidgin Tones)',
    ],
    features: [
      'Everything in VIP AI Sales Suite',
      '⚡ 24-Hour Instant AI Recruitment & Executive Headhunting Suite (NIN & CAC Verification Shield)',
      'Custom Trained Enterprise Customer AI Agent with WhatsApp Escalations',
      'Dedicated Enterprise Admin Control Panels with Team Permissions',
      'Done-For-You Multi-Channel Autoresponder Rules for WhatsApp, SMS, Email, Web Chat',
      'Bespoke Enterprise Sector Engine (Multi-MW Solar BOQ, Off-Plan Mortgages, Custom Duties)',
      '300 Mins/month Conversational Voice AI Agent (Inbound & Outbound Calling)',
      'Multi-Branch / Multi-Agent Lead Routing System',
      'NDPR-Compliant Encrypted Field-Level Storage',
      'Custom Premium .com Domain + Dedicated High-Speed CDN Routing',
      'Quarterly Strategy & Conversion Audit Sessions',
      'Monthly Renewal: ₦120,000/mo (Dedicated CDN + Full AI Suite Maintenance)',
    ],
    recommendedFor: 'Eko Atlantic & Lekki developers, Commercial Solar EPC contractors, Luxury Auto Importers, SAN Law Firms',
  },
];

export function getNigerianMarketTierPackages(customDiscountPercent = 0): MarketPackageTier[] {
  if (customDiscountPercent <= 0) return NIGERIAN_MARKET_TIERS;

  return NIGERIAN_MARKET_TIERS.map(tier => ({
    ...tier,
    priceNGN: Math.round(tier.priceNGN * (1 - customDiscountPercent / 100)),
  }));
}


export interface SectorSaasPricingTier {
  monthlyNGN: number;
  oneTimeOwnershipNGN: number;
  annualNGN: number;
  setupFeeNGN: number;
  features: string[];
}

export interface SectorSaasConfig {
  sectorKey: string;
  sectorName: string;
  starter: SectorSaasPricingTier;
  pro: SectorSaasPricingTier;
  enterprise: SectorSaasPricingTier;
}

export const SECTOR_SAAS_PRICING: Record<string, SectorSaasConfig> = {
  solar: {
    sectorKey: 'solar',
    sectorName: 'Solar & Renewable Energy',
    starter: {
      monthlyNGN: 25000,
      oneTimeOwnershipNGN: 75000,
      annualNGN: 220000,
      setupFeeNGN: 15000,
      features: ['BOQ Auto-Generator (kVA/Inverter/Batteries)', 'Diesel vs Solar 5-Yr ROI Calculator', 'Express Multi-Channel Autoresponders', 'WhatsApp Quote Dispatch'],
    },
    pro: {
      monthlyNGN: 45000,
      oneTimeOwnershipNGN: 150000,
      annualNGN: 420000,
      setupFeeNGN: 25000,
      features: ['Everything in Starter', '24/7 Intelligent Customer AI Agent with WhatsApp Approvals', 'Multi-Channel Autoresponder Engine (WhatsApp/SMS/Email/Web)', 'Admin Control Panel (Persona Editor & Live Sandbox)', 'DISCO Band A-E Tariff Hybrid Calculator', 'Solar-as-a-Service Lease-to-Own Payback', 'Moniepoint DVA Transfer Box', 'Unlimited Branded PDF Invoices'],
    },
    enterprise: {
      monthlyNGN: 95000,
      oneTimeOwnershipNGN: 350000,
      annualNGN: 890000,
      setupFeeNGN: 50000,
      features: ['Everything in Pro', 'Custom Trained Enterprise Customer AI Agent', 'Dedicated Admin Control Center with WhatsApp Approval Center', 'Multi-installer Sales Team Lead Router', 'WhatsApp Voice Note Lead Transcriber', '24/7 AI WhatsApp & Call Qualifier Agent (150 Mins Inc.)'],
    },
  },
  auto: {
    sectorKey: 'auto',
    sectorName: 'Automotive Dealers & Imports',
    starter: {
      monthlyNGN: 20000,
      oneTimeOwnershipNGN: 65000,
      annualNGN: 200000,
      setupFeeNGN: 15000,
      features: ['Tokunbo Customs Duty Calculator (NCS 2026)', 'Vehicle Listing Showcase', 'Express Autoresponder Engine', 'Appraisal Allowance Widget'],
    },
    pro: {
      monthlyNGN: 35000,
      oneTimeOwnershipNGN: 125000,
      annualNGN: 350000,
      setupFeeNGN: 20000,
      features: ['Everything in Starter', '24/7 Customer AI Agent with WhatsApp Critical Approval', 'Multi-Channel Autoresponder Engine (WhatsApp/SMS/Email/Web)', 'Admin Control Panel (Persona Editor & Live Sandbox)', 'Multi-Port Clearing Difference Matrix (Tin Can / Apapa / PTML)', '17-Digit VIN History Specs Decoder', 'Moniepoint DVA Transfer Box'],
    },
    enterprise: {
      monthlyNGN: 75000,
      oneTimeOwnershipNGN: 275000,
      annualNGN: 750000,
      setupFeeNGN: 40000,
      features: ['Everything in Pro', 'Custom Trained Enterprise Customer AI Agent', 'Dedicated Admin Control Center with WhatsApp Approvals', 'WhatsApp Auto-Matcher for Spare Parts', 'Dealer Test-Drive Calendar Sync', '24/7 AI WhatsApp Deal Closer'],
    },
  },
  legal: {
    sectorKey: 'legal',
    sectorName: 'Legal & Corporate Services',
    starter: {
      monthlyNGN: 15000,
      oneTimeOwnershipNGN: 45000,
      annualNGN: 150000,
      setupFeeNGN: 10000,
      features: ['CAC Business Filing Fee Calculator', 'CAC Name Availability Checker', 'Express Autoresponder Engine', 'Client Inquiry Portal'],
    },
    pro: {
      monthlyNGN: 30000,
      oneTimeOwnershipNGN: 95000,
      annualNGN: 300000,
      setupFeeNGN: 15000,
      features: ['Everything in Starter', '24/7 Customer AI Agent with WhatsApp Approvals', 'Multi-Channel Autoresponder Engine (WhatsApp/SMS/Email/Web)', 'Admin Control Panel (Persona Editor & Live Sandbox)', 'Automated MEMART, NDA & Retainership Document Generator', 'FIRS 0.75% Stamp Duty Estimator', 'Two-Way Google Sheets CRM Sync'],
    },
    enterprise: {
      monthlyNGN: 65000,
      oneTimeOwnershipNGN: 220000,
      annualNGN: 650000,
      setupFeeNGN: 30000,
      features: ['Everything in Pro', 'Custom Trained Enterprise Customer AI Agent', 'Dedicated Admin Control Center with WhatsApp Approval Center', 'Identity KYC Verification Shield (NIN, BVN, CAC RC Check)', 'Corporate Retainer Billing Tracker'],
    },
  },
  retail: {
    sectorKey: 'retail',
    sectorName: 'Retail & E-Commerce / FMCG',
    starter: {
      monthlyNGN: 8000,
      oneTimeOwnershipNGN: 25000,
      annualNGN: 80000,
      setupFeeNGN: 5000,
      features: ['Express WhatsApp Catalog', '1-Tap WhatsApp Order Builder', 'Multi-Channel Autoresponder Engine', 'Scraped Customer Reviews Display'],
    },
    pro: {
      monthlyNGN: 15000,
      oneTimeOwnershipNGN: 50000,
      annualNGN: 150000,
      setupFeeNGN: 10000,
      features: ['Everything in Starter', '24/7 Customer AI Agent with WhatsApp Approvals', 'Multi-Channel Autoresponder Engine (WhatsApp/SMS/Email/Web)', 'Admin Control Panel Dashboard', 'Moniepoint DVA Dedicated Virtual Account', 'Inter-State Bus Park Waybill & Freight Cost Estimator', 'Instant Responder & Guarantee Shield Badge'],
    },
    enterprise: {
      monthlyNGN: 35000,
      oneTimeOwnershipNGN: 110000,
      annualNGN: 350000,
      setupFeeNGN: 20000,
      features: ['Everything in Pro', 'Custom Trained Enterprise Customer AI Agent', 'Dedicated Admin Control Center with WhatsApp Approvals', '15-Minute Abandoned Cart WhatsApp Drip Recovery', 'Multi-Location Inventory Stock Tracking'],
    },
  },
  healthcare: {
    sectorKey: 'healthcare',
    sectorName: 'Healthcare & Medical Clinics',
    starter: {
      monthlyNGN: 15000,
      oneTimeOwnershipNGN: 45000,
      annualNGN: 150000,
      setupFeeNGN: 10000,
      features: ['Patient Intake Form', 'Procedure Appointment Scheduler', 'Clinic Business Hours & Reviews'],
    },
    pro: {
      monthlyNGN: 28000,
      oneTimeOwnershipNGN: 85000,
      annualNGN: 280000,
      setupFeeNGN: 15000,
      features: ['Everything in Starter', 'HMO Coverage & Co-Pay Verification Matrix', 'NDPR Field-Level Encrypted Data Storage', 'Automated SMS & WhatsApp Reminders'],
    },
    enterprise: {
      monthlyNGN: 60000,
      oneTimeOwnershipNGN: 195000,
      annualNGN: 600000,
      setupFeeNGN: 30000,
      features: ['Everything in Pro', 'Instant WebRTC Telemedicine Video Call Generator (Daily.co)', 'Multi-Doctor Room Management Portal'],
    },
  },
  realestate: {
    sectorKey: 'realestate',
    sectorName: 'Real Estate & Property Management',
    starter: {
      monthlyNGN: 25000,
      oneTimeOwnershipNGN: 85000,
      annualNGN: 250000,
      setupFeeNGN: 15000,
      features: ['Property Showcase Landing Page', 'Basic Inspection Booking', 'Scraped Reviews Display'],
    },
    pro: {
      monthlyNGN: 50000,
      oneTimeOwnershipNGN: 175000,
      annualNGN: 500000,
      setupFeeNGN: 25000,
      features: ['Everything in Starter', 'Mortgage & Loan Amortization Calculator', '360-Degree Virtual Tour Embed Support', 'Automated Tenancy Agreement Builder'],
    },
    enterprise: {
      monthlyNGN: 110000,
      oneTimeOwnershipNGN: 400000,
      annualNGN: 1100000,
      setupFeeNGN: 50000,
      features: ['Everything in Pro', 'Neighborhood Amenities & Radius Map Scorer', 'Tenant Screening Portal', 'Voice AI Tour Booking Agent'],
    },
  },
  hospitality: {
    sectorKey: 'hospitality',
    sectorName: 'Hospitality, Restaurants & Venues',
    starter: {
      monthlyNGN: 10000,
      oneTimeOwnershipNGN: 30000,
      annualNGN: 100000,
      setupFeeNGN: 5000,
      features: ['Table Reservation Widget', 'Food Pre-Order & Kitchen Receipt Generator', 'Business Hours Panel'],
    },
    pro: {
      monthlyNGN: 20000,
      oneTimeOwnershipNGN: 65000,
      annualNGN: 200000,
      setupFeeNGN: 10000,
      features: ['Everything in Starter', 'Event Hall Rental & Catering Per-Plate Cost Estimator', 'Automated 5-Star Google Review Request Tap-Cards'],
    },
    enterprise: {
      monthlyNGN: 45000,
      oneTimeOwnershipNGN: 140000,
      annualNGN: 450000,
      setupFeeNGN: 20000,
      features: ['Everything in Pro', 'Live Seat & Table Availability Manager', 'Moniepoint POS Offline Order Webhook Sync'],
    },
  },
  education: {
    sectorKey: 'education',
    sectorName: 'Education & Training Institutes',
    starter: {
      monthlyNGN: 12000,
      oneTimeOwnershipNGN: 35000,
      annualNGN: 120000,
      setupFeeNGN: 5000,
      features: ['School Fee Structure Display', 'Student Inquiry Form', 'Campus Hours & Reviews'],
    },
    pro: {
      monthlyNGN: 22000,
      oneTimeOwnershipNGN: 75000,
      annualNGN: 220000,
      setupFeeNGN: 10000,
      features: ['Everything in Starter', 'Termly School Tuition & Result PIN Portal Calculator', 'Student Application Manager with Document Upload'],
    },
    enterprise: {
      monthlyNGN: 50000,
      oneTimeOwnershipNGN: 160000,
      annualNGN: 500000,
      setupFeeNGN: 20000,
      features: ['Everything in Pro', 'LMS Course Catalog & Seminar Builder', 'Automated Entrance Exam Scheduler'],
    },
  },
};

export interface DomainAndHostingConfig {
  subdomainCostNGN: number;
  comNgDomainRenewalNGN: number;
  comDomainRenewalNGN: number;
  basicHostingRenewalNGN: number;
  proHostingRenewalNGN: number;
  vipHostingRenewalNGN: number;
}

export const DOMAIN_HOSTING_PRICING: DomainAndHostingConfig = {
  subdomainCostNGN: 0,
  comNgDomainRenewalNGN: 8000,
  comDomainRenewalNGN: 25000,
  basicHostingRenewalNGN: 15000,
  proHostingRenewalNGN: 25000,
  vipHostingRenewalNGN: 45000,
};

export interface AiCreditCaps {
  freeMonthlyVoiceMins: number;
  freeMonthlyWhatsappReplies: number;
  voiceAddon100MinsCostNGN: number;
  whatsappAddon1000RepliesCostNGN: number;
}

export const AI_CREDIT_CAPS: AiCreditCaps = {
  freeMonthlyVoiceMins: 150,
  freeMonthlyWhatsappReplies: 1000,
  voiceAddon100MinsCostNGN: 7500,
  whatsappAddon1000RepliesCostNGN: 5000,
};


export function getSectorSaasPricing(sectorKey = 'solar'): SectorSaasConfig {
  const key = sectorKey.toLowerCase().trim();
  return SECTOR_SAAS_PRICING[key] || SECTOR_SAAS_PRICING['solar'];
}

export const FEATURE_CATALOG = [
  { id: 'quote_estimator', cost: 35000 },
  { id: 'patient_intake', cost: 35000 },
  { id: 'ecommerce', cost: 50000 },
  { id: 'vehicle_valuation', cost: 30000 },
  { id: 'table_reservation', cost: 25000 },
  { id: 'social_media_management', cost: 185000 },
  { id: 'ad_automation', cost: 285000 },
  { id: 'social_ad_dominance_suite', cost: 450000 }
];


export interface PaymentModeOption {
  modeKey: 'onetime_ownership' | 'monthly_payg' | 'annual_discount';
  title: string;
  badge: string;
  marketPopularityPercent: number;
  description: string;
  billingStructureText: string;
  recommendedForNigeria: boolean;
}

export const PAYMENT_MODE_OPTIONS: PaymentModeOption[] = [
  {
    modeKey: 'onetime_ownership',
    title: 'Pay-Once Lifetime Ownership + Optional Yearly Hosting',
    badge: '🔥 75% Bestseller in Nigeria',
    marketPopularityPercent: 75,
    description: 'Pay once to own the website and system permanently. No automatic card debits or monthly subscription anxiety.',
    billingStructureText: 'One-time setup fee + 1st year free hosting. Optional ₦15,000/yr renewal from Year 2 onwards.',
    recommendedForNigeria: true,
  },
  {
    modeKey: 'monthly_payg',
    title: 'Low-Entry Monthly Pay-As-You-Go (Manual Transfer)',
    badge: 'Flexible Choice',
    marketPopularityPercent: 20,
    description: 'Low entry cost. Pay monthly via manual Moniepoint bank transfer link sent to WhatsApp. Pause anytime without card auto-debit.',
    billingStructureText: 'Low monthly fee (₦8,000/mo to ₦25,000/mo). Manual transfer link sent on the 1st of every month.',
    recommendedForNigeria: true,
  },
  {
    modeKey: 'annual_discount',
    title: 'Annual Corporate Pass (2 Months Free)',
    badge: 'Enterprise Bulk Pass',
    marketPopularityPercent: 5,
    description: 'Pay 1 year upfront for corporate organizations to receive official tax invoices and 2 months free.',
    billingStructureText: 'Single annual bank transfer with official FIRS invoice & retainership agreement.',
    recommendedForNigeria: false,
  },
];

export function getPaymentModeRecommendation(): {
  primaryRecommendation: PaymentModeOption;
  allModes: PaymentModeOption[];
  expertAdviceText: string;
} {
  return {
    primaryRecommendation: PAYMENT_MODE_OPTIONS[0],
    allModes: PAYMENT_MODE_OPTIONS,
    expertAdviceText:
      'Make BOTH One-Time Ownership and Monthly Pay-As-You-Go available. Lead with One-Time Lifetime Ownership as the primary default (75% of Nigerian SMEs choose this because they hate recurring card debits). Offer Monthly Pay-As-You-Go via manual WhatsApp transfer link as a low-friction fallback.',
  };
}

export interface CompetitorBenchmark {
  categoryName: string;
  competitorsList: string[];
  typicalPriceRangeNGN: string;
  keyWeaknessInNigeria: string;
  apexReachAdvantage: string;
}

export const NIGERIAN_COMPETITOR_BENCHMARKS: CompetitorBenchmark[] = [
  {
    categoryName: 'Basic Mini-Store SaaS (Bumpa, Selar, Catlog)',
    competitorsList: ['Bumpa', 'Selar.co', 'Catlog'],
    typicalPriceRangeNGN: '₦5,000 – ₦15,000 / month (₦50k – ₦120k / yr)',
    keyWeaknessInNigeria: 'Basic link-in-bio catalogs with NO sector calculation tools (Solar BOQ, Tokunbo Duty, CAC Fees), NO automated lead scraping, NO Voice AI, and NO custom landing page previews.',
    apexReachAdvantage: 'ApexReach offers high-converting, sector-tailored calculation engines + instant Moniepoint DVAs + auto WhatsApp bot at the same or lower entry price.',
  },
  {
    categoryName: 'Local Web Agencies & Freelancers (WordPress/Elementor)',
    competitorsList: ['Lagos/Abuja Web Agencies', 'Fiverr Freelancers'],
    typicalPriceRangeNGN: '₦150,000 – ₦450,000 one-time + ₦30k/yr hosting',
    keyWeaknessInNigeria: 'Takes 2 to 4 weeks to deliver, frequently non-responsive on mobile, requires technical maintenance, NO instant virtual accounts, NO Google Sheets CRM sync.',
    apexReachAdvantage: 'Instant sub-second landing page generation with pre-populated lead data, 1-click zero-touch deployment for ₦45,000 (75% lower cost than agencies).',
  },
  {
    categoryName: 'US / Global Marketing SaaS (GoHighLevel, HubSpot)',
    competitorsList: ['GoHighLevel ($97-$297/mo)', 'HubSpot'],
    typicalPriceRangeNGN: '$97 – $297 / month (₦155,000 – ₦475,000 / month)',
    keyWeaknessInNigeria: 'Prohibitively expensive due to USD rates, requires dollar cards (which frequently fail in Nigeria), NO Moniepoint/OPay DVA integration, NO Pidgin AI, NO local sector tools.',
    apexReachAdvantage: 'Priced natively in Naira with Moniepoint DVA transfer support, Nigerian Pidgin AI tones, and built-in NCS Customs Duty & DISCO Tariff engines.',
  },
];

export function calculateLeadClaimFee(lead: any, config: RuntimeConfig): number {
  const hasWebsite = lead.has_website !== false && lead.hasWebsite !== false && lead.website && lead.website.trim() !== '';
  const strategy = lead.upgrade_strategy || lead.upgradeStrategy || (hasWebsite ? 'script_embed' : 'basic_presence');
  
  let base = 0;
  if (strategy === 'full_rebuild') base = 480000;
  else if (strategy === 'plugin') base = 185000;
  else if (strategy === 'basic_presence') base = 185000;
  else if (strategy === 'script_embed') base = 75000;
  else base = config.claimFeeNGN || 185000;
  
  let featuresCost = 0;
  let selectedFeatures: string[] = [];
  if (lead.plugin_suggestions || lead.pluginSuggestions) {
    try {
      const parsed = Array.isArray(lead.plugin_suggestions || lead.pluginSuggestions)
        ? (lead.plugin_suggestions || lead.pluginSuggestions)
        : JSON.parse(lead.plugin_suggestions || lead.pluginSuggestions || '[]');
      selectedFeatures = parsed;
    } catch (e) {}
  }
  
  if (Array.isArray(selectedFeatures)) {
    selectedFeatures.forEach((fid: string) => {
      const f = FEATURE_CATALOG.find((x) => x.id === fid);
      if (f) {
        featuresCost += f.cost;
      }
    });
  }
  
  return base + featuresCost;
}

