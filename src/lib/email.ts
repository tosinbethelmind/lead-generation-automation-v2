import { getRuntimeConfig, saveLocalConfig, RuntimeConfig } from './localConfig';
import { getValidAccessToken } from './googleAuth';

// ============================================================================
// Email Sender Helpers
// ============================================================================

export async function sendGmailMessage(to: string, subject: string, body: string, accessToken: string) {
  const rawMessage = [
    `To: ${to}`,
    `Subject: ${subject}`,
    'Content-Type: text/plain; charset="UTF-8"',
    'MIME-Version: 1.0',
    '',
    body
  ].join('\r\n');

  const encodedMail = Buffer.from(rawMessage)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const url = 'https://gmail.googleapis.com/gmail/v1/users/me/messages/send';
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw: encodedMail }),
  });

  if (!resp.ok) {
    const err = await resp.json();
    throw new Error(err.error?.message || resp.statusText);
  }
}

export async function sendResendMessage(to: string, subject: string, body: string, config: RuntimeConfig) {
  if (!config.resendApiKey) {
    throw new Error('Resend API Key is not configured.');
  }
  const from = config.resendFromEmail || 'onboarding@resend.dev';
  
  const resp = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      text: body,
    }),
  });

  const data = await resp.json();
  if (!resp.ok) {
    throw new Error(data.message || resp.statusText);
  }
}

export async function sendBrevoMessage(to: string, subject: string, body: string, config: RuntimeConfig) {
  if (!config.brevoApiKey) {
    throw new Error('Brevo API Key is not configured.');
  }
  const senderName = config.brevoSenderName || 'ApexReach';
  const senderEmail = config.brevoSenderEmail;
  if (!senderEmail) {
    throw new Error('Brevo Sender Email is not configured.');
  }

  const resp = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': config.brevoApiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: senderName, email: senderEmail },
      to: [{ email: to }],
      subject,
      textContent: body,
    }),
  });

  if (!resp.ok) {
    const data = await resp.json();
    throw new Error(data.message || resp.statusText);
  }
}

export async function sendNotificationEmail(to: string, subject: string, body: string): Promise<boolean> {
  const config = getRuntimeConfig();
  if (config.dryRun) {
    console.log('[sendNotificationEmail] Dry-run enabled, skipping email. Subject:', subject);
    return true;
  }

  const provider = config.emailProvider || 'gmail';

  try {
    if (provider === 'gmail') {
      const accessToken = await getValidAccessToken();
      await sendGmailMessage(to, subject, body, accessToken);
    } else if (provider === 'resend') {
      await sendResendMessage(to, subject, body, config);
    } else if (provider === 'brevo') {
      await sendBrevoMessage(to, subject, body, config);
    } else {
      console.warn(`[sendNotificationEmail] Unknown email provider: ${provider}`);
      return false;
    }
    return true;
  } catch (err: any) {
    console.error(`[sendNotificationEmail] Failed to send email via ${provider}:`, err.message);
    return false;
  }
}

/**
 * Send a marketing email to the business with optional custom subject/body.
 * Falls back to generic marketing config if subject/body not provided.
 */
export async function sendMarketingEmail(to: string, subject?: string, body?: string): Promise<boolean> {
  const config = getRuntimeConfig();
  const finalSubject = subject || config.marketingSubject || 'Special Offer from ApexReach';
  const finalBody = body || config.marketingBody || 'Hello,\n\nWe have exciting new services you might be interested in. Check them out at https://apexreach.com/offers.';
  return sendNotificationEmail(to, finalSubject, finalBody);
}

/**
 * Send payment confirmation email to the client who successfully claimed their site.
 */
export async function sendPaymentConfirmation(
  to: string,
  clientName: string,
  businessName: string,
  amountPaid: number,
  reference: string
): Promise<boolean> {
  const subject = `🎉 Payment Confirmed: ${businessName} claimed successfully!`;
  const body = `Hi ${clientName},

Thank you for your payment! We have successfully confirmed your payment of ₦${amountPaid.toLocaleString()} for claiming the business profile and landing page for "${businessName}".

Your Transaction Details:
- Business: ${businessName}
- Amount: ₦${amountPaid.toLocaleString()}
- Paystack Reference: ${reference}

Our team is currently setting up your live website custom routing. If you have a custom domain name you would like to map to this page, please reply to this email with the domain details.

Best regards,
The ApexReach Team`;

  return sendNotificationEmail(to, subject, body);
}

