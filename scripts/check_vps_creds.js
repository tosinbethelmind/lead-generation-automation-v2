const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  const cmd = `node -e "
    const fs = require('fs');
    ['line1', 'line2', 'line4', 'line6', 'line7'].forEach(l => {
      const p = '/root/lead-generation-automation-v2/local_db/baileys_auth_' + l + '/creds.json';
      const bp = '/root/lead-generation-automation-v2/local_db/baileys_auth_backups/baileys_auth_' + l + '/creds.json';
      const fileToUse = fs.existsSync(p) ? p : (fs.existsSync(bp) ? bp : null);
      if (fileToUse) {
        const c = JSON.parse(fs.readFileSync(fileToUse, 'utf8'));
        console.log(l, 'file:', fileToUse);
        console.log('  me:', c.me);
        console.log('  registered:', c.registered);
        console.log('  account:', Boolean(c.account));
        console.log('  signalIdentities:', Boolean(c.signalIdentities));
      } else {
        console.log(l, 'NO CREDS FILE');
      }
    });
  "`;
  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    let out = '';
    stream.on('data', d => out += d);
    stream.stderr.on('data', d => out += d);
    stream.on('close', () => {
      console.log(out);
      conn.end();
    });
  });
}).on('error', e => console.error(e.message))
.connect({ host: '169.58.182.92', port: 22, username: 'root', password: 'bethelmind2026', readyTimeout: 30000 });
