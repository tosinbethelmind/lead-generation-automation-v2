const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'src', 'app', 'tools', 'page.tsx');
let content = fs.readFileSync(file, 'utf8');

const targetPhrase = "href: '/tools/goal-grid',";
const startIdx = content.indexOf(targetPhrase);
const endPhrase = 'export default function ToolsHubPage()';
const endIdx = content.indexOf(endPhrase);

if (startIdx !== -1 && endIdx !== -1) {
  const cleanBlock = `href: '/tools/goal-grid',
    upsell: '🏆 VIP Club & ₦15k Model'
  },
  {
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
  },
  {
    id: 'salary-calc',
    title: 'SalaryTakeHome AI™ 2026 Net Pay & PAYE Tax Sizer',
    badge: '💰 Statutory Payroll Engine',
    category: 'wealth',
    description: 'Calculate your true monthly net salary after PAYE tax, 8% pension, NHF, and Consolidated Relief Allowances.',
    icon: Calculator,
    color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
    href: '/tools/salary-calc',
    upsell: '💎 ₦15k Wealth Model'
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
];

`;

  content = content.slice(0, startIdx) + cleanBlock + content.slice(endIdx);
  fs.writeFileSync(file, content, 'utf8');
  console.log('Successfully fixed syntax in tools/page.tsx!');
} else {
  console.error('Target phrases not found. startIdx:', startIdx, 'endIdx:', endIdx);
}
