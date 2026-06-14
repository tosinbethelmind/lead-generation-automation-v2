const fs = require('fs');
const content = fs.readFileSync('src/app/page.tsx', 'utf8');
const lines = content.split('\n');

const keywords = ['supabase', 'database', 'connection', 'status', 'mode', 'storage'];
console.log('Searching for keywords:', keywords);

lines.forEach((line, idx) => {
  const lower = line.toLowerCase();
  for (const kw of keywords) {
    if (lower.includes(kw)) {
      console.log(`Line ${idx + 1} [kw: ${kw}]: ${line.trim()}`);
      break;
    }
  }
});
