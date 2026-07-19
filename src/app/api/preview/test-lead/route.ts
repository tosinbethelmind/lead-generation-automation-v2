import { NextRequest, NextResponse } from 'next/server';
import { getActiveLeadRepository, addLog } from '@/lib/googleSheets';
import { getRuntimeConfig, saveLocalConfig } from '@/lib/localConfig';
import { getValidAccessToken } from '@/lib/googleAuth';

// ============================================================================
// Send Gmail Message
// ============================================================================

async function sendGmailNotification(to: string, subject: string, body: string, accessToken: string) {
  const rawMessage = [
    `To: ${to}`,
    `Subject: ${subject}`,
    'Content-Type: text/plain; charset="UTF-8"',
    'MIME-Version: 1.0',
    '',
    body
  ].join('\r\n');

  const encodedMail = Buffer.from(rawMessage)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const url = 'https://gmail.googleapis.com/gmail/v1/users/me/messages/send';
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw: encodedMail }),
  });

  if (!resp.ok) {
    const err = await resp.json();
    throw new Error(err.error?.message || resp.statusText);
  }
}

// ============================================================================
// Next.js Route Handler
// ============================================================================

export async function POST(req: NextRequest) {
  try {
    console.log('[DEBUG] POST /api/preview/test-lead handler started execution');
    const body = await req.json();
    const { leadId, name, email, phone, date, message } = body;

    if (!leadId || !name || !email) {
      return NextResponse.json({ error: 'Missing required parameters: leadId, name, or email' }, { status: 400 });
    }

    // Load lead from CRM Database
    const repo = getActiveLeadRepository();
    const lead = await repo.getLeadById(leadId);

    if (!lead) {
      return NextResponse.json({ error: `Lead with ID ${leadId} not found` }, { status: 404 });
    }

    const config = getRuntimeConfig();
    const isDryRun = config.dryRun;

    const emailSubject = `[Demo Alert] New Customer Booking for ${lead.name}`;
    const emailBody = `Hi ${lead.name} Team,

This is a live demonstration of your website's automated customer booking notification workflow.

A visitor just submitted a new booking request on your site:

--------------------------------------------------
Customer Details:
- Name: ${name}
- Email: ${email}
- Phone: ${phone || 'Not provided'}
- Booking Date: ${date || 'Not specified'}
- Message: ${message || 'No additional message.'}
--------------------------------------------------

This alert was triggered instantly and sent to your inbox. Claim your website today to activate this workflow live!

Best regards,
Bethelmind Analytics & Strategy Automation Suite`;

    // Log the test trigger event
    await addLog(
      'Lead Automation Demo',
      'INFO',
      `Test lead submitted by ${name} (${email}) for business "${lead.name}"`
    );

    // Read Scaling configuration
    const { parseScalingConfig } = require('@/lib/scalingHelper');
    const scaling = parseScalingConfig(lead.notes);

    if (scaling.mode === 'n8n') {
      const n8nWebhook = config.n8nWebhookUrl;
      if (n8nWebhook) {
        try {
          const forwardRes = await fetch(n8nWebhook, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              leadId,
              businessName: lead.name,
              category: lead.category,
              customerName: name,
              customerEmail: email,
              customerPhone: phone,
              bookingDate: date,
              message: message,
              submittedAt: new Date().toISOString()
            })
          });

          if (forwardRes.ok) {
            return NextResponse.json({
              success: true,
              forwarded: true,
              message: 'Lead forwarded directly to n8n automation pipeline!'
            });
          } else {
            console.error('n8n forwarding returned non-ok status:', forwardRes.status);
          }
        } catch (err: any) {
          console.error('n8n forwarding connection error:', err.message);
        }
      }
    }

    if (isDryRun) {
      return NextResponse.json({
        success: true,
        dryRun: true,
        message: 'Simulation successful! Lead logged in database log and dry-run alerts triggered.',
      });
    }

    try {
      const accessToken = await getValidAccessToken();
      
      // Email the person who submitted the form (acting as the business owner or checking the alert)
      await sendGmailNotification(email, emailSubject, emailBody, accessToken);
      
      return NextResponse.json({
        success: true,
        dryRun: false,
        message: `Alert notification email successfully dispatched to ${email}!`,
      });
    } catch (authErr: any) {
      console.warn('OAuth token unavailable or expired during test alert:', authErr.message);
      return NextResponse.json({
        success: true,
        dryRun: true,
        message: 'Lead simulated successfully (Active Google Identity session not connected for live dispatch).',
      });
    }

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
