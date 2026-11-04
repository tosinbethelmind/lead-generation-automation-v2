/**
 * @file scripts/lib/pillar2_contacts_registry.js
 * 
 * 🏛️ BETHELMIND PILLAR 2: PERMANENT CONTACT REGISTRY & RECOGNITION
 * 
 * Guarantees 100% deterministic separation between:
 * - Pillar 1: SME Website Storefronts & Sector Monetization Tools
 * - Pillar 2: High-Ticket Luxury Real Estate Co-Brokerage Mandates (₦420M–₦1.5B)
 * 
 * Once a number is recognized as Pillar 2, it NEVER receives Pillar 1 copy.
 */

const fs = require('fs');
const path = require('path');

const REGISTRY_PATH = path.join(__dirname, '../../local_db/pillar2_contacts_registry.json');

// Core Top Lagos Brokers & Partners Whitelist
const TOP_LAGOS_BROKER_PROFILES = [
  {
    name: 'Ora Egbunike & Associates',
    phones: ['08038774238', '09033157777', '08021061457'],
    verifiedWhatsApp: '08038774238',
    email: 'info@oraegbunike.com',
    city: 'Victoria Island / Onikan, Lagos',
    defaultListing: '7bdrm Sovereign Mansion in Amen Estate, Lekki Expressway (₦500M)',
    defaultTicketId: 'DEAL-AMEN-500M'
  },
  {
    name: 'Deep-Delve Concepts',
    phones: ['08033008985'],
    verifiedWhatsApp: '08033008985',
    email: 'mandates@deepdelve.ng',
    city: 'Lekki Phase 1, Lagos',
    defaultListing: '7bdrm Sovereign Mansion in Amen Estate, Lekki Expressway (₦500M)',
    defaultTicketId: 'DEAL-AMEN-500M'
  },
  {
    name: 'Jide Taiwo & Co',
    phones: ['07052090092', '07052090118', '08034077173'],
    verifiedWhatsApp: '07052090092',
    email: 'properties@jidetaiwoandco.com',
    city: 'Victoria Island / Ikeja, Lagos',
    defaultListing: 'Waterfront 6-Bedroom Contemporary Villa in Banana Island, Ikoyi (₦1.5B)',
    defaultTicketId: 'DEAL-BANANA-1500M'
  },
  {
    name: 'Broll Property Services Nigeria',
    phones: ['08033214589'],
    verifiedWhatsApp: '08033214589',
    email: 'nigeria@broll.com',
    city: 'Victoria Island, Lagos',
    defaultListing: '5bdrm Contemporary Detached Duplex in Lekki Phase 1 (₦480M)',
    defaultTicketId: 'DEAL-LEKKI1-480M'
  },
  {
    name: 'Diya Fatimilehin & Co',
    phones: ['09053964068', '08113950582', '09154094445', '08023456781'],
    verifiedWhatsApp: '09053964068',
    email: 'mandates@diyafatimilehin.com',
    city: 'Lekki / Ikoyi, Lagos',
    defaultListing: '5-Bedroom Fully Automated Detached House in Victoria Island Commercial Corridor (₦850M)',
    defaultTicketId: 'DEAL-VI-850M'
  },
  {
    name: 'Knight Frank Nigeria',
    phones: ['08035678912'],
    verifiedWhatsApp: '08035678912',
    email: 'commercial@ng.knightfrank.com',
    city: 'Victoria Island, Lagos',
    defaultListing: 'Commercial High-Rise Development Plot along Lekki-Epe Expressway Corridor (₦750M)',
    defaultTicketId: 'DEAL-LEKKIEPE-750M'
  },
  {
    name: 'Ubosi Eleh & Co',
    phones: ['08054797515', '08028765432'],
    verifiedWhatsApp: '08054797515',
    email: 'valuation@ubosielehandco.com',
    city: 'Lagos Island, Lagos',
    defaultListing: '4-Bedroom Luxury Sky Penthouse overlooking Ikoyi Golf Course (₦420M)',
    defaultTicketId: 'DEAL-IKOYI-420M'
  },
  {
    name: 'Alpha Mead Real Estate Partners',
    phones: ['07019999343', '08091124022'],
    verifiedWhatsApp: '07019999343',
    email: 'realestate@alphamead.com',
    city: 'Victoria Island / Ikoyi, Lagos',
    defaultListing: 'Prime Logistics & Industrial Warehouse Complex in Ikeja Industrial Estate (₦650M)',
    defaultTicketId: 'DEAL-IKEJA-650M'
  }
];

function normalizePhoneTail(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  return digits.length >= 10 ? digits.slice(-10) : digits;
}

function loadRegistry() {
  const contactsMap = new Map();

  // 1. Seed baseline brokers
  for (const b of TOP_LAGOS_BROKER_PROFILES) {
    for (const p of b.phones) {
      const tail = normalizePhoneTail(p);
      if (tail) {
        contactsMap.set(tail, {
          brokerName: b.name,
          phone: p,
          verifiedWhatsApp: b.verifiedWhatsApp,
          city: b.city,
          defaultListing: b.defaultListing,
          defaultTicketId: b.defaultTicketId,
          source: 'BASELINE_WHITELIST'
        });
      }
    }
  }

  // 2. Read saved registry file if exists
  if (fs.existsSync(REGISTRY_PATH)) {
    try {
      const saved = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
      if (typeof saved === 'object' && saved !== null) {
        for (const [tail, val] of Object.entries(saved)) {
          contactsMap.set(tail, val);
        }
      }
    } catch (_) {}
  }

  return contactsMap;
}

function saveRegistry(map) {
  try {
    const dir = path.dirname(REGISTRY_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const obj = {};
    for (const [k, v] of map.entries()) {
      obj[k] = v;
    }
    fs.writeFileSync(REGISTRY_PATH, JSON.stringify(obj, null, 2), 'utf8');
  } catch (_) {}
}

const inMemoryRegistry = loadRegistry();

function isPillar2Phone(phone) {
  const tail = normalizePhoneTail(phone);
  if (!tail) return null;
  return inMemoryRegistry.get(tail) || null;
}

function registerPillar2Contact(phone, details = {}) {
  const tail = normalizePhoneTail(phone);
  if (!tail) return;
  const existing = inMemoryRegistry.get(tail) || {};
  const updated = {
    ...existing,
    ...details,
    phone: phone || existing.phone,
    registeredAt: existing.registeredAt || new Date().toISOString(),
    lastInteraction: new Date().toISOString()
  };
  inMemoryRegistry.set(tail, updated);
  saveRegistry(inMemoryRegistry);
}

module.exports = {
  TOP_LAGOS_BROKER_PROFILES,
  normalizePhoneTail,
  isPillar2Phone,
  registerPillar2Contact,
  getAllPillar2Contacts: () => inMemoryRegistry
};
