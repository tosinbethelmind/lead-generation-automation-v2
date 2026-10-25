const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  console.log('Connected to Contabo VPS (169.58.182.92)...');

  // Step 1: Force bump Thread 8770162 and all active fleet threads
  const cmd = `cd /root/lead-generation-automation-v2 && FORCE_BUMP=1 node scripts/nairaland_autonomous_engine.js --bump`;
  console.log('Running Step 1 (Bump):', cmd);

  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    let out = '';
    stream.on('close', (code) => {
      console.log('\nBump exit code:', code);

      // Step 2: Post p2p-arbitrage to Board 24 (Business)
      console.log('\n--- Running Step 2: Post p2p-arbitrage to Board 24 (Business) ---');
      const postCmd = `cd /root/lead-generation-automation-v2 && node scripts/nairaland_autonomous_engine.js --post --campaign=p2p-arbitrage`;
      conn.exec(postCmd, (err2, stream2) => {
        if (err2) throw err2;
        let out2 = '';
        stream2.on('close', (code2) => {
          console.log('\nPost exit code:', code2);
          conn.end();
        }).on('data', d => {
          process.stdout.write(d.toString());
          out2 += d.toString();
        });
      });
    }).on('data', d => {
      process.stdout.write(d.toString());
      out += d.toString();
    });
  });
}).connect({
  host: '169.58.182.92',
  port: 22,
  username: 'root',
  password: 'bethelmind2026',
  readyTimeout: 30000
});
