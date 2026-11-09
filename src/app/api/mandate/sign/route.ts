import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

const LOCAL_DB = path.join(process.cwd(), 'local_db');
if (!fs.existsSync(LOCAL_DB)) fs.mkdirSync(LOCAL_DB, { recursive: true });

const SIGNED_MANDATES_PATH = path.join(LOCAL_DB, 'signed_mandates.json');
const VPS_SEND_URL = process.env.EVOLUTION_SEND_URL || 'http://169.58.182.92:8085/send';
const VPS_API_KEY = process.env.EVOLUTION_API_KEY || 'evolution_bethelmind_secret_2026';
const ADMIN_PHONE = '2348022791227';

// Supabase Cloud Client for persistent cross-cloud storage (survives Vercel serverless cold starts)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://rcaamfaqkxvgbjlfuhki.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjYWFtZmFxa3h2Z2JqbGZ1aGtpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzUyNDI0OCwiZXhwIjoyMTAzMTAwMjQ4fQ.9KKQ52VdE8b-jxy2QmOAAxuBMKpGyncwDDEyMGfe9fw';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false }
});

function getLocalStoredMandates(): any[] {
  try {
    if (fs.existsSync(SIGNED_MANDATES_PATH)) {
      const data = JSON.parse(fs.readFileSync(SIGNED_MANDATES_PATH, 'utf8'));
      return Array.isArray(data) ? data : [];
    }
  } catch (_) {}
  return [];
}

function saveLocalStoredMandates(mandates: any[]) {
  try {
    fs.writeFileSync(SIGNED_MANDATES_PATH, JSON.stringify(mandates, null, 2), 'utf8');
  } catch (e: any) {
    console.error('Error saving signed mandates locally:', e.message);
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const ref = (url.searchParams.get('ref') || '').trim();

    if (!ref) {
      // Return recent mandates (first local, fallback to cloud)
      const localMandates = getLocalStoredMandates();
      if (localMandates.length > 0) {
        return NextResponse.json({ success: true, count: localMandates.length, mandates: localMandates });
      }

      const { data: cloudLeads } = await supabase
        .from('leads')
        .select('*')
        .eq('category', 'SIGNED_MANDATE')
        .order('created_at', { ascending: false })
        .limit(50);

      const parsed = (cloudLeads || []).map(r => {
        try { return JSON.parse(r.notes || '{}'); } catch (_) { return null; }
      }).filter(Boolean);

      return NextResponse.json({ success: true, count: parsed.length, mandates: parsed });
    }

    // 1. Try Local Storage first
    const localMandates = getLocalStoredMandates();
    const foundLocal = localMandates.find(m => m.mandate_ref.toLowerCase() === ref.toLowerCase());
    if (foundLocal) {
      return NextResponse.json({ success: true, mandate: foundLocal, source: 'local_cache' });
    }

    // 2. Try Supabase Cloud (Critical for Vercel Serverless instances)
    const { data: cloudRow, error: cloudErr } = await supabase
      .from('leads')
      .select('*')
      .eq('lead_id', ref)
      .eq('category', 'SIGNED_MANDATE')
      .single();

    if (!cloudErr && cloudRow && cloudRow.notes) {
      try {
        const cloudMandate = JSON.parse(cloudRow.notes);
        // Cache locally for faster subsequent hits
        localMandates.unshift(cloudMandate);
        saveLocalStoredMandates(localMandates);
        return NextResponse.json({ success: true, mandate: cloudMandate, source: 'cloud_db' });
      } catch (_) {}
    }

    return NextResponse.json({ success: false, error: 'Mandate reference not found in registry.' }, { status: 404 });
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
      deal_id = '',
      gate_access_protocol = 'Access pass generated upon confirmation',
      direct_mandate_warranted = true
    } = body;

    // Strict Input Validation & Length Bounds
    if (!agency_name || !contact_person || !phone) {
      return NextResponse.json({
        success: false,
        error: 'Please provide Agency Name, Lead Broker/Signatory Name, and Direct WhatsApp Phone.'
      }, { status: 400 });
    }

    if (!signature_data_url || typeof signature_data_url !== 'string' || !signature_data_url.startsWith('data:image/')) {
      return NextResponse.json({
        success: false,
        error: 'A valid electronic signature is strictly required under Section 84 Evidence Act 2011.'
      }, { status: 400 });
    }

    const cleanAgency = String(agency_name).trim().slice(0, 150);
    const cleanSignatory = String(contact_person).trim().slice(0, 100);
    const rawPhone = String(phone).replace(/\D/g, '');
    const cleanPhone = rawPhone.startsWith('0') ? `234${rawPhone.slice(1)}` : rawPhone;
    
    if (cleanPhone.length < 10 || cleanPhone.length > 15) {
      return NextResponse.json({
        success: false,
        error: 'Please enter a valid Nigerian mobile phone number (11 digits).'
      }, { status: 400 });
    }

    // Capture Forensic Digital Headers for Section 84 Compliance
    const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                      req.headers.get('cf-connecting-ip') || 
                      req.headers.get('x-real-ip') || 
                      '127.0.0.1';
    const userAgent = req.headers.get('user-agent')?.slice(0, 200) || 'Unknown Browser';

    const timestamp = new Date().toISOString();
    const randCode = Math.floor(1000 + Math.random() * 9000);
    const mandateRef = `BM-LASRERA-JIM-${Date.now().toString(36).toUpperCase()}-${randCode}`;

    // Section 84 Evidence Act Cryptographic SHA-256 Hash
    const hashData = `${mandateRef}|${cleanAgency}|${cleanSignatory}|${cleanPhone}|${property_title}|${ipAddress}|${timestamp}`;
    const evidenceHash = crypto.createHash('sha256').update(hashData).digest('hex');

    const newMandate = {
      mandate_ref: mandateRef,
      agency_name: cleanAgency,
      contact_person: cleanSignatory,
      phone: cleanPhone,
      email: String(email).trim().slice(0, 100),
      office_address: String(office_address).trim().slice(0, 250),
      property_title: String(property_title).trim().slice(0, 200),
      property_location: String(property_location).trim().slice(0, 200),
      asking_price: String(asking_price).trim().slice(0, 100),
      signature_data_url,
      mandate_type,
      deal_id,
      gate_access_protocol: String(gate_access_protocol).trim().slice(0, 250),
      direct_mandate_warranted: Boolean(direct_mandate_warranted),
      signed_at: timestamp,
      evidence_hash: evidenceHash,
      forensic_audit: {
        ip_address: ipAddress,
        user_agent: userAgent,
        evidence_act_section: 'Section 84 Evidence Act 2011 (Electronic Certificate of Integrity)',
        compliance_reg: 'Lagos State Real Estate Regulatory Authority (LASRERA) Law 2022'
      },
      cac_reg: 'Reg 9912717',
      settlement_bank: 'Moniepoint Microfinance Bank',
      settlement_account: '6805375225',
      settlement_account_name: 'Bethelmind Digital Solutions',
      commission_split: '80% Listing Broker / 20% Bethelmind Desk',
      non_circumvention_days: 180,
      dispute_resolution: 'Lagos Multi-Door Courthouse (LMDC) & Arbitration and Mediation Act 2023',
      statutory_clause: 'Executed under Lagos State Real Estate Regulatory Authority (LASRERA) Law 2022 & Section 84 Evidence Act 2011.'
    };

    // 1. Persist to Local DB
    const localMandates = getLocalStoredMandates();
    localMandates.unshift(newMandate);
    saveLocalStoredMandates(localMandates);

    // 2. Persist to Supabase Cloud (guarantees cross-instance Vercel survival)
    try {
      await supabase.from('leads').upsert({
        lead_id: mandateRef,
        source: 'mandate_portal',
        business_name: cleanAgency,
        name: cleanSignatory,
        phone: cleanPhone,
        phone_e164: `+${cleanPhone}`,
        email: newMandate.email,
        category: 'SIGNED_MANDATE',
        status: 'EXECUTED',
        lifecycle_stage: 'mandate_signed',
        notes: JSON.stringify(newMandate),
        area: newMandate.property_location,
        city: 'Lagos'
      }, { onConflict: 'lead_id' });
    } catch (e: any) {
      console.warn('⚠️ Non-fatal Supabase sync warning:', e.message);
    }

    // 3. Autonomous WhatsApp Alert to Admin Closer Desk (0802 279 1227) via VPS Line 1
    const waAlertMessage =
      `🏛️ *[NEW BILATERAL MANDATE EXECUTED]*\n\n` +
      `• *Partner Agency:* ${cleanAgency}\n` +
      `• *Principal Signatory:* ${cleanSignatory}\n` +
      `• *Direct Phone:* +${cleanPhone}\n` +
      `• *Asset Listing:* ${newMandate.property_title} (${newMandate.asking_price})\n` +
      `• *Location:* ${newMandate.property_location}\n` +
      `• *Mandate Reference:* ${mandateRef}\n` +
      `• *Access Protocol:* ${newMandate.gate_access_protocol}\n` +
      `• *Evidence Hash:* ${evidenceHash.slice(0, 16)}...\n` +
      `• *Statutory Split:* 80/20 Locked under LASRERA Law 2022\n\n` +
      `📜 *View Certificate:*\n` +
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

    const directChatText = encodeURIComponent(
      `Good day Tosin Oyelakin (Desk Principal) 🤝\n\nWe have electronically executed the LASRERA 80/20 Joint Inspection Memorandum (JIM) for ${cleanAgency} on "${newMandate.property_title}".\n\nMandate Ref: ${mandateRef}\nKindly confirm receipt and schedule our walkthrough.`
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
