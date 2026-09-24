/**
 * @file src/app/api/integrations/brevo/route.ts
 * 
 * Brevo Integration API Route (2026 Edition)
 * Bethelmind Analytics Commercial Growth Engine
 * 
 * GET: Audits Brevo API key, account credits, and senders.
 * POST: Triggers test email dispatch or syncs lead contact to Brevo.
 */

import { NextResponse } from 'next/server';
import { BrevoClient } from '@/lib/integrations/brevoClient';
import { getRuntimeConfig } from '@/lib/localConfig';

export async function GET(request: Request) {
  try {
    const config = getRuntimeConfig();
    const apiKey = process.env.BREVO_API_KEY || config.brevoApiKey || '';

    if (!apiKey) {
      return NextResponse.json({
        success: false,
        status: 'UNCONFIGURED',
        message: 'Brevo API Key is missing. Set BREVO_API_KEY in .env.local or settings.'
      }, { status: 400 });
    }

    const client = new BrevoClient(apiKey);
    const accountInfo = await client.getAccountInfo();
    const senders = await client.getSenders();

    return NextResponse.json({
      success: true,
      status: 'CONFIGURED',
      account: {
        email: accountInfo.email,
        firstName: accountInfo.firstName,
        lastName: accountInfo.lastName,
        planType: accountInfo.plan?.[0]?.type || 'FREE',
        credits: accountInfo.plan?.[0]?.credits || 0
      },
      verifiedSenders: senders.senders || []
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      status: 'ERROR',
      error: err.message
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, to, subject, message, lead } = body;

    const config = getRuntimeConfig();
    const apiKey = process.env.BREVO_API_KEY || config.brevoApiKey || '';
    const client = new BrevoClient(apiKey);

    if (action === 'send_test_email') {
      if (!to) {
        return NextResponse.json({ success: false, error: 'Recipient "to" email is required' }, { status: 400 });
      }

      const result = await client.sendEmail({
        to: [{ email: to }],
        subject: subject || 'Bethelmind Analytics - Brevo Integration Test',
        textContent: message || 'Hello! This is a test email verifying your Brevo API integration on Bethelmind Analytics.'
      });

      return NextResponse.json({
        success: true,
        action: 'send_test_email',
        result
      });
    }

    if (action === 'sync_lead') {
      if (!lead || !lead.email) {
        return NextResponse.json({ success: false, error: 'Lead object with "email" is required' }, { status: 400 });
      }

      const synced = await client.syncLead(lead);
      return NextResponse.json({
        success: synced,
        action: 'sync_lead',
        email: lead.email
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action. Supported actions: "send_test_email", "sync_lead"'
    }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message
    }, { status: 500 });
  }
}
