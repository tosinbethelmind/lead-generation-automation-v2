const { Client } = require('ssh2');
const path = require('path');

const conn = new Client();
conn.on('ready', () => {
  console.log('Connected to Contabo VPS (169.58.182.92)...');
  conn.sftp((err, sftp) => {
    if (err) throw err;
    const local = path.join(__dirname, 'run_omnichannel_247_daemon.js');
    const remote = '/root/lead-generation-automation-v2/scripts/run_omnichannel_247_daemon.js';
    
    sftp.fastPut(local, remote, (errPut) => {
      if (errPut) throw errPut;
      console.log('✓ Uploaded run_omnichannel_247_daemon.js to VPS!');

      // Register PM2 service
      const cmd = `
        cd /root/lead-generation-automation-v2 && \
        pm2 start scripts/run_omnichannel_247_daemon.js --name "bethelmind-omnichannel-autopilot" --restart-delay 5000 && \
        pm2 save
      `;
      console.log('Registering and saving 24/7 PM2 service on VPS...');
      conn.exec(cmd, (errExec, streamExec) => {
        if (errExec) throw errExec;
        streamExec.on('data', d => process.stdout.write(d.toString()));
        streamExec.stderr.on('data', d => process.stderr.write(d.toString()));
        streamExec.on('close', (code) => {
          console.log(`\nPM2 registration finished with exit code: ${code}`);

          // Verify PM2 status
          conn.exec('pm2 status', (errStat, streamStat) => {
            if (errStat) throw errStat;
            streamStat.on('data', d => process.stdout.write(d.toString()));
            streamStat.on('close', () => conn.end());
          });
        });
      });
    });
  });
}).connect({
  host: '169.58.182.92',
  port: 22,
  username: 'root',
  password: 'bethelmind2026',
  readyTimeout: 30000
});
