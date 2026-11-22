import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';
import { sendAdminWhatsAppNotification } from '@/lib/monetization/adminWhatsAppNotifier';

const AFFILIATES_DB_PATH = path.join(process.cwd(), 'local_db', 'affiliate_applications.json');

function saveApplication(appData: any) {
  try {
    const dir = path.dirname(AFFILIATES_DB_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    let existing: any[] = [];
    if (fs.existsSync(AFFILIATES_DB_PATH)) {
      try {
        existing = JSON.parse(fs.readFileSync(AFFILIATES_DB_PATH, 'utf8'));
        if (!Array.isArray(existing)) existing = [];
      } catch (_) {
        existing = [];
      }
    }

    existing.unshift(appData);
    fs.writeFileSync(AFFILIATES_DB_PATH, JSON.stringify(existing, null, 2));
  } catch (err) {
    console.error('[AffiliateApply] Error saving to local DB:', err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, platform, audience_size, trafficChannel, experience } = body;

    if (!name || (!email && !phone)) {
      return NextResponse.json(
        { success: false, error: 'Name and email or phone are required.' },
        { status: 400 }
      );
    }

    const applicationRecord = {
      id: `AFF-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      name: String(name).trim(),
      email: String(email || '').trim().toLowerCase(),
      phone: String(phone || '').trim(),
      platform: String(platform || trafficChannel || 'WhatsApp').trim(),
      audience_size: String(audience_size || experience || 'Active Creator').trim(),
      source: 'web_affiliates_funnel',
      submittedAt: new Date().toISOString()
    };

    // 1. Save locally
    saveApplication(applicationRecord);

    // 2. Dispatch real-time Admin WhatsApp Alert
    const adminMessage = 
      `💎 *NEW AFFILIATE PARTNER APPLICATION*\n\n` +
      `👤 *Partner Name:* ${applicationRecord.name}\n` +
      `📞 *Phone / WhatsApp:* ${applicationRecord.phone}\n` +
      `✉️ *Email:* ${applicationRecord.email}\n` +
      `📢 *Channel:* ${applicationRecord.platform}\n` +
      `📊 *Audience / Level:* ${applicationRecord.audience_size}\n` +
      `🕒 *Time:* ${new Date().toLocaleTimeString()} WAT\n\n` +
      `⚡ *Action:* Send promo swipe kit & Selar partner onboarding to ${applicationRecord.phone}`;

    // Non-blocking notification dispatch
    sendAdminWhatsAppNotification(adminMessage).catch(err => {
      console.warn('[AffiliateApply] Admin notification non-critical notice:', err?.message);
    });

    return NextResponse.json({
      success: true,
      message: 'Application staged successfully. Our team will verify and activate your 50% link.',
      partnerId: applicationRecord.id
    });
  } catch (err: any) {
    console.error('[AffiliateApply] Error handling request:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'online',
    endpoint: '/api/affiliate/apply',
    program: 'Bethelmind Analytics 50% Partner & Creator Affiliate Network'
  });
}
