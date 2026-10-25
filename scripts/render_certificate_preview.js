const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function renderPreview() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 950, height: 1350 } });

  const scriptContent = fs.readFileSync(path.join(__dirname, 'generate_vin_pdf_report.js'), 'utf8');
  const startIdx = scriptContent.indexOf('<!DOCTYPE html>');
  const endIdx = scriptContent.indexOf('</html>') + 7;
  let html = scriptContent.slice(startIdx, endIdx);

  const reportData = {
    reportId: 'REP-JHLRD1851WC804433-2026-NCS',
    date: '25 October 2026',
    vin: 'JHLRD1851WC804433',
    make: 'HONDA',
    model: 'CR-V',
    year: '1998',
    trim: 'LX (5-Door Compact SUV / MPV)',
    bodyClass: 'Multi-Purpose Passenger Vehicle (Class 1C)',
    plantCountry: 'JAPAN',
    assemblyPlant: 'Sayama Assembly, Saitama Prefecture, Japan',
    wmi: 'JHL (Honda Motor Co., Ltd. Japan)',
    driveType: 'Front-Wheel Drive (FWD)',
    transmission: '4-Speed Hydraulic Automatic with Grade Logic',
    engine: '2.0L (1,972cc) DOHC 16-Valve B20B 4-Cylinder',
    horsepower: '126 HP @ 5,400 RPM / 133 lb-ft @ 4,300 RPM',
    fuelType: 'Unleaded Gasoline (Direct Fuel Injection)',
    estimatedMileage: '~350,000 Miles (Operational Age-Curve)',
    fairMarketPrice: '₦7,500,000 NGN',
    dealerRange: '₦7,125,000 – ₦8,625,000 NGN',
    redFlagPrice: 'Below ₦5,250,000 NGN (Extreme Salvage / Flood Trap)',
    customsDuty: '₦1,800,000 NGN',
    cifValue: '$2,800 USD (NCS 2026 Assessed Benchmark)',
    recallsCount: '0',
    riskScore: '30',
    riskTier: 'LOW STRUCTURAL RISK (Mechanical Age Bracket: 28 Years)'
  };

  for (const [k, v] of Object.entries(reportData)) {
    html = html.split('${reportData.' + k + '}').join(v);
  }

  await page.setContent(html, { waitUntil: 'domcontentloaded' });
  const artifactPath = 'C:\\Users\\HomePC\\.gemini\\antigravity\\brain\\25a33253-8f35-4ebf-8b82-ca94582fc57d\\luxury_vin_certificate_preview.png';
  await page.screenshot({ path: artifactPath, fullPage: true });
  await browser.close();
  console.log('✓ Successfully saved high-res certificate artifact to:', artifactPath);
}

renderPreview().catch(console.error);
