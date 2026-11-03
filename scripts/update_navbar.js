const fs = require('fs');

let code = fs.readFileSync('src/components/home/Navbar.tsx', 'utf8');

// Normalize line endings to avoid CRLF mismatch during replace
const isCRLF = code.includes('\r\n');
const eol = isCRLF ? '\r\n' : '\n';

// Desktop navigation injection
const desktopTarget = `<Link${eol}          href="/tools"${eol}          className="px-3.5 py-2 rounded-xl hover:text-[#f5f3ef] hover:bg-white/[0.04] transition-colors"${eol}        >${eol}          Sector Tools${eol}        </Link>`;
const desktopReplacement = `<Link${eol}          href="/services"${eol}          className="px-3.5 py-2 rounded-xl text-[#d4af37] font-semibold hover:bg-white/[0.04] transition-colors"${eol}        >${eol}          13 Sector Solutions${eol}        </Link>${eol}${eol}        ${desktopTarget}`;

if (code.includes(desktopTarget)) {
  code = code.replace(desktopTarget, desktopReplacement);
  console.log('✅ Desktop nav updated with /services');
} else {
  console.log('⚠️ desktopTarget not matched');
}

// Mobile navigation injection
const mobileTarget = `<Link${eol}              href="/tools"${eol}              onClick={() => setMenuOpen(false)}${eol}              className="p-3 rounded-xl hover:bg-white/[0.04] text-[#f5f3ef] font-medium flex items-center justify-between"${eol}            >${eol}              <span>Sector Tools &amp; Calculators</span>${eol}              <ArrowRight className="w-4 h-4 text-[#d4af37]" />${eol}            </Link>`;
const mobileReplacement = `<Link${eol}              href="/services"${eol}              onClick={() => setMenuOpen(false)}${eol}              className="p-3 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] font-bold flex items-center justify-between"${eol}            >${eol}              <span>⚡ 13 Sector Solutions &amp; Prototypes</span>${eol}              <ArrowRight className="w-4 h-4 text-[#d4af37]" />${eol}            </Link>${eol}${eol}            ${mobileTarget}`;

if (code.includes(mobileTarget)) {
  code = code.replace(mobileTarget, mobileReplacement);
  console.log('✅ Mobile nav updated with /services');
} else {
  console.log('⚠️ mobileTarget not matched');
}

fs.writeFileSync('src/components/home/Navbar.tsx', code, 'utf8');
