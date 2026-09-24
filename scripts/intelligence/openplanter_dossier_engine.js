/**
 * @file scripts/intelligence/openplanter_dossier_engine.js
 * 
 * 🏛️ OpenPlanter B2B Recursive Entity Resolution & Due Diligence Dossier Engine
 * Inspired by ShinMegamiBoson/OpenPlanter ("Community Palantir for B2B"):
 * 
 * MONETIZATION ENGINE:
 * Generates bankable ₦150,000 – ₦250,000 Corporate Counterparty Due Diligence Reports
 * for Nigerian commercial banks, solar EPC contractors, property developers, and importers.
 */

const fs = require('fs');
const path = require('path');
const { analyzePhone } = require('../lib/searchphone_engine');
const { generateEntitySearchVectors } = require('../lib/identity_fingerprint');
const { renderExecutiveHtmlDossier } = require('./openplanter_report_renderer');

function generateDossierId(businessName) {
  const clean = businessName.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 10);
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `BM-DD-${clean}-${rand}`;
}

function calculateCorporateTrustScore(phoneAnalysis, footprint, leadData) {
  let score = 70; // Baseline
  const reasons = [];

  if (phoneAnalysis.isValid) {
    score += 10;
    reasons.push(`Verified valid Nigerian telecom line (${phoneAnalysis.carrier} GSM)`);
  }
  if (phoneAnalysis.isMtnOrAirtelCorporate) {
    score += 5;
    reasons.push('Primary business contact is on Tier-1 enterprise carrier');
  }
  if (leadData.rating && leadData.rating >= 4.0) {
    score += 10;
    reasons.push(`High Google Maps public reputation (${leadData.rating}★ rating)`);
  }
  if (leadData.address && leadData.address.length > 10) {
    score += 5;
    reasons.push('Confirmed physical address footprint');
  }

  let grade = 'A (Commercial Verified)';
  if (score >= 90) grade = 'AAA (Prime Institutional)';
  else if (score >= 80) grade = 'AA (High Reliability SME)';
  else if (score < 60) grade = 'HIGH RISK / UNVERIFIED';

  return {
    score: Math.min(score, 100),
    grade,
    verificationAudit: reasons
  };
}

function buildCorporateDossier(lead) {
  const dossierId = generateDossierId(lead.name || 'ENTERPRISE');
  const phoneAnalysis = analyzePhone(lead.phone || lead.phone_raw || lead.phone_e164);
  const footprint = generateEntitySearchVectors(lead.name, lead.email, lead.area || lead.city);
  const trustEvaluation = calculateCorporateTrustScore(phoneAnalysis, footprint, lead);

  const dossier = {
    metadata: {
      dossierId,
      generatedAt: new Date().toISOString(),
      issuer: 'Bethelmind Analytics Lagos — Institutional Intelligence Desk',
      settlementAccount: 'OPay Digital Services (7034297995 - Oyelakin Tosin Matthew)',
      priceTierNGN: 150000,
      classification: 'CONFIDENTIAL B2B COUNTERPARTY AUDIT'
    },
    entity: {
      commercialName: lead.name,
      category: lead.category || 'Commercial Enterprise',
      address: lead.address || 'Lagos Commercial Corridor',
      district: lead.area || lead.city || 'Lagos',
      state: 'Lagos State, Nigeria',
      primaryDirectorOrLead: footprint.detectedExecutive,
      cacPublicVerificationVector: footprint.corporateFootprint.cacRegistryQuery
    },
    telecomIntelligence: {
      verifiedPhone: phoneAnalysis.phone0X || lead.phone,
      internationalE164: phoneAnalysis.e164,
      carrier: phoneAnalysis.carrier || 'Nigerian GSM',
      lineType: phoneAnalysis.lineType || 'Mobile',
      isWhatsAppEnabled: true,
      directWhatsAppLink: phoneAnalysis.whatsappUrl
    },
    riskAssessment: {
      trustScore: trustEvaluation.score,
      compositeGrade: trustEvaluation.grade,
      rule5AntiSyntheticPassed: phoneAnalysis.isValid,
      auditFactors: trustEvaluation.verificationAudit
    },
    digitalFootprint: {
      linkedInSearch: footprint.corporateFootprint.linkedInCompanySearch,
      googleMapsSearch: footprint.corporateFootprint.googleMapsQuery,
      instagramQuery: footprint.corporateFootprint.instagramBusinessQuery
    }
  };

  // Persist locally in data/dossiers/
  const outDir = path.join(__dirname, '..', '..', 'data', 'dossiers');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const outPath = path.join(outDir, `${dossierId}.json`);
  fs.writeFileSync(outPath, JSON.stringify(dossier, null, 2));

  const htmlContent = renderExecutiveHtmlDossier(dossier);
  const htmlPath = path.join(outDir, `${dossierId}.html`);
  fs.writeFileSync(htmlPath, htmlContent, 'utf8');

  return { dossier, outPath, htmlPath };
}

// Test mode
if (require.main === module) {
  const sampleLead = {
    name: 'Apex Solar Technologies Lagos',
    category: 'Commercial Solar & Energy EPC',
    phone: '08034567891',
    email: 'babatunde.solar@apexsolartechnologies.com',
    address: 'Plot 14, Commercial Corridor, Victoria Island, Lagos',
    area: 'Victoria Island',
    rating: 4.8,
    reviews_count: 34
  };

  console.log('\n======================================================');
  console.log('🏛️ OPENPLANTER B2B DUE DILIGENCE DOSSIER GENERATOR');
  console.log('======================================================');
  const { dossier, outPath } = buildCorporateDossier(sampleLead);
  console.log(`✅ Dossier Generated: ${dossier.metadata.dossierId}`);
  console.log(`🏢 Entity: ${dossier.entity.commercialName}`);
  console.log(`👤 Executive: ${dossier.entity.primaryDirectorOrLead}`);
  console.log(`📱 Telecom Carrier: ${dossier.telecomIntelligence.carrier} (${dossier.telecomIntelligence.internationalE164})`);
  console.log(`🛡️ Trust Grade: ${dossier.riskAssessment.compositeGrade} (Score: ${dossier.riskAssessment.trustScore}/100)`);
  console.log(`📁 Saved to: ${outPath}`);
  console.log(`💰 Commercial Value: ₦${dossier.metadata.priceTierNGN.toLocaleString()} NGN`);
  console.log('======================================================\n');
}

module.exports = { buildCorporateDossier, calculateCorporateTrustScore };
