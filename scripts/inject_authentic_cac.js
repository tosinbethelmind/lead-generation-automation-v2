const fs = require('fs');
const path = require('path');

const CAC_NUMBER = '9912717';
const CAC_LABEL = `CAC Reg: ${CAC_NUMBER}`;
const CAC_FULL = `Bethelmind Digital Solutions (CAC Reg: ${CAC_NUMBER})`;

const targetFiles = [
  'src/components/home/Footer.tsx',
  'src/components/vin/VinCheckerClient.tsx',
  'src/components/ViralToolShareBar.tsx',
  'src/components/SectorToolsWidget.tsx',
  'src/components/ViralQuoteForwarder.tsx',
  'src/components/WhatsAppLeadMagnetModal.tsx',
  'src/components/StickyMobileConversionBar.tsx',
  'src/config/plans.ts',
  'scripts/generate_vin_pdf_report.js',
  'scripts/generate_sector_tool_pdf.js',
  'AGENTS.md'
];

let updatedCount = 0;

for (const rel of targetFiles) {
  const p = path.join(__dirname, '..', rel);
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf8');
    const original = content;

    // Replace old placeholder references
    content = content.replace(/7034297/g, CAC_NUMBER);
    content = content.replace(/CAC Certified Enterprise/g, `CAC Certified Enterprise (Reg: ${CAC_NUMBER})`);
    content = content.replace(/CAC Certified Nigerian Enterprise/g, `CAC Certified Nigerian Enterprise (Reg: ${CAC_NUMBER})`);
    
    // Clean any duplicates like (Reg: 9912717) (Reg: 9912717)
    content = content.replace(/\(Reg:\s*9912717\)\s*\(Reg:\s*9912717\)/g, `(Reg: ${CAC_NUMBER})`);
    content = content.replace(/RC:?\s*9912717/gi, `CAC Reg: ${CAC_NUMBER}`);
    content = content.replace(/BN\/RC:?\s*9912717/gi, `CAC Reg: ${CAC_NUMBER}`);

    if (content !== original) {
      fs.writeFileSync(p, content, 'utf8');
      console.log(`✓ Injected authentic CAC ${CAC_NUMBER} into: ${rel}`);
      updatedCount++;
    }
  }
}

console.log(`\nSuccessfully updated authentic CAC number ${CAC_NUMBER} across ${updatedCount} files.`);
