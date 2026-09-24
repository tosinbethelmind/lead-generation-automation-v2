import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.bethelmindanalytics.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/portal/',
          '/handover/',
          '/setup/',
          '/preview/',
          '/domain-session/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin/', '/api/', '/portal/', '/preview/'],
      },
      // Explicit Generative AI Crawlers for GEO (Google Gemini, ChatGPT, Perplexity, Claude)
      {
        userAgent: ['GPTBot', 'ChatGPT-User', 'Google-Extended', 'PerplexityBot', 'ClaudeBot', 'anthropic-ai', 'cohere-ai'],
        allow: ['/', '/blog/', '/llms.txt', '/llms-full.txt', '/marketplace', '/tools/'],
        disallow: ['/admin/', '/api/', '/portal/', '/preview/'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/admin/', '/api/', '/portal/', '/preview/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
