const fs = require('fs');
const https = require('https');

async function fetchMyAds(status) {
  const config = JSON.parse(fs.readFileSync('local_db/jiji_account_config.json', 'utf8'));
  const cookieStr = config.cookiesJson.map(c => c.name + '=' + c.value).join('; ');

  return new Promise((resolve, reject) => {
    const req = https.request(`https://jiji.ng/api_web/v1/profile/my-ads.json?status=${status}&page=1&size=20`, {
      headers: {
        'Cookie': cookieStr,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
        'Referer': 'https://jiji.ng/profile/adverts'
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve({ error: e.message, raw: data.slice(0, 300) });
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function main() {
  for (const st of ['declined', 'review', 'active', 'draft']) {
    const res = await fetchMyAds(st);
    console.log(`\n==============================`);
    console.log(`=== STATUS: ${st.toUpperCase()} ===`);
    console.log(`==============================`);
    const ads = res?.adverts_list || [];
    console.log(`Total count: ${ads.length}`);
    for (const ad of ads) {
      console.log(`\nAd #${ad.id}: "${ad.title}"`);
      console.log(`  Price: ${ad.price?.value || ad.price_title || 'N/A'}`);
      console.log(`  Main Image: ${ad.image}`);
      console.log(`  Images count: ${ad.images_count}`);
      console.log(`  Category: ${ad.category_name || ad.category_id}`);
      if (ad.moderation_errors) {
        console.log(`  MODERATION ERRORS:`, JSON.stringify(ad.moderation_errors));
      }
      if (ad.rejection_reason) {
        console.log(`  REJECTION REASON:`, ad.rejection_reason);
      }
      if (ad.decline_reasons) {
        console.log(`  DECLINE REASONS:`, JSON.stringify(ad.decline_reasons));
      }
      if (ad.actions) {
        console.log(`  Actions:`, ad.actions.join(', '));
      }
    }
  }
}

main().catch(console.error);
