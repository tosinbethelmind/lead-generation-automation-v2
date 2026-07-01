import twilio from 'twilio';
import { getRuntimeConfig, getRotatedTwilioKeys } from '@/lib/localConfig';

/**
 * Replace placeholders in the template string.
 * Supported placeholders: {{lead.name}}, {{lead.company}}, {{lead.email}}, {{lead.phone}}, {{previewUrl}}, {{businessSignature}}
 */
function replacePlaceholders(template: string, lead: any, previewUrl: string, origin: string): string {
  return template
    .replace(/{{\s*lead\.name\s*}}/g, lead.name || '')
    .replace(/{{\s*lead\.company\s*}}/g, lead.company || '')
    .replace(/{{\s*lead\.email\s*}}/g, lead.email || '')
    .replace(/{{\s*lead\.phone\s*}}/g, lead.phone_e164 || lead.phone_raw || '')
    .replace(/{{\s*previewUrl\s*}}/g, previewUrl)
    .replace(/{{\s*businessSignature\s*}}/g, getRuntimeConfig().businessSignature || '');
}

/**
 * Initiate a cold‑call via Twilio.
 * If a custom TwiML URL is configured, we use it; otherwise we generate an inline TwiML response
 * that speaks the provided message template.
 */
export async function initiateColdCall(lead: any, previewUrl: string, origin: string, customMessage?: string): Promise<void> {
  const config = getRuntimeConfig();
  const { accountSid, authToken, fromNumber } = getRotatedTwilioKeys(
    config.twilioAccountSid,
    config.twilioAuthToken,
    config.twilioFromNumber
  );
  const { twilioCallMessageTemplate, twilioTwimlUrl } = config;

  if (!accountSid || !authToken || !fromNumber) {
    throw new Error('Twilio configuration is incomplete. Please set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_FROM_NUMBER.');
  }

  const client = twilio(accountSid, authToken);
  const toNumber = lead.phone_e164 || lead.phone_raw;
  if (!toNumber) {
    throw new Error('Lead does not contain a phone number.');
  }

  // Build the message that will be spoken.
  const messageTemplate = customMessage || twilioCallMessageTemplate || 'Hello {{lead.name}}, this is a call from {{businessSignature}}. Please check {{previewUrl}} for more details.';
  const spokenMessage = replacePlaceholders(messageTemplate, lead, previewUrl, origin);

  // If a custom TwiML URL is supplied we delegate to it, otherwise we send an inline <Say>.
  const twiml = twilioTwimlUrl
    ? undefined
    : new (require('twilio').twiml.VoiceResponse)().say({ voice: 'alice', language: 'en-US' }, spokenMessage).toString();

  const callOptions: any = {
    url: twilioTwimlUrl || undefined,
    twiml,
    to: toNumber,
    from: fromNumber,
  };

  // Twilio client expects either `url` (remote TwiML) or `twiml` (inline XML).
  // If we have a custom URL we omit the inline TwiML.
  if (twilioTwimlUrl) {
    delete callOptions.twiml;
  } else {
    delete callOptions.url;
  }

  await client.calls.create(callOptions);
}
