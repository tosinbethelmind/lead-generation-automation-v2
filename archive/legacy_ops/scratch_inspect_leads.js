const fs = require('fs');

const fileContent = fs.readFileSync('./src/lib/preScrapedLeads.ts', 'utf8');
const match = fileContent.match(/const RAW_JSON = ("[\s\S]*?");/);

if (match) {
  const leads = JSON.parse(JSON.parse(match[1]));

  const seedCounts = {};
  const cityCounts = {};
  const catCounts = {};
  const typeCounts = {};

  leads.forEach(l => {
    const seed = l.source_query_or_seed || 'none';
    const city = l.city || 'none';
    const cat = l.category || 'none';
    const type = l.type || 'none';

    seedCounts[seed] = (seedCounts[seed] || 0) + 1;
    cityCounts[city] = (cityCounts[city] || 0) + 1;
    catCounts[cat] = (catCounts[cat] || 0) + 1;
    typeCounts[type] = (typeCounts[type] || 0) + 1;
  });

  console.log('=== SEED COUNTS ===', seedCounts);
  console.log('=== CITY COUNTS ===', cityCounts);
  console.log('=== TYPE COUNTS ===', typeCounts);
  console.log('=== TOP 10 CATEGORIES ===', Object.entries(catCounts).sort((a,b) => b[1] - a[1]).slice(0, 10));
}
