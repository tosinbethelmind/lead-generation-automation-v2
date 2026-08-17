/**
 * src/lib/whatsapp.ts
 * 
 * High-Deliverability, Anti-Ban WhatsApp Outreach Engine
 * 
 * Implements:
 * 1. Warm-Up Schedule (Day 1-2 = 30 msgs/day cap, scaling thereafter)
 * 2. 2-Step Conversational Priming (Step 1: Permission Icebreaker -> Step 2: Pitch + Preview)
 * 3. Nigerian Business Hours Guard (8:30 AM – 6:30 PM WAT)
 * 4. Automatic STOP / Opt-out Suppression
 * 5. Multi-Layer Spintax Engine & Typing / Jitter Emulation
 */

import { getRuntimeConfig } from '@/lib/localConfig';
import { addLog, updateLeadStatus, isPhoneOnDnc } from '@/lib/googleSheets';
import {
  cleanPhoneNumber,
  getNextRotatedOutreachLine,
  incrementSendCount,
  isOptedOut,
  recordOptOut,
  getDailyLimitConfig
} from './whatsappRotator';

/**
 * Checks if current time is within standard Nigerian Business Hours (8:30 AM - 6:30 PM WAT, UTC+1).
 */
export function isWithinNigerianBusinessHours(): boolean {
  const now = new Date();
  // WAT is UTC+1
  const utcHours = now.getUTCHours();
  const utcMinutes = now.getUTCMinutes();
  const watDecimalHours = (utcHours + 1) + (utcMinutes / 60);
  
  // 8:30 AM = 8.5, 6:30 PM = 18.5
  return watDecimalHours >= 8.5 && watDecimalHours <= 18.5;
}

/**
 * Resolves spintax formatted text, e.g. "{Hi|Hello|Hey} {{lead.name}}" -> "Hi {{lead.name}}"
 * Masks double curly braces placeholders during parsing to prevent conflict.
 */
export function parseSpintax(text: string): string {
  if (!text) return '';

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
 * Formats the opt-out footer required for compliance and anti-ban protection.
 */
export const OPT_OUT_FOOTER = '\n\n(You can stop receiving messages from us anytime by replying STOP)';

/**
 * Checks if an incoming message is an unsubscribe/opt-out keyword.
 */
export function isOptOutKeyword(text: string): boolean {
  const clean = (text || '').trim().toLowerCase();
  const optOutTriggers = ['stop', 'unsubscribe', 'remove me', 'remove', 'opt out', 'opt-out', 'dont message me', "don't message me", 'block', 'cancel'];
  return optOutTriggers.some(trigger => clean === trigger || clean.startsWith(trigger));
}

/**
 * Handles incoming WhatsApp webhook message to process opt-outs automatically.
 */
export async function handleIncomingWhatsAppOptOut(fromPhone: string, messageText: string): Promise<boolean> {
  if (isOptOutKeyword(messageText)) {
    const cleaned = cleanPhoneNumber(fromPhone);
    recordOptOut(cleaned, `User opted out via message: "${messageText.slice(0, 50)}"`);
    await addLog('WhatsApp Opt-Out', 'SUCCESS', `Suppressed number ${cleaned} per STOP request`);
    return true;
  }
  return false;
}

/**
 * Sends a WhatsApp text message using the selected WhatsApp provider with full anti-ban protections.
 */
export async function sendWhatsAppMessage(
  lead: {
    lead_id: string;
    name: string;
    phone?: string;
    phone_e164?: string;
    phone_raw?: string;
    area?: string;
    category?: string;
  }, 
  previewUrl: string, 
  origin: string,
  customMessage?: string,
  options?: {
    bypassHoursCheck?: boolean;
    bypassDnc?: boolean;
    isIcebreaker?: boolean;
  }
) {
  const config = getRuntimeConfig();

  if (!config.whatsappEnabled && config.whatsappProvider === 'cloud') {
    throw new Error('WhatsApp outreach is disabled in configuration');
  }

  const phone = lead.phone || lead.phone_e164 || lead.phone_raw;
  if (!phone) {
    throw new Error('Lead does not have a phone number');
  }

  const cleanPhone = cleanPhoneNumber(phone);

  // 1. Suppression & Opt-Out Guard
  const isTestDispatch = options?.bypassDnc || lead.lead_id?.startsWith('test-') || lead.lead_id === 'demo' || lead.lead_id === 'test-lead-demo';

  if (!isTestDispatch && isOptedOut(cleanPhone)) {
    throw new Error(`Outreach blocked: ${cleanPhone} has opted out (DNC / STOP requested).`);
  }

  const dncCheck = await isPhoneOnDnc(cleanPhone);
  if (dncCheck && !isTestDispatch) {
    throw new Error(`Outreach blocked: ${cleanPhone} is on the Google Sheets Do-Not-Call registry.`);
  }

  // 2. Nigerian Business Hours Guard (8:30 AM - 6:30 PM WAT)
  if (!options?.bypassHoursCheck && !isWithinNigerianBusinessHours()) {
    throw new Error('Outreach paused: Outside Nigerian business hours (8:30 AM – 6:30 PM WAT). Queued for morning dispatch.');
  }

  // 3. Warm-Up & Quota Controller
  const rotatedLine = getNextRotatedOutreachLine();
  if (!rotatedLine.allowed) {
    const limits = getDailyLimitConfig();
    throw new Error(`Outreach rate-limit: ${rotatedLine.reason || `Day ${limits.currentDayNumber} daily limit reached`}`);
  }

  // 4. Template & Spintax Formatting
  const defaultTemplate = options?.isIcebreaker
    ? `{Good day|Hello|Good afternoon} {Sir/Ma|Team|Chief} 🙏,\n\n{Is this the management|Are you the team|Is this the lead engineer} {for|in charge of} {{lead.name}} {in|around} {{lead.area}}?`
    : `{Good day|Hello|Good afternoon} {{lead.name}} Team 👋,\n\n{We inspected your local market presence|We noticed your strong reputation} in {{lead.area}} and custom-built an interactive quote and customer portal preview for you:\n{{previewUrl}}\n\n{Feel free to test the interactive features directly on your phone.|Try calculating a sample quote on your phone!}\n\nBest regards,\n{{businessSignature}}${OPT_OUT_FOOTER}`;

  const template = customMessage || config.whatsappMessageTemplate || defaultTemplate;
  const spintaxTemplate = parseSpintax(template);

  let message = spintaxTemplate
    .replace(/{{\s*lead\.name\s*}}/g, lead.name || 'Valued Business')
    .replace(/{{\s*lead\.area\s*}}/g, lead.area || 'your area')
    .replace(/{{\s*previewUrl\s*}}/g, previewUrl)
    .replace(/{{\s*preview_url\s*}}/g, previewUrl)
    .replace(/{{\s*whatsappChannelUrl\s*}}/g, config.whatsappChannelUrl || 'https://whatsapp.com/channel/0029VbDFgKP4o7qM58yY9v2l')
    .replace(/{{\s*channelUrl\s*}}/g, config.whatsappChannelUrl || 'https://whatsapp.com/channel/0029VbDFgKP4o7qM58yY9v2l')
    .replace(/{{\s*businessSignature\s*}}/g, config.businessSignature || 'Bethelmind Analytics Lagos')
    .replace(/{{\s*signature\s*}}/g, config.businessSignature || 'Bethelmind Analytics Lagos');

  // Enforce opt-out footer on offer/pitch messages (if not an icebreaker and not already present)
  if (!options?.isIcebreaker && !message.toLowerCase().includes('stop')) {
    message += OPT_OUT_FOOTER;
  }

  const provider = config.whatsappProvider || 'evolution';

  if (provider === 'cloud') {
    // ── Meta WhatsApp Cloud API ──
    const templateName = config.whatsappTemplateName;
    const languageCode = config.whatsappTemplateLanguageCode || 'en_US';

    let payload: any;

    if (templateName) {
      payload = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: cleanPhone,
        type: 'template',
        template: {
          name: templateName,
          language: { code: languageCode },
          components: [
            {
              type: 'body',
              parameters: [
                { type: 'text', text: lead.name },
                { type: 'text', text: previewUrl },
                { type: 'text', text: config.businessSignature || '' }
              ]
            }
          ]
        }
      };
    } else {
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
    // ── Evolution API (with human presence simulation) ──
    if (!config.evolutionApiUrl || !config.evolutionInstanceName) {
      throw new Error('Evolution API URL and Instance Name must be configured.');
    }

    const baseUrl = config.evolutionApiUrl.replace(/\/+$/, '');
    const url = `${baseUrl}/message/sendText/${config.evolutionInstanceName}`;

    const payload = {
      number: cleanPhone,
      options: {
        delay: Math.floor(Math.random() * 2000) + 1500, // 1.5s - 3.5s typing simulation
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
      typing_time: Math.floor(Math.random() * 1500) + 1500
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
    // ── Local Baileys API Wrapper ──
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

  // Increment line send count for daily quota tracking
  incrementSendCount(rotatedLine.lineId);

  // Log successful send
  await addLog('WhatsApp Outreach', 'SUCCESS', `Sent (${rotatedLine.lineId}) to ${cleanPhone} via ${provider}`);
  await updateLeadStatus(lead.lead_id, 'CONTACTED', `WhatsApp message sent via ${provider} (${rotatedLine.lineId})`);
}

/**
 * Pre-verifies whether a phone number is registered on WhatsApp using local Baileys endpoint.
 */
export async function checkWhatsAppNumber(phone: string): Promise<{ active: boolean; existsOnWhatsApp: boolean }> {
  if (!phone) return { active: false, existsOnWhatsApp: false };
  const cleanPhone = cleanPhoneNumber(phone);
  if (cleanPhone.length < 10) return { active: false, existsOnWhatsApp: false };

  try {
    const config = getRuntimeConfig();
    const baseUrl = config.whatsappBaileysUrl || 'http://localhost:3007';
    const url = `${baseUrl.replace(/\/+$/, '')}/on-whatsapp?phone=${cleanPhone}`;

    const resp = await fetch(url, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(2000),
    });

    if (resp.ok) {
      const data = await resp.json();
      const exists = data.exists ?? data.registered ?? data.onWhatsApp ?? true;
      return { active: true, existsOnWhatsApp: Boolean(exists) };
    }
  } catch (_) {
    // Service offline or unconfigured - fallback to permissive check
  }

  return { active: true, existsOnWhatsApp: true };
}

/**
 * Anti-Detection Gaussian Outreach Delay Helper (45s to 120s).
 */
export async function getRandomOutreachDelay(minSec = 45, maxSec = 120): Promise<number> {
  const delayMs = Math.floor(Math.random() * (maxSec - minSec + 1) + minSec) * 1000;
  await new Promise((resolve) => setTimeout(resolve, delayMs));
  return delayMs;
}

/**
 * Dispatches a high-priority payment alert directly to the Admin WhatsApp Line.
 */
export async function sendAdminPaymentWhatsAppAlert(params: {
  leadName: string;
  clientName: string;
  clientEmail: string;
  amountNGN: number;
  paymentMethod: string;
  reference?: string;
}): Promise<boolean> {
  const adminPhone = process.env.ADMIN_WA_PHONE || '2348022791227';
  const cleanPhone = cleanPhoneNumber(adminPhone);

  const alertMessage = [
    `🚨🚨🚨 [HIGH-PRIORITY PAYMENT ALERT] 🚨🚨🚨`,
    ``,
    `🏢 Business: *${params.leadName}*`,
    `👤 Client: *${params.clientName}*`,
    `✉️ Email: ${params.clientEmail}`,
    `💰 Amount: *₦${params.amountNGN.toLocaleString()}*`,
    `💳 Gateway: *${params.paymentMethod.toUpperCase()}*`,
    params.reference ? `🔖 Ref: ${params.reference}` : '',
    ``,
    `👉 *ACTION REQUIRED:* Open your OPay app to confirm credit of ₦${params.amountNGN.toLocaleString()} from ${params.clientName}.`,
    `⏰ Time: ${new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`
  ].filter(Boolean).join('\n');

  try {
    const config = getRuntimeConfig();
    const baseUrl = config.whatsappBaileysUrl || 'http://localhost:3007';
    const url = `${baseUrl.replace(/\/+$/, '')}/send`;

    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: cleanPhone,
        message: alertMessage,
      }),
    });

    return resp.ok;
  } catch (err: any) {
    console.warn('Admin WhatsApp payment alert dispatch error:', err.message);
    return false;
  }
}
