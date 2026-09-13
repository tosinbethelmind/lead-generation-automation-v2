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
    alternates: {
      canonical: url,
    },
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

  if (!post) {
    notFound();
  }

  // Increment real-time view counter
  BlogEngine.incrementViews(slug);

  // Apply automated internal link optimization
  const optimizedContent = InternalLinkOptimizer.optimizeLinks(post.content_html);

  const relatedPosts = BlogEngine.getAllPosts()
    .filter(p => p.slug !== post.slug)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-slate-950 pb-24">
      {/* Schema.org Structured Data Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(post.schema_ld) }}
      />
      {post.faq_schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(post.faq_schema) }}
        />
      )}

      {/* Breadcrumb Navigation */}
      <nav className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-6 text-xs text-slate-400 flex items-center space-x-2">
        <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/blog" className="hover:text-amber-400 transition-colors">Blog</Link>
        <span>/</span>
        <span className="text-amber-400 truncate max-w-xs">{post.category}</span>
      </nav>

      {/* Article Header */}
      <header className="max-w-4xl mx-auto px-4 sm:px-6 mb-10">
        <div className="flex flex-wrap items-center gap-3 text-xs font-bold mb-4">
          <span className="px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 uppercase tracking-wider">
            {post.category}
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-300">{post.read_time}</span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-400">{post.views_count.toLocaleString()} Views</span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-400">Virality Index: {post.virality_score}%</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight mb-6">
          {post.title}
        </h1>

        <div className="flex items-center justify-between py-4 border-y border-slate-800 text-xs text-slate-300">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center font-black text-slate-950 text-sm">
              OT
            </div>
            <div>
              <div className="font-bold text-white">Oyelakin Tosin</div>
              <div className="text-slate-400">Lead Systems Engineer • Bethelmind Analytics Lagos Desk</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-slate-400">Updated for 2026 Operations</div>
            <div className="text-amber-400 font-semibold">Verified Executive Briefing</div>
          </div>
        </div>
      </header>

      {/* Featured Banner Image */}
      {post.featured_image && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-12">
          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
            <img 
              src={post.featured_image} 
              alt={post.title} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Article Content Container */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6">
        <div 
          className="prose prose-invert prose-amber max-w-none 
            prose-headings:font-black prose-headings:tracking-tight prose-headings:text-white
            prose-h2:text-2xl prose-h2:sm:text-3xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:border-b prose-h2:border-slate-800 prose-h2:pb-3
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-amber-400
            prose-p:text-slate-300 prose-p:text-base prose-p:leading-relaxed prose-p:mb-6
            prose-strong:text-white prose-strong:font-bold
            prose-ul:my-6 prose-ul:space-y-2 prose-li:text-slate-300
            prose-ol:my-6 prose-ol:space-y-3 prose-li:text-slate-300
            prose-a:text-amber-400 prose-a:underline hover:prose-a:text-amber-300"
          dangerouslySetInnerHTML={{ __html: optimizedContent }}
        />

        {/* Matched Operational Asset / Digital Product Card with Direct OPay Modal */}
        {post.matched_product && (
          <ArticleProductCard product={post.matched_product} />
        )}

        {/* Embedded Interactive Lead Capture Calculator */}
        <InteractiveCalculators niche={post.category} articleTitle={post.title} />

        {/* 1-Tap WhatsApp Conversion Anchor */}
        <div className="my-16 p-8 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-navy-950 border-2 border-amber-500/50 shadow-2xl text-center">
          <span className="text-xs font-black uppercase tracking-widest text-amber-400 block mb-2">Instant Business Execution</span>
          <h3 className="text-2xl font-black text-white mb-3">
            Want to Deploy This in Your Business in Under 48 Hours?
          </h3>
          <p className="text-slate-300 text-sm max-w-2xl mx-auto mb-6 leading-relaxed">
            Our Lagos closer desk builds turnkey business websites (₦75k deposit / ₦150k setup), installs 1-line script quote widgets (₦35k/₦65k), and delivers verified sector lead packs with 100% money-back verification.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a 
              href={`${MASTER_PAYOUT.whatsappCloser}?text=Hi+Bethelmind,+I+read+your+article+'${encodeURIComponent(post.title)}'+and+want+to+consult+with+your+desk`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm tracking-wide shadow-xl hover:scale-105 transition-all"
            >
              💬 Claim 1-on-1 Consultation on WhatsApp (0802 279 1227) →
            </a>
            <a 
              href="/marketplace"
              className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 transition-colors"
            >
              Explore Digital Assets & Leads Vault
            </a>
          </div>
        </div>

        {/* Social Distribution & Syndication Triggers */}
        <SocialShareHub 
          title={post.title} 
          slug={post.slug} 
          whatsappSnippet={post.social_snippets?.whatsapp} 
          twitterSnippet={post.social_snippets?.twitter} 
          linkedinSnippet={post.social_snippets?.linkedin} 
        />
      </article>

      {/* Related Blueprints Grid */}
      {relatedPosts.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 mt-20 pt-12 border-t border-slate-800">
          <h3 className="text-2xl font-black text-white mb-8">Related Commercial Playbooks</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map(rel => (
              <div key={rel.id} className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-2">{rel.category}</span>
                  <Link href={`/blog/${rel.slug}`}>
                    <h4 className="text-sm font-bold text-white hover:text-amber-400 transition-colors mb-2 line-clamp-2">
                      {rel.title}
                    </h4>
                  </Link>
                  <p className="text-xs text-slate-400 line-clamp-3 mb-4">{rel.excerpt}</p>
                </div>
                <Link href={`/blog/${rel.slug}`} className="text-xs font-bold text-amber-400 hover:text-amber-300">
                  Read Playbook →
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
