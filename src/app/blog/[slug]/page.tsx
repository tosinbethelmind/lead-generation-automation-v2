import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { BlogEngine } from '@/lib/blog/blogEngine';
import { MASTER_PAYOUT } from '@/data/monetizationCatalog';

import { InternalLinkOptimizer } from '@/lib/blog/internalLinkOptimizer';
import { InteractiveCalculators } from '@/components/blog/InteractiveCalculators';
import { ArticleProductCard } from '@/components/blog/ArticleProductCard';
import { SocialShareHub } from '@/components/blog/SocialShareHub';
import { BlogViewTracker } from '@/components/blog/BlogViewTracker';
import { AnswerThePublicEngine } from '@/lib/blog/answerThePublicEngine';
import { StickyMonetizationBar } from '@/components/blog/StickyMonetizationBar';
import { ExitIntentOfferModal } from '@/components/blog/ExitIntentOfferModal';
import { MidArticleCallout } from '@/components/blog/MidArticleCallout';

export const dynamicParams = true;

export async function generateStaticParams() {
  const posts = BlogEngine.getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = BlogEngine.getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Article Not Found | Bethelmind Analytics Lagos',
      description: 'The requested commercial intelligence article could not be located.',
    };
  }

  const url = `https://www.bethelmindanalytics.com/blog/${post.slug}`;

  return {
    title: `${post.title} | Bethelmind Analytics Lagos`,
    description: post.excerpt,
    keywords: [post.category, 'AI Automation', 'Solar ROI', 'Lagos Business', 'Nigeria 2026', 'Selar Digital Products'],
    authors: [{ name: 'Oyelakin Tosin', url: 'https://www.bethelmindanalytics.com' }],
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      siteName: 'Bethelmind Analytics Lagos Desk',
      images: [
        {
          url: post.featured_image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      type: 'article',
      publishedTime: post.created_at,
      authors: ['Oyelakin Tosin'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.featured_image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80'],
    },
  };
}

export default async function SingleBlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = BlogEngine.getPostBySlug(slug);

  if (!post) notFound();

  // Strip legacy duplicate in-body AI overview card if present (hero section already renders it)
  const sanitizedHtml = (post.content_html || '').replace(/<div class="ai-overview-card[\s\S]*?<\/div>\s*<\/div>/i, '');
  const optimizedContent = InternalLinkOptimizer.optimizeLinks(sanitizedHtml);
  const relatedPosts = BlogEngine.getAllPosts().filter((p) => p.slug !== post.slug).slice(0, 3);

  const publishDate = new Date(post.created_at).toLocaleDateString('en-NG', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  const intentCluster = AnswerThePublicEngine.getIntentCluster(post.category);
  const faqSchema = post.faq_schema || AnswerThePublicEngine.generateFaqSchema(intentCluster);
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.bethelmindanalytics.com' },
      { '@type': 'ListItem', position: 2, name: 'Commercial Blog', item: 'https://www.bethelmindanalytics.com/blog' },
      { '@type': 'ListItem', position: 3, name: post.title, item: `https://www.bethelmindanalytics.com/blog/${post.slug}` }
    ]
  };

  return (
    <div
      className="min-h-screen text-slate-100 selection:bg-amber-400 selection:text-slate-950"
      style={{ background: 'linear-gradient(160deg, #030712 0%, #070a14 50%, #0a0f1e 100%)' }}
    >
      {/* Schema.org JSON-LD (SEO & Generative Engine Optimization) */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(post.schema_ld) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* ─── AMBIENT HEADER BG ─── */}
      <div
        className="pointer-events-none fixed top-0 left-0 right-0 h-[70vh] z-0"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.07) 0%, transparent 65%)' }}
      />

      {/* ─── TOP NAV STRIP ─── */}
      <div className="relative z-10 border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
            <span className="text-slate-700">/</span>
            <Link href="/blog" className="hover:text-amber-400 transition-colors">Blog</Link>
            <span className="text-slate-700">/</span>
            <span className="text-amber-400 truncate max-w-[180px] sm:max-w-xs">{post.category}</span>
          </nav>
          {/* CTA pill */}
          <a
            href={`${MASTER_PAYOUT.whatsappCloser}?text=Hi+Bethelmind,+saw+your+article+on+${encodeURIComponent(post.title)}`}
            target="_blank" rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold text-slate-950 transition-all hover:scale-105"
            style={{ background: 'linear-gradient(90deg, #f59e0b, #fbbf24)' }}
          >
            💬 Ask Lagos Desk
          </a>
        </div>
      </div>

      {/* ─── ARTICLE HERO HEADER ─── */}
      <header className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-12 pb-8">
        {/* Category + meta row */}
        <div className="flex flex-wrap items-center gap-2.5 mb-6">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest text-slate-950"
            style={{ background: 'linear-gradient(90deg, #f59e0b, #fbbf24)' }}
          >
            {post.category}
          </span>
          <span
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border border-white/10 text-slate-400"
            style={{ background: 'rgba(255,255,255,0.04)' }}
          >
            {post.read_time}
          </span>
          <BlogViewTracker slug={post.slug} initialViews={post.views_count} />
          {post.views_count >= 50 && (
            <span
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider text-slate-950"
              style={{ background: 'linear-gradient(90deg, #f59e0b, #fbbf24)' }}
            >
              Trending 🔥
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight mb-8">
          {post.title}
        </h1>

        {/* Author row */}
        <div
          className="flex items-center justify-between py-4 border-y"
          style={{ borderColor: 'rgba(255,255,255,0.08)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center font-black text-sm text-slate-950 shrink-0 ring-2 ring-amber-400/30"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #fbbf24)' }}
            >
              OT
            </div>
            <div>
              <div className="text-sm font-bold text-white">Oyelakin Tosin</div>
              <div className="text-xs text-slate-500">Lead Systems Engineer &middot; Bethelmind Analytics Lagos</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-500">{publishDate}</div>
            <div
              className="text-[11px] font-bold mt-0.5"
              style={{ color: '#34d399' }}
            >
              ✓ Verified Briefing
            </div>
          </div>
        </div>
      </header>

      {/* ─── FEATURED IMAGE ─── */}
      {post.featured_image && (
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 mb-12">
          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border shadow-2xl"
            style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, rgba(7,10,20,0.4) 0%, transparent 50%)' }}
            />
          </div>
        </div>
      )}

      {/* ─── AI OVERVIEW & EXECUTIVE DIRECT-ANSWER (GEO CRAWLER CITATION MAGNET) ─── */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 mb-10">
        <div
          className="p-6 sm:p-8 rounded-2xl border relative overflow-hidden shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(26, 16, 64, 0.92))',
            borderColor: 'rgba(245, 158, 11, 0.45)',
          }}
        >
          <div className="flex items-center gap-2.5 mb-3">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-amber-400 text-slate-950 font-black text-xs">
              AI
            </span>
            <span className="text-xs font-black uppercase tracking-widest text-amber-400">
              Executive Direct-Answer &amp; Generative AI Overview
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white mb-2 leading-snug">
            {intentCluster.questions[0]?.question || post.title}
          </h3>
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed mb-4">
            {intentCluster.questions[0]?.directAnswer || post.excerpt}
          </p>
          <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              ✓ Verified by Bethelmind Analytics Lagos Desk
            </span>
            <span className="text-amber-400/90 font-semibold">
              Primary Search Intent: {intentCluster.primaryKeyword}
            </span>
          </div>
        </div>
      </section>

      {/* ─── ARTICLE BODY ─── */}
      <article className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
        <div
          className="prose prose-invert prose-amber max-w-none
            prose-headings:font-black prose-headings:tracking-tight prose-headings:text-white
            prose-h2:text-2xl prose-h2:sm:text-3xl prose-h2:mt-14 prose-h2:mb-5
            prose-h2:border-b prose-h2:pb-3
            prose-h3:text-xl prose-h3:mt-10 prose-h3:mb-3 prose-h3:text-amber-400
            prose-p:text-slate-300 prose-p:text-[1.05rem] prose-p:leading-[1.85] prose-p:mb-6
            prose-strong:text-white prose-strong:font-bold
            prose-ul:my-6 prose-ul:space-y-2 prose-li:text-slate-300
            prose-ol:my-6 prose-ol:space-y-3 prose-li:text-slate-300
            prose-a:text-amber-400 prose-a:no-underline hover:prose-a:underline hover:prose-a:text-amber-300
            prose-blockquote:border-l-amber-400 prose-blockquote:bg-amber-400/5 prose-blockquote:rounded-r-xl prose-blockquote:py-2 prose-blockquote:px-5"
          dangerouslySetInnerHTML={{ __html: optimizedContent }}
        />

        {/* Mid-Article Sector High-Ticket Prototype Callout */}
        <MidArticleCallout category={post.category} postTitle={post.title} />

        {/* Matched Product Card */}
        {post.matched_product && <ArticleProductCard product={post.matched_product} />}

        {/* Interactive Calculators */}
        <InteractiveCalculators category={post.category} />

        {/* Bottom CTA */}
        <div
          className="my-14 p-8 sm:p-10 rounded-2xl border relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(15,23,42,0.95), rgba(26,16,64,0.9))',
            borderColor: 'rgba(245,158,11,0.25)',
          }}
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.10) 0%, transparent 70%)' }}
          />
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div className="flex-1">
              <div className="text-xs font-black uppercase tracking-widest text-amber-400 mb-2">100% Done-For-You</div>
              <h4 className="text-xl font-black text-white mb-1">Turnkey Commercial Portal (&#8358;75k Deposit / &#8358;150k)</h4>
              <p className="text-slate-400 text-sm">
                Custom domain, Google Maps SEO, 24/7 AI WhatsApp bot, and Vercel staging &mdash; live in 48 hours.
              </p>
            </div>
            <div className="flex flex-col sm:items-end gap-2.5 shrink-0">
              <a
                href={`${MASTER_PAYOUT.whatsappCloser}?text=Hi+Bethelmind,+I+want+to+claim+the+Turnkey+Business+Portal+after+reading+${encodeURIComponent(post.title)}`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm text-slate-950 transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]"
                style={{ background: 'linear-gradient(90deg, #f59e0b, #fbbf24)' }}
              >
                💬 Claim via WhatsApp
              </a>
              <a
                href="/preview/claim"
                className="text-xs text-amber-400 hover:text-amber-300 transition-colors font-semibold"
              >
                Or view free prototype demo →
              </a>
            </div>
          </div>
        </div>

        {/* ─── VISIBLE FREQUENTLY ASKED QUESTIONS (GEO & SGE RICH SNIPPETS) ─── */}
        <section className="my-14 pt-10 border-t border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-black uppercase tracking-widest text-amber-400">Commercial Due Diligence</span>
          </div>
          <h3 className="text-2xl font-black text-white mb-6 tracking-tight">
            Frequently Asked Questions &amp; Executive Inquiries
          </h3>
          <div className="space-y-4">
            {intentCluster.questions.map((q, idx) => (
              <details
                key={idx}
                className="group rounded-xl border border-white/10 p-5 transition-colors open:border-amber-400/40"
                style={{ background: 'rgba(255, 255, 255, 0.02)' }}
              >
                <summary className="font-bold text-white text-base cursor-pointer list-none flex items-center justify-between gap-4">
                  <span>{q.question}</span>
                  <span className="text-amber-400 text-lg transition-transform group-open:rotate-45 shrink-0">+</span>
                </summary>
                <p className="mt-3 text-sm text-slate-300 leading-relaxed pt-3 border-t border-white/5">
                  {q.directAnswer}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* ─── AUTHOR & E-E-A-T CREDENTIALS CARD ─── */}
        <div
          className="my-10 p-6 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ background: 'rgba(255, 255, 255, 0.03)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center font-black text-base text-slate-950 shrink-0"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #fbbf24)' }}
            >
              OT
            </div>
            <div>
              <div className="text-sm font-bold text-white">Editorial Review: Oyelakin Tosin</div>
              <div className="text-xs text-slate-400 mt-0.5">
                Lead Systems Engineer &middot; Bethelmind Analytics Lagos Desk (Verified NIP Settlement Desk)
              </div>
            </div>
          </div>
          <a
            href={`${MASTER_PAYOUT.whatsappCloser}?text=Hi+Bethelmind,+question+about+${encodeURIComponent(post.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors border border-amber-400/30 px-4 py-2 rounded-xl"
          >
            Direct Verification Hotline ↗
          </a>
        </div>

        {/* Social Share Hub */}
        <SocialShareHub
          title={post.title}
          slug={post.slug}
          whatsappSnippet={post.social_snippets?.whatsapp}
          twitterSnippet={post.social_snippets?.twitter}
          linkedinSnippet={post.social_snippets?.linkedin}
        />
      </article>

      {/* ─── RELATED ARTICLES ─── */}
      {relatedPosts.length > 0 && (
        <section
          className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 mt-20 pt-12 pb-24"
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
        >
          <h3 className="text-xl font-black text-white mb-8 tracking-tight">Related Commercial Playbooks</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {relatedPosts.map((rel) => (
              <Link key={rel.id} href={`/blog/${rel.slug}`} className="group block">
                <div
                  className="h-full p-5 rounded-2xl border border-white/7 transition-all duration-300 hover:border-amber-400/35 hover:-translate-y-0.5 flex flex-col justify-between"
                  style={{ background: 'rgba(255,255,255,0.025)' }}
                >
                  <div>
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-2">
                      {rel.category}
                    </span>
                    <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors mb-2 line-clamp-2 leading-snug">
                      {rel.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">{rel.excerpt}</p>
                  </div>
                  <span className="text-xs font-bold text-amber-400 group-hover:text-amber-300 flex items-center gap-1">
                    Read Playbook
                    <span className="group-hover:translate-x-0.5 transition-transform inline-block">→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ─── STICKY BOTTOM CONVERSION BAR (MOBILE & DESKTOP) ─── */}
      <StickyMonetizationBar product={post.matched_product} postTitle={post.title} />

      {/* ─── EXIT INTENT HIGH-CONVERSION MODAL ─── */}
      <ExitIntentOfferModal />
    </div>
  );
}
