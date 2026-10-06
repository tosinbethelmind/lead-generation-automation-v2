/**
 * @file src/lib/blog/sectorCaseStudies.ts
 * 
 * Sector-to-Blog Case Study Mapping Engine
 * Bethelmind Analytics Lagos Desk (www.bethelmindanalytics.com)
 */

export interface SectorCaseStudy {
  title: string;
  slug: string;
  url: string;
  highlight: string;
  metric: string;
}

export function getSectorCaseStudy(sector: string = ''): SectorCaseStudy {
  const s = sector.toLowerCase();
  const base = 'https://www.bethelmindanalytics.com/blog';

  if (s.includes('solar') || s.includes('inverter') || s.includes('energy') || s.includes('power')) {
    return {
      title: 'Commercial Solar Payback in Lagos: How Businesses Cut Generator Diesel Bills by 80% in 2026',
      slug: 'commercial-solar-payback-in-lagos-how-businesses-cut-generator-diesel-bills-by-80-in-2026',
      url: `${base}/commercial-solar-payback-in-lagos-how-businesses-cut-generator-diesel-bills-by-80-in-2026`,
      highlight: 'Interactive 5kVA–100kVA Solar & Inverter System Sizing Engine with instant WhatsApp BOQ generation.',
      metric: '80% diesel cost reduction'
    };
  }

  if (s.includes('school') || s.includes('academy') || s.includes('college') || s.includes('education') || s.includes('tutor')) {
    return {
      title: 'School Fee Payment Reconciliation: Eliminating Manual Bank Teller Audits with Virtual Accounts',
      slug: 'school-fee-payment-reconciliation-eliminating-manual-bank-teller-audits-with-vir',
      url: `${base}/school-fee-payment-reconciliation-eliminating-manual-bank-teller-audits-with-vir`,
      highlight: 'Automated student term fee portal that auto-gates digital report cards until fees clear.',
      metric: '100% fee collection compliance'
    };
  }

  if (s.includes('salon') || s.includes('spa') || s.includes('beauty') || s.includes('hair') || s.includes('barber')) {
    return {
      title: 'Lagos Luxury Spa & Salon Booking Systems: Eliminating No-Shows and Filling Off-Peak Hours',
      slug: 'lagos-luxury-spa-booking-systems-eliminating-no-shows-and-filling-off-peak-appoi',
      url: `${base}/lagos-luxury-spa-booking-systems-eliminating-no-shows-and-filling-off-peak-appoi`,
      highlight: '24/7 WhatsApp appointment scheduler locking slots with instant Paystack/OPay deposits.',
      metric: 'Zero client no-shows'
    };
  }

  if (s.includes('auto') || s.includes('car') || s.includes('motor') || s.includes('dealer') || s.includes('mechanic')) {
    return {
      title: 'How Auto Dealerships Automate Vehicle Quotes & Import Duties on WhatsApp 24/7',
      slug: 'how-auto-dealerships-automate-vehicle-quotes-import-duties-on-whatsapp-247-lagos',
      url: `${base}/how-auto-dealerships-automate-vehicle-quotes-import-duties-on-whatsapp-247-lagos`,
      highlight: 'Automated Nigerian port tariff calculation, VIN decoding, and after-hours vehicle lead qualification.',
      metric: 'Sub-3s quotation speed'
    };
  }

  if (s.includes('hotel') || s.includes('shortlet') || s.includes('apartment') || s.includes('hospitality') || s.includes('guest')) {
    return {
      title: 'Maximizing Midweek Occupancy: Automated Dynamic Pricing for Lekki & Victoria Island Shortlets',
      slug: 'maximizing-midweek-occupancy-automated-dynamic-pricing-for-lekki-victoria-island',
      url: `${base}/maximizing-midweek-occupancy-automated-dynamic-pricing-for-lekki-victoria-island`,
      highlight: '24/7 direct WhatsApp reservation bot with caution deposit escrow and ID verification.',
      metric: '+45% midweek occupancy'
    };
  }

  if (s.includes('construction') || s.includes('contractor') || s.includes('interior') || s.includes('building') || s.includes('paint') || s.includes('tile')) {
    return {
      title: 'Construction Material Estimating in Nigeria: Instant Cement, POP, Tile & Paint Quantity Calculator',
      slug: 'construction-material-estimating-in-nigeria-instant-cement-pop-tile-paint-quanti',
      url: `${base}/construction-material-estimating-in-nigeria-instant-cement-pop-tile-paint-quanti`,
      highlight: 'Instant multi-room material calculator preventing site theft and contractor over-billing.',
      metric: 'Zero site material shrinkage'
    };
  }

  if (s.includes('clinic') || s.includes('hospital') || s.includes('health') || s.includes('dental') || s.includes('diagnostic')) {
    return {
      title: 'Zero No-Shows: How Private Clinics and Diagnostic Centers in Lagos Automate Patient Intake',
      slug: 'zero-no-shows-how-private-clinics-and-diagnostic-centers-in-lagos-automate-patie',
      url: `${base}/zero-no-shows-how-private-clinics-and-diagnostic-centers-in-lagos-automate-patie`,
      highlight: 'Automated consultation questionnaires, triage scheduling, and pre-payment lock.',
      metric: '3.4x faster patient onboarding'
    };
  }

  if (s.includes('farm') || s.includes('agri') || s.includes('poultry') || s.includes('fish') || s.includes('feed')) {
    return {
      title: 'Bulk Agribusiness Input Consolidation: How Farm Collectives Slash Feed Costs by 25%',
      slug: 'bulk-agribusiness-input-consolidation-how-farm-collectives-slash-feed-costs-by-2',
      url: `${base}/bulk-agribusiness-input-consolidation-how-farm-collectives-slash-feed-costs-by-2`,
      highlight: 'Smallholder feed and input aggregation engine securing wholesale bulk mill discounts.',
      metric: '25% input cost savings'
    };
  }

  if (s.includes('supermarket') || s.includes('retail') || s.includes('store') || s.includes('boutique') || s.includes('pharmacy')) {
    return {
      title: 'Fake Alert Proof Bank Transfers: How Nigerian Supermarkets & Boutiques Eliminate Transfer Fraud',
      slug: 'fake-alert-proof-bank-transfers-how-nigerian-supermarkets-and-boutiques-eliminat',
      url: `${base}/fake-alert-proof-bank-transfers-how-nigerian-supermarkets-and-boutiques-eliminat`,
      highlight: 'Instant Moniepoint/OPay webhook bank transfer reconciliation stopping fake SMS receipts.',
      metric: '100% fake alert prevention'
    };
  }

  // Universal Default
  return {
    title: 'The 3-Second Speed-to-Lead Rule: How Nigerian Commercial Vendors Automate Sales on WhatsApp',
    slug: 'the-3-second-speed-to-lead-rule-how-instagram-vendors-automate-sales-on-whatsapp',
    url: `${base}/the-3-second-speed-to-lead-rule-how-instagram-vendors-automate-sales-on-whatsapp`,
    highlight: '24/7 AI WhatsApp catalog closer qualifying inbound commercial inquiries instantly.',
    metric: '3-second speed-to-lead'
  };
}
