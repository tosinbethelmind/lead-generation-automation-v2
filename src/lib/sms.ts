import dns from 'dns';
try { dns.setDefaultResultOrder('ipv4first'); } catch (_) {}

import twilio from 'twilio';
import { getRuntimeConfig, getRotatedTwilioKeys, rotateKey } from './localConfig';
import { isOptedOut, cleanPhoneNumber as cleanWaPhone } from './whatsappRotator';
import { isPhoneOnDnc } from './googleSheets';

/**
 * Clean phone numbers to E.164 format.
 * Automatically converts local Nigerian numbers (e.g. 08031234567 -> +2348031234567).
 */
export function cleanPhoneNumber(phone: string): string {
  let cleaned = phone.replace(/[^\d+]/g, '');
  if (cleaned.startsWith('0') && cleaned.length === 11) {
    cleaned = '+234' + cleaned.substring(1);
  }
  return cleaned;
}

/**
 * Replace placeholders in template strings with adaptive multi-channel cross-referencing.
 * Supported variables: {{lead.name}}, {{lead.company}}, {{lead.email}}, {{lead.phone}}, {{previewUrl}}, {{businessSignature}}, {{signature}}
 */
export function replaceSmsPlaceholders(template: string, lead: any, previewUrl: string): string {
  const config = getRuntimeConfig();
  const signature = config.businessSignature || 'Bethelmind Lagos';
  const phone = lead.phone_e164 || lead.phone_raw || '';
  const emailText = lead.email ? lead.email.trim() : '';
  
  let formatted = template
    .replace(/{{\s*lead\.name\s*}}/g, lead.name || 'Valued Business')
    .replace(/{{\s*lead\.company\s*}}/g, lead.company || lead.name || '')
    .replace(/{{\s*lead\.email\s*}}/g, emailText)
    .replace(/{{\s*lead\.phone\s*}}/g, phone)
    .replace(/{{\s*previewUrl\s*}}/g, previewUrl)
    .replace(/{{\s*preview_url\s*}}/g, previewUrl)
    .replace(/{{\s*businessSignature\s*}}/g, signature)
    .replace(/{{\s*signature\s*}}/g, signature);

  // Safety guard: always include the preview URL in the SMS
  if (previewUrl && !formatted.includes(previewUrl)) {
    formatted += ` View: ${previewUrl}`;
  }

  // Adaptive Cross-channel reference: only append email notice if lead actually has an email address
  if (emailText && !formatted.includes(emailText) && formatted.length < 110) {
    formatted += ` (Sent to ${emailText})`;
  }

  if (!formatted.toLowerCase().includes('stop')) {
    formatted += ' (STOP to end)';
  }
  
  // Guarantee strict <= 158 character single-credit limit
  if (formatted.length > 158) {
    formatted = formatted.substring(0, 155) + '...';
  }
  
  return formatted;
}

let cachedWorkingGatewayEndpoint: string | null = null;
let cachedGatewayEndpointExpiry: number = 0;

/**
 * Probes candidate URLs or scans local subnets (e.g. 10.226.108.x) to locate live Android SMS Gateway
 */
async function discoverWorkingGatewayUrl(preferredUrl?: string): Promise<string | null> {
  if (cachedWorkingGatewayEndpoint && Date.now() < cachedGatewayEndpointExpiry) {
    return cachedWorkingGatewayEndpoint;
  }

  const staticCandidates = Array.from(new Set([
    preferredUrl,
    'http://10.226.108.45:8082',
    'http://10.132.90.251:8082',
    'http://192.168.0.121:8082',
    'http://100.107.243.108:8082',
    'http://127.0.0.1:8082'
  ].filter(Boolean))) as string[];

  // 1. Fast probe static candidate list
  for (const rawUrl of staticCandidates) {
    const endpoint = rawUrl.endsWith('/message') ? rawUrl : rawUrl.replace(/\/+$/, '') + '/message';
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      const res = await fetch(rawUrl.replace(/\/message$/, ''), { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.status >= 200 && res.status < 500) {
        cachedWorkingGatewayEndpoint = endpoint;
        cachedGatewayEndpointExpiry = Date.now() + 5 * 60 * 1000;
        return endpoint;
      }
    } catch (_) {}
  }

  // 2. Parallel sweep across local Wi-Fi subnet (10.226.108.x and 192.168.0.x)
  const subnets = ['10.226.108.', '192.168.0.', '192.168.1.'];
  for (const base of subnets) {
    const promises: Promise<string | null>[] = [];
    for (let i = 1; i <= 254; i++) {
      const testIp = `${base}${i}`;
      promises.push((async () => {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 1000);
          const res = await fetch(`http://${testIp}:8082`, { signal: controller.signal });
          clearTimeout(timeoutId);
          if (res.status >= 200 && res.status < 500) {
            return `http://${testIp}:8082/message`;
          }
        } catch (_) {}
        return null;
      })());
    }

    const results = await Promise.all(promises);
    const found = results.find(Boolean);
    if (found) {
      cachedWorkingGatewayEndpoint = found;
      cachedGatewayEndpointExpiry = Date.now() + 10 * 60 * 1000;
      return found;
    }
  }

  return null;
}

/**
 * Send an SMS message using the configured provider with full opt-out suppression.
 */
export async function sendSmsMessage(
  lead: any,
  previewUrl: string,
  customMessage?: string,
  configOverride?: any
): Promise<string> {
  const config = configOverride || getRuntimeConfig();
  const provider = config.smsProvider || 'gateway';
  
  const rawPhone = lead.phone_e164 || lead.phone_raw;
  if (!rawPhone) {
    throw new Error('Lead does not contain a phone number.');
  }
  const phone = cleanPhoneNumber(rawPhone);
  const waPhone = cleanWaPhone(rawPhone);

  // 1. Suppression & Opt-Out Guard
  const isTestDispatch = configOverride?.bypassDnc || lead.lead_id?.startsWith('test-') || lead.lead_id === 'demo' || lead.lead_id === 'test-lead-demo';

  if (!isTestDispatch && isOptedOut(waPhone)) {
    throw new Error(`SMS blocked: ${phone} has opted out (STOP requested).`);
  }

  const dncCheck = await isPhoneOnDnc(waPhone);
  if (dncCheck && !isTestDispatch) {
    throw new Error(`SMS blocked: ${phone} is on the Do-Not-Call registry.`);
  }

  const rawTemplate = customMessage || config.smsMessageTemplate || 'Good day {{lead.name}}, we built a custom quote portal for your business: {{previewUrl}} - {{signature}}';
  const messageText = replaceSmsPlaceholders(rawTemplate, lead, previewUrl);

  if (provider === 'gateway' || provider === 'cascade') {
    const payload = {
      to: phone,
      message: messageText
    };

    const token = config.smsGatewayToken || config.smsGatewayKey || config.smsGatewayAuth || 'f34af5ea-f657-41b1-b83e-4a59eb786e57';
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = token;

    const workingEndpoint = await discoverWorkingGatewayUrl(config.smsGatewayUrl);
    if (workingEndpoint) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);

        const response = await fetch(workingEndpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (response.ok) {
          return `Sent via Carrier Android Gateway (${workingEndpoint}) to ${phone}`;
        }
      } catch (gatewayErr: any) {
        cachedWorkingGatewayEndpoint = null;
        cachedGatewayEndpointExpiry = 0;
      }
    }

    // Termii Fallback
    const apiKey = config.termiiApiKey ? rotateKey(config.termiiApiKey) : 'tlv_HilsNNhBaQtzgLkf0nyq1Maie3kfr27xDYW2_d-JD6M';
    if (apiKey) {
      try {
        const termiiPhone = phone.replace('+', '');
        const payload = {
          to: termiiPhone,
          from: config.termiiSenderId || 'N-Alert',
          sms: messageText,
          type: 'plain',
          channel: 'generic',
          api_key: apiKey
        };

        const response = await fetch('https://api.ng.termii.com/api/sms/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await response.json();
        if (response.ok && (data.code === 'ok' || data.message_id)) {
          return `Sent via Termii Fallback to ${phone} (ID: ${data.message_id || 'N/A'})`;
        }
      } catch (termiiErr: any) {
        console.warn(`Termii Fallback failed: ${termiiErr.message}`);
      }
    }

    throw new Error(`SMS delivery failed on Android Gateway and Termii Fallback.`);
  }

  else if (provider === 'termii') {
    const apiKey = rotateKey(config.termiiApiKey);
    const senderId = config.termiiSenderId || 'Sandbox';
    if (!apiKey) {
      throw new Error('Termii API key is not configured.');
    }

    const termiiPhone = phone.replace('+', '');

    const payload = {
      to: termiiPhone,
      from: senderId,
      sms: messageText,
      type: 'plain',
      channel: 'generic',
      api_key: apiKey
    };

    const response = await fetch('https://api.ng.termii.com/api/sms/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok || (data && data.code && data.code !== 'ok' && data.message)) {
      throw new Error(`Termii Error: ${data.message || response.statusText}`);
    }

    return `Sent via Termii to ${phone} (Message ID: ${data.message_id || 'N/A'})`;
  } 
  
  else if (provider === 'africastalking') {
    const username = config.africastalkingUsername;
    const apiKey = rotateKey(config.africastalkingApiKey);
    const senderId = config.africastalkingSenderId;
    if (!username || !apiKey) {
      throw new Error("Africa's Talking username or API key is not configured.");
    }

    const params = new URLSearchParams();
    params.append('username', username);
    params.append('to', phone);
    params.append('message', messageText);
    if (senderId) {
      params.append('from', senderId);
    }

    const response = await fetch('https://api.africastalking.com/version1/messaging', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'apiKey': apiKey,
        'Accept': 'application/json'
      },
      body: params.toString(),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(`Africa's Talking Error: ${response.statusText}`);
    }

    const smsData = data.SMSMessageData;
    const recipient = smsData?.Recipients?.[0];
    if (recipient && recipient.status !== 'Success') {
      throw new Error(`Africa's Talking Error: ${recipient.status} - ${recipient.message || 'unknown error'}`);
    }

    return `Sent via Africa's Talking to ${phone}`;
  } 
  
  else if (provider === 'twilio') {
    const { accountSid, authToken, fromNumber } = getRotatedTwilioKeys(
      config.twilioAccountSid,
      config.twilioAuthToken,
      config.twilioFromNumber
    );
    if (!accountSid || !authToken || !fromNumber) {
      throw new Error('Twilio configuration is incomplete.');
    }

    const client = twilio(accountSid, authToken);
    const result = await client.messages.create({
      to: phone,
      from: fromNumber,
      body: messageText,
    });

    return `Sent via Twilio to ${phone} (SID: ${result.sid})`;
  } 
  
  else {
    throw new Error(`Unknown SMS provider: ${provider}`);
  }
}
