const fs = require('fs');
const path = require('path');

const agentsToInstall = [
  { src: 'testing/testing-reality-checker.md', slug: 'agency-reality-checker' },
  { src: 'sales/sales-outbound-strategist.md', slug: 'agency-outbound-strategist' },
  { src: 'sales/sales-deal-strategist.md', slug: 'agency-deal-strategist' },
  { src: 'sales/sales-offer-lead-gen-strategist.md', slug: 'agency-offer-lead-gen-strategist' },
  { src: 'product/product-behavioral-nudge-engine.md', slug: 'agency-behavioral-nudge-engine' },
  { src: 'testing/testing-api-tester.md', slug: 'agency-api-tester' }
];

const repoRoot = path.join(__dirname, '..', 'agency-agents');
const skillsRoot = path.join(__dirname, '..', '.agents', 'skills');

agentsToInstall.forEach(item => {
  const srcPath = path.join(repoRoot, item.src);
  if (!fs.existsSync(srcPath)) {
    console.error('Source not found:', srcPath);
    return;
  }
  const content = fs.readFileSync(srcPath, 'utf8');
  
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  let description = '';
  let body = content;
  
  if (match) {
    const fm = match[1];
    body = match[2];
    const descMatch = fm.match(/description:\s*(.*)/);
    if (descMatch) {
      description = descMatch[1].trim().replace(/^['"]|['"]$/g, '');
    }
  }
  
  const skillDir = path.join(skillsRoot, item.slug);
  if (!fs.existsSync(skillDir)) {
    fs.mkdirSync(skillDir, { recursive: true });
  }
  
  const skillMdContent = `---\nname: ${item.slug}\ndescription: ${JSON.stringify(description)}\n---\n\n${body.trim()}\n`;
  
  fs.writeFileSync(path.join(skillDir, 'SKILL.md'), skillMdContent, 'utf8');
  console.log(`Installed: ${item.slug} -> ${path.join(skillDir, 'SKILL.md')}`);
});
