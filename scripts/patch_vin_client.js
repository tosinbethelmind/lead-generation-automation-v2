const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'src', 'components', 'vin', 'VinCheckerClient.tsx');
let content = fs.readFileSync(file, 'utf8');

const target = `<button
                  onClick={handlePrint}
                  className="px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-[#f5f3ef] text-xs font-medium flex items-center gap-2 border border-white/[0.1] transition cursor-pointer shadow"
                >
                  <Printer className="w-4 h-4 text-[#d4af37]" />
                  <span>Print / Save PDF</span>
                </button>`;

const replacement = `<div className="flex items-center gap-2">
                  <a
                    href={\`/reports/REP-\${fullReport.vin}.pdf\`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-[#d4af37] hover:bg-[#e5c158] text-[#070b14] text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-md"
                  >
                    <FileCheck2 className="w-3.5 h-3.5 text-[#070b14]" />
                    <span>Download Stamped A4 PDF</span>
                  </a>
                  <button
                    onClick={handlePrint}
                    className="px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-[#f5f3ef] text-xs font-medium flex items-center gap-1.5 border border-white/[0.1] transition cursor-pointer shadow"
                  >
                    <Printer className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>Print</span>
                  </button>
                </div>`;

const normContent = content.replace(/\r\n/g, '\n');
const normTarget = target.replace(/\r\n/g, '\n');
const normRep = replacement.replace(/\r\n/g, '\n');

if (normContent.includes(normTarget)) {
  const updated = normContent.replace(normTarget, normRep);
  fs.writeFileSync(file, updated, 'utf8');
  console.log('✓ Successfully injected Download Stamped A4 PDF button into VinCheckerClient.tsx');
} else {
  console.error('Target not found in VinCheckerClient.tsx');
}
