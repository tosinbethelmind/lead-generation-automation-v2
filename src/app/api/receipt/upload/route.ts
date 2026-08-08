import { NextRequest, NextResponse } from 'next/server';
import { getActiveLeadRepository, addLog } from '@/lib/googleSheets';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { leadId, paymentMethod, fileBase64, fileName, senderName, amountPaid } = body;

    if (!leadId) {
      return NextResponse.json({ error: 'Missing leadId' }, { status: 400 });
    }

    // Prepare uploads directory
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'receipts');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    let savedFilePath = '';
    let publicUrl = '';

    if (fileBase64) {
      const matches = fileBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      const buffer = matches ? Buffer.from(matches[2], 'base64') : Buffer.from(fileBase64, 'base64');
      const safeExt = (fileName && path.extname(fileName)) ? path.extname(fileName) : '.jpg';
      const cleanFileName = `receipt_${leadId}_${Date.now()}${safeExt}`;
      savedFilePath = path.join(uploadsDir, cleanFileName);
      fs.writeFileSync(savedFilePath, buffer);
      publicUrl = `/uploads/receipts/${cleanFileName}`;
    }

    // Update lead status in active repository
    try {
      const { updateLeadStatus } = await import('@/lib/googleSheets');
      await updateLeadStatus(
        leadId,
        'MANUAL_REVISION',
        `Receipt uploaded (${paymentMethod || 'opay'}). URL: ${publicUrl}`
      );
    } catch (e: any) {
      console.warn('Repository update notice:', e.message);
    }

    // Add activity log
    await addLog(
      'Receipt Verification',
      'RECEIPT_UPLOADED',
      `🔔 [NEW RECEIPT UPLOADED] Lead ID: ${leadId}. Method: ${paymentMethod || 'OPay'}. Sender: ${senderName || 'Client'}. Amount: ₦${amountPaid || '50000'}. File: ${publicUrl}`
    );

    return NextResponse.json({
      success: true,
      message: 'Receipt uploaded successfully! Verification in progress.',
      receiptUrl: publicUrl
    });
  } catch (err: any) {
    console.error('Receipt upload error:', err);
    return NextResponse.json({ error: err.message || 'Failed to upload receipt' }, { status: 500 });
  }
}
