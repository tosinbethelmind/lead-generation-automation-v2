const { execSync } = require('child_process');

const urls = [
  { name: '1. Solar BOQ Breakdown', url: 'https://www.nairaland.com/8769845/stop-overpaying-solar-installers-lagos' },
  { name: '2. Customs Duty & Tokunbo Surcharge', url: 'https://www.nairaland.com/8770162/lexus-rx350-corolla-tin-customs' },
  { name: '3. Retail Fake Alert Shield', url: 'https://www.nairaland.com/8770316/how-lagos-retailers-supermarkets-stop' },
  { name: '4. Lekki Building Material Matrix', url: 'https://www.nairaland.com/8770719/2026-reality-building-lekki-ibeju' },
  { name: '5. Private School Tuition Portal', url: 'https://www.nairaland.com/8770724/private-school-administrators-how-gate' },
  { name: '6. Restaurant 0% Comm Menu', url: 'https://www.nairaland.com/8770726/how-lagos-restaurants-slashing-delivery' }
];

let total = 0;
const results = urls.map(item => {
  try {
    const cmd = `curl.exe -s -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" "${item.url}"`;
    const html = execSync(cmd, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
    const m = html.match(/\(([\d,]+)\s*Views\)/i);
    const views = m ? parseInt(m[1].replace(/,/g, ''), 10) : 0;
    total += views;
    return { name: item.name, views, url: item.url };
  } catch(e) {
    return { name: item.name, views: 'err', error: e.message };
  }
});

console.log(JSON.stringify({ threads: results, totalFleetViews: total }, null, 2));
