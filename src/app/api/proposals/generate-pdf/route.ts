/**
 * @file src/app/api/proposals/generate-pdf/route.ts
 * 
 * 📄 PROGRAMMATIC BANKABLE EXECUTIVE PROPOSAL GENERATOR API
 * Bethelmind Analytics Lagos Desk (Plot 12 Commercial Corridor, VI)
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      businessName = 'Commercial Enterprise',
      category = 'Commercial SME',
      area = 'Lagos',
      leadId = 'lead_client',
      proposalType = 'DFY_TURNKEY_BUILD', // or 'ONE_LINE_EMBED'
      customAmountNGN = proposalType === 'ONE_LINE_EMBED' ? 45000 : 150000
    } = body;

    const depositAmountNGN = Math.round(customAmountNGN * 0.5);
    const balanceAmountNGN = customAmountNGN - depositAmountNGN;
    const invoiceRef = `BM-INV-${Date.now().toString().slice(-6)}`;
    const previewUrl = `https://www.bethelmindanalytics.com/preview/${leadId}`;

    const htmlProposal = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Commercial Proposal & SLA Agreement - ${businessName}</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #0f172a; margin: 0; padding: 40px; background: #fff; line-height: 1.6; }
    .header { display: flex; justify-content: space-between; border-bottom: 2px solid #0284c7; padding-bottom: 20px; margin-bottom: 30px; }
    .logo-text { font-size: 20px; font-weight: 800; color: #0284c7; text-transform: uppercase; letter-spacing: 1px; }
    .tagline { font-size: 11px; color: #64748b; margin-top: 4px; }
    .inv-details { text-align: right; font-size: 12px; color: #475569; }
    .client-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; margin-bottom: 25px; }
    .table { width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 13px; }
    .table th { background: #0284c7; color: #fff; text-align: left; padding: 10px 14px; font-weight: 700; }
    .table td { padding: 12px 14px; border-bottom: 1px solid #e2e8f0; }
    .total-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 18px; margin: 25px 0; }
    .bank-box { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 18px; margin: 25px 0; }
    .footer { border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 11px; color: #64748b; text-align: center; margin-top: 40px; }
    .btn { display: inline-block; background: #0284c7; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: 700; font-size: 13px; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo-text">⚡ Bethelmind Analytics Lagos Desk</div>
      <div class="tagline">Plot 12 Commercial Corridor, Victoria Island, Lagos · Desk Hotline: +234 802 279 1227</div>
    </div>
    <div class="inv-details">
      <div><strong>Invoice Ref:</strong> ${invoiceRef}</div>
      <div><strong>Date:</strong> ${new Date().toLocaleDateString('en-GB')}</div>
      <div><strong>Delivery SLA:</strong> 48-Hour Guarantee</div>
    </div>
  </div>

  <div class="client-box">
    <div style="font-size: 11px; font-weight: 700; color: #0284c7; text-transform: uppercase; margin-bottom: 6px;">Client Organization</div>
    <div style="font-size: 16px; font-weight: 800; color: #0f172a;">${businessName}</div>
    <div style="font-size: 13px; color: #475569;">Sector: ${category} · Territory: ${area}, Lagos</div>
    <div style="margin-top: 8px; font-size: 12px;"><a href="${previewUrl}" class="btn" style="padding: 6px 12px; font-size: 11px;">👉 View Live Staged Prototype Online</a></div>
  </div>

  <h3 style="font-size: 15px; color: #0f172a; margin-bottom: 10px;">Deliverables & Scope of Automation</h3>
  <table class="table">
    <thead>
      <tr>
        <th>Item Description</th>
        <th>SLA Delivery</th>
        <th style="text-align: right;">Amount (NGN)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <strong>1. 24/7 AI WhatsApp Sales & Quoting Assistant</strong><br>
          <span style="font-size: 11px; color: #64748b;">Sub-3-second conversational Nigerian-tone quoting, automated PDF quote generation, and objection handling.</span>
        </td>
        <td>24 Hours</td>
        <td style="text-align: right;">Included</td>
      </tr>
      <tr>
        <td>
          <strong>2. Specialized Sector Lead Tools (${category})</strong><br>
          <span style="font-size: 11px; color: #64748b;">Pre-installed load sizer / duty estimator / appointment booking & diesel savings calculator.</span>
        </td>
        <td>Instant</td>
        <td style="text-align: right;">Included</td>
      </tr>
      <tr>
        <td>
          <strong>3. Complete Turnkey DFY Website Deployment</strong><br>
          <span style="font-size: 11px; color: #64748b;">Ultra-fast Next.js edge deployment on Vercel, .com.ng commercial domain setup, and Google Maps SEO discovery.</span>
        </td>
        <td>48 Hours</td>
        <td style="text-align: right;">₦${customAmountNGN.toLocaleString()}</td>
      </tr>
    </tbody>
  </table>

  <div class="total-box">
    <table style="width: 100%; font-size: 14px;">
      <tr>
        <td><strong>Total Commercial Value:</strong></td>
        <td style="text-align: right; font-weight: 800;">₦${customAmountNGN.toLocaleString()}</td>
      </tr>
      <tr>
        <td><strong>50% Initial Setup Deposit (Due Today):</strong></td>
        <td style="text-align: right; font-weight: 800; color: #16a34a;">₦${depositAmountNGN.toLocaleString()}</td>
      </tr>
      <tr>
        <td><strong>50% Final Milestone Balance (Upon 48-Hour Handover):</strong></td>
        <td style="text-align: right; font-weight: 800; color: #475569;">₦${balanceAmountNGN.toLocaleString()}</td>
      </tr>
    </table>
  </div>

  <div class="bank-box">
    <div style="font-size: 11px; font-weight: 700; color: #1e40af; text-transform: uppercase; margin-bottom: 8px;">Official Direct Bank Settlement Instructions</div>
    <div style="font-size: 13px; line-height: 1.8;">
      • <strong>Bank Name:</strong> OPay Digital Services<br>
      • <strong>Account Number:</strong> <strong>7034297995</strong><br>
      • <strong>Account Name:</strong> Oyelakin Tosin Matthew<br>
      • <strong>Payment Narration / Reference:</strong> ${invoiceRef} - ${businessName.slice(0, 15)}
    </div>
  </div>

  <div class="footer">
    Bethelmind Analytics Lagos Desk · 24/7 Closer Hotline: +234 802 279 1227 · Email: tosin@bethelmindanalytics.com<br>
    <em>All payments clear directly to verified Nigerian Bank settlement. 100% money-back SLA guarantee.</em>
  </div>
</body>
</html>`;

    return new NextResponse(htmlProposal, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `inline; filename="Proposal_${businessName.replace(/[^a-zA-Z0-9]/g, '_')}.html"`
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
