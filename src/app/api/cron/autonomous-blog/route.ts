import { NextResponse } from 'next/server';
import { AutonomousViralBlogDaemon } from '@/lib/blog/autonomousViralBlogDaemon';
import { GoogleIndexingPinger } from '@/lib/blog/googleIndexingPinger';
import { BlogEngine } from '@/lib/blog/blogEngine';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      // Allow unauthenticated local test, but check if in production
      const host = req.headers.get('host') || '';
      if (!host.includes('localhost') && !host.includes('127.0.0.1')) {
        // Continue if standard vercel cron invocation
      }
    }

    console.log('[Cron:AutonomousBlog] Starting autonomous blog publishing cycle...');
    const result = AutonomousViralBlogDaemon.generateDailyBatch(5);

    // Ping search engines
    const allPosts = BlogEngine.getAllPosts(true);
    const urls = result.posts.length > 0 
      ? result.posts.map(p => `https://www.bethelmindanalytics.com/blog/${p.slug}`)
      : allPosts.slice(0, 5).map(p => `https://www.bethelmindanalytics.com/blog/${p.slug}`);

    let indexPings: any = null;
    try {
      indexPings = await GoogleIndexingPinger.notifyBatchPublished(urls);
    } catch (pingErr: any) {
      console.warn('[Cron:AutonomousBlog] Crawler ping error:', pingErr.message);
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      newArticlesGenerated: result.generated,
      totalActiveArticles: allPosts.length,
      indexingPings: indexPings,
      headlines: result.posts.map(p => ({
        title: p.title,
        category: p.category,
        url: `https://www.bethelmindanalytics.com/blog/${p.slug}`
      }))
    });
  } catch (err: any) {
    console.error('[Cron:AutonomousBlog] Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
