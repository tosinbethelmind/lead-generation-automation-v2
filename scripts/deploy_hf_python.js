const fs = require('fs');
const path = require('path');

// Helper to parse .env file
function parseEnvFile(filePath) {
  const env = {};
  if (!fs.existsSync(filePath)) return env;
  const content = fs.readFileSync(filePath, 'utf8');
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const parts = trimmed.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      let value = parts.slice(1).join('=').trim();
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      env[key] = value;
    }
  });
  return env;
}

async function run() {
  console.log('🚀 Starting Hugging Face Python Cloud Runner Deployer...');

  // 1. Read config.json
  const configPath = path.resolve(__dirname, '../config.json');
  if (!fs.existsSync(configPath)) {
    console.error('❌ config.json not found in project root.');
    process.exit(1);
  }
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

  const hfToken = config.hfToken;
  const spaceName = config.spaceName;

  if (!hfToken || !spaceName) {
    console.error('❌ hfToken or spaceName is missing in config.json.');
    process.exit(1);
  }

  console.log(`🔑 HF Space Name: ${spaceName}`);
  
  // 2. Read .env.local
  const envLocalPath = path.resolve(__dirname, '../.env.local');
  const env = parseEnvFile(envLocalPath);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY || '';
  const scraperApiBaseUrl = process.env.SCRAPER_API_BASE_URL || 'https://lead-generation-automation-e0oitxcsi.vercel.app';

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Supabase URL or Service Role Key missing in .env.local.');
    process.exit(1);
  }

  // 3. Authenticate with Hugging Face
  console.log('🔄 Checking Hugging Face access token...');
  const whoamiRes = await fetch('https://huggingface.co/api/whoami-v2', {
    headers: { Authorization: `Bearer ${hfToken}` }
  });

  if (!whoamiRes.ok) {
    const errMsg = await whoamiRes.text();
    console.error(`❌ Hugging Face Auth Failed: ${errMsg}`);
    process.exit(1);
  }

  const userData = await whoamiRes.json();
  const username = userData.name;
  console.log(`✅ Authenticated with Hugging Face as username: ${username}`);

  // 4. Create the Space repository
  console.log(`🔄 Creating/validating Space repository: ${username}/${spaceName}...`);
  const createRepoRes = await fetch('https://huggingface.co/api/repos/create', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${hfToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: spaceName,
      type: 'space',
      sdk: 'gradio',
      private: false
    })
  });

  if (createRepoRes.status === 409) {
    console.log(`ℹ️ Space ${username}/${spaceName} already exists. Continuing...`);
  } else if (!createRepoRes.ok) {
    const errMsg = await createRepoRes.text();
    console.error(`❌ Failed to create Space: ${errMsg}`);
    process.exit(1);
  } else {
    console.log(`✅ Space ${username}/${spaceName} created successfully!`);
  }

  // 5. Configure secrets on Hugging Face
  const secretsToSet = [
    { key: 'SUPABASE_URL', value: supabaseUrl },
    { key: 'SUPABASE_SERVICE_ROLE_KEY', value: supabaseKey },
    { key: 'SCRAPER_API_BASE_URL', value: scraperApiBaseUrl }
  ];

  console.log('🔄 Configuring secrets on Space...');
  for (const secret of secretsToSet) {
    console.log(`   - Setting secret: ${secret.key}`);
    const secretRes = await fetch(`https://huggingface.co/api/spaces/${username}/${spaceName}/secrets`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${hfToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ key: secret.key, value: secret.value })
    });

    if (!secretRes.ok) {
      const errMsg = await secretRes.text();
      console.warn(`⚠️ Warning: Failed to set ${secret.key}: ${errMsg}`);
    } else {
      console.log(`   ✅ Secret ${secret.key} set.`);
    }
  }

  // 6. Bundle and commit files (commit API)
  const appPyPath = path.resolve(__dirname, '../huggingface/app.py');
  const reqsTxtPath = path.resolve(__dirname, '../huggingface/requirements.txt');
  const readmeMdPath = path.resolve(__dirname, '../huggingface/README.md');

  if (!fs.existsSync(appPyPath) || !fs.existsSync(reqsTxtPath) || !fs.existsSync(readmeMdPath)) {
    console.error('❌ huggingface/ app.py, requirements.txt, or README.md is missing.');
    process.exit(1);
  }

  const actions = [
    {
      operation: 'add',
      path: 'app.py',
      content: fs.readFileSync(appPyPath).toString('base64'),
      encoding: 'base64'
    },
    {
      operation: 'add',
      path: 'requirements.txt',
      content: fs.readFileSync(reqsTxtPath).toString('base64'),
      encoding: 'base64'
    },
    {
      operation: 'add',
      path: 'README.md',
      content: fs.readFileSync(readmeMdPath).toString('base64'),
      encoding: 'base64'
    }
  ];

  console.log('🔄 Committing and uploading files to main branch...');
  const commitRes = await fetch(`https://huggingface.co/api/spaces/${username}/${spaceName}/commit/main`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${hfToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      commit_message: 'Automated deployment of Python Lead Gen Cloud Runner',
      actions
    })
  });

  if (!commitRes.ok) {
    const errMsg = await commitRes.text();
    console.error(`❌ Commit failed: ${errMsg}`);
    process.exit(1);
  }
  console.log('✅ Commit complete. Files uploaded.');

  // 7. Update config.json to activate huggingface runner backend
  console.log('🔄 Activating huggingface runner backend in config.json...');
  config.activeRunnerBackend = 'huggingface';
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
  console.log('✅ activeRunnerBackend updated to "huggingface" successfully.');

  console.log('\n🎉 Cloud Runner Deployment Successful!');
  console.log(`🌐 Visit your space dashboard: https://huggingface.co/spaces/${username}/${spaceName}`);
  console.log('====================================================\n');
}

run().catch((e) => {
  console.error('❌ Unexpected deployment error:', e);
});
