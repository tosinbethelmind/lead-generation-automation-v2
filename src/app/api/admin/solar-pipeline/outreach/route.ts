import { NextRequest, NextResponse } from 'next/server';
import { solarQuoteProSupabase } from '@/lib/solarQuoteProClient';
import { verifySessionToken } from '@/lib/session';
import { getOutreachOrigin } from '@/lib/localConfig';
import { sendWhatsAppMessage } from '@/lib/whatsapp';
import { sendSmsMessage } from '@/lib/sms';
import { sendNotificationEmail } from '@/lib/email';
import { addLog } from '@/lib/googleSheets';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const cookieValue = req.cookies.get('admin-token')?.value;
    const session = await verifySessionToken(cookieValue);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }



    const body = await req.json();
    const { leadId, type, channel, customMessage, customSubject } = body;

    if (!leadId || !type || !channel) {
      return NextResponse.json({ error: 'leadId, type, and channel are required' }, { status: 400 });
    }

    // 1. Fetch Lead details from Supabase
    let lead: any = null;
    let oldNotes = '';

    if (type === 'homeowner') {
      const { data, error } = await solarQuoteProSupabase
        .from('homeowner_leads')
        .select('*')
        .eq('id', leadId)
        .single();
      
      if (error || !data) {
        return NextResponse.json({ error: 'Homeowner lead not found in database' }, { status: 404 });
      }
      lead = {
        lead_id: data.id,
        name: data.name || data.full_name || 'Homeowner',
        phone: data.phone || data.whatsapp || '',
        email: data.email || '',
        phone_e164: data.phone || data.whatsapp || '',
        phone_raw: data.phone || data.whatsapp || ''
      };
      oldNotes = data.notes || '';
    } else if (type === 'enterprise') {
      const { data, error } = await solarQuoteProSupabase
        .from('enterprise_leads')
        .select('*')
        .eq('id', leadId)
        .single();
      
      if (error || !data) {
        return NextResponse.json({ error: 'Enterprise lead not found in database' }, { status: 404 });
      }
      lead = {
        lead_id: data.id,
        name: data.company_name || 'Enterprise Client',
        phone: data.phone || '',
        email: data.email || '',
        phone_e164: data.phone || '',
        phone_raw: data.phone || ''
      };
      oldNotes = data.project_scope || '';
    } else {
      return NextResponse.json({ error: 'Invalid lead type' }, { status: 400 });
    }

    const origin = getOutreachOrigin(req.url);
    const previewUrl = `https://solar-roi-proposal-builder-fw961j972.vercel.app/admin/leads?id=${leadId}`; // Redirect back to proposal builder leads or public proposal preview if needed
    let responseMessage = '';

    // 2. Dispatch message through requested channel
    if (channel === 'whatsapp') {
      if (!lead.phone) {
        return NextResponse.json({ error: 'Lead does not have a phone number configured' }, { status: 400 });
      }
      await sendWhatsAppMessage(lead, previewUrl, origin, customMessage);
      responseMessage = `WhatsApp outreach triggered successfully to ${lead.phone}`;
    } else if (channel === 'sms') {
      if (!lead.phone) {
        return NextResponse.json({ error: 'Lead does not have a phone number configured' }, { status: 400 });
      }
      responseMessage = await sendSmsMessage(lead, previewUrl, customMessage);
    } else if (channel === 'email') {
      if (!lead.email) {
        return NextResponse.json({ error: 'Lead does not have an email address configured' }, { status: 400 });
      }
      const subject = customSubject || 'Solar Quote Pro: Installation Offer';
      const bodyText = customMessage || `Hi ${lead.name},\n\nWe put together a custom solar recommendation for you. Check out details: ${previewUrl}`;
      const success = await sendNotificationEmail(lead.email, subject, bodyText);
      if (!success) {
        throw new Error('Email sending provider failed');
      }
      responseMessage = `Email outreach triggered successfully to ${lead.email}`;
    } else {
      return NextResponse.json({ error: 'Unknown channel' }, { status: 400 });
    }

    // 3. Update status in database to contacted
    const updatedNotes = oldNotes + `\n[${new Date().toISOString()}] Outreach sent via ${channel.toUpperCase()}: ${customMessage || 'Standard Template'}`;
    const newStatus = 'contacted';

    if (type === 'homeowner') {
      await solarQuoteProSupabase
        .from('homeowner_leads')
        .update({ status: newStatus, notes: updatedNotes })
        .eq('id', leadId);
    } else if (type === 'enterprise') {
      await solarQuoteProSupabase
        .from('enterprise_leads')
        .update({ status: newStatus, project_scope: updatedNotes })
        .eq('id', leadId);
    }

    await addLog('Solar Outreach', 'SUCCESS', `Triggered ${channel} outreach for lead ${lead.name} (${leadId})`);

    return NextResponse.json({
      success: true,
      message: responseMessage,
      newStatus,
      newNotes: updatedNotes
    });

  } catch (error: any) {
    console.error('Error triggering outreach:', error);
    return NextResponse.json({ error: error.message || 'Failed to dispatch outreach' }, { status: 500 });
  }
}
