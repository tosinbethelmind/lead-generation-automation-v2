/**
 * Unified Widget Registry for sector-specific interactive operational modules.
 * Standardizes metadata, icons, and display titles across preview sites, dashboards,
 * and automated PDF quote generators.
 */
export interface WidgetMetadata {
  id: string;
  title: string;
  category: string;
  icon: string;
  description: string;
  defaultFeeNGN: number;
}

export const WIDGET_CATALOG: Record<string, WidgetMetadata> = {
  solar_calculator: {
    id: 'solar_calculator',
    title: 'Solar & Inverter Capacity Sizing Calculator',
    category: 'solar',
    icon: '☀️',
    description: 'Appliance KVA energy load sizer, battery lifespan comparison, 10% Paystack deposit gateway, and PDF survey quote generator.',
    defaultFeeNGN: 650000
  },
  real_estate_booking: {
    id: 'real_estate_booking',
    title: 'Off-Plan Property Payment & Inspection Scheduler',
    category: 'real_estate',
    icon: '🏡',
    description: '10%-50% down-payment calculator, 6-24 month installment schedule, virtual inspection tour booking, and PDF offer letter generator.',
    defaultFeeNGN: 750000
  },
  school_tuition: {
    id: 'school_tuition',
    title: 'Online Admission Portal & CBT Exam Engine',
    category: 'school',
    icon: '🎓',
    description: 'Online CBT entrance exam access, student result checker PIN portal, termly tuition breakdown, and Paystack application fee checkout.',
    defaultFeeNGN: 450000
  },
  retainer_estimator: {
    id: 'retainer_estimator',
    title: 'Client Intake & Retainer Fee Calculator',
    category: 'legal',
    icon: '⚖️',
    description: 'Confidential legal intake, CAC filing fee calculator, upfront consultation fee deposit checkout, and encrypted document vault.',
    defaultFeeNGN: 500000
  },
  patient_intake: {
    id: 'patient_intake',
    title: 'Telehealth Patient Intake & Consultation Fee Gateway',
    category: 'medical',
    icon: '🏥',
    description: 'Doctor specialty selection, upfront consultation deposit checkout (₦15k-₦50k) to eliminate 85% no-shows, and digital prescription links.',
    defaultFeeNGN: 400000
  },
  vehicle_valuation: {
    id: 'vehicle_valuation',
    title: 'Vehicle Trade-In & Import Tariff Calculator',
    category: 'auto',
    icon: '🚗',
    description: 'Car trade-in appraisal engine, Tokunbo customs clearing tariff calculator, and showroom test drive slot booking.',
    defaultFeeNGN: 500000
  },
  ecommerce: {
    id: 'ecommerce',
    title: 'WhatsApp Express Storefront & PDF Invoice Engine',
    category: 'retail',
    icon: '🛍️',
    description: 'Direct 1-click cart transfer to WhatsApp, multi-courier delivery fee calculator (GIG/Speedaf), and thermal receipt generator.',
    defaultFeeNGN: 350000
  },
  table_reservation: {
    id: 'table_reservation',
    title: 'Table Reservation & VIP Ordering Engine',
    category: 'restaurant',
    icon: '🍝',
    description: 'Table floorplan allocator, pre-order gourmet food platters, kitchen ticket printer dispatch, and guest SMS reminders.',
    defaultFeeNGN: 300000
  },
  quote_estimator: {
    id: 'quote_estimator',
    title: 'Smart Project Estimator & Invoice Generator',
    category: 'general',
    icon: '⚙️',
    description: 'Dynamic scope sliders, automated PDF quote invoice generator, and bidirectional Google Sheets CRM sync.',
    defaultFeeNGN: 250000
  }
};

/**
 * Returns metadata for a specified widget ID with fallback to general quote estimator.
 */
export function getWidgetMetadata(widgetId: string): WidgetMetadata {
  return WIDGET_CATALOG[widgetId] || WIDGET_CATALOG['quote_estimator'];
}
