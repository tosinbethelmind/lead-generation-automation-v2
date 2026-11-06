with open('src/lib/pillar2/pillar2Engine.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re

old_func_pattern = r'export async function processOutboundQueue\(\) \{[\s\S]*?return \{[\s\S]*?pillar2: updatedTelemetry[\s\S]*?\};\s*\}'

new_func = '''export async function processOutboundQueue() {
  ensureBaselineTickets();
  const supabase = getSupabaseClient();
  let dispatchedCount = 0;
  let waCount = 0;
  let smsCount = 0;
  let emailCount = 0;

  for (const item of inMemoryQueue) {
    if (item.status === 'QUEUED_FOR_OUTBOUND' || item.status === 'DIRECT_CHAT_READY') {
      const e164 = item.recipientPhone;
      item.channels = item.channels || {
        whatsapp: { status: 'PENDING', link: item.directChatLink },
        sms: { status: 'READY_1TAP', link: item.smsLink, text: item.smsText, len: item.smsText?.length || 0 },
        email: { status: 'PENDING', link: item.emailLink, recipient: item.recipientEmail, subject: item.emailSubject }
      };

      const activeGateways: string[] = [];

      // 1. WhatsApp Dispatch via Contabo VPS WhatsApp API
      if (item.channels?.whatsapp?.status !== 'DISPATCHED_VPS' && e164 && e164 !== ADMIN_PHONE && e164 !== '2348022791227') {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 6000);
          const res = await fetch(VPS_SEND_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': VPS_API_KEY
            },
            body: JSON.stringify({
              phone: e164,
              message: item.scriptText,
              isColdOutreach: false,
              lineId: 1
            }),
            signal: controller.signal
          });
          clearTimeout(timeoutId);

          const data = await res.json().catch(() => ({}));
          if (res.ok && (data.success || data.messageId)) {
            item.channels.whatsapp.status = 'DISPATCHED_VPS';
            item.channels.whatsapp.messageId = data.messageId;
            item.channels.whatsapp.dispatchedAt = new Date().toISOString();
            activeGateways.push(`Contabo VPS WhatsApp (Line ${data.line || 1})`);
            waCount++;
          }
        } catch (_) {}
      } else if (item.channels?.whatsapp?.status === 'DISPATCHED_VPS') {
        activeGateways.push('Contabo VPS WhatsApp');
      }

      // 2. GSM SMS Dispatch via Airtel Gateway / Termii Cloud
      if (item.channels?.sms?.status !== 'DISPATCHED_SMS' && e164 && e164 !== ADMIN_PHONE && e164 !== '2348022791227') {
        try {
          const smsAttempt = await attemptSmsDispatch(e164, item.smsText);
          if (smsAttempt.dispatched) {
            item.channels.sms.status = 'DISPATCHED_SMS';
            item.channels.sms.gateway = smsAttempt.gateway;
            item.channels.sms.dispatchedAt = new Date().toISOString();
            activeGateways.push(smsAttempt.gateway);
            smsCount++;
          }
        } catch (_) {}
      } else if (item.channels?.sms?.status === 'DISPATCHED_SMS') {
        activeGateways.push(item.channels?.sms?.gateway || 'Airtel GSM SMS');
      }

      // 3. Corporate B2B Email Dispatch via Hostinger Direct SMTP
      const recipientEmail = item.recipientEmail;
      if (item.channels?.email?.status !== 'DISPATCHED_SMTP' && recipientEmail && !recipientEmail.includes('@example.com')) {
        try {
          const emailAttempt = await attemptEmailDispatch(recipientEmail, item.emailSubject, item.emailBody);
          if (emailAttempt.dispatched) {
            item.channels.email.status = 'DISPATCHED_SMTP';
            item.channels.email.gateway = emailAttempt.gateway;
            item.channels.email.dispatchedAt = new Date().toISOString();
            activeGateways.push(emailAttempt.gateway);
            emailCount++;
          }
        } catch (_) {}
      } else if (item.channels?.email?.status === 'DISPATCHED_SMTP') {
        activeGateways.push(item.channels?.email?.gateway || 'Hostinger SMTP');
      }

      // If any of the 3 channels succeeded or were previously dispatched
      if (activeGateways.length > 0) {
        item.status = 'DISPATCHED_MULTI_CHANNEL';
        item.dispatchedAt = new Date().toISOString();
        item.gateway = activeGateways.join(' + ');
        inMemoryDispatched.push({ ...item });
        dispatchedCount++;

        if (supabase) {
          try {
            await supabase.from('logs').insert({
              run_id: 'pillar2_mandates',
              step: 'PILLAR2_DISPATCHED',
              status: 'SUCCESS',
              message: JSON.stringify(item),
              tenant_id: 'default'
            });
          } catch (_) {}
        }
      }
    }
  }

  const updatedTelemetry = await getPillar2Telemetry();
  return {
    success: true,
    message: `Queue processed across all 3 platforms! Dispatched: ${waCount} WhatsApp, ${smsCount} GSM SMS, ${emailCount} Executive Emails.`,
    stats: { dispatchedCount, waCount, smsCount, emailCount },
    pillar2: updatedTelemetry
  };
}'''

match = re.search(old_func_pattern, text)
if match:
    text = text[:match.start()] + new_func + text[match.end():]
    with open('src/lib/pillar2/pillar2Engine.ts', 'w', encoding='utf-8') as f:
        f.write(text)
    print('Updated processOutboundQueue in pillar2Engine.ts!')
else:
    print('Could not match old processOutboundQueue pattern')
