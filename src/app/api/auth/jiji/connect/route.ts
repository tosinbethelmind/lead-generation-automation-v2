// src/app/api/auth/jiji/connect/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getRuntimeConfig, saveLocalConfig } from '@/lib/localConfig';
import { getLocalChromePath } from '@/lib/browserLauncher';
import puppeteer from 'puppeteer-core';

// Global variables persisting in the dev server process
let activeBrowser: any = null;
let statusMessage = 'Ready';
let isConnecting = false;

async function runJijiAuthFlow() {
  if (isConnecting) return;
  isConnecting = true;
  statusMessage = 'Launching browser...';

  try {
    const chromePath = getLocalChromePath();
    if (!chromePath) {
      statusMessage = 'Error: Chrome/Edge executable not found on host machine.';
      isConnecting = false;
      return;
    }

    console.log('[Jiji Connect] Launching headed browser with path:', chromePath);
    activeBrowser = await puppeteer.launch({
      executablePath: chromePath,
      headless: false,
      defaultViewport: null, // Let it use full window size
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const pages = await activeBrowser.pages();
    const page = pages[0] || (await activeBrowser.newPage());
    
    statusMessage = 'Waiting for user to log in on Jiji...';
    await page.goto('https://jiji.ng/login.html', { waitUntil: 'domcontentloaded' });

    // Poll page state every 2 seconds to check if they are logged in
    const maxPollAttempts = 150; // 5 minutes max
    let attempts = 0;

    const pollInterval = setInterval(async () => {
      attempts++;
      if (attempts > maxPollAttempts) {
        clearInterval(pollInterval);
        statusMessage = 'Timed out waiting for login (5 minutes limit reached).';
        await cleanup();
        return;
      }

      try {
        const pagesList = await activeBrowser.pages();
        if (pagesList.length === 0) {
          clearInterval(pollInterval);
          statusMessage = 'Browser window was closed before login completed.';
          await cleanup();
          return;
        }

        const currentPage = pagesList[0];
        const currentUrl = currentPage.url();

        // Check if logged in (url changes or profile element exists)
        const loggedIn = await currentPage.evaluate(() => {
          return document.body.innerText.toLowerCase().includes('sign out') ||
                 !!document.querySelector('a[href*="/logout"]') ||
                 !!document.querySelector('.b-header-profile') ||
                 !!document.querySelector('a[href*="/my-advertisement"]');
        });

        if (loggedIn) {
          clearInterval(pollInterval);
          statusMessage = 'Extracting session cookies...';
          
          // Get cookies
          const cookies = await currentPage.cookies();
          
          // Save cookies to configuration
          const config = getRuntimeConfig();
          saveLocalConfig({
            ...config,
            jijiCookies: JSON.stringify(cookies)
          });

          statusMessage = 'Success! Jiji cookies saved.';
          
          // Wait a second then close browser
          setTimeout(async () => {
            await cleanup();
          }, 1500);
        }
      } catch (err: any) {
        console.error('[Jiji Connect] Error in polling loop:', err.message);
        clearInterval(pollInterval);
        statusMessage = 'Browser window was closed or disconnected.';
        await cleanup();
      }
    }, 2000);

  } catch (err: any) {
    console.error('[Jiji Connect] Flow failed:', err);
    statusMessage = `Error: ${err.message}`;
    isConnecting = false;
  }
}

async function cleanup() {
  isConnecting = false;
  if (activeBrowser) {
    try {
      await activeBrowser.close();
    } catch (e) {}
    activeBrowser = null;
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action') || 'ui';

  if (action === 'status') {
    const config = getRuntimeConfig();
    const hasCookies = !!config.jijiCookies;
    return NextResponse.json({
      connected: hasCookies && statusMessage === 'Success! Jiji cookies saved.',
      status: statusMessage,
      isConnecting
    });
  }

  // Otherwise, render UI
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Jiji One-Click Connect</title>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js"></script>
  <style>
    body {
      margin: 0;
      padding: 0;
      background: #0f172a;
      color: #f8fafc;
      font-family: 'Outfit', sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      overflow: hidden;
    }
    .card {
      background: rgba(30, 41, 59, 0.7);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 24px;
      padding: 40px;
      width: 100%;
      max-width: 480px;
      text-align: center;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
      position: relative;
      z-index: 10;
    }
    h1 {
      font-size: 2.5rem;
      font-weight: 800;
      margin-bottom: 8px;
      background: linear-gradient(135deg, #38bdf8 0%, #3b82f6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    p {
      color: #94a3b8;
      font-size: 1.1rem;
      line-height: 1.6;
      margin-bottom: 30px;
    }
    .status-box {
      background: rgba(15, 23, 42, 0.6);
      border-radius: 16px;
      padding: 20px;
      margin-bottom: 30px;
      border: 1px solid rgba(255, 255, 255, 0.05);
    }
    .status-title {
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #64748b;
      margin-bottom: 8px;
    }
    .status-text {
      font-size: 1.2rem;
      font-weight: 600;
      color: #e2e8f0;
    }
    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid rgba(56, 189, 248, 0.1);
      border-top: 4px solid #38bdf8;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px;
    }
    .success-icon {
      width: 60px;
      height: 60px;
      background: #10b981;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 2rem;
      color: white;
      margin: 0 auto 20px;
      box-shadow: 0 0 20px rgba(16, 185, 129, 0.4);
      display: none;
    }
    .btn {
      background: linear-gradient(135deg, #38bdf8 0%, #3b82f6 100%);
      border: none;
      color: white;
      padding: 14px 28px;
      font-size: 1.1rem;
      font-weight: 600;
      border-radius: 14px;
      cursor: pointer;
      transition: all 0.3s ease;
      width: 100%;
      box-shadow: 0 4px 14px rgba(59, 130, 246, 0.3);
    }
    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
    }
    .btn:disabled {
      background: #334155;
      color: #64748b;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .bg-glow {
      position: absolute;
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, rgba(56, 189, 248, 0.08) 0%, rgba(59, 130, 246, 0) 70%);
      border-radius: 50%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 1;
    }
  </style>
</head>
<body>
  <div class="bg-glow"></div>
  <div class="card">
    <h1>Jiji Connect</h1>
    <p id="description">We will open a browser window for you to log in. We will capture the session cookies automatically once done.</p>
    
    <div id="loader" class="spinner" style="display: none;"></div>
    <div id="success" class="success-icon">✓</div>

    <div class="status-box">
      <div class="status-title">Connection Status</div>
      <div id="statusText" class="status-text">Ready to Connect</div>
    </div>

    <button id="connectBtn" class="btn" onclick="startConnection()">Open Chrome & Login</button>
  </div>

  <script>
    let intervalId = null;

    async function startConnection() {
      const btn = document.getElementById('connectBtn');
      const loader = document.getElementById('loader');
      const desc = document.getElementById('description');
      
      btn.disabled = true;
      btn.innerText = 'Connecting...';
      loader.style.display = 'block';
      desc.innerText = 'A Google Chrome window has been opened. Please complete your Jiji login there. Do not close this browser tab.';

      try {
        const resp = await fetch('/api/auth/jiji/connect?action=start', { method: 'POST' });
        const data = await resp.json();
        if (data.error) {
          document.getElementById('statusText').innerText = data.error;
          btn.disabled = false;
          btn.innerText = 'Try Again';
          loader.style.display = 'none';
          return;
        }
        
        // Start polling status
        intervalId = setInterval(checkStatus, 1500);
      } catch (err) {
        document.getElementById('statusText').innerText = 'Failed to launch auth helper: ' + err.message;
        btn.disabled = false;
        btn.innerText = 'Try Again';
        loader.style.display = 'none';
      }
    }

    async function checkStatus() {
      try {
        const resp = await fetch('/api/auth/jiji/connect?action=status');
        const data = await resp.json();
        
        document.getElementById('statusText').innerText = data.status;

        if (data.connected) {
          clearInterval(intervalId);
          onSuccess();
        } else if (!data.isConnecting && data.status.startsWith('Error')) {
          clearInterval(intervalId);
          onFailure(data.status);
        }
      } catch (err) {
        console.error('Status poll error:', err);
      }
    }

    function onSuccess() {
      const loader = document.getElementById('loader');
      const success = document.getElementById('success');
      const btn = document.getElementById('connectBtn');
      const desc = document.getElementById('description');

      loader.style.display = 'none';
      success.style.display = 'flex';
      desc.innerText = 'Successfully authenticated and linked Jiji profile! You can close this tab and return to the Setup panel.';
      
      btn.disabled = false;
      btn.innerText = 'Return to Setup';
      btn.onclick = () => {
        window.location.href = '/setup';
      };

      // Confetti splash!
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
    }

    function onFailure(msg) {
      const loader = document.getElementById('loader');
      const btn = document.getElementById('connectBtn');
      loader.style.display = 'none';
      btn.disabled = false;
      btn.innerText = 'Try Again';
      btn.onclick = startConnection;
    }
  </script>
</body>
</html>
  `;

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action');

  if (action === 'start') {
    if (isConnecting) {
      return NextResponse.json({ error: 'Connection helper is already running.' }, { status: 400 });
    }
    
    // Launch in background so we don't block the HTTP request
    runJijiAuthFlow().catch(console.error);

    return NextResponse.json({ success: true, message: 'Browser launched successfully' });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
