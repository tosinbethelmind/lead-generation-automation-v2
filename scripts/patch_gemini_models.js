const fs = require('fs');
let content = fs.readFileSync('scripts/lib/gemini_closer.js', 'utf8');
content = content.replace(/const PRIMARY_MODEL = ['"][^'"]+['"];/, "const PRIMARY_MODEL = 'gemini-flash-lite-latest';");
content = content.replace(/const FALLBACK_MODEL = ['"][^'"]+['"];/, "const FALLBACK_MODEL = 'gemini-3.1-flash-lite';");
fs.writeFileSync('scripts/lib/gemini_closer.js', content, 'utf8');
console.log('gemini_closer.js updated to active 200 SUCCESS models!');
