const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

async function sync() {
  const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../config.json'), 'utf8'));
  const supabaseUrl = config.supabaseUrl;
  const supabaseKey = config.supabaseKey;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in config.json');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const payload = {
    activeRunnerBackend: 'github_actions',
    githubToken: config.githubToken,
    githubRepo: config.githubRepo,
    supabaseUrl: config.supabaseUrl,
    supabaseKey: config.supabaseKey,
    scraperApiBaseUrl: 'https://lead-generation-automation-ecru.vercel.app',
    lagosDailyLeadTarget: 10000,
    lastGitHubDispatchTime: 0
  };

  console.log('Upserting apexreach_runtime_config in Supabase app_settings...');
  const { data, error } = await supabase
    .from('app_settings')
    .upsert({
      key: 'apexreach_runtime_config',
      value: JSON.stringify(payload),
      updated_at: new Date().toISOString()
    }, { onConflict: 'key' })
    .select();

  if (error) {
    console.error('❌ Failed to update Supabase app_settings:', error.message);
    process.exit(1);
  }

  console.log('✅ Supabase app_settings successfully updated for GitHub Actions Cloud Runner!');
}

sync().catch(console.error);
