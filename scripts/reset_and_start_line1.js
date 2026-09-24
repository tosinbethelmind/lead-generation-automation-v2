const fs = require('fs');
const path = require('path');

const authDir = path.join(__dirname, '../sessions/session_line1');
console.log('Clearing stale session folder:', authDir);
try {
  fs.rmSync(authDir, { recursive: true, force: true });
  fs.mkdirSync(authDir, { recursive: true });
  console.log('✅ Auth directory cleared cleanly!');
} catch (e) {
  console.error('Error clearing auth directory:', e.message);
}

// Now launch whatsapp_baileys.js
require('./whatsapp_baileys.js');
