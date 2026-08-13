/**
 * @file pdfProposalGenerator.ts
 * Executive PDF Audit & Invoice Generator
 * Generates formatted 2-page Corporate Proposal & Invoice PDFs containing PageSpeed metrics, Relume UI scope of work, and Moniepoint/OPay payment instructions.
 */

export interface PDFProposalParams {
  leadName: string;
  businessName: string;
  category?: string;
  phone?: string;
  email?: string;
  website?: string;
  speedScore?: number;
  claimFeeNGN?: number;
}

export interface PDFProposalResult {
  proposalId: string;
  title: string;
  pdfHtml: string;
  downloadFilename: string;
  whatsappMessageText: string;
}

export function generateExecutivePDFProposal(params: PDFProposalParams): PDFProposalResult {
  const {
    leadName,
    businessName,
    category = 'Commercial Business',
    phone = '',
    email = '',
    website = '',
    speedScore = 42,
    claimFeeNGN = 185000
  } = params;

  const proposalId = `PDF_PROP_${Date.now().toString().slice(-6)}`;
  const title = `Executive Digital Audit & Redesign Invoice - ${businessName}`;
  const formattedFee = `₦${claimFeeNGN.toLocaleString()}`;

  const pdfHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background: #ffffff; color: #1e293b; padding: 40px; margin: 0; }
    .page { max-width: 800px; margin: 0 auto; border: 1px solid #cbd5e1; padding: 48px; border-radius: 8px; }
    .header { border-bottom: 2px solid #2563eb; padding-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
    .logo { font-size: 22px; font-weight: 800; color: #1e3a8a; }
    .ref { font-size: 13px; font-weight: 700; color: #2563eb; background: #eff6ff; padding: 4px 12px; border-radius: 12px; }
    .audit-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 24px 0; background: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; }
    .score-badge { font-size: 28px; font-weight: 800; color: #dc2626; }
    .deliverables { margin: 24px 0; }
    .deliverable-item { margin-bottom: 10px; font-size: 14px; color: #334155; }
    .invoice-box { background: #f1f5f9; border-left: 4px solid #16a34a; padding: 20px; margin-top: 24px; border-radius: 4px; }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div class="logo">BETHELMIND ANALYTICS & STRATEGY</div>
      <div class="ref">${proposalId}</div>
    </div>

    <h2 style="color: #0f172a; margin-top: 24px;">Executive Business Growth Proposal</h2>
    <div style="font-size: 13px; color: #64748b;">Prepared for: <strong>${businessName}</strong> (${leadName}) | Date: ${new Date().toLocaleDateString()}</div>

    <div class="audit-grid">
      <div>
        <div style="font-size: 12px; color: #64748b; font-weight: 700; text-transform: uppercase;">Google Mobile Speed Audit</div>
        <div class="score-badge">${speedScore}/100</div>
        <div style="font-size: 12px; color: #475569; margin-top: 4px;">Loss Rate: ~40% Mobile Visitors</div>
      </div>
      <div>
        <div style="font-size: 12px; color: #64748b; font-weight: 700; text-transform: uppercase;">Target Performance</div>
        <div style="font-size: 28px; font-weight: 800; color: #16a34a;">98/100</div>
        <div style="font-size: 12px; color: #475569; margin-top: 4px;">Sub-1.5s Load Time Guaranteed</div>
      </div>
    </div>

    <h3>Included Turnkey Scope of Work</h3>
    <div class="deliverables">
      <div class="deliverable-item">✔️ <strong>Relume UI Glassmorphic Mobile Redesign:</strong> Ultra-fast responsive site architecture.</div>
      <div class="deliverable-item">✔️ <strong>WhatsApp AI Lead Intake Bot:</strong> 24/7 automated inquiry qualification & call scheduling.</div>
      <div class="deliverable-item">✔️ <strong>Google Maps Top-Rank Local SEO:</strong> Enhanced Lagos business visibility.</div>
      <div class="deliverable-item">✔️ <strong>Moniepoint & Paystack Payment Checkout:</strong> Instant NUBAN bank transfer verification.</div>
    </div>

    <div class="invoice-box">
      <div style="font-size: 12px; color: #16a34a; font-weight: 800; text-transform: uppercase;">Turnkey Investment Total</div>
      <div style="font-size: 32px; font-weight: 800; color: #15803d; margin: 4px 0;">${formattedFee}</div>
      <div style="font-size: 13px; color: #334155; margin-top: 12px;">
        <strong>Bank Transfer Instructions:</strong><br>
        Bank: <strong>Moniepoint Microfinance Bank / OPay</strong><br>
        Account Number: <strong>7034297995</strong><br>
        Account Name: <strong>Oyelakin Tosin Matthew</strong>
      </div>
    </div>
  </div>
</body>
</html>`;

  const whatsappMessageText = `📄 *Executive Growth Proposal & Invoice:*

Client: *${businessName}* (${leadName})
Ref: *${proposalId}*
Mobile Audit Score: *${speedScore}/100*
Total Investment: *${formattedFee}*

👉 *View & Download PDF Proposal:*
https://www.bethelmindanalytics.com/proposal/${proposalId}`;

  return {
    proposalId,
    title,
    pdfHtml,
    downloadFilename: `Executive_Proposal_${businessName.replace(/\s+/g, '_')}_${proposalId}.pdf`,
    whatsappMessageText
  };
}
