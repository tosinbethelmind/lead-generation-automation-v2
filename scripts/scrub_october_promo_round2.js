const fs = require('fs');

function replaceInFile(file, searchStr, replacement) {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  let count = 0;
  while (content.includes(searchStr)) {
    content = content.replace(searchStr, replacement);
    count++;
  }
  fs.writeFileSync(file, content, 'utf8');
  console.log(file, 'Replaced:', count, 'instances of', searchStr.slice(0, 30));
}

// 1. src/app/preview/[lead_id]/page.tsx
replaceInFile('src/app/preview/[lead_id]/page.tsx', 'October 50% Promo (₦35,000 deposit to launch)', '6-Month Independence Bundle (₦75,000 Total / ₦35,000 Deposit)');
replaceInFile('src/app/preview/[lead_id]/page.tsx', 'October 50% Promo (₦65,000 Promo Total · ₦35,000 Deposit today, ₦30,000 balance after going live)', '6-Month Independence Bundle (₦75,000 Total · ₦35,000 Deposit today, balance after going live)');
replaceInFile('src/app/preview/[lead_id]/page.tsx', 'October 50% Promo: Corporate .COM + Staff Emails Suite (₦120,000 Promo Total · ₦60,000 Deposit today)', 'Full Turnkey Custom Domain Suite (₦150,000 Total · ₦75,000 Milestone Deposit)');
replaceInFile('src/app/preview/[lead_id]/page.tsx', 'October 50% Promo', '6-Month Independence Bundle');

// 2. src/components/CustomerAiAgentWidget.tsx
replaceInFile('src/components/CustomerAiAgentWidget.tsx', '🇳🇬 Claim October 50% Promo (₦35,000 Deposit)', '👑 Lock 6-Month Bundle (₦75,000 Total)');
replaceInFile('src/components/CustomerAiAgentWidget.tsx', '🇳🇬 Claim October 50% Promo (₦35k Deposit)', '👑 Lock 6-Month Bundle (₦75k Total)');

// 3. src/components/ExecutivePdfQuoteModal.tsx
replaceInFile('src/components/ExecutivePdfQuoteModal.tsx', 'October 50% Promo', '6-Month Independence');

// 4. src/app/solutions/page.tsx
replaceInFile('src/app/solutions/page.tsx', 'October 50% Promo', '6-Month Independence Bundle');
replaceInFile('src/app/solutions/page.tsx', '₦35k Deposit / ₦65k Promo Total', '₦35k Deposit / ₦75k Total');

// 5. src/app/handover/[id]/page.tsx
replaceInFile('src/app/handover/[id]/page.tsx', ' — October 50% Promo', '');
replaceInFile('src/app/handover/[id]/page.tsx', 'October 50% Promo', 'Commercial Activation');

// 6. Remaining in postContactCloserEngine.ts & autoresponderEngine.ts
replaceInFile('src/lib/autoresponderEngine.ts', '🇳🇬 *October 50% SME Promo (Ends Oct 31):*', '⭐ *6-Month Independence & Growth Packages:*');
replaceInFile('src/lib/monetization/postContactCloserEngine.ts', '🇳🇬 October 50% SME Digital Growth Promo', '6-Month Independence & Sector Growth Package');

// 7. src/components/home/SolutionsSection.tsx
replaceInFile('src/components/home/SolutionsSection.tsx', 'October 50% SME Promo', '6-Month Independence Bundle');

// 8. scripts/whatsapp_baileys.js
replaceInFile('scripts/whatsapp_baileys.js', '🇳🇬 October 50% SME Promo', '6-Month Independence Package');

console.log('Complete cleanup done.');
