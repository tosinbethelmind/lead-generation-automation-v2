/**
 * @file src/lib/zeroCostValidator.ts
 * Zero-Cost Production Lead Validation Engine.
 * 
 * Performs:
 *  1. MX Record & SMTP Handshake DNS Verification (Email Validation)
 *  2. WhatsApp Active Account Verification via Local Baileys Microservice
 *  3. E.164 Nigerian Phone Format Normalization & Carrier Prefix Validation
 */

import dns from 'dns';
import net from 'net';

/**
 * Verify domain MX records via DNS lookup (Zero cost, high accuracy)
 */
export async function verifyDomainMx(email: string): Promise<boolean> {
  if (!email || !email.includes('@')) return false;
  const domain = email.split('@')[1]?.toLowerCase().trim();
  if (!domain) return false;

  // Filter out dummy/disposable domains
  const blockedDomains = new Set([
    'example.com', 'test.com', 'domain.com', 'none.com', 'tempmail.com', 
    'mailinator.com', 'yopmail.com', 'dispostable.com', 'wixpress.com'
  ]);
  if (blockedDomains.has(domain)) return false;

  try {
    const addresses = await dns.promises.resolveMx(domain);
    return Array.isArray(addresses) && addresses.length > 0;
  } catch (_) {
    return false;
  }
}

/**
 * Perform non-intrusive SMTP Handshake (HELO -> MAIL FROM -> RCPT TO)
 * Checks if mailbox exists without delivering actual email.
 */
export async function verifyEmailMxSmtp(email: string, timeoutMs = 4000): Promise<boolean> {
  const isMxValid = await verifyDomainMx(email);
  if (!isMxValid) return false;

  const domain = email.split('@')[1]?.toLowerCase().trim();
  if (!domain) return false;

  return new Promise(async (resolve) => {
    let resolved = false;
    const finish = (result: boolean) => {
      if (!resolved) {
        resolved = true;
        resolve(result);
      }
    };

    const timer = setTimeout(() => finish(true), timeoutMs); // If SMTP port 25 is blocked by ISP, fallback to MX valid (true)

    try {
      const mxRecords = await dns.promises.resolveMx(domain);
      if (!mxRecords || mxRecords.length === 0) return finish(false);
      
      const primaryMx = mxRecords.sort((a, b) => a.priority - b.priority)[0].exchange;
      const socket = net.createConnection(25, primaryMx);

      socket.setTimeout(timeoutMs);

      let step = 0;
      socket.on('data', (data) => {
        const str = data.toString();
        if (step === 0 && str.startsWith('220')) {
          step = 1;
          socket.write('HELO bethelmindanalytics.com\r\n');
        } else if (step === 1 && str.startsWith('250')) {
          step = 2;
          socket.write('MAIL FROM:<check@bethelmindanalytics.com>\r\n');
        } else if (step === 2 && str.startsWith('250')) {
          step = 3;
          socket.write(`RCPT TO:<${email}>\r\n`);
        } else if (step === 3) {
          socket.write('QUIT\r\n');
          socket.end();
          clearTimeout(timer);
          finish(str.startsWith('250') || str.startsWith('251'));
        }
      });

      socket.on('error', () => {
        clearTimeout(timer);
        finish(true); // Fallback to MX record check pass
      });

      socket.on('timeout', () => {
        socket.destroy();
        clearTimeout(timer);
        finish(true);
      });
    } catch (_) {
      clearTimeout(timer);
      finish(true);
    }
  });
}

/**
 * Verify WhatsApp account registration via local Baileys service endpoint
 */
export async function verifyWhatsAppNumber(phone: string): Promise<{
  exists: boolean;
  via: string;
}> {
  if (!phone) return { exists: false, via: 'none' };
  
  const cleanDigits = phone.replace(/\D/g, '');
  if (cleanDigits.length < 10) return { exists: false, via: 'syntax' };

  let e164 = phone;
  if (cleanDigits.startsWith('234')) e164 = `+${cleanDigits}`;
  else if (cleanDigits.startsWith('0')) e164 = `+234${cleanDigits.substring(1)}`;
  else if (cleanDigits.length === 10) e164 = `+234${cleanDigits}`;

  try {
    const res = await fetch('http://localhost:3007/check-whatsapp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: e164 }),
      signal: AbortSignal.timeout(3000)
    });

    if (res.ok) {
      const data = await res.json();
      return {
        exists: !!data.exists,
        via: data.verified_via || 'baileys'
      };
    }
  } catch (_) {
    // If Baileys microservice is offline, validate Nigerian carrier prefix syntax
  }

  const ngPrefixes = ['803', '806', '813', '816', '802', '805', '815', '807', '703', '706', '903', '906', '810', '814', '708', '812', '902', '901', '907', '904', '912', '913', '915', '916'];
  const p = e164.replace('+234', '').substring(0, 3);
  const isValidNgPrefix = ngPrefixes.includes(p) && e164.length === 14;

  return {
    exists: isValidNgPrefix,
    via: 'carrier_prefix_syntax'
  };
}
