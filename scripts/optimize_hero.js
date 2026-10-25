const fs = require('fs');
const path = 'src/components/home/HeroSection.tsx';

let content = fs.readFileSync(path, 'utf8');

content = content.replace(/import ShaderGradientLiquidLogo[^\r\n]+\r?\n/, '');
content = content.replace(/import \{ LiquidGlassCard \}[^\r\n]+\r?\n/, '');
content = content.replace(/<ShaderGradientLiquidLogo[^>]+>/, '<span className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-400 to-emerald-400 flex items-center justify-center text-[11px] shadow-sm">⚡</span>');
content = content.replace(/<LiquidGlassCard[\s\S]*?style=\{\{ maxWidth: 1180, margin: '0 auto' \}\}\r?\n\s*>/, '<div style={{ maxWidth: 1180, margin: \'0 auto\', borderRadius: 24, padding: \'clamp(18px, 3vw, 28px)\', background: \'linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(10, 15, 30, 0.95) 100%)\', border: \'1px solid rgba(6, 182, 212, 0.25)\', boxShadow: \'0 20px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(6, 182, 212, 0.12)\', backdropFilter: \'blur(20px)\' }}>');
content = content.replace(/<\/LiquidGlassCard>/, '</div>');

fs.writeFileSync(path, content, 'utf8');
console.log('Successfully optimized HeroSection!');
