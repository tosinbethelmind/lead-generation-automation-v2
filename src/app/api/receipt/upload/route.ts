import { NextRequest, NextResponse } from 'next/server';
import { getActiveLeadRepository, addLog } from '@/lib/googleSheets';
import { getOrderByReference, updateOrder, upsertCustomer, createOrder } from '@/lib/commerce/ledger';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.pdf', '.webp']);
const MAX_BYTES = 5 * 1024 * 1024; // 5MB cap

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { leadId, orderReference, paymentMethod, fileBase64, fileName, senderName, senderEmail, amountPaid } = body;

    if (!leadId && !orderReference) {
      return NextResponse.json({ error: 'Missing leadId or orderReference' }, { status: 400 });
    }

    let storedFileRef = '';
    if (fileBase64) {
      const matches = String(fileBase64).match(/^data:([A-Za-z0-9-+\/]+);base64,(.+)$/);
      const buffer = matches ? Buffer.from(matches[2], 'base64') : Buffer.from(String(fileBase64), 'base64');

      if (buffer.length > MAX_BYTES) {
        return NextResponse.json({ error: 'Receipt file exceeds 5MB limit' }, { status: 400 });
      }

      const ext = fileName ? path.extname(String(fileName)).toLowerCase() : '.jpg';
      if (!ALLOWED_EXTENSIONS.has(ext)) {
        return NextResponse.json({ error: 'Unsupported receipt file type. Allowed: JPG, PNG, WEBP, PDF' }, { status: 400 });
      }

      // Store outside public/ so receipts are never publicly browsable
      const privateDir = path.join(process.cwd(), 'local_db', 'private_receipts');
      if (!fs.existsSync(privateDir)) {
        fs.mkdirSync(privateDir, { recursive: true });
      }

      const safeId = (orderReference || leadId).replace(/[^a-zA-Z0-9_-]/g, '');
      const cleanFileName = `receipt_${safeId}_${Date.now()}_${crypto.randomBytes(3).toString('hex')}${ext}`;
      fs.writeFileSync(path.join(privateDir, cleanFileName), buffer);
      storedFileRef = cleanFileName;
    }

    // Record/update order as pending_manual_verification — NEVER auto-fulfil on screenshot!
    const ref = orderReference || `MANUAL-${leadId}-${Date.now()}`;
    let order = await getOrderByReference(ref);
    if (!order) {
      const customer = await upsertCustomer({
        name: senderName || 'Client',
        email: senderEmail,
        leadId,
      });
      const claimedAmount = Number(amountPaid) || 0;
      order = await createOrder({
        orderReference: ref,
        customerId: customer.id,
        leadId,
        division: 'digital_business_solutions',
        packageName: 'Bank Transfer Verification Pending',
        totalAmountNgn: claimedAmount,
        depositAmountNgn: claimedAmount,
        balanceAmountNgn: 0,
        amountPaidNgn: 0,
        currency: 'NGN',
        paymentStage: 'deposit',
        paymentStatus: 'pending_manual_verification',
        fulfilmentStatus: 'pending',
        paymentProvider: paymentMethod || 'moniepoint',
        transactionReference: ref,
        metadata: { storedFileRef, senderName },
      });
    } else {
      await updateOrder(order.id, {
        paymentStatus: 'pending_manual_verification',
        metadata: { ...order.metadata, storedFileRef, senderName },
      });
    }

    if (leadId) {
      try {
        const repo = getActiveLeadRepository();
        await repo.updateLeadStatus(
          leadId,
          'CONTACTED',
          `[PENDING MANUAL VERIFICATION] Receipt submitted (${paymentMethod || 'Moniepoint'}). Ref: ${ref}. File: ${storedFileRef}`,
          new Date().toISOString()
        );
      } catch {}
    }

    await addLog(
      'Receipt Verification',
      'INFO',
      `Receipt queued for manual admin verification. Order: ${ref}, Sender: ${senderName || 'Client'}, File: ${storedFileRef}`
    );

    return NextResponse.json({
      success: true,
      orderReference: ref,
      paymentStatus: 'pending_manual_verification',
      message: 'Receipt received and queued for manual bank confirmation. Fulfilment begins once an admin confirms the credit.',
    });
  } catch (err: any) {
    console.error('Receipt upload error:', err);
    return NextResponse.json({ error: err.message || 'Failed to upload receipt' }, { status: 500 });
  }
}
