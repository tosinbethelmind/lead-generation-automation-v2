import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

file_path = os.path.join('src', 'lib', 'pillar2', 'pillar2Engine.ts')

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

old_attempt_email = """async function attemptEmailDispatch(to: string, subject: string, body: string) {
  try {
    const { sendSmtpMessage } = await import('@/lib/email');
    await sendSmtpMessage(to, subject, body);
    return { dispatched: true, gateway: 'Hostinger Direct SMTP (tosin@bethelmindanalytics.com)' };
  } catch (err: any) {
    return { dispatched: false, error: err?.message || 'SMTP fallback active' };
  }
}"""

new_attempt_email = """async function attemptEmailDispatch(to: string, subject: string, body: string) {
  // Primary Gateway: Hostinger Direct SMTP (smtp.hostinger.com:587)
  try {
    const { sendSmtpMessage } = await import('@/lib/email');
    await sendSmtpMessage(to, subject, body);
    return { dispatched: true, gateway: 'Hostinger Direct SMTP (tosin@bethelmindanalytics.com)' };
  } catch (err: any) {
    // Secondary Failover: Brevo Cloud API v3 (tosin@bethelmindanalytics.com)
    try {
      const { sendBrevoMessage } = await import('@/lib/email');
      await sendBrevoMessage(to, subject, body, {});
      return { dispatched: true, gateway: 'Brevo Cloud API v3 Failover (tosin@bethelmindanalytics.com)' };
    } catch (brevoErr: any) {
      return { dispatched: false, error: `Hostinger SMTP: ${err?.message} | Brevo: ${brevoErr?.message}` };
    }
  }
}"""

if old_attempt_email in content:
    content = content.replace(old_attempt_email, new_attempt_email, 1)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("✅ Wired Brevo API v3 failover into attemptEmailDispatch in pillar2Engine.ts")
else:
    print("❌ old_attempt_email not found")
