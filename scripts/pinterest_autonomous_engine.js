/**
 * 🇳🇬 Bethelmind Digital Solutions - Pinterest Visual Traffic & Pins Engine
 * RC 7034297 • High-Resolution Vertical Infographic Syndication
 */

const path = require('path');
const fs = require('fs');
const { renderPins } = require('./pinterest_infographic_generator');

const MANIFEST_FILE = path.join(__dirname, '..', 'public', 'pins', 'pins_manifest.json');
const LEDGER_FILE = path.join(__dirname, '..', 'local_db', 'pinterest_campaigns.json');

function loadLedger() {
  if (fs.existsSync(LEDGER_FILE)) {
    try { return JSON.parse(fs.readFileSync(LEDGER_FILE, 'utf8')); } catch {}
  }
  return { pins: [], stats: { totalPins: 0 } };
}

function saveLedger(ledger) {
  const dir = path.dirname(LEDGER_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(LEDGER_FILE, JSON.stringify(ledger, null, 2), 'utf8');
}

async function syncPinsToLedger() {
  if (!fs.existsSync(MANIFEST_FILE)) {
    console.log('Manifest not found, rendering pins first...');
    await renderPins();
  }

  const manifest = JSON.parse(fs.readFileSync(MANIFEST_FILE, 'utf8'));
  const ledger = loadLedger();

  for (const item of manifest) {
    const exists = ledger.pins.some(p => p.id === item.id);
    if (!exists) {
      ledger.pins.push({
        id: item.id,
        title: item.title,
        description: item.description,
        targetUrl: item.targetUrl,
        relativeUrl: item.relativeUrl,
        board: 'Nigerian SME Growth & High-Conversion Tools',
        createdAt: new Date().toISOString(),
        status: 'published_ready'
      });
      ledger.stats.totalPins = (ledger.stats.totalPins || 0) + 1;
    }
  }

  saveLedger(ledger);
  console.log(`✓ Pinterest Ledger synchronized: ${ledger.pins.length} active high-res pins ready for distribution.`);
  return ledger;
}

if (require.main === module) {
  syncPinsToLedger().catch(console.error);
}

module.exports = { syncPinsToLedger };
