import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      businessName = 'Valued Commercial Client',
      category = 'Commercial Enterprise',
      location = 'Lagos, Nigeria',
      toolType = 'Solar Hybrid & Energy BOQ',
      specs = {},
      claimFeeNgn = 150000,
      depositFeeNgn = 75000,
      adminPhone = '2348022791227',
      accountNumber = '7034297995',
      bankName = 'OPay Digital Services',
      accountName = 'Oyelakin Tosin Matthew',
    } = body;

    const quoteRef = `BM-EST-${Math.floor(100000 + Math.random() * 900000)}`;
    const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Official Proposal & Specification — ${businessName}</title>
  <style>
    @page { size: A4; margin: 16mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: #ffffff; color: #0f172a; line-height: 1.5; padding: 24px; }
    .header-table { width: 100%; border-bottom: 2px solid #0284c7; padding-bottom: 16px; margin-bottom: 24px; }
    .title-cell { vertical-align: top; }
    .brand-title { font-size: 20px; font-weight: 900; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px; }
    .brand-sub { font-size: 11px; color: #0284c7; font-weight: 700; text-transform: uppercase; margin-top: 2px; }
    .badge { display: inline-block; padding: 4px 10px; background: #e0f2fe; color: #0369a1; border-radius: 9999px; font-size: 11px; font-weight: 800; text-transform: uppercase; margin-top: 6px; }
    .meta-cell { text-align: right; vertical-align: top; font-size: 12px; color: #475569; }
    .meta-highlight { font-weight: 700; color: #0f172a; font-family: monospace; }

    .client-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin-bottom: 20px; display: flex; justify-content: space-between; }
    .client-col { width: 48%; }
    .section-label { font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
    .client-name { font-size: 16px; font-weight: 800; color: #0f172a; }
    .client-detail { font-size: 12px; color: #475569; }

    .spec-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    .spec-table th { background: #0f172a; color: #ffffff; text-align: left; padding: 10px 12px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }
    .spec-table td { padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 12px; color: #334155; }
    .spec-table tr:nth-child(even) { background: #f8fafc; }
    .spec-table .num-col { text-align: right; font-family: monospace; font-weight: 700; }

    .pricing-grid { display: flex; justify-content: space-between; margin-bottom: 24px; gap: 16px; }
    .pricing-card { flex: 1; border: 1px solid #cbd5e1; border-radius: 8px; padding: 14px; background: #ffffff; }
    .pricing-card.primary { border-color: #0284c7; background: #f0f9ff; }
    .pricing-label { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b; }
    .pricing-value { font-size: 22px; font-weight: 900; color: #0284c7; margin: 4px 0; font-family: monospace; }
    .pricing-sub { font-size: 11px; color: #475569; }

    .settlement-card { background: #ecfdf5; border: 1px solid #6ee7b7; border-radius: 8px; padding: 14px; margin-bottom: 24px; }
    .settlement-title { font-size: 12px; font-weight: 800; color: #065f46; text-transform: uppercase; margin-bottom: 6px; }
    .settlement-grid { display: flex; justify-content: space-between; font-size: 12px; color: #064e3b; }
    .settlement-val { font-weight: 800; font-family: monospace; font-size: 14px; }

    .sla-banner { background: #f1f5f9; border-left: 4px solid #0284c7; padding: 10px 14px; font-size: 11px; color: #334155; margin-bottom: 20px; }
    .footer { text-align: center; border-top: 1px solid #e2e8f0; padding-top: 14px; font-size: 10px; color: #64748b; }
    @media print {
      body { padding: 0; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="margin-bottom: 16px; text-align: right;">
    <button onclick="window.print()" style="padding: 10px 20px; background: #0284c7; color: #fff; font-weight: bold; border: none; border-radius: 6px; cursor: pointer; font-size: 13px;">
      🖨️ Print / Save as PDF
    </button>
  </div>

  <table class="header-table">
    <tr>
      <td class="title-cell">
        <div class="brand-title">Bethelmind Analytics Lagos Desk</div>
        <div class="brand-sub">Commercial Systems & Automated Lead Architectures</div>
        <div class="badge">Official Technical & Commercial Proposal</div>
      </td>
      <td class="meta-cell">
        <div>Ref: <span class="meta-highlight">${quoteRef}</span></div>
        <div>Date: <span>${dateStr}</span></div>
        <div>Validity: <span>48 Hours Guaranteed</span></div>
        <div>Desk Phone: <span class="meta-highlight">+${adminPhone}</span></div>
      </td>
    </tr>
  </table>

  <div class="client-card">
    <div class="client-col">
      <div class="section-label">Prepared Exclusively For:</div>
      <div class="client-name">${businessName}</div>
      <div class="client-detail">${category} • ${location}</div>
    </div>
    <div class="client-col" style="text-align: right;">
      <div class="section-label">Solution Architecture:</div>
      <div class="client-name" style="font-size: 14px; color: #0284c7;">${toolType}</div>
      <div class="client-detail">Zero Downtime &bull; Vercel Production Staging</div>
    </div>
  </div>

  <table class="spec-table">
    <thead>
      <tr>
        <th>Specification Deliverable</th>
        <th>Configuration Details</th>
        <th class="num-col">Execution SLA</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>24/7 AI WhatsApp Sales Assistant</strong></td>
        <td>Automated instant quoter, Nigerian accent audio generator, and direct catalog lookup</td>
        <td class="num-col">&lt; 3 Seconds</td>
      </tr>
      <tr>
        <td><strong>Custom Sector Lead Tool Engine</strong></td>
        <td>${toolType} with interactive customer calculator and instant quote generator</td>
        <td class="num-col">Installed</td>
      </tr>
      <tr>
        <td><strong>Done-For-You Commercial Deployment</strong></td>
        <td>Custom .com.ng domain, SSL Certificate, SEO indexation, and Google Maps discovery</td>
        <td class="num-col">48 Hours</td>
      </tr>
      <tr>
        <td><strong>Direct Bank Settlement Integration</strong></td>
        <td>Automated Paystack Checkout & Moniepoint Instant Virtual Account Transfer Verification</td>
        <td class="num-col">Pre-Wired</td>
      </tr>
    </tbody>
  </table>

  <div class="pricing-grid">
    <div class="pricing-card primary">
      <div class="pricing-label">50% Milestone Activation Deposit</div>
      <div class="pricing-value">₦${depositFeeNgn.toLocaleString()}</div>
      <div class="pricing-sub">Triggers instant domain registration, cloud build, and 48-hr deployment guarantee</div>
    </div>
    <div class="pricing-card">
      <div class="pricing-label">Total Commercial Project Value</div>
      <div class="pricing-value" style="color: #0f172a;">₦${claimFeeNgn.toLocaleString()}</div>
      <div class="pricing-sub">Remaining balance paid only upon successful production launch and verification</div>
    </div>
  </div>

  <div class="settlement-card">
    <div class="settlement-title">Official Payout & Settlement Channel (Direct NIP Transfer)</div>
    <div class="settlement-grid">
      <div>Bank: <span class="settlement-val">${bankName}</span></div>
      <div>Account No: <span class="settlement-val" style="font-size: 16px; color: #047857;">${accountNumber}</span></div>
      <div>Beneficiary: <span class="settlement-val">${accountName}</span></div>
    </div>
  </div>

  <div class="sla-banner">
    <strong>🛡️ 100% Zero-Risk Handover Guarantee:</strong> Bethelmind Analytics Lagos Desk guarantees delivery of the full system within 48 hours of initial activation. If our desk fails to hit the SLA, the deposit is 100% refundable without friction.
  </div>

  <div class="footer">
    Bethelmind Analytics Lagos Commercial Desk • Hotline: +${adminPhone} • Generated for ${businessName} [Ref: ${quoteRef}]
  </div>
</body>
</html>`;

    return new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to generate PDF quote' }, { status: 500 });
  }
}
