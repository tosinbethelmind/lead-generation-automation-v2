const fs = require('fs');
const https = require('https');

const config = JSON.parse(fs.readFileSync('local_db/jiji_account_config.json', 'utf8'));

const cookieHeader = (config.cookiesJson || []).map(c => `${c.name}=${c.value}`).join('; ');

const options = {
  hostname: 'jiji.ng',
  path: '/api_web/v1/categories',
  method: 'GET',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
    'Cookie': cookieHeader,
    'Accept': 'application/json'
  }
};

const req = https.request(options, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    try {
      const parsed = JSON.parse(data);
      fs.writeFileSync('local_db/jiji_all_categories.json', JSON.stringify(parsed, null, 2));
      console.log('Saved categories to local_db/jiji_all_categories.json');

      // Search for software
      function searchCategories(cats, term) {
        let results = [];
        cats.forEach(c => {
          if (c.name && c.name.toLowerCase().includes(term.toLowerCase())) {
            results.push({ id: c.id, name: c.name, slug: c.slug, parent_id: c.parent_id });
          }
          if (c.children) {
            results = results.concat(searchCategories(c.children, term));
          }
        });
        return results;
      }

      const allCats = Array.isArray(parsed) ? parsed : (parsed.categories || parsed.data || []);
      const matches = searchCategories(allCats, 'software');
      console.log('Software Category Matches:', matches);
    } catch (e) {
      console.log('Response text (first 500 chars):', data.slice(0, 500));
    }
  });
});

req.on('error', e => console.error(e));
req.end();
