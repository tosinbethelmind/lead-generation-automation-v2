const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');

const VPS_HOST = '169.58.182.92';
const VPS_USER = 'root';
const VPS_PASS = 'bethelmind2026';
const REMOTE_ROOT = '/root/lead-generation-automation-v2';

const files = [
  'scripts/nairaland_autonomous_engine.js',
  'scripts/nairaland_autonomous_engine_vps.js',
  'scripts/lib/closer_engine.js',
  'scripts/dispatch_sales_closer_autoresponses.js',
  'scripts/execute_today_300_emails_and_webforms.ts',
  'scripts/run_nairaland_daemon.js',
  'local_db/nairaland_accounts.json',
  'local_db/nairaland_campaigns.json',
  'local_db/nairaland_session.json',
  'local_db/nairaland_session_kenetwork2026.json',
  'local_db/nairaland_session_4thmainland.json'
];

const conn = new Client();
conn.on('ready', () => {
  console.log('SSH Connected. Opening SFTP...');
  conn.sftp(async (err, sftp) => {
    if (err) {
      console.error('SFTP error:', err);
      conn.end();
      return;
    }

    for (const rel of files) {
      const localPath = path.resolve(__dirname, '..', rel);
      const remotePath = `${REMOTE_ROOT}/${rel}`;
      if (!fs.existsSync(localPath)) continue;
      const content = fs.readFileSync(localPath);

      await new Promise((resolve) => {
        sftp.writeFile(remotePath, content, (err) => {
          if (err) console.error(`Error uploading ${rel}:`, err.message);
          else console.log(`✓ Uploaded ${rel}`);
          resolve();
        });
      });
    }

    const cmd = `
      cd ${REMOTE_ROOT}
      pm2 delete bethelmind-nairaland-bumper 2>/dev/null || true
      pm2 start scripts/run_nairaland_daemon.js --name "bethelmind-nairaland-bumper" --max-memory-restart 250M
      pm2 save
      echo "=== PM2 STATUS ==="
      pm2 status bethelmind-nairaland-bumper
    `;

    console.log('Starting PM2 service on VPS...');
    conn.exec(cmd, (err, stream) => {
      if (err) {
        console.error('Exec error:', err);
        conn.end();
        return;
      }
      stream.on('data', d => process.stdout.write(d));
      stream.stderr.on('data', d => process.stderr.write(d));
      stream.on('close', code => {
        console.log(`\nDeployment finished with code: ${code}`);
        conn.end();
      });
    });
  });
}).on('error', err => {
  console.error('SSH Error:', err.message);
}).connect({
  host: VPS_HOST,
  port: 22,
  username: VPS_USER,
  password: VPS_PASS,
  readyTimeout: 60000,
  keepaliveInterval: 5000
});
