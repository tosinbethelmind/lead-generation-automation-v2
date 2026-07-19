const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read production env from sibling folder
const envPath = path.join(__dirname, '../../Solar ROI Proposal Builder/.env.local');
let supabaseUrl = '';
let supabaseKey = '';

if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  const lines = content.split('\n');
  for (const line of lines) {
    const match = line.trim().match(/^([^#=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let val = match[2].trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.substring(1, val.length - 1);
      }
      if (key === 'SUPABASE_URL' || key === 'NEXT_PUBLIC_SUPABASE_URL') {
        supabaseUrl = val;
      }
      if (key === 'SUPABASE_SERVICE_ROLE_KEY') {
        supabaseKey = val;
      }
    }
  }
}

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase configuration.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const INSTALLERS = [
  {
    id: 'inst-1',
    user_id: null,
    business_name: 'Lekki Clean Energy Ltd',
    logo_url: '',
    description: 'Premier residential and commercial solar installations specializing in hybrid inverter setups, Lithium-ion high-capacity storage, and structural wind permitting in coastal Lagos.',
    specialty_tags: ['Lithium Storage', 'Residential Hybrid', 'LSEB Certified'],
    brands_handled: ['Sunsynk', 'Victron Energy', 'Must Inverters', 'Felicity Solar'],
    is_verified: true,
    rating_count: 24,
    rating_average: 4.8,
    response_speed: 'Usually under 2 hours',
    contact_preference: 'WhatsApp',
    cac_number: 'RC-1485901',
    is_claimed: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'inst-2',
    user_id: null,
    business_name: 'Gbagada Solar Systems Ltd',
    logo_url: '',
    description: 'Expert solar services focused on reducing monthly generator diesel expenditures. Offering customized grid-tie and net-metering arrays for residential estates in Gbagada, Ikeja, and Surulere.',
    specialty_tags: ['Diesel Offsets', 'Net Metering', 'Residential Hybrid'],
    brands_handled: ['Growatt', 'Must Inverters', 'Deye', 'Jinko Solar'],
    is_verified: true,
    rating_count: 15,
    rating_average: 4.6,
    response_speed: 'Usually under 4 hours',
    contact_preference: 'Phone Call',
    cac_number: 'RC-1294850',
    is_claimed: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'inst-3',
    user_id: null,
    business_name: 'Eko Solar Tech Solutions',
    logo_url: '',
    description: 'Nigeria-focused solar integration agency specializing in premium corporate grid-tied systems and advanced roof weight deflection permitting in Lagos Island & Victoria Island.',
    specialty_tags: ['Commercial Grid-Tie', 'Premium Inverters', 'Wind Deflection'],
    brands_handled: ['Victron Energy', 'SMA Inverters', 'Fronius', 'Canadian Solar'],
    is_verified: true,
    rating_count: 32,
    rating_average: 4.9,
    response_speed: 'Usually under 1 hour',
    contact_preference: 'WhatsApp',
    cac_number: 'RC-1104859',
    is_claimed: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'inst-4',
    user_id: null,
    business_name: 'Ajao Estate Energy Partners',
    logo_url: '',
    description: 'Affordable, premium-grade household battery backups and solar panel retrofits. Committed to making stable clean power accessible in Lagos mainland.',
    specialty_tags: ['Battery Upgrades', 'Affordable Home Solar', 'Gel Batteries'],
    brands_handled: ['Felicity Solar', 'Luminous', 'Must Inverters'],
    is_verified: false,
    rating_count: 5,
    rating_average: 4.2,
    response_speed: 'Usually within 24 hours',
    contact_preference: 'Email',
    is_claimed: false,
    created_at: new Date().toISOString()
  },
  {
    id: 'inst-5',
    user_id: null,
    business_name: 'Arnergy Solar',
    logo_url: '',
    description: 'Tech-driven Solar-as-a-Service provider using IoT-enabled smart energy monitoring systems. Specializes in solar+storage bundles for homes, businesses, hospitals, and schools across Nigeria — with real-time remote monitoring via the Arnergy app.',
    specialty_tags: ['Solar-as-a-Service', 'IoT Monitoring', 'Commercial Storage', 'Pay-As-You-Go'],
    brands_handled: ['Arnergy Smart Packs', 'LG Energy', 'Victron Energy', 'Pylontech'],
    is_verified: true,
    rating_count: 61,
    rating_average: 4.8,
    response_speed: 'Usually under 2 hours',
    contact_preference: 'WhatsApp',
    cac_number: 'RC-1394058',
    is_claimed: false,
    created_at: new Date().toISOString()
  },
  {
    id: 'inst-6',
    user_id: null,
    business_name: 'SolarKobo',
    logo_url: '',
    description: 'Lagos-based renewable energy company offering full solar installations, inverter-only setups, solar water pumps, solar security systems, and maintenance contracts. Known for transparent pricing and detailed energy audits before any installation.',
    specialty_tags: ['Solar Water Pumps', 'Inverter Systems', 'Energy Audits', 'Residential Hybrid'],
    brands_handled: ['Luminous', 'Felicity Solar', 'Canadian Solar', 'Deye'],
    is_verified: true,
    rating_count: 44,
    rating_average: 4.7,
    response_speed: 'Usually under 3 hours',
    contact_preference: 'WhatsApp',
    cac_number: 'RC-1659302',
    is_claimed: false,
    created_at: new Date().toISOString()
  },
  {
    id: 'inst-7',
    user_id: null,
    business_name: 'Auxano Solar Nigeria',
    logo_url: '',
    description: 'Pioneer of local solar panel manufacturing and assembly in Nigeria. Offers solar panel supply, inverter systems, street lighting, solar water pumps, and a certified solar training academy. Ideal for installers seeking locally-sourced components.',
    specialty_tags: ['Local Manufacturing', 'Solar Training', 'Street Lighting', 'Wholesale Supply'],
    brands_handled: ['Auxano Panels', 'Growatt', 'Jinko Solar', 'Trina Solar'],
    is_verified: true,
    rating_count: 38,
    rating_average: 4.6,
    response_speed: 'Usually under 4 hours',
    contact_preference: 'Phone Call',
    cac_number: 'RC-1234908',
    is_claimed: false,
    created_at: new Date().toISOString()
  },
  {
    id: 'inst-8',
    user_id: null,
    business_name: 'Gennex Technologies',
    logo_url: '',
    description: 'Well-established firm with deep expertise in both on-grid and off-grid solar solutions. Handles large-scale commercial and industrial projects across Lagos, Abuja, and Port Harcourt — including solar-powered borehole pumping systems and grid-interconnected arrays.',
    specialty_tags: ['On-Grid Systems', 'Off-Grid Industrial', 'Solar Borehole', 'Commercial Grid-Tie'],
    brands_handled: ['SMA Inverters', 'Fronius', 'Canadian Solar', 'BYD Batteries'],
    is_verified: true,
    rating_count: 53,
    rating_average: 4.9,
    response_speed: 'Usually under 2 hours',
    contact_preference: 'WhatsApp',
    cac_number: 'RC-1583021',
    is_claimed: false,
    created_at: new Date().toISOString()
  },
  {
    id: 'inst-9',
    user_id: null,
    business_name: 'Rubitec Solar',
    logo_url: '',
    description: 'Major player in Nigerian solar manufacturing and mini-grid development. Specializes in industrial-scale solar farms, mini-grid deployment for rural communities, and EPC (Engineering, Procurement, Construction) contracts for public institutions.',
    specialty_tags: ['Mini-Grid Development', 'Solar Farms', 'EPC Contracts', 'Rural Electrification'],
    brands_handled: ['JA Solar', 'Huawei Inverters', 'CATL Batteries', 'Trina Solar'],
    is_verified: true,
    rating_count: 29,
    rating_average: 4.7,
    response_speed: 'Usually under 4 hours',
    contact_preference: 'Email',
    cac_number: 'RC-1039485',
    is_claimed: false,
    created_at: new Date().toISOString()
  },
  {
    id: 'inst-10',
    user_id: null,
    business_name: 'Solar Depot Nigeria',
    logo_url: '',
    description: 'Leading solar component supplier and installer with a strong Lagos showroom presence. Provides wide-ranging solar products, system design, and turnkey installation for homes and SMEs. A go-to destination for installers sourcing quality panels, inverters, and batteries.',
    specialty_tags: ['Component Supply', 'Turnkey Installation', 'SME Solar', 'System Design'],
    brands_handled: ['Victron Energy', 'Growatt', 'Felicity Solar', 'Sunsynk', 'Jinko Solar'],
    is_verified: true,
    rating_count: 72,
    rating_average: 4.8,
    response_speed: 'Usually under 2 hours',
    contact_preference: 'WhatsApp',
    cac_number: 'RC-1748293',
    is_claimed: false,
    created_at: new Date().toISOString()
  },
  {
    id: 'inst-11',
    user_id: null,
    business_name: 'Solarlify Nigeria',
    logo_url: '',
    description: 'Customer-centric solar installer offering free maintenance packages and educational resources for system owners. Known for honest energy assessments, post-installation support, and helping Nigerian homeowners understand their solar systems better.',
    specialty_tags: ['Free Maintenance', 'Customer Education', 'Residential Hybrid', 'Affordable Home Solar'],
    brands_handled: ['Deye', 'Must Inverters', 'Luminous', 'Canadian Solar'],
    is_verified: true,
    rating_count: 33,
    rating_average: 4.6,
    response_speed: 'Usually under 3 hours',
    contact_preference: 'WhatsApp',
    cac_number: 'RC-1938502',
    is_claimed: false,
    created_at: new Date().toISOString()
  },
  {
    id: 'inst-12',
    user_id: null,
    business_name: 'Lumos Nigeria',
    logo_url: '',
    description: 'Widely recognized pioneer of Pay-As-You-Go household solar subscription services in Nigeria. Specializes in entry-level solar home systems with mobile payment integration, serving both urban and peri-urban households who cannot afford large upfront costs.',
    specialty_tags: ['Pay-As-You-Go', 'Solar Home Systems', 'Mobile Payments', 'Affordable Home Solar'],
    brands_handled: ['Lumos Classic', 'Lumos Mobile Solar', 'Lumos Max'],
    is_verified: true,
    rating_count: 88,
    rating_average: 4.5,
    response_speed: 'Usually under 24 hours',
    contact_preference: 'Phone Call',
    cac_number: 'RC-1847529',
    is_claimed: false,
    created_at: new Date().toISOString()
  },
  {
    id: 'inst-13',
    user_id: null,
    business_name: 'GVE Projects Ltd',
    logo_url: '',
    description: 'Specialist in off-grid solar power, rural electrification, and smart energy systems. GVE has deployed solar mini-grids serving thousands of rural Nigerian households. Also provides solar EPC services for commercial buildings and healthcare facilities.',
    specialty_tags: ['Off-Grid Solar', 'Rural Electrification', 'Mini-Grids', 'Healthcare Solar'],
    brands_handled: ['SMA Inverters', 'Victron Energy', 'JA Solar', 'BYD Batteries'],
    is_verified: true,
    rating_count: 41,
    rating_average: 4.8,
    response_speed: 'Usually under 4 hours',
    contact_preference: 'Email',
    cac_number: 'RC-1038472',
    is_claimed: false,
    created_at: new Date().toISOString()
  },
  {
    id: 'inst-14',
    user_id: null,
    business_name: 'Astrum Energy Nigeria',
    logo_url: '',
    description: 'Premium solar solutions provider serving high-net-worth residential estates and commercial towers in Lagos and Abuja. Specializes in aesthetically designed rooftop installations, premium LFP battery storage systems, and 24/7 remote monitoring dashboards.',
    specialty_tags: ['Premium Residential', 'LFP Batteries', 'Remote Monitoring', 'Commercial Grid-Tie'],
    brands_handled: ['Tesla Powerwall', 'Fronius', 'Canadian Solar', 'Pylontech', 'SMA Inverters'],
    is_verified: true,
    rating_count: 27,
    rating_average: 4.9,
    response_speed: 'Usually under 1 hour',
    contact_preference: 'WhatsApp',
    cac_number: 'RC-1582038',
    is_claimed: false,
    created_at: new Date().toISOString()
  },
  {
    id: 'inst-15',
    user_id: null,
    business_name: 'JP2 Solar Power',
    logo_url: '',
    description: 'Prominent Lekki-based solar provider renowned for premium panel selection, hybrid inverter integration, and exceptional after-sales support. Serves high-density residential estates across Lekki Phase 1, Chevron, and Ajah corridors.',
    specialty_tags: ['Residential Hybrid', 'Premium Inverters', 'After-Sales Support', 'LSEB Certified'],
    brands_handled: ['Sunsynk', 'Victron Energy', 'Canadian Solar', 'Trina Solar'],
    is_verified: true,
    rating_count: 49,
    rating_average: 4.8,
    response_speed: 'Usually under 2 hours',
    contact_preference: 'WhatsApp',
    is_claimed: false,
    created_at: new Date().toISOString()
  },
  {
    id: 'inst-16',
    user_id: null,
    business_name: 'PVPRO Solar Energy',
    logo_url: '',
    description: 'Ikeja-focused solar specialist known for reliable hybrid inverter systems and lithium battery installations for homes and small businesses. Offers detailed load analysis, NERC-compliant designs, and prompt field support across Lagos mainland.',
    specialty_tags: ['Lithium Storage', 'Ikeja Specialist', 'Load Analysis', 'Residential Hybrid'],
    brands_handled: ['Growatt', 'Deye', 'Jinko Solar', 'Pylontech'],
    is_verified: true,
    rating_count: 36,
    rating_average: 4.7,
    response_speed: 'Usually under 3 hours',
    contact_preference: 'WhatsApp',
    is_claimed: false,
    created_at: new Date().toISOString()
  },
  {
    id: 'inst-17',
    user_id: null,
    business_name: 'Felicity Solar Nigeria',
    logo_url: '',
    description: 'Leading importer and installer of Felicity-branded solar inverters, batteries, and panels with established Ikeja showrooms. Popular among Lagos installers for affordable, quality wholesale procurement and consumer direct installations.',
    specialty_tags: ['Wholesale Supply', 'Component Supply', 'Inverter Systems', 'Affordable Home Solar'],
    brands_handled: ['Felicity Solar', 'Felicity Lithium', 'Luminous', 'Jinko Solar'],
    is_verified: true,
    rating_count: 58,
    rating_average: 4.6,
    response_speed: 'Usually under 4 hours',
    contact_preference: 'Phone Call',
    is_claimed: false,
    created_at: new Date().toISOString()
  },
  {
    id: 'inst-18',
    user_id: null,
    business_name: 'Daystar Power',
    logo_url: '',
    description: "Nigeria's foremost commercial and industrial solar-as-a-service provider. Delivers hybrid solar + gas + battery Power-as-a-Service (PaaS) to factories, manufacturers, and large enterprises — eliminating diesel dependency without capital expenditure.",
    specialty_tags: ['Industrial Solar', 'Power-as-a-Service', 'Commercial Grid-Tie', 'Diesel Offsets'],
    brands_handled: ['SMA Inverters', 'BYD Batteries', 'JA Solar', 'Huawei Inverters'],
    is_verified: true,
    rating_count: 43,
    rating_average: 4.9,
    response_speed: 'Usually under 2 hours',
    contact_preference: 'Email',
    is_claimed: false,
    created_at: new Date().toISOString()
  },
  {
    id: 'inst-19',
    user_id: null,
    business_name: 'Solynta Energy',
    logo_url: '',
    description: 'Residential-focused solar subscription company helping Lagos homeowners eliminate generator noise with 1kW–5kW solar-as-a-service packages. Monthly subscription model removes upfront cost barriers for middle-income households.',
    specialty_tags: ['Solar-as-a-Service', 'Subscription Model', 'Generator Replacement', 'Affordable Home Solar'],
    brands_handled: ['Solynta Smart Packs', 'Must Inverters', 'Canadian Solar', 'Felicity Solar'],
    is_verified: true,
    rating_count: 31,
    rating_average: 4.5,
    response_speed: 'Usually under 3 hours',
    contact_preference: 'WhatsApp',
    is_claimed: false,
    created_at: new Date().toISOString()
  },
  {
    id: 'inst-20',
    user_id: null,
    business_name: 'Simba Solar Nigeria',
    logo_url: '',
    description: "Simba Group's solar division providing clean power solutions. Simba trained and certified hundreds of installers across Nigeria.",
    specialty_tags: ['Installer Training', 'Residential Hybrid', 'SME Solar', 'Nationwide Coverage'],
    brands_handled: ['Simba Panels', 'Growatt', 'Deye', 'Luminous'],
    is_verified: true,
    rating_count: 67,
    rating_average: 4.6,
    response_speed: 'Usually under 4 hours',
    contact_preference: 'Phone Call',
    is_claimed: false,
    created_at: new Date().toISOString()
  },
  {
    id: 'inst-21',
    user_id: null,
    business_name: 'Solar Haven Nigeria',
    logo_url: '',
    description: 'Diplomatic and luxury estate solar designer serving Ikoyi, Victoria Island, and Lekki. Custom aesthetic solar roofs.',
    specialty_tags: ['Luxury Residential', 'Silent Hybrid Systems', 'Bespoke Design', 'Premium Inverters'],
    brands_handled: ['Victron Energy', 'SMA Inverters', 'Canadian Solar', 'Pylontech'],
    is_verified: true,
    rating_count: 22,
    rating_average: 4.9,
    response_speed: 'Usually under 1 hour',
    contact_preference: 'WhatsApp',
    is_claimed: false,
    created_at: new Date().toISOString()
  },
  {
    id: 'inst-22',
    user_id: null,
    business_name: 'Solarity Plus Limited',
    logo_url: '',
    description: 'LSEB certified hybrid developer and contractor for nationwide corporate accounts and complex hybrid microgrids.',
    specialty_tags: ['Residential Hybrid', 'LSEB Certified', 'Generator Offsets', 'Nationwide Coverage'],
    brands_handled: ['Sunsynk', 'Deye', 'Trina Solar', 'Pylontech'],
    is_verified: true,
    rating_count: 54,
    rating_average: 4.8,
    response_speed: 'Usually under 2 hours',
    contact_preference: 'WhatsApp',
    is_claimed: false,
    created_at: new Date().toISOString()
  },
  {
    id: 'inst-23',
    user_id: null,
    business_name: 'Greenfield Energy Solutions',
    logo_url: '',
    description: 'Full-service renewable energy contractor, supplying and servicing high-capacity on-grid and hybrid installations.',
    specialty_tags: ['Turnkey Installation', 'Maintenance Contracts', 'Commercial Grid-Tie', 'System Design'],
    brands_handled: ['Fronius', 'JA Solar', 'Growatt', 'BYD Batteries'],
    is_verified: true,
    rating_count: 28,
    rating_average: 4.6,
    response_speed: 'Usually under 4 hours',
    contact_preference: 'Email',
    is_claimed: false,
    created_at: new Date().toISOString()
  },
  {
    id: 'inst-24',
    user_id: null,
    business_name: 'Solar Valley Ltd',
    logo_url: '',
    description: 'Specialists in affordable domestic battery backups and inverter retrofits for estates and local schools.',
    specialty_tags: ['Inverter Systems', 'School Solar', 'SME Solar', 'Fast Deployment'],
    brands_handled: ['Must Inverters', 'Luminous', 'Jinko Solar', 'Felicity Solar'],
    is_verified: false,
    rating_count: 19,
    rating_average: 4.4,
    response_speed: 'Usually under 24 hours',
    contact_preference: 'WhatsApp',
    is_claimed: false,
    created_at: new Date().toISOString()
  }
];

const SERVICE_AREAS = [
  // Lekki Clean Energy
  { id: 'sa-1', installer_id: 'inst-1', state: 'Lagos', city: 'Lekki' },
  { id: 'sa-2', installer_id: 'inst-1', state: 'Lagos', city: 'Victoria Island' },
  { id: 'sa-3', installer_id: 'inst-1', state: 'Lagos', city: 'Ikoyi' },
  // Gbagada Solar
  { id: 'sa-4', installer_id: 'inst-2', state: 'Lagos', city: 'Gbagada' },
  { id: 'sa-5', installer_id: 'inst-2', state: 'Lagos', city: 'Ikeja' },
  { id: 'sa-6', installer_id: 'inst-2', state: 'Lagos', city: 'Surulere' },
  // Eko Solar
  { id: 'sa-7', installer_id: 'inst-3', state: 'Lagos', city: 'Lekki' },
  { id: 'sa-8', installer_id: 'inst-3', state: 'Lagos', city: 'Victoria Island' },
  // Ajao Energy
  { id: 'sa-9', installer_id: 'inst-4', state: 'Lagos', city: 'Gbagada' },
  // Arnergy
  { id: 'sa-10', installer_id: 'inst-5', state: 'Lagos', city: 'Victoria Island' },
  { id: 'sa-11', installer_id: 'inst-5', state: 'Lagos', city: 'Ikeja' },
  { id: 'sa-12', installer_id: 'inst-5', state: 'Abuja', city: 'Wuse' },
  { id: 'sa-13', installer_id: 'inst-5', state: 'Rivers', city: 'Port Harcourt' },
  // SolarKobo
  { id: 'sa-14', installer_id: 'inst-6', state: 'Lagos', city: 'Lekki' },
  { id: 'sa-15', installer_id: 'inst-6', state: 'Lagos', city: 'Ajah' },
  { id: 'sa-16', installer_id: 'inst-6', state: 'Lagos', city: 'Ibeju-Lekki' },
  // Auxano
  { id: 'sa-17', installer_id: 'inst-7', state: 'Lagos', city: 'Lekki' },
  { id: 'sa-18', installer_id: 'inst-7', state: 'Lagos', city: 'Ibeju-Lekki' },
  { id: 'sa-19', installer_id: 'inst-7', state: 'Lagos', city: 'Ajah' },
  // Gennex
  { id: 'sa-20', installer_id: 'inst-8', state: 'Lagos', city: 'Ikeja' },
  { id: 'sa-21', installer_id: 'inst-8', state: 'Lagos', city: 'Victoria Island' },
  { id: 'sa-22', installer_id: 'inst-8', state: 'Abuja', city: 'Maitama' },
  { id: 'sa-23', installer_id: 'inst-8', state: 'Rivers', city: 'Port Harcourt' },
  // Rubitec
  { id: 'sa-24', installer_id: 'inst-9', state: 'Lagos', city: 'Ikeja' },
  { id: 'sa-25', installer_id: 'inst-9', state: 'Abuja', city: 'Garki' },
  { id: 'sa-26', installer_id: 'inst-9', state: 'Kano', city: 'Kano' },
  // Solar Depot
  { id: 'sa-27', installer_id: 'inst-10', state: 'Lagos', city: 'Ikeja' },
  { id: 'sa-28', installer_id: 'inst-10', state: 'Lagos', city: 'Surulere' },
  { id: 'sa-29', installer_id: 'inst-10', state: 'Lagos', city: 'Lagos Island' },
  { id: 'sa-30', installer_id: 'inst-10', state: 'Lagos', city: 'Gbagada' },
  // Solarlify
  { id: 'sa-31', installer_id: 'inst-11', state: 'Lagos', city: 'Lekki' },
  { id: 'sa-32', installer_id: 'inst-11', state: 'Lagos', city: 'Ajah' },
  { id: 'sa-33', installer_id: 'inst-11', state: 'Lagos', city: 'Ikoyi' },
  // Lumos
  { id: 'sa-34', installer_id: 'inst-12', state: 'Lagos', city: 'Ikeja' },
  { id: 'sa-35', installer_id: 'inst-12', state: 'Lagos', city: 'Gbagada' },
  { id: 'sa-36', installer_id: 'inst-12', state: 'Abuja', city: 'Garki' },
  { id: 'sa-37', installer_id: 'inst-12', state: 'Kano', city: 'Kano' },
  { id: 'sa-38', installer_id: 'inst-12', state: 'Oyo', city: 'Ibadan' },
  // GVE Projects
  { id: 'sa-39', installer_id: 'inst-13', state: 'Abuja', city: 'Garki' },
  { id: 'sa-40', installer_id: 'inst-13', state: 'Abuja', city: 'Wuse' },
  { id: 'sa-41', installer_id: 'inst-13', state: 'Lagos', city: 'Lekki' },
  { id: 'sa-42', installer_id: 'inst-13', state: 'Delta', city: 'Warri' },
  // Astrum Energy
  { id: 'sa-43', installer_id: 'inst-14', state: 'Lagos', city: 'Lekki' },
  { id: 'sa-44', installer_id: 'inst-14', state: 'Lagos', city: 'Victoria Island' },
  { id: 'sa-45', installer_id: 'inst-14', state: 'Lagos', city: 'Ikoyi' },
  { id: 'sa-46', installer_id: 'inst-14', state: 'Abuja', city: 'Maitama' },
  // JP2 Solar
  { id: 'sa-47', installer_id: 'inst-15', state: 'Lagos', city: 'Lekki' },
  { id: 'sa-48', installer_id: 'inst-15', state: 'Lagos', city: 'Ajah' },
  { id: 'sa-49', installer_id: 'inst-15', state: 'Lagos', city: 'Ibeju-Lekki' },
  // PVPRO
  { id: 'sa-50', installer_id: 'inst-16', state: 'Lagos', city: 'Ikeja' },
  { id: 'sa-51', installer_id: 'inst-16', state: 'Lagos', city: 'Agege' },
  { id: 'sa-52', installer_id: 'inst-16', state: 'Lagos', city: 'Surulere' },
  // Felicity
  { id: 'sa-53', installer_id: 'inst-17', state: 'Lagos', city: 'Ikeja' },
  { id: 'sa-54', installer_id: 'inst-17', state: 'Lagos', city: 'Lagos Island' },
  { id: 'sa-55', installer_id: 'inst-17', state: 'Lagos', city: 'Gbagada' },
  // Daystar
  { id: 'sa-56', installer_id: 'inst-18', state: 'Lagos', city: 'Apapa' },
  { id: 'sa-57', installer_id: 'inst-18', state: 'Lagos', city: 'Ikeja' },
  { id: 'sa-58', installer_id: 'inst-18', state: 'Lagos', city: 'Lagos Island' },
  { id: 'sa-59', installer_id: 'inst-18', state: 'Abuja', city: 'Garki' },
  // Solynta
  { id: 'sa-60', installer_id: 'inst-19', state: 'Lagos', city: 'Lekki' },
  { id: 'sa-61', installer_id: 'inst-19', state: 'Lagos', city: 'Surulere' },
  { id: 'sa-62', installer_id: 'inst-19', state: 'Lagos', city: 'Yaba' },
  // Simba Solar
  { id: 'sa-63', installer_id: 'inst-20', state: 'Lagos', city: 'Ikeja' },
  { id: 'sa-64', installer_id: 'inst-20', state: 'Lagos', city: 'Gbagada' },
  { id: 'sa-65', installer_id: 'inst-20', state: 'Kano', city: 'Kano' },
  { id: 'sa-66', installer_id: 'inst-20', state: 'Abuja', city: 'Garki' },
  { id: 'sa-67', installer_id: 'inst-20', state: 'Oyo', city: 'Ibadan' },
  // Solar Haven
  { id: 'sa-68', installer_id: 'inst-21', state: 'Lagos', city: 'Ikoyi' },
  { id: 'sa-69', installer_id: 'inst-21', state: 'Lagos', city: 'Victoria Island' },
  { id: 'sa-70', installer_id: 'inst-21', state: 'Lagos', city: 'Lekki' },
  // Solarity Plus
  { id: 'sa-71', installer_id: 'inst-22', state: 'Lagos', city: 'Lekki' },
  { id: 'sa-72', installer_id: 'inst-22', state: 'Lagos', city: 'Ikeja' },
  { id: 'sa-73', installer_id: 'inst-22', state: 'Abuja', city: 'Maitama' },
  { id: 'sa-74', installer_id: 'inst-22', state: 'Rivers', city: 'Port Harcourt' },
  // Greenfield
  { id: 'sa-75', installer_id: 'inst-23', state: 'Lagos', city: 'Lekki' },
  { id: 'sa-76', installer_id: 'inst-23', state: 'Lagos', city: 'Surulere' },
  { id: 'sa-77', installer_id: 'inst-23', state: 'Lagos', city: 'Yaba' },
  // Solar Valley
  { id: 'sa-78', installer_id: 'inst-24', state: 'Lagos', city: 'Gbagada' },
  { id: 'sa-79', installer_id: 'inst-24', state: 'Lagos', city: 'Ojodu' },
  { id: 'sa-80', installer_id: 'inst-24', state: 'Lagos', city: 'Agege' }
];

const SUBSCRIPTIONS = [
  { id: 'sub-1', installer_id: 'inst-1', tier: 'verified_partner_plus', status: 'active', expires_at: '2027-01-01T00:00:00Z', created_at: new Date().toISOString() },
  { id: 'sub-2', installer_id: 'inst-2', tier: 'verified_partner', status: 'active', expires_at: '2027-01-01T00:00:00Z', created_at: new Date().toISOString() },
  { id: 'sub-3', installer_id: 'inst-3', tier: 'verified_partner_plus', status: 'active', expires_at: '2027-01-01T00:00:00Z', created_at: new Date().toISOString() },
  { id: 'sub-4', installer_id: 'inst-4', tier: 'basic', status: 'active', expires_at: '2027-01-01T00:00:00Z', created_at: new Date().toISOString() },
  { id: 'sub-5', installer_id: 'inst-5', tier: 'verified_partner_plus', status: 'active', expires_at: '2027-01-01T00:00:00Z', created_at: new Date().toISOString() },
  { id: 'sub-6', installer_id: 'inst-6', tier: 'verified_partner', status: 'active', expires_at: '2027-01-01T00:00:00Z', created_at: new Date().toISOString() },
  { id: 'sub-7', installer_id: 'inst-7', tier: 'basic', status: 'active', expires_at: '2027-01-01T00:00:00Z', created_at: new Date().toISOString() },
  { id: 'sub-8', installer_id: 'inst-8', tier: 'verified_partner_plus', status: 'active', expires_at: '2027-01-01T00:00:00Z', created_at: new Date().toISOString() },
  { id: 'sub-9', installer_id: 'inst-9', tier: 'verified_partner', status: 'active', expires_at: '2027-01-01T00:00:00Z', created_at: new Date().toISOString() },
  { id: 'sub-10', installer_id: 'inst-10', tier: 'basic', status: 'active', expires_at: '2027-01-01T00:00:00Z', created_at: new Date().toISOString() },
  { id: 'sub-11', installer_id: 'inst-11', tier: 'basic', status: 'active', expires_at: '2027-01-01T00:00:00Z', created_at: new Date().toISOString() },
  { id: 'sub-12', installer_id: 'inst-12', tier: 'verified_partner', status: 'active', expires_at: '2027-01-01T00:00:00Z', created_at: new Date().toISOString() },
  { id: 'sub-13', installer_id: 'inst-13', tier: 'basic', status: 'active', expires_at: '2027-01-01T00:00:00Z', created_at: new Date().toISOString() },
  { id: 'sub-14', installer_id: 'inst-14', tier: 'verified_partner_plus', status: 'active', expires_at: '2027-01-01T00:00:00Z', created_at: new Date().toISOString() },
  { id: 'sub-15', installer_id: 'inst-15', tier: 'basic', status: 'active', expires_at: '2027-01-01T00:00:00Z', created_at: new Date().toISOString() },
  { id: 'sub-16', installer_id: 'inst-16', tier: 'basic', status: 'active', expires_at: '2027-01-01T00:00:00Z', created_at: new Date().toISOString() },
  { id: 'sub-17', installer_id: 'inst-17', tier: 'basic', status: 'active', expires_at: '2027-01-01T00:00:00Z', created_at: new Date().toISOString() },
  { id: 'sub-18', installer_id: 'inst-18', tier: 'verified_partner_plus', status: 'active', expires_at: '2027-01-01T00:00:00Z', created_at: new Date().toISOString() },
  { id: 'sub-19', installer_id: 'inst-19', tier: 'basic', status: 'active', expires_at: '2027-01-01T00:00:00Z', created_at: new Date().toISOString() },
  { id: 'sub-20', installer_id: 'inst-20', tier: 'basic', status: 'active', expires_at: '2027-01-01T00:00:00Z', created_at: new Date().toISOString() },
  { id: 'sub-21', installer_id: 'inst-21', tier: 'verified_partner_plus', status: 'active', expires_at: '2027-01-01T00:00:00Z', created_at: new Date().toISOString() },
  { id: 'sub-22', installer_id: 'inst-22', tier: 'verified_partner', status: 'active', expires_at: '2027-01-01T00:00:00Z', created_at: new Date().toISOString() },
  { id: 'sub-23', installer_id: 'inst-23', tier: 'basic', status: 'active', expires_at: '2027-01-01T00:00:00Z', created_at: new Date().toISOString() },
  { id: 'sub-24', installer_id: 'inst-24', tier: 'basic', status: 'active', expires_at: '2027-01-01T00:00:00Z', created_at: new Date().toISOString() }
];

async function seed() {
  console.log('🌱 Starting DB Seeding...');
  try {
    // Clear existing values to prevent duplicates
    console.log('🧹 Clearing old mock service areas, subscriptions, and installers...');
    await supabase.from('installer_service_areas').delete().neq('id', 'NONE');
    await supabase.from('installer_subscriptions').delete().neq('id', 'NONE');
    await supabase.from('marketplace_installers').delete().neq('id', 'NONE');

    // 1. Insert Installers
    console.log(`📥 Inserting ${INSTALLERS.length} installers...`);
    const instRes = await supabase.from('marketplace_installers').insert(INSTALLERS);
    if (instRes.error) throw instRes.error;

    // 2. Insert Service Areas
    console.log(`📥 Inserting ${SERVICE_AREAS.length} service areas...`);
    const saRes = await supabase.from('installer_service_areas').insert(SERVICE_AREAS);
    if (saRes.error) throw saRes.error;

    // 3. Insert Subscriptions
    console.log(`📥 Inserting ${SUBSCRIPTIONS.length} subscriptions...`);
    const subRes = await supabase.from('installer_subscriptions').insert(SUBSCRIPTIONS);
    if (subRes.error) throw subRes.error;

    console.log('✅ DB Seeding completed successfully!');
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
  }
}

seed();
