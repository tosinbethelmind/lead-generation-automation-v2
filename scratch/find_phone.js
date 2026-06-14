const fs = require('fs');
const content = fs.readFileSync('scratch/inspect_nuxt_data.log', 'utf16le');

console.log('Finding phone number occurrences...');
const matches = [];
let index = content.indexOf('2347059978547');
while (index !== -1) {
  matches.push({ type: '2347059978547', index, snippet: content.substring(index - 50, index + 50) });
  index = content.indexOf('2347059978547', index + 1);
}

let index2 = content.indexOf('7059978547');
while (index2 !== -1) {
  matches.push({ type: '7059978547', index: index2, snippet: content.substring(index2 - 50, index2 + 50) });
  index2 = content.indexOf('7059978547', index2 + 1);
}

console.log(JSON.stringify(matches, null, 2));
