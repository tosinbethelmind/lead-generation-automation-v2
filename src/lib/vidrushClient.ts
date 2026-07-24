/**
 * Helper client to trigger VidRush AI Content & Video Manufacturing Engine
 * when a new lead is ingested via Facebook Webhooks or Outreach Arm in ApexReach
 */

export interface LeadPayload {
  id: string;
  type: 'homeowner' | 'enterprise';
  forceRender?: boolean;
}

export async function triggerVidrushContentGeneration(payload: LeadPayload): Promise<{ success: boolean; jobId?: string; error?: string }> {
  try {
    const vidrushUrl = process.env.VIDRUSH_API_URL || 'https://vidrush-video-automation.vercel.app';
    const adminSecret = process.env.ADMIN_SECRET || '';

    const endpoint = `${vidrushUrl.replace(/\/$/, '')}/api/solar-leads`;

    console.log(`[Outreach Arm -> VidRush] Dispatching lead ${payload.id} (${payload.type}) to ${endpoint}...`);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-secret': adminSecret,
      },
      body: JSON.stringify({
        leadId: payload.id,
        leadType: payload.type,
        forceRender: payload.forceRender ?? true,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn(`[Outreach Arm -> VidRush] Warning: VidRush dispatch returned HTTP ${response.status}: ${errText}`);
      return { success: false, error: errText };
    }

    const data = await response.json();
    console.log(`[Outreach Arm -> VidRush] Success! Job ID: ${data.jobId || 'N/A'}`);
    return { success: true, jobId: data.jobId };
  } catch (err: any) {
    console.error('[Outreach Arm -> VidRush] Dispatch failed:', err?.message || err);
    return { success: false, error: err?.message || 'Network error' };
  }
}
