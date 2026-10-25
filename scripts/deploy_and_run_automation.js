const { Client } = require('ssh2');
const path = require('path');

const conn = new Client();
conn.on('ready', () => {
  console.log('Connected to Contabo VPS (169.58.182.92)...');
  
  conn.sftp((err, sftp) => {
    if (err) throw err;
    const localFile = path.join(__dirname, 'nairaland_autonomous_engine_vps.js');
    const remoteFile = '/root/lead-generation-automation-v2/scripts/nairaland_autonomous_engine.js';
    
    console.log('Uploading updated engine to VPS...');
    sftp.fastPut(localFile, remoteFile, (err2) => {
      if (err2) throw err2;
      console.log('✓ Successfully uploaded updated engine to VPS!');

      // Step 1: Force bump all active threads (including thread 8770162)
      console.log('\n--- Step 1: Force Bumping All Active Fleet Threads ---');
      const bumpCmd = `cd /root/lead-generation-automation-v2 && FORCE_BUMP=1 node scripts/nairaland_autonomous_engine.js --bump`;
      
      conn.exec(bumpCmd, (err3, stream3) => {
        if (err3) throw err3;
        stream3.on('data', d => process.stdout.write(d.toString()));
        stream3.on('close', (code3) => {
          console.log(`\nBump completed with exit code: ${code3}`);

          // Step 2: Post p2p-arbitrage to Board 15 (Computers / Tech)
          console.log('\n--- Step 2: Publishing p2p-arbitrage to Board 15 (Computers) ---');
          const postCmd = `cd /root/lead-generation-automation-v2 && node scripts/nairaland_autonomous_engine.js --post --campaign=p2p-arbitrage`;
          
          conn.exec(postCmd, (err4, stream4) => {
            if (err4) throw err4;
            stream4.on('data', d => process.stdout.write(d.toString()));
            stream4.on('close', (code4) => {
              console.log(`\nPost p2p-arbitrage completed with exit code: ${code4}`);

              // Step 3: Restart PM2 daemon to ensure continuous 3-hour autonomous loop
              console.log('\n--- Step 3: Verifying PM2 Daemon bethelmind-nairaland-bumper ---');
              const pm2Cmd = `pm2 restart bethelmind-nairaland-bumper && pm2 status`;
              
              conn.exec(pm2Cmd, (err5, stream5) => {
                if (err5) throw err5;
                stream5.on('data', d => process.stdout.write(d.toString()));
                stream5.on('close', (code5) => {
                  console.log(`\nPM2 restart completed with code: ${code5}`);
                  conn.end();
                });
              });
            });
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
