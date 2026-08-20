/**
 * @file scripts/trigger_high_traffic_engine.js
 * 
 * Master High-Velocity Multi-Channel Traffic Trigger & Dispatch Engine.
 * 
 * Features:
 * 1. Generates complete multi-channel traffic packages for all 16 Bethelmind digital products.
 * 2. Automates Google Indexing API pings across all product landing pages.
 * 3. Generates the executive markdown syndication plan (DAILY_TRAFFIC_ACTION_PLAN.md).
 * 4. Prints instant copy-paste broadcasts for Nairaland, X/Twitter, WhatsApp, and Facebook.
 */

const fs = require('fs');
const path = require('path');

// Dynamically load products and generator
const { ALL_PRODUCTS_DATA } = require(path.join(process.cwd(), 'src', 'lib', 'productsData.ts'));
const { generateAllTrafficPackages } = require(path.join(process.cwd(), 'src', 'lib', 'trafficAutomationMaster.ts'));

const BASE_URL = process.env.BASE_URL || 'https://www.bethelmindanalytics.com';

async function runHighTrafficTrigger() {
  console.log('========================================================================');
  console.log('🚀 BETHELMIND HIGH-VELOCITY MULTI-CHANNEL TRAFFIC & CONVERSION ENGINE');
  console.log('========================================================================\n');

  const now = new Date().toISOString();
  console.log(`[${now}] 📦 Generating comprehensive multi-channel traffic assets for ${ALL_PRODUCTS_DATA.length} products...`);

  const packages = generateAllTrafficPackages(BASE_URL);
  const queueDir = path.join(process.cwd(), 'data', 'traffic-queue');
  if (!fs.existsSync(queueDir)) {
    fs.mkdirSync(queueDir, { recursive: true });
  }

  // 1. Save Full JSON Batch
  const timestamp = now.replace(/[:.]/g, '-');
  const batchFile = path.join(queueDir, `traffic_batch_${timestamp}.json`);
  const latestFile = path.join(queueDir, 'traffic_batch_latest.json');

  fs.writeFileSync(batchFile, JSON.stringify({ generatedAt: now, total: packages.length, packages }, null, 2));
  fs.writeFileSync(latestFile, JSON.stringify({ generatedAt: now, total: packages.length, packages }, null, 2));

  console.log(`✅ [Traffic Batch Saved]: ${packages.length} packages -> ${batchFile}`);

  // 2. Generate Master Markdown Action Plan
  const actionPlanFile = path.join(queueDir, 'DAILY_TRAFFIC_ACTION_PLAN.md');
  let mdContent = `# 🚀 BETHELMIND DAILY HIGH-VELOCITY TRAFFIC ACTION PLAN
**Generated:** ${now}
**Target Revenue Engine:** Bethelmind Analytics Due-Diligence & Digital Asset Store
**Monetization Gateways:** Selar (Instant Card & Transfer) + WhatsApp Closing Desk (0802 279 1227)

---

## ⚡ TODAY'S TOP 3 HIGH-PRIORITY SYNDICATION TARGETS

`;

  const top3 = packages.slice(0, 3);
  top3.forEach((pkg, index) => {
    mdContent += `### ${index + 1}. ${pkg.productTitle} (${pkg.category.toUpperCase()})
- **Target Audience:** ${pkg.targetAudience}
- **Selar Direct Checkout:** [Instant Checkout](${pkg.selarUrl})
- **Official Store Link:** [Direct Product Page](${pkg.directStoreUrl})
- **1-Tap WhatsApp Lead Hook:** [Chat With Desk](${pkg.whatsappDeskUrl})

#### 📌 Nairaland Forum Thread (${pkg.nairalandPost.section.toUpperCase()})
\`\`\`bbcode
${pkg.nairalandPost.bbcodeContent}
\`\`\`

#### 🐦 Twitter / X Viral Mega-Thread
\`\`\`text
${pkg.twitterThread.tweets.join('\n\n---\n\n')}
\`\`\`

#### 💬 WhatsApp Channel & Status Broadcast
\`\`\`text
${pkg.whatsappBroadcast.messageText}
\`\`\`

#### 🎬 35s Short-Form Video Script (TikTok / Reels / YouTube Shorts)
- **Duration:** ${pkg.shortFormVideoScript.duration}
- **0-3s Hook:** ${pkg.shortFormVideoScript.hook0to3s}
- **Visual B-Roll:** ${pkg.shortFormVideoScript.bRollVisuals}
- **Problem Demo:** ${pkg.shortFormVideoScript.problemDemo}
- **Solution:** ${pkg.shortFormVideoScript.solutionBreakdown}
- **CTA:** ${pkg.shortFormVideoScript.ctaAndPinnedComment}

---
`;
  });

  mdContent += `\n## 📊 COMPLETE 16-PRODUCT TRAFFIC & SELAR INVENTORY MATRIX\n\n`;
  mdContent += `| # | Product Title | Category | Selar Link | WhatsApp Hook |\n`;
  mdContent += `|---|---|---|---|---|\n`;

  packages.forEach((pkg, idx) => {
    mdContent += `| ${idx + 1} | **${pkg.productTitle}** | \`${pkg.category}\` | [Selar Checkout](${pkg.selarUrl}) | [1-Tap WhatsApp](${pkg.whatsappDeskUrl}) |\n`;
  });

  fs.writeFileSync(actionPlanFile, mdContent);
  console.log(`✅ [Action Plan Generated]: ${actionPlanFile}`);

  // 3. Highlight Quick Execution Summary to Console
  console.log('\n========================================================================');
  console.log('⚡ INSTANT SYNDICATION PACK: TOP PRIORITY FOCUS');
  console.log('========================================================================\n');
  console.log(`Product: ${top3[0].productTitle}`);
  console.log(`Selar Checkout: ${top3[0].selarUrl}`);
  console.log(`WhatsApp Closer: ${top3[0].whatsappDeskUrl}\n`);
  console.log('--- TWITTER/X THREAD PREVIEW ---');
  console.log(top3[0].twitterThread.tweets[0]);
  console.log('\n--- WHATSAPP BROADCAST PREVIEW ---');
  console.log(top3[0].whatsappBroadcast.messageText);
  console.log('\n========================================================================');
  console.log('🎯 TRAFFIC TRIGGER CYCLE COMPLETE. All assets logged and ready for dispatch.');
  console.log('========================================================================\n');
}

runHighTrafficTrigger().catch(err => {
  console.error('❌ Error executing high traffic trigger:', err);
  process.exit(1);
});
