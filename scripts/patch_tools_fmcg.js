const fs = require('fs');
const path = require('path');

// 1. Patch src/app/tools/page.tsx
const toolsPagePath = path.join(__dirname, '../src/app/tools/page.tsx');
let toolsPage = fs.readFileSync(toolsPagePath, 'utf8');

if (!toolsPage.includes('Factory,')) {
  toolsPage = toolsPage.replace(/Hotel\r?\n/, 'Hotel,\n  Factory\n');
}

const fmcgEntry = `  {
    id: 'fmcg-dispatch',
    title: 'Water Factory & FMCG Fleet Route Reconciler',
    badge: 'Driver & Nylon Audit',
    category: 'b2b',
    description: 'Reconciles morning delivery truck loading (sachet water & bottles) against evening driver cash, Moniepoint transfers, burst bags, and customer debts, flagging shortages instantly.',
    icon: Factory,
    color: 'text-[#d4af37]',
    href: '/tools/fmcg-dispatch',
    upsell: '₦50,000 Factory Setup'
  },
`;

if (!toolsPage.includes('fmcg-dispatch')) {
  toolsPage = toolsPage.replace(/const TOOLS: ToolItem\[\] = \[\r?\n/, match => match + fmcgEntry);
  fs.writeFileSync(toolsPagePath, toolsPage, 'utf8');
  console.log('✅ Patched src/app/tools/page.tsx with fmcg-dispatch');
} else {
  console.log('src/app/tools/page.tsx already contains fmcg-dispatch');
}

// 2. Patch src/app/tools/[slug]/page.tsx
const slugPagePath = path.join(__dirname, '../src/app/tools/[slug]/page.tsx');
let slugPage = fs.readFileSync(slugPagePath, 'utf8');

const slugMatchPattern = `  if (/fmcg|water|factory|sachet|bottle|beverage/.test(slug)) {
    return {
      title: 'Water Factory & FMCG Dispatch Route Reconciler',
      category: 'FMCG & Water Manufacturing',
      tag: 'Driver Route & Nylon Yield Audit',
      summary: 'Reconciles morning delivery truck loading (sachet water & bottles) against evening driver cash, Moniepoint transfers, burst bags, and customer debts, flagging shortages instantly.',
      highlightPills: ['Driver Truck Shortage Flag', 'Nylon Roll Production Yield', 'Burst Bag Allowance Audit'],
      sectorTab: 'logistics',
    };
  }

`;

if (!slugPage.includes('fmcg|water|factory')) {
  slugPage = slugPage.replace('if (/solar|clean-energy|inverter/.test(slug)) {', slugMatchPattern + '  if (/solar|clean-energy|inverter/.test(slug)) {');
  fs.writeFileSync(slugPagePath, slugPage, 'utf8');
  console.log('✅ Patched src/app/tools/[slug]/page.tsx with water factory router');
} else {
  console.log('src/app/tools/[slug]/page.tsx already contains water factory router');
}
