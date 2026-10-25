const fs = require('fs');
const path = require('path');

// 1. Update src/app/tools/[slug]/page.tsx
const slugFile = path.join(__dirname, '..', 'src', 'app', 'tools', '[slug]', 'page.tsx');
let slugContent = fs.readFileSync(slugFile, 'utf8');

const newDefs = `  'typing-speed': {
    id: 'typing-speed',
    file: 'typing-speed.html',
    title: 'TypeMaster AI™ | 60-Second WPM Typing Speed & Accuracy Test',
    category: 'Software & Productivity',
    badge: '⌨️ 40M+ Monthly Play Benchmark',
    summary: 'Benchmark your typing speed, accuracy, and keystrokes in 60 seconds. Claim your verified typing certificate and share your score.',
    highlights: ['Real-Time WPM & Accuracy Telemetry', 'Shareable Verified Scorecard', 'Remote Job Blueprint Upsell'],
    selarUrl: 'https://selar.com/showlove/bethelmind?product=da-aitools',
    selarProduct: 'Remote Work & High-Income Freelancing Blueprint',
    selarPrice: '₦15,000 / $19',
  },
  'focus-timer': {
    id: 'focus-timer',
    file: 'focus-timer.html',
    title: 'FocusFlow AI™ | 25/5 Pomodoro Deep Work Timer & Ambient Soundscape',
    category: 'Software & Productivity',
    badge: '🧠 25/5 Deep Work & Productivity Suite',
    summary: 'Eliminate distractions with scientific 25-minute Pomodoro cycles and zero-bandwidth mathematically synthesized ambient soundscapes.',
    highlights: ['Client-Side Web Audio Soundscapes', 'Sprint Task Checklist', 'High Dwell-Time Engine'],
    selarUrl: 'https://selar.com/showlove/bethelmind?product=da-aitools',
    selarProduct: 'Executive Deep-Work & Notion Operating System',
    selarPrice: '₦15,000 / $19',
  },
  'runway-radar': {
    id: 'runway-radar',
    file: 'runway-radar.html',
    title: 'RunwayRadar AI™ | "Can I Quit My Job?" Financial Runway Sizer',
    category: 'Finance & Investing',
    badge: '⏳ Viral Financial Runway & Freedom Engine',
    summary: 'Calculate exactly how many months and days you can survive without a job. Gauge your financial freedom index and safe resignation date.',
    highlights: ['Net Burn & Liquid Runway Sizer', 'Quit Readiness Index Score', 'Instant WhatsApp Brag Loop'],
    selarUrl: 'https://selar.com/showlove/bethelmind?product=da-finance',
    selarProduct: '2026 Solopreneur & Autonomous Cashflow Blueprint',
    selarPrice: '₦15,000 / $19',
  },`;

if (!slugContent.includes("'typing-speed':")) {
  slugContent = slugContent.replace("'salary-calc': {", newDefs + "\n  'salary-calc': {");
  fs.writeFileSync(slugFile, slugContent, 'utf8');
  console.log('Added 3 new tools to [slug]/page.tsx');
} else {
  console.log('3 tools already in [slug]/page.tsx');
}

// 2. Update src/app/tools/page.tsx
const toolsPage = path.join(__dirname, '..', 'src', 'app', 'tools', 'page.tsx');
let toolsContent = fs.readFileSync(toolsPage, 'utf8');

const directoryCards = `  {
    id: 'typing-speed',
    title: 'TypeMaster AI™ 60-Second WPM Typing Speed & Accuracy Test',
    badge: '⌨️ Global Speed Benchmark',
    category: 'b2b',
    description: 'Benchmark your typing speed (WPM) and accuracy in 60 seconds with verified certificate sharing.',
    icon: Zap,
    color: 'from-blue-500/20 to-cyan-500/10 border-blue-500/30 text-blue-400',
    href: '/tools/typing-speed',
    upsell: '💎 ₦15k Freelance Pack'
  },
  {
    id: 'focus-timer',
    title: 'FocusFlow AI™ 25/5 Pomodoro Deep Work Timer & Soundscapes',
    badge: '🧠 Deep Work Suite',
    category: 'lifestyle',
    description: 'Scientific Pomodoro cycles with zero-bandwidth synthesized ambient soundscapes and sprint checklist.',
    icon: Sparkles,
    color: 'from-indigo-500/20 to-purple-500/10 border-indigo-500/30 text-indigo-400',
    href: '/tools/focus-timer',
    upsell: '💎 ₦15k Notion OS'
  },
  {
    id: 'runway-radar',
    title: 'RunwayRadar AI™ "Can I Quit My Job?" Financial Runway Sizer',
    badge: '⏳ Freedom Countdown',
    category: 'wealth',
    description: 'Calculate your exact emergency runway in months and days to determine your safe resignation date.',
    icon: Calculator,
    color: 'from-amber-500/20 to-yellow-500/10 border-amber-500/30 text-amber-400',
    href: '/tools/runway-radar',
    upsell: '💎 ₦15k Cashflow Pack'
  },`;

if (!toolsContent.includes("'typing-speed'")) {
  toolsContent = toolsContent.replace("id: 'salary-calc',", "id: 'typing-speed',\n" + directoryCards.replace("  {\n", "").replace("\n  },", "") + "\n  },\n  {\n    id: 'salary-calc',");
  fs.writeFileSync(toolsPage, toolsContent, 'utf8');
  console.log('Added 3 new tools to tools/page.tsx');
} else {
  console.log('3 tools already in tools/page.tsx');
}
