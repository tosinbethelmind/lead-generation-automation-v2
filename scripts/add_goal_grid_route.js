const fs = require('fs');
const path = require('path');

// 1. Update src/app/tools/[slug]/page.tsx
const slugFile = path.join(__dirname, '..', 'src', 'app', 'tools', '[slug]', 'page.tsx');
let slugContent = fs.readFileSync(slugFile, 'utf8');

const goalGridDef = `  'goal-grid': {
    id: 'goal-grid',
    file: 'goal-grid.html',
    title: 'GoalGrid AI™ | Daily Football Mystery Star & Club Game',
    category: 'Sports Analytics',
    badge: '⚽ Viral Daily Football Trivia Grid',
    summary: 'The viral daily football trivia grid. Guess today 5-letter football star or club in 6 tries, share your emoji grid on WhatsApp, and unlock high-confidence value slips.',
    highlights: ['Daily 5-Letter Football Mystery', 'WhatsApp Emoji Grid Sharing', 'Unlocked 4.85x Acca Value Slip'],
    selarUrl: 'https://selar.com/showlove/bethelmind?product=da-sports',
    selarProduct: 'Quantitative Sports Analytics Model & Bankroll Matrix',
    selarPrice: '₦15,000 / $19',
  },`;

if (!slugContent.includes("'goal-grid':")) {
  slugContent = slugContent.replace("'footy-wordle': {", goalGridDef + "\n  'footy-wordle': {");
  fs.writeFileSync(slugFile, slugContent, 'utf8');
  console.log('Successfully added goal-grid to page.tsx!');
} else {
  console.log('goal-grid already in page.tsx');
}

// 2. Update src/app/tools/page.tsx
const toolsPage = path.join(__dirname, '..', 'src', 'app', 'tools', 'page.tsx');
let toolsContent = fs.readFileSync(toolsPage, 'utf8');

const goalGridCard = `  {
    id: 'goal-grid',
    title: 'GoalGrid AI™ Daily Football Mystery Star & Club Game',
    badge: '⚽ 100% Original Trivia Grid',
    category: 'lifestyle',
    description: 'Guess today 5-letter football star in 6 tries, share your emoji grid on WhatsApp, and unlock 4.85x acca slips.',
    icon: Flame,
    color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
    href: '/tools/goal-grid',
    upsell: '🏆 VIP Club & ₦15k Model'
  },`;

if (!toolsContent.includes("'goal-grid'")) {
  toolsContent = toolsContent.replace("id: 'footy-wordle',", "id: 'goal-grid',");
  toolsContent = toolsContent.replace("title: 'FootyWordle AI™ Daily Football Wordle & Mystery Player Game',", "title: 'GoalGrid AI™ Daily Football Mystery Star & Club Game',");
  toolsContent = toolsContent.replace("href: '/tools/footy-wordle',", "href: '/tools/goal-grid',");
  fs.writeFileSync(toolsPage, toolsContent, 'utf8');
  console.log('Successfully rebranded directory card to GoalGrid AI!');
} else {
  console.log('goal-grid already in tools page.');
}
