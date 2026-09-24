import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

function cleanNigerianPhone(rawPhone: string): string {
  if (!rawPhone) return '';
  let digits = rawPhone.replace(/\D/g, '');
  if (digits.startsWith('234')) return digits;
  if (digits.startsWith('0')) digits = digits.substring(1);
  return `234${digits}`;
}

function isValidNigerianPhone(phoneE164: string): boolean {
  if (!phoneE164 || !phoneE164.startsWith('234')) return false;
  const local = phoneE164.substring(3);
  if (local.length !== 10) return false;
  // Valid Nigerian prefixes: 70, 80, 81, 90, 91
  return /^[789][01]\d{8}$/.test(local);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, businessName, category, area, leadId, questionAsked } = body;

    if (!phone) {
      return NextResponse.json({ success: false, error: 'Please enter your WhatsApp phone number.' }, { status: 400 });
    }

    const cleanPhone = cleanNigerianPhone(phone);
    if (!isValidNigerianPhone(cleanPhone)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Please enter a valid 11-digit Nigerian WhatsApp number (e.g. 0802 279 1227).' 
      }, { status: 400 });
    }

    const bName = businessName || 'Your Business';
    const cat = category || 'Commercial Enterprise';
    const loc = area || 'Lagos';
    const previewUrl = `https://www.bethelmindanalytics.com/preview/${leadId || 'demo'}`;

    // 1. Compose tailored Nigerian WhatsApp test response
    const greetingMsg = 
      `🌟 *Hello Management at ${bName}!* 👋\n\n` +
      `This is your live 24/7 AI Sales Assistant test message from *Bethelmind Analytics Lagos Desk*.\n\n` +
      `⚡ *HOW FAST WE REPLY TO YOUR CLIENTS:*\n` +
      `Notice this message arrived in seconds! When after-hours customers message *${bName}* at 9:00 PM or while you are busy, our 24/7 assistant answers their questions, calculates quotes, and books appointments automatically.\n\n` +
      `📍 *Your Business Identity:* ${bName} (${cat}) in ${loc}\n` +
      `🔗 *Your Live Interactive Prototype:* ${previewUrl}\n\n` +
      `Would you like to deploy this on your official WhatsApp line with ₦0 Upfront Preview? Reply *YES* to begin!`;

    // 2. Dispatch real message to the prospect's WhatsApp
    let dispatched = false;
    let provider = 'evolution_api';

    try {
      const evoResp = await fetch('http://localhost:8080/message/sendText/bethelmind_instance_1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.EVOLUTION_API_KEY || 'evolution_bethelmind_secret_2026'
        },
        body: JSON.stringify({
          number: cleanPhone,
          text: greetingMsg
        })
      });
      if (evoResp.ok) dispatched = true;
    } catch (_) {}

    // Fallback to Baileys Port 3007 if Evolution API was not reached
    if (!dispatched) {
      try {
        const bResp = await fetch('http://localhost:3007/send-message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: cleanPhone,
            message: greetingMsg
          })
        });
        if (bResp.ok) {
          dispatched = true;
          provider = 'baileys_3007';
        }
      } catch (_) {}
    }

    // 3. Notify Admin Closer Desk (0802 279 1227) of the high-intent prospect
    const adminAlertMsg = 
      `🔥 *HOT INBOUND LEAD: PROSPECT TESTED WHATSAPP DEMO!*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `🏢 *Business:* ${bName}\n` +
      `📱 *Owner Phone:* +${cleanPhone}\n` +
      `🏷️ *Sector:* ${cat}\n` +
      `📍 *Location:* ${loc}\n` +
      `🔗 *Prototype Link:*\n${previewUrl}\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `👉 *Tap to Chat Owner:* https://wa.me/${cleanPhone}`;

    fetch('http://localhost:8080/message/sendText/bethelmind_instance_1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.EVOLUTION_API_KEY || 'evolution_bethelmind_secret_2026'
      },
      body: JSON.stringify({
        number: '2348022791227',
        text: adminAlertMsg
      })
    }).catch(() => {});

    // 4. Persist to local verified database
    try {
      const localDbDir = path.join(process.cwd(), 'local_db');
      const crmPath = path.join(localDbDir, 'crm_leads.json');
      let crmLeads: any[] = [];
      if (fs.existsSync(crmPath)) {
        try { crmLeads = JSON.parse(fs.readFileSync(crmPath, 'utf8')); } catch (_) {}
      }

      const existing = crmLeads.find((l: any) => (l.phone || '').replace(/\D/g, '') === cleanPhone);
      if (existing) {
        existing.status = 'WHATSAPP_TESTED';
        existing.last_contacted_at = new Date().toISOString();
        existing.high_intent = true;
      } else {
        crmLeads.unshift({
          id: `crm_${Date.now()}`,
          name: bName,
          sector: cat,
          city: loc,
          area: loc,
          phone: `+${cleanPhone}`,
          status: 'WHATSAPP_TESTED',
          preview_url: previewUrl,
          high_intent: true,
          created_at: new Date().toISOString()
        });
      }
      fs.writeFileSync(crmPath, JSON.stringify(crmLeads.slice(0, 1000), null, 2), 'utf8');
    } catch (_) {}

    return NextResponse.json({
      success: true,
      phone: `+${cleanPhone}`,
      businessName: bName,
      dispatched,
      provider,
      chatLink: `https://wa.me/2348022791227?text=${encodeURIComponent(`Hello Bethelmind Lagos Desk! I just tested the live demo for *${bName}*. Let's set this up!`)}`
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
