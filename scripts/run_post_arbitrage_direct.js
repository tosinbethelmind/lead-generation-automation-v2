const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  console.log('Connected to VPS, running --post --campaign=p2p-arbitrage with full verbosity...');
  const cmd = `cd /root/lead-generation-automation-v2 && node scripts/nairaland_autonomous_engine.js --post --campaign=p2p-arbitrage`;
  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    stream.on('data', d => process.stdout.write(d.toString()));
    stream.stderr.on('data', d => process.stderr.write(d.toString()));
    stream.on('close', (code) => {
      console.log(`\nFinished with code: ${code}`);
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
