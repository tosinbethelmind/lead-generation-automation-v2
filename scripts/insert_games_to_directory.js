const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'src', 'app', 'tools', 'page.tsx');
let content = fs.readFileSync(file, 'utf8');

const target = "upsell: '🚀 ₦150k B2B Migration'\n  },\n];\r\n\r\nexport default function ToolsHubPage()";

const insertion = `upsell: '🚀 ₦150k B2B Migration'
  },
  {
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
];\r\n\r\nexport default function ToolsHubPage()`;

content = content.replace(target, insertion);
fs.writeFileSync(file, content, 'utf8');
console.log('Successfully updated tools/page.tsx! Has footy-wordle:', content.includes('footy-wordle'));
