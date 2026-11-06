const { Client } = require('ssh2');

const c = new Client();
c.on('ready', () => {
  c.exec('pm2 jlist', (err, stream) => {
    let out = '';
    stream.on('data', d => out += d);
    stream.on('close', () => {
      try {
        const list = JSON.parse(out);
        const match = list.find(p => p.pid === 1823594 || (p.pm2_env && p.pm2_env.pm_cwd && p.pm2_env.pm_cwd.includes('video_studio')));
        console.log('PM2 Match:', match ? match.name : 'None (not managed by PM2 directly)');
      } catch (e) {
        console.error(e);
      }
      c.end();
    });
  });
}).connect({ host: '169.58.182.92', port: 22, username: 'root', password: 'bethelmind2026', readyTimeout: 30000 });
