const fs = require('fs');

function inspect() {
  const binaryPath = 'C:\\Users\\HomePC\\AppData\\Local\\Programs\\Antigravity\\resources\\app\\extensions\\antigravity\\bin\\language_server_windows_x64.exe';
  if (!fs.existsSync(binaryPath)) {
    console.error("Binary not found!");
    return;
  }
  console.log("Reading binary...");
  const buffer = fs.readFileSync(binaryPath);
  console.log("Searching for googleapis.com strings...");
  const str = buffer.toString('utf8');
  
  // Find strings with cloudcode
  const regex = /[a-zA-Z0-9.-]*cloudcode[a-zA-Z0-9.\/_:-]*/gi;
  const matches = new Set();
  let match;
  while ((match = regex.exec(str)) !== null) {
    matches.add(match[0]);
  }
  console.log("Found matches:");
  for (const m of matches) {
    console.log(m);
  }
}

inspect();
