const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'app', 'tools', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add import
if (!content.includes('TurnkeySmeSetupBanner')) {
  content = content.replace(
    "import Footer from '@/components/home/Footer';",
    `import Footer from '@/components/home/Footer';\nimport { TurnkeySmeSetupBanner } from '@/components/TurnkeySmeSetupBanner';`
  );
}

// 2. Add component above Security footer
const target = `{/* Security & Verification Footer Seal */}`;
const replacement = `{/* Turnkey B2B SME Setup Banner */}
        <div className="mt-14 mb-8">
          <TurnkeySmeSetupBanner
            toolName="Commercial Sizer & Quoting Engine"
            category="Enterprise"
          />
        </div>

        {/* Security & Verification Footer Seal */}`;

content = content.replace(/\r\n/g, '\n');
const normTarget = target.replace(/\r\n/g, '\n');
const normReplacement = replacement.replace(/\r\n/g, '\n');

if (content.includes(normTarget)) {
  content = content.replace(normTarget, normReplacement);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('SUCCESS: Injected TurnkeySmeSetupBanner in tools directory!');
} else {
  console.error('Target not found in tools page');
}
