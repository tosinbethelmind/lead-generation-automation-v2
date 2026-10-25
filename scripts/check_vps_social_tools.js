const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  const cmd = `
    echo "=== PM2 LIST ==="
    pm2 jlist | grep -o '"name":"[^"]*"'
    echo "=== DIRECTORIES IN /var/www/ ==="
    ls -la /var/www/
    echo "=== DIRECTORIES IN /var/www/naija-hub/ ==="
    ls -la /var/www/naija-hub/
    echo "=== GREP FOR SOCIAL PLATFORMS IN /root/ ==="
    grep -rnwi "/root/lead-generation-automation-v2/scripts/" -e "quora" -e "reddit" -e "pinterest" | head -n 30
  `;
  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    let out = '';
    stream.on('data', d => out += d.toString());
    stream.stderr.on('data', d => out += d.toString());
    stream.on('close', () => {
      console.log(out);
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
