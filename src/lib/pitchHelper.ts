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

export type CategoryKey = 'solar' | 'real_estate' | 'school' | 'medical' | 'auto' | 'retail' | 'restaurant' | 'legal' | 'general';

export interface PitchDetails {
  categoryKey: CategoryKey;
  emailSubject: string;
  emailBody: string;
  whatsappBody: string;
  socialBody: string;
  widgetType: WidgetType;
  widgetTitle: string;
  widgetDescription: string;
  benefitsList: string[];
  whatsappSim: WhatsAppMessageSim[];
  invoiceDemo: InvoiceDemoSchema;
}

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
 * Returns dynamic pitch texts, simulated WhatsApp messages, and receipt structures.
 */
export function getPitchDetails(lead: Lead, origin: string, signature: string): PitchDetails {
  const categoryKey = getCategoryType(lead.category);
  const previewUrl = `${origin}/preview/${lead.lead_id}`;
  const hasWebsite = !!(lead.website && lead.website.trim());

  // Safe templates variables
  const name = lead.name || 'Business Owner';
  const area = lead.area || 'your area';
  const rating = lead.rating || 4.5;
  const reviewsCount = lead.reviews_count || 12;
  const webUrl = lead.website || '';

  let emailSubject = '';
  let emailBody = '';
  let whatsappBody = '';
  let socialBody = '';
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

      if (hasWebsite) {
        emailSubject = `Solar Calculator & Paystack Deposit Upgrade for ${name}`;
        emailBody = `Hi ${name} Team,\n\nWe inspected your website (${webUrl}) and noticed prospective solar buyers cannot calculate their KVA load, estimate battery requirements, or pay commitment deposits online.\n\nWe built a high-conversion Solar Load Sizing & Deposit Calculator upgrade mockup and video walkthrough for your brand:\n${previewUrl}\n\nTest the interactive calculator to see how we automate quotes and route high-intent solar leads straight to your WhatsApp sales team.\n\n*(Note: Custom ERP/Inventory integrations available on request.)*\n\nBest regards,\n${signature}`;
        whatsappBody = `Hi ${name} Team! We visited your website (${webUrl}) and created a Solar Load Calculator & Paystack Deposit preview with video walkthrough for you: ${previewUrl}. Try calculating a 5KVA system!`;
        socialBody = `Hello! Checked out ${name}. Solar buyers in Nigeria need instant capacity estimators. We built this interactive solar quote system and video walkthrough for your site (${webUrl}): ${previewUrl}`;
      } else {
        emailSubject = `Digital Solar Showroom & Load Calculator Website for ${name}`;
        emailBody = `Hi ${name} Team,\n\nWe saw ${name} has an impressive rating (${rating} stars, ${reviewsCount} reviews) in ${area}, but lacks an online solar calculator portal.\n\nWe custom-built a modern Solar Engineering landing page, interactive load estimator, and video walkthrough for you:\n${previewUrl}\n\nIt allows clients to size their inverters and pay site audit fees online. Take a look and claim your site.\n\nBest regards,\n${signature}`;
        whatsappBody = `Hi ${name} Team! We built a modern solar load calculator website proposal and video walkthrough for your brand: ${previewUrl}`;
        socialBody = `Hi ${name}! We noticed your solar business in ${area} doesn't have an online capacity calculator. We built this interactive preview and walkthrough for you: ${previewUrl}`;
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

      if (hasWebsite) {
        emailSubject = `Off-Plan Payment Calculators & Inspection Portal for ${name}`;
        emailBody = `Hi ${name} Team,\n\nWe reviewed your real estate platform (${webUrl}) and noticed buyers cannot calculate payment plans or schedule property tours seamlessly online.\n\nWe built an Off-Plan Payment & Tour Booking upgrade preview and video walkthrough for your listings:\n${previewUrl}\n\nSee how it captures diaspora and local buyers and routes hot leads to your WhatsApp agents.\n\nBest regards,\n${signature}`;
        whatsappBody = `Hi ${name} Team! We saw your website (${webUrl}) and built a Property Tour & Installment Payment Calculator proposal with video walkthrough: ${previewUrl}`;
        socialBody = `Hello! Checked out ${name}. We designed an interactive property payment calculator proposal and video walkthrough for your platform (${webUrl}): ${previewUrl}`;
      } else {
        emailSubject = `Luxury Real Estate Showcase & Inspection Booking Portal for ${name}`;
        emailBody = `Hi ${name} Team,\n\nWe noticed ${name} has a top-rated reputation (${rating} stars) in ${area}, but lacks an interactive property showcase portal.\n\nWe custom-built a modern Real Estate showcase landing page, payment calculator, and video walkthrough for your listings:\n${previewUrl}\n\nClaim this portal to start capturing high-ticket property buyers online.\n\nBest regards,\n${signature}`;
        whatsappBody = `Hi ${name} Team! We built a luxury real estate portal preview and video walkthrough for your property listings: ${previewUrl}`;
        socialBody = `Hi! We built a modern property showcase preview and video walkthrough for ${name} in ${area}: ${previewUrl}`;
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

      if (hasWebsite) {
        emailSubject = `Digital Admissions & Tuition Fee Payment Upgrade for ${name}`;
        emailBody = `Hi ${name} Management,\n\nWe reviewed your school website (${webUrl}) and noticed parents cannot complete admission forms or pay fees online seamlessly.\n\nWe designed a digital admissions portal and tuition fee calculator upgrade preview with a video walkthrough:\n${previewUrl}\n\nTest how parents can pay application fees via Paystack and receive instant PDF entrance exam slips.\n\nBest regards,\n${signature}`;
        whatsappBody = `Hi ${name} Team! We built an online admission portal & tuition fee calculator proposal with video walkthrough for your school: ${previewUrl}`;
        socialBody = `Hello! We designed an interactive admission portal proposal and video walkthrough for ${name} (${webUrl}): ${previewUrl}`;
      } else {
        emailSubject = `Modern School Website & Digital Admissions Portal for ${name}`;
        emailBody = `Hi ${name} Management,\n\nWe noticed ${name} has an outstanding reputation (${rating} stars, ${reviewsCount} reviews) in ${area}, but lacks an interactive web address.\n\nWe custom-built a modern school website, admissions portal, and video walkthrough for your institution:\n${previewUrl}\n\nParents can apply online and download prospectus materials. Claim your site today.\n\nBest regards,\n${signature}`;
        whatsappBody = `Hi ${name} Management! We built a custom school website and admissions portal preview with video walkthrough for your institution: ${previewUrl}`;
        socialBody = `Hi! We built a modern school portal preview and video walkthrough for ${name} in ${area}: ${previewUrl}`;
      }
      break;

    case 'legal':
      widgetType = 'retainer_estimator';
      widgetTitle = 'Client Case Assessment & Retainer Fee Calculator';
      widgetDescription = 'Simulate confidential legal intake, consultation slot booking, and upfront consultation fee payment.';
      benefitsList = [
        'Confidential Client Intake & Practice Area Classifier',
        'Interactive Initial Consultation Fee & Monthly Retainer Estimator',
        'Paystack / Moniepoint Upfront Retainer & Consultation Deposit Checkout',
        'Encrypted Document Upload & Client Portal Link Generator'
      ];
      invoiceDemo = {
        currency: '₦',
        taxRate: 0.075,
        items: [
          { name: 'Initial Senior Advocate Legal Consultation (1 Hour)', price: 100000, qty: 1 },
          { name: 'Corporate Retainer & Regulatory Compliance Review', price: 350000, qty: 1 }
        ]
      };
      whatsappSim = [
        { sender: 'customer', text: 'Hi! I need a legal consultation regarding commercial property lease contracts.', timeOffsetMs: 500 },
        { sender: 'bot', text: `Hello! ⚖️ ${name} Legal Assistant. Your consultation is reserved for Thursday 2 PM. PDF Intake & NDA Form dispatched to your email.`, timeOffsetMs: 1500 },
        { sender: 'agent', text: `🔔 [New Legal Client Consultation] Client: Engr. Femi Bakare. Practice Area: Corporate Lease Law. Consultation Fee Paid: ₦100,000. Calendar slot blocked.`, timeOffsetMs: 3000 }
      ];

      if (hasWebsite) {
        emailSubject = `Client Intake & Upfront Retainer Payment Upgrade for ${name}`;
        emailBody = `Hi ${name} Team,\n\nWe visited your firm's website (${webUrl}) and noticed clients cannot schedule consultations or pay retainer fees online.\n\nWe created a confidential client intake & consultation fee checkout preview with a video walkthrough for your firm:\n${previewUrl}\n\nSee how it filters high-value corporate clients and eliminates unpaid initial consultations.\n\nBest regards,\n${signature}`;
        whatsappBody = `Hi ${name} Team! We built a legal client intake & consultation booking upgrade proposal with video walkthrough for your firm: ${previewUrl}`;
        socialBody = `Hello! We designed a client consultation & retainer portal proposal with video walkthrough for ${name} (${webUrl}): ${previewUrl}`;
      } else {
        emailSubject = `Digital Legal Portal & Consultation System for ${name}`;
        emailBody = `Hi ${name} Team,\n\nWe saw ${name} has a top legal reputation (${rating} stars) in ${area}, but lacks an online booking address.\n\nWe custom-built a modern legal firm portal, consultation fee calculator, and video walkthrough for you:\n${previewUrl}\n\nClaim the platform to launch your digital law office.\n\nBest regards,\n${signature}`;
        whatsappBody = `Hi ${name} Team! We built a custom legal portal and consultation fee calculator preview with video walkthrough for your firm: ${previewUrl}`;
        socialBody = `Hi! We built a modern legal portal preview and video walkthrough for ${name} in ${area}: ${previewUrl}`;
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

      if (hasWebsite) {
        emailSubject = `Upgrading ${name} with Online Patient Intake & Booking`;
        emailBody = `Hi ${name} Team,\n\nWe visited your current website (${webUrl}) and noticed patients cannot schedule appointments or complete intake paperwork online.\n\nWe designed an interactive patient intake upgrade for you to test. You can watch a recorded video walkthrough demonstrating this setup in action directly on the preview page:\n${previewUrl}\n\nThis system automates scheduling, secures data, and triggers instant WhatsApp reminders to eliminate no-shows.\n\n*(Note: For advanced enterprise integrations like automated accounting sync or custom CRM pipelines, we offer custom development scopes — contact us on the page to negotiate details.)*\n\nBest regards,\n${signature}`;
        whatsappBody = `Hi ${name} Team! We visited your website (${webUrl}) and designed an upgraded booking portal mockup with a video walkthrough for you: ${previewUrl}. Try booking a test, or contact us to discuss advanced accounting/CRM integrations!`;
        socialBody = `Hello! Checked out your page for ${name}. Excellent rating of ${rating} stars. We noticed your website (${webUrl}) lacks online appointment scheduling. We created a customized booking portal proposal with a video walkthrough for you here: ${previewUrl}`;
      } else {
        emailSubject = `Patient Booking System & Custom Web Design for ${name}`;
        emailBody = `Hi ${name} Team,\n\nWe noticed ${name} has a top-rated local reputation (${rating} stars, ${reviewsCount} reviews) in ${area}, but does not have a web address connected yet.\n\nTo help you grow, we've custom-built a modern patient booking landing page for you to review. You can watch a recorded video walkthrough demonstrating the page and patient scheduler in action directly on the preview link:\n${previewUrl}\n\nIt features interactive appointment booking and medical intake automation. If you like the design, you can claim it for your custom domain.\n\n*(Note: For advanced enterprise integrations like automated accounting sync or custom CRM pipelines, we offer custom development scopes — contact us on the page to negotiate details.)*\n\nBest regards,\n${signature}`;
        whatsappBody = `Hi ${name} Team! We custom-built a modern patient booking landing page and video walkthrough for your clinic: ${previewUrl}. Test booking a session!`;
        socialBody = `Hi ${name}! We noticed your clinic in ${area} doesn't have an online booking system. We custom-built this modern preview portal and video walkthrough for you: ${previewUrl}. Take a look and let us know what you think!`;
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

      if (hasWebsite) {
        emailSubject = `Smart Trade-In Estimators & WhatsApp Alerts for ${name}`;
        emailBody = `Hi ${name} Team,\n\nWe visited your auto website (${webUrl}) and noticed buyers cannot get trade-in evaluations or schedule test drives online.\n\nWe custom-designed an interactive trade-in & valuation upgrade preview and video walkthrough for you:\n${previewUrl}\n\nTest the estimator to see how we route high-intent buyer leads straight to your sales team's WhatsApp.\n\n*(Note: For advanced enterprise integrations like automated accounting sync or custom CRM pipelines, we offer custom development scopes — contact us on the page to negotiate details.)*\n\nBest regards,\n${signature}`;
        whatsappBody = `Hi ${name} Team! We saw your website (${webUrl}) and designed an interactive trade-in valuation mockup and video walkthrough for you: ${previewUrl}. Try trading in a car to see instant WhatsApp sales routing!`;
        socialBody = `Hello! Checked out your page for ${name}. Great showroom! We noticed your site (${webUrl}) does not have an interactive valuation calculator. Check out our design upgrade proposal and walkthrough video: ${previewUrl}`;
      } else {
        emailSubject = `Digital Showroom & Trade-In Capture System for ${name}`;
        emailBody = `Hi ${name} Team,\n\nWe saw you have a fantastic local presence (${rating} stars, ${reviewsCount} reviews) on Google Maps for ${name}, but no website connected yet.\n\nWe custom-designed a digital showroom landing page and walkthrough video for your dealership:\n${previewUrl}\n\nIt features an interactive trade-in valuation estimator. If you love it, you can claim the design for your custom domain.\n\n*(Note: For advanced enterprise integrations like automated accounting sync or custom CRM pipelines, we offer custom development scopes — contact us on the page to negotiate details.)*\n\nBest regards,\n${signature}`;
        whatsappBody = `Hi ${name} Team! We noticed your dealership has no website listed on Google Maps. We designed a custom showroom and walkthrough video showing how buyers can request car valuations: ${previewUrl}`;
        socialBody = `Hi! We noticed {{lead.name}} in {{lead.area}} doesn't have an online catalog website. We custom-built this modern vehicle showroom portal and walkthrough video showing how buyers can calculate trade-in rates: {{previewUrl}}`;
      }
      break;

    case 'retail':
      widgetType = 'ecommerce';
      widgetTitle = 'Paystack Shopping Cart & Simulated checkout';
      widgetDescription = 'Simulate placing an order, paying with a mock Paystack popup, and receiving an automated transaction receipt.';
      benefitsList = [
        'Secure card, bank transfer, and USSD payments via Paystack / Flutterwave',
        'Automatic PDF receipt generation sent directly to customer email',
        'Instant order fulfillment logs written automatically to Google Sheets',
        'Automated WhatsApp confirmation message dispatched to the buyer'
      ];
      invoiceDemo = {
        currency: '₦',
        taxRate: 0.075,
        items: [
          { name: 'Luxury Unisex Sneakers (White/Gold)', price: 45000, qty: 1 },
          { name: 'Designer Leather Crossbody Bag', price: 65000, qty: 1 }
        ]
      };
      whatsappSim = [
        { sender: 'customer', text: 'Hi! Just ordered the Luxury Sneakers (Order #9283) on your website.', timeOffsetMs: 500 },
        { sender: 'bot', text: 'Payment confirmed! 🎉 Thank you for shopping with us. Your order #9283 is being packaged. Track your delivery here: [Link]', timeOffsetMs: 1600 },
        { sender: 'agent', text: '🔔 [New Paid Order] Order #9283 received! Amount: ₦110,000. Customer: Amara Okafor. Address: Lekki, Lagos. Paystack ID: pstk_8383827. PDF Invoice logged.', timeOffsetMs: 3000 }
      ];

      if (hasWebsite) {
        emailSubject = `Upgrading ${name} with Paystack checkout & WhatsApp Invoice alerts`;
        emailBody = `Hi ${name} Team,\n\nWe visited your store website (${webUrl}) and noticed it lacks an online checkout shopping cart or automated payment processing.\n\nWe designed a modern checkout catalog upgrade and recorded a walkthrough video for you to test:\n${previewUrl}\n\nTry buying a demo product to see how the system processes mock Paystack card payments and outputs automated client invoices.\n\n*(Note: For advanced enterprise integrations like automated accounting sync or custom CRM pipelines, we offer custom development scopes — contact us on the page to negotiate details.)*\n\nBest regards,\n${signature}`;
        whatsappBody = `Hi ${name} Team! We saw your website (${webUrl}) and built a storefront check-out upgrade mockup and video walkthrough for you: ${previewUrl}. Try buying a product to see automated invoice & receipt delivery!`;
        socialBody = `Hello! We saw your retail catalog online for ${name}. We designed this modern checkout proposal and walkthrough video showing how customers can buy online using Paystack/Flutterwave: ${previewUrl}`;
      } else {
        emailSubject = `Paystack Online Store & E-commerce Catalog for ${name}`;
        emailBody = `Hi ${name} Team,\n\nWe saw {{lead.name}} has a wonderful local reputation in {{lead.area}}, but lacks an online checkout catalog.\n\nWe custom-built a modern e-commerce storefront and walkthrough video for your brand:\n${previewUrl}\n\nIt features interactive shopping carts and Paystack card integration. If you like the design, you can claim it and connect it to your custom domain.\n\n*(Note: For advanced enterprise integrations like automated accounting sync or custom CRM pipelines, we offer custom development scopes — contact us on the page to negotiate details.)*\n\nBest regards,\n${signature}`;
        whatsappBody = `Hi ${name} Team! We custom-designed a modern checkout catalog and walkthrough video for your boutique to help you sell outside Instagram DMs: ${previewUrl}`;
        socialBody = `Hi! We built a checkout store preview and walkthrough video for {{lead.name}} in {{lead.area}} to show how you can automate payments and invoicing: {{previewUrl}}`;
      }
      break;

    case 'restaurant':
      widgetType = 'table_reservation';
      widgetTitle = 'Automated Table Reservation & Ordering System';
      widgetDescription = 'Simulate booking a table to see automated seating management, instant kitchen order receipts, and WhatsApp alerts.';
      benefitsList = [
        'Interactive table booking slot allocator based on real-time availability',
        'Automatic reservation tickets dispatched directly to kitchen staff',
        'Customer dining receipt generator sent instantly via email/WhatsApp',
        'SMS table reminder broadcast sent 1 hour before booking'
      ];
      invoiceDemo = {
        currency: '₦',
        taxRate: 0.075,
        items: [
          { name: 'Gourmet Jollof Rice platter (Feeds 2)', price: 18000, qty: 1 },
          { name: 'Mocktail Pitcher (Strawberry Mint)', price: 12000, qty: 1 }
        ]
      };
      whatsappSim = [
        { sender: 'customer', text: 'Hi, I just reserved Table 4 for 4 guests tonight at 7:30 PM.', timeOffsetMs: 500 },
        { sender: 'bot', text: 'Reservation confirmed! 🍽️ Table 4 is set for you. Tap here to view directions and VIP menu: [Directions Link]', timeOffsetMs: 1500 },
        { sender: 'agent', text: '🔔 [Reservation Alert] Table 4 reserved for 4 guests at 7:30 PM. Occasion: Anniversary. Customer: Tunde Bello. Kitchen notification sent.', timeOffsetMs: 3000 }
      ];

      if (hasWebsite) {
        emailSubject = `Reservations & Instant Kitchen Alerts for ${name}`;
        emailBody = `Hi ${name} Team,\n\nWe checked out your restaurant website (${webUrl}) and noticed guests cannot book tables or pre-order meals online.\n\nWe custom-designed a table reservation, instant ordering upgrade preview, and video walkthrough for you:\n${previewUrl}\n\nTry booking a table on the mockup to see our automated kitchen notification workflow in action.\n\n*(Note: For advanced enterprise integrations like automated accounting sync or custom CRM pipelines, we offer custom development scopes — contact us on the page to negotiate details.)*\n\nBest regards,\n${signature}`;
        whatsappBody = `Hi ${name} Team! We visited your website (${webUrl}) and built a reservation table booking upgrade mockup and video walkthrough: ${previewUrl}. Try reserving a table to see kitchen printing & customer alerts!`;
        socialBody = `Hello! We saw your eatery online at ${name}. We designed this interactive reservation proposal and walkthrough video showing how you can automate bookings: ${previewUrl}`;
      } else {
        emailSubject = `Table Reservation & Online Menu Catalog for ${name}`;
        emailBody = `Hi ${name} Team,\n\nWe noticed ${name} is a top-rated dining destination on Google Maps in ${area}, but does not have a web address connected yet.\n\nWe custom-built a modern restaurant booking website, menu catalog, and video walkthrough for you:\n${previewUrl}\n\nGuests can book tables online, which alerts your staff immediately. Claim the design to set it live.\n\n*(Note: For advanced enterprise integrations like automated accounting sync or custom CRM pipelines, we offer custom development scopes — contact us on the page to negotiate details.)*\n\nBest regards,\n${signature}`;
        whatsappBody = `Hi ${name} Team! We designed a reservation catalog page and video walkthrough for your restaurant to allow online table bookings: ${previewUrl}`;
        socialBody = `Hi! We designed a modern website preview and walkthrough video for ${name} in ${area} showing how guests can book tables online: ${previewUrl}`;
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

      if (hasWebsite) {
        emailSubject = `Smart Quote Calculators & Invoice Automation for ${name}`;
        emailBody = `Hi ${name} Team,\n\nWe visited your business website (${webUrl}) and noticed clients cannot estimate pricing or receive automated quotes online.\n\nWe designed an interactive calculator, PDF invoice upgrade mockup, and video walkthrough for you:\n${previewUrl}\n\nTry calculating an estimate to see how the system generates a branded invoice and syncs logs instantly.\n\n*(Note: For advanced enterprise integrations like automated accounting sync or custom CRM pipelines, we offer custom development scopes — contact us on the page to negotiate details.)*\n\nBest regards,\n${signature}`;
        whatsappBody = `Hi ${name} Team! We visited your website (${webUrl}) and built an interactive pricing calculator, invoice mockup, and video walkthrough: ${previewUrl}. Try calculating a quote to see the automation in action!`;
        socialBody = `Hello! Checked out your page for ${name}. We custom-built an interactive pricing estimator, invoice automation preview, and video walkthrough for your business: ${previewUrl}`;
      } else {
        emailSubject = `Interactive Quote Estimator & Professional Web Design for ${name}`;
        emailBody = `Hi ${name} Team,\n\nWe noticed ${name} has a top-rated reputation (${rating} stars) in ${area}, but lacks an official website.\n\nWe custom-built a modern quote-estimating landing page, video walkthrough, and cost calculator for your brand:\n${previewUrl}\n\nIt showcases how prospective clients can calculate quotes online. Claim the design to launch on your custom domain.\n\n*(Note: For advanced enterprise integrations like automated accounting sync or custom CRM pipelines, we offer custom development scopes — contact us on the page to negotiate details.)*\n\nBest regards,\n${signature}`;
        whatsappBody = `Hi ${name} Team! We noticed your business has no website listed on Google Maps. We custom-built a quote estimator page and video walkthrough for your brand: ${previewUrl}`;
        socialBody = `Hi! We built a modern website preview, cost calculator, and video walkthrough for ${name} in ${area}: ${previewUrl}`;
      }
      break;
  }

  // Cross-channel references — always keep the preview link in the message
  const emailText = lead.email ? lead.email.trim() : '';
  if (emailText) {
    if (whatsappBody && !whatsappBody.includes(emailText)) {
      whatsappBody += ` We have also sent detailed information to your email: ${emailText}.`;
    }
    if (socialBody && !socialBody.includes(emailText)) {
      socialBody += ` (Detailed proposal also sent to your email: ${emailText}).`;
    }
  }

  // Safety guard: ensure preview link is ALWAYS present in every outreach channel
  if (whatsappBody && !whatsappBody.includes(previewUrl)) {
    whatsappBody += ` View your free custom website here: ${previewUrl}`;
  }
  if (socialBody && !socialBody.includes(previewUrl)) {
    socialBody += ` View it here: ${previewUrl}`;
  }
  if (emailBody && !emailBody.includes(previewUrl)) {
    emailBody += `\n\nView your customised website preview here: ${previewUrl}`;
  }

  return {
    categoryKey,
    emailSubject,
    emailBody,
    whatsappBody,
    socialBody,
    widgetType,
    widgetTitle,
    widgetDescription,
    benefitsList,
    whatsappSim,
    invoiceDemo
  };
}

/**
 * Replaces placeholders in outreach text.
 */
export function formatPitchTemplate(template: string, lead: Lead, previewUrl: string, signature: string): string {
  return template
    .replace(/{{\s*lead\.name\s*}}/g, lead.name || '')
    .replace(/{{\s*lead\.rating\s*}}/g, String(lead.rating || '4.5'))
    .replace(/{{\s*lead\.reviews_count\s*}}/g, String(lead.reviews_count || '12'))
    .replace(/{{\s*lead\.area\s*}}/g, lead.area || '')
    .replace(/{{\s*lead\.website\s*}}/g, lead.website || '')
    .replace(/{{\s*previewUrl\s*}}/g, previewUrl)
    .replace(/{{\s*signature\s*}}/g, signature)
    .replace(/{{\s*businessSignature\s*}}/g, signature);
}
