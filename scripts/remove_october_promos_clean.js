const fs = require('fs');
const path = require('path');

function replaceInFile(relPath, target, replacement) {
  const fullPath = path.join(__dirname, '..', relPath);
  if (!fs.existsSync(fullPath)) {
    console.log(`[SKIP] File not found: ${relPath}`);
    return 0;
  }
  let content = fs.readFileSync(fullPath, 'utf8');
  if (!content.includes(target)) {
    console.log(`[NOT_FOUND] in ${relPath}: "${target.slice(0, 40)}..."`);
    return 0;
  }
  let count = 0;
  while (content.includes(target)) {
    content = content.replace(target, replacement);
    count++;
  }
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`[REPLACED ${count}x] in ${relPath}: "${target.slice(0, 30)}..." -> "${replacement.slice(0, 30)}..."`);
  return count;
}

console.log('=== REMOVING ALL OCTOBER PROMO REFERENCES ===\n');

// 1. src/config/plans.ts
replaceInFile(
  'src/config/plans.ts',
  'badge: \'🇳🇬 OCTOBER 50% SME PROMO • MOST POPULAR\'',
  'badge: \'🇳🇬 OFFICIAL SME INITIATIVE • MOST POPULAR\''
);
replaceInFile(
  'src/config/plans.ts',
  'Normal Price ₦130,000 → October Promo Total: ₦65,000 (1 Full Year Domain & Hosting Included — Zero Monthly Rent).',
  'Standard Agency Price ₦130,000 → Direct SME Price: ₦65,000 (1 Full Year Domain & Hosting Included — Zero Monthly Rent).'
);
replaceInFile(
  'src/config/plans.ts',
  'badge: \'🏢 CORPORATE VIP • 50% OCTOBER SUBSIDY\'',
  'badge: \'🏢 CORPORATE VIP • DIRECT SUITE\''
);
replaceInFile(
  'src/config/plans.ts',
  'Normal Price ₦240,000 → October Promo Total: ₦120,000. For firms bidding for high-value contracts.',
  'Standard Agency Price ₦240,000 → Direct SME Price: ₦120,000. For firms bidding for high-value contracts.'
);
replaceInFile(
  'src/config/plans.ts',
  'badge: \'👑 WEB + ANDROID APK • 50% OCTOBER PROMO\'',
  'badge: \'👑 WEB + ANDROID APK • ENTERPRISE SUITE\''
);
replaceInFile(
  'src/config/plans.ts',
  'Normal Price ₦350,000 → October Promo Total: ₦175,000. Complete Web Portal + Native Android App.',
  'Standard Agency Price ₦350,000 → Direct SME Price: ₦175,000. Complete Web Portal + Native Android App.'
);
replaceInFile(
  'src/config/plans.ts',
  'badge: \'🇳🇬 OCTOBER 50% PROMO • 10-MINUTE SETUP\'',
  'badge: \'🇳🇬 DIRECT SME RATE • 10-MINUTE SETUP\''
);
replaceInFile(
  'src/config/plans.ts',
  'Normal Price ₦70,000 → October Promo: ₦35,000 One-Time. Keep your current website 100% untouched.',
  'Standard Agency Price ₦70,000 → Direct SME Price: ₦35,000 One-Time. Keep your current website 100% untouched.'
);
replaceInFile(
  'src/config/plans.ts',
  '{ text: \'⚡ One-Time ₦35,000 October Promo Setup — Zero monthly charges\' }',
  '{ text: \'⚡ One-Time ₦35,000 Direct SME Setup — Zero monthly charges\' }'
);
replaceInFile(
  'src/config/plans.ts',
  'badge: \'🔥 50% OCTOBER PROMO • FULL SUITE EMBED\'',
  'badge: \'🔥 PRO MULTI-TOOL • FULL SUITE EMBED\''
);
replaceInFile(
  'src/config/plans.ts',
  'Normal Price ₦130,000 → October Promo Total: ₦65,000 (Start with ₦35,000 Deposit).',
  'Standard Agency Price ₦130,000 → Direct SME Price: ₦65,000 (Start with ₦35,000 Deposit).'
);
replaceInFile(
  'src/config/plans.ts',
  'badge: \'Full API & CRM Sync • 50% Promo\'',
  'badge: \'Full API & CRM Sync • Enterprise\''
);
replaceInFile(
  'src/config/plans.ts',
  'Normal Price ₦240,000 → October Promo Total: ₦120,000. Deep API & CRM integration.',
  'Standard Agency Price ₦240,000 → Direct SME Price: ₦120,000. Deep API & CRM integration.'
);

// 2. src/components/home/PricingSection.tsx
replaceInFile(
  'src/components/home/PricingSection.tsx',
  '🇳🇬 50% OCTOBER PROMO',
  '🇳🇬 DIRECT SME INITIATIVE'
);
replaceInFile(
  'src/components/home/PricingSection.tsx',
  'October Promo Total:',
  'Direct SME Total:'
);
replaceInFile(
  'src/components/home/PricingSection.tsx',
  'Complete 1-Time Promo Setup',
  'Complete 1-Time Setup'
);

// 3. src/components/home/SectorToolsSection.tsx
replaceInFile(
  'src/components/home/SectorToolsSection.tsx',
  '🇳🇬 OCTOBER 50% SME DIGITAL GROWTH PROMO',
  '🇳🇬 SME DIGITAL GROWTH INITIATIVE'
);

// 4. src/components/CustomerAiAgentWidget.tsx
replaceInFile(
  'src/components/CustomerAiAgentWidget.tsx',
  '`💳 View October Promo Pricing`',
  '`💳 View Official SME Pricing`'
);

// 5. src/components/ExecutivePdfQuoteModal.tsx
replaceInFile(
  'src/components/ExecutivePdfQuoteModal.tsx',
  '🇳🇬 OCTOBER 50% PROMO — DEPOSIT TO START',
  '🇳🇬 DIRECT SME INITIATIVE — DEPOSIT TO START'
);
replaceInFile(
  'src/components/ExecutivePdfQuoteModal.tsx',
  'OCTOBER 50% PROMO TOTAL',
  'DIRECT SME TOTAL'
);

// 6. src/components/SectorToolsWidget.tsx
replaceInFile(
  'src/components/SectorToolsWidget.tsx',
  '<span>Claim ₦35k October Promo →</span>',
  '<span>Claim ₦35k Starter Package →</span>'
);

// 7. src/components/StickyMobileConversionBar.tsx
replaceInFile(
  'src/components/StickyMobileConversionBar.tsx',
  '🇳🇬 Oct 50% Promo (₦65k) · Start With ₦35k Deposit',
  '🇳🇬 Direct SME Rate (₦65k) · Start With ₦35k Deposit'
);
replaceInFile(
  'src/components/StickyMobileConversionBar.tsx',
  '🟢 Claim October Promo on WhatsApp →',
  '🟢 Claim Starter Package on WhatsApp →'
);

// 8. src/app/solutions/page.tsx
replaceInFile(
  'src/app/solutions/page.tsx',
  '<span>🇳🇬 Option A: Full .COM.NG Website + Tool (₦35k Deposit / ₦65k October Promo)</span>',
  '<span>🇳🇬 Option A: Full .COM.NG Website + Tool (₦35k Deposit / ₦65k Total)</span>'
);
replaceInFile(
  'src/app/solutions/page.tsx',
  '<span>Option B: 1-Line Embed on Existing Site (₦35k October Promo)</span>',
  '<span>Option B: 1-Line Embed on Existing Site (₦35k One-Time)</span>'
);
replaceInFile(
  'src/app/solutions/page.tsx',
  '1-Line Embed Upgrade (₦35k Promo Setup)',
  '1-Line Embed Upgrade (₦35k Direct Setup)'
);

// 9. src/lib/monetization/postContactCloserEngine.ts
replaceInFile(
  'src/lib/monetization/postContactCloserEngine.ts',
  '• October Promo Total: *${totalCost}*\\n',
  '• Direct SME Total: *${totalCost}*\\n'
);
replaceInFile(
  'src/lib/monetization/postContactCloserEngine.ts',
  '🇳🇬 *OCTOBER 50% SME PROMO (Because Your Sample Is Already 80% Built):*\\n',
  '🇳🇬 *OFFICIAL SME INITIATIVE (Because Your Sample Is Already 80% Built):*\\n'
);
replaceInFile(
  'src/lib/monetization/postContactCloserEngine.ts',
  '3. *50% October Promo Milestone:* Standard *.com.ng* website is *₦65,000* (down from ₦130k) — you only pay *₦35,000 deposit* to start, and pay the ₦30,000 balance AFTER your website is live on Google!\\n',
  '3. *Low-Friction SME Milestone:* Standard *.com.ng* website is *₦65,000* (down from agency ₦130k) — you only pay *₦35,000 deposit* to start, and pay the ₦30,000 balance AFTER your website is live on Google!\\n'
);
replaceInFile(
  'src/lib/monetization/postContactCloserEngine.ts',
  '🇳🇬 *OCTOBER 50% SME PROMO (Ends Oct 31):*\\n',
  '🇳🇬 *OFFICIAL SME INITIATIVE (Direct Turnkey Handover):*\\n'
);

// 10. scripts/execute_today_300_emails_and_webforms.ts
replaceInFile(
  'scripts/execute_today_300_emails_and_webforms.ts',
  '🇳🇬 October 50% SME Digital Growth Promo (Because Your Sample Is Already 80% Built):',
  '🇳🇬 Official SME Digital Growth Initiative (Because Your Sample Is Already 80% Built):'
);
replaceInFile(
  'scripts/execute_today_300_emails_and_webforms.ts',
  'want to claim the October 50% Promo.',
  'want to activate our official business website.'
);
replaceInFile(
  'scripts/execute_today_300_emails_and_webforms.ts',
  '🇳🇬 OCTOBER 50% SME PROMO · 🏛️ Bethelmind Digital Solutions (CAC Certified)',
  '🇳🇬 OFFICIAL SME INITIATIVE · 🏛️ Bethelmind Digital Solutions (CAC Certified)'
);
replaceInFile(
  'scripts/execute_today_300_emails_and_webforms.ts',
  '🇳🇬 October 50% SME Promo (Because Your Sample Is Already 80% Built)',
  '🇳🇬 Official SME Growth Initiative (Because Your Sample Is Already 80% Built)'
);

console.log('\n=== DONE SCRUBBING OCTOBER PROMOS ===');
