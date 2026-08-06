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
    activeRunnerBackend: config.activeRunnerBackend || 'huggingface',
    githubToken: config.githubToken,
    githubRepo: config.githubRepo,
    supabaseUrl: config.supabaseUrl,
    supabaseKey: config.supabaseKey,
    scraperApiBaseUrl: 'https://lead-generation-automation-ecru.vercel.app',
    lagosDailyLeadTarget: 10000,
    lastGitHubDispatchTime: 0
  };

  console.log(`Upserting apexreach_runtime_config (activeRunnerBackend: "${payload.activeRunnerBackend}") in Supabase app_settings...`);
  
  let success = false;
  let delay = 1000;
  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .upsert({
          key: 'apexreach_runtime_config',
          value: JSON.stringify(payload),
          updated_at: new Date().toISOString()
        }, { onConflict: 'key' })
        .select();

      if (error) {
        const rawMsg = String(error.message || '');
        const cleanMsg = (rawMsg.includes('522') || rawMsg.includes('cf-error') || rawMsg.includes('<html'))
          ? 'Cloudflare 522 Timeout (Supabase Unreachable)'
          : rawMsg.replace(/<[^>]*>?/gm, '').slice(0, 100);
        console.warn(`⚠️ Attempt ${attempt}/5 failed: ${cleanMsg}. Retrying in ${delay / 1000}s...`);
        await new Promise(r => setTimeout(r, delay));
        delay *= 2;
        continue;
      }
      success = true;
      break;
    } catch (err) {
      const rawMsg = String(err?.message || '');
      const cleanMsg = (rawMsg.includes('522') || rawMsg.includes('cf-error') || rawMsg.includes('<html'))
        ? 'Cloudflare 522 Timeout (Supabase Unreachable)'
        : rawMsg.replace(/<[^>]*>?/gm, '').slice(0, 100);
      console.warn(`⚠️ Attempt ${attempt}/5 threw exception: ${cleanMsg}. Retrying in ${delay / 1000}s...`);
      await new Promise(r => setTimeout(r, delay));
      delay *= 2;
    }
  }

  if (!success) {
    console.error('❌ Failed to update Supabase app_settings after 5 attempts.');
    process.exit(1);
  }

  console.log(`✅ Supabase app_settings successfully updated for Active Runner: ${payload.activeRunnerBackend}!`);
}

sync().catch(console.error);
