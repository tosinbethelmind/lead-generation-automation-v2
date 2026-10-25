const https = require('https');

const options = {
  hostname: 'www.nairaland.com',
  path: '/8770162/lexus-rx350-corolla-tin-customs',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9'
  }
};

https.get(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('HTTP Status:', res.statusCode);
    console.log('HTML Length:', data.length);
    console.log('Contains /vin?:', data.includes('/vin'));
    console.log('Contains BethelmindAsistantBot?:', data.includes('BethelmindAsistantBot'));
    console.log('Contains selar.com/showlove/bethelmind?:', data.includes('selar.com/showlove/bethelmind'));
    console.log('Contains 0802 279 1227?:', data.includes('0802 279 1227'));
    
    // Find posts
    const posts = data.split('class="narrow"');
    console.log(`Found ${posts.length - 1} posts in thread.`);
    if (posts.length > 1) {
      const lastPost = posts[posts.length - 1];
      console.log('\n--- LAST POST SNIPPET ---');
      console.log(lastPost.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').substring(0, 500));
    }
  });
}).on('error', err => console.error('Error:', err.message));
