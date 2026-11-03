const { fetchSERPWithFallback } = require('../src/lib/multiProviderRotator');

(async () => {
  try {
    const res = await fetchSERPWithFallback('site:nigeriapropertycentre.com "property request" Lekki', 3);
    console.log('SERP Dork Results:');
    if (res && res.organic) {
      res.organic.forEach((item, i) => {
        console.log(`${i+1}. [${item.title}] -> ${item.link}`);
        console.log(`   Snippet: ${item.snippet}`);
      });
    } else {
      console.log('No organic results or fallback response.');
    }
  } catch (err) {
    console.log('Error:', err.message);
  }
})();
