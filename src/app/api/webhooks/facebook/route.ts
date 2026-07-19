import { NextRequest, NextResponse } from 'next/server';
import { getRuntimeConfig } from '@/lib/localConfig';
import { solarQuoteProSupabase } from '@/lib/solarQuoteProClient';
import { addLog } from '@/lib/googleSheets';
import { createHmac } from 'crypto';
import { setWorkerIndex } from '@/lib/requestContext';

export const dynamic = 'force-dynamic';

// GET: Webhook verification by Meta
export async function GET(req: NextRequest) {
  const workerIndex = req.headers.get('x-test-worker-index') || '';
  return setWorkerIndex(workerIndex, () => {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    const config = getRuntimeConfig();
    const VERIFY_TOKEN = process.env.META_WEBHOOK_VERIFY_TOKEN || config.metaWebhookVerifyToken || 'solar-quote-pro-secret-verify-token-2026';

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('[Meta Webhook] Verification successful!');
      return new Response(challenge, { status: 200 });
    }

    console.error('[Meta Webhook] Verification failed. Tokens do not match.');
    return NextResponse.json({ error: 'Verification failed' }, { status: 403 });
  });
}

// POST: Receive lead notifications from Meta
export async function POST(req: NextRequest) {
  const workerIndex = req.headers.get('x-test-worker-index') || '';
  return setWorkerIndex(workerIndex, async () => {
    try {
      const rawBody = await req.text();
      
      const config = getRuntimeConfig();
      // Perform x-hub-signature-256 HMAC verification if META_APP_SECRET is set
      const appSecret = process.env.META_APP_SECRET || config.metaAppSecret;
      const signatureHeader = req.headers.get('x-hub-signature-256');

      if (appSecret) {
        if (!signatureHeader) {
          console.error('[Meta Webhook] Signature verification failed: Missing x-hub-signature-256 header.');
          return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
        }

        const [algo, signatureHash] = signatureHeader.split('=');
        if (algo !== 'sha256' || !signatureHash) {
          console.error('[Meta Webhook] Signature verification failed: Invalid algorithm.');
          return NextResponse.json({ error: 'Invalid signature algorithm' }, { status: 401 });
        }

        const expectedHash = createHmac('sha256', appSecret).update(rawBody).digest('hex');
        if (signatureHash !== expectedHash) {
          console.error('[Meta Webhook] Signature verification failed: Hashes do not match.');
          return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }
        console.log('[Meta Webhook] Signature verified successfully.');
      } else {
        console.warn('[Meta Webhook] META_APP_SECRET is not configured. Signature validation bypassed.');
      }

      const body = JSON.parse(rawBody);
      console.log('[Meta Webhook] Received webhook payload:', JSON.stringify(body));

      if (body.object !== 'page') {
        return NextResponse.json({ success: true, message: 'Ignored non-page object' });
      }

      const accessToken = config.whatsappAccessToken || process.env.WHATSAPP_ACCESS_TOKEN;

      if (!accessToken) {
        console.error('[Meta Webhook] Missing WhatsApp/Meta Access Token in configuration.');
        return NextResponse.json({ error: 'Meta Access Token not configured' }, { status: 500 });
      }

      const entries = body.entry || [];
      for (const entry of entries) {
        const changes = entry.changes || [];
        for (const change of changes) {
          if (change.field === 'leadgen') {
            const leadgenId = change.value?.leadgen_id;
            if (!leadgenId) continue;

            console.log(`[Meta Webhook] Fetching details for Leadgen ID: ${leadgenId}`);

            // Fetch lead details from Meta Graph API
            const graphUrl = `https://graph.facebook.com/v22.0/${leadgenId}?access_token=${accessToken}`;
            const graphRes = await fetch(graphUrl);
            
            if (!graphRes.ok) {
              const errorText = await graphRes.text();
              console.error(`[Meta Webhook] Graph API error fetching lead ${leadgenId}:`, errorText);
              continue;
            }

            const leadData = await graphRes.json();
            console.log('[Meta Webhook] Retrieved lead details:', JSON.stringify(leadData));

            // Parse fields
            let fullName = 'Anonymous Meta Lead';
            let phone = '';
            let email = '';
            let estimatedSystemSize = '';
            let monthlySpend = '';

            const fieldData = leadData.field_data || [];
            for (const field of fieldData) {
              const name = field.name;
              const value = field.values?.[0] || '';
              if (name === 'full_name' || name === 'name') {
                fullName = value;
              } else if (name === 'phone_number' || name === 'phone') {
                phone = value;
              } else if (name === 'email') {
                email = value;
              } else if (name === 'estimated_system_size' || name === 'system_size') {
                estimatedSystemSize = value;
              } else if (name === 'monthly_spend' || name === 'spend') {
                monthlySpend = value;
              }
            }

            // Format notes including NDPA-compliant consent audit trail
            const consentIp = req.headers.get('x-forwarded-for') || '127.0.0.1';
            const privacyVersion = 'v1.0';
            const consentTimestamp = new Date().toISOString();
            const notes = `[Meta Lead Ads] Acquired via Ad ID: ${change.value?.ad_id || 'N/A'}. Form ID: ${change.value?.form_id || 'N/A'}.${monthlySpend ? ` Monthly Spend: ${monthlySpend}.` : ''}\n[Consent Audit Trail] IP: ${consentIp}. Privacy Policy: ${privacyVersion}. Timestamp: ${consentTimestamp}`;

            console.log(`[Meta Webhook] Saving homeowner lead to Supabase: ${fullName} (${phone})`);

            // Insert homeowner lead into SolarQuotePro homeowner_leads table
            const { data, error } = await solarQuoteProSupabase
              .from('homeowner_leads')
              .insert([
                {
                  name: fullName,
                  phone: phone,
                  email: email,
                  estimated_system_size: estimatedSystemSize || 'Unknown',
                  status: 'new',
                  notes: notes,
                  created_at: new Date().toISOString()
                }
              ])
              .select();

            if (error) {
              console.error('[Meta Webhook] Database insert failed:', error);
              await addLog('Meta Webhook', 'FAILURE', `Failed to insert lead ${fullName}: ${error.message}`);
            } else {
              console.log('[Meta Webhook] Successfully inserted lead:', data);
              await addLog('Meta Webhook', 'SUCCESS', `Ingested lead ${fullName} (${phone}) via Facebook Ad Webhook`);
            }
          }
        }
      }

      return NextResponse.json({ success: true });
    } catch (err: any) {
      console.error('[Meta Webhook] Server error handling payload:', err);
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  });
}
