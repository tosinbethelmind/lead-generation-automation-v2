const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  const script = [
    'echo "=== CANONICAL AUTH DIRS ==="',
    'for i in 1 2 3 4 5 6 7; do',
    '  dir="/root/lead-generation-automation-v2/local_db/baileys_auth_line$i"',
    '  if [ -d "$dir" ]; then',
    '    echo "--- Line $i ($dir) ---"',
    '    ls -la "$dir" | head -n 6',
    '    if [ -f "$dir/creds.json" ]; then',
    '      echo "creds.json exists! Size: $(wc -c < $dir/creds.json) bytes. Registered: $(grep -o \'"registered":[^,]*\' $dir/creds.json)"',
    '    else',
    '      echo "NO creds.json found in $dir"',
    '    fi',
    '  else',
    '    echo "Line $i directory does not exist ($dir)"',
    '  fi',
    'done',
    'echo "=== PERMANENT MASTER VAULT ==="',
    'ls -la /root/lead-generation-automation-v2/local_db/baileys_auth_permanent_master/ 2>/dev/null || echo "No permanent master dir"',
    'echo "=== BACKUPS VAULT ==="',
    'ls -la /root/lead-generation-automation-v2/local_db/baileys_auth_backups/ 2>/dev/null || echo "No backup dir"'
  ].join('\n');

  conn.exec(script, (err, stream) => {
    if (err) throw err;
    let out = '';
    stream.on('data', d => out += d);
    stream.on('close', () => {
      console.log(out);
      conn.end();
    });
  });
}).on('error', e => console.error(e.message))
.connect({ host: '169.58.182.92', port: 22, username: 'root', password: 'bethelmind2026', readyTimeout: 30000 });
