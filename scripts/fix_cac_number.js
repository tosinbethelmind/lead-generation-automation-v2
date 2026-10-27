const fs = require('fs');
const path = require('path');

const filesToClean = [
  'src/components/vin/VinCheckerClient.tsx',
  'src/components/ViralToolShareBar.tsx',
  'src/components/SectorToolsWidget.tsx',
  'src/components/ViralQuoteForwarder.tsx',
  'src/components/WhatsAppLeadMagnetModal.tsx',
  'src/config/plans.ts',
  'scripts/generate_vin_pdf_report.js',
  'scripts/generate_sector_tool_pdf.js'
];

let totalReplaced = 0;

for (const rel of filesToClean) {
  const p = path.join(__dirname, '..', rel);
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf8');
    const before = content;
    
    // Replace RC 7034297 or RC: 7034297 with CAC Certified Enterprise
    content = content.replace(/RC:?\s*7034297/gi, 'CAC Certified Enterprise');
    content = content.replace(/•\s*RC\s*7034297/gi, '• CAC Certified');
    
    if (content !== before) {
      fs.writeFileSync(p, content, 'utf8');
      console.log(`✓ Cleaned in: ${rel}`);
      totalReplaced++;
    }
  }
}

console.log(`\nCompleted cleanup across ${totalReplaced} files.`);
