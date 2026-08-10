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
    topToolName: 'Solar BOQ and Quote Workflow',
    topToolDesc:
      'Capture appliance load requirements and produce a structured quote workflow for review. Helps your team respond to enquiries faster and consistently.',
    sampleBusinessTypes: [
      '5kVA Solar Generator Systems',
      '10kVA Commercial Solar Installations',
      '2kVA Home Backup Solutions',
    ],
    tools: [
      {
        id: 'solar_boq',
        name: 'WhatsApp Solar BOQ Calculator',
        desc: 'Calculates inverter kVA and battery count based on appliance load. Produces a structured quote for your team to review.',
        tag: 'Quote Tool',
        actionKey: 'solar_boq',
      },
      {
        id: 'diesel_roi',
        name: 'Diesel vs Solar Cost Comparison',
        desc: 'Compares estimated monthly generator fuel cost against a solar system payback estimate to support your sales conversation.',
        tag: 'Sales Aid',
        actionKey: 'diesel_roi',
      },
      {
        id: 'solar_enquiry',
        name: 'Solar Enquiry Capture Workflow',
        desc: 'Captures customer location, load requirements, and budget via WhatsApp or web form and routes to your sales team.',
        tag: 'Lead Capture',
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
    topToolName: 'Property Enquiry and Inspection Scheduler',
    topToolDesc:
      'Respond to property enquiries, share listing details, and schedule site inspections — keeping your team organised and responding faster.',
    sampleBusinessTypes: [
      'Residential Property Sales',
      'Commercial and Land Listings',
      'Property Management Services',
    ],
    tools: [
      {
        id: 'mortgage_amortization',
        name: 'Instalment and Payment Plan Calculator',
        desc: 'Calculates indicative instalment schedules and down-payment amounts to help buyers understand their options.',
        tag: 'Sales Aid',
        actionKey: 'mortgage_amortization',
      },
      {
        id: 'inspection_scheduler',
        name: 'Site Inspection Request Workflow',
        desc: 'Captures buyer details, preferred viewing date, and property interest via WhatsApp and routes to your team.',
        tag: 'Booking Tool',
        actionKey: null,
      },
      {
        id: 'property_enquiry',
        name: 'Property Listing Enquiry Handler',
        desc: 'Responds to common listing questions, shares key details, and qualifies buyer intent before routing to your sales team.',
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
    topToolName: 'Import Duty and Landing Cost Estimator',
    topToolDesc:
      'Estimates customs duty and landing cost for imported vehicles based on year, engine size, and CIF value. Helps buyers understand pricing quickly.',
    sampleBusinessTypes: [
      'Foreign Used Vehicle Sales',
      'New and Certified Pre-Owned Cars',
      'Fleet and Corporate Vehicle Supply',
    ],
    tools: [
      {
        id: 'tokunbo_duty',
        name: 'Import Duty and Cost Estimator',
        desc: 'Estimates customs duty and landing cost for vehicle imports based on year, engine size, and CIF value.',
        tag: 'Cost Tool',
        actionKey: 'tokunbo_duty',
      },
      {
        id: 'port_clearing',
        name: 'Port Clearing Cost Guide',
        desc: 'Provides a structured cost guide for port terminal and clearing charges to help buyers plan their budget.',
        tag: 'Cost Guide',
        actionKey: 'tokunbo_port_clearing',
      },
      {
        id: 'vehicle_enquiry',
        name: 'Vehicle Enquiry and Price Sheet Workflow',
        desc: 'Captures buyer requirements and sends relevant vehicle details, availability, and pricing via WhatsApp.',
        tag: 'Enquiry Tool',
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
    topToolName: 'Patient Enquiry and Appointment Booking Workflow',
    topToolDesc:
      'Responds to patient enquiries, collects basic information, and routes appointment booking requests to your front desk team.',
    sampleBusinessTypes: [
      'General Practice and Specialist Clinics',
      'Dental and Optical Services',
      'Diagnostic and Health Check Centres',
    ],
    tools: [
      {
        id: 'healthcare_hmo',
        name: 'HMO Coverage Reference Tool',
        desc: 'Provides indicative HMO coverage information and routes patients to your billing team for exact co-pay confirmation.',
        tag: 'Reference Tool',
        actionKey: 'healthcare_hmo',
      },
      {
        id: 'appointment_workflow',
        name: 'Appointment Request Workflow',
        desc: 'Captures patient name, concern, and preferred date via WhatsApp or web form and routes to your scheduling team.',
        tag: 'Booking Tool',
        actionKey: null,
      },
      {
        id: 'patient_reminder',
        name: 'Patient Follow-Up Reminder Workflow',
        desc: 'Sends configurable follow-up reminders to patients after appointments to support continuity of care.',
        tag: 'Retention Tool',
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
    topToolName: 'CAC Filing and Legal Enquiry Workflow',
    topToolDesc:
      'Captures initial legal enquiries, explains service options, and routes qualified prospects to your team for consultation scheduling.',
    sampleBusinessTypes: [
      'Corporate and Commercial Law',
      'Property and Conveyancing Services',
      'Business Registration and Compliance',
    ],
    tools: [
      {
        id: 'cac_fees',
        name: 'CAC Filing Fee Reference Calculator',
        desc: 'Calculates indicative CAC filing fees and government stamp duties for common entity types to guide initial client conversations.',
        tag: 'Reference Tool',
        actionKey: 'cac_fees',
      },
      {
        id: 'cac_name_check',
        name: 'Business Name Availability Guide',
        desc: 'Guides prospective clients through the business name availability check process and what to prepare.',
        tag: 'Guide Tool',
        actionKey: 'cac_name_check',
      },
      {
        id: 'legal_enquiry',
        name: 'Legal Enquiry and Intake Workflow',
        desc: 'Captures client name, matter type, and urgency, and routes to the appropriate team member for follow-up.',
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
    topToolName: 'WhatsApp Catalogue and Order Enquiry Workflow',
    topToolDesc:
      'Responds to product enquiries, shares catalogue details, collects order information, and routes confirmed orders to your fulfilment team.',
    sampleBusinessTypes: [
      'Fashion and Clothing Retail',
      'Accessories and Lifestyle Products',
      'Online and WhatsApp-First Commerce',
    ],
    tools: [
      {
        id: 'logistics_delivery',
        name: 'Lagos Delivery Cost Estimator',
        desc: 'Calculates indicative dispatch and delivery fees across key Lagos areas to help customers understand delivery costs.',
        tag: 'Cost Tool',
        actionKey: 'logistics_delivery',
      },
      {
        id: 'whatsapp_cart',
        name: 'WhatsApp Catalogue and Order Workflow',
        desc: 'Displays product details, collects size and colour choices, and captures delivery information for your fulfilment team.',
        tag: 'Order Tool',
        actionKey: 'whatsapp_cart',
      },
      {
        id: 'reengagement',
        name: 'Customer Re-Engagement Workflow',
        desc: 'Sends configurable messages to past buyers when new stock arrives or promotions are running.',
        tag: 'Retention Tool',
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
    topToolName: 'School Fees and Admission Enquiry Workflow',
    topToolDesc:
      'Responds to parent and student enquiries, shares fee and admission information, and routes qualified enquiries to your administrative team.',
    sampleBusinessTypes: [
      'Nursery and Primary Schools',
      'Secondary and Tutorial Colleges',
      'Vocational and Skills Training Centres',
    ],
    tools: [
      {
        id: 'school_tuition',
        name: 'School Fee Reference Calculator',
        desc: 'Provides indicative termly tuition and boarding fee information to guide parent conversations before detailed discussion.',
        tag: 'Reference Tool',
        actionKey: 'school_tuition',
      },
      {
        id: 'admission_workflow',
        name: 'Admission Enquiry and Intake Workflow',
        desc: 'Captures student details, academic level, and parent contact information and routes to your admissions team.',
        tag: 'Intake Tool',
        actionKey: null,
      },
      {
        id: 'fee_reminder',
        name: 'School Fees Follow-Up Workflow',
        desc: 'Sends configurable fee balance reminders to parents to support your accounts receivable process.',
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
    topToolName: 'Business Enquiry Handling and Lead Follow-Up Workflow',
    topToolDesc:
      'Captures inbound enquiries, qualifies interest, and routes prospects to your team with context — so your team spends time on the right conversations.',
    sampleBusinessTypes: [
      'Professional and Consulting Services',
      'Logistics and Supply Chain',
      'Technology and IT Services',
    ],
    tools: [
      {
        id: 'enquiry_handler',
        name: 'WhatsApp and Web Enquiry Handler',
        desc: 'Responds to common questions, captures contact details and enquiry context, and routes qualified leads to your team.',
        tag: 'Enquiry Tool',
        actionKey: null,
      },
      {
        id: 'follow_up',
        name: 'Lead Follow-Up and Nurture Workflow',
        desc: 'Supports consistent follow-up for prospects who have not yet responded, keeping your pipeline active.',
        tag: 'Follow-Up Tool',
        actionKey: null,
      },
      {
        id: 'quote_workflow',
        name: 'Quote Request and Delivery Workflow',
        desc: 'Captures service requirements, triggers a quote preparation alert to your team, and delivers the quote via WhatsApp or email.',
        tag: 'Quote Tool',
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
