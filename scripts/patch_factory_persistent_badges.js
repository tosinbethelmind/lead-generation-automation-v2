const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'src', 'app', 'factory', 'page.tsx');
let content = fs.readFileSync(file, 'utf8');

// Add persistent WhatsApp desk in top status ribbon
if (!content.includes('Lagos Desk: 0802 279 1227')) {
  content = content.replace(
    `{/* Quick Metrics Header Pill */}
          <div className="flex items-center gap-3 text-xs">`,
    `{/* WhatsApp Desk & Quick Metrics */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <a
              href="https://wa.me/2348022791227?text=Hello%20Bethelmind%20Desk!%20I%20am%20reviewing%20the%20AquaFlow%20Water%20Factory%20ERP%20for%20my%20plant.%20Please%20connect%20with%20me."
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center gap-1.5 transition"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Lagos Desk: 0802 279 1227</span>
            </a>`
  );
}

// Add persistent bottom pricing anchor bar across all tabs
if (!content.includes('Persistent Plant Pricing Anchor')) {
  content = content.replace(
    `      </main>

      <Footer />`,
    `        {/* Persistent Plant Pricing Anchor */}
        <div className="rounded-2xl bg-[#0c1220] border border-cyan-500/30 p-5 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="text-xs uppercase font-extrabold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                Commercial Deployment
              </span>
              <span className="text-xs text-slate-400">48-Hour Factory Turnkey Setup</span>
            </div>
            <p className="text-xs text-slate-300">
              <strong>Industrial Plant Edition:</strong> ₦280,000 Turnkey (₦140,000 50% Milestone Deposit) &bull; <strong>Starter Edition:</strong> ₦35,000 Setup
            </p>
            <p className="text-[11px] text-slate-400">
              Settlement: Moniepoint Microfinance Bank (<strong>6805375225</strong> — Bethelmind Digital Solutions, CAC Reg: 9912717)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('deploy')}
              className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition cursor-pointer"
            >
              View Plant Pricing &amp; Milestone Deposit &rarr;
            </button>
            <a
              href="https://wa.me/2348022791227?text=Hello%20Bethelmind%20Desk!%20I%20am%20ready%20to%20activate%20AquaFlow%20Water%20Factory%20ERP%20for%20my%20plant.%20Please%20issue%20the%20onboarding%20mandate."
              target="_blank"
              rel="noreferrer"
              className="py-2.5 px-4 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center gap-1.5 transition"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp Closer</span>
            </a>
          </div>
        </div>

      </main>

      <Footer />`
  );
}

fs.writeFileSync(file, content, 'utf8');
console.log('Successfully added persistent header and footer pricing badges to AquaFlow ERP!');
