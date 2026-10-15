/**
 * @file scripts/sync_to_vps.js
 * Pulls the latest code onto Contabo VPS (169.58.182.92) and refreshes PM2
 */

const { Client } = require('ssh2');

const VPS_HOST = '169.58.182.92';
const VPS_USER = 'root';
const VPS_PASS = 'bethelmind2026';

const conn = new Client();

console.log(`Connecting to Contabo VPS (${VPS_HOST})...`);

conn.on('ready', () => {
  console.log('✅ Connected to VPS via SSH!');
  
  const cmd = `
    cd /root/lead-generation-automation-v2
    echo "=== STASHING VPS HARVESTED DATA ==="
    git stash -u
    echo "=== PULLING LATEST CODE ==="
    git fetch origin main
    git merge origin/main --no-edit
    echo "=== TESTING NEW COGNITIVE CLOSER ON VPS ==="
    node -e "const { handlePostContactInquiry } = require('./scripts/lib/closer_engine'); console.log('1. Greeting:', handlePostContactInquiry('Hello').intent); console.log('2. Instagram objection:', handlePostContactInquiry('I have Instagram already').intent); console.log('3. Installments:', handlePostContactInquiry('Can I pay small small?').intent); console.log('4. Pidgin:', handlePostContactInquiry('Wetin una dey do?').intent); console.log('5. Invoice:', handlePostContactInquiry('Send account').intent);"
    echo "=== PM2 STATUS ==="
    pm2 status
  `;

  conn.exec(cmd, (err, stream) => {
    if (err) {
      console.error('Exec error:', err.message);
      conn.end();
      return;
    }

    stream.on('close', (code) => {
      console.log(`\nCommand finished with exit code: ${code}`);
      conn.end();
    });

    stream.on('data', (data) => {
      process.stdout.write(data);
    });

    stream.stderr.on('data', (data) => {
      process.stderr.write(data);
    });
  });
}).on('error', (err) => {
  console.error('SSH Connection Error:', err.message);
});

conn.connect({
  host: VPS_HOST,
  port: 22,
  username: VPS_USER,
  password: VPS_PASS,
  readyTimeout: 30000
});
