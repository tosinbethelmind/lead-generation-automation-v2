const fs = require('fs');
const path = require('path');

const wfPath = path.join(__dirname, '../.github/workflows/autonomous_247_cloud_engine.yml');
let yml = fs.readFileSync(wfPath, 'utf8');

const target = `      - name: Execute Daily B2B Email (600 Quota) & Webform Outreach Pass
        env:
          SUPABASE_URL: \${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_ROLE_KEY: \${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
          NEXT_PUBLIC_SUPABASE_URL: \${{ secrets.NEXT_PUBLIC_SUPABASE_URL || secrets.SUPABASE_URL }}
          BREVO_API_KEY: \${{ secrets.BREVO_API_KEY }}
          BREVO_SENDER_EMAIL: 'tosin@bethelmindanalytics.com'
          SMTP_HOST: 'smtp.hostinger.com'
          SMTP_PORT: '465'
          SMTP_SECURE: 'true'
          SMTP_USER: 'tosin@bethelmindanalytics.com'
          SMTP_PASS: \${{ secrets.SMTP_PASS }}
          NODE_ENV: 'production'
        run: |
          set +e
          npx tsx scripts/execute_today_300_emails_and_webforms.ts || true
          echo "✅ Daily Email & Webform Outreach Pass finished successfully in the cloud."`;

const replacement = `      - name: Execute Daily B2B Email & Webform Outreach Pass (PAUSED)
        run: |
          echo "⏸️ Pillar 1 B2B Email & Webform Outreach is PAUSED by Product Owner instruction."`;

if (yml.replace(/\r\n/g, '\n').includes(target.replace(/\r\n/g, '\n'))) {
  yml = yml.replace(/\r\n/g, '\n').replace(target.replace(/\r\n/g, '\n'), replacement);
  fs.writeFileSync(wfPath, yml, 'utf8');
  console.log('✅ GitHub Actions workflow successfully updated: Pillar 1 outreach paused.');
} else {
  console.error('❌ Target step not found in workflow yml');
}
