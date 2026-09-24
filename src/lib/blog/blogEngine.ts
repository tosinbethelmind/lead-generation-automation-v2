/**
 * @file src/lib/blog/blogEngine.ts
 * 
 * 🚀 High-Velocity Commercial Blog Engine
 * Bethelmind Analytics Lagos Desk (www.bethelmindanalytics.com)
 * 
 * Core Features:
 * - Real-time disk cache for sub-10ms response time
 * - Automatic Schema.org JSON-LD structured data (BlogPosting, FAQPage, Breadcrumbs)
 * - Contextual VidRush Selar products & Gumroad vault embeds
 * - Live YouTube video embeds from VidRush channels
 * - Turnkey DFY prototype (/preview/[slug]) & WhatsApp closing bridges
 */

import * as fs from 'fs';
import * as path from 'path';
import { 
  SELAR_DIGITAL_PRODUCTS, 
  GUMROAD_PRODUCTS, 
  DFY_PROTOTYPE_OFFERS, 
  YOUTUBE_CHANNELS, 
  MASTER_PAYOUT,
  ProductOffer,
  YouTubeEmbedChannel
} from '../../data/monetizationCatalog';
import { AnswerThePublicEngine, SearchIntentCluster } from './answerThePublicEngine';

export interface BlogPostData {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  read_time: string;
  virality_score: number;
  views_count: number;
  content_html: string;
  social_snippets: {
    linkedin: string;
    twitter: string[];
    whatsapp: string;
  };
  schema_ld: Record<string, any>;
  faq_schema?: Record<string, any>;
  is_pinned?: boolean;
  featured_image?: string;
  created_at: string;
  matched_product?: ProductOffer;
  matched_youtube?: YouTubeEmbedChannel;
}

const BUNDLED_POSTS_DIR = path.join(process.cwd(), 'data', 'blog_posts');
const TMP_POSTS_DIR = path.join(process.env.TEMP || process.env.TMP || '/tmp', 'bethelmind_blog_posts');

export class BlogEngine {
  private static cachedPosts: BlogPostData[] | null = null;
  private static lastCacheTime: number = 0;
  private static CACHE_TTL_MS = 60 * 1000; // 1 minute in-memory cache

  /**
   * Ensures the data directories exist safely
   */
  private static ensureDirectory() {
    try {
      if (!fs.existsSync(BUNDLED_POSTS_DIR)) {
        fs.mkdirSync(BUNDLED_POSTS_DIR, { recursive: true });
      }
    } catch {
      // Expected in read-only serverless environment
    }
    try {
      if (!fs.existsSync(TMP_POSTS_DIR)) {
        fs.mkdirSync(TMP_POSTS_DIR, { recursive: true });
      }
    } catch {
      // Ignored
    }
  }

  /**
   * Matches an article category/title to a relevant Selar or Gumroad product
   */
  public static matchProduct(category: string, title: string): ProductOffer {
    const text = `${category} ${title}`.toLowerCase();
    if (text.includes('solar') || text.includes('clean energy') || text.includes('inverter')) {
      return SELAR_DIGITAL_PRODUCTS.find(p => p.id === 'da-cleantech-vault') || SELAR_DIGITAL_PRODUCTS[1];
    }
    if (text.includes('real estate') || text.includes('property') || text.includes('rent') || text.includes('diaspora')) {
      return SELAR_DIGITAL_PRODUCTS.find(p => p.id === 'da-realestate') || SELAR_DIGITAL_PRODUCTS[4];
    }
    if (text.includes('finance') || text.includes('wealth') || text.includes('invest')) {
      return SELAR_DIGITAL_PRODUCTS.find(p => p.id === 'da-finance') || SELAR_DIGITAL_PRODUCTS[3];
    }
    if (text.includes('video') || text.includes('faceless') || text.includes('shorts') || text.includes('youtube')) {
      return SELAR_DIGITAL_PRODUCTS.find(p => p.id === 'da-faceless') || SELAR_DIGITAL_PRODUCTS[5];
    }
    if (text.includes('lead') || text.includes('b2b') || text.includes('outreach') || text.includes('sales') ||
        text.includes('fake alert') || text.includes('reconciliation') || text.includes('retail') || text.includes('fraud') ||
        text.includes('pos') || text.includes('inventory') || text.includes('theft') || text.includes('construction') ||
        text.includes('contractor') || text.includes('agribusiness') || text.includes('feed') || text.includes('farm') ||
        text.includes('school') || text.includes('clinic') || text.includes('patient') || text.includes('logistics') ||
        text.includes('haulage') || text.includes('freight') || text.includes('customs') || text.includes('auto')) {
      return SELAR_DIGITAL_PRODUCTS.find(p => p.id === 'da-b2bleadgen') || SELAR_DIGITAL_PRODUCTS[0];
    }
    // Default fallback to VidRush AI Tools Suite
    return SELAR_DIGITAL_PRODUCTS.find(p => p.id === 'da-aitools') || SELAR_DIGITAL_PRODUCTS[2];
  }

  /**
   * Matches an article to a relevant YouTube video embed
   */
  public static matchYouTubeChannel(category: string, title: string): YouTubeEmbedChannel {
    const text = `${category} ${title}`.toLowerCase();
    if (text.includes('finance') || text.includes('wealth') || text.includes('money') || text.includes('market')) {
      return YOUTUBE_CHANNELS[0]; // Daily Wealth Pulse
    }
    if (text.includes('kid') || text.includes('learn') || text.includes('cartoon') || text.includes('child')) {
      return YOUTUBE_CHANNELS[1]; // Tiny Learners
    }
    return YOUTUBE_CHANNELS[2]; // AI Tool Genius
  }

  /**
   * Loads all published blog posts from disk
   */
  public static getAllPosts(forceRefresh: boolean = false): BlogPostData[] {
    const now = Date.now();
    if (!forceRefresh && this.cachedPosts && (now - this.lastCacheTime < this.CACHE_TTL_MS)) {
      return this.cachedPosts;
    }

    this.ensureDirectory();
    const filesToRead: { dir: string; file: string }[] = [];
    if (fs.existsSync(BUNDLED_POSTS_DIR)) {
      try {
        fs.readdirSync(BUNDLED_POSTS_DIR)
          .filter(f => f.endsWith('.json') && !f.startsWith('~'))
          .forEach(file => filesToRead.push({ dir: BUNDLED_POSTS_DIR, file }));
      } catch (err) {
        console.warn('[BlogEngine] Failed reading bundled posts:', err);
      }
    }
    if (fs.existsSync(TMP_POSTS_DIR)) {
      try {
        fs.readdirSync(TMP_POSTS_DIR)
          .filter(f => f.endsWith('.json') && !f.startsWith('~'))
          .forEach(file => {
            if (!filesToRead.some(item => item.file === file)) {
              filesToRead.push({ dir: TMP_POSTS_DIR, file });
            }
          });
      } catch (err) {
        console.warn('[BlogEngine] Failed reading tmp posts:', err);
      }
    }

    const posts: BlogPostData[] = [];

    for (const item of filesToRead) {
      try {
        const fullPath = path.join(item.dir, item.file);
        const raw = fs.readFileSync(fullPath, 'utf-8');
        const data = JSON.parse(raw);

        const slug = data.slug || item.file.replace('.json', '');
        const matchedProduct = this.matchProduct(data.category || '', data.title || '');
        const matchedYouTube = this.matchYouTubeChannel(data.category || '', data.title || '');
        const intentCluster = AnswerThePublicEngine.getIntentCluster(data.category || 'solar');
        const faqSchema = AnswerThePublicEngine.generateFaqSchema(intentCluster);

        // Derive clean excerpt
        let excerpt = data.excerpt || '';
        if (!excerpt && data.content_html) {
          const stripped = data.content_html.replace(/<[^>]*>?/gm, '');
          excerpt = stripped.slice(0, 180).trim() + '...';
        }

        posts.push({
          id: data.id || slug,
          slug,
          title: data.title || 'Bethelmind Market Intelligence',
          category: data.category || 'AI & Enterprise Automation',
          excerpt,
          read_time: data.read_time || '6 min read',
          virality_score: typeof data.virality_score === 'number' ? data.virality_score : 0,
          views_count: typeof data.views_count === 'number' ? data.views_count : 0,
          content_html: data.content_html || '',
          social_snippets: data.social_snippets || {
            linkedin: '',
            twitter: [],
            whatsapp: ''
          },
          schema_ld: data.schema_ld || {},
          faq_schema: faqSchema,
          is_pinned: Boolean(data.is_pinned),
          featured_image: data.featured_image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
          created_at: data.created_at || new Date().toISOString(),
          matched_product: matchedProduct,
          matched_youtube: matchedYouTube
        });
      } catch (err) {
        console.error(`[BlogEngine] Failed parsing post file ${item.file}:`, err);
      }
    }

    // Sort by created_at descending (newest first), with pinned posts at the very top
    posts.sort((a, b) => {
      if (a.is_pinned && !b.is_pinned) return -1;
      if (!a.is_pinned && b.is_pinned) return 1;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    this.cachedPosts = posts;
    this.lastCacheTime = now;
    return posts;
  }

  /**
   * Retrieves a single post by slug
   */
  public static getPostBySlug(slug: string): BlogPostData | null {
    const posts = this.getAllPosts();
    return posts.find(p => p.slug.toLowerCase() === slug.toLowerCase()) || null;
  }

  /**
   * Increments the real-time views count of an article
   */
  public static incrementViews(slug: string): number {
    this.ensureDirectory();
    const candidateDirs = [BUNDLED_POSTS_DIR, TMP_POSTS_DIR];
    for (const dir of candidateDirs) {
      if (fs.existsSync(dir)) {
        const filePath = path.join(dir, `${slug}.json`);
        if (fs.existsSync(filePath)) {
          try {
            const raw = fs.readFileSync(filePath, 'utf-8');
            const data = JSON.parse(raw);
            data.views_count = (data.views_count || 0) + 1;
            try {
              fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
            } catch {
              // Read-only filesystem, continue with memory update
            }
            if (this.cachedPosts) {
              const match = this.cachedPosts.find(p => p.slug === slug);
              if (match) match.views_count = data.views_count;
            }
            return data.views_count;
          } catch (err) {
            console.error(`[BlogEngine] Failed updating views for ${slug}:`, err);
          }
        }
      }
    }
    return 1;
  }

  /**
   * Saves a newly synthesized blog post to disk
   */
  public static savePost(post: BlogPostData): boolean {
    this.ensureDirectory();
    let saved = false;

    // Try saving to BUNDLED_POSTS_DIR first (local development or persistent storage)
    try {
      const filePath = path.join(BUNDLED_POSTS_DIR, `${post.slug}.json`);
      fs.writeFileSync(filePath, JSON.stringify(post, null, 2), 'utf-8');
      saved = true;
    } catch {
      // In read-only serverless environment (Vercel), fall back to TMP_POSTS_DIR
      try {
        const tmpPath = path.join(TMP_POSTS_DIR, `${post.slug}.json`);
        fs.writeFileSync(tmpPath, JSON.stringify(post, null, 2), 'utf-8');
        saved = true;
      } catch (err) {
        console.error(`[BlogEngine] Failed saving post to tmp directory:`, err);
      }
    }

    if (saved) {
      this.cachedPosts = null; // Invalidate cache
    }
    return saved;
  }

  /**
   * Generates high-converting in-article HTML CTA banners
   */
  public static renderProductCtaHtml(product: ProductOffer): string {
    return `
<div class="blog-cta-banner bg-gradient-to-br from-navy-950 via-slate-900 to-navy-900 border-2 border-gold-500/50 rounded-2xl p-6 md:p-8 my-10 shadow-2xl relative overflow-hidden">
  <div class="absolute top-0 right-0 bg-gold-500 text-navy-950 font-black text-xs px-4 py-1 rounded-bl-xl uppercase tracking-wider">
    ${product.badge || 'VERIFIED ASSET'}
  </div>
  <div class="max-w-2xl">
    <span class="text-gold-400 font-bold text-xs uppercase tracking-widest block mb-2">${product.niche}</span>
    <h3 class="text-xl md:text-2xl font-bold text-white mb-2">${product.title}</h3>
    <p class="text-slate-300 text-sm mb-6 leading-relaxed">${product.summary}</p>
    
    <div class="flex flex-wrap gap-2 mb-6">
      ${product.features.map(f => `<span class="inline-flex items-center text-xs bg-slate-800 text-slate-200 px-3 py-1 rounded-full border border-slate-700">✓ ${f}</span>`).join('')}
    </div>

    <div class="flex flex-wrap items-center gap-4">
      <a href="${product.checkoutUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-black text-sm tracking-wide transition-all duration-200 shadow-lg hover:scale-105">
        Claim Instant Digital Access (${product.priceNgn} / ${product.priceUsd}) →
      </a>
      <a href="${MASTER_PAYOUT.whatsappCloser}?text=Hi+Bethelmind,+I+have+a+question+about+${encodeURIComponent(product.title)}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center px-5 py-3 rounded-xl border border-slate-600 hover:border-gold-400 text-white font-bold text-sm transition-colors">
        💬 Ask Sales Desk on WhatsApp
      </a>
    </div>
  </div>
</div>
`;
  }

  /**
   * Generates an embedded YouTube Video Card from VidRush Channels
   */
  public static renderYouTubeEmbedHtml(channel: YouTubeEmbedChannel): string {
    return `
<div class="blog-youtube-card bg-slate-900 border border-slate-800 rounded-2xl p-6 my-10 shadow-xl">
  <div class="flex items-center justify-between mb-4">
    <div class="flex items-center space-x-3">
      <div class="w-3 h-3 rounded-full bg-red-600 animate-pulse"></div>
      <h4 class="text-sm font-bold text-white uppercase tracking-wider">Featured Breakdown: ${channel.channelName}</h4>
    </div>
    <a href="${channel.watchUrl}" target="_blank" rel="noopener noreferrer" class="text-xs text-gold-400 hover:underline font-semibold">
      Watch on YouTube ↗
    </a>
  </div>
  <div class="relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-inner">
    <iframe 
      class="absolute inset-0 w-full h-full"
      src="https://www.youtube.com/embed/${channel.embedVideoId}?rel=0&modestbranding=1" 
      title="${channel.channelName}" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen>
    </iframe>
  </div>
</div>
`;
  }
}
