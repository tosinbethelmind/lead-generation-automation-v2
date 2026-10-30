const fs = require('fs');
const { execSync } = require('child_process');
const { runFullTestSuite } = require('./advanced_confirmatory_test_suite');

let token = '';
if (fs.existsSync('.env.local')) {
  const env = fs.readFileSync('.env.local', 'utf8');
  for (const line of env.split('\n')) {
    if (line.trim().startsWith('VERCEL_TOKEN=')) {
      token = line.trim().replace('VERCEL_TOKEN=', '').trim().replace(/^["']|["']$/g, '');
      break;
    }
  }
}

if (!token) {
  console.error('No VERCEL_TOKEN found in .env.local');
  process.exit(1);
}

console.log('🚀 Deploying verified build to Vercel production (www.bethelmindanalytics.com)...');
try {
  execSync('vercel --prod --yes', {
    encoding: 'utf8',
    stdio: 'inherit',
    env: {
      ...process.env,
      VERCEL_TOKEN: token,
      VERCEL_ORG_ID: 'team_qpoBet79QVTOafYzfLHzxKdG',
      VERCEL_PROJECT_ID: 'prj_vfMEvGXha5E1pvAZLXY9F9F0dp0n'
    }
  });
  console.log('\n✅ Vercel production build deployed successfully!');
  console.log('🔍 Executing Automated 360° Post-Deployment QA Suite on Live Production (https://www.bethelmindanalytics.com)...');
  
  runFullTestSuite().then(qaResult => {
    if (qaResult.ok) {
      console.log('🎉 100% PRODUCTION VERIFICATION PASSED! Site is healthy, responsive, and ready for client outreach.');
      process.exit(0);
    } else {
      console.error(`🚨 POST-DEPLOYMENT QA ALERT: ${qaResult.failed} checks failed! Review issues before sending traffic.`);
      process.exit(1);
    }
  }).catch(err => {
    console.error('QA Suite Execution Error:', err);
    process.exit(1);
  });
} catch (e) {
  console.error('Vercel deployment error:', e.message);
  process.exit(1);
}
