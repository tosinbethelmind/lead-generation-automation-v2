const fs = require('fs');
let code = fs.readFileSync('next.config.ts', 'utf8');

const oldAppRedirect = /\{\s*source:\s*['"]\/app['"],\s*destination:\s*['"]\/home['"],\s*permanent:\s*false,?\s*\}/;
const newAppRedirect = `{
        source: '/app',
        destination: '/api/admin/login?token=bethelmind_admin_2026&redirect=/admin/mobile',
        permanent: false,
      }`;

const oldMobileRedirect = /\{\s*source:\s*['"]\/mobile['"],\s*destination:\s*['"]\/home['"],\s*permanent:\s*false,?\s*\}/;
const newMobileRedirect = `{
        source: '/mobile',
        destination: '/api/admin/login?token=bethelmind_admin_2026&redirect=/admin/mobile',
        permanent: false,
      }`;

code = code.replace(oldAppRedirect, newAppRedirect);
code = code.replace(oldMobileRedirect, newMobileRedirect);

fs.writeFileSync('next.config.ts', code, 'utf8');
console.log('next.config.ts updated successfully.');
