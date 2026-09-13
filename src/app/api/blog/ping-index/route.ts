import { NextResponse } from 'next/server';
import { GoogleIndexingPinger } from '@/lib/blog/googleIndexingPinger';
import { BlogEngine } from '@/lib/blog/blogEngine';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const posts = BlogEngine.getAllPosts();
    const urls = posts.slice(0, 10).map(p => `https://www.bethelmindanalytics.com/blog/${p.slug}`);

    const pings = await GoogleIndexingPinger.notifyBatchPublished(urls);

    return NextResponse.json({
      success: true,
      message: 'Successfully dispatched instant crawling pings to Google, Bing, and WebSub hubs.',
      totalIndexedPosts: posts.length,
      pings
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const targetUrl = body.url;

    const result = await GoogleIndexingPinger.pingSearchEngines(targetUrl);

    return NextResponse.json({
      success: true,
      message: 'Dispatched Google & Bing crawler notification.',
      result
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
