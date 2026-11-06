const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  const cmd = "tail -n 60 /root/.pm2/logs/bethelmind-evolution-out.log";
  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    stream.on('data', d => process.stdout.write(d));
    stream.stderr.on('data', d => process.stderr.write(d));
    stream.on('close', () => conn.end());
  });
}).connect({
  host: '169.58.182.92',
  port: 22,
  username: 'root',
  password: 'bethelmind2026',
  readyTimeout: 30000
});
