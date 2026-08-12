import { NextRequest, NextResponse } from 'next/server';
import { getActiveLeadRepository, addLog } from '@/lib/googleSheets';
import { sendWhatsAppMessage } from '@/lib/whatsapp';
import { copyToClipboard } from '@/lib/clipboard';

export async function GET(req: NextRequest) {
  try {
    const repo = getActiveLeadRepository();
    const allLeads = (await repo.getLeads()) as any[];

    // Filter leads requiring Admin Assistant attention
    const pendingClaims = allLeads.filter(l => {
      const notes = (l.notes || l.business_summary || '').toLowerCase();
      const status = (l.status || '').toLowerCase();
      return notes.includes('[claimed]') || notes.includes('transfer pending') || status === 'proposal_sent' || status === 'qualified';
    });

    const manualTransfersPending = allLeads.filter(l => {
      const notes = (l.notes || '').toLowerCase();
      return notes.includes('transfer pending') || notes.includes('moniepoint') || notes.includes('opay');
    });

    const redesignRequests = allLeads.filter(l => {
      const notes = (l.notes || '').toLowerCase();
      return notes.includes('[redesign_pending: true]') || notes.includes('custom instructions');
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalLeads: allLeads.length,
        pendingClaimsCount: pendingClaims.length,
        manualTransfersCount: manualTransfersPending.length,
        redesignRequestsCount: redesignRequests.length,
      },
      alerts: pendingClaims.slice(0, 10).map(l => ({
        id: l.id || l.lead_id,
        name: l.name || l.business_name,
        phone: l.phone || l.phone_e164 || l.phone_raw,
        email: l.email,
        status: l.status,
        notes: l.notes,
        created_at: l.created_at || new Date().toISOString(),
        engine: l.engine || 'solar',
      }))
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch admin assistant tasks' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, leadId, customDomain, claimFeeNGN, customMessage } = body;

    if (!action || !leadId) {
      return NextResponse.json({ error: 'Action and leadId are required' }, { status: 400 });
    }

    const repo = getActiveLeadRepository();
    const lead = await repo.getLeadById(leadId) as any;

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    const timestamp = new Date().toISOString();

    if (action === 'verify_claim') {
      // Mark claim as verified & update CRM status to CLAIMED
      const updatedNotes = `${lead.notes || ''}\n[ADMIN_VERIFIED: ${timestamp}] Website claim verified by Admin Assistant. Activated & provisioned.`;
      await repo.updateLeadStatus(leadId, 'CLAIMED', updatedNotes, timestamp);
      await addLog('Admin Assistant Duty', 'SUCCESS', `Claim verified and website activated for "${lead.name || lead.business_name}" (${leadId}).`);

      return NextResponse.json({
        success: true,
        message: `⚡ Claim verified! ${lead.name || 'Lead'} website activated and marked as CLAIMED.`,
        leadId
      });
    }

    if (action === 'bind_domain') {
      if (!customDomain) {
        return NextResponse.json({ error: 'Custom domain string required' }, { status: 400 });
      }
      const updatedNotes = `${lead.notes || ''}\n[CUSTOM_DOMAIN_BOUND: "${customDomain}"] Admin Assistant mapped domain on ${timestamp}.`;
      await repo.updateLeadStatus(leadId, (lead.status || 'CONTACTED') as any, updatedNotes, timestamp);
      await addLog('Admin Assistant Duty', 'SUCCESS', `Bound custom domain "${customDomain}" for "${lead.name || lead.business_name}".`);

      return NextResponse.json({
        success: true,
        message: `🌐 Custom domain "${customDomain}" bound successfully for ${lead.name || 'Lead'}!`,
        customDomain
      });
    }

    if (action === 'generate_assist_link') {
      const origin = process.env.NEXT_PUBLIC_APP_URL || 'https://www.bethelmindanalytics.com';
      const assistLink = `${origin}/preview/${encodeURIComponent(leadId)}?assist=true&claimFee=${claimFeeNGN || 98000}`;

      return NextResponse.json({
        success: true,
        assistLink,
        message: 'Claim assist link generated successfully!'
      });
    }

    return NextResponse.json({ error: 'Invalid assistant duty action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error processing admin duty' }, { status: 500 });
  }
}
