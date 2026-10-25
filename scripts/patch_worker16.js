const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'unified_master_autopilot.js');
let code = fs.readFileSync(file, 'utf8');

const oldCode = `nairalandProcess = spawn('node', ['--max-old-space-size=256', 'scripts/nairaland_autonomous_engine.js', '--auto-cycle'], {`;
const newCode = `nairalandProcess = spawn('node', ['--max-old-space-size=256', 'scripts/run_nairaland_daemon.js'], {`;

if (code.includes(oldCode)) {
  code = code.replace(oldCode, newCode);
  fs.writeFileSync(file, code, 'utf8');
  console.log('Successfully updated Worker 16 in scripts/unified_master_autopilot.js to run run_nairaland_daemon.js!');
} else {
  console.log('Worker 16 already updated or string not matched.');
}
