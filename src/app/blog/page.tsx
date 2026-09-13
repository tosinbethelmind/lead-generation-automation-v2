import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { BlogEngine } from '@/lib/blog/blogEngine';
import { MASTER_PAYOUT } from '@/data/monetizationCatalog';

export const metadata: Metadata = {
  title: 'B2B Commercial Intelligence & Growth Blog | Bethelmind Analytics Lagos',
  description: 'Practical playbooks, market intelligence, solar BOQ models, real estate yields, and AI automation blueprints for Nigerian commercial leaders and diaspora investors.',
  openGraph: {
    title: 'Bethelmind Analytics — B2B Commercial Growth & AI Automation Blog',
    description: 'Practical playbooks on leveraging AI, solar energy, real estate, and B2B automation for rapid commercial growth.',
    url: 'https://www.bethelmindanalytics.com/blog',
    siteName: 'Bethelmind Analytics Lagos Desk',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Bethelmind Analytics Commercial Intelligence Blog',
      },
    ],
    locale: 'en_NG',
    type: 'website',
  },
};

export default function BlogIndexPage() {
  const posts = BlogEngine.getAllPosts();
  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);
  
  const categories = Array.from(new Set(posts.map(p => p.category)));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-slate-950">
      {/* Header Banner */}
      <section className="relative py-20 lg:py-28 overflow-hidden border-b border-slate-800 bg-gradient-to-b from-navy-950 via-slate-950 to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(217,119,6,0.15),transparent_60%)] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest mb-6">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            <span>Live Commercial Intelligence & AI Playbooks</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-6">
            Resources, Field Data & <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">Execution Blueprints</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Data-backed breakdowns on commercial solar payback, off-plan real estate yields, tokunbo customs duties, and autonomous 24/7 AI WhatsApp sales systems.
          </p>
          
          {/* Quick Metrics Bar */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-2xl font-black text-amber-400">30+</div>
              <div className="text-xs text-slate-400 font-medium">Daily Briefings & GEO Guides</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-2xl font-black text-amber-400">&lt; 3s</div>
              <div className="text-xs text-slate-400 font-medium">WhatsApp AI Response Time</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-2xl font-black text-amber-400">₦650k / $499</div>
              <div className="text-xs text-slate-400 font-medium">Verified CleanTech Leads Vault</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-2xl font-black text-amber-400">48h</div>
              <div className="text-xs text-slate-400 font-medium">Turnkey Business Portal SLA</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Categories Bar */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-12 scrollbar-none">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2 whitespace-nowrap">Explore Sectors:</span>
          {categories.map((cat, idx) => (
            <span 
              key={idx}
              className="inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-amber-500/50 cursor-pointer transition-all whitespace-nowrap"
            >
              {cat}
            </span>
          ))}
        </div>

        {/* Featured Top Post */}
        {featuredPost && (
          <div className="mb-16 rounded-3xl overflow-hidden bg-slate-900/70 border border-amber-500/30 shadow-2xl hover:border-amber-400 transition-all group">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-3 text-xs font-bold mb-4">
                    <span className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 uppercase tracking-widest font-black">
                      Featured Blueprint
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-amber-400">{featuredPost.category}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-400">{featuredPost.read_time}</span>
                  </div>
                  <Link href={`/blog/${featuredPost.slug}`}>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white group-hover:text-amber-400 transition-colors leading-tight mb-4">
                      {featuredPost.title}
                    </h2>
                  </Link>
                  <p className="text-slate-300 text-base leading-relaxed mb-6">
                    {featuredPost.excerpt}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-6 border-t border-slate-800">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center font-black text-slate-950 text-sm">
                      OT
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">Oyelakin Tosin</div>
                      <div className="text-xs text-slate-400">Bethelmind Analytics Lagos Desk</div>
                    </div>
                  </div>
                  <Link 
                    href={`/blog/${featuredPost.slug}`}
                    className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all"
                  >
                    Read Blueprint →
                  </Link>
                </div>
              </div>
              <div className="lg:col-span-5 relative min-h-[280px] lg:min-h-full bg-slate-800 overflow-hidden">
                <img 
                  src={featuredPost.featured_image} 
                  alt={featuredPost.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent lg:hidden"></div>
              </div>
            </div>
          </div>
        )}

        {/* All Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {remainingPosts.map((post) => (
            <article 
              key={post.id} 
              className="flex flex-col bg-slate-900/50 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 shadow-lg group"
            >
              <div className="h-48 relative overflow-hidden bg-slate-800">
                <img 
                  src={post.featured_image} 
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-950/80 text-amber-400 border border-amber-500/30 backdrop-blur-sm">
                    {post.category}
                  </span>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow justify-between">
                <div>
                  <div className="flex items-center space-x-2 text-xs text-slate-400 mb-3">
                    <span>{post.read_time}</span>
                    <span>•</span>
                    <span className="text-amber-400/80 font-semibold">{post.views_count.toLocaleString()} Views</span>
                  </div>
                  <Link href={`/blog/${post.slug}`}>
                    <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors leading-snug mb-3">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <Link 
                    href={`/blog/${post.slug}`}
                    className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center space-x-1"
                  >
                    <span>Read Article</span>
                    <span>→</span>
                  </Link>
                  {post.matched_product && (
                    <span className="text-[11px] text-slate-400 font-medium">
                      Includes {post.matched_product.priceNgn} Asset
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Global Conversion & Newsletter Magnet */}
        <section className="mt-24 p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-navy-950 via-slate-900 to-slate-900 border border-amber-500/30 shadow-2xl text-center relative overflow-hidden">
          <div className="max-w-2xl mx-auto relative z-10">
            <span className="text-xs font-black uppercase tracking-widest text-amber-400 block mb-2">Direct Executive Access</span>
            <h3 className="text-2xl sm:text-3xl font-black text-white mb-4">
              Need a Custom 24/7 AI Sales Bot or Done-For-You Business Website?
            </h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
              We deploy 100% turnkey commercial operations portals in 48 hours and 1-line script quote widgets in 10 minutes. Connect directly to our Lagos desk on WhatsApp.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a 
                href={`${MASTER_PAYOUT.whatsappCloser}?text=Hi+Bethelmind,+I+want+to+automate+sales+for+my+business`}
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm tracking-wide shadow-xl hover:scale-105 transition-all"
              >
                💬 Chat with Admin & Closer Desk (0802 279 1227)
              </a>
              <a 
                href="/tools/solar-quote-pro"
                className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 transition-colors"
              >
                ⚡ Explore Solar BOQ Calculator
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
