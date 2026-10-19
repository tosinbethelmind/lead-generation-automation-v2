const axios = require('axios');

async function testJiji() {
  try {
    const url = 'https://jiji.ng/api_web/v1/listing?query=solar+lagos&page=1';
    console.log('Fetching:', url);
    const res = await axios.get(url, {
      timeout: 8000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      }
    });
    console.log('HTTP Status:', res.status);
    const adverts = res.data?.adverts_list?.adverts || [];
    console.log('Adverts found:', adverts.length);
    if (adverts.length > 0) {
      console.log('Sample Ad Title:', adverts[0].title);
      console.log('Sample Ad Phone:', adverts[0].user_phone || adverts[0].phone);
      console.log('Sample Ad Details snippet:', (adverts[0].details || '').slice(0, 100));
    }
  } catch (err) {
    console.error('Fetch error:', err.response ? `${err.response.status} ${err.response.statusText}` : err.message);
  }
}

testJiji();
