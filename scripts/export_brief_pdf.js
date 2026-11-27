const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function generateBriefPdf() {
  const outputPath = 'C:\\Users\\HomePC\\Desktop\\Bethelmind_Comprehensive_Lawyer_Business_Brief.pdf';
  console.log('Generating Institutional Lawyer Business Brief PDF to:', outputPath);

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Bethelmind - Institutional Legal Briefing & Operational Dossier</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 15mm 14mm 15mm 14mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    body {
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
      font-size: 9.5pt;
      line-height: 1.45;
      color: #1e293b;
      margin: 0;
      padding: 0;
      background: #ffffff;
    }
    .header-banner {
      border-bottom: 2px solid #0f172a;
      padding-bottom: 8px;
      margin-bottom: 14px;
    }
    .brand-title {
      font-size: 15pt;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.5px;
      text-transform: uppercase;
      margin: 0;
    }
    .brand-sub {
      font-size: 8pt;
      color: #64748b;
      font-weight: 600;
      margin-top: 2px;
    }
    .doc-badge {
      display: inline-block;
      background: #0f172a;
      color: #fbbf24;
      font-weight: 700;
      font-size: 7.5pt;
      padding: 2px 7px;
      border-radius: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-top: 4px;
    }
    h1 {
      font-size: 11.5pt;
      font-weight: 800;
      color: #0f172a;
      border-left: 4px solid #b45309;
      padding-left: 8px;
      margin-top: 14px;
      margin-bottom: 6px;
      text-transform: uppercase;
    }
    h2 {
      font-size: 10pt;
      font-weight: 700;
      color: #1e293b;
      margin-top: 10px;
      margin-bottom: 4px;
    }
    p {
      margin: 0 0 7px 0;
      text-align: justify;
    }
    .highlight-box {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-left: 4px solid #0284c7;
      padding: 8px 12px;
      border-radius: 4px;
      margin: 10px 0;
      font-size: 8.5pt;
    }
    .tech-card {
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      border-left: 3px solid #b45309;
      padding: 7px 10px;
      border-radius: 4px;
      margin-bottom: 6px;
    }
    .tech-title {
      font-weight: 800;
      color: #0f172a;
      font-size: 9pt;
    }
    .table-container {
      margin: 8px 0;
      width: 100%;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 8pt;
    }
    th, td {
      border: 1px solid #cbd5e1;
      padding: 5px 7px;
      text-align: left;
    }
    th {
      background: #0f172a;
      color: #ffffff;
      font-weight: 700;
      font-size: 7.5pt;
      text-transform: uppercase;
    }
    tr:nth-child(even) {
      background: #f8fafc;
    }
    .gold-cell {
      font-weight: 700;
      color: #b45309;
      background: #fffbeb !important;
    }
    .step-card {
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      padding: 7px 10px;
      margin-bottom: 6px;
      background: #ffffff;
    }
    .step-num {
      display: inline-block;
      background: #b45309;
      color: #ffffff;
      font-weight: 800;
      font-size: 7.5pt;
      width: 18px;
      height: 18px;
      line-height: 18px;
      text-align: center;
      border-radius: 50%;
      margin-right: 5px;
    }
    .step-title {
      font-weight: 700;
      color: #0f172a;
      font-size: 9pt;
    }
    .qa-box {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-left: 3px solid #059669;
      padding: 8px 10px;
      border-radius: 4px;
      margin-bottom: 8px;
      font-size: 8.5pt;
    }
    .qa-question {
      font-weight: 800;
      color: #065f46;
      margin-bottom: 3px;
    }
    .checklist {
      list-style-type: none;
      padding-left: 0;
      margin: 6px 0;
    }
    .checklist li {
      padding: 3px 0;
      border-bottom: 1px dashed #e2e8f0;
      font-size: 8.5pt;
    }
    .checklist li strong {
      color: #0f172a;
    }
    .page-break {
      page-break-before: always;
    }
    .footer-note {
      font-size: 7pt;
      color: #94a3b8;
      border-top: 1px solid #e2e8f0;
      padding-top: 4px;
      margin-top: 14px;
      text-align: center;
    }
  </style>
</head>
<body>

  <!-- PAGE 1 -->
  <div class="header-banner">
    <div class="brand-title">BETHELMIND DIGITAL SOLUTIONS</div>
    <div class="brand-sub">CAC Registered Enterprise: BN 9912717 &bull; Head Office: Lagos, Nigeria &bull; Web: www.bethelmindanalytics.com</div>
    <div class="brand-sub">Settlement Bank: Moniepoint Microfinance Bank (Corporate Acct: 6805375225) &bull; Desk: 0802 279 1227 &bull; bethelmindrecruit@gmail.com</div>
    <div class="doc-badge">Privileged & Confidential &bull; Master Legal Briefing & Operational Dossier</div>
  </div>

  <h1 style="margin-top:0;">1. Executive Statement: The Separation of Powers</h1>
  <p>
    <strong>Bethelmind Digital Solutions</strong> (CAC BN: 9912717) is an enterprise transaction origination and software automation infrastructure company headquartered in Lagos, Nigeria. We operate on an uncompromising institutional principle: <strong>The Strategic Separation of Origination and Legal Due Diligence</strong>.
  </p>
  <ul style="margin: 0 0 6px 16px; font-size: 8.5pt;">
    <li><strong>Bethelmind's Sole Domain (Technology & Pipeline)</strong>: Algorithmic market discovery, direct-to-developer root-mandate aggregation, affluent diaspora buyer targeting, sub-3-second AI qualification, and Section 84 digital mandate gating. <strong>Bethelmind does not practice law.</strong></li>
    <li><strong>Your Chambers' Sole Domain (Legal Counsel & Closing)</strong>: Title due diligence, physical searches at the Lagos State Lands Bureau (Alausa), drafting/vetting of conveyancing instruments, and closing escrow oversight. <strong>Your Chambers holds absolute veto authority</strong>: if an asset's title is encumbered or defective, the deal is immediately halted.</li>
  </ul>

  <div class="highlight-box">
    <strong>The Strategic Value to Your Chambers</strong><br>
    Bethelmind feeds your law practice with high-value conveyancing transactions without your Chambers spending a single Naira on marketing, lead generation, or website upkeep. All actual statutory search disbursements at Alausa are billed to clients, while your Chambers earns <strong>20% of Bethelmind's origination cut</strong> on every closed deal.
  </div>

  <h1>2. The Broken Lagos Real Estate Market & Our Competitive Moat</h1>
  <p>
    Traditional real estate brokerage in Lagos is plagued by inefficiencies that lawyers and serious developers encounter daily. Bethelmind solves this through technology:
  </p>

  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th style="width: 50%;">The Broken Traditional System</th>
          <th style="width: 50%;">Bethelmind's Institutional Technology Engine</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>5 to 7 Middlemen Chains</strong>: Properties pass through unverified roadside agents, leading to price markups, conflicting claims, and violent commission disputes.</td>
          <td><strong>Algorithmic Root-Mandate Discovery</strong>: Web harvesters filter out sub-agents, verifying developer CAC filings to deal <strong>strictly with the primary developer or root mandate holder</strong>.</td>
        </tr>
        <tr>
          <td><strong>Extreme Diaspora Skepticism</strong>: Affluent Nigerians abroad (UK, US, Canada) want to buy property, but fear fake titles, court <em>lis pendens</em>, and family fraud.</td>
          <td><strong>The "Institutional Legal Wrapper"</strong>: We do not pitch bricks and mortar; we pitch <strong>independent Alausa title verification by an SCN-enrolled Bar Advocate</strong> before funds move.</td>
        </tr>
        <tr>
          <td><strong>8-to-14 Hour Timezone Delay</strong>: Diaspora buyers message agents during their local evenings (9 PM–2 AM Lagos). Local agents are asleep, causing leads to cool off.</td>
          <td><strong>Sub-3-Second AI Speed-to-Lead</strong>: Our cloud WhatsApp engine responds in <strong>under 2.8 seconds 24/7</strong>, qualifying budget, timeline, and serving private digital dockets.</td>
        </tr>
        <tr>
          <td><strong>Unenforceable Oral Handshakes</strong>: Brokers share details openly, only to be bypassed by unscrupulous buyers or developers.</td>
          <td><strong>Section 84 Evidence Act Digital Lock-in</strong>: Mandatory execution of digital mandates on <code>/mandate</code> with cryptographic SHA-256 certificates admissible in court.</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="footer-note">Bethelmind Digital Solutions &bull; Privileged Legal Briefing &bull; Page 1 of 4</div>

  <!-- PAGE 2 -->
  <div class="page-break"></div>
  <div class="header-banner">
    <div class="brand-title">BETHELMIND DIGITAL SOLUTIONS</div>
    <div class="brand-sub">CAC Registered Enterprise: BN 9912717 &bull; Appointed Legal Counsel Briefing</div>
  </div>

  <h1 style="margin-top:0;">3. Proprietary Technology: Capturing High-Class Assets & Capital</h1>
  <p>Bethelmind operates a cloud-hosted intelligence infrastructure that pairs verified luxury assets with high-net-worth capital:</p>

  <div class="tech-card">
    <div class="tech-title">1. Direct-to-Developer Asset Discovery Engine</div>
    <p style="margin: 2px 0 0 0; font-size: 8pt;">
      Our web crawlers continuously index primary inventory across <strong>Banana Island, Ikoyi, Victoria Island, Lekki Phase 1, and Epe</strong>. The algorithm cross-references developer CAC filings to bypass middlemen and deal directly with the principal title-holder.
    </p>
  </div>

  <div class="tech-card">
    <div class="tech-title">2. High-Net-Worth Diaspora Inbound Acquisition Funnel</div>
    <p style="margin: 2px 0 0 0; font-size: 8pt;">
      Targeting affluent Nigerian professionals in London, Manchester, Houston, Atlanta, Toronto, Calgary, and Dubai. These buyers hold foreign currency purchasing power (GBP, USD, CAD) and demand corporate transparency over informal street agents.
    </p>
  </div>

  <div class="tech-card">
    <div class="tech-title">3. Sub-3-Second WhatsApp AI Speed-to-Lead & Qualification</div>
    <p style="margin: 2px 0 0 0; font-size: 8pt;">
      When an inquiry arrives, our system responds in <strong>less than 2.8 seconds</strong>, qualifying budget (&#8358;100M&#8211;&#8358;2B+), purchase horizon, and verified identity. Unqualified tire-kickers are screened out before any inspection or legal file is created.
    </p>
  </div>

  <div class="tech-card">
    <div class="tech-title">4. Dedicated Digital Property Dockets (<code>/preview/[slug]</code>)</div>
    <p style="margin: 2px 0 0 0; font-size: 8pt;">
      Qualified buyers receive private, mobile-optimized digital dossiers featuring HD drone walkthroughs, architectural floor plans, approved survey overlays, and developer milestone schedules.
    </p>
  </div>

  <div class="tech-card">
    <div class="tech-title">5. Section 84 Evidence Act Digital Signing Portal (<code>/mandate</code>)</div>
    <p style="margin: 2px 0 0 0; font-size: 8pt;">
      Before properties are shown, parties execute digital agreements. The system captures IP addresses, timestamps, and user-agent strings, generating a cryptographic <strong>SHA-256 certificate</strong> legally admissible under Section 84 of the Evidence Act 2011.
    </p>
  </div>

  <h1>4. The 4 Master Statutory Instruments</h1>
  <div class="step-card">
    <span class="step-num">1</span> <span class="step-title">Document 1: Master Legal Retainership & Transaction Counsel Agreement</span>
    <p style="margin: 2px 0 0 24px; font-size: 8pt;">
      Executed between <strong>Bethelmind Digital Solutions</strong> and <strong>Your Chambers</strong>. Establishes your formal appointment, 20% revenue share entitlement, scope of legal authority, and professional independence.
    </p>
  </div>

  <div class="step-card">
    <span class="step-num">2</span> <span class="step-title">Document 2: Master Co-Brokerage & Commission Sharing Agreement (LASRERA Standard)</span>
    <p style="margin: 2px 0 0 24px; font-size: 8pt;">
      Executed with property developers and lead brokers before introducing buyers. Locks in our 80/20 commission split and establishes <strong>12-month non-circumvention protection</strong>.
    </p>
  </div>

  <div class="step-card">
    <span class="step-num">3</span> <span class="step-title">Document 3: Statutory Joint Inspection Memorandum (JIM)</span>
    <p style="margin: 2px 0 0 24px; font-size: 8pt;">
      Executed on-site (or via live-video inspection) before viewing property grounds. Records attendee identities, passport/NIN numbers, and inspection timestamps, permanently barring the developer from bypassing Bethelmind.
    </p>
  </div>

  <div class="step-card">
    <span class="step-num">4</span> <span class="step-title">Document 4: Diaspora Buyer Retention & Exclusive Acquisition Mandate</span>
    <p style="margin: 2px 0 0 24px; font-size: 8pt;">
      Executed with diaspora investors, formally appointing Bethelmind and our retained counsel as their exclusive acquisition and due diligence advisors in Lagos.
    </p>
  </div>

  <div class="footer-note">Bethelmind Digital Solutions &bull; Privileged Legal Briefing &bull; Page 2 of 4</div>

  <!-- PAGE 3 -->
  <div class="page-break"></div>
  <div class="header-banner">
    <div class="brand-title">BETHELMIND DIGITAL SOLUTIONS</div>
    <div class="brand-sub">CAC Registered Enterprise: BN 9912717 &bull; Appointed Legal Counsel Briefing</div>
  </div>

  <h1 style="margin-top:0;">5. Step-by-Step Modus Operandi (5-Stage Deal Flow)</h1>

  <div class="step-card">
    <span class="step-num">A</span> <span class="step-title">Stage 1: Digital Intake & Pre-Qualification (Bethelmind)</span>
    <p style="margin: 2px 0 0 24px; font-size: 8pt;">
      Buyer is acquired through diaspora digital funnels, screened via sub-3s WhatsApp AI, and executes Document 4 (Diaspora Retention Mandate).
    </p>
  </div>

  <div class="step-card">
    <span class="step-num">B</span> <span class="step-title">Stage 2: Developer Co-Brokerage Gating (Bethelmind)</span>
    <p style="margin: 2px 0 0 24px; font-size: 8pt;">
      Bethelmind executes Document 2 with the developer, locking in the 80/20 commission split and 12-month non-circumvention covenants. Developer provides copy of root title documents.
    </p>
  </div>

  <div class="step-card">
    <span class="step-num">C</span> <span class="step-title">Stage 3: Legal Due Diligence & Alausa Search (YOUR CORE WORK)</span>
    <p style="margin: 2px 0 0 24px; font-size: 8pt;">
      Title documents are dispatched to your Chambers. <strong>You conduct an official search at the Lagos State Lands Bureau (Alausa)</strong> and issue an official Legal Search Report. If title is defective, the transaction is halted.
    </p>
  </div>

  <div class="step-card">
    <span class="step-num">D</span> <span class="step-title">Stage 4: Inspection & Contract Closing (Joint Execution)</span>
    <p style="margin: 2px 0 0 24px; font-size: 8pt;">
      Parties sign Document 3 (JIM) and inspect the property. Upon satisfaction, your Chambers drafts or vets the Contract of Sale and Deed of Assignment. Buyer deposits consideration into verified commercial escrow.
    </p>
  </div>

  <div class="step-card">
    <span class="step-num">E</span> <span class="step-title">Stage 5: Settlement & Automated Disbursement</span>
    <p style="margin: 2px 0 0 24px; font-size: 8pt;">
      Transaction closes. Bethelmind's origination fee is credited to our Moniepoint corporate account (6805375225). <strong>Bethelmind remits 20% of its cut directly to your Chambers within 24 banking hours.</strong>
    </p>
  </div>

  <h1>6. Financial Compensation: 20% Revenue Share Model</h1>
  <p>
    We align your firm directly with the success of our transactions. Under <strong>Document 1 (Lawyer Retainership Agreement)</strong>, you receive:
  </p>
  <ul style="margin: 0 0 6px 16px; font-size: 8.5pt;">
    <li><strong>20% of Bethelmind's Net Origination Commission</strong> on every closed transaction originated by our platform.</li>
    <li><strong>100% Full Reimbursement of Statutory Government Disbursements</strong> (Official search fees, registry receipt costs, and court affidavit stampings are billed directly to clients).</li>
  </ul>

  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th>Property Benchmark & Location</th>
          <th>Gross Property Value</th>
          <th>Standard 5% Commission</th>
          <th>Bethelmind 20% Co-Brokerage</th>
          <th class="gold-cell">Your 20% Legal Cut (Paid to You)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>4-Bed Semi-Detached Villa (Lekki / Chevron)</strong></td>
          <td>&#8358;120,000,000</td>
          <td>&#8358;6,000,000</td>
          <td>&#8358;1,200,000</td>
          <td class="gold-cell">&#8358;240,000</td>
        </tr>
        <tr>
          <td><strong>Fully Detached Smart Residence (Lekki Phase 1)</strong></td>
          <td>&#8358;280,000,000</td>
          <td>&#8358;14,000,000</td>
          <td>&#8358;2,800,000</td>
          <td class="gold-cell">&#8358;560,000</td>
        </tr>
        <tr>
          <td><strong>Waterfront Penthouse / Duplex (Ikoyi / VI)</strong></td>
          <td>&#8358;650,000,000</td>
          <td>&#8358;32,500,000</td>
          <td>&#8358;6,500,000</td>
          <td class="gold-cell">&#8358;1,300,000</td>
        </tr>
        <tr>
          <td><strong>Prime Commercial Acreage (Banana Island)</strong></td>
          <td>&#8358;1,500,000,000</td>
          <td>&#8358;75,000,000</td>
          <td>&#8358;15,000,000</td>
          <td class="gold-cell">&#8358;3,000,000</td>
        </tr>
      </tbody>
    </table>
  </div>
  <p style="font-size: 7.5pt; color: #64748b; margin-top: 3px;">
    *Note: In transactions where Bethelmind acts as exclusive sole buyer representative, Bethelmind’s commission ranges from 3% to 5% of gross value, significantly increasing your fee yield.*
  </p>

  <div class="footer-note">Bethelmind Digital Solutions &bull; Privileged Legal Briefing &bull; Page 3 of 4</div>

  <!-- PAGE 4 -->
  <div class="page-break"></div>
  <div class="header-banner">
    <div class="brand-title">BETHELMIND DIGITAL SOLUTIONS</div>
    <div class="brand-sub">CAC Registered Enterprise: BN 9912717 &bull; Appointed Legal Counsel Briefing</div>
  </div>

  <h1 style="margin-top:0;">7. Hard Questions & Reassurances for Counsel</h1>

  <div class="qa-box">
    <div class="qa-question">Q1: "Why 20% of Bethelmind's origination cut instead of billing hourly?"</div>
    <p style="margin: 0; font-size: 8pt;">
      Real estate clients and developers resist open-ended hourly retainers. By partnering on a 20% success share, your Chambers earns <strong>&#8358;240,000 to &#8358;3,000,000+ per closed transaction</strong> with zero marketing overhead. All actual Alausa registry disbursements are reimbursed 100% in advance.
    </p>
  </div>

  <div class="qa-box">
    <div class="qa-question">Q2: "What if an unscrupulous developer attempts to circumvent us after an introduction?"</div>
    <p style="margin: 0; font-size: 8pt;">
      Because every inspection requires a pre-signed Joint Inspection Memorandum (JIM) hashed under Section 84 of the Evidence Act 2011, we possess indisputable electronic proof of introduction. Your Chambers has immediate evidentiary grounds to issue statutory demand notices or file an injunction, securing our commission.
    </p>
  </div>

  <div class="qa-box">
    <div class="qa-question">Q3: "Is my Chambers' professional reputation at risk?"</div>
    <p style="margin: 0; font-size: 8pt;">
      Never. Bethelmind never asks counsel to approve questionable titles. You retain <strong>100% legal independence and veto authority</strong>. If your search reveals a defect, we walk away. Your role is that of the supreme guardian of title integrity.
    </p>
  </div>

  <h1>8. Statutory Compliance & 24/7 Cloud Stability</h1>
  <ul style="margin: 0 0 8px 16px; font-size: 8.5pt;">
    <li><strong>Evidence Act 2011, Section 84</strong>: Cryptographic SHA-256 hash certification, IP address capture, and electronic signatures on all mandates admissible in court.</li>
    <li><strong>LASRERA Law 2021</strong>: Full compliance with Lagos State co-brokerage and real estate practitioner guidelines.</li>
    <li><strong>SCUML / Money Laundering Act 2022</strong>: Mandatory KYC verification (NIN, BVN, Passport) and clean banking audit trails through CBN-licensed institutions.</li>
    <li><strong>24/7 Dedicated Cloud Infrastructure</strong>: Hosted on Contabo VPS with Evolution WhatsApp API and enterprise Hostinger business email pools for uninterrupted uptime.</li>
  </ul>

  <h1>9. Immediate Action Required to Formalize Today</h1>
  <ul class="checklist">
    <li>&#9633; <strong>Review the Master Legal Pack</strong> (Documents 1, 2, 3, and 4 already printed on your desk).</li>
    <li>&#9633; <strong>Complete Chambers Details on Document 1 (Page 5)</strong>: Firm Name, Lead Counsel SCN Number, Chambers Address, and Settlement Bank Account.</li>
    <li>&#9633; <strong>Sign & Affix NBA Seal on Document 1</strong>: Return one counterpart copy to Bethelmind.</li>
  </ul>
  <p style="font-size: 8pt; color: #475569; margin-top: 6px;">
    Once signed, our technical team will embed your Chambers' credentials into our live automated mandate portal (<code>bethelmindanalytics.com/mandate</code>) so that all future statutory certificates automatically issue under your official legal supervision.
  </p>

  <div style="margin-top: 16px; border-top: 1px solid #cbd5e1; padding-top: 10px; font-size: 8.5pt;">
    <strong>RESPECTFULLY SUBMITTED,</strong><br><br>
    <strong>DIRECTOR / FOUNDER</strong><br>
    Bethelmind Digital Solutions (CAC BN: 9912717)<br>
    Head Office: Lagos, Nigeria &bull; Desk: 0802 279 1227 &bull; Web: www.bethelmindanalytics.com<br>
    Settlement Clearing: Moniepoint Microfinance Bank (Corporate Acct: 6805375225)
  </div>

  <div class="footer-note">Bethelmind Digital Solutions &bull; Privileged Legal Briefing &bull; Page 4 of 4</div>

</body>
</html>`;

  const tempHtmlPath = path.join(__dirname, 'temp_lawyer_brief.html');
  fs.writeFileSync(tempHtmlPath, htmlContent, 'utf8');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('file:///' + tempHtmlPath.replace(/\\/g, '/'), { waitUntil: 'load' });
  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '0mm',
      bottom: '0mm',
      left: '0mm',
      right: '0mm'
    }
  });

  await browser.close();
  try { fs.unlinkSync(tempHtmlPath); } catch (e) {}

  console.log('SUCCESS! Institutional PDF successfully created at:', outputPath);
}

generateBriefPdf().catch(err => {
  console.error('Error generating PDF:', err);
  process.exit(1);
});
