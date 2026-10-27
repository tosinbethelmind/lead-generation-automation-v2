import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const VPS_EVOLUTION_URL = process.env.VPS_EVOLUTION_URL || 'http://169.58.182.92:8080/send';
const ADMIN_PHONE = '2348022791227';
const INBOUND_LEADS_FILE = path.join(process.cwd(), 'local_db', 'inbound_web_leads.json');

function normalizeNigerianPhone(raw: string): string | null {
  if (!raw) return null;
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('0')) {
    return '234' + digits.slice(1);
  }
  if (digits.length === 13 && digits.startsWith('234')) {
    return digits;
  }
  if (digits.length === 10 && !digits.startsWith('0')) {
    return '234' + digits;
  }
  return null;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phone, fullName, toolType = 'solar', calculationSummary = '', reportUrl = '' } = body;

    const normalizedPhone = normalizeNigerianPhone(phone);
    if (!normalizedPhone) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid 11-digit Nigerian WhatsApp phone number (e.g., 0802 123 4567).' },
        { status: 400 }
      );
    }

    const leadRef = `BM-INB-${Date.now().toString(36).toUpperCase()}`;
    const timestamp = new Date().toISOString();

    const newLead = {
      ref: leadRef,
      fullName: fullName?.trim() || 'Valued Client',
      phone: normalizedPhone,
      phoneDisplay: '0' + normalizedPhone.slice(3),
      toolType,
      calculationSummary,
      reportUrl,
      source: 'INTERACTIVE_WHATSAPP_GATE',
      status: 'WARM_INBOUND_CAPTURED',
      timestamp,
    };

    // 1. Persist to local storage
    try {
      const dir = path.dirname(INBOUND_LEADS_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      let existingLeads: any[] = [];
      if (fs.existsSync(INBOUND_LEADS_FILE)) {
        try {
          const content = fs.readFileSync(INBOUND_LEADS_FILE, 'utf-8');
          existingLeads = JSON.parse(content);
        } catch {
          existingLeads = [];
        }
      }
      existingLeads.unshift(newLead);
      // Keep bounded to last 2000 inbound leads to preserve memory
      if (existingLeads.length > 2000) {
        existingLeads = existingLeads.slice(0, 2000);
      }
      fs.writeFileSync(INBOUND_LEADS_FILE, JSON.stringify(existingLeads, null, 2), 'utf-8');
    } catch (saveErr) {
      console.error('[LeadCapture] Storage warning:', saveErr);
    }

    // 2. Dispatch Automated WhatsApp Message via Contabo VPS Evolution API
    let vpsDispatched = false;
    const clientMessage = `*BETHELMIND DIGITAL SOLUTIONS (CAC: 9912717)*\nOfficial Technical Specification & Audit\nReference: ${leadRef}\n\nHello ${newLead.fullName},\n\nYour official stamped report for *${toolType === 'solar' ? 'Solar Hybrid System BOQ' : toolType === 'vin' ? 'Tokunbo VIN Pre-Purchase & Duty Audit' : 'Commercial Suite'}* is ready.\n\n*Key Highlights:*\n${calculationSummary || 'Technical specifications generated successfully.'}\n\n*Official Verification Portal:*\nhttps://www.bethelmindanalytics.com\n\nDirect support hotline: wa.me/${ADMIN_PHONE}\nMoniepoint Settlement Desk: 6805375225 - Bethelmind Digital Solutions`;

    const adminAlertMessage = `🔥 *NEW HOT INBOUND LEAD CAPTURED!*\n\n*Ref:* ${leadRef}\n*Tool:* ${toolType.toUpperCase()}\n*Name:* ${newLead.fullName}\n*Phone:* ${newLead.phoneDisplay} (+${normalizedPhone})\n*Summary:* ${calculationSummary}\n*Time:* ${new Date().toLocaleString('en-NG', { timeZone: 'Africa/Lagos' })}\n\n*Direct Chat with Lead:* https://wa.me/${normalizedPhone}`;

    // Try VPS Evolution API asynchronously (with short timeout so frontend is never blocked)
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('VPS timeout')), 3500));

    try {
      // Send to lead
      const sendToLeadPromise = fetch(VPS_EVOLUTION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: normalizedPhone,
          message: clientMessage,
          isColdOutreach: false,
          lineId: 1
        })
      });

      // Alert Admin
      const alertAdminPromise = fetch(VPS_EVOLUTION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: ADMIN_PHONE,
          message: adminAlertMessage,
          isColdOutreach: false,
          lineId: 1
        })
      });

      await Promise.race([Promise.allSettled([sendToLeadPromise, alertAdminPromise]), timeoutPromise]);
      vpsDispatched = true;
    } catch (vpsErr) {
      console.warn('[LeadCapture] VPS Evolution API notice (queued for fallback):', (vpsErr as any)?.message);
    }

    const fallbackWhatsAppUrl = `https://wa.me/${ADMIN_PHONE}?text=${encodeURIComponent(
      `Hello Bethelmind Lagos Desk! I just submitted my WhatsApp (${newLead.phoneDisplay}) on the ${toolType.toUpperCase()} portal [Ref: ${leadRef}]. Please send my official stamped PDF breakdown.`
    )}`;

    return NextResponse.json({
      success: true,
      ref: leadRef,
      phone: normalizedPhone,
      phoneDisplay: newLead.phoneDisplay,
      vpsDispatched,
      fallbackWhatsAppUrl,
      message: 'Technical report queued! If WhatsApp is slow to arrive, tap the direct link to receive it immediately.',
    });
  } catch (error: any) {
    console.error('[LeadCapture] Error in route:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error processing lead capture.' },
      { status: 500 }
    );
  }
}
