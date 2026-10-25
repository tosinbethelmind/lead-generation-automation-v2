const fs = require('fs');
const filePath = 'src/lib/email/multiSmtpPooler.ts';
let code = fs.readFileSync(filePath, 'utf8');

code = code.replace(
  "let providers = ['hostinger_587', 'hostinger_587_matthew', 'hostinger_465', 'hostinger_465_matthew', 'brevo'];",
  "let providers = ['hostinger_465', 'hostinger_465_matthew', 'brevo', 'hostinger_587', 'hostinger_587_matthew'];"
);

code = code.replace(
  "providers = ['hostinger_587_matthew', 'hostinger_587', 'hostinger_465', 'hostinger_465_matthew', 'brevo'];",
  "providers = ['hostinger_465_matthew', 'hostinger_465', 'brevo', 'hostinger_587_matthew', 'hostinger_587'];"
);

fs.writeFileSync(filePath, code, 'utf8');
console.log('Successfully prioritized Hostinger 465 SSL and Brevo in multiSmtpPooler.ts');
