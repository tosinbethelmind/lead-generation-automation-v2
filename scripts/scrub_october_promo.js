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

// 1. autoresponderEngine.ts
replaceInFile('src/lib/autoresponderEngine.ts', '🇳🇬 October 50% SME Digital Growth Promo', '6-Month Independence & Sector Growth Package');
replaceInFile('src/lib/autoresponderEngine.ts', '🇳🇬 October 50% SME Promo (Ends Oct 31):', 'Official Turnkey Packages:');
replaceInFile('src/lib/autoresponderEngine.ts', '🇳🇬 October 50% SME Promo', '6-Month Independence Package');
replaceInFile('src/lib/autoresponderEngine.ts', 'October 50% Promo', '6-Month Independence Bundle');

// 2. postContactCloserEngine.ts
replaceInFile('src/lib/monetization/postContactCloserEngine.ts', 'October 50% Promo — Normal Price ₦130,000', '6-Month Independence Bundle · Waived Setup + Free Domain');
replaceInFile('src/lib/monetization/postContactCloserEngine.ts', 'October 50% Promo — Normal Price ₦240,000', 'Turnkey Custom Domain Suite · 48h SLA');
replaceInFile('src/lib/monetization/postContactCloserEngine.ts', 'October 50% SME Promo', '6-Month Independence Bundle');
replaceInFile('src/lib/monetization/postContactCloserEngine.ts', 'October 50% Promo', '6-Month Independence Bundle');
replaceInFile('src/lib/monetization/postContactCloserEngine.ts', 'OCTOBER PROMO', '6-MONTH INDEPENDENCE BUNDLE');

// 3. NigerianSmeHeroExplainer.tsx
replaceInFile('src/components/NigerianSmeHeroExplainer.tsx', '🇳🇬 October 50% Promo: ₦35,000 Deposit', '🇳🇬 6-Month Independence Bundle: ₦75,000 Total');

// 4. SectorToolsWidget.tsx
replaceInFile('src/components/SectorToolsWidget.tsx', 'October 50% Promo: ₦35k Upgrade', 'Sector Tool Instant Embed: ₦35,000');
replaceInFile('src/components/SectorToolsWidget.tsx', '🇳🇬 October 50% Promo: <span className="line-through text-rose-400">₦70,000</span> → ₦35,000 One-Time', '🇳🇬 Sector Tool Upgrade: ₦35,000 One-Time Setup');
replaceInFile('src/components/SectorToolsWidget.tsx', 'October 50% Promo (₦35,000)', 'Sector Tool Integration (₦35,000)');

// 5. StickyMobileConversionBar.tsx
replaceInFile('src/components/StickyMobileConversionBar.tsx', 'October 50% Promo Website (₦65k Promo Total · ₦35,000 Deposit today, balance after going live on Google)', '6-Month Independence Bundle (₦75k Total · ₦35k Deposit today, balance after live approval)');

// 6. home/SectorToolsSection.tsx
replaceInFile('src/components/home/SectorToolsSection.tsx', 'October 50% SME Promo', '6-Month Independence Package');
replaceInFile('src/components/home/SectorToolsSection.tsx', 'October 50% Promo (₦35,000 Deposit / ₦65,000 Total instead of ₦130,000)', '6-Month Independence Bundle (₦75,000 Total / ₦35,000 Deposit)');

// 7. home/SolutionsSection.tsx
replaceInFile('src/components/home/SolutionsSection.tsx', '🇳🇬 October 50% SME Promo • The 10 High-Conversion Sector Tools', '🇳🇬 Sector Monetization Suite • The 10 High-Conversion Sector Tools');

// 8. LandingPage.tsx
replaceInFile('src/components/LandingPage.tsx', 'October 50% Promo', '6-Month Independence Bundle');
replaceInFile('src/components/LandingPage.tsx', 'October 50% promo', '6-Month Independence Bundle');
replaceInFile('src/components/LandingPage.tsx', 'October 50%', '6-Month Independence Bundle');

console.log('Scrub script complete.');
