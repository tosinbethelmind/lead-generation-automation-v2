import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

export const dynamic = 'force-dynamic';

function cleanPhone(raw: string): string {
  if (!raw) return '';
  let digits = String(raw).replace(/\D/g, '');
  if (digits.startsWith('234') && digits.length === 13) return digits;
  if (digits.startsWith('0') && digits.length === 11) return '234' + digits.slice(1);
  if (digits.length === 10) return '234' + digits;
  return digits;
}

function findLead(phoneClean: string) {
  try {
    const leadsDbPath = path.join(process.cwd(), 'local_db', 'leads_db.json');
    if (fs.existsSync(leadsDbPath)) {
      const raw = fs.readFileSync(leadsDbPath, 'utf8');
      const leads = JSON.parse(raw);
      const list = Array.isArray(leads) ? leads : (leads.leads || Object.values(leads));
      const targetTail = phoneClean.slice(-10);
      return list.find((l: any) => {
        const p = String(l.phone || l.phone_e164 || l.phone_raw || '').replace(/\D/g, '');
        return p && (p.endsWith(targetTail) || targetTail.endsWith(p.slice(-10)));
      });
    }
  } catch (err) {
    console.warn('[Termii Inbound] Lead lookup warning:', err);
  }
  return null;
}

/**
 * Dispatches automated single-credit SMS reply via Termii
 */
async function sendTermiiSms(toPhone: string, text: string) {
  const termiiApiKey = process.env.TERMII_API_KEY || 'tlv_HilsNNhBaQtzgLkf0nyq1Maie3kfr27xDYW2_d-JD6M';
  const senderId = process.env.TERMII_SENDER_ID || 'Bethelmind';
  const url = 'https://api.ng.termii.com/api/sms/send';

  try {
    const payload = {
      to: toPhone.startsWith('+') ? toPhone : `+${toPhone}`,
      from: senderId,
      sms: text.slice(0, 158),
      type: 'plain',
      channel: 'generic',
      api_key: termiiApiKey
    };
    const resp = await axios.post(url, payload, { timeout: 6000 });
    return { success: true, data: resp.data };
  } catch (err: any) {
    // Try auto-number route fallback
    try {
      const numUrl = 'https://api.ng.termii.com/api/sms/number/send';
      const numResp = await axios.post(numUrl, {
        to: toPhone.startsWith('+') ? toPhone : `+${toPhone}`,
        sms: text.slice(0, 158),
        api_key: termiiApiKey
      }, { timeout: 6000 });
      return { success: true, data: numResp.data };
    } catch (fallbackErr: any) {
      console.error('[Termii Inbound SMS Dispatch Error]:', fallbackErr.message);
      return { success: false, error: fallbackErr.message };
    }
  }
}

/**
 * Notifies Admin WhatsApp Desk (+234 802 279 1227) & triggers Closer Engine on WhatsApp
 */
async function triggerWhatsAppCloser(phoneClean: string, text: string, leadName: string, slug: string) {
  try {
    const evolutionUrl = process.env.EVOLUTION_API_URL || (process.env.NODE_ENV === 'production' ? 'http://127.0.0.1:8080' : 'http://localhost:8080');
    const apiKey = process.env.EVOLUTION_API_KEY || 'evolution_bethelmind_secret_2026';

    // Send WhatsApp DM directly to client with preview link & 2-photo hook
    const waText = 
      `Good day Boss at *${leadName}*! 👋\n\n` +
      `We received your text inquiry!\n` +
      `Your ready-made mobile website & 24/7 WhatsApp customer closer is live to test free on your phone:\n` +
      `👉 https://www.bethelmindanalytics.com/preview/${slug}\n\n` +
      `• *Option 1 (Starter Promo):* ₦35,000 deposit to launch (or ₦25,000/month pay-small-small).\n` +
      `• Send 2 photos of your shop here make we add am FREE today before you pay shishi!`;

    // Non-blocking fire-and-forget: SMS listening must NEVER be interrupted or delayed by WhatsApp
    axios.post(`${evolutionUrl}/message/sendText/bethelmind_instance_1`, {
      number: phoneClean,
      text: waText
    }, {
      headers: { apikey: apiKey },
      timeout: 3000
    }).catch((e) => {
      console.warn('[Termii WhatsApp Bridge Warning (Client)]: ', e.message);
    });

    // Alert Admin Closer Hotline (0802 279 1227) concurrently
    axios.post(`${evolutionUrl}/message/sendText/bethelmind_instance_1`, {
      number: '2348022791227',
      text: `🚨 *INBOUND SMS LEAD RECEIVED!*\n\n📱 *From:* +${phoneClean}\n🏢 *Business:* ${leadName}\n💬 *Message:* "${text}"\n🔗 *Preview:* https://www.bethelmindanalytics.com/preview/${slug}`
    }, {
      headers: { apikey: apiKey },
      timeout: 3000
    }).catch((e) => {
      console.warn('[Termii WhatsApp Bridge Warning (Admin)]: ', e.message);
    });
  } catch (err: any) {
    console.warn('[Termii WhatsApp Bridge Warning]:', err.message);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    // Termii / Carrier SMS Webhook Payload Normalization
    const rawSender = body.from || body.sender || body.phone || body.msisdn || body.number || '';
    const incomingText = String(body.sms || body.message || body.text || body.msg || '').trim();

    if (!rawSender) {
      return NextResponse.json({ error: 'Missing sender phone number' }, { status: 400 });
    }

    const phoneClean = cleanPhone(rawSender);
    console.log(`\n📩 [TERMII INBOUND SMS]: +${phoneClean} -> "${incomingText}"`);

    // Look up lead context from database
    const lead = findLead(phoneClean);
    const rawName = (lead?.name || lead?.business_name || 'Business').split('||')[0].split('|')[0].trim();
    const cleanName = rawName.length > 14 ? rawName.slice(0, 12).trim() : rawName;
    const slug = (lead?.lead_id || cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-')).replace(/^-|-$/g, '') || 'demo';
    const previewUrl = `https://www.bethelmindanalytics.com/preview/${slug}`;

    // Craft high-converting 1-credit reply (<= 158 chars)
    let replySms = '';
    const lower = incomingText.toLowerCase();

    if (/price|cost|how much|fee|charges/i.test(lower)) {
      replySms = `Hello ${cleanName}! Preview is ₦0. Setup promo is ₦35k deposit today (balance only after site is live). Check free on phone: ${previewUrl}`;
    } else if (/who|scam|legit|where/i.test(lower)) {
      replySms = `Hello ${cleanName}! Bethelmind Digital Solutions (CAC Certified). We built your free sample website to test on phone: ${previewUrl} / 08022791227`;
    } else if (/yes|interested|demo|ok|okay|send/i.test(lower)) {
      replySms = `Awesome ${cleanName}! Check your sample website free on your phone: ${previewUrl} (Send 2 photos on WhatsApp to add free: 08022791227)`;
    } else {
      replySms = `Hello ${cleanName}! We built your shop's free website so customers on Google find you. Check on phone: ${previewUrl} or WhatsApp 08022791227`;
    }

    if (replySms.length > 158) {
      replySms = replySms.slice(0, 158);
    }

    // 1. Dispatch SMS reply back to prospect
    const smsResult = await sendTermiiSms(phoneClean, replySms);

    // 2. Trigger WhatsApp Closer Sequence simultaneously (Dual-Channel conversion)
    triggerWhatsAppCloser(phoneClean, incomingText, rawName, slug).catch(() => {});

    return NextResponse.json({
      success: true,
      repliedTo: phoneClean,
      smsSent: smsResult.success,
      replyText: replySms
    });
  } catch (err: any) {
    console.error('[Termii Webhook Error]:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    service: 'Bethelmind Termii Inbound SMS Auto-Responder',
    status: 'online',
    timestamp: new Date().toISOString()
  });
}
