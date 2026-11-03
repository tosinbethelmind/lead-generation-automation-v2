const fs = require('fs');

console.log('--- Starting Website Pricing Unification ---');

// 1. Update TurnkeySmeSetupBanner.tsx
if (fs.existsSync('src/components/TurnkeySmeSetupBanner.tsx')) {
  let file = fs.readFileSync('src/components/TurnkeySmeSetupBanner.tsx', 'utf8');
  file = file.replace(
    '₦35,000 SME Starter Package',
    '₦35,000 Setup + ₦7,000/mo or ₦80,000 Annual Pass'
  );
  file = file.replace(
    /₦35,000\s*<\/div>\s*<div className="text-\[11px\] text-\[#8e887e\] font-light">\s*One-time activation/m,
    '₦35,000 Setup + ₦7k/mo</div>\n          <div className="text-[11px] text-emerald-400 font-semibold">or ₦80,000 Annual (1 Year Free)'
  );
  fs.writeFileSync('src/components/TurnkeySmeSetupBanner.tsx', file, 'utf8');
  console.log('✔ Updated src/components/TurnkeySmeSetupBanner.tsx');
}

// 2. Update FaqSection.tsx
if (fs.existsSync('src/components/home/FaqSection.tsx')) {
  let file = fs.readFileSync('src/components/home/FaqSection.tsx', 'utf8');
  const targetOld = `You can initiate onboarding with a 50% commitment deposit (₦35,000 for Starter or ₦75,000 for Turnkey). Our engineering team builds your bespoke 24/7 AI assistant, website prototype, and sector calculators immediately. You pay the remaining balance strictly upon live testing and final approval within 48 hours.`;
  const replacementNew = `We provide clear, transparent pricing: Plan A (Monthly Flex) is ₦35,000 setup + ₦7,000/month maintenance; Plan B (Annual Smart-Saver) is ₦80,000 all-inclusive with 1 FULL YEAR FREE maintenance (saving you ₦39,000); and Plan C (Full Custom .com Domain Suite) is ₦75,000 milestone deposit (₦150,000 total). You can test your working prototype free before paying.`;
  if (file.includes(targetOld)) {
    file = file.replace(targetOld, replacementNew);
    fs.writeFileSync('src/components/home/FaqSection.tsx', file, 'utf8');
    console.log('✔ Updated src/components/home/FaqSection.tsx');
  }
}

// 3. Update src/app/tools/page.tsx
if (fs.existsSync('src/app/tools/page.tsx')) {
  let file = fs.readFileSync('src/app/tools/page.tsx', 'utf8');
  file = file.replace(/upsell:\s*'₦35,000 [^']+'/g, "upsell: '₦35k Setup + ₦7k/mo (or ₦80k Annual)'");
  fs.writeFileSync('src/app/tools/page.tsx', file, 'utf8');
  console.log('✔ Updated src/app/tools/page.tsx upsell tags');
}

// 4. Update src/app/preview/[lead_id]/page.tsx
if (fs.existsSync('src/app/preview/[lead_id]/page.tsx')) {
  let file = fs.readFileSync('src/app/preview/[lead_id]/page.tsx', 'utf8');
  file = file.replace(
    'Milestone Option: ₦35,000 Deposit to Start · ₦35,000 Balance When Live!',
    'Option A: ₦35,000 Setup + ₦7,000/mo · Option B: ₦80,000 Annual Pass (1 Year Free!)'
  );
  file = file.replace(
    '₦35k Deposit (50% Plan)',
    '₦35k Setup (+ ₦7k/mo or ₦80k Annual)'
  );
  fs.writeFileSync('src/app/preview/[lead_id]/page.tsx', file, 'utf8');
  console.log('✔ Updated src/app/preview/[lead_id]/page.tsx');
}

// 5. Update src/config/plans.ts
if (fs.existsSync('src/config/plans.ts')) {
  let file = fs.readFileSync('src/config/plans.ts', 'utf8');
  file = file.replace(
    /setupFeeNGN:\s*35_000,\s*originalTotalNGN:\s*140_000,\s*totalAmountNGN:\s*70_000,\s*depositAmountNGN:\s*35_000,\s*balanceAmountNGN:\s*35_000,/,
    `setupFeeNGN: 35_000,\n    monthlyNGN: 7_000,\n    originalTotalNGN: 140_000,\n    totalAmountNGN: 80_000,\n    depositAmountNGN: 35_000,\n    balanceAmountNGN: 45_000,`
  );
  file = file.replace(
    'Direct SME Price: ₦70,000 Flat (1 Full Year Domain & Hosting Included — Zero Monthly Rent).',
    'Direct SME Price: ₦35,000 Setup + ₦7,000/mo (OR ₦80,000 Annual Pass with 1 Full Year Free Maintenance — Save ₦39,000).'
  );
  fs.writeFileSync('src/config/plans.ts', file, 'utf8');
  console.log('✔ Updated src/config/plans.ts');
}

// 6. Update AGENTS.md
if (fs.existsSync('AGENTS.md')) {
  let file = fs.readFileSync('AGENTS.md', 'utf8');
  file = file.replace(
    /₦35,000 one-time Starter Activation \(or ₦25,000\/month Pay-Small-Small\)/g,
    '₦35,000 Setup + ₦7,000/month maintenance (OR ₦80,000 Annual Pass with 1 Full Year Free — Save ₦39,000)'
  );
  file = file.replace(
    /₦35k Starter Go-Live \/ ₦25k monthly/g,
    '₦35k Setup + ₦7k/mo (or ₦80k Annual with 1 Year Free)'
  );
  fs.writeFileSync('AGENTS.md', file, 'utf8');
  console.log('✔ Updated AGENTS.md');
}

console.log('--- All website pricing files successfully aligned and unified! ---');
