const http = require('http');

async function scanSubnet() {
  console.log('Scanning 192.168.0.x for Android SMS Gateway (port 8082)...');
  const candidates = [];
  for (let i = 2; i < 255; i++) {
    candidates.push(`192.168.0.${i}`);
  }

  const found = [];
  const chunkSize = 25;
  for (let i = 0; i < candidates.length; i += chunkSize) {
    const chunk = candidates.slice(i, i + chunkSize);
    await Promise.all(chunk.map(async (ip) => {
      try {
        const res = await fetch(`http://${ip}:8082`, { method: 'GET', signal: AbortSignal.timeout(600) });
        console.log(`🎯 FOUND ACTIVE GATEWAY AT: http://${ip}:8082 (Status: ${res.status})`);
        found.push(`http://${ip}:8082`);
      } catch (_) {}
    }));
  }

  console.log(`Scan finished. Found ${found.length} gateways.`);
}

scanSubnet();
