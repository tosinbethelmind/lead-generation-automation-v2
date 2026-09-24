import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { BlogEngine } from '@/lib/blog/blogEngine';
import { MASTER_PAYOUT } from '@/data/monetizationCatalog';
import { FeaturedMonetizationVault } from '@/components/blog/FeaturedMonetizationVault';

export const metadata: Metadata = {
  title: 'B2B Commercial Intelligence & Growth Blog | Bethelmind Analytics Lagos',
  description:
    'Practical playbooks, market intelligence, solar BOQ models, real estate yields, and AI automation blueprints for Nigerian commercial leaders and diaspora investors.',
  openGraph: {
    title: 'Bethelmind Analytics — B2B Commercial Growth & AI Automation Blog',
    description:
      'Practical playbooks on leveraging AI, solar energy, real estate, and B2B automation for rapid commercial growth.',
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

const CATEGORY_ICONS: Record<string, string> = {
  'CleanTech & Solar Energy': '⚡',
  'Logistics, Haulage & Supply Chain': '🚛',
  'Hospitality & Luxury Shortlets': '🏨',
  'Healthcare & Clinic Management': '🏥',
  'AI & Enterprise Automation': '🤖',
  'Real Estate & Diaspora Wealth': '🏗️',
  'Auto Clearing & Customs Logistics': '🚢',
  'Private Education & Schools': '🎓',
  'Beauty, Spas & Wellness': '💇‍♀️',
  'Corporate Compliance, CAC & Legal Ops': '⚖️',
  'Retail, E-Commerce & Fraud Prevention': '🛍️',
  'Construction, POP & Building Material Estimating': '🧱',
  'Agribusiness, Aquaculture & Feed Consolidation': '🌾',
  'Multi-Location Inventory & Stock Theft Prevention': '📦',
  'Tech Trends': '💻',
  'AI & Autonomous Agents': '🧠',
  'Google Ranking & SEO': '📈',
};

function getCategoryIcon(cat: string) {
  return CATEGORY_ICONS[cat] || '📰';
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return 'Just now';
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(dateStr).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' });
}

export default function BlogIndexPage() {
  const posts = BlogEngine.getAllPosts();
  const featuredPost = posts[0];
  const secondaryHero = posts.slice(1, 3);
  const gridPosts = posts.slice(3);
  const categories = Array.from(new Set(posts.map((p) => p.category)));

  return (
    <div
      className="min-h-screen text-slate-100 selection:bg-amber-400 selection:text-slate-950"
      style={{ background: 'linear-gradient(160deg, #030712 0%, #070a14 40%, #0a0f1e 100%)' }}
    >
      {/* ─── HERO MASTHEAD ─── */}
      <section className="relative overflow-hidden pt-16 pb-12 lg:pt-24 lg:pb-16 border-b border-white/5">
        {/* Ambient glow orbs */}
        <div
          className="pointer-events-none absolute -top-40 left-1/4 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.10) 0%, transparent 70%)' }}
        />
        <div
          className="pointer-events-none absolute -top-20 right-1/4 w-[400px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)' }}
        />
        {/* Dot grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.022]"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Live badge */}
          <div className="flex items-center gap-2.5 mb-7">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400" />
            </span>
            <span className="text-xs font-bold tracking-[0.18em] uppercase text-amber-400">
              Live Commercial Intelligence Feed &middot; {posts.length} Active Playbooks
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-7">
              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black text-white leading-[1.08] tracking-tight mb-5">
                Field Data &amp;{' '}
                <span
                  className="text-transparent bg-clip-text"
                  style={{ backgroundImage: 'linear-gradient(90deg, #fbbf24, #f59e0b, #fde68a)' }}
                >
                  Execution Blueprints
                </span>{' '}
                for Nigeria&rsquo;s Growth Economy
              </h1>
              <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
                Verified commercial intel on solar ROI, real estate yields, customs duties, and autonomous AI sales systems &mdash; published autonomously, 30+ times daily.
              </p>
            </div>

            {/* Metric mini-cards */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-3">
              {[
                { value: `${posts.length}+`, label: 'Live Playbooks', icon: '📋' },
                { value: '< 3s', label: 'WhatsApp AI Reply', icon: '⚡' },
                { value: '₦650k', label: 'Top Asset Value', icon: '💰' },
                { value: '48h', label: 'DFY Portal SLA', icon: '🚀' },
              ].map((m) => (
                <div
                  key={m.label}
                  className="relative p-4 rounded-2xl border border-white/8 overflow-hidden group hover:border-amber-400/30 transition-all duration-300"
                  style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(12px)' }}
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.08), transparent)' }}
                  />
                  <div className="text-xl mb-1">{m.icon}</div>
                  <div className="text-2xl font-black text-amber-400 leading-none">{m.value}</div>
                  <div className="text-[11px] text-slate-500 mt-1 font-medium">{m.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Sector pill carousel */}
          <div className="flex items-center gap-2.5 mt-10 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-600 whitespace-nowrap shrink-0">
              Sectors:
            </span>
            {categories.map((cat) => (
              <span
                key={cat}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 whitespace-nowrap shrink-0 hover:border-amber-400/50 hover:text-amber-300 hover:bg-amber-400/5 cursor-pointer"
                style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)', color: '#94a3b8' }}
              >
                {getCategoryIcon(cat)} {cat}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── MAIN CONTENT ─── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">

        {/* ─── HIGH-YIELD REVENUE ASSETS & DFY PROTOTYPE VAULT ─── */}
        <FeaturedMonetizationVault />

        {/* ── FEATURED EDITORIAL HERO ── */}
        {featuredPost && (
          <div className="mb-10">
            <Link href={`/blog/${featuredPost.slug}`} className="group block">
              <div
                className="relative rounded-3xl overflow-hidden border transition-all duration-500 hover:border-amber-400/50 hover:shadow-[0_0_60px_rgba(245,158,11,0.10)]"
                style={{ borderColor: 'rgba(245,158,11,0.2)', background: 'rgba(255,255,255,0.02)' }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="relative z-10 p-8 sm:p-12 lg:p-14 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-5 flex-wrap">
                        <span
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest text-slate-950"
                          style={{ background: 'linear-gradient(90deg, #f59e0b, #fbbf24)' }}
                        >
                          ★ Editor&apos;s Pick
                        </span>
                        <span className="text-[12px] text-amber-400 font-semibold">
                          {getCategoryIcon(featuredPost.category)} {featuredPost.category}
                        </span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight tracking-tight mb-4 group-hover:text-amber-300 transition-colors duration-300">
                        {featuredPost.title}
                      </h2>
                      <p className="text-slate-400 leading-relaxed text-base mb-8 max-w-lg">
                        {featuredPost.excerpt}
                      </p>
                    </div>
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm text-slate-950 shrink-0"
                          style={{ background: 'linear-gradient(135deg, #f59e0b, #fbbf24)' }}
                        >
                          OT
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white">Oyelakin Tosin</div>
                          <div className="text-xs text-slate-500">
                            {featuredPost.read_time} &middot; {timeAgo(featuredPost.created_at)}
                          </div>
                        </div>
                      </div>
                      <span
                        className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-sm text-slate-950 transition-all duration-200 group-hover:scale-105 group-hover:shadow-[0_0_25px_rgba(245,158,11,0.4)]"
                        style={{ background: 'linear-gradient(90deg, #f59e0b, #fbbf24)' }}
                      >
                        Read Playbook →
                      </span>
                    </div>
                  </div>

                  {/* Hero image side */}
                  <div className="relative min-h-[280px] lg:min-h-full overflow-hidden">
                    <img
                      src={featuredPost.featured_image}
                      alt={featuredPost.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div
                      className="absolute inset-0"
                      style={{ background: 'linear-gradient(to right, rgba(7,10,20,0.7) 0%, transparent 60%)' }}
                    />
                    <div
                      className="absolute top-5 right-5 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md border border-white/10"
                      style={{ background: 'rgba(0,0,0,0.55)' }}
                    >
                      👁 {featuredPost.views_count.toLocaleString()} {featuredPost.views_count === 1 ? 'view' : 'views'}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* ── SECONDARY HERO PAIR ── */}
        {secondaryHero.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
            {secondaryHero.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group block h-full">
                <div
                  className="relative rounded-2xl overflow-hidden border border-white/8 h-full transition-all duration-300 hover:border-amber-400/40 hover:shadow-[0_0_40px_rgba(245,158,11,0.07)] hover:-translate-y-0.5"
                  style={{ background: 'rgba(255,255,255,0.025)' }}
                >
                  <div className="flex h-full min-h-[160px]">
                    <div className="flex-1 p-6 sm:p-7 flex flex-col justify-between">
                      <div>
                        <div className="text-xs font-bold text-amber-400 mb-3">
                          {getCategoryIcon(post.category)} {post.category}
                        </div>
                        <h3 className="text-[16px] font-black text-white leading-snug mb-3 group-hover:text-amber-300 transition-colors line-clamp-3">
                          {post.title}
                        </h3>
                        <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">{post.excerpt}</p>
                      </div>
                      <div className="mt-5 flex items-center gap-2 text-xs text-slate-500">
                        <span>{post.read_time}</span>
                        <span>&middot;</span>
                        <span className="text-amber-400/70 font-semibold">{timeAgo(post.created_at)}</span>
                        <span>&middot;</span>
                        <span>{post.views_count.toLocaleString()} views</span>
                      </div>
                    </div>
                    <div className="w-36 sm:w-44 relative overflow-hidden shrink-0">
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div
                        className="absolute inset-0"
                        style={{ background: 'linear-gradient(to right, rgba(7,10,20,0.45), transparent)' }}
                      />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Divider */}
        <div className="flex items-center gap-4 mb-8">
          <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-600">All Playbooks</span>
          <div
            className="flex-1 h-px"
            style={{ background: 'linear-gradient(to right, rgba(255,255,255,0.08), transparent)' }}
          />
          <span className="text-xs text-slate-700">{gridPosts.length} articles</span>
        </div>

        {/* ── ARTICLE GRID ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-20">
          {gridPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group block h-full">
              <article
                className="h-full flex flex-col rounded-2xl overflow-hidden border border-white/7 transition-all duration-300 hover:border-amber-400/35 hover:-translate-y-1 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.8)]"
                style={{ background: 'rgba(255,255,255,0.025)' }}
              >
                {/* Thumbnail */}
                <div className="relative h-44 overflow-hidden shrink-0">
                  <img
                    src={post.featured_image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(to top, rgba(7,10,20,0.75) 0%, transparent 55%)' }}
                  />
                  <div className="absolute bottom-3 left-3">
                    <span
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold text-amber-300 border border-amber-400/25 backdrop-blur-md"
                      style={{ background: 'rgba(0,0,0,0.60)' }}
                    >
                      {getCategoryIcon(post.category)}{' '}
                      {post.category.length > 20 ? post.category.substring(0, 18) + '…' : post.category}
                    </span>
                  </div>
                  {post.views_count >= 50 && (
                    <div
                      className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-black text-slate-950 uppercase tracking-wider"
                      style={{ background: 'linear-gradient(90deg, #f59e0b, #fbbf24)' }}
                    >
                      Trending 🔥
                    </div>
                  )}
                </div>

                {/* Card body */}
                <div className="flex flex-col flex-grow p-5">
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-3">
                    <span>{post.read_time}</span>
                    <span>&middot;</span>
                    <span className="text-amber-400/70 font-semibold">
                      {post.views_count.toLocaleString()} {post.views_count === 1 ? 'view' : 'views'}
                    </span>
                    <span>&middot;</span>
                    <span>{timeAgo(post.created_at)}</span>
                  </div>
                  <h3 className="text-[15px] font-bold text-white leading-snug mb-2.5 group-hover:text-amber-300 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed line-clamp-3 flex-grow">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between mt-4 pt-3.5 border-t border-white/6">
                    <span className="text-xs font-bold text-amber-400 group-hover:text-amber-300 transition-colors flex items-center gap-1">
                      Read Playbook{' '}
                      <span className="group-hover:translate-x-0.5 transition-transform inline-block">→</span>
                    </span>
                    {post.matched_product && (
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/25 text-emerald-400"
                        style={{ background: 'rgba(16,185,129,0.07)' }}
                      >
                        {post.matched_product.priceNgn}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* ── BOTTOM CTA STRIP ── */}
        <section
          className="relative rounded-3xl overflow-hidden p-8 sm:p-12"
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1a1040 50%, #0f172a 100%)',
            border: '1px solid rgba(245,158,11,0.22)',
          }}
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.12) 0%, transparent 70%)' }}
          />
          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-400/30 text-amber-400 text-xs font-bold uppercase tracking-widest mb-5"
              style={{ background: 'rgba(245,158,11,0.07)' }}
            >
              ⚡ Direct Executive Access
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white mb-4 leading-tight">
              Need a 24/7 AI Sales Bot or Done-For-You Business Website?
            </h3>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-8">
              We deploy 100% turnkey commercial operations portals in 48 hours and 1-line script quote widgets in 10 minutes. Connect directly to our Lagos desk.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href={`${MASTER_PAYOUT.whatsappCloser}?text=Hi+Bethelmind,+I+want+to+automate+sales+for+my+business`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-black text-sm text-slate-950 transition-all duration-200 hover:scale-105 hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]"
                style={{ background: 'linear-gradient(90deg, #f59e0b, #fbbf24)' }}
              >
                💬 Chat with Our Lagos Desk
              </a>
              <a
                href="/marketplace"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm text-slate-300 border border-white/10 hover:border-amber-400/40 hover:text-amber-300 transition-all duration-200"
                style={{ background: 'rgba(255,255,255,0.04)' }}
              >
                Explore Digital Asset Vault →
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
