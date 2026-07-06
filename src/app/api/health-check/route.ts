import { NextRequest, NextResponse } from 'next/server';
import { getRuntimeConfig, saveLocalConfig } from '@/lib/localConfig';
import net from 'net';

function parseProxyString(proxyStr: string) {
  try {
    let clean = proxyStr.trim();
    if (!clean) return null;
    if (!clean.includes('://')) {
      clean = 'http://' + clean;
    }
    const parsed = new URL(clean);
    return {
      protocol: parsed.protocol,
      host: parsed.hostname,
      port: parsed.port ? parseInt(parsed.port, 10) : (parsed.protocol === 'https:' ? 443 : 80),
      username: parsed.username ? decodeURIComponent(parsed.username) : undefined,
      password: parsed.password ? decodeURIComponent(parsed.password) : undefined,
      original: proxyStr
    };
  } catch (err) {
    return null;
  }
}

function testProxyConnection(proxy: any, timeoutMs = 3000): Promise<{ online: boolean; latency: number; error?: string }> {
  return new Promise((resolve) => {
    if (!proxy) {
      return resolve({ online: false, latency: 0, error: 'Invalid proxy format' });
    }
    const start = Date.now();
    const socket = net.createConnection({
      host: proxy.host,
      port: proxy.port
    });
    
    socket.setTimeout(timeoutMs);
    
    socket.on('connect', () => {
      if (proxy.protocol.startsWith('http')) {
        const connectReq = `CONNECT api.ipify.org:443 HTTP/1.1\r\nHost: api.ipify.org:443\r\n\r\n`;
        socket.write(connectReq);
        socket.once('data', (data) => {
          const resp = data.toString();
          if (resp.includes('200') || resp.includes('Established') || resp.includes('established')) {
            const latency = Date.now() - start;
            socket.destroy();
            resolve({ online: true, latency });
          } else {
            socket.destroy();
            resolve({ online: false, latency: Date.now() - start, error: 'Proxy refused handshake' });
          }
        });
      } else {
        const latency = Date.now() - start;
        socket.destroy();
        resolve({ online: true, latency });
      }
    });
    
    socket.on('timeout', () => {
      socket.destroy();
      resolve({ online: false, latency: Date.now() - start, error: 'Timeout' });
    });
    
    socket.on('error', (err) => {
      socket.destroy();
      resolve({ online: false, latency: Date.now() - start, error: err.message });
    });
  });
}

export async function GET(req: NextRequest) {
  try {
    const config = getRuntimeConfig();
    const health: Record<string, any> = {};
    const timestamp = new Date().toISOString();

    // ── 1. WhatsApp Health Check ──
    const waProvider = config.whatsappProvider || 'cloud';
    if (waProvider === 'cloud') {
      if (!config.whatsappAccessToken || !config.whatsappPhoneNumberId) {
        health.whatsapp = { status: 'unconfigured', connected: false, message: 'Missing Token or Phone Number ID', details: 'Missing Token or Phone Number ID', updatedAt: timestamp };
      } else {
        try {
          const resp = await fetch(`https://graph.facebook.com/v16.0/${config.whatsappPhoneNumberId}`, {
            headers: { Authorization: `Bearer ${config.whatsappAccessToken}` }
          });
          if (resp.ok) {
            health.whatsapp = { status: 'healthy', connected: true, message: 'Meta Cloud API connected successfully', details: 'Meta Cloud API connected successfully', updatedAt: timestamp };
          } else {
            const data = await resp.json().catch(() => ({}));
            const errMsg = data.error?.message || `Meta Cloud API returned status ${resp.status}`;
            health.whatsapp = { status: 'unhealthy', connected: false, message: errMsg, details: errMsg, updatedAt: timestamp };
          }
        } catch (err: any) {
          health.whatsapp = { status: 'unhealthy', connected: false, message: err.message, details: err.message, updatedAt: timestamp };
        }
      }
    } else if (waProvider === 'evolution') {
      if (!config.evolutionApiUrl || !config.evolutionInstanceName) {
        health.whatsapp = { status: 'unconfigured', connected: false, message: 'Missing Evolution API URL or Instance Name', details: 'Missing Evolution API URL or Instance Name', updatedAt: timestamp };
      } else {
        try {
          const baseUrl = config.evolutionApiUrl.replace(/\/+$/, '');
          const resp = await fetch(`${baseUrl}/instance/connectionState/${config.evolutionInstanceName}`, {
            headers: { apikey: config.evolutionApiKey || '' }
          });
          if (resp.ok) {
            const data = await resp.json().catch(() => ({}));
            const isConnected = data.instance?.state === 'open' || data.status === 'open' || resp.status === 200;
            health.whatsapp = { 
              status: isConnected ? 'healthy' : 'unhealthy', 
              connected: isConnected,
              message: isConnected ? 'Evolution QR Session active' : 'Evolution session closed/offline', 
              details: isConnected ? 'Evolution QR Session active' : 'Evolution session closed/offline', 
              updatedAt: timestamp 
            };
          } else {
            health.whatsapp = { status: 'unhealthy', connected: false, message: `Evolution API returned status ${resp.status}`, details: `Evolution API returned status ${resp.status}`, updatedAt: timestamp };
          }
        } catch (err: any) {
          health.whatsapp = { status: 'unhealthy', connected: false, message: err.message, details: err.message, updatedAt: timestamp };
        }
      }
    } else if (waProvider === 'whapi') {
      if (!config.whapiToken) {
        health.whatsapp = { status: 'unconfigured', connected: false, message: 'Missing Whapi Token', details: 'Missing Whapi Token', updatedAt: timestamp };
      } else {
        try {
          const resp = await fetch('https://gate.whapi.cloud/users', {
            headers: { Authorization: `Bearer ${config.whapiToken}` }
          });
          if (resp.ok) {
            health.whatsapp = { status: 'healthy', connected: true, message: 'Whapi.cloud connected successfully', details: 'Whapi.cloud connected successfully', updatedAt: timestamp };
          } else {
            health.whatsapp = { status: 'unhealthy', connected: false, message: `Whapi returned status ${resp.status}`, details: `Whapi returned status ${resp.status}`, updatedAt: timestamp };
          }
        } catch (err: any) {
          health.whatsapp = { status: 'unhealthy', connected: false, message: err.message, details: err.message, updatedAt: timestamp };
        }
      }
    } else if (waProvider === 'baileys') {
      const url = config.whatsappBaileysUrl || 'http://localhost:3007';
      try {
        const resp = await fetch(url).catch(() => null);
        if (resp && resp.ok) {
          health.whatsapp = { status: 'healthy', connected: true, message: 'Local Baileys service is online', details: 'Local Baileys service is online', updatedAt: timestamp };
        } else {
          health.whatsapp = { status: 'unhealthy', connected: false, message: 'Local Baileys service offline', details: 'Local Baileys service offline', updatedAt: timestamp };
        }
      } catch (err: any) {
        health.whatsapp = { status: 'unhealthy', connected: false, message: err.message, details: err.message, updatedAt: timestamp };
      }
    }

    // ── 2. SMS Health Check ──
    const smsProvider = config.smsProvider || 'gateway';
    if (smsProvider === 'twilio') {
      if (!config.twilioAccountSid || !config.twilioAuthToken) {
        health.sms = { status: 'unconfigured', message: 'Missing Twilio Sid or Token', details: 'Missing Twilio Sid or Token', updatedAt: timestamp };
      } else {
        try {
          const creds = Buffer.from(`${config.twilioAccountSid}:${config.twilioAuthToken}`).toString('base64');
          const resp = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${config.twilioAccountSid}.json`, {
            headers: { Authorization: `Basic ${creds}` }
          });
          if (resp.ok) {
            health.sms = { status: 'ready', message: 'Twilio account credentials verified', details: 'Twilio account credentials verified', updatedAt: timestamp };
          } else {
            health.sms = { status: 'unhealthy', message: `Twilio returned status ${resp.status}`, details: `Twilio returned status ${resp.status}`, updatedAt: timestamp };
          }
        } catch (err: any) {
          health.sms = { status: 'unhealthy', message: err.message, details: err.message, updatedAt: timestamp };
        }
      }
    } else if (smsProvider === 'termii') {
      if (!config.termiiApiKey) {
        health.sms = { status: 'unconfigured', message: 'Missing Termii API Key', details: 'Missing Termii API Key', updatedAt: timestamp };
      } else {
        try {
          const resp = await fetch(`https://api.ng.termii.com/api/balance?api_key=${config.termiiApiKey}`);
          if (resp.ok) {
            health.sms = { status: 'ready', message: 'Termii API active and verified', details: 'Termii API active and verified', updatedAt: timestamp };
          } else {
            health.sms = { status: 'unhealthy', message: `Termii returned status ${resp.status}`, details: `Termii returned status ${resp.status}`, updatedAt: timestamp };
          }
        } catch (err: any) {
          health.sms = { status: 'unhealthy', message: err.message, details: err.message, updatedAt: timestamp };
        }
      }
    } else if (smsProvider === 'africastalking') {
      if (!config.africastalkingUsername || !config.africastalkingApiKey) {
        health.sms = { status: 'unconfigured', message: "Missing Africa's Talking username or API key", details: "Missing Africa's Talking username or API key", updatedAt: timestamp };
      } else {
        try {
          const resp = await fetch(`https://api.africastalking.com/version1/user?username=${config.africastalkingUsername}`, {
            headers: { apiKey: config.africastalkingApiKey, Accept: 'application/json' }
          });
          if (resp.ok) {
            health.sms = { status: 'ready', message: "Africa's Talking credentials verified", details: "Africa's Talking credentials verified", updatedAt: timestamp };
          } else {
            health.sms = { status: 'unhealthy', message: `Africa's Talking returned status ${resp.status}`, details: `Africa's Talking returned status ${resp.status}`, updatedAt: timestamp };
          }
        } catch (err: any) {
          health.sms = { status: 'unhealthy', message: err.message, details: err.message, updatedAt: timestamp };
        }
      }
    } else {
      if (!config.smsGatewayUrl) {
        health.sms = { status: 'unconfigured', message: 'Custom HTTP Gateway URL not configured', details: 'Custom HTTP Gateway URL not configured', updatedAt: timestamp };
      } else {
        health.sms = { status: 'ready', message: 'Generic HTTP Gateway URL configured', details: 'Generic HTTP Gateway URL configured', updatedAt: timestamp };
      }
    }

    // ── 3. Email Health Check ──
    const emailProvider = config.emailProvider || 'gmail';
    if (emailProvider === 'gmail') {
      if (!config.googleRefreshToken || !config.googleClientId) {
        health.email = { status: 'unconfigured', message: 'Google OAuth not fully authenticated', details: 'Google OAuth not fully authenticated', updatedAt: timestamp };
      } else {
        health.email = { status: 'ready', message: 'Google OAuth credentials set', details: 'Google OAuth credentials set', updatedAt: timestamp };
      }
    } else if (emailProvider === 'resend') {
      if (!config.resendApiKey) {
        health.email = { status: 'unconfigured', message: 'Missing Resend API Key', details: 'Missing Resend API Key', updatedAt: timestamp };
      } else {
        try {
          const resp = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: { Authorization: `Bearer ${config.resendApiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ from: 'test@resend.dev', to: 'test@resend.dev', subject: 'Ping', text: 'Ping' })
          });
          if (resp.status === 401 || resp.status === 403) {
            health.email = { status: 'unhealthy', message: 'Resend API Key unauthorized/invalid', details: 'Resend API Key unauthorized/invalid', updatedAt: timestamp };
          } else {
            health.email = { status: 'ready', message: 'Resend API connection authenticated', details: 'Resend API connection authenticated', updatedAt: timestamp };
          }
        } catch (err: any) {
          health.email = { status: 'unhealthy', message: err.message, details: err.message, updatedAt: timestamp };
        }
      }
    } else if (emailProvider === 'brevo') {
      if (!config.brevoApiKey) {
        health.email = { status: 'unconfigured', message: 'Missing Brevo API Key', details: 'Missing Brevo API Key', updatedAt: timestamp };
      } else {
        try {
          const resp = await fetch('https://api.brevo.com/v3/account', {
            headers: { 'api-key': config.brevoApiKey }
          });
          if (resp.ok) {
            health.email = { status: 'ready', message: 'Brevo API active and verified', details: 'Brevo API active and verified', updatedAt: timestamp };
          } else {
            health.email = { status: 'unhealthy', message: `Brevo returned status ${resp.status}`, details: `Brevo returned status ${resp.status}`, updatedAt: timestamp };
          }
        } catch (err: any) {
          health.email = { status: 'unhealthy', message: err.message, details: err.message, updatedAt: timestamp };
        }
      }
    } else if (emailProvider === 'sendgrid') {
      if (!config.sendgridApiKey) {
        health.email = { status: 'unconfigured', message: 'Missing SendGrid API Key', details: 'Missing SendGrid API Key', updatedAt: timestamp };
      } else {
        health.email = { status: 'ready', message: 'SendGrid Key configured', details: 'SendGrid Key configured', updatedAt: timestamp };
      }
    } else if (emailProvider === 'smtp') {
      if (!config.smtpHost || !config.smtpUser) {
        health.email = { status: 'unconfigured', message: 'SMTP settings incomplete', details: 'SMTP settings incomplete', updatedAt: timestamp };
      } else {
        health.email = { status: 'ready', message: 'SMTP server configuration saved', details: 'SMTP server configuration saved', updatedAt: timestamp };
      }
    }

    // ── 4. Scraper / Proxy Health Check ──
    let publicIp = 'Unknown';
    try {
      const ipResp = await fetch('https://api.ipify.org?format=json', { signal: AbortSignal.timeout(3000) }).catch(() => null);
      if (ipResp && ipResp.ok) {
        const ipData = await ipResp.json().catch(() => ({}));
        publicIp = ipData.ip || 'Unknown';
      }
    } catch (e) {}

    const proxyList: string[] = [];
    if (config.proxyPool) {
      const parts = config.proxyPool.split(',').map((p: string) => p.trim()).filter(Boolean);
      proxyList.push(...parts);
    }
    if (config.scraperProxy && !proxyList.includes(config.scraperProxy.trim())) {
      proxyList.push(config.scraperProxy.trim());
    }

    const testedProxies: any[] = [];
    let onlineCount = 0;
    
    if (proxyList.length > 0) {
      // Test all proxies in parallel
      const tests = proxyList.map(async (proxyStr) => {
        const parsed = parseProxyString(proxyStr);
        if (!parsed) {
          return { url: proxyStr, status: 'offline', error: 'Invalid proxy format', latency: 0 };
        }
        const result = await testProxyConnection(parsed, 4000);
        return {
          url: proxyStr,
          status: result.online ? 'online' : 'offline',
          error: result.error || '',
          latency: result.latency
        };
      });

      const results = await Promise.all(tests);
      results.forEach((r) => {
        testedProxies.push(r);
        if (r.status === 'online') {
          onlineCount++;
        }
      });
    }

    let scraperStatus: 'ok' | 'warning' | 'unhealthy' = 'ok';
    let scraperDetails = 'No proxies configured';

    if (proxyList.length > 0) {
      if (onlineCount === proxyList.length) {
        scraperStatus = 'ok';
        scraperDetails = `All ${proxyList.length} proxies online`;
      } else if (onlineCount > 0) {
        scraperStatus = 'warning';
        scraperDetails = `${onlineCount}/${proxyList.length} proxies online`;
      } else {
        scraperStatus = 'unhealthy';
        scraperDetails = `All ${proxyList.length} proxies offline!`;
      }
    } else {
      scraperDetails = 'Direct connection active (no proxies)';
    }

    health.scraper = {
      status: scraperStatus,
      ip: publicIp,
      details: scraperDetails,
      proxies: testedProxies,
      updatedAt: timestamp
    };

    // Save to configuration store
    saveLocalConfig({
      serviceHealthStatus: JSON.stringify(health)
    });

    return NextResponse.json({ success: true, health });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  return GET(req);
}

