const fs = require('fs');

let code = fs.readFileSync('src/app/tools/page.tsx', 'utf8');

const isCRLF = code.includes('\r\n');
const eol = isCRLF ? '\r\n' : '\n';

// 1. Add toolToServiceMap definition
if (!code.includes('toolToServiceMap')) {
  const mapCode = `const toolToServiceMap: Record<string, string> = {
  'solar-boq': 'solar_boq',
  'tokunbo-duty': 'vin_checker',
  'salon-booking': 'salon_booking',
  'shortlet-booking-escrow': 'shortlet_escrow',
  'website-to-android-app': 'website_to_app',
  'school-fee-sizer': 'school_fee',
  'real-estate-manager': 'estate_rent',
  'fmcg-dispatch': 'retail_inventory',
  'gps-tracker-fuel-audit': 'dispatch_tracker',
};${eol}${eol}`;
  code = mapCode + code;
  console.log('✅ Added toolToServiceMap');
}

// 2. Add Deploy button next to Open Engine in card footer
const oldCardFooter = `<Link
                    href={tool.href}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[#d4af37] hover:underline group-hover:translate-x-1 transition-all"
                  >
                    <span>Open Engine</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>`;

const newCardFooter = `<div className="flex items-center gap-2">
                    <Link
                      href={tool.href}
                      className="inline-flex items-center gap-1 text-xs font-medium text-slate-300 hover:text-white transition"
                    >
                      <span>Demo</span>
                      <ArrowRight className="w-3 h-3 text-[#d4af37]" />
                    </Link>

                    <Link
                      href={\`/onboard?service=\${toolToServiceMap[tool.id] || 'website_ai'}\`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#b38f22] text-[#070b14] font-extrabold text-[11px] hover:brightness-110 shadow-sm transition"
                    >
                      <span>Deploy</span>
                    </Link>
                  </div>`;

// Replace with regex to be flexible about whitespace and line breaks
code = code.replace(
  /<Link[\s\S]*?href=\{tool\.href\}[\s\S]*?<span>Open Engine<\/span>[\s\S]*?<\/Link>/,
  newCardFooter
);
console.log('✅ Updated card footer with Deploy button');

// 3. Add link to /services in top banner
const oldHeaderBadges = `<div className="flex flex-wrap items-center justify-center gap-4 pt-1 text-xs text-[#8e887e] font-light">
            <span className="inline-flex items-center gap-1.5 text-[#d4af37]">
              <ShieldCheck className="w-4 h-4" />
              CAC RC: 7034297 Certified
            </span>
            <span>&bull;</span>
            <span>Moniepoint NIP Reconciliation</span>
            <span>&bull;</span>
            <span>48-Hour Turnkey Deployment</span>
          </div>`;

const newHeaderBadges = `<div className="flex flex-wrap items-center justify-center gap-4 pt-1 text-xs text-[#8e887e] font-light">
            <span className="inline-flex items-center gap-1.5 text-[#d4af37]">
              <ShieldCheck className="w-4 h-4" />
              CAC Certified Enterprise (Reg: 9912717)
            </span>
            <span>&bull;</span>
            <span>Moniepoint NIP (6805375225)</span>
            <span>&bull;</span>
            <span>48-Hour Turnkey Deployment</span>
          </div>
          <div className="pt-2">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/30 text-xs font-bold text-[#d4af37] hover:bg-[#d4af37]/20 transition"
            >
              <span>⚡ View All 13 Pillar 1 Commercial Suites &amp; Pricing</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>`;

code = code.replace(oldHeaderBadges, newHeaderBadges);
console.log('✅ Added /services link to header badges');

fs.writeFileSync('src/app/tools/page.tsx', code, 'utf8');
