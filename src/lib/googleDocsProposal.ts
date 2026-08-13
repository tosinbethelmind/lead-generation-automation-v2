/**
 * @file googleDocsProposal.ts
 * Google Docs & Executive Proposal PDF Generator (100% Free)
 * Auto-generates branded client proposals, site redesign agreements, and payment invoices for leads.
 */

export interface LeadProposalParams {
  leadName: string;
  businessName: string;
  category?: string;
  phone?: string;
  email?: string;
  proposedServices?: string[];
  claimFeeNGN?: number;
  paymentAccountName?: string;
  paymentBankName?: string;
  paymentAccountNumber?: string;
}

export interface ProposalDocumentResult {
  proposalId: string;
  title: string;
  htmlContent: string;
  downloadFilename: string;
  summaryText: string;
  generatedAt: string;
}

export function generateLeadProposalDocument(params: LeadProposalParams): ProposalDocumentResult {
  const {
    leadName,
    businessName,
    category = 'Commercial Business',
    phone = 'Not provided',
    email = 'Not provided',
    proposedServices = [
      'High-Speed Mobile Website Redesign (Sub-1.5s Load Time)',
      'Automated WhatsApp & Live Chat Lead Intake Bot',
      'Google Maps Local SEO Top-Rank Optimization',
      'Continuous SSL Security & 24/7 Hosting Setup'
    ],
    claimFeeNGN = 185000,
    paymentAccountName = 'Oyelakin Tosin Matthew',
    paymentBankName = 'Moniepoint Microfinance Bank / OPay',
    paymentAccountNumber = '7034297995'
  } = params;

  const proposalId = `PROP_${Date.now().toString().slice(-6)}`;
  const title = `Official Business Growth Proposal & Web Activation - ${businessName}`;
  const generatedAt = new Date().toLocaleDateString('en-NG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const formattedFee = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(claimFeeNGN);

  const servicesHtml = proposedServices
    .map(s => `<li style="margin-bottom: 8px; font-size: 15px; color: #334155;">✔️ <strong>${s}</strong></li>`)
    .join('');

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    body { font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #0f172a; padding: 40px; margin: 0; }
    .container { max-width: 800px; margin: 0 auto; background: #ffffff; padding: 48px; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
    .header { border-bottom: 2px solid #2563eb; padding-bottom: 24px; margin-bottom: 32px; display: flex; justify-content: space-between; align-items: center; }
    .logo { font-size: 24px; font-weight: 800; color: #1e3a8a; letter-spacing: -0.5px; }
    .badge { background: #dbeafe; color: #1e40af; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 600; }
    h1 { font-size: 26px; color: #0f172a; margin-bottom: 12px; }
    .meta { color: #64748b; font-size: 14px; margin-bottom: 28px; }
    .box { background: #f1f5f9; border-left: 4px solid #2563eb; padding: 20px; border-radius: 6px; margin: 24px 0; }
    .fee-box { background: #eff6ff; border: 1px solid #bfdbfe; padding: 24px; border-radius: 8px; margin-top: 32px; }
    .fee-amount { font-size: 32px; font-weight: 800; color: #1d4ed8; }
    .btn { display: inline-block; background: #16a34a; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 700; font-size: 16px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">BETHELMIND ANALYTICS</div>
      <div class="badge">Ref: ${proposalId}</div>
    </div>

    <h1>Digital Growth & Web Activation Proposal</h1>
    <div class="meta">Prepared for <strong>${businessName}</strong> (${leadName}) | Date: ${generatedAt}</div>

    <div class="box">
      <h3 style="margin-top:0; color:#1e293b;">Executive Summary</h3>
      <p style="margin:0; line-height:1.6; color:#334155;">
        This proposal outlines the deployment of a high-converting, mobile-optimized digital infrastructure for <strong>${businessName}</strong>. 
        Designed to capture local customer inquiries across Lagos & Nigeria via integrated automated WhatsApp channels.
      </p>
    </div>

    <h3>Included Deliverables & Scope</h3>
    <ul style="list-style: none; padding-left: 0;">
      ${servicesHtml}
    </ul>

    <div class="fee-box">
      <div style="font-size: 14px; color: #1e40af; font-weight: 600; text-transform: uppercase;">Total Turnkey Setup Investment</div>
      <div class="fee-amount">${formattedFee}</div>
      <p style="margin: 8px 0 0 0; font-size: 13px; color: #475569;">Includes design, copywriting, domain integration & WhatsApp automation dispatch setup.</p>
      
      <div style="margin-top: 20px; border-top: 1px solid #cbd5e1; padding-top: 16px; font-size: 14px; color: #334155;">
        <strong>Direct Transfer Details:</strong><br>
        Bank: <strong>${paymentBankName}</strong><br>
        Account Number: <strong>${paymentAccountNumber}</strong><br>
        Account Name: <strong>${paymentAccountName}</strong>
      </div>
    </div>

    <div style="margin-top: 40px; text-align: center; color: #64748b; font-size: 13px;">
      Bethelmind Analytics & Strategy &bull; Lagos, Nigeria &bull; Verified Digital Partner
    </div>
  </div>
</body>
</html>`;

  const summaryText = `📄 *Official Digital Growth Proposal:*

Client: *${businessName}* (${leadName})
Ref: *${proposalId}*
Investment: *${formattedFee}*

Deliverables include Full Mobile Redesign, WhatsApp Lead Bot, and Local SEO Setup.`;

  return {
    proposalId,
    title,
    htmlContent,
    downloadFilename: `Proposal_${businessName.replace(/\s+/g, '_')}_${proposalId}.html`,
    summaryText,
    generatedAt
  };
}
