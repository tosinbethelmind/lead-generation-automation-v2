const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'app', 'tools', '[slug]', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const updates = [
  { slug: "'solar-savings'", url: "https://selar.com/showlove/bethelmind?currency=NGN&item=solar-buster&amount=10000" },
  { slug: "'crypto-dca'", url: "https://selar.com/showlove/bethelmind?product=da-finance" },
  { slug: "'kids-learning'", url: "https://selar.com/showlove/bethelmind?product=da-kids" },
  { slug: "'biohack-longevity'", url: "https://selar.com/showlove/bethelmind?product=da-health" },
  { slug: "'wealth-calculator'", url: "https://selar.com/showlove/bethelmind?product=da-finance" },
  { slug: "'cashflow-calculator'", url: "https://selar.com/showlove/bethelmind?currency=NGN&item=land-dossier&amount=25000" },
  { slug: "'deal-calculator'", url: "https://selar.com/showlove/bethelmind?currency=NGN&item=land-dossier&amount=25000" },
  { slug: "'wholesaling-loi'", url: "https://selar.com/showlove/bethelmind?currency=NGN&item=land-dossier&amount=25000" },
  { slug: "'script-generator'", url: "https://selar.com/showlove/bethelmind?product=da-faceless" },
  { slug: "'site-audit'", url: "https://selar.com/showlove/bethelmind?product=da-b2bleadgen" },
  { slug: "'prayer-journal'", url: "https://selar.com/showlove/bethelmind?product=da-prayer" },
  { slug: "'ai-stack-finder'", url: "https://selar.com/showlove/bethelmind?product=da-aitools" },
  { slug: "'saas-radar'", url: "https://selar.com/showlove/bethelmind?product=da-saas" },
  { slug: "'sports-edge'", url: "https://selar.com/showlove/bethelmind?product=da-sports" },
  { slug: "'sure-score'", url: "https://selar.com/showlove/bethelmind?product=da-sports" },
  { slug: "'footy-wordle'", url: "https://selar.com/showlove/bethelmind?product=da-sports" },
  { slug: "'goal-grid'", url: "https://selar.com/showlove/bethelmind?product=da-sports" },
  { slug: "'typing-speed'", url: "https://selar.com/showlove/bethelmind?product=da-aitools" },
  { slug: "'focus-timer'", url: "https://selar.com/showlove/bethelmind?product=da-aitools" },
  { slug: "'runway-radar'", url: "https://selar.com/showlove/bethelmind?product=da-finance" },
  { slug: "'salary-calc'", url: "https://selar.com/showlove/bethelmind?product=da-finance" },
  { slug: "'higher-lower'", url: "https://selar.com/showlove/bethelmind?product=da-sports" },
  { slug: "'drama-radar'", url: "https://selar.com/showlove/bethelmind?product=da-reddit" },
];

for (const u of updates) {
  const toolRegex = new RegExp(`(${u.slug}:[\\s\\S]*?selarUrl:\\s*')https:\\/\\/selar\\.com\\/showlove\\/bethelmind(?:\\?[^']*)?(')`);
  if (toolRegex.test(content)) {
    content = content.replace(toolRegex, `$1${u.url}$2`);
    console.log(`Updated ${u.slug} -> ${u.url}`);
  } else {
    console.warn(`Could not find tool entry for ${u.slug}`);
  }
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Finished updating Selar URLs in src/app/tools/[slug]/page.tsx!');
