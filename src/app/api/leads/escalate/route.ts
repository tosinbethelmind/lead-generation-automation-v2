import { NextRequest, NextResponse } from 'next/server';
import { getActiveLeadRepository, addLog } from '@/lib/googleSheets';
import { getRuntimeConfig } from '@/lib/localConfig';
import { sendNotificationEmail } from '@/lib/email';

// ============================================================================
// POST /api/leads/escalate
// Marks a lead as MANUAL_REVISION and emails the admin for human intervention.
// ============================================================================

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { leadId, clientName, clientEmail, reason, urgency } = body;

    if (!leadId) {
      return NextResponse.json(
        { error: 'leadId is required.' },
        { status: 400 }
      );
    }

    const repo = getActiveLeadRepository();
    const lead = await repo.getLeadById(leadId);

    if (!lead) {
      return NextResponse.json(
        { error: `Lead "${leadId}" not found.` },
        { status: 404 }
      );
    }

    // 1. Update lead status to MANUAL_REVISION
    const timestamp = new Date().toISOString();
    const escalationNote = `\n[MANUAL_REVISION] Escalated on ${timestamp}. Client: ${clientName || 'Unknown'} (${clientEmail || 'N/A'}). Reason: ${reason || 'No reason provided'}. Urgency: ${urgency || 'normal'}.`;
    const newNotes = (lead.notes || '') + escalationNote;

    await repo.updateLeadStatus(leadId, 'MANUAL_REVISION' as any, newNotes, timestamp);

    // 2. Add audit log
    await addLog(
      'Lead Escalation',
      'WARN',
      `Lead "${lead.name}" escalated to MANUAL_REVISION by ${clientName || 'client'}. Reason: ${reason || 'none'}`
    );

    // 3. Email admin
    const config = getRuntimeConfig();
    const adminEmail = config.googleUserEmail || config.resendFromEmail || config.brevoSenderEmail;

    if (adminEmail) {
      const subject = `🚨 Manual Revision Required: ${lead.name}`;
      const emailBody = `Hi Admin,

A client has requested manual intervention for their website.

Lead Details:
- Business Name: ${lead.name}
- Lead ID: ${leadId}
- Category: ${lead.category}
- Area: ${lead.area}, ${lead.city}

Escalation Details:
- Client Name: ${clientName || 'Not provided'}
- Client Email: ${clientEmail || 'Not provided'}
- Reason: ${reason || 'No reason provided'}
- Urgency: ${urgency || 'Normal'}
- Timestamp: ${timestamp}

Action Required:
Please review this lead in the admin dashboard or contact the client directly.

${clientEmail ? `Reply directly to: ${clientEmail}` : ''}

Best regards,
ApexReach Automation Engine`;

      await sendNotificationEmail(adminEmail, subject, emailBody);
    }

    return NextResponse.json({
      success: true,
      message: 'Your request has been escalated to our development team. We will contact you shortly.',
      escalatedAt: timestamp,
    });

  } catch (err: any) {
    console.error('[/api/leads/escalate] Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
