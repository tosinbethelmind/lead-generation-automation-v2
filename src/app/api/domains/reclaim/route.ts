import { NextRequest, NextResponse } from 'next/server';
import dns from 'dns';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

/**
 * @file src/app/api/domains/reclaim/route.ts
 * 
 * Inbound Domain Reclaim & Buyout Webhook / Form API.
 * Receives official reinstatement inquiries from business owners and alerts the Closer Desk instantly.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { domain, requesterName, requesterPhone, requesterEmail, offerAmountNGN, notes } = body;

    if (!domain || !requesterPhone) {
      return NextResponse.json({ success: false, error: 'Domain and contact phone are required' }, { status: 400 });
    }

    console.log(`[DomainReclaim API] 📥 Received Reclaim Inquiry for ${domain} from ${requesterName || 'Owner'} (${requesterPhone})`);

    // Record inquiry in local_db
    const inquiriesDbPath = path.join(process.cwd(), 'local_db', 'domain_inquiries.json');
    let inquiriesList: any[] = [];
    try {
      if (fs.existsSync(inquiriesDbPath)) {
        inquiriesList = JSON.parse(fs.readFileSync(inquiriesDbPath, 'utf8'));
      }
    } catch (_) {}

    const record = {
      domain,
      requesterName: requesterName || 'Previous Management / Owner',
      requesterPhone,
      requesterEmail: requesterEmail || 'Not Provided',
      offerAmountNGN: offerAmountNGN || 'Standard Transfer Fee',
      notes: notes || '',
      receivedAt: new Date().toISOString(),
      status: 'PENDING_OFFER_REVIEW'
    };

    inquiriesList.push(record);
    try {
      fs.writeFileSync(inquiriesDbPath, JSON.stringify(inquiriesList, null, 2));
    } catch (_) {}

    // Send instant priority email alert to Admin Desk
    let config: any = {};
    try {
      config = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'config.json'), 'utf8'));
    } catch (_) {}

    if (dns.setDefaultResultOrder) {
      dns.setDefaultResultOrder('ipv4first');
    }

    const host = config.smtpHost || 'smtp.hostinger.com';
    const port = config.smtpPort || 587;
    const user = config.smtpUser || 'tosin@bethelmindanalytics.com';
    const pass = config.smtpPass || 'Bethelmind@2026';

    const sendEmailPromise = new Promise((resolve) => {
      dns.lookup(host, { family: 4 }, async (err, address) => {
        const resolvedHost = (!err && address) ? address : 'smtp.hostinger.com';
        const transporter = nodemailer.createTransport({
          host: resolvedHost,
          port: 587,
          secure: false,
          auth: { user, pass },
          tls: { servername: host, rejectUnauthorized: false },
          connectionTimeout: 10000
        });

        const mailHtml = `
          <div style="font-family: Arial, sans-serif; background: #0f172a; color: #f8fafc; padding: 24px; border-radius: 10px; max-width: 600px;">
            <div style="background: #059669; padding: 12px 18px; border-radius: 6px; font-weight: bold; font-size: 16px; margin-bottom: 16px;">
              🎉 INBOUND DOMAIN REINSTATEMENT INQUIRY RECEIVED
            </div>
            <p style="font-size: 15px; margin-bottom: 16px;">The business owner has landed on the escrow page and submitted a direct reinstatement claim:</p>
            
            <table style="width: 100%; border-collapse: collapse; background: #1e293b; border-radius: 8px; overflow: hidden; margin-bottom: 20px;">
              <tr style="border-bottom: 1px solid #334155;">
                <td style="padding: 12px; color: #94a3b8;">Target Domain:</td>
                <td style="padding: 12px; font-weight: bold; color: #38bdf8; font-family: monospace;">${domain}</td>
              </tr>
              <tr style="border-bottom: 1px solid #334155;">
                <td style="padding: 12px; color: #94a3b8;">Owner / Contact:</td>
                <td style="padding: 12px; font-weight: bold; color: #ffffff;">${requesterName || 'Business Owner'}</td>
              </tr>
              <tr style="border-bottom: 1px solid #334155;">
                <td style="padding: 12px; color: #94a3b8;">Phone Number:</td>
                <td style="padding: 12px; font-weight: bold; color: #34d399;"><a href="tel:${requesterPhone}" style="color: #34d399;">${requesterPhone}</a></td>
              </tr>
              <tr style="border-bottom: 1px solid #334155;">
                <td style="padding: 12px; color: #94a3b8;">Email Address:</td>
                <td style="padding: 12px; color: #ffffff;">${requesterEmail || 'None'}</td>
              </tr>
              <tr>
                <td style="padding: 12px; color: #94a3b8;">Proposed Offer:</td>
                <td style="padding: 12px; font-weight: bold; color: #fbbf24;">${offerAmountNGN || 'Standard Fee (₦150k - ₦250k)'}</td>
              </tr>
            </table>

            <div style="text-align: center; margin-top: 20px;">
              <a href="https://wa.me/${requesterPhone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(requesterName || 'Management')},%20we%20received%20your%20reinstatement%20request%20for%20${encodeURIComponent(domain)}.%20We%20can%20process%20the%20transfer%20today." style="background: #10b981; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                💬 Open WhatsApp Chat with Owner
              </a>
            </div>
          </div>
        `;

        try {
          await transporter.sendMail({
            from: `"Bethelmind Domain Escrow" <${user}>`,
            to: 'bethelmindrecruit@gmail.com',
            subject: `🎉 INBOUND DEAL: Reclaim Request for ${domain} (${requesterPhone})`,
            html: mailHtml
          });
          resolve(true);
        } catch (_) {
          resolve(false);
        }
      });
    });

    await sendEmailPromise;

    return NextResponse.json({
      success: true,
      message: 'Inquiry submitted successfully. Our domain transfer team will contact you within 2 hours.'
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
