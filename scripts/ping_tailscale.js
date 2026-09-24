const http = require('http');

async function testTailscale() {
  const url = 'http://100.107.243.108:8082';
  console.log(`Pinging Tailscale Gateway: ${url}...`);
  try {
    const res = await fetch(url, { method: 'GET', signal: AbortSignal.timeout(3000) });
    console.log(`✅ Gateway responded with HTTP ${res.status}`);
  } catch (err) {
    console.log(`❌ Gateway unreachable: ${err.message}`);
  }
}

testTailscale();
