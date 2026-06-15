import twilio from 'twilio';
import { getRuntimeConfig } from '@/lib/localConfig';

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
 * Replace placeholders in template strings.
 * Supported variables: {{lead.name}}, {{lead.company}}, {{lead.email}}, {{lead.phone}}, {{previewUrl}}, {{businessSignature}}, {{signature}}
 */
export function replaceSmsPlaceholders(template: string, lead: any, previewUrl: string): string {
  const config = getRuntimeConfig();
  const signature = config.businessSignature || '';
  const phone = lead.phone_e164 || lead.phone_raw || '';
  
  return template
    .replace(/{{\s*lead\.name\s*}}/g, lead.name || '')
    .replace(/{{\s*lead\.company\s*}}/g, lead.company || '')
    .replace(/{{\s*lead\.email\s*}}/g, lead.email || '')
    .replace(/{{\s*lead\.phone\s*}}/g, phone)
    .replace(/{{\s*previewUrl\s*}}/g, previewUrl)
    .replace(/{{\s*businessSignature\s*}}/g, signature)
    .replace(/{{\s*signature\s*}}/g, signature);
}

/**
 * Send an SMS message using the configured provider.
 */
export async function sendSmsMessage(lead: any, previewUrl: string, customMessage?: string): Promise<string> {
  const config = getRuntimeConfig();
  const provider = config.smsProvider || 'gateway';
  
  const rawTemplate = customMessage || config.smsMessageTemplate || 'Hello {{lead.name}}, please check {{previewUrl}} for details. {{signature}}';
  const messageText = replaceSmsPlaceholders(rawTemplate, lead, previewUrl);
  
  const rawPhone = lead.phone_e164 || lead.phone_raw;
  if (!rawPhone) {
    throw new Error('Lead does not contain a phone number.');
  }
  const phone = cleanPhoneNumber(rawPhone);

  if (provider === 'gateway') {
    const gatewayUrl = config.smsGatewayUrl;
    if (!gatewayUrl) {
      throw new Error('SMS Gateway URL is not configured.');
    }

    // A multi-compatible payload to support multiple Android SMS gateway formats out-of-the-box
    const payload = {
      to: phone,
      phone: phone,
      number: phone,
      message: messageText,
      text: messageText
    };

    const response = await fetch(gatewayUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gateway Error (${response.status}): ${errText || response.statusText}`);
    }

    return `Sent via Carrier Android Gateway to ${phone}`;
  } 
  
  else if (provider === 'termii') {
    const apiKey = config.termiiApiKey;
    const senderId = config.termiiSenderId || 'Sandbox';
    if (!apiKey) {
      throw new Error('Termii API key is not configured.');
    }

    // Termii API expects the number to be cleaned, typically without leading '+' sign for some routes,
    // but the system handles E.164. Let's strip '+' for Termii to ensure compatibility if needed,
    // though Termii accepts '+'. To be safe, keep numeric digits only for the 'to' parameter.
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
    const apiKey = config.africastalkingApiKey;
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
    const sid = config.twilioAccountSid;
    const token = config.twilioAuthToken;
    const from = config.twilioFromNumber;
    if (!sid || !token || !from) {
      throw new Error('Twilio configuration is incomplete.');
    }

    const client = twilio(sid, token);
    const result = await client.messages.create({
      to: phone,
      from: from,
      body: messageText,
    });

    return `Sent via Twilio to ${phone} (SID: ${result.sid})`;
  } 
  
  else {
    throw new Error(`Unknown SMS provider: ${provider}`);
  }
}
