import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.bethelmindanalytics.com';
  const currentDate = new Date().toISOString();

  const routes = [
    '',
    '/home',
    '/marketplace',
    '/recruitment',
    '/tools/solar-quote-pro',
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

  return routes.map((route) => {
    let priority = 0.8;
    let changeFrequency: 'daily' | 'weekly' | 'monthly' = 'weekly';

    if (route === '' || route === '/home') {
      priority = 1.0;
      changeFrequency = 'daily';
    } else if (route === '/marketplace' || route.startsWith('/tools/')) {
      priority = 0.9;
      changeFrequency = 'weekly';
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
}
