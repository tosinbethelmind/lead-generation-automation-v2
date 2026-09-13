import { NextResponse } from 'next/server';
import { BlogEngine } from '@/lib/blog/blogEngine';
import { AutonomousViralBlogDaemon } from '@/lib/blog/autonomousViralBlogDaemon';
import { GoogleIndexingPinger } from '@/lib/blog/googleIndexingPinger';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    let posts = BlogEngine.getAllPosts();

    if (category && category !== 'All') {
      posts = posts.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      posts = posts.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.excerpt.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({
      success: true,
      total: posts.length,
      posts: posts.slice(0, limit)
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const count = parseInt(body.count || '5', 10);

    const result = AutonomousViralBlogDaemon.generateDailyBatch(count);

    // Asynchronously ping Google, Bing, and WebSub with new URLs
    const urls = result.posts.map(p => `https://www.bethelmindanalytics.com/blog/${p.slug}`);
    GoogleIndexingPinger.notifyBatchPublished(urls).catch(err => {
      console.warn('[POST /api/blog] Google indexing ping failed:', err.message);
    });

    return NextResponse.json({
      success: true,
      message: `Generated and indexed ${result.generated} high-ranking commercial blog articles.`,
      generatedCount: result.generated,
      newPosts: result.posts.map(p => ({
        slug: p.slug,
        title: p.title,
        category: p.category,
        url: `https://www.bethelmindanalytics.com/blog/${p.slug}`
      }))
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
