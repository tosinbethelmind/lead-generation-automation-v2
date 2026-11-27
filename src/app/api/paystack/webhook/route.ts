import { NextRequest, NextResponse } from 'next/server';
import {
  verifyPaystackSignature,
  verifyAndProcessPaystackTransaction,
} from '@/lib/commerce/paymentOrchestrator';
import { getActiveLeadRepository, addLog } from '@/lib/googleSheets';
import { sendPaymentConfirmation, sendNotificationEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get('x-paystack-signature');
    const rawBody = await req.text();

    if (!verifyPaystackSignature(rawBody, signature)) {
      return NextResponse.json({ error: 'Invalid or missing Paystack signature' }, { status: 401 });
    }

    const event = JSON.parse(rawBody);
    if (event.event !== 'charge.success') {
      return NextResponse.json({ received: true, ignoredEvent: event.event });
    }

    const tx = event.data || {};
    const reference = tx.reference;
    if (!reference) {
      return NextResponse.json({ error: 'Missing transaction reference' }, { status: 400 });
    }

    const webhookEventId = `paystack-${event.event}-${tx.id || reference}`;
    const result = await verifyAndProcessPaystackTransaction({
      reference,
      webhookEventId,
      rawWebhookPayload: event,
    });

    if (!result.verified) {
      return NextResponse.json({ error: result.error || 'Verification failed' }, { status: 400 });
    }

    // Sync legacy lead record if leadId metadata is present and not already processed
    const meta = tx.metadata || {};
    if (!result.alreadyProcessed && meta.leadId) {
      try {
        const repo = getActiveLeadRepository();
        const lead = await repo.getLeadById(meta.leadId);
        if (lead) {
          const amountPaid = Math.round(Number(tx.amount || 0) / 100);
          await repo.updateLeadStatus(
            meta.leadId,
            'CONTACTED',
            `${lead.notes || ''}\n[VERIFIED PAYSTACK WEBHOOK] Ref: ${reference}, Amount: ₦${amountPaid.toLocaleString()}`,
            new Date().toISOString()
          );
        }
        await addLog(
          'Paystack Webhook',
          'SUCCESS',
          `Verified Paystack payment Ref=${reference} Order=${result.order?.orderReference}`
        );
      } catch (syncErr) {
        console.warn('[Paystack Webhook] Legacy lead sync notice:', syncErr);
      }

      if (meta.clientEmail && meta.clientName) {
        try {
          await sendPaymentConfirmation(
            meta.clientEmail,
            meta.clientName,
            meta.leadId,
            Math.round(Number(tx.amount || 0) / 100),
            reference
          );
        } catch {}
      }
      try {
        await sendNotificationEmail(
          'Verified Paystack Payment Received',
          `Order: ${result.order?.orderReference}\nRef: ${reference}\nAmount: ₦${Math.round(Number(tx.amount || 0) / 100).toLocaleString()}`
        );
      } catch {}
    }

    return NextResponse.json({
      success: true,
      alreadyProcessed: result.alreadyProcessed,
      orderReference: result.order?.orderReference,
    });
  } catch (err: any) {
    console.error('[Paystack Webhook Error]:', err);
    return NextResponse.json({ error: err.message || 'Webhook processing failed' }, { status: 500 });
  }
}
