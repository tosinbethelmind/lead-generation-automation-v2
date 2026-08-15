const net = require('net');

const targets = [
  { host: 'smtp.hostinger.com', port: 465 },
  { host: 'smtp.hostinger.com', port: 587 },
  { host: 'mail.bethelmindanalytics.com', port: 465 },
  { host: 'mail.bethelmindanalytics.com', port: 587 },
  { host: 'smtp.titan.email', port: 465 },
  { host: 'smtp.titan.email', port: 587 },
];

async function checkPort(host, port) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(4000);
    socket.on('connect', () => {
      console.log(`✅ CONNECTED: ${host}:${port}`);
      socket.destroy();
      resolve(true);
    });
    socket.on('timeout', () => {
      console.log(`❌ TIMEOUT: ${host}:${port}`);
      socket.destroy();
      resolve(false);
    });
    socket.on('error', (err) => {
      console.log(`❌ ERROR: ${host}:${port} (${err.message})`);
      socket.destroy();
      resolve(false);
    });
    socket.connect(port, host);
  });
}

async function runChecks() {
  for (const t of targets) {
    await checkPort(t.host, t.port);
  }
}

runChecks().then(() => process.exit(0));
