import { getRuntimeConfig } from '@/lib/localConfig';
import { addLog, updateLeadStatus } from '@/lib/googleSheets';

/**
 * Sends a WhatsApp text message using the selected WhatsApp provider.
 * Supports simple placeholder substitution in the message template.
 */
export async function sendWhatsAppMessage(
  lead: {
    lead_id: string;
    name: string;
    phone?: string;
  }, 
  previewUrl: string, 
  origin: string,
  customMessage?: string
) {
  const config = getRuntimeConfig();

  // If we are in legacy modes, check whatsappEnabled.
  // In the new unified selector, if provider is set, we assume WhatsApp is selected as outreach channel.
  if (!config.whatsappEnabled && config.whatsappProvider === 'cloud') {
    throw new Error('WhatsApp outreach is disabled in configuration');
  }

  if (!lead.phone) {
    throw new Error('Lead does not have a phone number');
  }

  // Clean the phone number (digits only, e.g. "2348012345678")
  const cleanPhone = lead.phone.replace(/\D/g, '');

  // Default template – can be overridden via config.whatsappMessageTemplate
  const defaultTemplate = `Hi {{lead.name}},\n\nWe generated a custom landing page for your business. Check it out: {{previewUrl}}\n\nBest, {{businessSignature}}`;
  const template = customMessage || config.whatsappMessageTemplate || defaultTemplate;

  // Simple placeholder substitution
  const message = template
    .replace(/{{\s*lead\.name\s*}}/g, lead.name)
    .replace(/{{\s*previewUrl\s*}}/g, previewUrl)
    .replace(/{{\s*businessSignature\s*}}/g, config.businessSignature || '')
    .replace(/{{\s*signature\s*}}/g, config.businessSignature || '');

  const provider = config.whatsappProvider || 'cloud';

  if (provider === 'cloud') {
    // ── Meta WhatsApp Cloud API ──
    const payload = {
      messaging_product: 'whatsapp',
      to: cleanPhone,
      type: 'text',
      text: { body: message },
    };

    const url = `https://graph.facebook.com/v16.0/${config.whatsappPhoneNumberId}/messages`;

    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.whatsappAccessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await resp.json();
    if (!resp.ok) {
      const errMsg = data.error?.message || resp.statusText;
      throw new Error(`Meta WhatsApp Cloud API error: ${errMsg}`);
    }
  } else if (provider === 'evolution') {
    // ── Evolution API (Self-Hosted QR Code Connection) ──
    if (!config.evolutionApiUrl || !config.evolutionInstanceName) {
      throw new Error('Evolution API URL and Instance Name must be configured.');
    }

    // Strip trailing slashes from API Url
    const baseUrl = config.evolutionApiUrl.replace(/\/+$/, '');
    const url = `${baseUrl}/message/sendText/${config.evolutionInstanceName}`;

    const payload = {
      number: cleanPhone,
      options: {
        delay: 1200,
        presence: 'composing'
      },
      textMessage: {
        text: message
      }
    };

    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': config.evolutionApiKey || '',
      },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const txt = await resp.text();
      throw new Error(`Evolution API error (${resp.status}): ${txt}`);
    }
  } else if (provider === 'whapi') {
    // ── Whapi.cloud API ──
    if (!config.whapiToken) {
      throw new Error('Whapi.cloud Token must be configured.');
    }

    const url = 'https://gate.whapi.cloud/messages/text';
    const payload = {
      to: `${cleanPhone}@s.whatsapp.net`,
      body: message,
      typing_time: 1500
    };

    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.whapiToken}`
      },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const txt = await resp.text();
      throw new Error(`Whapi.cloud error (${resp.status}): ${txt}`);
    }
  } else {
    throw new Error(`Unknown WhatsApp Provider: ${provider}`);
  }

  // Log successful send
  await addLog('WhatsApp Outreach', 'SUCCESS', `Sent to ${lead.phone} via ${provider}`);
  await updateLeadStatus(lead.lead_id, 'CONTACTED', `WhatsApp message sent via ${provider}`);
}
