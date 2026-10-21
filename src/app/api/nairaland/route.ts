import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const LOCAL_SESSION_FILE = path.join(process.cwd(), 'local_db', 'nairaland_session.json');
const DATA_SESSION_FILE = path.join(process.cwd(), 'data', 'nairaland_session.json');

function getValidSession() {
  const candidates = [LOCAL_SESSION_FILE, DATA_SESSION_FILE];
  for (const filePath of candidates) {
    if (fs.existsSync(filePath)) {
      try {
        const raw = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(raw);
        const sessionCookie = data.cookies?.find((c: any) => c.name === 'session');
        if (sessionCookie && sessionCookie.value && sessionCookie.value !== '""' && sessionCookie.value.length > 5) {
          return {
            valid: true,
            username: data.username || 'Active Member',
            savedAt: data.savedAt || new Date().toISOString(),
            filePath,
            data
          };
        }
      } catch (e) {
        // Continue checking
      }
    }
  }
  return { valid: false, username: null, savedAt: null, filePath: LOCAL_SESSION_FILE, data: null };
}

export async function GET(req: NextRequest) {
  try {
    const session = getValidSession();

    return NextResponse.json({
      success: true,
      authenticated: session.valid,
      username: session.username,
      lastActive: session.savedAt,
      campaigns: [
        { id: 'solar-boq', title: 'Solar & Renewable Energy BOQ Load Sizer', board: 'Properties (#14)' },
        { id: 'tokunbo-duty', title: 'Tokunbo VIN Customs Duty & Port Landing Sizer', board: 'Auto (#23)' },
        { id: 'salon-booking', title: 'Salon & Spa 24/7 Booking Engine', board: 'Fashion & Beauty (#37)' },
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
    const { action, campaignId, sessionData, username, password } = body;

    // 1. Manually import / paste session cookies
    if (action === 'save_session' && sessionData) {
      let finalData: any;
      if (typeof sessionData === 'string') {
        const trimmed = sessionData.trim();
        if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
          try {
            const parsed = JSON.parse(trimmed);
            if (Array.isArray(parsed)) {
              finalData = { username: 'Active Member', savedAt: new Date().toISOString(), cookies: parsed, origins: [] };
            } else {
              finalData = parsed;
            }
          } catch {
            finalData = null;
          }
        }
        
        // If not JSON, check if it's a raw cookie string (e.g. session=xyz or xyz)
        if (!finalData) {
          let token = trimmed;
          if (token.includes('session=')) {
            const match = token.match(/session=([^;]+)/);
            if (match) token = match[1];
          }
          finalData = {
            username: 'Active Member',
            savedAt: new Date().toISOString(),
            cookies: [
              {
                name: 'session',
                value: token,
                domain: 'www.nairaland.com',
                path: '/',
                expires: -1,
                httpOnly: false,
                secure: false,
                sameSite: 'Lax'
              }
            ],
            origins: []
          };
        }
      } else {
        finalData = sessionData;
      }

      // Save to both locations
      for (const dest of [LOCAL_SESSION_FILE, DATA_SESSION_FILE]) {
        const dir = path.dirname(dest);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(dest, JSON.stringify(finalData, null, 2), 'utf8');
      }

      return NextResponse.json({ success: true, message: 'Nairaland session cookies saved permanently!' });
    }

    // 2. Clear Session / Disconnect
    if (action === 'logout' || action === 'clear_session') {
      for (const dest of [LOCAL_SESSION_FILE, DATA_SESSION_FILE]) {
        if (fs.existsSync(dest)) fs.unlinkSync(dest);
      }
      return NextResponse.json({ success: true, message: 'Session disconnected successfully.' });
    }

    // Serverless guard: background browser bots must run on VPS/laptop, not Vercel serverless
    if (process.env.VERCEL) {
      return NextResponse.json({
        success: true,
        message: 'Nairaland background engine runs sovereignly on local PC / Contabo VPS.'
      });
    }

    // 3. Launch Interactive Browser on Laptop Screen
    if (action === 'launch_browser') {
      const scriptParts = ['scripts', 'nairaland_autonomous_engine.js'];
      const scriptPath = path.resolve(process.cwd(), ...scriptParts);

      const child = spawn('node', [scriptPath, '--interactive-login'], {
        detached: true,
        stdio: 'ignore'
      });
      child.unref();

      return NextResponse.json({
        success: true,
        message: 'Interactive browser launched on your desktop screen! Please log into Nairaland.',
        pid: child.pid
      });
    }

    // 4. Direct Login with Username & Password
    if (action === 'login_with_credentials' && username && password) {
      const scriptParts = ['scripts', 'nairaland_autonomous_engine.js'];
      const scriptPath = path.resolve(process.cwd(), ...scriptParts);

      const child = spawn('node', [scriptPath, '--login', `--user=${username}`, `--pass=${password}`], {
        detached: true,
        stdio: 'ignore'
      });
      child.unref();

      return NextResponse.json({
        success: true,
        message: `Logging in as ${username}... Credentials passed to stealth Playwright worker.`,
        pid: child.pid
      });
    }

    // 5. Trigger Autonomous Post
    if (action === 'post') {
      const campaign = campaignId || 'solar-boq';
      const scriptParts = ['scripts', 'nairaland_autonomous_engine.js'];
      const scriptPath = path.resolve(process.cwd(), ...scriptParts);

      const child = spawn('node', [scriptPath, '--post', `--campaign=${campaign}`], {
        detached: true,
        stdio: 'ignore'
      });
      child.unref();

      return NextResponse.json({
        success: true,
        message: `Autonomous post initiated for campaign: ${campaign}. Playwright worker is running in the background.`,
        pid: child.pid
      });
    }

    // 6. Trigger Autonomous Bump
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
