'use client';

import React, { useState } from 'react';
import { FileText, Printer, X, Download, Share2, ShieldCheck, CheckCircle2 } from 'lucide-react';

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
  claimFeeNgn = 150000,
  depositFeeNgn = 75000,
  adminPhone = '2348022791227',
}: ExecutivePdfQuoteModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const payload = {
    businessName,
    category,
    location,
    toolType,
    claimFeeNgn,
    depositFeeNgn,
    adminPhone,
    accountNumber: '7034297995',
    bankName: 'OPay Digital Services',
    accountName: 'Oyelakin Tosin Matthew',
  };

  const cleanAdminPhone = (adminPhone || '2348022791227').replace(/[^0-9]/g, '');
  const safeAdminPhone = cleanAdminPhone.startsWith('0') 
    ? '234' + cleanAdminPhone.substring(1) 
    : (!cleanAdminPhone.startsWith('234') && cleanAdminPhone.length === 10 ? '234' + cleanAdminPhone : cleanAdminPhone || '2348022791227');

  const directWhatsAppUrl = `https://wa.me/${safeAdminPhone}?text=${encodeURIComponent(
    `Hello Bethelmind Lagos Desk! I just generated the Official Technical Proposal for *${businessName}* [Ref: ${quoteRef}]. We want to activate the ₦${depositFeeNgn.toLocaleString()} deposit for deployment.`
  )}`;

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={handleOpenPreview}
        className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-sky-400 hover:text-sky-300 border border-sky-500/30 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
      >
        <FileText className="w-4 h-4 text-sky-400" />
        <span>📄 Download Official Bankable Proposal (PDF)</span>
      </button>

      {/* Modal Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-sky-500/10 border border-sky-500/20 rounded-xl">
                  <FileText className="w-5 h-5 text-sky-400" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    <span>Executive Commercial Proposal & Specification</span>
                    <span className="hidden sm:inline-block px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[10px] uppercase font-mono">
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
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold transition-all shadow"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save PDF</span>
                </button>
                <a
                  href={directWhatsAppUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow"
                >
                  <span>WhatsApp Desk →</span>
                </a>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-all"
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
<html>
<head>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background: #fff; color: #0f172a; margin: 0; padding: 24px; }
    .header { border-bottom: 2px solid #0284c7; padding-bottom: 12px; display: flex; justify-content: space-between; }
    .badge { display: inline-block; padding: 3px 8px; background: #e0f2fe; color: #0369a1; border-radius: 9999px; font-size: 11px; font-weight: bold; margin-top: 4px; }
    .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin: 16px 0; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    th { background: #0f172a; color: #fff; text-align: left; padding: 8px 10px; font-size: 11px; }
    td { padding: 8px 10px; border-bottom: 1px solid #e2e8f0; font-size: 12px; }
    .pricing { display: flex; gap: 12px; margin: 16px 0; }
    .price-box { flex: 1; border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px; }
    .price-box.primary { border-color: #0284c7; background: #f0f9ff; }
    .bank { background: #ecfdf5; border: 1px solid #6ee7b7; border-radius: 8px; padding: 12px; font-size: 12px; margin-top: 14px; }
    @media print { .no-print { display: none; } body { padding: 0; } }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h2 style="margin:0; font-size:18px; font-weight:900;">BETHELMIND ANALYTICS LAGOS DESK</h2>
      <div style="font-size:11px; color:#0284c7; font-weight:bold;">COMMERCIAL SYSTEMS & LEAD AUTOMATION</div>
      <div class="badge">OFFICIAL TECHNICAL & COMMERCIAL SPECIFICATION</div>
    </div>
    <div style="text-align:right; font-size:11px; color:#475569;">
      <div>Ref: <strong>${quoteRef}</strong></div>
      <div>Date: ${new Date().toLocaleDateString('en-GB')}</div>
      <div>Desk: <strong>+${adminPhone}</strong></div>
    </div>
  </div>

  <div class="card" style="display:flex; justify-content:space-between;">
    <div>
      <div style="font-size:10px; color:#64748b; font-weight:bold;">PREPARED EXCLUSIVELY FOR:</div>
      <div style="font-size:16px; font-weight:bold;">${businessName}</div>
      <div style="font-size:12px; color:#475569;">${category} • ${location}</div>
    </div>
    <div style="text-align:right;">
      <div style="font-size:10px; color:#64748b; font-weight:bold;">MODULE ARCHITECTURE:</div>
      <div style="font-size:14px; font-weight:bold; color:#0284c7;">${toolType}</div>
      <div style="font-size:11px; color:#10b981;">&bull; 48-Hour Guaranteed SLA</div>
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
        <td><strong>24/7 AI WhatsApp Sales Assistant</strong></td>
        <td>Automated quoting, audio voice note responses, & live catalog routing</td>
        <td style="text-align:right; font-family:monospace;">&lt; 3 Seconds</td>
      </tr>
      <tr>
        <td><strong>Custom Sector Lead Tool</strong></td>
        <td>${toolType} with dynamic calculation & instant quotation export</td>
        <td style="text-align:right; font-family:monospace;">Active</td>
      </tr>
      <tr>
        <td><strong>Done-For-You Production Deployment</strong></td>
        <td>.com.ng domain, SSL, Cloudflare CDN staging, Google Maps SEO setup</td>
        <td style="text-align:right; font-family:monospace;">48 Hours</td>
      </tr>
      <tr>
        <td><strong>Automated Payment Gateway</strong></td>
        <td>Paystack Instant Checkout & Moniepoint Virtual Account verification</td>
        <td style="text-align:right; font-family:monospace;">Pre-Wired</td>
      </tr>
    </tbody>
  </table>

  <div class="pricing">
    <div class="price-box primary">
      <div style="font-size:10px; font-weight:bold; color:#0369a1;">50% ACTIVATION DEPOSIT</div>
      <div style="font-size:22px; font-weight:900; color:#0284c7; font-family:monospace;">₦${depositFeeNgn.toLocaleString()}</div>
      <div style="font-size:10px; color:#475569;">Triggers domain purchase, cloud staging, and 48-hour delivery countdown</div>
    </div>
    <div class="price-box">
      <div style="font-size:10px; font-weight:bold; color:#64748b;">TOTAL CONTRACT VALUE</div>
      <div style="font-size:22px; font-weight:900; color:#0f172a; font-family:monospace;">₦${claimFeeNgn.toLocaleString()}</div>
      <div style="font-size:10px; color:#475569;">Remaining balance payable only upon verified production handover</div>
    </div>
  </div>

  <div class="bank">
    <div style="font-size:11px; font-weight:bold; color:#065f46;">OFFICIAL SETTLEMENT CHANNEL (DIRECT NIP BANK TRANSFER):</div>
    <div style="display:flex; justify-content:space-between; margin-top:4px;">
      <div>Bank: <strong>OPay Digital Services</strong></div>
      <div>Account No: <strong style="font-size:15px; color:#047857; font-family:monospace;">7034297995</strong></div>
      <div>Beneficiary: <strong>Oyelakin Tosin Matthew</strong></div>
    </div>
  </div>

  <div style="margin-top:14px; font-size:10px; color:#64748b; text-align:center; border-top:1px solid #e2e8f0; padding-top:8px;">
    Bethelmind Analytics Lagos Desk &bull; Ref: ${quoteRef} &bull; Call/WhatsApp: +${adminPhone}
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
                <span>100% Guaranteed 48-Hour SLA Handover</span>
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
                  <span>🟢 WhatsApp Verification (OPay ₦{depositFeeNgn.toLocaleString()}) →</span>
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
