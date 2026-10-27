import { MetadataRoute } from 'next';
import { BlogEngine } from '@/lib/blog/blogEngine';
import { ProgrammaticSeoEngine } from '@/lib/seo/programmaticSeoEngine';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.bethelmindanalytics.com';
  const currentDate = new Date().toISOString();

  const staticRoutes = [
    '',
    '/home',
    '/blog',
    '/marketplace',
    '/recruitment',
    '/vin',
    '/solar',
    '/arbitrage',
    '/tools',
    '/tools/solar-quote-pro',
    '/tools/solar-boq',
    '/tools/tokunbo-duty',
    '/tools/construction-estimator',
    '/tools/lagos-lead-harvester',
    '/tools/whatsapp-voice-notes',
    '/tools/integrations',
    '/legal',
    '/legal/terms',
    '/legal/privacy',
    '/legal/refund',
    '/legal/ai-disclaimer',
    '/legal/responsible-outreach',
    '/legal/acceptable-use',
  ];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => {
    let priority = 0.8;
    let changeFrequency: 'daily' | 'weekly' | 'monthly' = 'weekly';

    if (route === '' || route === '/home' || route === '/blog') {
      priority = 1.0;
      changeFrequency = 'daily';
    } else if (route === '/marketplace' || route.startsWith('/tools') || route === '/vin' || route === '/solar' || route === '/arbitrage') {
      priority = 0.95;
      changeFrequency = 'daily';
    } else if (route.startsWith('/legal')) {
      priority = 0.5;
      changeFrequency = 'monthly';
    }

    return {
      url: `${baseUrl}${route}`,
      lastModified: currentDate,
      changeFrequency,
      priority,
    };
  });

  // Dynamically include all published blog posts for Google #1 Indexing
  const blogPosts = BlogEngine.getAllPosts();
  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.created_at || currentDate,
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  // Programmatic SEO Dynamic Routes for Google Nigeria Rankings (7,740+ Long-Tail Matrix)
  const pSeoRoutes = ProgrammaticSeoEngine.getAllProgrammaticRoutes();
  const pSeoEntries: MetadataRoute.Sitemap = pSeoRoutes.map((route) => ({
    url: route.url,
    lastModified: currentDate,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  return [...staticEntries, ...blogEntries, ...pSeoEntries];
}
