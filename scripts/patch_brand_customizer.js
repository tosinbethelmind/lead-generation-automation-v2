const fs = require('fs');
const path = require('path');

const pageFile = path.join(__dirname, '..', 'src', 'app', 'tools', '[slug]', 'page.tsx');
let code = fs.readFileSync(pageFile, 'utf8');

// 1. Add import
if (!code.includes('InstantBrandCustomizer')) {
  code = code.replace(
    "import TurnkeyAdBanner from '@/components/TurnkeyAdBanner';",
    "import TurnkeyAdBanner from '@/components/TurnkeyAdBanner';\nimport { InstantBrandCustomizer } from '@/components/InstantBrandCustomizer';"
  );
}

// 2. Add to viral tool view (before digital upsell or footer)
const viralTarget = `{/* Digital Upsell & Monetization Offer Card */}`;
if (!code.includes('<InstantBrandCustomizer toolTitle={viralTool.title}')) {
  code = code.replace(
    viralTarget,
    `<InstantBrandCustomizer toolTitle={viralTool.title} category={viralTool.category} />\n\n          ${viralTarget}`
  );
}

// 3. Add to sector tool view (below SectorToolsWidget)
const sectorTarget = `          {cleanSlug === 'recruitment' ? (
            <RecruitmentEngineWidget />
          ) : (
            <SectorToolsWidget businessCategory={profile.category} hideHeader={true} />
          )}
        </section>`;

const sectorReplacement = `          {cleanSlug === 'recruitment' ? (
            <RecruitmentEngineWidget />
          ) : (
            <SectorToolsWidget businessCategory={profile.category} hideHeader={true} />
          )}
        </section>

        {/* 1-Tap SME Brand Customizer & Instant Deployment */}
        <InstantBrandCustomizer toolTitle={profile.title} category={profile.category} />`;

if (!code.includes('<InstantBrandCustomizer toolTitle={profile.title}')) {
  code = code.replace(sectorTarget.replace(/\n/g, '\r\n'), sectorReplacement.replace(/\n/g, '\r\n'));
  if (!code.includes('<InstantBrandCustomizer toolTitle={profile.title}')) {
    code = code.replace(sectorTarget, sectorReplacement);
  }
}

fs.writeFileSync(pageFile, code, 'utf8');
console.log('Successfully added InstantBrandCustomizer to both views in src/app/tools/[slug]/page.tsx!');
