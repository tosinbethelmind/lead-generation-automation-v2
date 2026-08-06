const fs = require('fs');
const path = require('path');

console.log('====================================================');
console.log('       APEXREACH SECURITY & SECRETS AUDIT          ');
console.log('====================================================\n');

let issuesFound = 0;

// 1. Check .gitignore for .env protection
const gitignorePath = path.join(__dirname, '..', '.gitignore');
if (fs.existsSync(gitignorePath)) {
  const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
  if (gitignoreContent.includes('.env')) {
    console.log('[PASS] .gitignore correctly ignores .env files.');
  } else {
    console.log('[WARN] .gitignore does NOT explicitly ignore .env files!');
    issuesFound++;
  }
} else {
  console.log('[FAIL] .gitignore file is missing!');
  issuesFound++;
}

// 2. Secret Pattern Scanner
const SECRET_PATTERNS = [
  /sk-[a-zA-Z0-9]{32,}/g, // OpenAI keys
  /AIzaSy[a-zA-Z0-9_-]{33}/g, // Google API keys
  /AKIA[0-9A-Z]{16}/g, // AWS Access Keys
  /ghp_[a-zA-Z0-9]{36}/g, // GitHub Personal Access Tokens
  /sq0atp-[0-9A-Za-z\-_]{22}/g, // Square Access Tokens
];

function scanDirectory(dir, excludeDirs = ['node_modules', '.next', '.git', 'local_db', 'public']) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (!excludeDirs.includes(file)) {
        scanDirectory(fullPath, excludeDirs);
      }
    } else if (stat.isFile()) {
      const ext = path.extname(file);
      if (['.ts', '.tsx', '.js', '.jsx', '.json'].includes(ext)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        for (const pattern of SECRET_PATTERNS) {
          if (pattern.test(content)) {
            console.log(`[ALERT] Potential secret leak found in: ${fullPath}`);
            issuesFound++;
          }
        }
      }
    }
  }
}

console.log('\n[*] Scanning project files for hardcoded secrets...');
const srcDir = path.join(__dirname, '..', 'src');
if (fs.existsSync(srcDir)) {
  scanDirectory(srcDir);
}

console.log('\n----------------------------------------------------');
if (issuesFound === 0) {
  console.log('[SUCCESS] Audit complete! No secret leaks or missing git ignores found.');
} else {
  console.log(`[WARNING] Audit complete with ${issuesFound} issues flagged.`);
}
console.log('====================================================\n');
