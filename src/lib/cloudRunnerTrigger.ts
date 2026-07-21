import { createClient } from '@supabase/supabase-js';
import { getRuntimeConfig } from './localConfig';

/**
 * Checks if the configured active runner backend is GitHub Actions and
 * triggers a repository dispatch to run the queue. Pings are throttled
 * to prevent duplicate runs when multiple jobs are queued rapidly.
 */
export async function triggerCloudRunnerIfNeeded(): Promise<boolean> {
  const config = getRuntimeConfig();

  // Load the durable configuration from Supabase 'app_settings',
  // which overrides the ephemeral /tmp/config.json in serverless environments.
  const supabaseUrl = config.supabaseUrl || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = config.supabaseKey || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.log('[RunnerTrigger] Missing Supabase credentials; skipping dispatch check.');
    return false;
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false }
  });

  try {
    const { data } = await supabase
      .from('app_settings')
      .select('value')
      .eq('key', 'apexreach_runtime_config')
      .maybeSingle();

    if (!data?.value) {
      console.log('[RunnerTrigger] No apexreach_runtime_config found in Supabase.');
      return false;
    }

    const parsedConfig = JSON.parse(data.value);
    const activeRunner = parsedConfig.activeRunnerBackend || 'local';

    if (activeRunner !== 'github_actions') {
      console.log(`[RunnerTrigger] Active runner is "${activeRunner}"; skipping GitHub dispatch.`);
      return false;
    }

    const { githubToken, githubRepo } = parsedConfig;
    if (!githubToken || !githubRepo) {
      console.log('[RunnerTrigger] GitHub token or repository is not configured in settings.');
      return false;
    }

    // Check if the GitHub Actions runner is already online (heartbeat < 30 seconds ago)
    const { data: heartbeatLogs } = await supabase
      .from('logs')
      .select('created_at')
      .eq('run_id', 'github_actions_runner')
      .eq('step', 'heartbeat')
      .order('created_at', { ascending: false })
      .limit(1);

    if (heartbeatLogs && heartbeatLogs.length > 0) {
      const logEntry = heartbeatLogs[0];
      const lastSeen = new Date(logEntry.created_at).getTime();
      const ageMs = Date.now() - lastSeen;
      if (ageMs < 30000) {
        console.log(`[RunnerTrigger] GitHub Actions runner is already online (last seen ${Math.round(ageMs / 1000)}s ago). Skipping trigger.`);
        return true;
      }
    }

    // Throttling: check if a dispatch was triggered very recently (< 60 seconds)
    const lastDispatch = parsedConfig.lastGitHubDispatchTime || 0;
    const sinceLastDispatch = Date.now() - lastDispatch;
    if (sinceLastDispatch < 60000) {
      console.log(`[RunnerTrigger] GitHub Action triggered recently (${Math.round(sinceLastDispatch / 1000)}s ago). Skipping to prevent workflow spam.`);
      return true;
    }

    // Optimistic dispatch timestamp update
    parsedConfig.lastGitHubDispatchTime = Date.now();
    await supabase
      .from('app_settings')
      .upsert({
        key: 'apexreach_runtime_config',
        value: JSON.stringify(parsedConfig),
        updated_at: new Date().toISOString()
      }, { onConflict: 'key' });

    // Trigger repository dispatch on GitHub
    console.log(`[RunnerTrigger] Dispatching run-queue workflow for GitHub repository: ${githubRepo}`);
    const dispatchUrl = `https://api.github.com/repos/${githubRepo}/dispatches`;
    const response = await fetch(dispatchUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.github+json',
        'Authorization': `Bearer ${githubToken}`,
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'ApexReach-App-Trigger'
      },
      body: JSON.stringify({
        event_type: 'run-queue'
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`[RunnerTrigger] GitHub API error: ${response.status} - ${errText}`);
      return false;
    }

    console.log('[RunnerTrigger] GitHub Actions Cloud runner triggered successfully!');
    return true;
  } catch (err: any) {
    console.error('[RunnerTrigger] Dispatch trigger failed:', err.message);
    return false;
  }
}
