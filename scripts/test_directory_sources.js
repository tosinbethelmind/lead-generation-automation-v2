const axios = require('axios');

async function testSources() {
  const sources = [
    { name: 'BusinessList Nigeria', url: 'https://www.businesslist.com.ng/category/solar-energy' },
    { name: 'Finelib', url: 'https://www.finelib.com/cities/lagos/business/solar-energy' },
    { name: 'VConnect', url: 'https://www.vconnect.com/lagos/solar-inverter-dealers' },
    { name: 'Africabizinfo', url: 'https://www.africabizinfo.com/categories/solar-energy-nigeria' }
  ];

  for (const s of sources) {
    try {
      const res = await axios.get(s.url, {
        timeout: 8000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
        }
      });
      console.log(`✅ [${s.name}] HTTP ${res.status} (Length: ${res.data?.length || 0})`);
    } catch (err) {
      console.log(`❌ [${s.name}] Error:`, err.response ? err.response.status : err.message);
    }
  }
}

testSources();
