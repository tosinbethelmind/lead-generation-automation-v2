import { NextRequest, NextResponse } from 'next/server';
import { getRuntimeConfig } from '@/lib/localConfig';

/**
 * POST /api/preview/test-alert
 *
 * Sends a real (or mock) phone/WhatsApp alert to a business owner's device
 * to demonstrate the automation system in action before they pay the claim fee.
 *
 * Supports:
 *  - Meta WhatsApp Cloud API (preferred — instant delivery, no call required)
 *  - Twilio voice call (audible automation experience)
 *  - Mock fallback (logs only, when no API keys configured)
 *
 * Body: { phone: string; businessName: string; leadId: string; channel?: 'whatsapp' | 'call' }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, businessName, leadId, channel = 'whatsapp' } = body;

    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    const config = getRuntimeConfig();

    const businessLabel = businessName || 'your business';
    const previewUrl = `${config.liveLink || 'https://lead-generation-automation-ecru.vercel.app'}/preview/${leadId || 'demo'}`;

    // ── Option A: Meta WhatsApp Cloud API ────────────────────────────────────
    if (
      channel === 'whatsapp' &&
      config.whatsappPhoneNumberId &&
      config.whatsappAccessToken
    ) {
      const waPayload = {
        messaging_product: 'whatsapp',
        to: phone.replace(/\D/g, ''),
        type: 'text',
        text: {
          body:
            `🔔 *Test Customer Alert — Bethelmind Analytics & Strategy*\n\n` +
            `Hello! A customer just submitted an inquiry on *${businessLabel}*'s new website.\n\n` +
            `📋 *Customer Name:* Sample Customer\n` +
            `📞 *Phone:* +234 800 000 0000\n` +
            `📅 *Requested Service:* Consultation Booking\n\n` +
            `This is a LIVE demonstration of your automated lead notification system.\n\n` +
            `🌐 Preview your full website here:\n${previewUrl}\n\n` +
            `Pay the one-time claim fee to activate this system permanently for *${businessLabel}*. ✅`,
        },
      };

      const waRes = await fetch(
        `https://graph.facebook.com/v21.0/${config.whatsappPhoneNumberId}/messages`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${config.whatsappAccessToken}`,
          },
          body: JSON.stringify(waPayload),
        }
      );

      const waData = await waRes.json();

      if (!waRes.ok) {
        console.error('[test-alert] WhatsApp API error:', waData);
        return NextResponse.json(
          { success: false, error: `WhatsApp delivery failed: ${waData?.error?.message || 'Unknown error'}` },
          { status: 502 }
        );
      }

      return NextResponse.json({
        success: true,
        channel: 'whatsapp',
        message: `✅ A WhatsApp alert has been sent to ${phone}. Check your phone!`,
        messageId: waData?.messages?.[0]?.id,
      });
    }

    // ── Option B: Twilio Voice Call ───────────────────────────────────────────
    if (
      channel === 'call' &&
      config.twilioAccountSid &&
      config.twilioAuthToken &&
      config.twilioFromNumber
    ) {
      const spokenMessage =
        `Hello! This is a test notification from Bethelmind Analytics & Strategy. ` +
        `A customer has just booked an appointment at ${businessLabel}. ` +
        `Their new automated website is live and working. ` +
        `Please claim your website today to activate this system permanently. ` +
        `Visit your preview link for more details.`;

      const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice" language="en-NG">${spokenMessage}</Say>
  <Pause length="1"/>
  <Say voice="alice" language="en-NG">Thank you. Goodbye!</Say>
</Response>`;

      const toNumber = phone.startsWith('+') ? phone : `+234${phone.replace(/^0/, '')}`;

      const params = new URLSearchParams({
        To: toNumber,
        From: config.twilioFromNumber!,
        Twiml: twiml,
      });

      const callRes = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${config.twilioAccountSid}/Calls.json`,
        {
          method: 'POST',
          headers: {
            Authorization:
              'Basic ' +
              Buffer.from(`${config.twilioAccountSid}:${config.twilioAuthToken}`).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: params.toString(),
        }
      );

      const callData = await callRes.json();

      if (!callRes.ok) {
        console.error('[test-alert] Twilio call error:', callData);
        return NextResponse.json(
          { success: false, error: `Call delivery failed: ${callData?.message || 'Unknown error'}` },
          { status: 502 }
        );
      }

      return NextResponse.json({
        success: true,
        channel: 'call',
        message: `📞 A live voice call is being placed to ${phone}. Answer your phone!`,
        callSid: callData?.sid,
      });
    }

    // ── Option C: Mock/Demo Fallback ─────────────────────────────────────────
    // No API keys configured — return a simulated success for demo purposes
    console.log(
      `[test-alert] MOCK ALERT fired for ${phone} on channel=${channel}. ` +
        `Configure WHATSAPP_PHONE_NUMBER_ID + WHATSAPP_ACCESS_TOKEN or TWILIO_* credentials to send real alerts.`
    );

    return NextResponse.json({
      success: true,
      channel: 'mock',
      message: `🎭 Demo simulation complete! In production with WhatsApp/Twilio credentials configured, a real ${channel === 'call' ? 'voice call' : 'WhatsApp message'} will be sent to ${phone}.`,
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('[test-alert] Error:', error.message);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
