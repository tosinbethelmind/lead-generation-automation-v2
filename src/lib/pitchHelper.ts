import { parseSpintax } from './whatsapp';

export interface Lead {
  lead_id: string;
  name: string;
  category: string;
  address?: string;
  area?: string;
  city?: string;
  phone_raw?: string;
  phone_e164?: string;
  email?: string;
  rating?: number;
  reviews_count?: number;
  website?: string;
  notes?: string;
  isMock?: boolean;
}

export type WidgetType = 'ecommerce' | 'vehicle_valuation' | 'table_reservation' | 'patient_intake' | 'quote_estimator' | 'solar_calculator' | 'real_estate_booking' | 'school_tuition' | 'retainer_estimator';

export interface WhatsAppMessageSim {
  sender: 'customer' | 'bot' | 'agent';
  text: string;
  timeOffsetMs: number;
}

export interface InvoiceDemoSchema {
  currency: string;
  taxRate: number;
  items: { name: string; price: number; qty: number }[];
}

export type CategoryKey = 'solar' | 'real_estate' | 'school' | 'medical' | 'auto' | 'retail' | 'restaurant' | 'legal' | 'agro_logistics' | 'microfinance' | 'interior_decor' | 'cleaning_security' | 'event_venue' | 'printing_packaging' | 'car_rental' | 'general';

export interface PitchDetails {
  categoryKey: CategoryKey;
  emailSubject: string;
  emailBody: string;
  whatsappIcebreaker: string; // Step 1: No-link icebreaker / permission question
  whatsappBody: string;       // Step 2: Full pitch with preview URL and opt-out footer
  socialBody: string;
  voiceNoteScript?: string;
  estimatedMonthlyLeads?: string;
  estimatedRevenueIncrease?: string;
  widgetType: WidgetType;
  widgetTitle: string;
  widgetDescription: string;
  benefitsList: string[];
  whatsappSim: WhatsAppMessageSim[];
  invoiceDemo: InvoiceDemoSchema;
}

const OPT_OUT_NOTICE = '\n\n(You can stop receiving messages from us anytime by replying STOP)';

/**
 * Classifies a raw category string into standard Nigerian industry segments.
 */
export function getCategoryType(categoryRaw: string): CategoryKey {
  const cat = (categoryRaw || '').toLowerCase();
  if (
    cat.includes('solar') ||
    cat.includes('inverter') ||
    cat.includes('clean tech') ||
    cat.includes('energy') ||
    cat.includes('battery') ||
    cat.includes('power')
  ) {
    return 'solar';
  }
  if (
    cat.includes('estate') ||
    cat.includes('property') ||
    cat.includes('real estate') ||
    cat.includes('realty') ||
    cat.includes('developer') ||
    cat.includes('housing') ||
    cat.includes('apartment') ||
    cat.includes('shortlet')
  ) {
    return 'real_estate';
  }
  if (
    cat.includes('school') ||
    cat.includes('academy') ||
    cat.includes('college') ||
    cat.includes('university') ||
    cat.includes('tutor') ||
    cat.includes('education') ||
    cat.includes('creche') ||
    cat.includes('nursery')
  ) {
    return 'school';
  }
  if (
    cat.includes('law') ||
    cat.includes('legal') ||
    cat.includes('attorney') ||
    cat.includes('advocate') ||
    cat.includes('solicitor') ||
    cat.includes('barrister') ||
    cat.includes('consultant') ||
    cat.includes('accounting') ||
    cat.includes('audit')
  ) {
    return 'legal';
  }
  if (
    cat.includes('dent') ||
    cat.includes('clin') ||
    cat.includes('medic') ||
    cat.includes('health') ||
    cat.includes('spa') ||
    cat.includes('salon') ||
    cat.includes('hospital') ||
    cat.includes('wellness') ||
    cat.includes('therapy')
  ) {
    return 'medical';
  }
  if (
    cat.includes('agro') ||
    cat.includes('farm') ||
    cat.includes('cold room') ||
    cat.includes('cold storage') ||
    cat.includes('produce') ||
    cat.includes('poultry')
  ) {
    return 'agro_logistics';
  }
  if (
    cat.includes('microfinance') ||
    cat.includes('cooperative') ||
    cat.includes('thrift') ||
    cat.includes('savings') ||
    cat.includes('credit')
  ) {
    return 'microfinance';
  }
  if (
    cat.includes('interior') ||
    cat.includes('furniture') ||
    cat.includes('architect') ||
    cat.includes('decor') ||
    cat.includes('cabinet') ||
    cat.includes('aluminum')
  ) {
    return 'interior_decor';
  }
  if (
    cat.includes('clean') ||
    cat.includes('fumigation') ||
    cat.includes('pest') ||
    cat.includes('security') ||
    cat.includes('cctv') ||
    cat.includes('guard') ||
    cat.includes('janitorial')
  ) {
    return 'cleaning_security';
  }
  if (
    cat.includes('event') ||
    cat.includes('hall') ||
    cat.includes('party') ||
    cat.includes('venue') ||
    cat.includes('plaza') ||
    cat.includes('marquee')
  ) {
    return 'event_venue';
  }
  if (
    cat.includes('print') ||
    cat.includes('packaging') ||
    cat.includes('press') ||
    cat.includes('souvenir') ||
    cat.includes('banner') ||
    cat.includes('flex')
  ) {
    return 'printing_packaging';
  }
  if (
    cat.includes('rental') ||
    cat.includes('chauffeur') ||
    cat.includes('shuttle') ||
    cat.includes('prado') ||
    cat.includes('hire') ||
    cat.includes('car rental')
  ) {
    return 'car_rental';
  }
  if (
    cat.includes('car') ||
    cat.includes('auto') ||
    cat.includes('dealer') ||
    cat.includes('motor') ||
    cat.includes('mechanic') ||
    cat.includes('logistics') ||
    cat.includes('transport') ||
    cat.includes('truck') ||
    cat.includes('courier')
  ) {
    return 'auto';
  }
  if (
    cat.includes('boutique') ||
    cat.includes('shop') ||
    cat.includes('store') ||
    cat.includes('retail') ||
    cat.includes('clothing') ||
    cat.includes('wear') ||
    cat.includes('fashion') ||
    cat.includes('electronic') ||
    cat.includes('supermarket') ||
    cat.includes('grocery') ||
    cat.includes('gift')
  ) {
    return 'retail';
  }
  if (
    cat.includes('rest') ||
    cat.includes('cafe') ||
    cat.includes('food') ||
    cat.includes('cater') ||
    cat.includes('bar') ||
    cat.includes('kitchen') ||
    cat.includes('eat') ||
    cat.includes('bakery') ||
    cat.includes('grill') ||
    cat.includes('hotel')
  ) {
    return 'restaurant';
  }
  return 'general';
}

/**
 * Returns dynamic pitch texts, simulated WhatsApp messages, and receipt structures with Nigerian Spintax.
 */
export function getPitchDetails(lead: Lead, origin: string, signature: string): PitchDetails {
  const categoryKey = getCategoryType(lead.category);
  const previewUrl = `${origin}/preview/${lead.lead_id}`;
  const hasWebsite = !!(lead.website && lead.website.trim());

  // Safe template variables
  const name = lead.name || 'Business Owner';
  const area = lead.area || 'your area';
  const rating = lead.rating || 4.8;
  const reviewsCount = lead.reviews_count || 15;
  const webUrl = lead.website || '';

  let emailSubject = '';
  let emailBody = '';
  let whatsappIcebreaker = '';
  let whatsappBody = '';
  let socialBody = '';
  let voiceNoteScript = '';
  let widgetType: WidgetType = 'quote_estimator';
  let widgetTitle = '';
  let widgetDescription = '';
  let benefitsList: string[] = [];
  let whatsappSim: WhatsAppMessageSim[] = [];
  let invoiceDemo: InvoiceDemoSchema = { currency: '₦', taxRate: 0.075, items: [] };

  switch (categoryKey) {
    case 'solar':
      widgetType = 'solar_calculator';
      widgetTitle = 'Interactive Solar & Inverter Capacity Sizing Calculator';
      widgetDescription = 'Simulate selecting home/office appliances to calculate KVA load, battery capacity, diesel savings, and instant Paystack deposit generation.';
      benefitsList = [
        'Dynamic Appliance KVA & Energy Audit Load Estimator',
        'Automatic Diesel vs Grid vs Solar Cost Savings Comparison',
        'Instant Paystack / Moniepoint Deposit Checkout Gateway (50% Deposit & Installments)',
        'Automatic PDF Technical Survey Quote dispatched to WhatsApp & Email'
      ];
      invoiceDemo = {
        currency: '₦',
        taxRate: 0.075,
        items: [
          { name: '5KVA Hybrid Solar Inverter System (4x 220Ah Tubular Gel Batteries)', price: 1850000, qty: 1 },
          { name: 'Mono-Perc Solar Panels (6x 550W High Efficiency)', price: 960000, qty: 1 },
          { name: 'Installation, Cabling, Changeover & Surge Protection', price: 250000, qty: 1 }
        ]
      };
      whatsappSim = [
        { sender: 'customer', text: 'Hi! I calculated a 5KVA Solar System requirement on your website calculator.', timeOffsetMs: 500 },
        { sender: 'bot', text: `Hello! ☀️ Welcome to ${name} Solar Portal. Branded Technical Quote #SL-8842 (Total: ₦3,060,000) has been generated. You can pay a 10% commitment deposit or request an engineer visit.`, timeOffsetMs: 1500 },
        { sender: 'agent', text: `🔔 [Solar Lead Alert] Client calculated 5KVA System (₦3.06M). Address: Lekki Phase 1, Lagos. Phone: +2348035550192. Quote PDF & Site Audit schedule synced to CRM.`, timeOffsetMs: 3000 }
      ];

      whatsappIcebreaker = `{Good day|Hello|Good afternoon} {Sir/Ma|Engineer|Team} 🙏, {is this the lead engineer|are you the management team} {for|in charge of} ${name} in ${area}?`;

      if (hasWebsite) {
        emailSubject = `{Solar Load Calculator|Paystack Deposit Upgrade|24/7 Solar Sales Portal} for ${name}`;
        emailBody = `Good day ${name} Team,\n\nWe reviewed your website (${webUrl}) and noticed prospective solar buyers in ${area} cannot calculate their KVA load, estimate diesel savings, or pay commitment deposits online.\n\nWe built an interactive Solar Load Sizing & Deposit Calculator upgrade preview for your brand:\n${previewUrl}\n\nTest the interactive calculator to see how it captures diaspora and high-ticket buyers and routes hot leads to your WhatsApp sales team.\n\nBest regards,\n${signature}`;
        whatsappBody = `{Good day|Hello} ${name} Team 👋,\n\n{We visited your website|Following up on our review of ${webUrl}}, our team custom-built an interactive Solar Load & Diesel Savings Calculator preview for you:\n${previewUrl}\n\nTry calculating a 5KVA system to see how it generates instant branded PDF quotes and Paystack commitment deposits.${OPT_OUT_NOTICE}`;
        socialBody = `Hello ${name}! We noticed solar buyers in Nigeria need instant capacity estimators. We built this interactive solar quote system preview for your site (${webUrl}): ${previewUrl}`;
      } else {
        emailSubject = `Digital Solar Showroom & Load Calculator Website for ${name}`;
        emailBody = `Good day ${name} Team,\n\nWe saw ${name} has an impressive track record (${rating}★, ${reviewsCount} reviews) in ${area}, but lacks an online solar calculator portal.\n\nWe custom-built a modern Solar Engineering landing page, interactive load estimator, and video walkthrough for you:\n${previewUrl}\n\nIt allows clients to size their inverters and pay site audit fees online. Take a look and claim your site.\n\nBest regards,\n${signature}`;
        whatsappBody = `{Good day|Hello} ${name} Team 🙏,\n\n{We noticed your strong reputation|Impressive ${rating}★ rating} in ${area}! We built an interactive Solar Engineering portal & KVA calculator preview for your business:\n${previewUrl}\n\nClients can size inverters and book site audits 24/7 directly from their phones.${OPT_OUT_NOTICE}`;
        socialBody = `Hi ${name}! We noticed your solar business in ${area} doesn't have an online capacity calculator. We built this interactive preview for you: ${previewUrl}`;
      }
      break;

    case 'real_estate':
      widgetType = 'real_estate_booking';
      widgetTitle = 'Off-Plan Property Payment & Tour Scheduling Engine';
      widgetDescription = 'Simulate property tour bookings, initial deposit installment calculations, and instant WhatsApp agent routing.';
      benefitsList = [
        'Interactive Down-Payment & Monthly Installment Calculator (10%, 20%, 30% Initial Deposit)',
        'Virtual & On-Site Property Inspection Slot Scheduler',
        'Instant Paystack / Moniepoint Reservation Fee Checkout Gateway',
        'Automated Buyer KYC & Offer Letter PDF Generator'
      ];
      invoiceDemo = {
        currency: '₦',
        taxRate: 0,
        items: [
          { name: '4-Bedroom Fully Detached Duplex (Off-Plan Unit #12)', price: 120000000, qty: 1 },
          { name: 'Initial Allocation Commitment Deposit (10%)', price: 12000000, qty: 1 }
        ]
      };
      whatsappSim = [
        { sender: 'customer', text: 'Hi! I want to schedule a physical tour of your Lekki 4-Bedroom Duplex project.', timeOffsetMs: 500 },
        { sender: 'bot', text: `Hello! 🏡 ${name} Concierge here. We reserved Saturday at 11:00 AM for your private tour. Your PDF Property Brochure & Payment Breakdown link: [View Brochure]`, timeOffsetMs: 1500 },
        { sender: 'agent', text: `🔔 [High Net-Worth Real Estate Lead] Client booked private inspection for 4-Bed Duplex (₦120M). Buyer: Chief K. Adeniyi (+2348021112233). CRM log updated.`, timeOffsetMs: 3000 }
      ];

      whatsappIcebreaker = `{Good day|Hello|Good afternoon} {Sir/Ma|Chief|Realtor|Team} 🙏, {is this the sales director|are you the team in charge of} {property listings for|developments by} ${name} in ${area}?`;

      if (hasWebsite) {
        emailSubject = `Off-Plan Payment Calculators & Inspection Portal for ${name}`;
        emailBody = `Good day ${name} Team,\n\nWe reviewed your real estate platform (${webUrl}) and noticed prospective buyers cannot calculate installment plans or schedule inspection tours seamlessly online.\n\nWe built an Off-Plan Payment & Tour Booking upgrade preview for your brand:\n${previewUrl}\n\nSee how it captures diaspora and local buyers and routes hot leads to your WhatsApp agents.\n\nBest regards,\n${signature}`;
        whatsappBody = `{Good day|Hello} ${name} Team 👋,\n\n{We reviewed your property listings|We saw your real estate platform} (${webUrl}) and built an interactive Off-Plan Installment Calculator & Tour Booking preview for you:\n${previewUrl}\n\nDiaspora buyers can schedule tours and calculate 10%-30% deposits automatically.${OPT_OUT_NOTICE}`;
        socialBody = `Hello ${name}! We designed an interactive property payment calculator proposal for your platform (${webUrl}): ${previewUrl}`;
      } else {
        emailSubject = `Luxury Real Estate Showcase & Inspection Booking Portal for ${name}`;
        emailBody = `Good day ${name} Team,\n\nWe noticed ${name} has a top-rated reputation (${rating}★) in ${area}, but lacks an interactive property showcase portal.\n\nWe custom-built a modern Real Estate showcase landing page, payment calculator, and booking system for your listings:\n${previewUrl}\n\nClaim this portal to start capturing high-ticket property buyers online.\n\nBest regards,\n${signature}`;
        whatsappBody = `{Good day|Hello} ${name} Team 🙏,\n\n{We noticed your property developments|Great track record} in ${area}! We custom-built a luxury property showcase and tour booking preview for your listings:\n${previewUrl}\n\nTake 30 seconds to test the installment calculator on your phone.${OPT_OUT_NOTICE}`;
        socialBody = `Hi! We built a modern property showcase preview for ${name} in ${area}: ${previewUrl}`;
      }
      break;

    case 'school':
      widgetType = 'school_tuition';
      widgetTitle = 'Online Admission Portal & Tuition Fee Installment Calculator';
      widgetDescription = 'Simulate parent registration, tuition breakdown calculation, and instant admission form fee checkout via Paystack/Moniepoint.';
      benefitsList = [
        'Interactive Termly Tuition & Boarding Fee Breakdown Calculator',
        'Digital Student Admission Application Form with Uploads',
        'Instant Paystack / Moniepoint Admission Form Fee Checkout',
        'Automated PDF Provisional Admission Letter Generator'
      ];
      invoiceDemo = {
        currency: '₦',
        taxRate: 0,
        items: [
          { name: 'Term 1 Tuition Fee (Senior Secondary)', price: 350000, qty: 1 },
          { name: 'Uniforms, Textbooks & Digital Learning Tablet', price: 120000, qty: 1 },
          { name: 'Application & Entrance Examination Fee', price: 20000, qty: 1 }
        ]
      };
      whatsappSim = [
        { sender: 'customer', text: 'Hi! I filled out an online admission inquiry for JS1 for my son.', timeOffsetMs: 500 },
        { sender: 'bot', text: `Hello! 🎓 Welcome to ${name} Admissions. Your Entrance Examination reference is #SCH-4029. Exam Date: Next Saturday 9 AM. Download syllabus: [Link]`, timeOffsetMs: 1500 },
        { sender: 'agent', text: `🔔 [New School Admission Inquiry] Parent: Mrs. Janet Okoh. Student: David Okoh (Applying for JS1). Application Fee Paid: ₦20,000. Entrance Exam slip dispatched.`, timeOffsetMs: 3000 }
      ];

      whatsappIcebreaker = `{Good day|Hello} {Sir/Ma|Proprietor|Administrator} 🙏, {is this the administration office|are you in charge of admissions} {for|at} ${name} in ${area}?`;

      if (hasWebsite) {
        emailSubject = `Digital Admissions & Tuition Fee Payment Upgrade for ${name}`;
        emailBody = `Good day ${name} Management,\n\nWe reviewed your school website (${webUrl}) and noticed parents cannot complete admission forms or pay fees online seamlessly.\n\nWe designed a digital admissions portal and tuition fee calculator upgrade preview:\n${previewUrl}\n\nTest how parents can pay application fees via Paystack and receive instant PDF entrance exam slips.\n\nBest regards,\n${signature}`;
        whatsappBody = `{Good day|Hello} ${name} Management 👋,\n\nWe built an online admission portal & termly fee calculator proposal for your school:\n${previewUrl}\n\nParents can apply online and download entrance exam passes automatically.${OPT_OUT_NOTICE}`;
        socialBody = `Hello! We designed an interactive admission portal proposal for ${name} (${webUrl}): ${previewUrl}`;
      } else {
        emailSubject = `Modern School Website & Digital Admissions Portal for ${name}`;
        emailBody = `Good day ${name} Management,\n\nWe noticed ${name} has an outstanding reputation (${rating}★, ${reviewsCount} reviews) in ${area}, but lacks an interactive web address.\n\nWe custom-built a modern school website and admissions portal for your institution:\n${previewUrl}\n\nParents can apply online and download prospectus materials. Claim your site today.\n\nBest regards,\n${signature}`;
        whatsappBody = `{Good day|Hello} ${name} Management 🙏,\n\n{Recognizing your academic excellence|Congratulations on your ${rating}★ reputation} in ${area}! We custom-built a modern school portal and digital admission form preview for your institution:\n${previewUrl}\n\nTest how parents can complete entrance registrations online.${OPT_OUT_NOTICE}`;
        socialBody = `Hi! We built a modern school portal preview for ${name} in ${area}: ${previewUrl}`;
      }
      break;

    case 'medical':
      widgetType = 'patient_intake';
      widgetTitle = 'Interactive Patient Scheduling & Intake Portals';
      widgetDescription = 'Simulate booking an appointment to see patient details capture, automatic calendar booking, and immediate WhatsApp reminders.';
      benefitsList = [
        'Direct calendar synchronization (Google, Outlook, Apple)',
        'Automated patient intake Forms (captures insurance, medical history)',
        'Automatic WhatsApp & SMS appointment reminders to reduce 85% of no-shows',
        'Telehealth video session instant-link dispatcher'
      ];
      invoiceDemo = {
        currency: '₦',
        taxRate: 0.05,
        items: [
          { name: 'Initial Dental Consultation & Checkup', price: 25000, qty: 1 },
          { name: 'X-Ray Imaging', price: 15000, qty: 1 }
        ]
      };
      whatsappSim = [
        { sender: 'customer', text: 'Hi! I would like to book a dental checkup session for this Friday at 10 AM.', timeOffsetMs: 500 },
        { sender: 'bot', text: `Hello! 🌟 Welcome to ${name} Automated Scheduler. We've reserved Friday at 10:00 AM for you. Please fill out our digital intake form here: [Click to Fill Form]`, timeOffsetMs: 1500 },
        { sender: 'agent', text: `🔔 [New Booking Alert] Client John Doe booked "Dental Consultation" for Fri, 10:00 AM. Contact: +2348031234567. Syncing details to CRM.`, timeOffsetMs: 3000 }
      ];

      whatsappIcebreaker = `{Good day|Hello} {Doctor|Sir/Ma|Admin} 🙏, {is this the practice manager|are you the clinic coordinator} {for|at} ${name} in ${area}?`;

      if (hasWebsite) {
        emailSubject = `Upgrading ${name} with Online Patient Intake & Booking`;
        emailBody = `Good day ${name} Team,\n\nWe visited your website (${webUrl}) and noticed patients cannot schedule appointments or complete intake paperwork online.\n\nWe designed an interactive patient intake upgrade for you to test:\n${previewUrl}\n\nThis system automates scheduling, secures data, and triggers instant WhatsApp reminders to eliminate no-shows.\n\nBest regards,\n${signature}`;
        whatsappBody = `{Good day|Hello} ${name} Medical Team 👋,\n\nWe designed an upgraded patient booking & automated WhatsApp reminder portal preview for your clinic:\n${previewUrl}\n\nEliminate 85% of patient no-shows with instant calendar sync.${OPT_OUT_NOTICE}`;
        socialBody = `Hello! We noticed your clinic website (${webUrl}) lacks online appointment scheduling. We created a customized booking portal proposal for you here: ${previewUrl}`;
      } else {
        emailSubject = `Patient Booking System & Custom Web Design for ${name}`;
        emailBody = `Good day ${name} Team,\n\nWe noticed ${name} has a top-rated reputation (${rating}★, ${reviewsCount} reviews) in ${area}, but lacks an online booking system.\n\nWe custom-built a modern patient booking landing page for you to review:\n${previewUrl}\n\nIt features interactive appointment booking and medical intake automation.\n\nBest regards,\n${signature}`;
        whatsappBody = `{Good day|Hello} ${name} Team 🙏,\n\n{We noticed your clinic's top-rated service|Top-rated clinic} in ${area}! We custom-built a modern patient intake and appointment booking preview for you:\n${previewUrl}\n\nTake a quick look on your phone.${OPT_OUT_NOTICE}`;
        socialBody = `Hi ${name}! We custom-built this modern booking preview portal for your clinic in ${area}: ${previewUrl}`;
      }
      break;

    case 'auto':
      widgetType = 'vehicle_valuation';
      widgetTitle = 'Smart Vehicle Trade-In Valuation Calculator';
      widgetDescription = 'Simulate calculating a trade-in value to see instant price estimations and instant CRM lead alerts routed straight to your sales team.';
      benefitsList = [
        'Dynamic trade-in pricing engine based on car condition and year',
        'Instant WhatsApp notifications to sales agents for every high-value inquiry',
        'Automatic customer follow-up email with PDF trade-in valuation certificates',
        'Showroom listing filter with lead capture forms'
      ];
      invoiceDemo = {
        currency: '₦',
        taxRate: 0.075,
        items: [
          { name: 'Vehicle Diagnostic Inspection Fee', price: 30000, qty: 1 },
          { name: 'Trade-in Booking Valuation & Processing', price: 15000, qty: 1 }
        ]
      };
      whatsappSim = [
        { sender: 'customer', text: 'Hi! I want to trade in my Toyota Corolla 2018 for a trade-in offer.', timeOffsetMs: 500 },
        { sender: 'bot', text: 'Excellent choice! 🚗 Based on your vehicle details, your estimated trade-in value is ₦8,500,000. An agent has been notified to inspect it.', timeOffsetMs: 1800 },
        { sender: 'agent', text: '🔔 [Hot Car Dealership Lead] Client wants to trade in Toyota Corolla 2018 (Valued at ₦8.5M). Phone: +2348029876543. Tap to start WhatsApp chat: https://wa.me/2348029876543', timeOffsetMs: 3200 }
      ];

      whatsappIcebreaker = `{Good day|Hello} {Sir/Ma|Boss|Chief} 🙏, {is this the sales desk|are you in charge of vehicle sales} {at|for} ${name} in ${area}?`;

      if (hasWebsite) {
        emailSubject = `Smart Trade-In Estimators & WhatsApp Alerts for ${name}`;
        emailBody = `Good day ${name} Team,\n\nWe visited your auto platform (${webUrl}) and noticed buyers cannot get trade-in evaluations or schedule test drives online.\n\nWe custom-designed an interactive trade-in & valuation upgrade preview for you:\n${previewUrl}\n\nTest the estimator to see how we route high-intent buyer leads straight to your sales team's WhatsApp.\n\nBest regards,\n${signature}`;
        whatsappBody = `{Good day|Hello} ${name} Auto Team 👋,\n\nWe designed an interactive car valuation & trade-in estimator preview for your platform (${webUrl}):\n${previewUrl}\n\nTry trading in a car to see instant WhatsApp sales routing!${OPT_OUT_NOTICE}`;
        socialBody = `Hello! Checked out your showroom at ${name}. We designed this interactive valuation calculator proposal for your site: ${previewUrl}`;
      } else {
        emailSubject = `Digital Showroom & Trade-In Capture System for ${name}`;
        emailBody = `Good day ${name} Team,\n\nWe saw you have a fantastic local reputation (${rating}★, ${reviewsCount} reviews) for ${name} in ${area}, but no official digital showroom connected yet.\n\nWe custom-designed a digital showroom landing page for your dealership:\n${previewUrl}\n\nIt features an interactive trade-in valuation estimator. Claim the design to launch.\n\nBest regards,\n${signature}`;
        whatsappBody = `{Good day|Hello} ${name} Team 🙏,\n\n{We noticed your car inventory|Impressive car showroom} in ${area}! We designed a digital showroom & trade-in calculator preview for your dealership:\n${previewUrl}\n\nSee how car buyers calculate trade-ins directly online.${OPT_OUT_NOTICE}`;
        socialBody = `Hi! We custom-built this modern vehicle showroom portal preview for ${name} in ${area}: ${previewUrl}`;
      }
      break;

    case 'general':
    default:
      widgetType = 'quote_estimator';
      widgetTitle = 'Smart Project Estimator & Invoice Generator';
      widgetDescription = 'Simulate adjusting the sliders to estimate costs and see immediate PDF quote invoice generation and CRM logging.';
      benefitsList = [
        'Dynamic quote estimator slider based on project scope, size, or duration',
        'Automatic branded PDF quote invoice generated and emailed to lead',
        'Bidirectional client sync with Google Sheets CRM',
        'Instant WhatsApp notifications for new business proposals'
      ];
      invoiceDemo = {
        currency: '₦',
        taxRate: 0.075,
        items: [
          { name: 'Standard Project Set-Up & Consulting Fee', price: 150000, qty: 1 },
          { name: 'Implementation & Custom Development Service', price: 250000, qty: 1 }
        ]
      };
      whatsappSim = [
        { sender: 'customer', text: 'Hi! I calculated a cost estimate of ₦400,000 for standard web automation.', timeOffsetMs: 500 },
        { sender: 'bot', text: 'Hello! Branded PDF Estimate Quote #8283 has been dispatched to your email. An agent will contact you shortly.', timeOffsetMs: 1600 },
        { sender: 'agent', text: '🔔 [New Quote Request] Client calculated ₦400,000 estimate. Contact: info@client.com. PDF Invoice #8283 generated. Logs synced to Google Sheets CRM.', timeOffsetMs: 3100 }
      ];

      whatsappIcebreaker = `{Good day|Hello|Good afternoon} {Sir/Ma|Team|Chief} 🙏, {is this the management team|are you the director} {for|at} ${name} in ${area}?`;

      if (hasWebsite) {
        emailSubject = `🚀 AI Sales Engine & Automated WhatsApp Portal Upgrade for ${name}`;
        emailBody = `Good day ${name} Team,\n\nWe visited your business website (${webUrl}) and noticed your visitors cannot currently receive instant pricing quotes, calculate estimates, or make direct payments online.\n\nWe built a high-conversion AI Website & 24/7 WhatsApp Sales Engine preview for your brand:\n${previewUrl}\n\nWhat this does for ${name}:\n1. 🤖 24/7 AI WhatsApp Agent: Answers customer inquiries in English & Pidgin.\n2. ⚡ Instant Quotation Engine: Generates branded PDF quotes sent to customer WhatsApp.\n3. 💳 Moniepoint / OPay / Paystack Direct Checkout: Collects card & bank transfer payments.\n4. 🚨 Hot Deal WhatsApp Alert: Alerts your phone the second a client is ready to pay.\n\nTest your live preview here: ${previewUrl}\n\nBest regards,\n${signature}`;
        whatsappBody = `{Good day|Hello} ${name} Team 👋,\n\n{We visited your website|Following up on our review of ${webUrl}}, we built a custom 24/7 AI Sales Engine & Quote Estimator preview for your brand:\n${previewUrl}\n\nIt handles WhatsApp inquiries, outputs PDF quotes, and alerts your phone when clients are ready to pay.${OPT_OUT_NOTICE}`;
        socialBody = `Hello ${name}! We custom-built an interactive AI website preview & 24/7 WhatsApp sales engine for your business: ${previewUrl}`;
      } else {
        emailSubject = `🔥 Modern AI Website & 24/7 WhatsApp Sales Engine for ${name}`;
        emailBody = `Good day ${name} Team,\n\nWe noticed ${name} has a top-rated reputation (${rating}★, ${reviewsCount} reviews) in ${area}, but lacks an official automated website.\n\nWe custom-built a modern AI Website and 24/7 WhatsApp Sales Engine for your business:\n${previewUrl}\n\nWhat is included for ${name}:\n1. 🌐 Custom Domain (.com.ng / .com) + 1 Full Year High-Speed Server Hosting.\n2. 🤖 24/7 AI WhatsApp Agent (Listens & replies to inquiries).\n3. ⚡ Instant PDF Quotation Engine.\n4. 💳 Moniepoint & Paystack Payment Integration.\n5. 🛡️ 100% Zero Lock-In Guarantee (You own your code & domain).\n\nTest your live website preview here: ${previewUrl}\n\nBest regards,\n${signature}`;
        whatsappBody = `{Good day|Hello} ${name} Team 🙏,\n\n{Recognizing your top-rated reputation|Impressive ${rating}★ rating} in ${area}! We custom-built a modern AI website and 24/7 quote automation preview for your business:\n${previewUrl}\n\nTake 30 seconds to test it directly on your phone.${OPT_OUT_NOTICE}`;
        socialBody = `Hi ${name}! We custom-built a modern AI website preview & WhatsApp automation engine for your brand in ${area}: ${previewUrl}`;
      }
      break;
  }

  // Cross-channel references
  const emailText = lead.email ? lead.email.trim() : '';
  if (emailText) {
    if (whatsappBody && !whatsappBody.includes(emailText)) {
      whatsappBody += ` (Detailed proposal also sent to your email: ${emailText}).`;
    }
  }

  return {
    categoryKey,
    emailSubject,
    emailBody,
    whatsappIcebreaker,
    whatsappBody,
    socialBody,
    voiceNoteScript,
    widgetType,
    widgetTitle,
    widgetDescription,
    benefitsList,
    whatsappSim,
    invoiceDemo
  };
}

/**
 * Replaces placeholders in outreach text and parses Spintax.
 */
export function formatPitchTemplate(template: string, lead: Lead, previewUrl: string, signature: string): string {
  const resolved = template
    .replace(/{{\s*lead\.name\s*}}/g, lead.name || 'Valued Business')
    .replace(/{{\s*lead\.rating\s*}}/g, String(lead.rating || '4.8'))
    .replace(/{{\s*lead\.reviews_count\s*}}/g, String(lead.reviews_count || '15'))
    .replace(/{{\s*lead\.area\s*}}/g, lead.area || 'your area')
    .replace(/{{\s*lead\.website\s*}}/g, lead.website || '')
    .replace(/{{\s*previewUrl\s*}}/g, previewUrl)
    .replace(/{{\s*preview_url\s*}}/g, previewUrl)
    .replace(/{{\s*signature\s*}}/g, signature)
    .replace(/{{\s*businessSignature\s*}}/g, signature);

  return parseSpintax(resolved);
}
