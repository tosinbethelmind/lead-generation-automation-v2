import { sendNotificationEmail } from '@/lib/email';
import { getActiveLeadRepository, addLog } from '@/lib/googleSheets';
import { getLocalConfig } from '@/lib/localConfig';
import { findBundledLead, sanitizeDisplayName } from '@/lib/leadsBundle';


export interface ProvisionPayload {
  leadId: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  customDomain?: string;
  selectedStrategy: string;
  selectedFeatures: string[];
  claimFeeNGN: number;
  paymentMethod: string;
  paymentReference?: string;
}

export interface ProvisionResult {
  success: boolean;
  liveUrl: string;
  subdomainUrl: string;
  handoverPortalUrl: string;
  deploymentId?: string;
  customDomainBindingStatus: 'BOUND' | 'PENDING_DNS' | 'NOT_REQUESTED';
  dnsInstructions?: {
    type: string;
    host: string;
    target: string;
  }[];
  message: string;
}

/**
 * Cloudflare API helper to register custom domain CNAME record
 */
export async function bindCustomDomainToCloudflare(domainName: string): Promise<boolean> {
  const config = getLocalConfig();
  const token = config.cloudflareToken || process.env.CLOUDFLARE_TOKEN;
  const zoneId = config.cloudflareZoneId || process.env.CLOUDFLARE_ZONE_ID;

  if (!token || !zoneId) {
    console.log('[Cloudflare AutoBind] Skipped: Cloudflare token or zoneId missing.');
    return false;
  }

  try {
    const cleanDomain = domainName.replace(/^https?:\/\//, '').replace(/\/.*$/, '').trim();
    const resp = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'CNAME',
        name: cleanDomain,
        content: 'bethelmindanalytics.com',
        ttl: 1, // Automatic TTL
        proxied: true
      })
    });
    if (resp.ok) {
      console.log(`[Cloudflare AutoBind] ✅ CNAME created for ${cleanDomain} -> bethelmindanalytics.com`);
      return true;
    }
  } catch (err: any) {
    console.warn('[Cloudflare AutoBind] Error:', err.message);
  }
  return false;
}

/**
 * Zero-Touch Client Website Provisioning Engine.
 * Called upon Paystack / Moniepoint payment verification to trigger instant automated deployment,
 * bind custom sub-domains, Cloudflare Pages hosting, and send automated onboarding credentials.
 */
export async function autoProvisionClientSite(payload: ProvisionPayload): Promise<ProvisionResult> {
  const { leadId, clientName, clientEmail, clientPhone, customDomain, selectedStrategy, selectedFeatures, claimFeeNGN, paymentMethod, paymentReference } = payload;

  console.log(`[AutoProvision] Initiating zero-touch deployment for lead ${leadId} (${clientName}). Payment: ₦${claimFeeNGN.toLocaleString()} via ${paymentMethod}`);

  let lead: any = findBundledLead(leadId);
  if (!lead) {
    try {
      const repo = getActiveLeadRepository();
      lead = await repo.getLeadById(leadId);
    } catch (_) {}
  }

  if (!lead) {
    const safeName = sanitizeDisplayName(leadId, 'Professional Services');
    lead = {
      lead_id: leadId,
      source: 'GOOGLE',
      name: safeName,
      category: 'Professional Services',
      address: 'Commercial Hub, Lagos',
      area: 'Lekki Phase 1',
      city: 'Lagos',
      phone_e164: '+2348022791227',
      phone_raw: '0802 279 1227',
      email: clientEmail,

      website: '',
      rating: 4.9,
      reviews_count: 38,
      verified: true,
      listings_count: 1,
      profile_url: '',
      source_query_or_seed: 'demo',
      collected_at: new Date().toISOString(),
      status: 'NEW',
      last_contacted_at: '',
      duplicate_of_lead_id: '',
      business_summary: 'Verified Local Business Enterprise',
      notes: '[PREVIEW_DEMO] Synthetic lead created during interactive claim preview.'
    };
  }

  const activeLead = lead!;

  const vercelToken = process.env.VERCEL_AUTH_TOKEN || process.env.VERCEL_TOKEN;
  const projectId = process.env.VERCEL_PROJECT_ID;
  const appOrigin = process.env.NEXT_PUBLIC_APP_URL || 'https://www.bethelmindanalytics.com';
  const sanitizedName = activeLead.name ? activeLead.name.toLowerCase().replace(/[^a-z0-9]/g, '') : 'client';
  const instantHostedUrl = `${appOrigin}/sites/${leadId}`;
  const subdomainUrl = instantHostedUrl;
  const handoverPortalUrl = `${appOrigin}/handover/${leadId}`;

  let liveUrl = instantHostedUrl;
  let deploymentId: string | undefined;
  let customDomainBindingStatus: 'BOUND' | 'PENDING_DNS' | 'NOT_REQUESTED' = 'NOT_REQUESTED';

  // 1. If client provided custom domain, bind via Cloudflare API
  if (customDomain && customDomain.trim()) {
    const bound = await bindCustomDomainToCloudflare(customDomain);
    customDomainBindingStatus = bound ? 'BOUND' : 'PENDING_DNS';
    if (bound) {
      liveUrl = customDomain.startsWith('http') ? customDomain : `https://${customDomain.trim()}`;
    }
  }

  // 2. Attempt Vercel API Instant Production Deployment if token exists
  if (vercelToken && projectId) {
    try {
      const deployResp = await fetch(`https://api.vercel.com/v13/deployments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${vercelToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: `site-${sanitizedName}`,
          project: projectId,
          target: 'production',
          gitSource: {
            type: 'github',
            repo: 'tosinbethelmind/lead-generation-automation-v2',
            ref: 'main'
          },
          meta: {
            leadId,
            clientName,
            clientEmail,
            strategy: selectedStrategy
          }
        })
      });

      if (deployResp.ok) {
        const deployData = await deployResp.json();
        deploymentId = deployData.id;
        console.log(`[AutoProvision] ✅ Vercel deployment triggered: ${deployData.url}`);
      }
    } catch (err: any) {
      console.warn('[AutoProvision] Vercel deploy API notice:', err.message);
    }
  }

  // Always guarantee an immediately working live URL on our /sites/[leadId] route
  if (!liveUrl) {
    liveUrl = instantHostedUrl;
  }

  const dnsInstructions = [
    { type: 'A', host: '@', target: '76.76.21.21' },
    { type: 'CNAME', host: 'www', target: 'cname.vercel-dns.com' },
  ];

  // 3. Mark lead status as CONTACTED / CLAIMED with Payment Ref in DB
  const timestamp = new Date().toISOString();
  const notesUpdate = `${activeLead.notes || ''}\n[PROVISIONED_SUCCESS] Deployed to ${liveUrl} (Target Domain: ${customDomain || 'Pending'}) on ${timestamp}. Ref: ${paymentReference || 'N/A'}. Features: ${selectedFeatures.join(', ')}`;
  
  if (!activeLead.notes?.includes('[PREVIEW_DEMO]')) {
    try {
      const repo = getActiveLeadRepository();
      await repo.updateLeadStatus(leadId, 'CONTACTED', notesUpdate, timestamp);
    } catch (_) {}
  }

  try {
    await addLog(
      'AutoProvision Engine',
      'SUCCESS',
      `Website auto-provisioned for ${clientName} (${activeLead.name}) -> ${liveUrl}`
    );
  } catch (_) {}

  // 4. Dispatch automated Email Welcome Credentials
  try {
    const emailSubject = `🎉 Your Official Website is Ready! Access & Handover Portal for ${activeLead.name}`;
    const emailBody = `Hello ${clientName},\n\n` +
      `Congratulations! Your official mobile website for ${activeLead.name} is now live and hosted at:\n` +
      `${instantHostedUrl}\n\n` +
      `🔑 Your Client Handover & Customization Portal:\n${handoverPortalUrl}\n\n` +
      `🌐 Custom Domain Setup (${customDomain || 'Included in Your Package'}):\n` +
      `Our engineering team is registering/connecting your custom domain (${customDomain || '.com.ng / .com'}) to your live storefront automatically. If you already own the domain, simply add these 2 DNS records:\n` +
      `- A Record (@) -> 76.76.21.21\n` +
      `- CNAME Record (www) -> cname.vercel-dns.com\n\n` +
      `Selected Package: ${selectedStrategy}\n` +
      `Deposit / Payment Ref: ${paymentReference || 'N/A'}\n\n` +
      `Send your 3–5 shop/product photos on WhatsApp (+234 802 279 1227) anytime so we can update your gallery immediately.\n\n` +
      `Best regards,\n` +
      `Bethelmind Digital Solutions (CAC Certified Nigerian Enterprise)`;
    
    await sendNotificationEmail(clientEmail, emailSubject, emailBody);
  } catch (e: any) {
    console.warn('[AutoProvision] Notification email warn:', e.message);
  }

  return {
    success: true,
    liveUrl,
    subdomainUrl,
    handoverPortalUrl,
    deploymentId,
    customDomainBindingStatus,
    dnsInstructions,
    message: `Website successfully provisioned and live at ${subdomainUrl}`
  };
}
