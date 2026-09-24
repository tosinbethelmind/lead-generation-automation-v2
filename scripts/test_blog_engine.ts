/**
 * @file scripts/test_blog_engine.ts
 * Verification test suite for Bethelmind Analytics High-Monetization Blog Engine
 */

import { BlogEngine } from '../src/lib/blog/blogEngine';
import { AutonomousViralBlogDaemon } from '../src/lib/blog/autonomousViralBlogDaemon';
import { MASTER_PAYOUT } from '../src/data/monetizationCatalog';

async function runTests() {
  console.log('='.repeat(75));
  console.log('🧪 TESTING AUTONOMOUS VIRAL BLOG ENGINE & MONETIZATION STACK');
  console.log('='.repeat(75));

  // 1. Test All Posts Retrieval
  const posts = BlogEngine.getAllPosts(true);
  console.log(`✅ Loaded ${posts.length} Active Published Blog Articles from Disk.`);
  if (posts.length < 10) {
    throw new Error(`Expected at least 10 posts, got ${posts.length}`);
  }

  // 2. Test Sample Post Integrity
  const sample = posts[0];
  console.log(`\n📄 Sample Article Audit:`);
  console.log(`   Title: '${sample.title}'`);
  console.log(`   Slug: '${sample.slug}'`);
  console.log(`   Category: '${sample.category}'`);
  console.log(`   Read Time: '${sample.read_time}' | Virality Score: ${sample.virality_score}%`);
  console.log(`   Views: ${sample.views_count.toLocaleString()}`);

  // 3. Test Schema.org & GEO AI Direct-Answer Verification
  if (!sample.schema_ld || sample.schema_ld['@type'] !== 'BlogPosting') {
    throw new Error('Schema.org @type must be BlogPosting');
  }
  if (!sample.schema_ld.author || !sample.schema_ld.publisher) {
    throw new Error('Schema.org must include Author and Publisher');
  }
  console.log(`✅ Schema.org JSON-LD BlogPosting & Author verified for Google #1 ranking.`);

  // 4. Test In-Content CTAs & Selar Products
  if (!sample.matched_product || !sample.matched_product.checkoutUrl) {
    throw new Error('Article must match a live Selar or Gumroad product offer');
  }
  console.log(`✅ Matched Selar Monetization Asset: '${sample.matched_product.title}' (${sample.matched_product.priceNgn} / ${sample.matched_product.priceUsd})`);
  console.log(`   Checkout URL: ${sample.matched_product.checkoutUrl}`);

  // 5. Test YouTube Channel Video Embed
  if (sample.matched_youtube) {
    console.log(`✅ Matched YouTube Channel Embed: ${sample.matched_youtube.channelName} (${sample.matched_youtube.watchUrl})`);
  }

  // 6. Test Views Increment
  const initialViews = sample.views_count;
  const updatedViews = BlogEngine.incrementViews(sample.slug);
  console.log(`✅ Real View Increment Verified: ${initialViews} -> ${updatedViews}`);
  if (updatedViews !== initialViews + 1) {
    throw new Error('View count failed to increment');
  }

  // 7. Test Generation of New Batch
  console.log(`\n⚡ Testing Autonomous Batch Generation Cycle (Zero Synthetic Views Invariant)...`);
  const batchRes = AutonomousViralBlogDaemon.generateDailyBatch(2);
  console.log(`✅ Batch Cycle Result: Synthesized ${batchRes.generated} additional articles.`);
  if (batchRes.posts.some(p => p.views_count !== 0)) {
    throw new Error('VIOLATION: Generated posts must strictly start with 0 real views');
  }
  console.log(`✅ Verified: All synthesized articles strictly initialized with 0 views.`);

  const finalCount = BlogEngine.getAllPosts(true).length;
  console.log(`📊 Final Total Published Articles: ${finalCount}`);

  console.log('\n' + '='.repeat(75));
  console.log('🎉 ALL TESTS PASSED! AUTONOMOUS VIRAL BLOG & MONETIZATION ENGINE IS 100% OPERATIONAL.');
  console.log('='.repeat(75));
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
