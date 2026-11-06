const { Client } = require('ssh2');

const c = new Client();
c.on('ready', () => {
  console.log('SSH connected.');
  c.exec('grep -E "08021061457|07052090118|08033214589|08023456781|08035678912|2348021061457|2347052090118|2348033214589|2348023456781|2348035678912" /root/.pm2/logs/*.log', (err, stream) => {
    if (err) throw err;
    stream.on('data', d => process.stdout.write(d));
    stream.stderr.on('data', d => process.stderr.write(d));
    stream.on('close', () => {
      c.end();
    });
  });
}).connect({
  host: '169.58.182.92',
  port: 22,
  username: 'root',
  password: 'bethelmind2026'
});
