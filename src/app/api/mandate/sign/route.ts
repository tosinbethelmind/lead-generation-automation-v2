import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import axios from 'axios';

const LOCAL_DB = path.join(process.cwd(), 'local_db');
if (!fs.existsSync(LOCAL_DB)) fs.mkdirSync(LOCAL_DB, { recursive: true });

const SIGNED_MANDATES_PATH = path.join(LOCAL_DB, 'signed_mandates.json');
const VPS_SEND_URL = process.env.EVOLUTION_SEND_URL || 'http://169.58.182.92:8085/send';
const VPS_API_KEY = process.env.EVOLUTION_API_KEY || 'evolution_bethelmind_secret_2026';
const ADMIN_PHONE = '2348022791227';

function getStoredMandates(): any[] {
  try {
    if (fs.existsSync(SIGNED_MANDATES_PATH)) {
      const data = JSON.parse(fs.readFileSync(SIGNED_MANDATES_PATH, 'utf8'));
      return Array.isArray(data) ? data : [];
    }
  } catch (_) {}
  return [];
}

function saveStoredMandates(mandates: any[]) {
  try {
    fs.writeFileSync(SIGNED_MANDATES_PATH, JSON.stringify(mandates, null, 2), 'utf8');
  } catch (e: any) {
    console.error('Error saving signed mandates:', e.message);
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const ref = url.searchParams.get('ref') || '';
    const mandates = getStoredMandates();

    if (!ref) {
      return NextResponse.json({ success: true, count: mandates.length, mandates });
    }

    const found = mandates.find(m => m.mandate_ref.toLowerCase() === ref.toLowerCase());
    if (!found) {
      return NextResponse.json({ success: false, error: 'Mandate reference not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, mandate: found });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      agency_name,
      contact_person,
      phone,
      email = '',
      office_address = 'Lagos, Nigeria',
      property_title = 'Prime Luxury Lagos Mandate',
      property_location = 'Lekki / Ikoyi Corridor, Lagos',
      asking_price = 'Market Commercial Valuation',
      signature_data_url,
      mandate_type = 'DIRECT_LISTING',
      deal_id = ''
    } = body;

    if (!agency_name || !contact_person || !phone) {
      return NextResponse.json({
        success: false,
        error: 'Please provide Agency Name, Lead Broker/Signatory Name, and Direct WhatsApp Phone.'
      }, { status: 400 });
    }

    if (!signature_data_url || !signature_data_url.startsWith('data:image/')) {
      return NextResponse.json({
        success: false,
        error: 'A valid hand-drawn electronic signature is strictly required under Section 84 Evidence Act 2011.'
      }, { status: 400 });
    }

    const cleanPhone = phone.replace(/\D/g, '');
    const cleanAgency = agency_name.trim();
    const cleanSignatory = contact_person.trim();
    const timestamp = new Date().toISOString();
    const randCode = Math.floor(1000 + Math.random() * 9000);
    const mandateRef = `BM-LASRERA-JIM-${Date.now().toString(36).toUpperCase()}-${randCode}`;

    // Cryptographic Evidence Hash under Evidence Act 2011
    const hashData = `${mandateRef}|${cleanAgency}|${cleanSignatory}|${cleanPhone}|${property_title}|${timestamp}`;
    const evidenceHash = crypto.createHash('sha256').update(hashData).digest('hex');

    const newMandate = {
      mandate_ref: mandateRef,
      agency_name: cleanAgency,
      contact_person: cleanSignatory,
      phone: cleanPhone,
      email: email.trim(),
      office_address: office_address.trim(),
      property_title: property_title.trim(),
      property_location: property_location.trim(),
      asking_price: asking_price.trim(),
      signature_data_url,
      mandate_type,
      deal_id,
      signed_at: timestamp,
      evidence_hash: evidenceHash,
      cac_reg: 'Reg 9912717',
      settlement_bank: 'Moniepoint Microfinance Bank',
      settlement_account: '6805375225',
      settlement_account_name: 'Bethelmind Digital Solutions',
      commission_split: '80% Listing Broker / 20% Bethelmind Desk',
      statutory_clause: 'Executed under Lagos State Real Estate Regulatory Authority (LASRERA) Law 2022 & Section 84 Evidence Act 2011.'
    };

    const mandates = getStoredMandates();
    mandates.unshift(newMandate);
    saveStoredMandates(mandates);

    // ⚡ Autonomous Alert to Admin Closer Desk (0802 279 1227) via VPS Evolution API
    try {
      const waAlertMessage =
        `🏛️ *[NEW BILATERAL MANDATE EXECUTED]*\n\n` +
        `• *Partner Agency:* ${cleanAgency}\n` +
        `• *Principal Signatory:* ${cleanSignatory}\n` +
        `• *Direct Phone:* +${cleanPhone}\n` +
        `• *Asset Listing:* ${property_title} (${asking_price})\n` +
        `• *Location:* ${property_location}\n` +
        `• *Mandate Reference:* ${mandateRef}\n` +
        `• *Evidence Hash:* ${evidenceHash.slice(0, 16)}...\n` +
        `• *Statutory Split:* 80/20 Locked under LASRERA Law 2022\n\n` +
        `📜 *View Counter-Signed Certificate:*\n` +
        `https://www.bethelmindanalytics.com/mandate/print?ref=${mandateRef}\n\n` +
        `⚡ *Jump into WhatsApp:* wa.me/${cleanPhone}`;

      axios.post(VPS_SEND_URL, {
        phone: ADMIN_PHONE,
        message: waAlertMessage,
        isColdOutreach: false,
        lineId: 1
      }, {
        headers: {
          'apikey': VPS_API_KEY,
          'Content-Type': 'application/json'
        },
        timeout: 8000
      }).catch(e => console.warn('⚠️ WhatsApp admin notify non-fatal error:', e.message));
    } catch (_) {}

    const intlPhone = cleanPhone.startsWith('0') ? `234${cleanPhone.slice(1)}` : cleanPhone;
    const directChatText = encodeURIComponent(
      `Good day Tosin Oyelakin (Desk Principal) 🤝\n\nWe have electronically executed the LASRERA 80/20 Joint Inspection Memorandum (JIM) for ${cleanAgency} on "${property_title}".\n\nMandate Ref: ${mandateRef}\nKindly confirm receipt and schedule our walkthrough.`
    );
    const waHandshakeUrl = `https://wa.me/2348022791227?text=${directChatText}`;
    const printUrl = `/mandate/print?ref=${mandateRef}`;

    return NextResponse.json({
      success: true,
      message: 'Joint Inspection Memorandum successfully executed under LASRERA Law 2022.',
      mandate: newMandate,
      mandate_ref: mandateRef,
      evidence_hash: evidenceHash,
      print_url: printUrl,
      wa_handshake_url: waHandshakeUrl
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
