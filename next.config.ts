import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['playwright', 'playwright-core', '@sparticuz/chromium'],
  experimental: {
    outputFileTracingIncludes: {
      '/api/**/*': ['./node_modules/playwright-core/browsers.json'],
    },
  },
};

export default nextConfig;
