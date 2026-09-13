import { NextResponse } from 'next/server';
import { BlogEngine } from '@/lib/blog/blogEngine';

export const dynamic = 'force-dynamic';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const post = BlogEngine.getPostBySlug(slug);

    if (!post) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
    }

    // Increment real views count
    const updatedViews = BlogEngine.incrementViews(slug);

    return NextResponse.json({
      success: true,
      post: {
        ...post,
        views_count: updatedViews
      }
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
