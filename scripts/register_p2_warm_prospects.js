const fs = require('fs');
const path = require('path');

const REGISTRY_PATH = path.join(__dirname, '..', 'local_db', 'pillar2_contacts_registry.json');

let registry = {};
if (fs.existsSync(REGISTRY_PATH)) {
  try {
    registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
  } catch (_) {
    registry = {};
  }
}

// Register Prospect 1 (6825525166330)
const p1Keys = ['6825525166330', '5525166330'];
p1Keys.forEach(k => {
  registry[k] = {
    brokerName: 'Amen Estate / Lekki Mandate Partner',
    phone: '08022791227', // linked
    verifiedWhatsApp: '6825525166330',
    city: 'Lekki Expressway / Amen Estate, Lagos',
    defaultListing: '7bdrm Sovereign Mansion in Amen Estate, Lekki Expressway (₦500M)',
    defaultTicketId: 'DEAL-AMEN-500M',
    source: 'DIRECT_PROSPECT_INTEREST',
    isPillar2: true,
    registeredAt: new Date().toISOString(),
    lastInteraction: new Date().toISOString()
  };
});

// Register Prospect 2 (62251289604110)
const p2Keys = ['62251289604110', '1289604110'];
p2Keys.forEach(k => {
  registry[k] = {
    brokerName: 'Lekki Phase 1 Luxury Mandate Partner',
    phone: '08022791227',
    verifiedWhatsApp: '62251289604110',
    city: 'Lekki Phase 1, Lagos',
    defaultListing: '5bdrm Luxury Smart Duplex with Private Pool in Lekki Phase 1 (₦1.1B)',
    defaultTicketId: 'DEAL-LEKKI1-1100M',
    source: 'DIRECT_PROSPECT_INTEREST',
    isPillar2: true,
    registeredAt: new Date().toISOString(),
    lastInteraction: new Date().toISOString()
  };
});

// Register Prospect 3 (162706950746260)
const p3Keys = ['162706950746260', '706950746260', '6950746260'];
p3Keys.forEach(k => {
  registry[k] = {
    brokerName: 'Ikoyi / Banana Island Luxury Mandate Partner',
    phone: '08022791227',
    verifiedWhatsApp: '162706950746260',
    city: 'Banana Island, Ikoyi, Lagos',
    defaultListing: 'Waterfront 6-Bedroom Contemporary Villa in Banana Island, Ikoyi (₦1.5B)',
    defaultTicketId: 'DEAL-BANANA-1500M',
    source: 'DIRECT_PROSPECT_INTEREST',
    isPillar2: true,
    registeredAt: new Date().toISOString(),
    lastInteraction: new Date().toISOString()
  };
});

fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2), 'utf8');
console.log('✅ Registered Pillar 2 prospects in local_db/pillar2_contacts_registry.json');
