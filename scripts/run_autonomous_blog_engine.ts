/**
 * @file scripts/run_autonomous_blog_engine.ts
 * 
 * 🚀 High-Volume 30+ Posts/Day Autonomous Blog Publishing Daemon
 * Bethelmind Analytics Lagos Desk (www.bethelmindanalytics.com)
 * 
 * Usage:
 *   npx tsx scripts/run_autonomous_blog_engine.ts --batch=30
 *   npx tsx scripts/run_autonomous_blog_engine.ts --daemon
 */

import { AutonomousViralBlogDaemon } from '../src/lib/blog/autonomousViralBlogDaemon';
import { BlogEngine } from '../src/lib/blog/blogEngine';
import { GoogleIndexingPinger } from '../src/lib/blog/googleIndexingPinger';

async function main() {
  const args = process.argv.slice(2);
  const isDaemon = args.includes('--daemon');
  
  let targetBatch = 5;
  const batchArg = args.find(a => a.startsWith('--batch='));
  if (batchArg) {
    targetBatch = parseInt(batchArg.split('=')[1], 10) || 5;
  }

  console.log('='.repeat(75));
  console.log('📰 BETHELMIND ANALYTICS AUTONOMOUS VIRAL BLOG PUBLISHING ENGINE');
  console.log('='.repeat(75));
  console.log(`⚡ Mode: ${isDaemon ? '24/7 Autonomous Daemon (30+ Posts/Day)' : `One-Shot Batch (${targetBatch} Articles)`}`);

  const runBatch = async () => {
    console.log(`\n[${new Date().toISOString()}] Initiating generation cycle...`);
    const res = AutonomousViralBlogDaemon.generateDailyBatch(targetBatch);
    console.log(`✅ Cycle Complete: ${res.generated} new high-ranking articles synthesized and saved to disk.`);
    
    const allPosts = BlogEngine.getAllPosts(true);
    console.log(`📊 Total Active Published Blog Articles: ${allPosts.length}`);
    
    if (res.posts.length > 0) {
      console.log('\n📄 Newly Published Headlines:');
      res.posts.forEach((p, idx) => {
        console.log(`  ${idx + 1}. [${p.category}] ${p.title}`);
        console.log(`     URL: https://www.bethelmindanalytics.com/blog/${p.slug}`);
        if (p.matched_product) {
          console.log(`     Monetization Asset: ${p.matched_product.title} (${p.matched_product.priceNgn})`);
        }
      });

      console.log('\n📡 Dispatching real-time Google & Bing crawler notifications...');
      const urls = res.posts.map(p => `https://www.bethelmindanalytics.com/blog/${p.slug}`);
      await GoogleIndexingPinger.notifyBatchPublished(urls);
      console.log('⚡ Indexing pings dispatched successfully!');
    }
  };

  // Run initial batch
  await runBatch();

  if (isDaemon) {
    console.log('\n🔄 Daemon active: Generating fresh articles every 45 minutes to maintain 30+ posts/day target...');
    // Every 45 minutes generate another batch of 1-2 articles
    setInterval(() => {
      runBatch();
    }, 45 * 60 * 1000);
  }
}

main().catch(err => {
  console.error('Fatal error in autonomous blog engine:', err);
  process.exit(1);
});
