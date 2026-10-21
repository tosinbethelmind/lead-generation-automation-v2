import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const SESSION_FILE = path.join(process.cwd(), 'local_db', 'nairaland_session.json');
const CAMPAIGNS_LEDGER = path.join(process.cwd(), 'local_db', 'nairaland_campaigns.json');

export async function GET() {
  try {
    const hasSession = fs.existsSync(SESSION_FILE);
    let ledger = { threads: [], stats: { totalPosted: 0, totalBumps: 0 } };

    if (fs.existsSync(CAMPAIGNS_LEDGER)) {
      try {
        ledger = JSON.parse(fs.readFileSync(CAMPAIGNS_LEDGER, 'utf8'));
      } catch (e) {
        console.error('Error reading nairaland ledger:', e);
      }
    }

    return NextResponse.json({
      success: true,
      authenticated: hasSession,
      stats: ledger.stats || { totalPosted: 0, totalBumps: 0 },
      threadsCount: (ledger.threads || []).length,
      threads: ledger.threads || [],
      availableCampaigns: [
        { id: 'solar-boq', title: 'Solar & Inverter BOQ Load Sizer', board: 'Properties (#14)' },
        { id: 'tokunbo-duty', title: 'Tokunbo Customs Duty & Port Landing Sizer', board: 'Auto (#23)' },
        { id: 'salon-booking', title: 'Salon & Spa 24/7 Booking & Deposit Lock', board: 'Fashion & Beauty (#37)' },
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

    // 2. Trigger Autonomous Post
    if (action === 'post') {
      const campaign = campaignId || 'solar-boq';
      const scriptPath = path.join(process.cwd(), 'scripts', 'nairaland_autonomous_engine.js');

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
      const scriptPath = path.join(process.cwd(), 'scripts', 'nairaland_autonomous_engine.js');

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
