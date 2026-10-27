const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'src', 'components', 'vin', 'VinCheckerClient.tsx');
let content = fs.readFileSync(file, 'utf8');

const target = `            {/* ─── PAYWALL / UNLOCK BANNER ─── */}
            {!fullReport && (
              <div className="mt-8 p-6 sm:p-7 rounded-2xl border border-[#d4af37]/35 bg-gradient-to-r from-[#070b14] via-[#0f1422] to-[#070b14] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl shadow-black/60">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Lock className="w-5 h-5 text-[#d4af37]" />
                    <h3 className="font-serif text-base sm:text-lg font-normal text-[#f5f3ef]">
                      Unlock Full Executive Pre-Purchase Audit (₦3,500)
                    </h3>
                  </div>
                  <p className="text-xs text-[#c9c4bc] max-w-xl leading-relaxed font-light">
                    Uncovers Copart auction salvage totals, Texas/Florida hurricane flood records, safety recalls, NCS customs duty clearing tariffs, and the mechanic catalytic converter &amp; transmission inspection checklist.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-[#070b14] transition hover:brightness-110 shadow-lg shadow-[#d4af37]/20 flex items-center justify-center gap-2 cursor-pointer"
                    style={{ background: 'linear-gradient(135deg, #d4af37 0%, #e5c158 50%, #aa8620 100%)' }}
                  >
                    <span>Unlock Full Report (₦3,500) →</span>
                  </button>
                  <button
                    onClick={() => executeLoadReport(previewData.vin, true)}
                    className="px-4 py-3.5 rounded-xl font-medium text-xs text-[#c9c4bc] hover:text-[#f5f3ef] bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.15] transition"
                  >
                    Instant Demo Mode
                  </button>
                </div>
              </div>
            )}`;

const replacement = `            {/* ─── 1. FREE LEAD MAGNET PACK BANNER ─── */}
            <div className="mt-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-[#0a121e] to-emerald-950/30 border border-emerald-500/35 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg shadow-emerald-950/40">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/30">
                  <span>🎁 100% Free WhatsApp Download</span>
                </div>
                <h4 className="text-sm font-semibold text-emerald-100 flex items-center gap-1.5 pt-0.5">
                  FREE 2026 NCS Single-Sheet Customs Valuation Matrix & FOU Road Interception Defense Guide
                </h4>
                <p className="text-xs text-slate-300 font-light leading-relaxed max-w-xl">
                  Essential statutory 20% import duty + 15% NAC levy sheets and how to avoid Federal Operations Unit (FOU) road seizures. Sent free on WhatsApp.
                </p>
              </div>
              <a
                href={\`https://wa.me/2348022791227?text=\${encodeURIComponent(\`Please send me the FREE 2026 NCS Customs Valuation Matrix and FOU Road Defense Guide for VIN: \${previewData?.vin || vinInput}\`)}\`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition shadow-md shadow-emerald-500/25 shrink-0 active:scale-95 cursor-pointer"
              >
                <span>Claim Free on WhatsApp →</span>
              </a>
            </div>

            {/* ─── 2. PAYWALL / VIRAL SHARE UNLOCK BANNER ─── */}
            {!fullReport && (
              <div className="mt-4 p-6 sm:p-7 rounded-2xl border border-[#d4af37]/35 bg-gradient-to-r from-[#070b14] via-[#0f1422] to-[#070b14] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl shadow-black/60">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Lock className="w-5 h-5 text-[#d4af37]" />
                    <h3 className="font-serif text-base sm:text-lg font-normal text-[#f5f3ef]">
                      Unlock Full Executive Pre-Purchase Audit &amp; Stamped A4 PDF
                    </h3>
                  </div>
                  <p className="text-xs text-[#c9c4bc] max-w-xl leading-relaxed font-light">
                    Uncovers Copart auction salvage records, hurricane flood immersion, NCS statutory customs duty, and roadside catalytic converter (&quot;indomie&quot;) theft warning.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
                  <button
                    onClick={() => {
                      const shareText = encodeURIComponent(\`⚠️ Before buying any Tokunbo car in Lagos, check its VIN free on Bethelmind to detect stolen catalytic converters and exact 2026 customs duty: https://www.bethelmindanalytics.com/vin?vin=\${previewData.vin}\`);
                      window.open(\`https://wa.me/?text=\${shareText}\`, '_blank');
                      executeLoadReport(previewData.vin, true);
                    }}
                    className="px-5 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>📲 Share to WhatsApp (Unlock Free)</span>
                  </button>
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="px-5 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-[#070b14] transition hover:brightness-110 shadow-lg shadow-[#d4af37]/20 flex items-center justify-center gap-2 cursor-pointer"
                    style={{ background: 'linear-gradient(135deg, #d4af37 0%, #e5c158 50%, #aa8620 100%)' }}
                  >
                    <span>Instant Stamped PDF (₦3,500) →</span>
                  </button>
                </div>
              </div>
            )}`;

const normContent = content.replace(/\r\n/g, '\n');
const normTarget = target.replace(/\r\n/g, '\n');
const normRep = replacement.replace(/\r\n/g, '\n');

if (normContent.includes(normTarget)) {
  const updated = normContent.replace(normTarget, normRep);
  fs.writeFileSync(file, updated, 'utf8');
  console.log('✓ Successfully injected Free Lead Magnet and Viral WhatsApp Unlock into VinCheckerClient.tsx');
} else {
  console.error('Target not found in VinCheckerClient.tsx');
}
