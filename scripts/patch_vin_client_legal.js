const fs = require('fs');
const path = require('path');

const clientPath = path.join(__dirname, '..', 'src', 'components', 'vin', 'VinCheckerClient.tsx');
let code = fs.readFileSync(clientPath, 'utf8');

// 1. Refine Section 3 titles
code = code.replace(
  "Clean Title Provenance Verified",
  "Public Registry Query: No Open Flags"
);
code = code.replace(
  "Clean Flood Record Verified",
  "Coastal Origin Query: Standard Zone"
);

// 2. Add Statutory Disclaimer banner right before </div>\n          )}\n        </section>
const insertMarker = "              </div>\n            </div>\n          )}\n        </section>";

const legalBanner = `              </div>

              {/* ─── STATUTORY LEGAL DISCLAIMER & LIMITATION OF LIABILITY (FCCPA 2018) ─── */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] text-[11px] text-[#8e887e] leading-relaxed space-y-1.5">
                <div className="flex items-center gap-1.5 text-slate-300 font-semibold text-xs uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Statutory Legal Disclaimer &amp; Liability Cap (FCCPA 2018)</span>
                </div>
                <p>
                  This report is an advisory technical specification compiled from U.S. NHTSA vPIC manufacturing databases and Nigerian Customs Service (NCS) statutory tariffs. It does <strong>not</strong> constitute an insurance policy, title guarantee, or mechanical warranty. Bethelmind Digital Solutions disclaims all liability for undisclosed private collision records, post-import modifications, or dockside component removal. Total liability is strictly limited to the fee paid for this report (₦3,500). Physical on-site mechanic verification of Section 4 is strictly required prior to releasing funds.
                </p>
              </div>
            </div>
          )}
        </section>`;

if (code.includes(insertMarker)) {
  code = code.replace(insertMarker, legalBanner);
  fs.writeFileSync(clientPath, code, 'utf8');
  console.log('✓ Successfully patched src/components/vin/VinCheckerClient.tsx with legal shield!');
} else {
  // Try with flexible line endings
  const altMarker = "              </div>\r\n            </div>\r\n          )}\r\n        </section>";
  if (code.includes(altMarker)) {
    code = code.replace(altMarker, legalBanner);
    fs.writeFileSync(clientPath, code, 'utf8');
    console.log('✓ Successfully patched src/components/vin/VinCheckerClient.tsx with legal shield (CRLF)!');
  } else {
    console.warn('Warning: insertMarker not found in VinCheckerClient.tsx');
  }
}
