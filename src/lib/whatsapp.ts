import { getRuntimeConfig } from '@/lib/localConfig';
import { addLog, updateLeadStatus } from '@/lib/googleSheets';

/**
 * Resolves spintax formatted text, e.g. "{Hi|Hello|Hey} {{lead.name}}" -> "Hi {{lead.name}}"
 * Masks double curly braces placeholders during parsing to prevent conflict.
 */
export function parseSpintax(text: string): string {
  // 1. Mask double curly braces placeholders, e.g. {{lead.name}} -> __SPINTAX_PLACEHOLDER_0__
  const placeholders: string[] = [];
  const placeholderPattern = /\{\{[^{}]+\}\}/g;
  
  let processedText = text.replace(placeholderPattern, (match) => {
    placeholders.push(match);
    return `__SPINTAX_PLACEHOLDER_${placeholders.length - 1}__`;
  });

  // 2. Parse spintax options
  const spintaxPattern = /\{([^{}]+)\}/g;
  let matches = processedText.match(spintaxPattern);
  
  while (matches && matches.length > 0) {
    for (const match of matches) {
      const options = match.slice(1, -1).split('|');
      const chosen = options[Math.floor(Math.random() * options.length)];
      processedText = processedText.replace(match, chosen);
    }
    matches = processedText.match(spintaxPattern);
  }

  // 3. Unmask placeholders
  for (let i = 0; i < placeholders.length; i++) {
    processedText = processedText.replace(`__SPINTAX_PLACEHOLDER_${i}__`, placeholders[i]);
  }

  return processedText;
}

/**
 * Sends a WhatsApp text message using the selected WhatsApp provider.
 * Supports simple placeholder substitution in the message template.
 */
export async function sendWhatsAppMessage(
  lead: {
    lead_id: string;
    name: string;
    phone?: string;
    phone_e164?: string;
    phone_raw?: string;
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

  const phone = lead.phone || lead.phone_e164 || lead.phone_raw;
  if (!phone) {
    throw new Error('Lead does not have a phone number');
  }

  // Clean the phone number (digits only, e.g. "2348012345678")
  const cleanPhone = phone.replace(/\D/g, '');

  // Default template – can be overridden via config.whatsappMessageTemplate
  const defaultTemplate = `Hi {{lead.name}},\n\nWe generated a custom landing page for your business. Check it out: {{previewUrl}}\n\nBest, {{businessSignature}}`;
  const template = customMessage || config.whatsappMessageTemplate || defaultTemplate;

  // Resolve spintax variations (e.g. {Hi|Hello|Hey})
  const spintaxTemplate = parseSpintax(template);

  // Simple placeholder substitution
  const message = spintaxTemplate
    .replace(/{{\s*lead\.name\s*}}/g, lead.name)
    .replace(/{{\s*previewUrl\s*}}/g, previewUrl)
    .replace(/{{\s*businessSignature\s*}}/g, config.businessSignature || '')
    .replace(/{{\s*signature\s*}}/g, config.businessSignature || '');

  const provider = config.whatsappProvider || 'cloud';

  if (provider === 'cloud') {
    // ── Meta WhatsApp Cloud API ──
    const templateName = config.whatsappTemplateName;
    const languageCode = config.whatsappTemplateLanguageCode || 'en_US';

    let payload: any;

    if (templateName) {
      // Sending a Template Message (Recommended/Required for Cold Outreach)
      payload = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: cleanPhone,
        type: 'template',
        template: {
          name: templateName,
          language: {
            code: languageCode
          },
          components: [
            {
              type: 'body',
              parameters: [
                {
                  type: 'text',
                  text: lead.name
                },
                {
                  type: 'text',
                  text: previewUrl
                },
                {
                  type: 'text',
                  text: config.businessSignature || ''
                }
              ]
            }
          ]
        }
      };
    } else {
      // Fallback: Sending a Free-Form Text Message (Requires an active 24-hour session window)
      payload = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: cleanPhone,
        type: 'text',
        text: { body: message }
      };
    }

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
      const subDetails = data.error?.error_data?.details || '';
      throw new Error(`Meta WhatsApp Cloud API error: ${errMsg}${subDetails ? ` (${subDetails})` : ''}`);
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
  } else if (provider === 'baileys') {
    // ── Local/Custom Baileys API Wrapper ──
    const baseUrl = config.whatsappBaileysUrl || 'http://localhost:3007';
    const url = `${baseUrl.replace(/\/+$/, '')}/send`;

    const payload = {
      phone: cleanPhone,
      message: message
    };

    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const txt = await resp.text();
      throw new Error(`Local Baileys service error (${resp.status}): ${txt}`);
    }
  } else {
    throw new Error(`Unknown WhatsApp Provider: ${provider}`);
  }

  // Log successful send
  await addLog('WhatsApp Outreach', 'SUCCESS', `Sent to ${lead.phone} via ${provider}`);
  await updateLeadStatus(lead.lead_id, 'CONTACTED', `WhatsApp message sent via ${provider}`);
}
