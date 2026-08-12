import { NextRequest, NextResponse } from 'next/server';
import { triggerZapierWebhook, syncToHubSpotCRM, triggerWhatsAppOutreach, dispatchAutomatedEmailDrip } from '@/lib/integrations/businessAppConnectors';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, lead, apiKey } = body;

    console.log(`[Unified Integration Webhook] Received action: "${action}"`);

    const leadData = lead || {
      id: `lead_${Date.now()}`,
      name: body.name || 'Sample Business Prospect',
      email: body.email || 'prospect@example.com',
      phone: body.phone || '+2348000000000',
      category: body.category || 'General Business',
      city: body.city || 'Lagos',
      leadScore: 92
    };

    let result;

    switch (action) {
      case 'zapier_sync':
        result = await triggerZapierWebhook(leadData, body.webhookUrl);
        break;
      case 'hubspot_sync':
        result = await syncToHubSpotCRM(leadData);
        break;
      case 'whatsapp_outreach':
        result = await triggerWhatsAppOutreach(leadData, body.customMessage);
        break;
      case 'email_drip':
        result = await dispatchAutomatedEmailDrip(leadData, body.template);
        break;
      case 'full_stack_connect':
      default:
        const [zap, hub, wa, em] = await Promise.all([
          triggerZapierWebhook(leadData),
          syncToHubSpotCRM(leadData),
          triggerWhatsAppOutreach(leadData),
          dispatchAutomatedEmailDrip(leadData)
        ]);
        result = { zapier: zap, hubspot: hub, whatsapp: wa, email: em };
        break;
    }

    return NextResponse.json({
      success: true,
      action,
      timestamp: new Date().toISOString(),
      integrationResults: result
    });
  } catch (error: any) {
    console.error('[Integration Webhook Error]:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
