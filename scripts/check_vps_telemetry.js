const { Client } = require('ssh2');

const c = new Client();
c.on('ready', () => {
  console.log('SSH connected.');
  c.exec('node -e "const http = require(\'http\'); http.get(\'http://localhost:8080/mobile-telemetry\', res => { let data = \'\'; res.on(\'data\', d => data += d); res.on(\'end\', () => console.log(data)); });"', (err, stream) => {
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
