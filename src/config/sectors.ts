/**
 * @file src/config/sectors.ts
 * Sector profile data for the Bethelmind Analytics homepage.
 *
 * IMPORTANT — Demo Data Notice:
 * Tool descriptions, recommended workflows, and sector names are
 * illustrative. Lead counts and tool availability vary by plan
 * and business configuration.
 *
 * Do not add "verified lead count" claims without a real,
 * documented, and defensible data source.
 */

export interface SectorTool {
  id: string;
  name: string;
  /** Short description of what the tool does */
  desc: string;
  /** Tag label shown on the tool card */
  tag: string;
  /** Maps to /api/sector-tools action key — null if no live demo */
  actionKey: string | null;
}

export interface SectorProfile {
  id: string;
  name: string;
  emoji: string;
  /** Short badge label, e.g. "Solar Industry Stack" */
  badge: string;
  /** Name of the headline tool for this sector */
  topToolName: string;
  /** What the tool does — honest, no guaranteed outcomes */
  topToolDesc: string;
  /** Sample business types served — not real client data */
  sampleBusinessTypes: string[];
  /** Three recommended tools for this sector */
  tools: SectorTool[];
  /** Recommended plan for this sector */
  recommendedPlan: 'starter' | 'pro' | 'vip';
  /** Accent colour for this sector card */
  color: string;
}

export const SECTOR_PROFILES: Record<string, SectorProfile> = {
  solar: {
    id: 'solar',
    name: 'Solar & Renewable Energy',
    emoji: '☀️',
    badge: 'Solar Industry Stack',
    topToolName: 'WhatsApp Solar BOQ & Surge Load Calculator',
    topToolDesc:
      'Calculates inverter kVA, panel wattage, and battery capacity based on appliance surge loads. Generates structured quotes and live diesel vs. solar payback comparisons.',
    sampleBusinessTypes: [
      '5kVA Commercial & Residential Solar',
      '10kVA - 20kVA Industrial Solar Installations',
      '2.5kVA Home & Office Inverter Backups',
    ],
    tools: [
      {
        id: 'solar_boq',
        name: 'WhatsApp Solar Load BOQ Calculator',
        desc: 'Calculates required inverter kVA and battery count from AC, fridge, and pump load inputs. Produces a structured quote for your team.',
        tag: 'Quote Tool',
        actionKey: 'solar_boq',
      },
      {
        id: 'diesel_roi',
        name: 'Live Diesel vs Solar Cost Comparison',
        desc: 'Compares estimated monthly generator fuel cost against a solar payback model to support high-converting sales conversations.',
        tag: 'Sales Aid',
        actionKey: 'diesel_roi',
      },
      {
        id: 'solar_enquiry',
        name: 'Site Audit & Geo-Tag Request Workflow',
        desc: 'Captures location, roof type, appliance load, and budget via WhatsApp to schedule an engineer audit visit.',
        tag: 'Audit Tool',
        actionKey: null,
      },
    ],
    recommendedPlan: 'pro',
    color: '#06b6d4',
  },
  realestate: {
    id: 'realestate',
    name: 'Real Estate & Property',
    emoji: '🏠',
    badge: 'Real Estate Stack',
    topToolName: 'Total Cost & Installment Plan Calculator',
    topToolDesc:
      'Calculates property payment spreads (Outright, 6-Month, 12-Month) including mandatory Nigerian ancillary levies (Survey, Legal Documentation, Development fees).',
    sampleBusinessTypes: [
      'Residential & Off-Plan Developments',
      'Commercial Property & Land Banking',
      'Verified Property Brokerages',
    ],
    tools: [
      {
        id: 'mortgage_amortization',
        name: 'Installment & Ancillary Fee Calculator',
        desc: 'Computes deposit amounts, monthly payment spreads, and line items for survey, documentation, and infrastructure levies.',
        tag: 'Sales Aid',
        actionKey: 'mortgage_amortization',
      },
      {
        id: 'inspection_scheduler',
        name: 'Automated Site Inspection Booking Workflow',
        desc: 'Captures buyer details, preferred viewing day, and pick-up location via WhatsApp with automated SMS directions.',
        tag: 'Booking Tool',
        actionKey: null,
      },
      {
        id: 'property_enquiry',
        name: 'Property Listing & Title Fact-Sheet Handler',
        desc: 'Instantly shares brochure details, title information (C of O, Excision, Gazette), and video walk-through links on WhatsApp.',
        tag: 'Enquiry Tool',
        actionKey: null,
      },
    ],
    recommendedPlan: 'pro',
    color: '#8b5cf6',
  },
  automotive: {
    id: 'automotive',
    name: 'Car Dealers & Vehicle Importers',
    emoji: '🚗',
    badge: 'Auto Sales Stack',
    topToolName: 'Live VIN Customs Duty & Landing Cost Estimator',
    topToolDesc:
      'Estimates customs duty, terminal charges, and total port landing cost for imported vehicles based on 17-digit VIN, year, and engine size.',
    sampleBusinessTypes: [
      'Foreign-Used (Tokunbo) Car Dealers',
      'New & Certified Vehicle Importers',
      'Corporate Fleet & Equipment Suppliers',
    ],
    tools: [
      {
        id: 'tokunbo_duty',
        name: 'VIN Customs Duty & Cost Estimator',
        desc: 'Estimates customs duty and total landing cost based on vehicle VIN, engine capacity, and current customs FX benchmarks.',
        tag: 'Cost Tool',
        actionKey: 'tokunbo_duty',
      },
      {
        id: 'port_clearing',
        name: 'Port Clearing & Documentation Guide',
        desc: 'Provides a structured guide for terminal fees, shipping clearance, and VIO paper verification requirements.',
        tag: 'Cost Guide',
        actionKey: 'tokunbo_port_clearing',
      },
      {
        id: 'vehicle_enquiry',
        name: 'Vehicle Trade-In & Appraisal Workflow',
        desc: 'Captures buyer vehicle details for quick trade-in valuation and delivers vehicle price sheets directly via WhatsApp.',
        tag: 'Trade-In Tool',
        actionKey: null,
      },
    ],
    recommendedPlan: 'pro',
    color: '#f59e0b',
  },
  medical: {
    id: 'medical',
    name: 'Clinics & Healthcare',
    emoji: '🏥',
    badge: 'Healthcare Stack',
    topToolName: 'HMO Pre-Verification & Appointment Scheduler',
    topToolDesc:
      'Verifies HMO plan coverage, collects preliminary symptom information, and routes appointment requests to your front-desk and triage team.',
    sampleBusinessTypes: [
      'General Practice & Specialist Clinics',
      'Dental, Optical & Fertility Clinics',
      'Diagnostic & Laboratory Scan Centres',
    ],
    tools: [
      {
        id: 'healthcare_hmo',
        name: 'HMO Plan Coverage Reference Tool',
        desc: 'Provides indicative HMO plan coverage details and routes patients to billing for fast-track authorization code approval.',
        tag: 'Reference Tool',
        actionKey: 'healthcare_hmo',
      },
      {
        id: 'appointment_workflow',
        name: 'Doctor Appointment & Triage Workflow',
        desc: 'Captures patient details, primary concern, and preferred doctor slot, issuing a digital appointment pass via WhatsApp.',
        tag: 'Booking Tool',
        actionKey: null,
      },
      {
        id: 'patient_reminder',
        name: 'Diagnostic Scan & Lab Price Guide',
        desc: 'Delivers lab test prices, fasting preparation guidelines, and automated post-consultation follow-up reminders.',
        tag: 'Lab Guide',
        actionKey: null,
      },
    ],
    recommendedPlan: 'starter',
    color: '#10b981',
  },
  legal: {
    id: 'legal',
    name: 'Law Firms & Legal Services',
    emoji: '⚖️',
    badge: 'Legal Practice Stack',
    topToolName: 'CAC Filing & Client Intake Workflow',
    topToolDesc:
      'Calculates statutory CAC filing fees, government stamp duties, and legal processing costs while qualifying client intake enquiries.',
    sampleBusinessTypes: [
      'Corporate & Commercial Law Firms',
      'Property & Conveyancing Practice',
      'CAC Business Registration Agencies',
    ],
    tools: [
      {
        id: 'cac_fees',
        name: 'CAC Filing & Stamp Duty Calculator',
        desc: 'Calculates indicative CAC filing fees and stamp duties for Business Names, Ltd Companies, and Incorporated Trustees.',
        tag: 'Reference Tool',
        actionKey: 'cac_fees',
      },
      {
        id: 'cac_name_check',
        name: 'Business Name Availability Guide',
        desc: 'Guides prospective clients through CAC naming rules to increase approval rates on name reservation requests.',
        tag: 'Guide Tool',
        actionKey: 'cac_name_check',
      },
      {
        id: 'legal_enquiry',
        name: 'Retainer & Client Intake Workflow',
        desc: 'Captures legal matter details, urgency, and auto-generates preliminary consultation intake documents.',
        tag: 'Intake Tool',
        actionKey: null,
      },
    ],
    recommendedPlan: 'pro',
    color: '#ec4899',
  },
  retail: {
    id: 'retail',
    name: 'Boutiques & E-Commerce',
    emoji: '🛍️',
    badge: 'Retail Commerce Stack',
    topToolName: '1-Click WhatsApp Catalogue & Order Workflow',
    topToolDesc:
      'Displays product details, collects size/colour options, calculates Lagos/Inter-state delivery rates, and captures orders directly on WhatsApp.',
    sampleBusinessTypes: [
      'Fashion, Shoes & Clothing Boutiques',
      'Electronics & Phone Accessories',
      'Social Commerce & WhatsApp Vendors',
    ],
    tools: [
      {
        id: 'logistics_delivery',
        name: 'Lagos & Inter-State Delivery Calculator',
        desc: 'Calculates dispatch rates across Lagos Mainland/Island and key inter-state hubs to clarify shipping costs.',
        tag: 'Cost Tool',
        actionKey: 'logistics_delivery',
      },
      {
        id: 'whatsapp_cart',
        name: '1-Click WhatsApp Order Cart',
        desc: 'Collects product choices, shipping details, and auto-generates a clean order invoice inside WhatsApp.',
        tag: 'Order Tool',
        actionKey: 'whatsapp_cart',
      },
      {
        id: 'reengagement',
        name: 'Abandoned Order Recovery Workflow',
        desc: 'Sends gentle, non-spammy WhatsApp follow-ups for unpaid orders with one-click payment links.',
        tag: 'Recovery Tool',
        actionKey: null,
      },
    ],
    recommendedPlan: 'starter',
    color: '#f97316',
  },
  schools: {
    id: 'schools',
    name: 'Schools & Training Institutes',
    emoji: '📚',
    badge: 'Education Admin Stack',
    topToolName: 'Termly School Fee & Admission Calculator',
    topToolDesc:
      'Provides clear breakdowns of 1st term entry costs (Tuition + Uniform + Books) vs. subsequent term fees, and automates parent fee reminders.',
    sampleBusinessTypes: [
      'Nursery & Primary Schools',
      'Secondary Colleges & Academies',
      'Vocational & Skills Training Centres',
    ],
    tools: [
      {
        id: 'school_tuition',
        name: 'Termly School Fee Calculator',
        desc: 'Displays tuition, boarding, and uniform fee breakdowns by grade level to guide initial parent conversations.',
        tag: 'Reference Tool',
        actionKey: 'school_tuition',
      },
      {
        id: 'admission_workflow',
        name: 'Admissions & Campus Tour Scheduler',
        desc: 'Captures student academic level, parent contact, and schedules entrance exams or guided campus visits.',
        tag: 'Intake Tool',
        actionKey: null,
      },
      {
        id: 'fee_reminder',
        name: 'Virtual Account Tuition Reminder System',
        desc: 'Sends polite termly fee reminders with dedicated virtual bank account links for instant payment reconciliation.',
        tag: 'Accounts Tool',
        actionKey: null,
      },
    ],
    recommendedPlan: 'pro',
    color: '#06b6d4',
  },
  general: {
    id: 'general',
    name: 'General B2B Services',
    emoji: '🏢',
    badge: 'B2B Services Stack',
    topToolName: 'Pro-Forma Invoice & B2B Lead Follow-Up Engine',
    topToolDesc:
      'Captures inbound enquiries, auto-generates FIRS VAT/WHT-compliant pro-forma invoices, and routes qualified prospects to your sales team.',
    sampleBusinessTypes: [
      'Corporate Consulting & Logistics',
      'IT Services & Enterprise Software',
      'Industrial Equipment & Contractors',
    ],
    tools: [
      {
        id: 'enquiry_handler',
        name: 'WhatsApp & Web B2B Lead Router',
        desc: 'Responds to inquiries, collects corporate contact details and requirements, and assigns prospects to account reps.',
        tag: 'Enquiry Tool',
        actionKey: null,
      },
      {
        id: 'follow_up',
        name: 'FIRS VAT/WHT Pro-Forma Invoice Builder',
        desc: 'Instantly builds professional PDF quotes with CAC registration numbers, TIN, 7.5% VAT, and 5% WHT line items.',
        tag: 'Invoice Tool',
        actionKey: null,
      },
      {
        id: 'quote_workflow',
        name: 'Multichannel Proposal Nurture Workflow',
        desc: 'Automates follow-up touchpoints on WhatsApp, SMS, and Email for pending proposals.',
        tag: 'Nurture Tool',
        actionKey: null,
      },
    ],
    recommendedPlan: 'pro',
    color: '#06b6d4',
  },
};

/** Returns an ordered list of sector profiles for UI rendering. */
export const ORDERED_SECTORS: SectorProfile[] = Object.values(SECTOR_PROFILES);

/** Returns a sector profile by ID, defaulting to 'general'. */
export function getSectorById(id: string): SectorProfile {
  return SECTOR_PROFILES[id] ?? SECTOR_PROFILES.general;
}

/** Lagos districts for the profiler dropdown */
export const LAGOS_DISTRICTS: string[] = [
  'Ikeja',
  'Lekki Phase 1',
  'Victoria Island',
  'Ikoyi',
  'Yaba',
  'Surulere',
  'Ikorodu',
  'Alimosho',
  'Festac & Amuwo-Odofin',
  'Apapa',
  'Ajah & Sangotedo',
  'Gbagada & Maryland',
  'All Lagos Areas',
];
