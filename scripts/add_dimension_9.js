const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'run_2026_top_advanced_simulation.js');
let content = fs.readFileSync(file, 'utf8');

const dimension9Code = `
    // ──────────────────────────────────────────────────────────────────────────
    // DIMENSION 9: WATER FACTORY & FMCG PRODUCTION ERP VERIFICATION (OBI SCENARIO)
    // ──────────────────────────────────────────────────────────────────────────
    console.log('\\n--- DIMENSION 9: Water Factory & FMCG Production ERP Verification ---');
    const waterContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true
    });
    const waterPage = await waterContext.newPage();

    // 9.1 Test /tools/fmcg-dispatch route
    console.log('Testing /tools/fmcg-dispatch for AquaFlow ERP rendering...');
    await waterPage.goto(\`\${BASE_URL}/tools/fmcg-dispatch\`, { waitUntil: 'load', timeout: 35000 });
    await waterPage.waitForTimeout(3000);

    const fmcgText = await waterPage.locator('body').innerText();
    check(!fmcgText.includes('Bone Straight') && !fmcgText.includes('Bridal Glam'), 'Anti-Regression: Zero Salon/Hair Content on FMCG Dispatch');
    check(fmcgText.includes('AquaFlow') || fmcgText.includes('Water Factory') || fmcgText.includes('Sachet'), 'AquaFlow Water Factory System Rendered on /tools/fmcg-dispatch');
    check(fmcgText.includes(MONIEPOINT_ACCOUNT), 'Moniepoint Account 6805375225 Present on Water Factory Page');
    check(fmcgText.includes('0802 279 1227') || fmcgText.includes('2348022791227'), 'Admin WhatsApp Desk Present on Water Factory Page');

    // 9.2 Test /preview/obi-table-water route
    console.log('Testing /preview/obi-table-water for instant ERP rendering...');
    await waterPage.goto(\`\${BASE_URL}/preview/obi-table-water\`, { waitUntil: 'load', timeout: 35000 });
    await waterPage.waitForTimeout(3000);

    const obiText = await waterPage.locator('body').innerText();
    check(obiText.includes('AquaFlow') || obiText.includes('Water Factory') || obiText.includes('Production Floor'), 'Obi Preview: Renders Full Water Factory ERP (Not Generic Storefront)');
    check(!obiText.includes('NO Upfront Preview'), 'Obi Preview: Eliminated Confusing "NO Upfront Preview" Button');

    // 9.3 Test interactive tabs
    const quickbooksTab = waterPage.locator('button:has-text("QuickBooks"), button:has-text("P&L")');
    if (await quickbooksTab.count() > 0) {
      await quickbooksTab.first().click();
      await waterPage.waitForTimeout(1000);
      const qbText = await waterPage.locator('body').innerText();
      check(qbText.includes('Diesel') || qbText.includes('Generator') || qbText.includes('Operating Profit'), 'QuickBooks Tab: Real-Time Diesel & Profit Ledger Functional');
    }

    const waterScreenshot = path.join(ssDir, 'sim_2026_water_factory_erp_mobile.png');
    await waterPage.screenshot({ path: waterScreenshot, fullPage: true });
    check(fs.existsSync(waterScreenshot), 'Water Factory ERP Mobile Screenshot Captured', waterScreenshot);

    await waterContext.close();
`;

if (!content.includes('DIMENSION 9: WATER FACTORY')) {
  content = content.replace(
    'await mobileContext.close();\n    await context.close();',
    'await mobileContext.close();\n    await context.close();' + dimension9Code
  );
  fs.writeFileSync(file, content, 'utf8');
  console.log('Successfully injected Dimension 9 into simulation suite!');
} else {
  console.log('Dimension 9 already present.');
}
