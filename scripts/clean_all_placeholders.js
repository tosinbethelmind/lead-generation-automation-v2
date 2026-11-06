const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, replacements) {
  const fullPath = path.resolve(filePath);
  if (!fs.existsSync(fullPath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }
  let text = fs.readFileSync(fullPath, 'utf8');
  let original = text;
  for (const [pattern, replacement] of replacements) {
    text = text.replace(pattern, replacement);
  }
  if (text !== original) {
    fs.writeFileSync(fullPath, text, 'utf8');
    console.log(`Updated: ${filePath}`);
  } else {
    console.log(`No changes needed in: ${filePath}`);
  }
}

// 1. src/lib/pillar2/luxuryListings.ts
replaceInFile('src/lib/pillar2/luxuryListings.ts', [
  [/name:\s*'Barrister Babatunde Alabi \(SAN Nominee\)'/g, "name: 'Bethelmind Corporate Property Desk'"],
  [/role:\s*'Principal Legal Counsel & Power-of-Attorney Proxy'/g, "role: 'Diaspora Client Liaison & Transaction Desk'"],
  [/phone:\s*'08034128901'/g, "phone: '08022791227'"],
  [/email:\s*'b\.alabi@adeyemipartners-law\.ng'/g, "email: 'bethelmindrecruit@gmail.com'"],
  [/officeAddress:\s*'Plot 14, Commercial Avenue, Victoria Island, Lagos'/g, "officeAddress: 'Victoria Island / Ikoyi Commercial Corridor, Lagos'"]
]);

// 2. src/lib/pillar2/pillar2Engine.ts
replaceInFile('src/lib/pillar2/pillar2Engine.ts', [
  [/name:\s*'Barrister Babatunde Alabi \(SAN Nominee\)'/g, "name: 'Bethelmind Corporate Property Desk'"],
  [/role:\s*'Principal Legal Counsel & Power-of-Attorney Proxy'/g, "role: 'Diaspora Client Liaison & Transaction Desk'"],
  [/phone:\s*'08034128901'/g, "phone: '08022791227'"],
  [/email:\s*'b\.alabi@adeyemipartners-law\.ng'/g, "email: 'bethelmindrecruit@gmail.com'"],
  [/officeAddress:\s*'Plot 14, Commercial Avenue, Victoria Island, Lagos'/g, "officeAddress: 'Victoria Island / Ikoyi Commercial Corridor, Lagos'"]
]);

// 3. scripts/patch_pillar2_brief_and_buyer.js
replaceInFile('scripts/patch_pillar2_brief_and_buyer.js', [
  [/Barrister Babatunde Alabi \(SAN Nominee\)/g, "Bethelmind Corporate Property Desk"],
  [/08034128901/g, "08022791227"],
  [/b\.alabi@adeyemipartners-law\.ng/g, "bethelmindrecruit@gmail.com"]
]);

// 4. scripts/patch_pillar2_control_view.js
replaceInFile('scripts/patch_pillar2_control_view.js', [
  [/'Barrister Babatunde Alabi'/g, "'Bethelmind Corporate Property Desk'"],
  [/'08034128901'/g, "'08022791227'"]
]);

// 5. local_db/deal_wire_briefs.json
replaceInFile('local_db/deal_wire_briefs.json', [
  [/Engr\. Babatunde Alabi \(UK Diaspora Returnee\)/g, "Diaspora Executive Principal (UK Returnee)"]
]);

// 6. src/app/results/page.tsx
replaceInFile('src/app/results/page.tsx', [
  [/author:\s*'Engr\. Babatunde Alabi'/g, "author: 'Engr. Babatunde O.'"]
]);

// 7. src/components/home/ResultsPreviewSection.tsx
replaceInFile('src/components/home/ResultsPreviewSection.tsx', [
  [/author:\s*'Engr\. Babatunde Alabi, Managing Director'/g, "author: 'Engr. Babatunde O., Managing Director'"]
]);

console.log('Finished placeholder removal.');
