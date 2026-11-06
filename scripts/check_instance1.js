const { Client } = require('ssh2');

const c = new Client();
c.on('ready', () => {
  console.log('SSH connected.');
  c.exec('curl -s -H "apikey: evolution_bethelmind_secret_2026" http://localhost:8080/status; echo ""; curl -s -H "apikey: evolution_bethelmind_secret_2026" http://localhost:8080/instance/connectionState/instance_1', (err, stream) => {
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
