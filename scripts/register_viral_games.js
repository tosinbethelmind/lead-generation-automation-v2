const fs = require('fs');
const path = require('path');

// 1. Update src/app/tools/[slug]/page.tsx
const slugFile = path.join(__dirname, '..', 'src', 'app', 'tools', '[slug]', 'page.tsx');
let slugContent = fs.readFileSync(slugFile, 'utf8');

const newViralTools = `  'footy-wordle': {
    id: 'footy-wordle',
    file: 'footy-wordle.html',
    title: 'FootyWordle AI™ | Daily Football Wordle & Mystery Player Game',
    category: 'Sports Analytics',
    badge: '⚽ Viral Daily Football Wordle',
    summary: 'The viral daily football Wordle. Guess today 5-letter football star or club in 6 tries, share your emoji grid on WhatsApp, and unlock high-confidence value slips.',
    highlights: ['Daily 5-Letter Football Mystery', 'WhatsApp Emoji Grid Sharing', 'Unlocked 4.85x Acca Value Slip'],
    selarUrl: 'https://selar.com/showlove/bethelmind?product=da-sports',
    selarProduct: 'Quantitative Sports Analytics Model & Bankroll Matrix',
    selarPrice: '₦15,000 / $19',
  },
  'higher-lower': {
    id: 'higher-lower',
    file: 'higher-lower.html',
    title: 'Higher or Lower AI™ | Viral Football Values & Wealth Game',
    category: 'Entertainment & Gaming',
    badge: '🔥 Viral 500M+ Play Comparison Arena',
    summary: 'The addictive viral Higher or Lower game. Guess which football superstar has a higher market value or which mogul has a higher net worth.',
    highlights: ['Transfer Values vs Net Worths', 'Streak Bragging on WhatsApp', 'Integrated Cross-Promotion'],
    selarUrl: 'https://selar.com/showlove/bethelmind?product=da-sports',
    selarProduct: 'Quantitative Sports Analytics Model',
    selarPrice: '₦15,000 / $19',
  },
};`;

if (!slugContent.includes("'footy-wordle':")) {
  if (slugContent.includes('};\r\n\r\nexport async function generateStaticParams()')) {
    slugContent = slugContent.replace('};\r\n\r\nexport async function generateStaticParams()', newViralTools + '\r\n\r\nexport async function generateStaticParams()');
  } else {
    slugContent = slugContent.replace('};\n\nexport async function generateStaticParams()', newViralTools + '\n\nexport async function generateStaticParams()');
  }
  fs.writeFileSync(slugFile, slugContent, 'utf8');
  console.log('Successfully added footy-wordle and higher-lower to VIRAL_TOOLS!');
} else {
  console.log('footy-wordle already present in page.tsx.');
}

// 2. Update src/app/tools/page.tsx
const toolsPageFile = path.join(__dirname, '..', 'src', 'app', 'tools', 'page.tsx');
let toolsPageContent = fs.readFileSync(toolsPageFile, 'utf8');

const directoryTools = `  {
    id: 'footy-wordle',
    title: 'FootyWordle AI™ Daily Football Wordle & Mystery Player Game',
    badge: '⚽ Viral Wordle Mechanic',
    category: 'lifestyle',
    description: 'Guess today 5-letter football star in 6 tries, share your emoji grid on WhatsApp, and unlock 4.85x acca slips.',
    icon: Flame,
    color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
    href: '/tools/footy-wordle',
    upsell: '🏆 VIP Club & ₦15k Model'
  },
  {
    id: 'higher-lower',
    title: 'Higher or Lower AI™ Viral Football Values & Wealth Game',
    badge: '🔥 500M+ Play Challenge',
    category: 'lifestyle',
    description: 'Addictive comparison game: guess which football star has a higher transfer valuation or billionaire net worth. Beat your streak!',
    icon: Sparkles,
    color: 'from-amber-500/20 to-yellow-500/10 border-amber-500/30 text-amber-400',
    href: '/tools/higher-lower',
    upsell: '💎 ₦15k Sports Model'
  },
];`;

if (!toolsPageContent.includes("'footy-wordle'")) {
  if (toolsPageContent.includes('upsell: \'🚀 ₦150k B2B Migration\'\r\n  }\r\n];')) {
    toolsPageContent = toolsPageContent.replace('upsell: \'🚀 ₦150k B2B Migration\'\r\n  }\r\n];', 'upsell: \'🚀 ₦150k B2B Migration\'\r\n  },\n' + directoryTools);
  } else {
    toolsPageContent = toolsPageContent.replace('upsell: \'🚀 ₦150k B2B Migration\'\n  }\n];', 'upsell: \'🚀 ₦150k B2B Migration\'\n  },\n' + directoryTools);
  }
  fs.writeFileSync(toolsPageFile, toolsPageContent, 'utf8');
  console.log('Successfully added footy-wordle and higher-lower to /tools directory!');
} else {
  console.log('footy-wordle already present in tools page.');
}
