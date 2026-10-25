const fs = require('fs');
const path = require('path');

// 1. Update src/app/tools/[slug]/page.tsx
const slugFile = path.join(__dirname, '..', 'src', 'app', 'tools', '[slug]', 'page.tsx');
let slugContent = fs.readFileSync(slugFile, 'utf8');

const salaryToolDef = `  'salary-calc': {
    id: 'salary-calc',
    file: 'salary-calc.html',
    title: 'SalaryTakeHome AI™ | 2026 Net Pay, PAYE & Remote Income Sizer',
    category: 'Finance & Investing',
    badge: '💰 2026 Statutory Payroll Engine',
    summary: 'Calculate your true monthly take-home income after statutory PAYE personal income tax, 8% pension, NHF, and Consolidated Relief Allowances.',
    highlights: ['PITA 2026 Statutory Calculation', 'Itemized PAYE & Pension Deductions', 'Instant WhatsApp Salary Slip Share'],
    selarUrl: 'https://selar.com/showlove/bethelmind?product=da-finance',
    selarProduct: '2026 Passive Wealth Compounding & Cashflow Model',
    selarPrice: '₦15,000 / $19',
  },`;

if (!slugContent.includes("'salary-calc':")) {
  slugContent = slugContent.replace("'higher-lower': {", salaryToolDef + "\n  'higher-lower': {");
  fs.writeFileSync(slugFile, slugContent, 'utf8');
  console.log('Added salary-calc to [slug]/page.tsx');
} else {
  console.log('salary-calc already in [slug]/page.tsx');
}

// 2. Update src/app/tools/page.tsx
const toolsPage = path.join(__dirname, '..', 'src', 'app', 'tools', 'page.tsx');
let toolsContent = fs.readFileSync(toolsPage, 'utf8');

const salaryCard = `  {
    id: 'salary-calc',
    title: 'SalaryTakeHome AI™ 2026 Net Pay & PAYE Tax Sizer',
    badge: '💰 Statutory Payroll Engine',
    category: 'wealth',
    description: 'Calculate your true monthly net salary after PAYE tax, 8% pension, NHF, and Consolidated Relief Allowances.',
    icon: Calculator,
    color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
    href: '/tools/salary-calc',
    upsell: '💎 ₦15k Wealth Model'
  },`;

if (!toolsContent.includes("'salary-calc'")) {
  toolsContent = toolsContent.replace("id: 'higher-lower',", "id: 'salary-calc',\n" + salaryCard.replace("  {\n", "").replace("\n  },", "") + "\n  },\n  {\n    id: 'higher-lower',");
  fs.writeFileSync(toolsPage, toolsContent, 'utf8');
  console.log('Added salary-calc to tools/page.tsx');
} else {
  console.log('salary-calc already in tools/page.tsx');
}
