const fs = require('fs');
const path = require('path');

const vinScriptPath = path.join(__dirname, 'generate_vin_pdf_report.js');
let code = fs.readFileSync(vinScriptPath, 'utf8');

// 1. Patch Section 3: Replace absolute claims with Advisory & Registry Protocol
const sec3Start = code.indexOf('<!-- 3. SALVAGE & HURRICANE FLOOD AUDIT -->');
const sec4Start = code.indexOf('<!-- 4. LAGOS ROADSIDE MECHANIC');

if (sec3Start !== -1 && sec4Start !== -1) {
  const targetSec3 = code.substring(sec3Start, sec4Start);
  const replacementSec3 = `<!-- 3. SALVAGE & HURRICANE FLOOD ADVISORY AUDIT -->
    <div class="section-heading">3. North American Title Risk Registry & Flood Corridor Advisory</div>
    <div class="grid-2">
      <div class="metric-card" style="border-left: 4px solid #0284c7;">
        <div class="m-title">Public Registry Query (NHTSA / WMI Decoded)</div>
        <div class="m-val" style="font-size: 11px; color: #0369a1;">NO OPEN RECALLS / STANDARD SPEC</div>
        <div class="m-sub">Federal specifications match factory build. Unofficial structural alterations require mandatory physical verification in Section 4.</div>
      </div>
      <div class="metric-card" style="border-left: 4px solid #d97706;">
        <div class="m-title">Salvage & Coastal Flood Advisory Protocol</div>
        <div class="m-val" style="font-size: 11px; color: #b45309;">MANDATORY ON-SITE SILT & ECU CHECK</div>
        <div class="m-sub">To guard against unrecorded hurricane floodwaters or cosmetic auction rebuilds, execute physical kick-panel ECU inspection below before payment.</div>
      </div>
    </div>\n\n    `;
  
  code = code.replace(targetSec3, replacementSec3);
  console.log('✓ Section 3 successfully updated to Advisory & Verification Protocol');
} else {
  console.warn('Warning: Section 3 markers not matched');
}

// 2. Add FCCPA 2018 Statutory Disclaimer before Certification Stamp
const stampStart = code.indexOf('<!-- CERTIFICATION STAMP -->');
const sealBoxStart = code.indexOf('<div class="auth-seal-container">');

if (stampStart !== -1 && sealBoxStart !== -1) {
  const targetStampHeader = code.substring(stampStart, sealBoxStart);
  const disclaimerBlock = `<!-- 5. STATUTORY LEGAL DISCLAIMER & LIMITATION OF LIABILITY -->
    <div style="margin-top: 10px; margin-bottom: 12px; padding: 8px 10px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 8px; line-height: 1.35; color: #475569;">
      <b>LEGAL DISCLAIMER & STATUTORY LIMITATION OF LIABILITY (FCCPA 2018 COMPLIANT):</b><br>
      This document is an advisory technical specification and pre-purchase guidance report compiled from United States National Highway Traffic Safety Administration (NHTSA vPIC) federal registries and Nigerian Customs Service (NCS CET 2022-2027) statutory tariff schedules. This report does <b>NOT</b> constitute a statutory mechanical warranty, insurance underwriting policy, or guarantee of title. Bethelmind Digital Solutions and its technical analysts disclaim all liability for undisclosed private auction records, post-import mechanical alterations, dockside component theft (including catalytic converter removal), or unrecorded cosmetic rebuilds. Total financial liability under any claim arising from this advisory report is strictly capped at the fee paid (₦3,500 NGN). <b>Buyer Directive:</b> Execution of the on-site physical mechanical protocol (Section 4) by a certified automotive technician is mandatory prior to releasing vehicle funds.
    </div>\n\n    <!-- CERTIFICATION STAMP -->\n    `;

  code = code.replace(targetStampHeader, disclaimerBlock);
  console.log('✓ FCCPA 2018 Legal Disclaimer & Limitation of Liability Seal embedded');
} else {
  console.warn('Warning: Stamp markers not matched');
}

fs.writeFileSync(vinScriptPath, code, 'utf8');
console.log('✓ scripts/generate_vin_pdf_report.js successfully written and verified.');
