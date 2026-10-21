import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const SESSION_FILE = path.join(process.cwd(), 'data', 'nairaland_session.json');

export async function GET(req: NextRequest) {
  try {
    const hasSession = fs.existsSync(SESSION_FILE);
    let sessionData = null;
    let username = null;
    let lastActive = null;

    if (hasSession) {
      try {
        const raw = fs.readFileSync(SESSION_FILE, 'utf8');
        sessionData = JSON.parse(raw);
        username = sessionData.username || 'Active User';
        lastActive = sessionData.savedAt || new Date().toISOString();
      } catch (e) {
        // Corrupted session
      }
    }

    return NextResponse.json({
      success: true,
      authenticated: !!hasSession && !!sessionData,
      username: username,
      lastActive: lastActive,
      campaigns: [
        { id: 'solar-boq', title: 'Solar & Renewable Energy BOQ Load Sizer', board: 'Investment (#9)' },
        { id: 'tokunbo-duty', title: 'Tokunbo VIN Customs Duty & Port Landing Sizer', board: 'Car (#2)' },
        { id: 'salon-booking', title: 'Salon & Spa 24/7 Booking Engine', board: 'Fashion (#14)' },
        { id: 'restaurant-order', title: 'Restaurant Direct Food Order (0% Commission)', board: 'Food (#38)' },
        { id: 'school-portal', title: 'Private School Term Tuition & Result PIN Portal', board: 'Education (#19)' },
      ]
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, campaignId, sessionData } = body;

    // 1. Manually import / paste session cookies
    if (action === 'save_session' && sessionData) {
      const dir = path.dirname(SESSION_FILE);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(SESSION_FILE, typeof sessionData === 'string' ? sessionData : JSON.stringify(sessionData, null, 2), 'utf8');
      return NextResponse.json({ success: true, message: 'Session cookies successfully saved!' });
    }

    // Serverless guard: background browser bots must run on VPS, not Vercel serverless
    if (process.env.VERCEL) {
      return NextResponse.json({
        success: true,
        message: 'Nairaland background worker is sovereignly dispatched and managed on Contabo VPS.'
      });
    }

    // 2. Trigger Autonomous Post
    if (action === 'post') {
      const campaign = campaignId || 'solar-boq';
      const scriptParts = ['scripts', 'nairaland_autonomous_engine.js'];
      const scriptPath = path.resolve(process.cwd(), ...scriptParts);

      // Spawn background worker
      const child = spawn('node', [scriptPath, '--post', `--campaign=${campaign}`], {
        detached: true,
        stdio: 'ignore'
      });
      child.unref();

      return NextResponse.json({
        success: true,
        message: `Autonomous post initiated for campaign: ${campaign}. The Playwright worker is running in the background.`,
        pid: child.pid
      });
    }

    // 3. Trigger Autonomous Bump
    if (action === 'bump') {
      const scriptParts = ['scripts', 'nairaland_autonomous_engine.js'];
      const scriptPath = path.resolve(process.cwd(), ...scriptParts);

      const child = spawn('node', [scriptPath, '--bump'], {
        detached: true,
        stdio: 'ignore'
      });
      child.unref();

      return NextResponse.json({
        success: true,
        message: 'Autonomous thread bumper initiated. Actively checking and bumping published threads.',
        pid: child.pid
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid action specified.' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
