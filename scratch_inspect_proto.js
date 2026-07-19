const fs = require('fs');

function inspectProto() {
  const binaryPath = 'C:\\Users\\HomePC\\AppData\\Local\\Programs\\Antigravity\\resources\\app\\extensions\\antigravity\\bin\\language_server_windows_x64.exe';
  if (!fs.existsSync(binaryPath)) {
    console.error("Binary not found!");
    return;
  }
  const buffer = fs.readFileSync(binaryPath);
  const str = buffer.toString('utf8');

  // Let's find occurrences of "GenerateContentRequest" or "GenerateContentResponse"
  let index = 0;
  while (true) {
    index = str.indexOf("GenerateContentRequest", index);
    if (index === -1) break;
    console.log(`\nFound GenerateContentRequest at index ${index}`);
    // Print 1000 characters around this index, filtered to printable ASCII
    const chunk = buffer.slice(Math.max(0, index - 200), index + 1500);
    const printable = chunk.toString('ascii').replace(/[^\x20-\x7E]/g, '.');
    console.log(printable);
    index += 22;
  }
}

inspectProto();
