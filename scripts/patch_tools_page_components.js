const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'app', 'tools', '[slug]', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add imports if not present
if (!content.includes('ViralToolShareBar')) {
  content = content.replace(
    "import TurnkeyAdBanner from '@/components/TurnkeyAdBanner';",
    `import TurnkeyAdBanner from '@/components/TurnkeyAdBanner';
import { ViralToolShareBar } from '@/components/ViralToolShareBar';
import { DualCheckoutTrustCard } from '@/components/DualCheckoutTrustCard';
import { TurnkeySmeSetupBanner } from '@/components/TurnkeySmeSetupBanner';`
  );
}

// 2. In viral tool view: inject ViralToolShareBar, DualCheckoutTrustCard, and TurnkeySmeSetupBanner
const oldViralBottom = `{/* Digital Upsell & Monetization Offer Card */}
          <section className="bg-gradient-to-br from-indigo-950/60 via-slate-900/80 to-slate-950 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px] font-bold">
                <ShoppingBag className="w-3 h-3 text-indigo-400" />
                <span>Verified Commercial Blueprint Available</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Get the Complete {viralTool.selarProduct}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Unlock full editable financial spreadsheets, commercial contract clauses, step-by-step video walkthrough, and instant downloadable implementation assets.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
              <div className="text-center md:text-right hidden sm:block">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Instant Access</span>
                <span className="text-lg font-black text-emerald-400">{viralTool.selarPrice}</span>
              </div>
              <a
                href={viralTool.selarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs transition-all shadow-lg shadow-emerald-500/25 active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Unlock Blueprint on Selar →</span>
              </a>
            </div>
          </section>`;

const newViralBottom = `{/* 1-Tap WhatsApp & Nairaland Viral Loop */}
          <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-5 shadow-xl">
            <ViralToolShareBar
              toolTitle={viralTool.title}
              toolSlug={\`tools/\${cleanSlug}\`}
              summaryText={viralTool.summary}
              highlights={viralTool.highlights ? viralTool.highlights.map(h => ({ label: 'Feature', value: h })) : []}
              category={viralTool.category}
            />
          </div>

          {/* Dual Checkout Trust Card (Selar + Moniepoint Direct) */}
          <DualCheckoutTrustCard
            productTitle={viralTool.selarProduct}
            price={viralTool.selarPrice}
            selarUrl={viralTool.selarUrl}
            category={viralTool.category}
          />

          {/* Turnkey B2B SME Setup Offer Banner */}
          <TurnkeySmeSetupBanner
            toolName={viralTool.title}
            category={viralTool.category}
          />`;

// Normalize line endings
content = content.replace(/\r\n/g, '\n');
const normOld = oldViralBottom.replace(/\r\n/g, '\n');
const normNew = newViralBottom.replace(/\r\n/g, '\n');

if (content.includes(normOld)) {
  content = content.replace(normOld, normNew);
  console.log('SUCCESS: Injected viral tools components!');
} else {
  console.warn('Could not find exact oldViralBottom match, trying regex fallback');
  content = content.replace(
    /\{\/\* Digital Upsell & Monetization Offer Card \*\/\}[\s\S]*?<\/section>/,
    normNew
  );
  console.log('Applied regex replacement for viral tool bottom');
}

// 3. In sector tool view: inject below SectorToolsWidget
const sectorSectionTarget = `{/* Feature Interactive Suite */}
        <section aria-label="Interactive Tool Engine">
          {cleanSlug === 'recruitment' ? (
            <RecruitmentEngineWidget />
          ) : (
            <SectorToolsWidget businessCategory={profile.category} hideHeader={true} />
          )}
        </section>`;

const newSectorSection = `{/* Feature Interactive Suite */}
        <section aria-label="Interactive Tool Engine">
          {cleanSlug === 'recruitment' ? (
            <RecruitmentEngineWidget />
          ) : (
            <SectorToolsWidget businessCategory={profile.category} hideHeader={true} />
          )}
        </section>

        {/* 1-Tap WhatsApp & Nairaland Viral Loop */}
        <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-5 shadow-xl">
          <ViralToolShareBar
            toolTitle={profile.title}
            toolSlug={\`tools/\${cleanSlug}\`}
            summaryText={profile.summary}
            highlights={profile.highlightPills ? profile.highlightPills.map(p => ({ label: 'Highlight', value: p })) : []}
            category={profile.category}
          />
        </div>

        {/* Dual Checkout Trust Card (Selar + Moniepoint Direct) */}
        <DualCheckoutTrustCard
          productTitle={\`\${profile.title} Commercial Implementation Bundle\`}
          price="₦25,000 / $30"
          selarUrl="https://selar.com/showlove/bethelmind"
          category={profile.category}
        />

        {/* Turnkey B2B SME Setup Offer Banner */}
        <TurnkeySmeSetupBanner
          toolName={profile.title}
          category={profile.category}
        />`;

const normSectorTarget = sectorSectionTarget.replace(/\r\n/g, '\n');
const normNewSector = newSectorSection.replace(/\r\n/g, '\n');

if (content.includes(normSectorTarget)) {
  content = content.replace(normSectorTarget, normNewSector);
  console.log('SUCCESS: Injected sector tools components!');
} else {
  console.warn('Could not find sectorSectionTarget match');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Finished updating src/app/tools/[slug]/page.tsx!');
