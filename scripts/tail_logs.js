const fs = require('fs');
const path = require('path');

const LOCAL_DB_DIR = path.join(process.cwd(), 'local_db');

['extended_harvester.log', 'tier5_web_outreach.log', 'unified_master_autopilot.log'].forEach(file => {
  const p = path.join(LOCAL_DB_DIR, file);
  if (fs.existsSync(p)) {
    const lines = fs.readFileSync(p, 'utf8').split('\n').filter(Boolean);
    console.log(`\n=== LAST 15 LINES OF ${file} ===`);
    console.log(lines.slice(-15).join('\n'));
  }
});
