const fs = require('fs');
let c = fs.readFileSync('src/app/globals.css', 'utf8');
if (!c.includes('@source')) {
  c = c.replace('@import "tailwindcss";', '@import "tailwindcss";\n@source "..";');
  fs.writeFileSync('src/app/globals.css', c, 'utf8');
  console.log('Added @source ".." to src/app/globals.css!');
} else {
  console.log('@source already present in globals.css');
}
