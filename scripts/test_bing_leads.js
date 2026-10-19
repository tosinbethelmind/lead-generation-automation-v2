const axios = require('axios');
const cheerio = require('cheerio');

async function testBingExtraction() {
  const query = 'site:businesslist.com.ng "solar" "080"';
  const url = `https://www.bing.com/search?q=${encodeURIComponent(query)}&first=1`;
  console.log('Querying Bing:', url);

  try {
    const res = await axios.get(url, {
      timeout: 8000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
      }
    });

    const $ = cheerio.load(res.data);
    const results = [];

    $('li.b_algo').each((_, el) => {
      const title = $(el).find('h2 a').text().trim();
      const snippet = $(el).find('.b_caption p').text().trim();
      const fullText = `${title} ${snippet}`;

      const phoneMatch = fullText.match(/(?:(?:\+?234)|0)\s*[789][01](?:[\s.-]?\d){8}/);
      if (phoneMatch) {
        results.push({
          title,
          phone: phoneMatch[0].replace(/\s+/g, ''),
          snippet: snippet.slice(0, 100)
        });
      }
    });

    console.log(`✅ Extracted ${results.length} genuine leads from Bing:`);
    results.forEach((r, i) => console.log(`  [${i + 1}] ${r.title} -> ${r.phone}`));
  } catch (err) {
    console.error('Error:', err.message);
  }
}

testBingExtraction();
