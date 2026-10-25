const fs = require('fs');
const path = require('path');

const filePath = path.join('c:/Users/HomePC/Desktop/website Projects/lead generation automation/src/app/tools/[slug]/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add TurnkeyAdBanner import if not present
if (!content.includes('TurnkeyAdBanner')) {
  content = content.replace(
    "import IntegrationBlueprintDashboard from '@/components/IntegrationBlueprintDashboard';",
    "import IntegrationBlueprintDashboard from '@/components/IntegrationBlueprintDashboard';\r\nimport TurnkeyAdBanner from '@/components/TurnkeyAdBanner';"
  );
}

// 2. Add Top and Bottom TurnkeyAdBanner around the iframe section
if (!content.includes('<TurnkeyAdBanner position="top"')) {
  const iframeTarget = '{/* Interactive Calculator Embed Frame */}';
  content = content.replace(
    iframeTarget,
    '{/* Top Turnkey Monetization Banner */}\r\n          <TurnkeyAdBanner position="top" category={viralTool.category} />\r\n\r\n          ' + iframeTarget
  );
}

if (!content.includes('<TurnkeyAdBanner position="bottom"')) {
  const offerTarget = '{/* Digital Upsell & Monetization Offer Card */}';
  content = content.replace(
    offerTarget,
    '{/* Bottom Turnkey Monetization Banner */}\r\n          <TurnkeyAdBanner position="bottom" category={viralTool.category} />\r\n\r\n          ' + offerTarget
  );
}

// 3. Add WhatsApp Share Button in header action buttons
if (!content.includes('title="Share Tool on WhatsApp"')) {
  const searchPattern = /<a\s+href=\{`https:\/\/wa\.me\/2348022791227/g;
  const match = searchPattern.exec(content);
  if (match) {
    const idx = match.index;
    const shareBtn = `<a
                  href={\`https://wa.me/?text=\${encodeURIComponent(\`Check out this free tool: *\${viralTool.title}* on Bethelmind Analytics!\\nhttps://www.bethelmindanalytics.com/tools/\${cleanSlug}\`)}\`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/10 text-xs font-bold transition-all shadow-sm"
                  title="Share Tool on WhatsApp"
                >
                  <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden sm:inline">Share</span>
                </a>

                `;
    content = content.slice(0, idx) + shareBtn + content.slice(idx);
  }
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully injected TurnkeyAdBanner & WhatsApp Share into tools/[slug]/page.tsx!');
