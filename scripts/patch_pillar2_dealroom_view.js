const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '..', 'src', 'components', 'admin', 'Pillar2ControlView.tsx');
let content = fs.readFileSync(targetPath, 'utf8');

// 1. Add import
if (!content.includes('Pillar2DealRoomView')) {
  content = content.replace(
    "import { PRIME_LUXURY_LISTINGS, VERIFIED_NIGERIAN_BROKERS } from '@/lib/pillar2/luxuryListings';",
    "import Pillar2DealRoomView from './Pillar2DealRoomView';\nimport { PRIME_LUXURY_LISTINGS, VERIFIED_NIGERIAN_BROKERS } from '@/lib/pillar2/luxuryListings';"
  );
}

// 2. Update subTab state type
content = content.replace(
  "const [subTab, setSubTab] = useState<'all' | 'pending' | 'queue' | 'dispatched' | 'mandates'>('all');",
  "const [subTab, setSubTab] = useState<'all' | 'pending' | 'queue' | 'dispatched' | 'mandates' | 'dealroom'>('all');"
);

// 3. Add to sub-navigation tabs array
if (!content.includes("key: 'dealroom'")) {
  content = content.replace(
    "{ key: 'mandates', label: 'Signed Mandates', count: signedMandates.length }",
    "{ key: 'mandates', label: 'Signed Mandates', count: signedMandates.length },\n          { key: 'dealroom', label: '🏛️ Deal Room', count: 5 }"
  );
}

// 4. Render component when subTab === 'dealroom'
if (!content.includes("<Pillar2DealRoomView />")) {
  const insertAnchor = "{subTab === 'mandates' && (";
  const replacement = "      {/* ── SUB-TAB 5: TWENTY CRM DEAL ROOM ─────────────────────────────────── */}\n      {subTab === 'dealroom' && (\n        <div style={{ marginTop: '12px' }}>\n          <Pillar2DealRoomView />\n        </div>\n      )}\n\n      " + insertAnchor;
  content = content.replace(insertAnchor, replacement);
}

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Successfully patched Pillar2ControlView.tsx with Pillar2DealRoomView!');
