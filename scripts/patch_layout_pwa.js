const fs = require('fs');
let code = fs.readFileSync('src/app/layout.tsx', 'utf8');

const target = `        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
        />`;

const replacement = `        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: \`(function(){try{var s=window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true;var p=window.location.pathname;if(s&&!p.startsWith('/admin')&&!p.startsWith('/api')&&!p.startsWith('/preview')&&!p.startsWith('/calc')){window.location.replace('/app');}}catch(e){}})();\`
          }}
        />`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  console.log('Target replaced in layout.tsx');
} else {
  // Normalize line endings
  code = code.replace(/\r\n/g, '\n');
  code = code.replace(target.replace(/\r\n/g, '\n'), replacement);
  console.log('Target replaced with normalized line endings');
}

fs.writeFileSync('src/app/layout.tsx', code, 'utf8');
console.log('src/app/layout.tsx updated successfully.');
