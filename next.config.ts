import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const cacheHeaders = [
  {
    key: "Cache-Control",
    value: "public, max-age=31536000, immutable",
  },
];

const nextConfig: NextConfig = {
  output: 'standalone',
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },

  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'date-fns',
      'recharts',
      '@supabase/supabase-js',
      'framer-motion',
    ],
  },
  serverExternalPackages: [
    'googleapis',
    'google-auth-library',
    '@sparticuz/chromium',
    'puppeteer-core',
    'puppeteer-extra',
    'puppeteer-extra-plugin-stealth',
    'puppeteer',
    'crawlee',
    '@crawlee/puppeteer',
    '@crawlee/browser',
    '@crawlee/core',
    'ws'
  ],
  outputFileTracingExcludes: {
    '*': [
      './local_db/**/*.log',
      './local_db/**/*.tmp*',
      './local_db/baileys_auth*/**/*',
      './local_db/evolution_auth*/**/*',
      './local_db/jiji_browser_profile/**/*',
      './data/raw_leads/**/*',
      './data/cache/**/*',
      './public/assets/audio/**/*',
      './.git/**/*'
    ]
  },
  outputFileTracingIncludes: {
    '/**': [
      './data/blog_posts/**/*',
      './local_db/sms_dispatches.json',
      './local_db/email_dispatches.json',
      './local_db/email_daemon_state.json',
      './local_db/activities.json',
      './local_db/lead_journeys.json',
      './local_db/crm_leads.json',
      './local_db/leads_db.json',
      './local_db/real_webform_submissions.json',
      './local_db/retargeting_decisions.json'
    ]
  },
  async headers() {
    return [
      {
        // Cache static public assets aggressively for maximum performance
        source: "/(fonts|images|icons|videos|favicon.ico)/:path*",
        headers: cacheHeaders,
      },
      {
        // Allow preview pages and widget to be embedded in iframes on client sites
        source: "/preview/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Content-Security-Policy", value: "frame-ancestors *" },
          { key: "X-Frame-Options", value: "ALLOWALL" },
        ],
      },
      {
        // Allow widget JS and any widget-served pages to be embedded
        source: "/api/widget/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Content-Security-Policy", value: "frame-ancestors *" },
          { key: "X-Frame-Options", value: "ALLOWALL" },
        ],
      },
            {
        // Allow standalone calculator tools to be embedded cleanly
        source: "/calc/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'self' https://www.bethelmindanalytics.com https://bethelmindanalytics.com *" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
      {
        source: "/((?!preview|api/widget|calc).*)",
        headers: securityHeaders,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/calc/:tool',
        destination: '/calc/:tool.html',
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/demo',
        destination: '/walkthrough',
        permanent: true,
      },
      {
        source: '/video',
        destination: '/walkthrough',
        permanent: true,
      },
      {
        source: '/assets/bethelmind-demo.webm',
        destination: '/walkthrough',
        permanent: false,
      },
      {
        source: '/site/:site_id',
        destination: '/sites/:site_id',
        permanent: true,
      },
      {
        source: '/webapp',
        destination: '/home',
        permanent: false,
      },
      {
        source: '/web-app',
        destination: '/home',
        permanent: false,
      },
      {
        source: '/app',
        destination: '/home',
        permanent: false,
      },
      {
        source: '/mobile',
        destination: '/home',
        permanent: false,
      },
      {
        source: '/control',
        destination: '/admin/login',
        permanent: false,
      },
      {
        source: '/assets/apexreach-demo.webm',
        destination: '/walkthrough',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
