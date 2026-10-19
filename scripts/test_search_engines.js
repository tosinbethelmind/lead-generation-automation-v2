const axios = require('axios');

async function testSearchEngines() {
  // Test DuckDuckGo
  try {
    const ddg = await axios.get('https://html.duckduckgo.com/html/?q=site%3Abusinesslist.com.ng+%22solar%22+%22080%22', {
      timeout: 8000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    console.log('✅ [DuckDuckGo HTML] Status:', ddg.status, 'Length:', ddg.data.length);
  } catch (e) {
    console.log('❌ [DuckDuckGo] Error:', e.message);
  }

  // Test Bing search
  try {
    const bing = await axios.get('https://www.bing.com/search?q=site%3Abusinesslist.com.ng+%22solar%22+%22080%22', {
      timeout: 8000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    console.log('✅ [Bing Search] Status:', bing.status, 'Length:', bing.data.length);
  } catch (e) {
    console.log('❌ [Bing] Error:', e.message);
  }
}

testSearchEngines();
