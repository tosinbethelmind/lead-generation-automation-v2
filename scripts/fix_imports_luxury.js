const fs = require('fs');
const path = require('path');

// 1. Fix src/components/admin/Pillar2ControlView.tsx
const p2ViewPath = path.join(__dirname, '..', 'src', 'components', 'admin', 'Pillar2ControlView.tsx');
let p2Content = fs.readFileSync(p2ViewPath, 'utf8');

// Remove any import { PRIME_LUXURY_LISTINGS } from '@/lib/pillar2/pillar2Engine'
p2Content = p2Content.replace(/import\s*\{\s*PRIME_LUXURY_LISTINGS\s*\}\s*from\s*['"]@\/lib\/pillar2\/pillar2Engine['"];?\s*/g, '');

// Ensure 'use client' is line 1
p2Content = p2Content.replace(/['"]use client['"];?\s*/, '');
p2Content = "'use client';\n\n" + p2Content;

// Add import from luxuryListings
if (!p2Content.includes("from '@/lib/pillar2/luxuryListings'")) {
  p2Content = p2Content.replace(
    "import React, { useState } from 'react';",
    "import React, { useState } from 'react';\nimport { PRIME_LUXURY_LISTINGS } from '@/lib/pillar2/luxuryListings';"
  );
}

fs.writeFileSync(p2ViewPath, p2Content, 'utf8');
console.log('✅ Pillar2ControlView.tsx imports fixed.');

// 2. Fix src/app/api/deal/[deal_id]/route.ts
const routePath = path.join(__dirname, '..', 'src', 'app', 'api', 'deal', '[deal_id]', 'route.ts');
let routeContent = fs.readFileSync(routePath, 'utf8');
routeContent = routeContent.replace(
  "from '@/lib/pillar2/pillar2Engine'",
  "from '@/lib/pillar2/luxuryListings'"
);
fs.writeFileSync(routePath, routeContent, 'utf8');
console.log('✅ route.ts imports fixed.');

// 3. In src/lib/pillar2/pillar2Engine.ts, import from luxuryListings and re-export
const p2EnginePath = path.join(__dirname, '..', 'src', 'lib', 'pillar2', 'pillar2Engine.ts');
let p2EngineContent = fs.readFileSync(p2EnginePath, 'utf8');

// Replace the PRIME_LUXURY_LISTINGS array definition with import
const listingsDefRegex = /\/\/ ── VERIFIED LUXURY ASSETS POOL[\s\S]*?const VERIFIED_NIGERIAN_BROKERS/m;
if (listingsDefRegex.test(p2EngineContent)) {
  p2EngineContent = p2EngineContent.replace(
    listingsDefRegex,
    `export { PRIME_LUXURY_LISTINGS } from './luxuryListings';\nimport { PRIME_LUXURY_LISTINGS } from './luxuryListings';\n\n// ── VERIFIED NIGERIAN REAL ESTATE BROKERS (EXCLUDES ADMIN 08022791227) ──────\nconst VERIFIED_NIGERIAN_BROKERS`
  );
  fs.writeFileSync(p2EnginePath, p2EngineContent, 'utf8');
  console.log('✅ pillar2Engine.ts updated to use luxuryListings.ts');
}
