const { Client } = require('ssh2');

const c = new Client();
c.on('ready', () => {
  console.log('SSH connected.');
  c.exec('grep -n -C 5 "MANDATORY PRE-FLIGHT VERIFICATION" /root/lead-generation-automation-v2/scripts/evolution_api_server.js', (err, stream) => {
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
