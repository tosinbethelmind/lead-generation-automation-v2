with open('.github/workflows/autonomous_247_cloud_engine.yml', 'r', encoding='utf-8') as f:
    wf_text = f.read()

pillar2_step = '''      - name: Execute Autonomous Pillar 2 Luxury Mandate Discovery & Outbound Engine
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL || secrets.SUPABASE_URL }}
          SMTP_HOST: 'smtp.hostinger.com'
          SMTP_PORT: '465'
          SMTP_SECURE: 'true'
          SMTP_USER: 'tosin@bethelmindanalytics.com'
          SMTP_PASS: ${{ secrets.SMTP_PASS }}
          EVOLUTION_SEND_URL: 'http://169.58.182.92:8080/send'
          EVOLUTION_API_KEY: 'evolution_bethelmind_secret_2026'
          NODE_ENV: 'production'
        run: |
          set +e
          node --max-old-space-size=256 node_modules/tsx/dist/cli.mjs scripts/run_autonomous_pillar2_deal_discovery.js || true
          echo "✅ Continuous 24/7 Pillar 2 Luxury Mandate Discovery & Outbound Engine complete."

      - name: Execute Daily B2B Email (600 Quota) & Webform Outreach Pass'''

if 'Execute Daily B2B Email (600 Quota) & Webform Outreach Pass' in wf_text and 'run_autonomous_pillar2_deal_discovery.js' not in wf_text:
    wf_text = wf_text.replace(
        '      - name: Execute Daily B2B Email (600 Quota) & Webform Outreach Pass',
        pillar2_step
    )
    with open('.github/workflows/autonomous_247_cloud_engine.yml', 'w', encoding='utf-8') as f:
        f.write(wf_text)
    print('Updated .github/workflows/autonomous_247_cloud_engine.yml with continuous 24/7 Pillar 2 Discovery!')
else:
    print('Workflow already updated or step not found')

# Update mobile/page.tsx
with open('src/app/admin/mobile/page.tsx', 'r', encoding='utf-8') as f:
    mob_text = f.read()

old_interval = '''    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 15000); // 15s auto-sync

    window.addEventListener('beforeinstallprompt', (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    });

    return () => clearInterval(interval);'''

new_interval = '''    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 15000); // 15s auto-sync

    // Autonomous continuous deal discovery (every 8 minutes)
    const autonomousDiscoveryInterval = setInterval(async () => {
      try {
        await fetch('/api/admin/mobile-control', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-admin-token': 'bethelmind_admin_2026'
          },
          body: JSON.stringify({ action: 'run_pillar2_discovery' })
        });
        fetchTelemetry();
      } catch (_) {}
    }, 8 * 60 * 1000);

    window.addEventListener('beforeinstallprompt', (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    });

    return () => {
      clearInterval(interval);
      clearInterval(autonomousDiscoveryInterval);
    };'''

if old_interval in mob_text:
    mob_text = mob_text.replace(old_interval, new_interval)
    with open('src/app/admin/mobile/page.tsx', 'w', encoding='utf-8') as f:
        f.write(mob_text)
    print('Updated src/app/admin/mobile/page.tsx with autonomous continuous discovery interval!')
else:
    print('Mobile page interval not matched')
