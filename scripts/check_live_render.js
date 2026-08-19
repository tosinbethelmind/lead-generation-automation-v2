const https = require('https');

https.get('https://www.bethelmindanalytics.com/preview/5b99f7d1-f894-4902-aa24-e2276613e5a4', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('HTTP Status:', res.statusCode);
    console.log('Page Title:', data.match(/<title>([^<]*)<\/title>/i)?.[1]);
    
    // Check for raw UUID in visible text vs Next.js router params
    const regex = /5b99f7d1[a-zA-Z0-9\-_]*/gi;
    let match;
    const occurrences = [];
    while ((match = regex.exec(data)) !== null) {
      const start = Math.max(0, match.index - 60);
      const end = Math.min(data.length, match.index + match[0].length + 60);
      occurrences.push(data.slice(start, end).replace(/\n/g, ' '));
    }
    console.log('Occurrences count:', occurrences.length);
    console.log('Occurrences details:');
    occurrences.forEach((ctx, i) => console.log(`[${i+1}] ...${ctx}...`));
  });
});
