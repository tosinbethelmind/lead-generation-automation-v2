import { NextResponse } from 'next/server';
import * as path from 'path';
import * as fs from 'fs';

export const dynamic = 'force-dynamic';

interface LineStatus {
  lineId: number;
  label: string;
  phone: string;
  status: 'connected' | 'qr' | 'connecting' | 'disconnected';
  qrCodeBase64?: string;
  pairingCode?: string;
  lastActiveWat?: string;
}

const EVOLUTION_URL = 'http://localhost:8080';

function getLagosTimeString(date: Date = new Date()): string {
  return date.toLocaleTimeString('en-NG', { timeZone: 'Africa/Lagos', hour12: true });
}

const ALL_7_LINES = [
  { id: 1, label: 'Line 1: Admin / Closer Desk', phone: '+234 802 279 1227', phoneRaw: '2348022791227' },
  { id: 2, label: 'Line 2: Outreach Desk 1', phone: '+234 702 626 6946', phoneRaw: '2347026266946' },
  { id: 3, label: 'Line 3: Outreach Desk 2', phone: '+234 904 605 0469', phoneRaw: '2349046050469' },
  { id: 4, label: 'Line 4: Outreach Desk 3', phone: '+234 913 512 9625', phoneRaw: '2349135129625' },
  { id: 5, label: 'Line 5: Outreach Desk 4', phone: '+234 703 055 6877', phoneRaw: '2347030556877' },
  { id: 6, label: 'Line 6: Outreach Desk 5', phone: '+234 811 934 6518', phoneRaw: '2348119346518' },
  { id: 7, label: 'Line 7: Outreach Desk 6', phone: '+234 814 160 9564', phoneRaw: '2348141609564' }
];

function inspectLocalLine(lineNum: number, defaultPhone: string, label: string): LineStatus {
  const cwd = process.cwd();
  const dirName = `baileys_auth_line${lineNum}`;
  const credsFile = path.join(cwd, 'local_db', dirName, 'creds.json');

  let isConnected = false;
  let detectedPhone = defaultPhone;

  if (fs.existsSync(credsFile)) {
    try {
      const creds = JSON.parse(fs.readFileSync(credsFile, 'utf8'));
      if (creds && creds.registered === true && creds.me && creds.me.id) {
        const rawPhone = creds.me.id.split(':')[0].split('@')[0];
        detectedPhone = `+${rawPhone}`;
        isConnected = true;
      }
    } catch (_) {}
  }

  // Check registry backup
  if (!isConnected) {
    const regFile = path.join(cwd, 'local_db', 'whatsapp_lines_registry.json');
    if (fs.existsSync(regFile)) {
      try {
        const reg = JSON.parse(fs.readFileSync(regFile, 'utf8'));
        const entry = reg[`line_${lineNum}`];
        if (entry && entry.connected && entry.phone) {
          detectedPhone = `+${entry.phone}`;
          isConnected = true;
        }
      } catch (_) {}
    }
  }

  return {
    lineId: lineNum,
    label,
    phone: detectedPhone,
    status: isConnected ? 'connected' : 'disconnected',
    lastActiveWat: getLagosTimeString() + ' WAT'
  };
}

export async function GET() {
  try {
    let evolutionData: any = null;
    try {
      const evoRes = await fetch(`${EVOLUTION_URL}/status`, { cache: 'no-store', signal: AbortSignal.timeout(2000) });
      if (evoRes.ok) {
        evolutionData = await evoRes.json();
      }
    } catch (_) {}

    const lines: LineStatus[] = ALL_7_LINES.map(cfg => {
      const local = inspectLocalLine(cfg.id, cfg.phone, cfg.label);
      if (evolutionData?.instances) {
        const live = evolutionData.instances.find((i: any) => i.id === cfg.id);
        if (live) {
          if (live.state === 'open') {
            local.status = 'connected';
            if (live.phone) local.phone = `+${live.phone}`;
          } else if (live.state === 'connecting') {
            local.status = 'connecting';
          }
        }
      }
      return local;
    });

    return NextResponse.json({
      success: true,
      serviceOnline: !!evolutionData,
      totalLines: ALL_7_LINES.length,
      connectedCount: lines.filter(l => l.status === 'connected').length,
      lines,
      lastUpdated: getLagosTimeString() + ' WAT'
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { lineId, action, phone } = body; // action: 'connect' | 'disconnect' | 'pairing_code' | 'request_qr'

    if (action === 'pairing_code') {
      try {
        const targetPhone = phone || ALL_7_LINES.find(l => l.id === lineId)?.phoneRaw || '2348022791227';
        const resp = await fetch(`${EVOLUTION_URL}/instance/pairingCode/bethelmind_instance_${lineId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phoneNumber: targetPhone })
        });
        const data = await resp.json();
        return NextResponse.json({
          success: true,
          lineId,
          pairingCode: data.pairingCode,
          phone: data.phone,
          message: '8-digit pairing code generated successfully.'
        });
      } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
      }
    }

    if (action === 'request_qr' || action === 'connect') {
      try {
        const resp = await fetch(`${EVOLUTION_URL}/instance/request-qr/bethelmind_instance_${lineId}`, {
          method: 'POST'
        });
        const data = await resp.json();
        return NextResponse.json({
          success: true,
          lineId,
          status: 'qr',
          qrCodeBase64: data.qr || '',
          message: `Line ${lineId} live QR code generated.`
        });
      } catch (_) {}
    }

    return NextResponse.json({
      success: true,
      message: `Line ${lineId} ready for pairing on Port 8080.`,
      lineId,
      status: 'qr',
      pairingTip: `Open http://localhost:8080/pair/${lineId} for direct live pairing.`
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
