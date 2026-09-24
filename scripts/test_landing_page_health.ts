/**
 * @file scripts/test_landing_page_health.ts
 * Rigorous automated testing suite for Bethelmind Landing Page & Personalized Prototypes.
 */

import { PLANS_NEED_WEBSITE, PLANS_HAVE_WEBSITE, getPlanById } from '../src/config/plans';
import { SECTOR_PROFILES } from '../src/config/sectors';
import { getDesignTheme, buildFallbackCopy } from '../src/lib/designGenerator';
import { findBundledLead, sanitizeDisplayName } from '../src/lib/leadsBundle';
import fs from 'fs';
import path from 'path';

function runTests() {
  console.log('====================================================');
  console.log('🧪 RUNNING RIGOROUS LANDING PAGE & PREVIEW TEST SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName}`);
      failed++;
    }
  }

  // ── TEST 1: PRICING CONFIGURATION INTEGRITY (AGENTS.md INVARIANT) ──
  console.log('--- TEST GROUP 1: Pricing Model & Milestone Deposits ---');
  
  const needWebPro = PLANS_NEED_WEBSITE.find(p => p.id === 'pro');
  assert(!!needWebPro, 'PLANS_NEED_WEBSITE has "pro" plan');
  assert(needWebPro?.setupFeeNGN === 75_000, `Need-website Pro setup fee is ₦75,000 (got ₦${needWebPro?.setupFeeNGN})`);
  assert(needWebPro?.badge?.includes('50% Milestone Deposit') || false, 'Need-website Pro has 50% Milestone Deposit badge');

  const haveWebStarter = PLANS_HAVE_WEBSITE.find(p => p.id === 'starter');
  assert(!!haveWebStarter, 'PLANS_HAVE_WEBSITE has "starter" plan');
  assert(haveWebStarter?.setupFeeNGN === 35_000, `Have-website Starter setup fee is ₦35,000 (got ₦${haveWebStarter?.setupFeeNGN})`);
  assert(haveWebStarter?.monthlyNGN === 0, 'Have-website Starter has ₦0 monthly recurring fee');

  const haveWebPro = PLANS_HAVE_WEBSITE.find(p => p.id === 'pro');
  assert(haveWebPro?.setupFeeNGN === 65_000, `Have-website Pro setup fee is ₦65,000 (got ₦${haveWebPro?.setupFeeNGN})`);

  // ── TEST 2: RETENTION OF PREVIOUSLY SENT PREVIEW LINKS (BACKWARD COMPATIBILITY) ──
  console.log('\n--- TEST GROUP 2: Backward Compatibility of Sent Links ---');

  // Test slug variation 1: Solar installer in Ikeja
  const slug1 = 'jide-solar-energy-ikeja';
  const name1 = sanitizeDisplayName(slug1, 'Solar & Renewable Energy');
  assert(name1.length > 3, `Sanitized name generated for slug "${slug1}": "${name1}"`);
  
  const theme1 = getDesignTheme('Solar & Renewable Energy', slug1);
  assert(!!theme1.primary && !!theme1.bg, `Luxury theme resolved for solar slug (primary: ${theme1.primary})`);
  
  const copy1 = buildFallbackCopy({ name: name1, category: 'Solar & Renewable Energy', area: 'Ikeja', city: 'Lagos' });
  assert(copy1.services.length >= 3, `Tailored services copy generated (services count: ${copy1.services.length})`);
  assert(copy1.heroTitle.includes(name1) || copy1.heroSubtitle.includes(name1) || copy1.aboutText.includes(name1), 'Copy contains business name');

  // Test slug variation 2: Real estate developer in Lekki
  const slug2 = 'oakwood-luxury-homes-lekki';
  const theme2 = getDesignTheme('Real Estate & Luxury Homes', slug2);
  assert(!!theme2.primary, `Luxury theme resolved for real estate slug (primary: ${theme2.primary})`);

  // Test slug variation 3: Dental clinic in VI
  const slug3 = 'smile-care-dental-victoria-island';
  const theme3 = getDesignTheme('Medical & Healthcare Clinics', slug3);
  assert(!!theme3.primary, `Luxury theme resolved for dental slug (primary: ${theme3.primary})`);

  // ── TEST 3: SPECIALIZED SECTOR TOOLS INTEGRITY ──
  console.log('\n--- TEST GROUP 3: Specialized Sector Tools Integrity ---');
  
  const solarSector = SECTOR_PROFILES['solar'];
  assert(!!solarSector, 'Solar sector profile exists in SECTOR_PROFILES');
  assert(solarSector.tools.some(t => t.id === 'solar_boq'), 'Solar sector includes Solar BOQ Sizer tool');

  const realEstateSector = SECTOR_PROFILES['realestate'];
  assert(!!realEstateSector, 'Real Estate sector profile exists');
  assert(realEstateSector.tools.length >= 2, `Real Estate has ${realEstateSector.tools.length} specialized tools`);

  // ── TEST 4: SOURCE FILES ZERO-CORRUPTION VERIFICATION ──
  console.log('\n--- TEST GROUP 4: Critical Landing Page Source Files Verification ---');

  const filesToCheck = [
    'src/app/home/page.tsx',
    'src/components/home/HeroSection.tsx',
    'src/components/home/PricingSection.tsx',
    'src/components/home/PaymentSection.tsx',
    'src/config/plans.ts',
    'src/app/preview/[lead_id]/page.tsx'
  ];

  for (const relPath of filesToCheck) {
    const fullPath = path.join(process.cwd(), relPath);
    assert(fs.existsSync(fullPath), `File exists: ${relPath}`);
    const content = fs.readFileSync(fullPath, 'utf8');
    assert(content.length > 500, `File content valid & non-empty: ${relPath} (${content.length} bytes)`);
    
    // Check no obsolete 185k setup fee remains
    if (relPath.includes('plans.ts') || relPath.includes('PricingSection.tsx') || relPath.includes('HeroSection.tsx')) {
      assert(!content.includes('185_000') && !content.includes('185,000'), `No obsolete ₦185,000 references in ${relPath}`);
    }
  }

  // ── SUMMARY ──
  console.log('\n====================================================');
  console.log(`🏁 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
