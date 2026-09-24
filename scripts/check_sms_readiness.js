async function check() {
  console.log('--- CHECKING SMS READINESS ---');
  
  // 1. Termii Balance
  const apiKey = 'tlv_HilsNNhBaQtzgLkf0nyq1Maie3kfr27xDYW2_d-JD6M';
  try {
    const res = await fetch('https://api.ng.termii.com/api/get-balance?api_key=' + apiKey);
    const data = await res.json();
    console.log('Termii Account Status:', data);
  } catch (e) {
    console.log('Termii Error:', e.message);
  }

  // 2. Local Gateways
  const gateways = [
    'http://127.0.0.1:8082',
    'http://192.168.0.121:8082',
    'http://10.226.108.45:8082'
  ];
  for (const g of gateways) {
    try {
      const res = await fetch(g, { method: 'GET', signal: AbortSignal.timeout(1500) });
      console.log(`Gateway ${g} Status: ${res.status}`);
    } catch (e) {
      console.log(`Gateway ${g}: Offline (${e.message})`);
    }
  }
}

check().catch(console.error);
