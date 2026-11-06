import React from 'react';
import PrintInvoiceButton from '@/components/invoice/PrintInvoiceButton';
import { OFFICIAL_CORPORATE_SETTLEMENT, type InvoiceRecord } from '@/lib/monetization/invoiceTypes';
import { getInvoiceById, createOrGetCommercialInvoice } from '@/lib/monetization/bankableCommercialInvoice';

export const dynamic = 'force-dynamic';

export default async function CommercialInvoicePage({
  params
}: {
  params: Promise<{ invoice_id: string }>;
}) {
  const { invoice_id } = await params;

  let invoice = getInvoiceById(invoice_id);

  if (!invoice) {
    const isLogistics = invoice_id.toUpperCase().includes('LOGI') || invoice_id.toUpperCase().includes('DISP');
    const isEstate = invoice_id.toUpperCase().includes('ESTA') || invoice_id.toUpperCase().includes('RENT');
    const isApp = invoice_id.toUpperCase().includes('APP');
    const isSolar = invoice_id.toUpperCase().includes('SOLA');

    const pkgType = isLogistics ? 'LOGISTICS_WAYBILL_PORTAL' :
                    isEstate ? 'ESTATE_SERVICE_CHARGE_PORTAL' :
                    isApp ? 'ANDROID_APP_CONVERSION' :
                    isSolar ? 'SOLAR_BOQ_ENGINE' : 'SME_TURNKEY_WEBSITE';

    invoice = createOrGetCommercialInvoice({
      clientName: isLogistics ? 'Interstate Logistics Client' :
                  isEstate ? 'Estate Management Client' :
                  isSolar ? 'Solar Energy Client' : 'Commercial Client',
      clientPhone: '2348022791227',
      packageType: pkgType
    });
  }

  const bank = OFFICIAL_CORPORATE_SETTLEMENT;
  const whatsappConfirmLink = `https://wa.me/2348022791227?text=${encodeURIComponent(
    `Hello Bethelmind Desk! I have made the ₦${invoice.depositNgn.toLocaleString()} commitment deposit for Invoice #${invoice.invoiceId} (${invoice.clientName}). Here is my bank transfer receipt for verification.`
  )}`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden print:bg-white print:text-black print:border-none print:shadow-none">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 md:p-8 border-b border-slate-800 print:bg-none print:border-b-2 print:border-black">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-2 print:text-black print:border-black">
                🇳🇬 Official Commercial Proforma Invoice & SLA
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white print:text-black">
                Bethelmind Digital Solutions
              </h1>
              <p className="text-xs text-slate-300 mt-1 print:text-slate-600">
                CAC Certified Enterprise ({bank.cacReg}) · Lagos & National B2B Technology Desk
              </p>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 text-right print:bg-none print:border-none print:text-left">
              <span className="text-xs text-slate-400 uppercase tracking-widest block font-mono">Invoice Reference</span>
              <span className="text-sm md:text-base font-bold text-emerald-400 font-mono print:text-black">
                {invoice.invoiceId}
              </span>
              <span className="text-xs text-slate-400 block mt-1">
                Issued: {new Date(invoice.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>

        {/* Client & SLA Summary */}
        <div className="p-6 md:p-8 border-b border-slate-800/80 bg-slate-900/50 print:bg-none">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Billed To Client</h3>
              <div className="text-lg font-bold text-white print:text-black">{invoice.clientName}</div>
              <div className="text-sm text-slate-300 print:text-slate-700">{invoice.category}</div>
              {invoice.clientPhone && (
                <div className="text-xs text-slate-400 mt-1 font-mono">Mobile: +{invoice.clientPhone}</div>
              )}
            </div>
            <div className="bg-blue-950/40 p-4 rounded-xl border border-blue-900/40 print:bg-none print:border-slate-300">
              <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1 print:text-black">
                ⏱️ 48-Hour Live Deployment Guarantee
              </h3>
              <p className="text-xs text-slate-300 print:text-slate-700 leading-relaxed">
                Guaranteed production go-live by <strong className="text-emerald-400 print:text-black">{invoice.guaranteedDeliveryDate}</strong>. If not live within 48 hours, 100% of your deposit is refunded immediately without dispute.
              </p>
            </div>
          </div>
        </div>

        {/* Deliverables Scope */}
        <div className="p-6 md:p-8 border-b border-slate-800/80">
          <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
            <span>📦</span> Package: <span className="text-white print:text-black font-semibold">{invoice.packageName}</span>
          </h2>
          <div className="space-y-3">
            {invoice.deliverables.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 text-sm text-slate-200 print:text-slate-800">
                <span className="text-emerald-400 print:text-black font-bold">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Calculation */}
        <div className="p-6 md:p-8 border-b border-slate-800/80 bg-slate-950/40 print:bg-none">
          <div className="space-y-2 text-sm max-w-md ml-auto">
            <div className="flex justify-between text-slate-400 print:text-slate-600">
              <span>Total Commercial Package:</span>
              <span className="font-semibold text-slate-200 print:text-black">₦{invoice.totalNgn.toLocaleString()} NGN</span>
            </div>
            <div className="flex justify-between text-emerald-400 font-bold print:text-black border-t border-slate-800 pt-2 text-base">
              <span>Required 50% Milestone Activation:</span>
              <span>₦{invoice.depositNgn.toLocaleString()} NGN</span>
            </div>
            <div className="flex justify-between text-xs text-slate-400 pt-1">
              <span>Balance Due Only After Handover:</span>
              <span className="text-slate-300 font-medium">₦{invoice.balanceNgn.toLocaleString()} NGN</span>
            </div>
          </div>
        </div>

        {/* Corporate Moniepoint Settlement Vault */}
        <div className="p-6 md:p-8 bg-gradient-to-b from-slate-900 to-slate-950">
          <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 print:bg-none print:border-black">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-emerald-400 text-lg">🏛️</span>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider print:text-black">
                Official CAC Corporate Settlement Account
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left font-mono">
              <div>
                <span className="text-xs text-slate-400 block uppercase">Bank Name</span>
                <span className="text-sm font-bold text-white print:text-black">{bank.bankName}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block uppercase">Account Number</span>
                <span className="text-base font-extrabold text-emerald-400 print:text-black tracking-wider">
                  {bank.accountNumber}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block uppercase">Beneficiary Name</span>
                <span className="text-sm font-bold text-white print:text-black">{bank.accountName}</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-emerald-900/40 text-xs text-slate-300 print:text-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <span>Payment Narration: <strong>{invoice.invoiceId}</strong></span>
              <span className="text-emerald-400 print:text-black font-semibold">Instant Bank Webhook & WhatsApp Alert Active</span>
            </div>
          </div>

          {/* Call to Actions */}
          <div className="mt-6 flex flex-col sm:flex-row items-center gap-4 print:hidden">
            <a
              href={whatsappConfirmLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-900/40 transition"
            >
              <span>📲</span> Send Transfer Receipt on WhatsApp ({bank.closerHotline})
            </a>
            <PrintInvoiceButton />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800/80 text-center text-xs text-slate-400 print:bg-none print:text-slate-600">
          Bethelmind Digital Solutions (CAC Certified: {bank.cacReg}) · Moniepoint MFB 6805375225 · Legal Desk: {bank.closerHotline}
        </div>

      </div>
    </div>
  );
}
