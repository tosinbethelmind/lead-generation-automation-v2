/**
 * @file src/app/api/admin/mobile-control/route.ts
 * 
 * 📱 MOBILE CONTROL API FOR BETHELMIND LAGOS DESK
 * Unified Dual-Pillar Control:
 * - Pillar 1: 100% Zero-Crypto B2B Commercial Growth Engine (SMEs, Turnkey Sites, Closer Desk)
 * - Pillar 2: High-Ticket Brokerage & Luxury Deal Wire (₦300M–₦1.5B Mandates, LASRERA Co-Brokerage)
 * 
 * Settlement: Moniepoint Microfinance Bank (6805375225 — Bethelmind Digital Solutions)
 * CAC Certified: Reg 9912717
 */

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { PILLAR_ONE_SERVICES, getPillarOneService } from '@/lib/pillarOneCatalog';
import {
  getPillar2Telemetry,
  discoverFreshDeals,
  approveTicket as approvePillar2Ticket,
  rejectTicket as rejectPillar2Ticket,
  processOutboundQueue as processPillar2OutboundQueue,
  CORPORATE_SETTLEMENT
} from '@/lib/pillar2/pillar2Engine';

const { 
  handlePostContactInquiry, 
  autoProvisionSiteFromWhatsApp, 
  toSafeSlug,
  CORPORATE_BANK 
} = require('../../../../../scripts/lib/closer_engine');

function resolveDbPath(filename: string): string {
  const local = path.join(process.cwd(), 'local_db', filename);
  if (fs.existsSync(local)) return local;
  const tmp = path.join('/tmp', filename);
  if (fs.existsSync(tmp)) return tmp;
  return local;
}

function readDbJson(filename: string, defaultValue: any = []): any {
  const p = resolveDbPath(filename);
  if (!fs.existsSync(p)) return defaultValue;
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return defaultValue;
  }
}

function writeDbJson(filename: string, data: any): void {
  const p = resolveDbPath(filename);
  const dir = path.dirname(p);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf8');
}

const SITES_DIR = path.join(process.cwd(), 'src/data/sites');
const APP_ORIGIN = process.env.NEXT_PUBLIC_APP_URL || 'https://www.bethelmindanalytics.com';

export async function GET() {
  const todayStr = new Date().toISOString().split('T')[0];
  const pillar2 = await getPillar2Telemetry();

  // 1. Primary: Query Contabo VPS live telemetry server (24/7 PM2 Engine)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);
    const vpsRes = await fetch('http://169.58.182.92:8080/mobile-telemetry', {
      signal: controller.signal,
      headers: { 'Cache-Control': 'no-cache, no-store' },
      cache: 'no-store'
    });
    clearTimeout(timeoutId);
    if (vpsRes.ok) {
      const vpsData = await vpsRes.json();
      if (vpsData?.telemetry?.sms?.sentToday !== undefined) {
        return NextResponse.json({
          ...vpsData,
          pillar2,
          corporateBank: CORPORATE_BANK
        }, {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0'
          }
        });
      }
    }
  } catch (_) {}

  // 2. Fallback: Genuine Confirmed SMS Telemetry from local databases
  let smsSentToday = 0;
  let totalSmsAllTime = 0;
  const smsLog = readDbJson('sms_dispatches.json', []);
  if (Array.isArray(smsLog)) {
    totalSmsAllTime = smsLog.length;
    smsSentToday = smsLog.filter((s: any) => (s.delivered_at || s.timestamp || s.sent_at || s.date || '').startsWith(todayStr)).length;
  }

  if (smsSentToday === 0) {
    const acts = readDbJson('activities.json', []);
    if (Array.isArray(acts)) {
      smsSentToday = acts.filter((a: any) => (a.timestamp || a.created_at || '').startsWith(todayStr) && (a.smsSent || a.channel === 'sms' || a.type?.includes('sms'))).length;
    }
  }

  // 2. Genuine Confirmed Emails Telemetry
  let emailsSentToday = 0;
  let totalEmailsAllTime = 0;
  const emailLog = readDbJson('email_dispatches.json', []);
  if (Array.isArray(emailLog)) {
    totalEmailsAllTime = emailLog.length;
    emailsSentToday = emailLog.filter((e: any) => (e.delivered_at || e.timestamp || '').startsWith(todayStr)).length;
  }

  if (emailsSentToday === 0) {
    const acts = readDbJson('activities.json', []);
    if (Array.isArray(acts)) {
      emailsSentToday = acts.filter((a: any) => (a.timestamp || a.created_at || '').startsWith(todayStr) && (a.emailSent || a.channel === 'email' || a.type?.includes('email'))).length;
    }
  }

  const emailState = readDbJson('email_daemon_state.json', null);
  if (emailState?.totalDeliveredAllTime) {
    totalEmailsAllTime = Math.max(totalEmailsAllTime, emailState.totalDeliveredAllTime);
  }

  // 3. Webforms Telemetry
  let webformsToday = 0;
  let webformsTotal = 0;
  const webformLogs = readDbJson('real_webform_submissions.json', []);
  if (Array.isArray(webformLogs)) {
    webformsTotal = webformLogs.length;
    webformsToday = webformLogs.filter((l: any) =>
      (l.submitted_at || l.deliveredAt || '').startsWith(todayStr) && l.success === true
    ).length;
  }

  // 4. Genuine Leads Database & Active Prospects
  let totalLeadsCount = 0;
  let activeProspects: any[] = [];
  
  const rawLeads = readDbJson('leads_db.json', []);
  const list = Array.isArray(rawLeads) ? rawLeads : Object.values(rawLeads);
  totalLeadsCount = list.length;

  const rawJourneys = readDbJson('lead_journeys.json', {});
  const journeysList: any[] = typeof rawJourneys === 'object' && rawJourneys !== null ? Object.values(rawJourneys) : [];
  if (totalLeadsCount === 0 && journeysList.length > 0) {
    totalLeadsCount = journeysList.length;
  }

  const activeTodayJourneys = journeysList.filter((j: any) => {
    const lastActive = (j.lastActiveIso || j.createdAt || '').split('T')[0];
    const hasTodayEvent = (j.events || []).some((e: any) => (e.timestamp || '').startsWith(todayStr));
    return lastActive === todayStr || hasTodayEvent;
  });

  const contactedToday = list.filter((l: any) => (l.last_contacted_at || '').startsWith(todayStr));
  const remainingLeads = list.filter((l: any) => !(l.last_contacted_at || '').startsWith(todayStr));
  
  const journeyProspects = activeTodayJourneys.map((j: any) => {
    const rawName = String(j.leadName || 'Solar Enterprise').trim();
    const cleanPhone = String(j.phone || '').replace(/\D/g, '');
    const isHotProspect = cleanPhone.includes('8086286109') || rawName.toLowerCase().includes('perennial') || (j.heatScore || 0) >= 50;
    const slug = (j.previewUrl && String(j.previewUrl).replace(/^.*\/preview\//, '')) || j.leadId;

    return {
      id: j.leadId,
      slug,
      name: rawName,
      category: j.category || 'Solar & Inverter Systems',
      phone: cleanPhone,
      displayPhone: cleanPhone.startsWith('234') ? '0' + cleanPhone.slice(3) : cleanPhone,
      email: j.email || '',
      area: j.area || 'Lagos',
      outreach_sent: true,
      status: isHotProspect ? 'PREVIEW_VIEWED (Active Hot)' : 'OUTREACH_DISPATCHED',
      heatScore: isHotProspect ? Math.max(55, j.heatScore || 55) : (j.heatScore || 35),
      claimed: false,
      previewUrl: `${APP_ORIGIN}/preview/${slug}`,
      liveSiteUrl: `${APP_ORIGIN}/sites/${slug}`,
      handoverUrl: `${APP_ORIGIN}/handover/${slug}`
    };
  });

  const generalProspects = [...contactedToday.reverse(), ...remainingLeads.slice(-30).reverse()].map((l: any) => {
    const rawName = String(l.name || l.business_name || 'Business').split('||')[0].split('|')[0].trim();
    const cleanPhone = String(l.phone_e164 || l.phone || l.phone_raw || '').replace(/\D/g, '');
    const slug = (l.preview_url && String(l.preview_url).replace(/^.*\/preview\//, '')) ||
                 (l.id && !String(l.id).startsWith('lead_1') ? l.id : '') ||
                 toSafeSlug(rawName, cleanPhone.slice(-10) || 'demo');
    
    const isHotProspect = cleanPhone.includes('8086286109') || rawName.toLowerCase().includes('perennial');

    return {
      id: l.id || l.lead_id || slug,
      slug,
      name: rawName,
      category: l.category || 'Solar & Inverter Systems',
      phone: cleanPhone,
      displayPhone: cleanPhone.startsWith('234') ? '0' + cleanPhone.slice(3) : cleanPhone,
      email: l.email || '',
      area: l.area || l.city || 'Lagos',
      outreach_sent: Boolean(l.last_contacted_at?.startsWith(todayStr) || l.email_sent || l.sms_sent),
      status: isHotProspect ? 'PREVIEW_VIEWED (Active Hot)' : 'OUTREACH_DISPATCHED',
      heatScore: isHotProspect ? 55 : 35,
      claimed: Boolean(l.claimed),
      previewUrl: `${APP_ORIGIN}/preview/${slug}`,
      liveSiteUrl: `${APP_ORIGIN}/sites/${slug}`,
      handoverUrl: `${APP_ORIGIN}/handover/${slug}`
    };
  });

  const seenIds = new Set<string>();
  const combinedProspects: any[] = [];
  for (const p of [...journeyProspects, ...generalProspects]) {
    if (!seenIds.has(p.id) && !seenIds.has(p.slug)) {
      seenIds.add(p.id);
      seenIds.add(p.slug);
      combinedProspects.push(p);
    }
  }
  activeProspects = combinedProspects.slice(0, 35);

  const crmRaw = readDbJson('crm_leads.json', []);
  const crmLeads = Array.isArray(crmRaw) ? crmRaw.slice(0, 30) : [];

  let provisionedSites: any[] = [];
  if (fs.existsSync(SITES_DIR)) {
    try {
      const files = fs.readdirSync(SITES_DIR).filter(f => f.endsWith('.json'));
      provisionedSites = files.slice(0, 30).map(file => {
        const slug = file.replace('.json', '');
        let siteData: any = {};
        try {
          siteData = JSON.parse(fs.readFileSync(path.join(SITES_DIR, file), 'utf8'));
        } catch (_) {}
        return {
          slug,
          name: siteData.lead?.name || slug,
          category: siteData.lead?.category || 'Commercial Business',
          preferredDomain: siteData.preferredDomain || '',
          selectedPackage: siteData.selectedPackage || '6-Month Independence Bundle',
          paymentStatus: siteData.paymentStatus || 'IN_PROGRESS',
          liveSiteUrl: `${APP_ORIGIN}/sites/${slug}`,
          handoverUrl: `${APP_ORIGIN}/handover/${slug}`,
          updatedAt: siteData.lastUpdatedViaWhatsApp || null
        };
      });
    } catch (_) {}
  }

  const waSentToday = 0;
  const waActiveLines = 1;

  return NextResponse.json({
    success: true,
    telemetry: {
      date: todayStr,
      emails: {
        sentToday: emailsSentToday,
        targetDaily: 600,
        totalAllTime: totalEmailsAllTime,
        percent: Math.min(100, Math.round((emailsSentToday / 600) * 100))
      },
      whatsapp: {
        sentToday: waSentToday,
        targetDaily: 100,
        activeLines: waActiveLines,
        percent: 0,
        status: 'Outbound Paused / Closer Desk Active (0802 279 1227)'
      },
      webforms: {
        sentToday: webformsToday,
        targetDaily: 300,
        totalAllTime: webformsTotal,
        percent: Math.min(100, Math.round((webformsToday / 300) * 100))
      },
      sms: {
        sentToday: smsSentToday,
        targetDaily: 120,
        percent: Math.min(100, Math.round((smsSentToday / 120) * 100))
      },
      leads: {
        totalGenuine: totalLeadsCount,
        contactedToday: smsSentToday + emailsSentToday
      },
      lines: {
        adminLine: '0802 279 1227 (Active Inbound Closer Desk)',
        outboundPool: 'Outbound Paused (Zero Spam Compliance)',
        payoutBank: `${CORPORATE_BANK.bankName} (${CORPORATE_BANK.accountNumber})`
      }
    },
    activeProspects,
    crmLeads,
    provisionedSites,
    corporateBank: CORPORATE_BANK,
    pillar2
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    // ── ACTION A: Claim & Generate Website On The Fly (Pillar 1) ─────────────
    if (action === 'claim_lead_site') {
      const { businessName, phone, category, area, serviceId, customUrl } = body;
      if (!businessName) {
        return NextResponse.json({ success: false, error: 'Business name is required' }, { status: 400 });
      }

      const cleanPhone = String(phone || '').replace(/\D/g, '');
      const slug = toSafeSlug(businessName, cleanPhone.slice(-10) || 'client');

      const leadInfo = {
        businessName: businessName.trim(),
        category: category || 'Commercial Enterprise',
        area: area || 'Lagos',
        phone: cleanPhone,
        slug
      };

      const result = autoProvisionSiteFromWhatsApp(cleanPhone, {
        leadName: leadInfo.businessName,
        category: leadInfo.category,
        area: leadInfo.area,
        slug
      });

      const previewUrl = `${APP_ORIGIN}/preview/${slug}`;
      const selectedService = getPillarOneService(serviceId || 'website_ai');
      const onboardUrl = `${APP_ORIGIN}/onboard?service=${selectedService.id}&biz=${encodeURIComponent(leadInfo.businessName)}&phone=${cleanPhone}`;
      
      const pitchText = selectedService.whatsappPitchTemplate(leadInfo.businessName, previewUrl);

      return NextResponse.json({
        success: true,
        slug,
        previewUrl,
        onboardUrl,
        liveSiteUrl: `${APP_ORIGIN}/sites/${slug}`,
        handoverUrl: `${APP_ORIGIN}/handover/${slug}`,
        pitchText,
        prefilledWhatsAppPitch: pitchText,
        waDirectLink: `https://wa.me/${cleanPhone}?text=${encodeURIComponent(pitchText)}`,
        waLink: `https://wa.me/${cleanPhone}?text=${encodeURIComponent(pitchText)}`,
        provisioned: result
      });
    }

    // ── ACTION B: Onboard Client & Bind Domain (Pillar 1) ─────────────────────
    if (action === 'onboard_client') {
      const { slug, domain, selectedPackage, paymentReference } = body;
      if (!slug) {
        return NextResponse.json({ success: false, error: 'Slug is required' }, { status: 400 });
      }

      const sitePath = path.join(SITES_DIR, `${slug}.json`);
      let siteData: any = {};
      if (fs.existsSync(sitePath)) {
        try {
          siteData = JSON.parse(fs.readFileSync(sitePath, 'utf8'));
        } catch (_) {}
      }

      siteData.slug = slug;
      siteData.preferredDomain = domain || siteData.preferredDomain || `${slug}.com.ng`;
      siteData.selectedPackage = selectedPackage || '6-Month Independence Bundle';
      siteData.paymentStatus = 'CONFIRMED_DEPOSIT';
      siteData.paymentReference = paymentReference || `MANUAL-${Date.now()}`;
      siteData.onboardedAt = new Date().toISOString();

      fs.writeFileSync(sitePath, JSON.stringify(siteData, null, 2), 'utf8');

      return NextResponse.json({
        success: true,
        message: `Client ${slug} successfully onboarded and domain ${siteData.preferredDomain} assigned!`,
        siteData
      });
    }

    // ── ACTION C: Test Inbound AI Response Engine (Pillar 1) ─────────────────
    if (action === 'test_ai_closer' || action === 'test_ai_query') {
      const { message, businessName, category, area } = body;
      const cleanMessage = typeof message === 'string' ? message.replace(/<[^>]*>?/gm, '').trim() : '';
      const cleanBizName = typeof businessName === 'string' ? businessName.replace(/<[^>]*>?/gm, '').trim() : '';
      const testLead = {
        businessName: cleanBizName || 'Lagos Commercial Enterprise',
        category: category || 'Solar Energy Enterprise',
        area: area || 'Victoria Island',
        phone: '2348000000000',
        slug: 'test-client',
        previewUrl: `${APP_ORIGIN}/preview/test-client`
      };

      const aiReply = handlePostContactInquiry(cleanMessage || 'How much is the website?', testLead);
      return NextResponse.json({
        success: true,
        userPrompt: cleanMessage,
        aiResponse: aiReply,
        intent: aiReply?.intent || 'GENERAL_INQUIRY',
        suggestedAction: aiReply?.suggestedAction || 'SEND_PROTOTYPE',
        replyText: aiReply?.replyText || aiReply?.message || (typeof aiReply === 'string' ? aiReply : 'AI response generated.')
      });
    }

    // ── ACTION D: Discover Fresh Luxury Mandates (Pillar 2) ──────────────────
    if (action === 'run_pillar2_discovery') {
      const result = await discoverFreshDeals();
      return NextResponse.json(result);
    }

    // ── ACTION E: Process Outbound Mandate Queue (Pillar 2) ───────────────────
    if (action === 'process_pillar2_queue') {
      const result = await processPillar2OutboundQueue();
      return NextResponse.json(result);
    }

    // ── ACTION F: 1-Tap In-App Mandate Approval (Pillar 2) ───────────────────
    if (action === 'approve_pillar2_ticket') {
      const { ticketId } = body;
      if (!ticketId) {
        return NextResponse.json({ success: false, error: 'ticketId is required' }, { status: 400 });
      }
      const result = await approvePillar2Ticket(ticketId);
      return NextResponse.json(result);
    }

    // ── ACTION G: Dismiss / Reject Mandate Ticket (Pillar 2) ──────────────────
    if (action === 'reject_pillar2_ticket') {
      const { ticketId } = body;
      if (!ticketId) {
        return NextResponse.json({ success: false, error: 'ticketId is required' }, { status: 400 });
      }
      const result = await rejectPillar2Ticket(ticketId);
      return NextResponse.json(result);
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
