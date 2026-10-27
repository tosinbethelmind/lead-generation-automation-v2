'use client';

import React, { useState } from 'react';
import { FileText, Printer, X, ShieldCheck, CheckCircle2 } from 'lucide-react';

export interface ExecutivePdfQuoteModalProps {
  businessName: string;
  category?: string;
  location?: string;
  toolType?: string;
  claimFeeNgn?: number;
  depositFeeNgn?: number;
  adminPhone?: string;
}

export function ExecutivePdfQuoteModal({
  businessName,
  category = 'Commercial Enterprise',
  location = 'Lagos, Nigeria',
  toolType = 'Solar Hybrid & Energy Quoting Suite',
  claimFeeNgn = 65000,
  depositFeeNgn = 35000,
  adminPhone = '2348022791227',
}: ExecutivePdfQuoteModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const normalAgencyPrice = claimFeeNgn * 2;
  const balanceFeeNgn = Math.max(0, claimFeeNgn - depositFeeNgn);

  const handleOpenPreview = () => {
    setIsOpen(true);
  };

  const handlePrint = () => {
    const iframe = document.getElementById('pdf-quote-iframe') as HTMLIFrameElement;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    }
  };

  const quoteRef = `BM-PROP-${businessName.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8).toUpperCase()}`;

  const cleanAdminPhone = (adminPhone || '2348022791227').replace(/[^0-9]/g, '');
  const safeAdminPhone = cleanAdminPhone.startsWith('0') 
    ? '234' + cleanAdminPhone.substring(1) 
    : (!cleanAdminPhone.startsWith('234') && cleanAdminPhone.length === 10 ? '234' + cleanAdminPhone : cleanAdminPhone || '2348022791227');

  const directWhatsAppUrl = `https://wa.me/${safeAdminPhone}?text=${encodeURIComponent(
    `Hello Bethelmind Lagos Desk! I just generated the Official Commercial Specification for *${businessName}* [Ref: ${quoteRef}]. We want to activate our dedicated deployment with the ₦${depositFeeNgn.toLocaleString()} deposit (Total Package: ₦${claimFeeNgn.toLocaleString()}).`
  )}`;

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={handleOpenPreview}
        className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-[#d4af37] border border-[#d4af37]/35 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
      >
        <FileText className="w-4 h-4 text-[#d4af37]" />
        <span>Download Official Bankable Proposal (PDF)</span>
      </button>

      {/* Modal Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-xl">
                  <FileText className="w-5 h-5 text-[#d4af37]" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    <span>Executive Commercial Proposal & Specification</span>
                    <span className="hidden sm:inline-block px-2 py-0.5 bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30 rounded-full text-[10px] uppercase font-mono">
                      Ref: {quoteRef}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Prepared for {businessName} &bull; 48-Hour Deployment Guarantee
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-bold transition-all shadow"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save PDF</span>
                </button>
                <a
                  href={directWhatsAppUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow"
                >
                  <span>WhatsApp Desk →</span>
                </a>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-all"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content: Embedded Proposal Preview */}
            <div className="flex-1 bg-slate-950 p-2 sm:p-4 overflow-hidden relative">
              <iframe
                id="pdf-quote-iframe"
                srcDoc={`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Commercial Specification - ${quoteRef}</title>
  <style>
    body { font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #ffffff; color: #0f172a; margin: 0; padding: 28px; line-height: 1.45; }
    .header { border-bottom: 2px solid #0f172a; padding-bottom: 14px; display: flex; justify-content: space-between; align-items: flex-start; }
    .badge { display: inline-block; padding: 3px 8px; background: #f1f5f9; color: #334155; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 10px; font-weight: 700; margin-top: 5px; text-transform: uppercase; letter-spacing: 0.05em; }
    .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin: 16px 0; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    th { background: #0f172a; color: #ffffff; text-align: left; padding: 8px 12px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; }
    td { padding: 9px 12px; border-bottom: 1px solid #e2e8f0; font-size: 12px; }
    .pricing { display: flex; gap: 14px; margin: 16px 0; }
    .price-box { flex: 1; border: 1px solid #cbd5e1; border-radius: 8px; padding: 14px; }
    .price-box.primary { border-color: #0f172a; background: #fafafa; }
    .bank { background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 12px 14px; font-size: 12px; margin-top: 14px; }
    .disclaimer { margin-top: 16px; padding: 12px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 9.5px; color: #475569; line-height: 1.45; }
    .footer { margin-top: 14px; font-size: 10px; color: #64748b; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 8px; }
    @media print { .no-print { display: none; } body { padding: 0; } }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h2 style="margin:0; font-size:18px; font-weight:900; letter-spacing:-0.02em;">Bethelmind Digital Solutions</h2>
      <div style="font-size:10.5px; color:#475569; font-weight:700; margin-top:2px;">ENTERPRISE AUTOMATION & SECTOR COMMERCIAL BLUEPRINTS</div>
      <div style="font-size:10px; color:#64748b;">CAC Certified Business Enterprise &bull; CAC Reg: 9912717 &bull; Lagos, Nigeria</div>
      <div class="badge">Official Technical & Commercial Specification</div>
    </div>
    <div style="text-align:right; font-size:11px; color:#475569;">
      <div>Ref: <strong style="font-family:monospace; color:#0f172a;">${quoteRef}</strong></div>
      <div>Date: <strong>${new Date().toLocaleDateString('en-GB')}</strong></div>
      <div>Direct Desk: <strong>+${adminPhone}</strong></div>
    </div>
  </div>

  <div class="card" style="display:flex; justify-content:space-between; align-items:center;">
    <div>
      <div style="font-size:10px; color:#64748b; font-weight:700; text-transform:uppercase;">Prepared Exclusively For:</div>
      <div style="font-size:16px; font-weight:900; color:#0f172a;">${businessName}</div>
      <div style="font-size:12px; color:#475569;">${category} &bull; ${location}</div>
    </div>
    <div style="text-align:right;">
      <div style="font-size:10px; color:#64748b; font-weight:700; text-transform:uppercase;">Module Architecture:</div>
      <div style="font-size:13.5px; font-weight:800; color:#0f172a;">${toolType}</div>
      <div style="font-size:11px; color:#059669; font-weight:700;">&bull; 48-Hour Handover SLA</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Specification Deliverable</th>
        <th>Architecture Details</th>
        <th style="text-align:right;">SLA</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>24/7 AI WhatsApp Closer</strong></td>
        <td>Automated quoting, FAQ resolution, and live customer phone capture</td>
        <td style="text-align:right; font-family:monospace;">&lt; 3 Seconds</td>
      </tr>
      <tr>
        <td><strong>Interactive Sector Lead Tool</strong></td>
        <td>${toolType} with dynamic calculations and WhatsApp quote export</td>
        <td style="text-align:right; font-family:monospace;">Active</td>
      </tr>
      <tr>
        <td><strong>Production Mobile Deployment</strong></td>
        <td>Dedicated custom domain, SSL, Cloudflare CDN, and Google Maps SEO profile</td>
        <td style="text-align:right; font-family:monospace;">48 Hours</td>
      </tr>
      <tr>
        <td><strong>Reconciliation Gateway</strong></td>
        <td>Moniepoint Virtual Account transfer verification & Paystack checkout</td>
        <td style="text-align:right; font-family:monospace;">Pre-Wired</td>
      </tr>
    </tbody>
  </table>

  <div class="pricing">
    <div class="price-box primary">
      <div style="font-size:10px; font-weight:700; color:#475569; text-transform:uppercase;">Starter Milestone Deposit</div>
      <div style="font-size:22px; font-weight:900; color:#0f172a; font-family:monospace;">₦${depositFeeNgn.toLocaleString()}</div>
      <div style="font-size:10px; color:#475569;">Activates domain registration, staging environment, and 48-hour development queue</div>
    </div>
    <div class="price-box">
      <div style="font-size:10px; font-weight:700; color:#64748b; text-transform:uppercase;">Total Turnkey Investment</div>
      <div style="font-size:22px; font-weight:900; color:#0f172a; font-family:monospace;">₦${claimFeeNgn.toLocaleString()}</div>
      <div style="font-size:10px; color:#475569;">Remaining balance (₦${balanceFeeNgn.toLocaleString()}) payable strictly after live mobile inspection and approval</div>
    </div>
  </div>

  <div class="bank">
    <div style="font-size:11px; font-weight:700; color:#065f46; text-transform:uppercase;">Official Corporate Settlement Channel (NIP Direct Transfer):</div>
    <div style="display:flex; justify-content:space-between; margin-top:5px; flex-wrap:wrap; gap:8px;">
      <div>Bank: <strong>Moniepoint Microfinance Bank</strong></div>
      <div>Account No: <strong style="font-size:15px; color:#047857; font-family:monospace;">6805375225</strong></div>
      <div>Beneficiary: <strong>Bethelmind Digital Solutions</strong></div>
    </div>
  </div>

  <div class="disclaimer">
    <strong>STATUTORY & LEGAL DISCLAIMER:</strong> This technical specification and cost estimate is an automated preliminary commercial proposal generated by Bethelmind Digital Solutions (CAC Reg: 9912717) for scoping and budgeting purposes only. It does not constitute a certified COREN engineering blueprint, statutory customs tariff declaration, medical diagnosis, or registered legal survey. Final deliverables, milestone releases, and operational handovers are governed by the Bethelmind Sector Tools Disclaimer, Terms of Service, and Commercial Delivery SLA (accessible at https://www.bethelmindanalytics.com/legal/disclaimer).
  </div>

  <div class="footer">
    Bethelmind Digital Solutions &bull; CAC Reg: 9912717 &bull; Plot 12, Commercial Corridor, Lagos &bull; WhatsApp/Call: +${adminPhone}
  </div>
</body>
</html>`}
                className="w-full h-[55vh] sm:h-[65vh] rounded-xl border border-slate-700 bg-white"
                title="Proposal Document Preview"
              />
            </div>

            {/* Modal Footer with Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3 border-t border-slate-800 bg-slate-950 text-xs">
              <div className="flex items-center gap-2 text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% Guaranteed 48-Hour SLA Handover &bull; Pay Balance After Live Approval</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handlePrint}
                  className="flex-1 sm:flex-none px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save PDF</span>
                </button>
                <a
                  href={directWhatsAppUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 sm:flex-none px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl font-black flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-500/20"
                >
                  <span>WhatsApp Verification (Moniepoint ₦{depositFeeNgn.toLocaleString()}) →</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ExecutivePdfQuoteModal;
