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
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
