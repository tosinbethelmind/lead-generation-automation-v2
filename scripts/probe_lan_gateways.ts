import axios from 'axios';

async function scanSubnet() {
  console.log('Scanning 192.168.0.x subnet for port 8082...');
  const promises = [];
  for (let i = 2; i < 255; i++) {
    const ip = `192.168.0.${i}`;
    const url = `http://${ip}:8082`;
    promises.push(
      axios.get(url, { timeout: 1500 })
        .then(res => {
          console.log(`🎯 DISCOVERED GATEWAY ON: ${url} (Status: ${res.status})`);
          return url;
        })
        .catch(() => null)
    );
  }

  const results = await Promise.all(promises);
  const found = results.filter(Boolean);
  if (found.length === 0) {
    console.log('❌ No active HTTP server found on port 8082 in 192.168.0.0/24');
  } else {
    console.log('✅ Active Gateways found:', found);
  }
}

scanSubnet().catch(console.error);
