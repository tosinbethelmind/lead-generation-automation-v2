const fs = require('fs');
let code = fs.readFileSync('src/components/home/Navbar.tsx', 'utf8');

// Normalize line endings
code = code.replace(/\r\n/g, '\n');

// 1. Add "⚡ Pillars Desk" button next to mobile hamburger toggle
const hamburgerTarget = `        {/* Mobile Hamburger Toggle */}
        <button
          id="mobile-menu-toggle"`;

const hamburgerReplacement = `        {/* Direct Link to Dual-Pillar Command Desk */}
        <Link
          href="/app"
          className="inline-flex py-1.5 px-2.5 rounded-lg bg-gradient-to-r from-[#d97706]/25 to-[#0284c7]/25 border border-[#f59e0b]/60 text-[#fbbf24] font-extrabold text-xs items-center gap-1 hover:brightness-110 transition-all shadow-sm"
        >
          <span>⚡ Pillars Desk</span>
        </Link>

        {/* Mobile Hamburger Toggle */}
        <button
          id="mobile-menu-toggle"`;

if (code.includes(hamburgerTarget)) {
  code = code.replace(hamburgerTarget, hamburgerReplacement);
  console.log('✅ Top bar Pillars button added.');
} else {
  console.log('⚠️ hamburgerTarget not found.');
}

// 2. Add prominent card at the top of the mobile drawer
const drawerTarget = `          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-[#d4af37] font-semibold block px-2 mb-2">
              Navigation
            </span>`;

const drawerReplacement = `          <div className="space-y-1">
            {/* Dual-Pillar Command Center Direct Card */}
            <Link
              href="/app"
              onClick={() => setMenuOpen(false)}
              className="p-3 mb-3 rounded-xl bg-gradient-to-r from-[#d97706]/20 via-[#0284c7]/20 to-[#10b981]/20 border border-[#fbbf24]/50 text-[#ffffff] font-bold flex items-center justify-between shadow-lg"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg">⚡</span>
                <div>
                  <div className="font-extrabold text-sm text-[#fbbf24]">Launch Command Center</div>
                  <div className="text-[10px] text-[#94a3b8]">🏢 Pillar 1: SME Engine · 🏛️ Pillar 2: Deal Wire</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#fbbf24]" />
            </Link>

            <span className="text-[10px] uppercase tracking-widest text-[#d4af37] font-semibold block px-2 mb-2">
              Public Navigation
            </span>`;

if (code.includes(drawerTarget)) {
  code = code.replace(drawerTarget, drawerReplacement);
  console.log('✅ Drawer Pillars card added.');
} else {
  console.log('⚠️ drawerTarget not found.');
}

fs.writeFileSync('src/components/home/Navbar.tsx', code, 'utf8');
console.log('src/components/home/Navbar.tsx updated successfully.');
