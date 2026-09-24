import { NextRequest, NextResponse } from 'next/server';
import { trackLeadJourneyEvent, JourneyStage } from '@/lib/leadJourneyTracker';
import { runRetargetingDecisionAudit } from '@/lib/retargetingDecisionEngine';
import { dispatchSecureEmail } from '@/lib/monetization/smtpTransporterPool';
import { twentyCrmClient, TwentyDealStage } from '@/lib/integrations/twentyCrmClient';
import { chatwootClient } from '@/lib/integrations/chatwootClient';

export const dynamic = 'force-dynamic';

const recentViewAlerts = new Map<string, number>();

/**
 * POST /api/tracking/journey-event
 * Ingests client-side behavioral interactions in real-time.
 * 
 * STRICT INTENT QUALIFICATION:
 * - Casual calculator adjustments are tracked for analytics ONLY.
 * - Engine 2 Contractor Routing alerts fire ONLY when the prospect explicitly enters their phone number / submits a formal quote request.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      leadId,
      leadName,
      category,
      phone,
      email,
      area,
      eventType,
      metadata = {},
    } = body;

    if (!leadId) {
      return NextResponse.json({ error: 'leadId is required.' }, { status: 400 });
    }

    let stage: JourneyStage = 'PREVIEW_VIEWED';
    let title = 'Visited Preview Page';
    let description = 'Prospect opened their personalized website preview.';

    switch (eventType) {
      case 'page_view':
        stage = 'PREVIEW_VIEWED';
        title = 'Opened Website Preview';
        description = `Visited path: ${metadata.path || '/'}`;
        break;

      case 'calculator_used':
        stage = 'CALCULATOR_USED';
        title = 'Interacted with Interactive Calculator';
        description = metadata.calculationSummary || 'Adjusted capacity / cost sizing calculator';
        break;

      case 'video_watched':
        stage = 'VIDEO_WATCHED';
        title = 'Watched Video Walkthrough';
        description = `Watched ${metadata.durationSec || 30}s of interactive walkthrough video`;
        break;

      case 'chat_opened':
        stage = 'CHAT_OPENED';
        title = 'Opened Simulated WhatsApp Chat';
        description = 'Interacted with the 24/7 AI chat agent simulator';
        break;

      case 'checkout_clicked':
      case 'form_submitted':
        stage = 'CHECKOUT_CLICKED';
        title = 'Submitted Verified Quote / Booking Request';
        description = `Submitted formal quote request for ${metadata.planName || 'Facility Setup'} (${phone || 'Phone Captured'})`;
        break;

      case 'rage_click':
        stage = 'PREVIEW_VIEWED';
        title = 'High-Speed Click Cluster';
        description = `Rapidly clicked element: ${metadata.targetElement || 'UI'}`;
        break;

      default:
        stage = 'PREVIEW_VIEWED';
        title = `Action: ${eventType}`;
        description = JSON.stringify(metadata);
        break;
    }

    const event = await trackLeadJourneyEvent({
      leadId,
      leadName: leadName || `Lead ${leadId}`,
      category: category || 'General',
      phone: phone || '',
      email: email || '',
      area: area || 'Lagos',
      stage,
      title,
      description,
      channelUsed: 'Client Interactive Portal',
      metadata
    });

    // ── RESOLVED LEAD ATTRIBUTES (Accessible across alerts, CRM & Chatwoot) ──
    let resolvedName = leadName;
    let resolvedPhone = phone;
    let resolvedArea = area;
    let resolvedCategory = category;
    const previewLink = `https://www.bethelmindanalytics.com/preview/${leadId}`;

    // Lookup lead in local_db if details are missing
    if (!resolvedPhone || !resolvedName) {
      try {
        const fs = await import('fs');
        const path = await import('path');
        const leadsDbPath = path.join(process.cwd(), 'local_db/leads_db.json');
        if (fs.existsSync(leadsDbPath)) {
          const raw = JSON.parse(fs.readFileSync(leadsDbPath, 'utf8'));
          const list = Array.isArray(raw) ? raw : Object.values(raw);
          const matched = list.find((l: any) => 
            l.id === leadId || 
            l.lead_id === leadId || 
            (l.preview_url && l.preview_url.includes(leadId)) ||
            (l.name && l.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').includes(leadId.toLowerCase()))
          );
          if (matched) {
            resolvedName = resolvedName || matched.business_name || matched.name;
            resolvedPhone = resolvedPhone || matched.phone || matched.phone_e164;
            resolvedArea = resolvedArea || matched.area || matched.city;
            resolvedCategory = resolvedCategory || matched.category;
          }
        }
      } catch (_) {}
    }

    // ── REAL-TIME VISITOR & INTERACTION ALERTS TO ADMIN WHATSAPP (0802 279 1227) ──
    const now = Date.now();
    const lastAlertTime = recentViewAlerts.get(leadId) || 0;
    const isNewViewSession = eventType === 'page_view' && (now - lastAlertTime > 15 * 60 * 1000);
    const isHighIntentInteraction = eventType === 'checkout_clicked' || eventType === 'form_submitted';

    if (isNewViewSession || isHighIntentInteraction) {
      recentViewAlerts.set(leadId, now);

      const cleanTargetPhone = (resolvedPhone || '').replace(/\D/g, '');
      const directWaUrl = cleanTargetPhone ? `https://wa.me/${cleanTargetPhone}` : `https://wa.me/2348022791227`;

      const alertHeadline = isHighIntentInteraction
        ? `🔥 *PROSPECT TAPPED TO CLAIM WEBSITE / CHAT!*`
        : `👁️ *PROSPECT IS CURRENTLY VIEWING THEIR DEMO WEBSITE!*`;

      const waAlertMsg = 
        `${alertHeadline}\n` +
        `━━━━━━━━━━━━━━━━━━━━━━\n` +
        `🏢 *Business:* ${resolvedName || 'Nigerian Business'}\n` +
        `📍 *Location:* ${resolvedArea || 'Nigeria'}\n` +
        `📱 *Phone:* ${resolvedPhone ? `+${cleanTargetPhone}` : 'Looking up...'}\n` +
        `🏷️ *Sector:* ${resolvedCategory || 'Commercial SME'}\n` +
        `🔗 *Link They Are Viewing:*\n${previewLink}\n` +
        `━━━━━━━━━━━━━━━━━━━━━━\n` +
        `⚡ *Tap to Reach Out Directly:*\n` +
        (cleanTargetPhone ? `💬 Chat: ${directWaUrl}\n📞 Call: +${cleanTargetPhone}` : `🔗 Link: ${previewLink}`);

      // 1. Dispatch to Admin WhatsApp via Baileys (Port 3007)
      fetch('http://localhost:3007/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: '2348022791227',
          message: waAlertMsg
        })
      }).catch(() => {
        // Fallback to Evolution API (Port 8080)
        fetch('http://localhost:8080/message/sendText/bethelmind_instance_1', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': process.env.EVOLUTION_API_KEY || 'evolution_bethelmind_secret_2026'
          },
          body: JSON.stringify({
            number: '2348022791227',
            text: waAlertMsg
          })
        }).catch(() => {});
      });

      // 2. Dispatch to Admin Email
      dispatchSecureEmail({
        to: 'bethelmindrecruit@gmail.com',
        subject: `${isHighIntentInteraction ? '🔥 PROSPECT CLICKED CLAIM' : '👁️ PROSPECT VIEWING DEMO'}: ${resolvedName || leadId} (${resolvedPhone || resolvedArea})`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h2 style="color: #0f172a; margin-top: 0;">${isHighIntentInteraction ? '🔥 Prospect Clicked to Claim / Chat' : '👁️ Prospect is Looking at Their Sample Website'}</h2>
            <p>A business owner opened their customized website demo:</p>
            <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
              <tr><td style="padding: 6px; font-weight: bold; width: 140px;">Business:</td><td>${resolvedName || 'Valued Client'}</td></tr>
              <tr><td style="padding: 6px; font-weight: bold;">Phone:</td><td><a href="tel:${resolvedPhone}">${resolvedPhone || 'In DB'}</a></td></tr>
              <tr><td style="padding: 6px; font-weight: bold;">Location:</td><td>${resolvedArea || 'Nigeria'}</td></tr>
              <tr><td style="padding: 6px; font-weight: bold;">Sector:</td><td>${resolvedCategory || 'Commercial'}</td></tr>
              <tr><td style="padding: 6px; font-weight: bold;">Website Demo:</td><td><a href="${previewLink}">${previewLink}</a></td></tr>
            </table>
            <div style="margin-top: 20px;">
              ${cleanTargetPhone ? `<a href="${directWaUrl}" style="background-color: #10b981; color: white; padding: 10px 18px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-right: 10px;">💬 WhatsApp Customer</a>` : ''}
              <a href="${previewLink}" style="background-color: #0284c7; color: white; padding: 10px 18px; text-decoration: none; border-radius: 6px; font-weight: bold;">👉 View Their Site</a>
            </div>
          </div>
        `
      }).catch(() => {});
    }

    // Run async retargeting audit check in the background
    runRetargetingDecisionAudit().catch((err) => console.warn('[JourneyAPI] Audit error:', err.message));

    // Asynchronously advance Twenty CRM pipeline stage
    const resolveTwentyStage = (s: JourneyStage): TwentyDealStage => {
      switch (s) {
        case 'PREVIEW_VIEWED': return 'PROTOTYPE_VIEWED';
        case 'CALCULATOR_USED': return 'PROTOTYPE_VIEWED';
        case 'VIDEO_WATCHED': return 'PROTOTYPE_VIEWED';
        case 'CHAT_OPENED': return 'WHATSAPP_TESTED';
        case 'CHECKOUT_CLICKED': return 'WHATSAPP_TESTED';
        case 'INBOUND_REPLY': return 'WHATSAPP_TESTED';
        case 'PILOT_ACTIVATED': return 'DEPOSIT_WON';
        case 'DEAL_WON': return 'DEPOSIT_WON';
        default: return 'PROTOTYPE_VIEWED';
      }
    };

    twentyCrmClient.syncOpportunity({
      leadId,
      businessName: resolvedName || leadName || leadId,
      phone: resolvedPhone || phone,
      email,
      area: resolvedArea || area,
      sector: resolvedCategory || category,
      stage: resolveTwentyStage(stage),
      dealAmountNGN: 150000,
      previewUrl: previewLink
    }).catch(() => {});

    // If high intent, also synchronize as high-priority Chatwoot conversation
    if (isHighIntentInteraction) {
      chatwootClient.syncInboundLeadAction({
        businessName: resolvedName || leadName || leadId,
        phone: resolvedPhone || phone,
        email,
        area: resolvedArea || area,
        sector: resolvedCategory || category,
        messageText: `🔥 High-Intent Prospect Action: ${title} (${description})`,
        previewUrl: previewLink,
        channel: 'ai_demo_test'
      }).catch(() => {});
    }

    return NextResponse.json({ success: true, event });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

