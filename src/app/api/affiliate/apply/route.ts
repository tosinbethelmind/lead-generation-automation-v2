import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';
import { sendAdminWhatsAppNotification } from '@/lib/monetization/adminWhatsAppNotifier';
import { getSupabaseClient } from '@/lib/supabaseClient';
import { sendNotificationEmail } from '@/lib/email';

const AFFILIATES_DB_PATH = path.join(process.cwd(), 'local_db', 'affiliate_applications.json');
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'bethelmindrecruit@gmail.com';

async function saveToSupabase(record: {
  id: string;
  name: string;
  email: string;
  phone: string;
  platform: string;
  audience_size: string;
  source: string;
  submittedAt: string;
}): Promise<boolean> {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) return false;

    const { error: tableErr } = await supabase
      .from('affiliate_applications')
      .insert({
        partner_id: record.id,
        name: record.name,
        email: record.email,
        phone: record.phone,
        platform: record.platform,
        audience_size: record.audience_size,
        source: record.source,
        submitted_at: record.submittedAt,
      });

    if (!tableErr) return true;

    // Fallback to existing `logs` table so no application is ever lost before migration
    const { error: logErr } = await supabase.from('logs').insert({
      run_id: record.id,
      step: 'affiliate_application',
      status: 'INFO',
      message: JSON.stringify(record),
    });

    return !logErr;
  } catch (err) {
    console.warn('[AffiliateApply] Supabase persistence skipped:', err);
    return false;
  }
}

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

    // 1. Save locally (best-effort)
    saveApplication(applicationRecord);

    // 2. Persist to Supabase Cloud (non-blocking if unavailable, awaited briefly for reliability)
    const savedToCloud = await saveToSupabase(applicationRecord);

    // 3. Send Email backup to Admin Desk (bethelmindrecruit@gmail.com)
    const emailSubject = `New Selar Affiliate Request: ${applicationRecord.name} (${applicationRecord.email})`;
    const emailBody = [
      'NEW SELAR AFFILIATE PARTNER APPLICATION (PATH B)',
      '',
      `Partner ID: ${applicationRecord.id}`,
      `Name: ${applicationRecord.name}`,
      `Selar Account Email: ${applicationRecord.email}`,
      `Phone / WhatsApp: ${applicationRecord.phone || 'Not provided'}`,
      `Channel: ${applicationRecord.platform}`,
      `Audience Size: ${applicationRecord.audience_size}`,
      `Submitted At: ${applicationRecord.submittedAt}`,
      '',
      `Action Required: Add ${applicationRecord.email} in Selar Dashboard -> Affiliates (50%).`,
      'Selar will email their custom affiliate links automatically.',
    ].join('\n');

    sendNotificationEmail(ADMIN_EMAIL, emailSubject, emailBody, true).catch(err => {
      console.warn('[AffiliateApply] Admin email backup notice:', err?.message);
    });

    // 4. Dispatch real-time Admin WhatsApp Alert
    const adminMessage =
      `💎 *NEW AFFILIATE PARTNER APPLICATION*\n\n` +
      `👤 *Partner Name:* ${applicationRecord.name}\n` +
      `📞 *Phone / WhatsApp:* ${applicationRecord.phone}\n` +
      `✉️ *Selar Email:* ${applicationRecord.email}\n` +
      `📢 *Channel:* ${applicationRecord.platform}\n` +
      `📊 *Audience / Level:* ${applicationRecord.audience_size}\n` +
      `🕒 *Time:* ${new Date().toLocaleTimeString()} WAT\n\n` +
      `⚡ *Action:* Add ${applicationRecord.email} in Selar Dashboard → Affiliates (50%). Selar will email their link automatically (applicant was guided not to message you).`;

    // Non-blocking notification dispatch
    sendAdminWhatsAppNotification(adminMessage).catch(err => {
      console.warn('[AffiliateApply] Admin notification non-critical notice:', err?.message);
    });

    return NextResponse.json({
      success: true,
      savedToCloud,
      message: 'Application staged successfully. Once added in Selar, your links will arrive by email.',
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
