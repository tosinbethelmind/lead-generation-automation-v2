const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'next.config.ts');
let content = fs.readFileSync(filePath, 'utf8');

const targetStr = `  async redirects() {
    return [
      {
        source: '/tools',
        destination: '/home#sector-tools',
        permanent: false,
      },
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
        destination: '/api/admin/login?token=bethelmind_admin_2026&redirect=/admin/mobile',
        permanent: false,
      },
      {
        source: '/web-app',
        destination: '/api/admin/login?token=bethelmind_admin_2026&redirect=/admin/mobile',
        permanent: false,
      },
      {
        source: '/app',
        destination: '/api/admin/login?token=bethelmind_admin_2026&redirect=/admin/mobile',
        permanent: false,
      },
      {
        source: '/mobile',
        destination: '/api/admin/login?token=bethelmind_admin_2026&redirect=/admin/mobile',
        permanent: false,
      },
      {
        source: '/control',
        destination: '/api/admin/login?token=bethelmind_admin_2026&redirect=/admin/mobile',
        permanent: false,
      },
      {
        source: '/assets/apexreach-demo.webm',
        destination: '/walkthrough',
        permanent: false,
      },
    ];
  },`;

const replacementStr = `  async rewrites() {
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
  },`;

// Normalize line endings for replacement
const normalizedContent = content.replace(/\r\n/g, '\n');
const normalizedTarget = targetStr.replace(/\r\n/g, '\n');
const normalizedReplacement = replacementStr.replace(/\r\n/g, '\n');

if (normalizedContent.includes(normalizedTarget)) {
  const updated = normalizedContent.replace(normalizedTarget, normalizedReplacement);
  fs.writeFileSync(filePath, updated, 'utf8');
  console.log('SUCCESS: next.config.ts updated with rewrites and clean redirects!');
} else {
  console.error('Target not found in normalized content. Index:', normalizedContent.indexOf('async redirects()'));
}
