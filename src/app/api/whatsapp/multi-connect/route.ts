import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { getAppCwd } from '@/lib/getCwd';

export const dynamic = 'force-dynamic';

interface LineStatus {
  lineId: number;
  label: string;
  phone: string;
  status: 'connected' | 'qr' | 'connecting' | 'disconnected';
  qrCodeBase64?: string;
  lastActiveWat?: string;
}

const BAILEYS_URL = 'http://localhost:3007';

function getLagosTimeString(date: Date = new Date()): string {
  return date.toLocaleTimeString('en-NG', { timeZone: 'Africa/Lagos', hour12: true });
}

// Automatically ensure Baileys service is running
function ensureBaileysServiceRunning() {
  if (process.env.VERCEL) return;
  try {
    const cwd = getAppCwd();
    const scriptPath = path.join(cwd, 'scripts', 'whatsapp_baileys.js');
    if (fs.existsSync(scriptPath)) {
      const child = spawn('node', [scriptPath], {
        detached: true,
        stdio: 'ignore',
        shell: true
      });
      child.unref();
    }
  } catch (_) {}
}

export async function GET() {
  try {
    let serviceOnline = false;
    let serviceData: any = null;

    try {
      const resp = await fetch(`${BAILEYS_URL}/status`, {
        signal: AbortSignal.timeout(2000),
        headers: { 'Accept': 'application/json' }
      });
      if (resp.ok) {
        serviceOnline = true;
        serviceData = await resp.json();
      }
    } catch (_) {
      ensureBaileysServiceRunning();
    }

    // Default status for 3 Numbers
    const lines: LineStatus[] = [
      {
        lineId: 1,
        label: 'Line 1 (Outreach Line A)',
        phone: '+234 702 626 6946',
        status: serviceData?.status === 'connected' ? 'connected' : (serviceData?.status === 'qr' ? 'qr' : (serviceOnline ? 'connecting' : 'disconnected')),
        qrCodeBase64: serviceData?.qrCodeUrl || '',
        lastActiveWat: getLagosTimeString() + ' WAT'
      },
      {
        lineId: 2,
        label: 'Line 2 (Outreach Line B)',
        phone: '+234 904 605 0469',
        status: serviceData?.status === 'connected' ? 'connected' : (serviceData?.status === 'qr' ? 'qr' : 'disconnected'),
        qrCodeBase64: serviceData?.qrCodeUrl || '',
        lastActiveWat: getLagosTimeString() + ' WAT'
      }
    ];

    return NextResponse.json({
      success: true,
      serviceOnline,
      totalLines: 3,
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
    const { lineId, action } = body; // action: 'connect' | 'disconnect' | 'refresh'

    ensureBaileysServiceRunning();

    if (action === 'disconnect') {
      try {
        await fetch(`${BAILEYS_URL}/disconnect`, { method: 'POST' });
      } catch (_) {}
      return NextResponse.json({ success: true, message: `Line ${lineId} disconnected and session reset.` });
    }

    // Connect / Trigger QR Code generation
    let qrCodeBase64 = '';
    let status = 'qr';

    try {
      const resp = await fetch(`${BAILEYS_URL}/qr`, { signal: AbortSignal.timeout(3000) });
      if (resp.ok) {
        const data = await resp.json();
        qrCodeBase64 = data.qrCodeBase64 || '';
        status = data.status || 'qr';
      }
    } catch (_) {}

    return NextResponse.json({
      success: true,
      message: `Line ${lineId} QR Code generated. Scan with WhatsApp Business to pair.`,
      lineId,
      status,
      qrCodeBase64
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
