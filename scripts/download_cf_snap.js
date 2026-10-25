const { Client } = require('ssh2');
const path = require('path');

const conn = new Client();
conn.on('ready', () => {
  conn.sftp((err, sftp) => {
    if (err) throw err;
    const remote = '/root/lead-generation-automation-v2/local_db/cf_challenge_snap.png';
    const local = path.join(__dirname, '..', 'local_db', 'cf_challenge_snap.png');
    sftp.fastGet(remote, local, (err2) => {
      if (err2) {
        console.error('Download error:', err2.message);
      } else {
        console.log('Downloaded cf_challenge_snap.png to', local);
      }
      conn.end();
    });
  });
}).connect({
  host: '169.58.182.92',
  port: 22,
  username: 'root',
  password: 'bethelmind2026',
  readyTimeout: 30000
});
