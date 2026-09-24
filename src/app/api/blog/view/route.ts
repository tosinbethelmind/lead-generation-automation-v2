import { NextResponse } from 'next/server';
import { BlogEngine } from '@/lib/blog/blogEngine';
import * as fs from 'fs';
import * as path from 'path';

export const dynamic = 'force-dynamic';

const TELEMETRY_FILE = path.join(process.cwd(), 'local_db', 'blog_telemetry.json');

function recordTelemetryEvent(event: Record<string, any>) {
  try {
    const dir = path.dirname(TELEMETRY_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    let existing: any[] = [];
    if (fs.existsSync(TELEMETRY_FILE)) {
      try {
        existing = JSON.parse(fs.readFileSync(TELEMETRY_FILE, 'utf-8'));
        if (!Array.isArray(existing)) existing = [];
      } catch {
        existing = [];
      }
    }

    existing.push(event);

    // Keep the last 10,000 real events to conserve disk space
    if (existing.length > 10000) {
      existing = existing.slice(-10000);
    }

    fs.writeFileSync(TELEMETRY_FILE, JSON.stringify(existing, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[BlogTelemetry] Failed recording event to disk:', err);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      slug,
      eventType = 'page_view',
      referrer = '',
      utmSource = '',
      utmMedium = '',
      utmCampaign = '',
      scrollDepth = 0,
      dwellSeconds = 0,
      ctaTarget = '',
      sessionId = '',
    } = body;

    if (!slug || typeof slug !== 'string') {
      return NextResponse.json({ success: false, error: 'Valid article slug required' }, { status: 400 });
    }

    const post = BlogEngine.getPostBySlug(slug);
    if (!post) {
      return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });
    }

    // Filter out obvious search engine crawlers or headless bots
    const userAgent = req.headers.get('user-agent') || '';
    const isBot = /bot|googlebot|crawler|spider|robot|crawling|ahrefs|semrush|bingbot|yandex|bytespider/i.test(userAgent);

    if (isBot) {
      return NextResponse.json({
        success: true,
        slug,
        views_count: post.views_count,
        note: 'Bot visit filtered out from real view tally',
      });
    }

    const timestamp = new Date().toISOString();
    let updatedViews = post.views_count;

    if (eventType === 'page_view') {
      // Increment persistent counter only on genuine initial page view
      updatedViews = BlogEngine.incrementViews(slug);
    }

    // Record verified telemetry event
    recordTelemetryEvent({
      timestamp,
      slug,
      category: post.category,
      eventType,
      referrer: referrer.slice(0, 300),
      utmSource: utmSource.slice(0, 100),
      utmMedium: utmMedium.slice(0, 100),
      utmCampaign: utmCampaign.slice(0, 100),
      scrollDepth: Number(scrollDepth) || 0,
      dwellSeconds: Number(dwellSeconds) || 0,
      ctaTarget: ctaTarget.slice(0, 100),
      sessionId: sessionId.slice(0, 100),
    });

    return NextResponse.json({
      success: true,
      slug,
      eventType,
      views_count: updatedViews,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
