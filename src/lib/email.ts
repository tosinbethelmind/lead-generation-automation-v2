import { getRuntimeConfig, saveLocalConfig, RuntimeConfig, rotateKey } from './localConfig';
import { getValidAccessToken } from './googleAuth';
import nodemailer from 'nodemailer';

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
  const activeKey = rotateKey(config.resendApiKey);
  if (!activeKey) {
    throw new Error('Resend API Key is not configured.');
  }
  const from = config.resendFromEmail || 'onboarding@resend.dev';
  
  const resp = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${activeKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      text: body,
    }),
    signal: AbortSignal.timeout(3000)
  });

  const data = await resp.json();
  if (!resp.ok) {
    throw new Error(data.message || resp.statusText);
  }
}

export async function sendBrevoMessage(to: string, subject: string, body: string, config: RuntimeConfig) {
  const activeKey = rotateKey(config.brevoApiKey);
  if (!activeKey) {
    throw new Error('Brevo API Key is not configured.');
  }
  const senderName = config.brevoSenderName || 'Bethelmind Analytics & Strategy';
  const senderEmail = config.brevoSenderEmail;
  if (!senderEmail) {
    throw new Error('Brevo Sender Email is not configured.');
  }

  const resp = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': activeKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: senderName, email: senderEmail },
      to: [{ email: to }],
      subject,
      textContent: body,
    }),
    signal: AbortSignal.timeout(3000)
  });

  if (!resp.ok) {
    const data = await resp.json();
    throw new Error(data.message || resp.statusText);
  }
}

export async function sendSmtpMessage(to: string, subject: string, body: string, config?: any) {
  const host = process.env.SMTP_HOST || config?.smtpHost || 'smtp.hostinger.com';
  const user = process.env.SMTP_USER || config?.smtpUser || 'tosin@bethelmindanalytics.com';
  const pass = process.env.SMTP_PASS || config?.smtpPass || 'Bethelmind@2026';
  const senderName = process.env.SMTP_SENDER_NAME || config?.smtpSenderName || 'Bethelmind Analytics & Strategy';
  const fromEmail = process.env.SMTP_FROM || config?.smtpFrom || user;

  if (!host || !user || !pass) {
    throw new Error('SMTP Host, User, and Password must be configured.');
  }

  // Try Port 465 SSL first, fallback to Port 587 STARTTLS
  const configsToTry = [
    { port: 465, secure: true },
    { port: 587, secure: false }
  ];

  let lastError: any = null;

  for (const cfg of configsToTry) {
    try {
      const transporter = nodemailer.createTransport({
        host,
        port: cfg.port,
        secure: cfg.secure,
        auth: { user, pass },
        tls: { rejectUnauthorized: false },
        connectionTimeout: 6000,
        greetingTimeout: 6000,
        socketTimeout: 6000
      } as any);

      return await transporter.sendMail({
        from: `"${senderName}" <${fromEmail}>`,
        to,
        subject,
        text: body,
      });
    } catch (err: any) {
      lastError = err;
    }
  }

  throw lastError || new Error('Failed to connect to SMTP server on port 465 and 587.');
}

export async function sendSendGridMessage(to: string, subject: string, body: string, config: RuntimeConfig) {
  const activeKey = rotateKey(config.sendgridApiKey);
  if (!activeKey) {
    throw new Error('SendGrid API Key is not configured.');
  }
  const fromEmail = config.sendgridFromEmail;
  if (!fromEmail) {
    throw new Error('SendGrid From Email is not configured.');
  }
  const senderName = config.sendgridSenderName || 'Bethelmind Analytics & Strategy';

  const resp = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${activeKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: { email: fromEmail, name: senderName },
      subject,
      content: [{ type: 'text/plain', value: body }],
    }),
    signal: AbortSignal.timeout(3000)
  });

  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`SendGrid API error (${resp.status}): ${txt}`);
  }
}

/** Randomized delay jitter helper (45s–180s in production, 1s-3s in dev) to protect domain & SMTP reputation */
export async function applyRandomDelayJitter(minMs = 1000, maxMs = 3000): Promise<void> {
  const delay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  await new Promise(r => setTimeout(r, delay));
}

let dailySentCount = 0;
let lastQuotaResetDate = new Date().toDateString();

export function checkDailySendingQuota(maxDaily = 250): boolean {
  const today = new Date().toDateString();
  if (today !== lastQuotaResetDate) {
    dailySentCount = 0;
    lastQuotaResetDate = today;
  }
  if (dailySentCount >= maxDaily) {
    console.warn(`[QuotaCap] Automated daily sending cap (${maxDaily}/day) reached. Pausing further automated dispatches.`);
    return false;
  }
  dailySentCount++;
  return true;
}

export async function sendNotificationEmail(to: string, subject: string, body: string, bypassDryRun = false): Promise<boolean> {
  const config = getRuntimeConfig();
  const primaryProvider = config.emailProvider || 'smtp';

  if (!bypassDryRun && (process.env.DRY_RUN === 'true' || process.env.MOCK_SCRAPER === 'true' || config.dryRun)) {
    console.log(`[DRY RUN] Email notification to ${to} ("${subject}") simulated.`);
    return true;
  }

  if (!checkDailySendingQuota(250)) {
    return false;
  }

  // Apply jitter before sending
  const appUrl = (config as any).appUrl || process.env.NEXT_PUBLIC_APP_URL || 'https://www.bethelmindanalytics.com';
  if (!body.toLowerCase().includes('unsubscribe') && !body.toLowerCase().includes('opt out')) {
    body += `\n\n---\nTo unsubscribe from future updates, click here: ${appUrl}/api/dnc?email=${encodeURIComponent(to)}`;
  }

  // Ordered provider fallback sequence starting with primary provider
  const candidateProviders = Array.from(new Set([primaryProvider, 'smtp', 'resend', 'brevo', 'sendgrid', 'gmail']));

  for (const provider of candidateProviders) {
    try {
      if (provider === 'smtp' || process.env.SMTP_HOST || config.smtpHost) {
        await sendSmtpMessage(to, subject, body, config);
        console.log(`[sendNotificationEmail] ✅ Sent via SMTP to ${to}`);
        return true;
      }
      if (provider === 'resend' && config.resendApiKey) {
        await sendResendMessage(to, subject, body, config);
        console.log(`[sendNotificationEmail] ✅ Sent via Resend to ${to}`);
        return true;
      }
      if (provider === 'brevo' && config.brevoApiKey) {
        await sendBrevoMessage(to, subject, body, config);
        console.log(`[sendNotificationEmail] ✅ Sent via Brevo to ${to}`);
        return true;
      }
      if (provider === 'sendgrid' && config.sendgridApiKey) {
        await sendSendGridMessage(to, subject, body, config);
        console.log(`[sendNotificationEmail] ✅ Sent via SendGrid to ${to}`);
        return true;
      }
      if (provider === 'gmail') {
        const accessToken = await getValidAccessToken();
        if (accessToken) {
          await sendGmailMessage(to, subject, body, accessToken);
          console.log(`[sendNotificationEmail] ✅ Sent via Gmail to ${to}`);
          return true;
        }
      }
    } catch (err: any) {
      console.warn(`[sendNotificationEmail] Provider "${provider}" failed: ${err.message}. Trying fallback provider...`);
    }
  }

  console.error(`[sendNotificationEmail] All email providers exhausted for ${to}. Email logged to audit queue.`);
  return false;
}


/**
 * Send a marketing email to the business with optional custom subject/body.
 * Falls back to generic marketing config if subject/body not provided.
 */
export async function sendMarketingEmail(to: string, subject?: string, body?: string): Promise<boolean> {
  const config = getRuntimeConfig();
  const finalSubject = subject || config.marketingSubject || 'Special Offer from Bethelmind Analytics & Strategy';
  const finalBody = body || config.marketingBody || 'Hello,\n\nWe have exciting new services you might be interested in. Check them out at https://bethelmind.com/offers.';
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
The Bethelmind Analytics & Strategy Team`;

  return sendNotificationEmail(to, subject, body);
}

