'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';

export interface BlogPostSummary {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  read_time: string;
  views_count: number;
  featured_image?: string;
  created_at: string;
}

interface Props {
  posts: BlogPostSummary[];
  categories: string[];
  categoryIcons: Record<string, string>;
}

export const InteractiveBlogExplorer: React.FC<Props> = ({ posts, categories, categoryIcons }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'latest' | 'views'>('latest');

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: posts.length };
    posts.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [posts]);

  // Filter & sort posts
  const filteredPosts = useMemo(() => {
    let result = posts;

    // Filter by category
    if (selectedCategory !== 'All') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // Sort
    return [...result].sort((a, b) => {
      if (sortBy === 'views') {
        return b.views_count - a.views_count;
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [posts, selectedCategory, searchQuery, sortBy]);

  function getIcon(cat: string) {
    return categoryIcons[cat] || '📰';
  }

  return (
    <div className="space-y-8">
      {/* Search & Filter Header Strip */}
      <div className="p-6 rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Live Search Input */}
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search playbooks by sector, keyword (e.g. 'solar BOQ', 'customs', 'bank transfer', 'school')..."
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-950/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400/60 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white bg-slate-800 px-2 py-1 rounded-lg"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-3 shrink-0">
            <label className="text-xs text-slate-400 font-semibold whitespace-nowrap">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'latest' | 'views')}
              className="bg-slate-950/80 border border-white/10 text-slate-200 text-xs font-semibold rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-400/60"
            >
              <option value="latest">Latest Field Reports</option>
              <option value="views">Most Read</option>
            </select>
          </div>
        </div>

        {/* Interactive Category Carousel / Pills */}
        <div className="mt-5 pt-5 border-t border-white/5 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 whitespace-nowrap shrink-0 ${
              selectedCategory === 'All'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
            }`}
          >
            All Playbooks ({categoryCounts['All'] || 0})
          </button>

          {categories.map((cat) => {
            const count = categoryCounts[cat] || 0;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 whitespace-nowrap shrink-0 ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                <span>{getIcon(cat)}</span>
                <span>{cat}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-slate-950/20 text-slate-950' : 'bg-white/10 text-slate-400'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>
          Showing <strong className="text-amber-400">{filteredPosts.length}</strong> of {posts.length} published playbooks
          {selectedCategory !== 'All' && <span> in <strong className="text-white">{selectedCategory}</strong></span>}
          {searchQuery && <span> matching &ldquo;<span className="text-amber-300">{searchQuery}</span>&rdquo;</span>}
        </span>
        {(selectedCategory !== 'All' || searchQuery) && (
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="text-amber-400 hover:underline font-semibold"
          >
            Reset Filters ↺
          </button>
        )}
      </div>

      {/* Grid of Filtered Playbooks */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group block h-full">
              <article className="h-full p-6 rounded-3xl border border-white/10 bg-slate-900/40 hover:bg-slate-900/80 hover:border-amber-400/50 hover:shadow-[0_0_35px_rgba(245,158,11,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
                <div>
                  {/* Category & Read Time */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                      {getIcon(post.category)} {post.category}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {post.read_time}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors duration-200 line-clamp-2 leading-snug mb-3">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-6">
                    {post.excerpt}
                  </p>
                </div>

                {/* Footer Strip */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">
                    {new Date(post.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <span className="text-amber-400 font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Read Briefing →
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 rounded-3xl border border-white/10 bg-slate-900/30 text-center space-y-4">
          <div className="text-4xl">🔍</div>
          <h4 className="text-lg font-bold text-white">No playbooks found matching your query</h4>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Looking for a specific sector analysis or custom BOQ calculator? Our Lagos systems desk can build and verify your briefing in under 24 hours.
          </p>
          <div className="pt-2">
            <a
              href={`https://wa.me/2348022791227?text=Hi+Bethelmind,+I+was+looking+for+a+playbook+about+${encodeURIComponent(searchQuery || selectedCategory)}+and+would+like+a+briefing.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-amber-400 text-slate-950 hover:bg-amber-300 transition-all shadow-lg"
            >
              💬 Request Sector Briefing on WhatsApp
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
