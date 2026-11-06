const fs = require('fs');
const path = require('path');

const poolerPath = path.join(__dirname, 'multi_smtp_pooler.js');
let code = fs.readFileSync(poolerPath, 'utf8');

// Replace providers array
code = code.replace(
  /let providers = \['brevo'[\s\S]*?this\.currentProviderIdx\+\+;/,
  `// HOSTINGER SMTP DISABLED: Routed 100% via Brevo API v3 to protect Hostinger domain\n    let providers = ['brevo'];\n    this.currentProviderIdx++;`
);

fs.writeFileSync(poolerPath, code, 'utf8');
console.log('✅ multi_smtp_pooler.js updated: Hostinger SMTP disabled, 100% Brevo API active.');
