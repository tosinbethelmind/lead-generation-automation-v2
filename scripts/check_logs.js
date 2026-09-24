const fs = require('fs');
const path = require('path');

const LOCAL_DB_DIR = path.join(process.cwd(), 'local_db');

const logFiles = [
  'extended_harvester.log',
  'master_supervisor.log',
  'social_inbox_dispatcher.log',
  'tier5_web_outreach.log',
  'unified_master_autopilot.log'
];

console.log('--- LOG FILE STATS ---');
logFiles.forEach(file => {
  const fullPath = path.join(LOCAL_DB_DIR, file);
  if (fs.existsSync(fullPath)) {
    const stat = fs.statSync(fullPath);
    const content = fs.readFileSync(fullPath, 'utf8');
    const lines = content.split('\n').filter(Boolean);
    const lastLine = lines[lines.length - 1] || 'Empty';
    console.log(`${file}:`);
    console.log(`  Size: ${(stat.size / 1024).toFixed(1)} KB`);
    console.log(`  Last Modified: ${stat.mtime.toISOString()}`);
    console.log(`  Last Log Line: ${lastLine.substring(0, 150)}`);
  } else {
    console.log(`${file}: Not Found`);
  }
});
