const fs = require('fs');

async function checkDeployments() {
  let token = '';
  if (fs.existsSync('.env.local')) {
    const lines = fs.readFileSync('.env.local', 'utf8').split('\n');
    for (const l of lines) {
      if (l.trim().startsWith('VERCEL_TOKEN=')) {
        token = l.trim().replace('VERCEL_TOKEN=', '').replace(/['"]/g, '').trim();
      }
    }
  }

  if (!token) {
    console.log('No VERCEL_TOKEN in .env.local');
    return;
  }

  try {
    const res = await fetch('https://api.vercel.com/v6/deployments?limit=5', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (!data.deployments) {
      console.log('No deployments returned:', data);
      return;
    }
    console.log('Latest Vercel Deployments:');
    data.deployments.forEach(d => {
      console.log(`- [${d.state}] ${d.url} (commit: ${d.meta?.githubCommitSha?.slice(0, 7) || 'n/a'}) - ${new Date(d.created).toLocaleTimeString()}`);
      if (d.errorMessage) console.log(`  Error: ${d.errorMessage}`);
    });
  } catch (err) {
    console.error('API error:', err.message);
  }
}

checkDeployments();
