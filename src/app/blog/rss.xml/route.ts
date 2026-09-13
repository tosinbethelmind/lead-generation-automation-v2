import { NextResponse } from 'next/server';
import { BlogEngine } from '@/lib/blog/blogEngine';
import { MASTER_PAYOUT } from '@/data/monetizationCatalog';

export const dynamic = 'force-dynamic';

export async function GET() {
  const posts = BlogEngine.getAllPosts();

  const rssItems = posts.map(post => {
    const postUrl = `${MASTER_PAYOUT.website}/blog/${post.slug}`;
    const cleanDesc = post.excerpt.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const cleanTitle = post.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    return `
    <item>
      <title>${cleanTitle}</title>
      <link>${postUrl}</link>
      <guid>${postUrl}</guid>
      <pubDate>${new Date(post.created_at).toUTCString()}</pubDate>
      <description>${cleanDesc}</description>
      <category>${post.category}</category>
      <author>${MASTER_PAYOUT.adminEmail} (Oyelakin Tosin)</author>
    </item>
    `;
  }).join('');

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Bethelmind Analytics Lagos Desk — Commercial Growth & AI Blog</title>
    <link>${MASTER_PAYOUT.website}/blog</link>
    <description>B2B commercial growth playbooks, solar ROI calculators, off-plan real estate models, and AI WhatsApp sales automation.</description>
    <language>en-NG</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${MASTER_PAYOUT.website}/blog/rss.xml" rel="self" type="application/rss+xml"/>
    ${rssItems}
  </channel>
</rss>`;

  return new Response(rssXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
