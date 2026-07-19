// src/app/api/auth/meta/connect/route.ts
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getRuntimeConfig, saveLocalConfig } from '@/lib/localConfig';
import { getLocalChromePath } from '@/lib/browserLauncher';
import puppeteer from 'puppeteer-core';

// Global connection state
let activeBrowser: any = null;
let statusMessage = 'Ready';
let isConnecting = false;

async function runMetaAuthFlow() {
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

    console.log('[Meta Connect] Launching headed browser with path:', chromePath);
    activeBrowser = await puppeteer.launch({
      executablePath: chromePath,
      headless: false,
      defaultViewport: null, // Full window size
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const pages = await activeBrowser.pages();
    const page = pages[0] || (await activeBrowser.newPage());

    statusMessage = 'Waiting for user to log in and select WhatsApp Getting Started...';
    await page.goto('https://developers.facebook.com/apps/', { waitUntil: 'domcontentloaded' });

    // Poll page state every 1.5 seconds
    const maxPollAttempts = 200; // ~5 minutes max
    let attempts = 0;

    const pollInterval = setInterval(async () => {
      attempts++;
      if (attempts > maxPollAttempts) {
        clearInterval(pollInterval);
        statusMessage = 'Timed out waiting for login/extraction (5 minutes limit reached).';
        await cleanup();
        return;
      }

      try {
        const pagesList = await activeBrowser.pages();
        if (pagesList.length === 0) {
          clearInterval(pollInterval);
          statusMessage = 'Browser window was closed before setup completed.';
          await cleanup();
          return;
        }

        // Loop through all open tabs to find developers/business facebook
        for (const p of pagesList) {
          const url = p.url();
          if (url.includes('facebook.com') || url.includes('meta.com')) {
            // Check if banner is already injected
            const hasBanner = await p.evaluate(() => !!document.getElementById('apexreach-meta-banner')).catch(() => false);
            
            if (!hasBanner) {
              await p.evaluate(() => {
                const div = document.createElement('div');
                div.id = 'apexreach-meta-banner';
                div.style.position = 'fixed';
                div.style.top = '0';
                div.style.left = '0';
                div.style.width = '100%';
                div.style.backgroundColor = '#0f172a';
                div.style.color = '#f8fafc';
                div.style.padding = '14px 24px';
                div.style.zIndex = '2147483647'; // Max z-index
                div.style.display = 'flex';
                div.style.justifyContent = 'space-between';
                div.style.alignItems = 'center';
                div.style.boxShadow = '0 6px 30px rgba(0,0,0,0.6)';
                div.style.borderBottom = '3px solid #06b6d4';
                div.style.fontFamily = 'system-ui, -apple-system, sans-serif';
                div.style.fontSize = '14px';
                div.style.boxSizing = 'border-box';

                div.innerHTML = `
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 24px; animation: pulse 2s infinite;">🤖</span>
                    <div>
                      <strong style="color: #06b6d4;">Bethelmind Analytics & Strategy Meta Linker</strong> — 
                      <span id="apexreach-instruction">Please select your App, then go to <strong>WhatsApp > Getting Started</strong> (or <strong>Business Settings > System Users</strong> for permanent tokens).</span>
                    </div>
                  </div>
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <div id="apexreach-detected-status" style="font-size: 12px; color: #94a3b8;"></div>
                    <button id="apexreach-link-btn" onclick="this.setAttribute('data-action', 'link'); this.innerText='Extracting...';" style="background: linear-gradient(135deg, #1877f2 0%, #06b6d4 100%); color: white; border: none; padding: 8px 20px; border-radius: 6px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3); transition: all 0.2s;">
                      Extract Credentials
                    </button>
                  </div>
                `;

                // Add CSS animation
                const style = document.createElement('style');
                style.innerHTML = `
                  @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                    100% { transform: scale(1); }
                  }
                `;
                document.head.appendChild(style);

                document.body.appendChild(div);
                document.body.style.marginTop = '70px';
              }).catch(() => {});
            }

            // Check if user clicked the "Extract Credentials" button
            const actionClicked = await p.evaluate(() => {
              const btn = document.getElementById('apexreach-link-btn');
              return btn ? btn.getAttribute('data-action') === 'link' : false;
            }).catch(() => false);

            if (actionClicked) {
              // Reset the click attribute so we don't repeat the action
              await p.evaluate(() => {
                const btn = document.getElementById('apexreach-link-btn');
                if (btn) btn.removeAttribute('data-action');
              }).catch(() => {});

              // Run extraction script on the page
              const credentials = await p.evaluate(() => {
                // 1. Search for token: EAAB... (length > 80) preferred, fallback to EAA... (length > 50)
                let token = '';
                const inputs = Array.from(document.querySelectorAll('input, textarea'));
                
                // First pass: look for EAAB... with length > 80
                for (const el of inputs) {
                  const val = ((el as any).value || '').trim();
                  if (val.startsWith('EAAB') && val.length > 80) {
                    token = val;
                    break;
                  }
                }
                
                if (!token) {
                  const codeElements = Array.from(document.querySelectorAll('code, pre, span, div, p, td'));
                  for (const el of codeElements) {
                    const txt = (el.textContent || '').trim();
                    if (txt.startsWith('EAAB') && txt.length > 80) {
                      token = txt;
                      break;
                    }
                  }
                }

                // Second pass: fallback to EAA... with length > 50
                if (!token) {
                  for (const el of inputs) {
                    const val = ((el as any).value || '').trim();
                    if (val.startsWith('EAA') && val.length > 50) {
                      token = val;
                      break;
                    }
                  }
                }

                if (!token) {
                  const codeElements = Array.from(document.querySelectorAll('code, pre, span, div, p, td'));
                  for (const el of codeElements) {
                    const txt = (el.textContent || '').trim();
                    if (txt.startsWith('EAA') && txt.length > 50) {
                      token = txt;
                      break;
                    }
                  }
                }

                // 2. Search for Phone Number ID (15-16 digit numbers matching label coordinates or tags)
                let phoneId = '';
                const pageText = document.body.innerText;
                const numberMatches = pageText.match(/\b\d{15,16}\b/g) || [];
                
                const appIdMatch = window.location.href.match(/\/apps\/(\d+)\//);
                const appId = appIdMatch ? appIdMatch[1] : '';
                
                const filteredNumbers = numberMatches.filter(num => num !== appId);

                const allElements = Array.from(document.querySelectorAll('div, span, p, td, label'));
                
                // Search specifically for elements labeling Phone Number ID or Business Account ID
                const idLabelEl = allElements.find(el => {
                  const t = (el.textContent || '').trim().toLowerCase();
                  return (t.includes('phone number id') || t.includes('whatsapp business account id')) && !t.includes('enter');
                });

                if (idLabelEl) {
                  // Try to grab 15-16 digit number in sibling or parent containers
                  const parentText = idLabelEl.parentElement?.innerText || '';
                  const match = parentText.match(/\b\d{15,16}\b/);
                  if (match && match[0] !== appId) {
                    phoneId = match[0];
                  }
                }

                if (!phoneId) {
                  // Try to find the closest number match next to the label
                  for (const el of allElements) {
                    const t = (el.textContent || '').trim().toLowerCase();
                    if ((t.includes('phone number id') || t.includes('whatsapp business account id')) && !t.includes('enter')) {
                      // Look at surrounding elements
                      let currentSibling = el.nextElementSibling;
                      while (currentSibling) {
                        const siblingText = (currentSibling.textContent || '').trim();
                        const match = siblingText.match(/\b\d{15,16}\b/);
                        if (match && match[0] !== appId) {
                          phoneId = match[0];
                          break;
                        }
                        currentSibling = currentSibling.nextElementSibling;
                      }
                      if (phoneId) break;
                    }
                  }
                }

                if (!phoneId && filteredNumbers.length > 0) {
                  phoneId = filteredNumbers[0];
                }

                return { token, phoneId };
              }).catch(() => null);

              if (credentials) {
                const { token, phoneId } = credentials;
                const config = getRuntimeConfig();
                const updates: any = {};

                if (token) {
                  updates.whatsappAccessToken = token;
                }
                if (phoneId) {
                  updates.whatsappPhoneNumberId = phoneId;
                }

                if (Object.keys(updates).length > 0) {
                  saveLocalConfig({
                    ...config,
                    ...updates
                  });
                }

                // Determine message to show on the banner
                let bannerHTML = '';
                let isComplete = false;

                if (token && phoneId) {
                  bannerHTML = `<div style="color: #10b981; font-weight: bold; font-size: 15px;">✓ Token & Phone Number ID successfully linked! Closing browser...</div>`;
                  statusMessage = 'Success! Credentials successfully saved.';
                  isComplete = true;
                } else if (token) {
                  bannerHTML = `
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <span style="color: #10b981; font-weight: bold;">✓ Access Token Saved!</span> 
                      <span style="color: #94a3b8; font-size: 13px;">Please go to <strong>WhatsApp > Getting Started</strong> to extract the Phone Number ID.</span>
                    </div>
                  `;
                  statusMessage = 'Access Token saved, waiting for Phone Number ID...';
                } else if (phoneId) {
                  bannerHTML = `
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <span style="color: #10b981; font-weight: bold;">✓ Phone Number ID Saved!</span> 
                      <span style="color: #94a3b8; font-size: 13px;">Please copy/generate your Access Token (e.g. System User Token).</span>
                    </div>
                  `;
                  statusMessage = 'Phone Number ID saved, waiting for Access Token...';
                } else {
                  bannerHTML = `
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <span style="color: #ef4444; font-weight: bold;">✗ No Credentials Detected.</span> 
                      <span style="color: #94a3b8; font-size: 13px;">Make sure you are on the WhatsApp Getting Started page or Business Settings.</span>
                    </div>
                  `;
                }

                // Update the banner with status
                await p.evaluate((html: string, completed: boolean) => {
                  const statusEl = document.getElementById('apexreach-detected-status');
                  const btn = document.getElementById('apexreach-link-btn') as HTMLButtonElement;
                  if (statusEl) statusEl.innerHTML = html;
                  if (btn) {
                    if (completed) {
                      btn.style.display = 'none';
                    } else {
                      btn.innerText = 'Extract Credentials';
                    }
                  }
                }, bannerHTML, isComplete).catch(() => {});

                if (isComplete) {
                  clearInterval(pollInterval);
                  setTimeout(async () => {
                    await cleanup();
                  }, 1500);
                  return;
                }
              }
            }
          }
        }
      } catch (err: any) {
        console.error('[Meta Connect] Error in polling loop:', err.message);
      }
    }, 1500);

  } catch (err: any) {
    console.error('[Meta Connect] Flow failed:', err);
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
    const hasCredentials = !!config.whatsappAccessToken && !!config.whatsappPhoneNumberId;
    return NextResponse.json({
      connected: hasCredentials && statusMessage.startsWith('Success'),
      status: statusMessage,
      isConnecting
    });
  }

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Facebook Meta WhatsApp Connect</title>
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
      font-size: 2.2rem;
      font-weight: 800;
      margin-bottom: 8px;
      background: linear-gradient(135deg, #1877f2 0%, #06b6d4 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    p {
      color: #94a3b8;
      font-size: 1rem;
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
      font-size: 1.1rem;
      font-weight: 600;
      color: #e2e8f0;
    }
    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid rgba(6, 182, 212, 0.1);
      border-top: 4px solid #06b6d4;
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
      background: linear-gradient(135deg, #1877f2 0%, #06b6d4 100%);
      border: none;
      color: white;
      padding: 14px 28px;
      font-size: 1.1rem;
      font-weight: 600;
      border-radius: 14px;
      cursor: pointer;
      transition: all 0.3s ease;
      width: 100%;
      box-shadow: 0 4px 14px rgba(6, 182, 212, 0.3);
    }
    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(6, 182, 212, 0.4);
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
      background: radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, rgba(59, 130, 246, 0) 70%);
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
    <h1>Meta WhatsApp</h1>
    <p id="description">We will open a browser window to link your Meta developer account. Natively configure your WhatsApp app, and we'll automatically capture your credentials.</p>
    
    <div id="loader" class="spinner" style="display: none;"></div>
    <div id="success" class="success-icon">✓</div>

    <div class="status-box">
      <div class="status-title">Connection Status</div>
      <div id="statusText" class="status-text">Ready to Connect</div>
    </div>

    <button id="connectBtn" class="btn" onclick="startConnection()">Open Meta Developer Portal</button>
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
      desc.innerHTML = 'A Google Chrome window has been opened. Please log in and navigate to your WhatsApp Getting Started tab. <br/><br/>Click <strong>Extract Credentials</strong> on the floating banner inside that window when ready.';

      try {
        const resp = await fetch('/api/auth/meta/connect?action=start', { method: 'POST' });
        const data = await resp.json();
        if (data.error) {
          document.getElementById('statusText').innerText = data.error;
          btn.disabled = false;
          btn.innerText = 'Try Again';
          loader.style.display = 'none';
          return;
        }
        
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
        const resp = await fetch('/api/auth/meta/connect?action=status');
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
      desc.innerText = 'Successfully authenticated and linked WhatsApp Meta credentials! You can now close this tab and return to the settings panel.';
      
      btn.disabled = false;
      btn.innerText = 'Close Connection';
      btn.onclick = () => {
        window.close();
      };

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
  let action = searchParams.get('action');

  if (!action) {
    try {
      const body = await req.json();
      action = body?.action || null;
    } catch (e) {
      // Ignore body parser errors
    }
  }

  if (action === 'start') {
    if (isConnecting) {
      return NextResponse.json({ error: 'Connection helper is already running.' }, { status: 400 });
    }
    
    runMetaAuthFlow().catch(console.error);

    return NextResponse.json({ success: true, message: 'Browser launched successfully' });
  }

  if (action === 'stop') {
    await cleanup();
    statusMessage = 'Stopped';
    return NextResponse.json({ success: true, message: 'Browser stopped and cleaned up' });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
