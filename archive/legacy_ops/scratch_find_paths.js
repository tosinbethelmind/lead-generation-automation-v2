const fs = require('fs');

function findPaths() {
  const binaryPath = 'C:\\Users\\HomePC\\AppData\\Local\\Programs\\Antigravity\\resources\\app\\extensions\\antigravity\\bin\\language_server_windows_x64.exe';
  if (!fs.existsSync(binaryPath)) {
    console.error("Binary not found!");
    return;
  }
  console.log("Reading binary...");
  const buffer = fs.readFileSync(binaryPath);
  const str = buffer.toString('utf8');

  // Search for any strings containing streamGenerateChat, StreamGenerateChat, or v1internal
  const regexes = [
    /v1internal:[a-zA-Z0-9_]*/gi,
    /v1\/projects\/[a-zA-Z0-9_{}\/]*/gi,
    /google\.cloud\.codeassist\.[a-zA-Z0-9._/-]*/gi,
    /\/google\.[a-zA-Z0-9._-]+\/[a-zA-Z0-9_-]+/gi
  ];

  console.log("Searching...");
  for (const r of regexes) {
    console.log(`\n--- Results for regex: ${r} ---`);
    const matches = new Set();
    let match;
    while ((match = r.exec(str)) !== null) {
      matches.add(match[0]);
    }
    for (const m of matches) {
      console.log(m);
    }
  }
}

findPaths();
