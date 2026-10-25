const fs = require('fs');
const path = require('path');

const filePath = path.join('c:/Users/HomePC/Desktop/website Projects/lead generation automation/src/app/tools/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add 'wealth' to category tabs if not present
if (!content.includes("{ id: 'wealth', label: '⚡ Viral Games & Wealth' }")) {
  content = content.replace(
    "{ id: 'all', label: 'All Tools' },",
    "{ id: 'all', label: 'All Tools' },\r\n              { id: 'wealth', label: '⚡ Viral Games & Wealth' },"
  );
}

// 2. Add B2B Commercial Licensing banner above Filter & Search Bar if not present
if (!content.includes('🏢 B2B Whitelabel & Commercial Licensing')) {
  const target = '{/* Filter & Search Bar */}';
  const banner = `{/* Turnkey B2B Whitelabel & Digital Store Monetization Banner */}
        <div className="mb-8 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-indigo-950/70 via-slate-900/90 to-cyan-950/60 border border-cyan-500/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                🏢 B2B Whitelabel & Commercial Licensing
              </span>
              <span className="text-[10px] font-bold text-amber-400">
                Turnkey from ₦35,000 / $45
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-white font-['Outfit']">
              Want Any of These Interactive Engines Branded for Your Business?
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Deploy custom branding, automated lead capture, and a 24/7 AI WhatsApp closer directly on your dedicated domain. Built for coaches, agencies, fintechs, and commercial operators.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0 w-full md:w-auto">
            <a
              href="https://selar.com/showlove/bethelmind"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 border border-white/10 text-xs font-bold transition-all"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
              <span>Selar Digital Store →</span>
            </a>

            <a
              href={\`https://wa.me/2348022791227?text=\${encodeURIComponent('Hello Bethelmind Digital Solutions! I want to deploy a turnkey white-label interactive tool/calculator for my business.')}\`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-black transition-all shadow-lg shadow-cyan-500/25 active:scale-95"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Claim Setup on WhatsApp →</span>
            </a>
          </div>
        </div>

        ` + target;
  content = content.replace(target, banner);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated tools/page.tsx with B2B licensing banner & wealth tab!');
